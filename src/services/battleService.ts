// src/services/battleService.ts

import { PrismaClient } from '@prisma/client';
import * as battleStateService from './battleStateService';
import * as combatService from './combatService';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import gameConfig from '../config/gameConfig'; 

const prisma = new PrismaClient();

const ENERGY_COSTS = {
  ATTACK: 2,
  DEFEND: 1,
  ABILITY: 3, 
};

/**
 * Orquestra a ação de ATAQUE.
 */
export const attack = async (userId: number) => {
  const battle = battleStateService.getActiveBattle(userId);
  if (!battle) throw new Error("Nenhuma batalha ativa encontrada.");

  // 1. Lógica de Negócio: Verificar energia
  if (battle.character.energy < gameConfig.costs.attack) {
    throw new BadRequestError("Energia insuficiente para atacar!");
  }
  battle.character.energy -= gameConfig.costs.attack;

  // 2. Delega o cálculo para o combatService
  const result = combatService.performAttack(battle.character);
  battle.monster.hp -= result.damageDealt;

  // 3. ✅ Persiste a nova energia no banco de dados
  await prisma.character.update({
    where: { id: battle.character.id },
    data: { energy: battle.character.energy },
  });

  // 4. Atualiza o estado da batalha na memória
  battleStateService.setActiveBattle(userId, battle);

  // 5. Retorna o estado atualizado com a mensagem do turno
  return { ...battle, turnResult: result.turnResult };
};


/**
 * Orquestra a ação de DEFESA.
 */
export const defend = async (userId: number) => {
  const battle = battleStateService.getActiveBattle(userId);
  if (!battle) throw new NotFoundError("Nenhuma batalha ativa encontrada.");

  // 1. Lógica de Negócio: Verificar energia
  if (battle.character.energy < gameConfig.costs.defend) {
    throw new BadRequestError("Energia insuficiente para defender!");
  }
  battle.character.energy -= gameConfig.costs.defend;

  // 2. Delega a lógica para o combatService
  const result = combatService.performDefense(battle.character);
  battle.character = result.updatedCharacter;

  // 3. ✅ Persiste a nova energia no banco de dados
  await prisma.character.update({
    where: { id: battle.character.id },
    data: { energy: battle.character.energy },
  });

  // 4. Atualiza o estado da batalha na memória
  battleStateService.setActiveBattle(userId, battle);

  // 5. Retorna o estado atualizado com a mensagem do turno
  return { ...battle, turnResult: result.turnResult };
};

/**
 * Orquestra a ação de USAR HABILIDADE.
 */
export const useSkill = async (userId: number) => {
  const battle = battleStateService.getActiveBattle(userId);
  if (!battle) throw new NotFoundError("Nenhuma batalha ativa encontrada.");

  // 1. Lógica de Negócio: Verificar energia
  if (battle.character.energy < gameConfig.costs.ability) {
    throw new BadRequestError("Energia insuficiente para usar a habilidade!");
  }
  battle.character.energy -= gameConfig.costs.ability;

  // 2. Delega a lógica da habilidade para o combatService
  const result = combatService.performSkill(battle.character, battle.monster);

  // 3. Atualiza o estado da batalha na memória com os resultados
  battle.character = result.updatedCharacter;
  battle.monster = result.updatedMonster;

  // 4. Persiste as mudanças (HP e Energia) no banco de dados
  await prisma.character.update({
    where: { id: battle.character.id },
    data: {
      hp: battle.character.hp,
      energy: battle.character.energy,
    },
  });

  // 5. Salva o estado final na memória
  battleStateService.setActiveBattle(userId, battle);

  // 6. Retorna o estado atualizado com a mensagem do turno
  return { ...battle, turnResult: result.turnResult };
};

/**
 * Inicia uma nova batalha, orquestrando a busca de dados e o salvamento do estado inicial.
 */
export const startBattle = async (userId: number, monsterId: number) => {
  // 1. Busca dados do banco (Personagem, Monstro, Primeira Pergunta)
  const character = await prisma.character.findFirst({
    where: { userId: userId },
    include: { class: true },
    orderBy: { id: 'desc' }
  });
  const monster = await prisma.monster.findUnique({ where: { id: monsterId } });
  const questionCount = await prisma.question.count();
  if (questionCount === 0) throw new NotFoundError('Nenhuma pergunta encontrada.');
  const skip = Math.floor(Math.random() * questionCount);
  const firstQuestion = await prisma.question.findFirst({ skip });

  if (!character || !monster || !firstQuestion || !character.class) {
    throw new BadRequestError('Dados insuficientes para iniciar a batalha.');
  }

  // 2. Monta o objeto de estado inicial da batalha
  const battleState = {
    battleId: Date.now(),
    character: {
      id: character.id,
      hp: character.hp,
      className: character.class.name,
      strength: character.class.strength || 5,
      intelligence: character.class.intelligence || 5,
    },
    monster: { id: monster.id, hp: monster.hp, dano: monster.dano, nome: monster.nome },
    currentQuestion: {
      id: firstQuestion.id,
      texto: firstQuestion.texto_pergunta,
      opcoes: [firstQuestion.opcao_a, firstQuestion.opcao_b, firstQuestion.opcao_c],
    },
    isFinished: false,
  };

  // 3. Usa o battleStateService para salvar o estado
  battleStateService.setActiveBattle(userId, battleState);

  return battleState;
};

/**
 * Processa a resposta do jogador, orquestrando o estado, a lógica de combate e o banco de dados.
 */
export const processAnswer = async (userId: number, battleId: number, questionId: number, answer: string) => {
  // 1. Obtém o estado atual da batalha
  const battle = battleStateService.getActiveBattle(userId);
  if (!battle || battle.battleId !== battleId || battle.isFinished) {
    throw new Error('Batalha inválida ou já finalizada.');
  }

  // 2. Busca a resposta correta no banco
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) throw new Error('Pergunta não encontrada.');
  const isCorrect = answer.trim().toUpperCase() === question.resposta_correta.trim().toUpperCase();

  // 3. Delega a lógica do turno para o combatService
  const turn = combatService.processAnswerTurn(battle, isCorrect);
  let updatedBattle = turn.updatedBattleState;
  let turnResult = turn.turnResult;

  // 4. Verifica se a batalha terminou
  if (updatedBattle.monster.hp <= 0) {
    updatedBattle.isFinished = true;
    turnResult += ' Você venceu a batalha!';
    await prisma.character.update({
      where: { id: updatedBattle.character.id },
      data: { xp: { increment: gameConfig.battle.xpWinReward } }, // Recompensa
    });
    battleStateService.removeActiveBattle(userId); // Limpa o estado
  } else if (updatedBattle.character.hp <= 0) {
    updatedBattle.isFinished = true;
    turnResult += ' Você foi derrotado.';
    battleStateService.removeActiveBattle(userId); // Limpa o estado
  }

  // 5. Se a batalha continuar, busca uma nova pergunta
  if (!updatedBattle.isFinished) {
    const questionCount = await prisma.question.count();
    const skip = Math.floor(Math.random() * questionCount);
    const nextQuestion = await prisma.question.findFirst({ skip: skip });
    if (!nextQuestion) throw new BadRequestError('Não foi possível carregar a próxima pergunta.');
    
    updatedBattle.currentQuestion = {
      id: nextQuestion.id,
      texto: nextQuestion.texto_pergunta,
      opcoes: [nextQuestion.opcao_a, nextQuestion.opcao_b, nextQuestion.opcao_c],
    };

    // Salva o novo estado da batalha
    battleStateService.setActiveBattle(userId, updatedBattle);
  }

  return { ...updatedBattle, turnResult };
};

// Exporta uma função do battleStateService para que o controller possa usá-la
export const getActiveBattle = (userId: number) => {
    return battleStateService.getActiveBattle(userId);
}