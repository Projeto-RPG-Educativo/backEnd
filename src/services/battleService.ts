import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const activeBattles: any = {};

const ENERGY_COSTS = {
  ATTACK: 2,
  DEFEND: 1,
  ABILITY: 3, // Usar uma habilidade de classe
  // Outros custos podem ser adicionados aqui
};

/**
 * Inicia uma nova batalha para um usuário, carregando os dados necessários do banco.
 */
export const startBattle = async (userId: number, monsterId: number) => {
  try {
    const character = await prisma.character.findFirst({
      where: { userId: userId },
      include: { class: true },
      orderBy: {
        id: 'desc' // Ordena por ID decrescente, pegando o personagem mais novo
      }
    });

    const monster = await prisma.monster.findUnique({ where: { id: monsterId } });

    if (!character || !monster || !character.class) {
      throw new Error('Personagem, monstro ou classe não encontrado.');
    }

    const questionCount = await prisma.question.count();
    if (questionCount === 0) {
      throw new Error('Nenhuma pergunta encontrada no banco de dados.');
    }
    const skip = Math.floor(Math.random() * questionCount);
    const firstQuestion = await prisma.question.findFirst({
      skip: skip,
    });

    if (!firstQuestion) {
      throw new Error('Nenhuma pergunta foi retornada do banco (findFirst).');
    }

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

    activeBattles[userId] = battleState;
    return battleState;

  } catch (error: any) {
    console.error('--- ERRO CRÍTICO NO startBattle SERVICE ---:', error.message);
    throw error;
  }
};

/**
 * Processa a resposta de um jogador, calcula o dano, e prepara o próximo turno.
 */
export const processAnswer = async (userId: number, battleId: number, questionId: number, answer: string) => {
  // Log 1: A função foi chamada? Com quais dados?
  console.log("\n\n--- [DEBUG] INÍCIO DO PROCESSANSWER ---");
  console.log(`[DEBUG] Recebido: userId=${userId}, questionId=${questionId}, answer="${answer}"`);

  try {
    const battle = activeBattles[userId];

    if (!battle || battle.battleId !== battleId || battle.isFinished) {
      throw new Error('Batalha inválida ou já finalizada.');
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      throw new Error('Pergunta não encontrada.');
    }

    // Log 2: Qual o estado da vida ANTES de qualquer cálculo?
    console.log(`[DEBUG] HP INICIAL -> Personagem: ${battle.character.hp}, Monstro: ${battle.monster.hp}`);

    let turnResult = '';
    const isCorrect = answer.trim().toUpperCase() === question.resposta_correta.trim().toUpperCase();

    // Log 3: Qual foi o resultado da verificação?
    console.log(`[DEBUG] A resposta está correta? ${isCorrect}`);

    if (isCorrect) {
      // Log 4a: Se a resposta for correta, temos certeza que entramos aqui?
      console.log("[DEBUG] Entrando no bloco IF (Resposta CORRETA)");

      //Restitui a energia ao acertar
      battle.character.energy += 10;

      let damageDealt = 0;
      switch (battle.character.className.toLowerCase()) {
        case 'tank':
        case 'lutador':
        case 'ladino':
        case 'paladino':
          damageDealt = battle.character.strength;
          break;
        case 'mago':
        case 'bardo':
          damageDealt = battle.character.intelligence;
          break;
        default:
          damageDealt = Math.max(battle.character.strength, battle.character.intelligence) || 5;
      }

      console.log(`[DEBUG] Dano a ser causado no monstro: ${damageDealt}`);
      battle.monster.hp -= damageDealt;
      turnResult = `Você acertou! O monstro sofreu ${damageDealt} de dano.`;

    } else {

      if (battle.character.isDefending) {
        turnResult = `Você errou, mas sua defesa bloqueou o dano do monstro!`;
        // Resetamos o status de defesa após ele ser usado
        battle.character.isDefending = false;
      } else {
        battle.character.hp -= battle.monster.dano;
        turnResult = `Você errou! O monstro te atacou e causou ${battle.monster.dano} de dano.`;
      }
      // Log 4b: Se a resposta for errada, temos certeza que entramos aqui?
      console.log("[DEBUG] Entrando no bloco ELSE (Resposta ERRADA)");
      console.log(`[DEBUG] Dano a ser recebido pelo personagem: ${battle.monster.dano}`);
      battle.character.hp -= battle.monster.dano;
      turnResult = `Você errou! O monstro te atacou e causou ${battle.monster.dano} de dano.`;
    }

    // Log 5: Qual o estado da vida DEPOIS dos cálculos?
    console.log(`[DEBUG] HP FINAL -> Personagem: ${battle.character.hp}, Monstro: ${battle.monster.hp}`);
    console.log("--- [DEBUG] FIM DO PROCESSANSWER ---\n\n");

    // O resto da função continua normalmente...
    if (battle.monster.hp <= 0) {
      battle.isFinished = true;
      turnResult += ' Você venceu a batalha!';
      await prisma.character.update({
        where: { id: battle.character.id },
        data: { xp: { increment: 50 } },
      });
    } else if (battle.character.hp <= 0) {
      battle.isFinished = true;
      turnResult += ' Você foi derrotado.';
      await prisma.character.update({
        where: { id: battle.character.id },
        data: { hp: 0 },
      });
    }

    if (!battle.isFinished) {
      const questionCount = await prisma.question.count();
      const skip = Math.floor(Math.random() * questionCount);
      const nextQuestion = await prisma.question.findFirst({ skip: skip });

      if (!nextQuestion) throw new Error('Não foi possível carregar a próxima pergunta.');

      battle.currentQuestion = {
        id: nextQuestion.id,
        texto: nextQuestion.texto_pergunta,
        opcoes: [nextQuestion.opcao_a, nextQuestion.opcao_b, nextQuestion.opcao_c],
      };
    } else {
      delete activeBattles[userId];
    }

    return { ...battle, turnResult };
  } catch (error: any) {
    console.error('--- ERRO CRÍTICO NO processAnswer SERVICE ---:', error.message);
    throw error;
  }
};

export const attack = async (userId: number, battleId: number) => {
  const battle = activeBattles[userId];

  if (!battle || battle.battleId !== battleId || battle.isFinished) {
    throw new Error('Batalha inválida ou já finalizada.');
  }

  // --- 1. Verificação de Energia ---
  if (battle.character.energy < ENERGY_COSTS.ATTACK) {
    return { ...battle, turnResult: "Energia insuficiente para atacar!" };
  }

  // --- 2. Gasto de Energia ---
  battle.character.energy -= ENERGY_COSTS.ATTACK;

  // --- 3. Lógica de Dano ---
  let damageDealt = 0;
  switch (battle.character.className.toLowerCase()) {
    case 'tank':
    case 'lutador':
    case 'ladino':
    case 'paladino':
      damageDealt = battle.character.strength;
      break;
    case 'mago':
    case 'bardo':
      damageDealt = battle.character.intelligence;
      break;
    default:
      damageDealt = Math.max(battle.character.strength, battle.character.intelligence) || 5;
  }

  battle.monster.hp -= damageDealt;
  let turnResult = `Você atacou! O monstro sofreu ${damageDealt} de dano. (-${ENERGY_COSTS.ATTACK} energia)`;

  // --- 4. Atualizar o Banco de Dados (Persistir o gasto de energia e o dano) ---
  await prisma.character.update({
    where: { id: battle.character.id },
    data: { energy: battle.character.energy }, // Apenas atualiza energia por enquanto
  });
  await prisma.monster.update({ // Este update é mais complexo, pode precisar ser reavaliado.
    where: { id: battle.monster.id },
    data: { hp: battle.monster.hp },
  });


  // --- 5. Verificação de Fim de Batalha (Simplificada para a ação) ---
  if (battle.monster.hp <= 0) {
    battle.isFinished = true;
    turnResult += ' Você venceu a batalha!';
    // Lógica para XP e recompensa pode ser adicionada aqui
    // No entanto, a atualização de XP geralmente acontece no processAnswer ou em uma função de final de batalha.
    await prisma.character.update({
      where: { id: battle.character.id },
      data: { xp: { increment: 50 } }, // Exemplo
    });
  }

  // Retorna o estado atualizado da batalha para o front-end
  return { ...battle, turnResult };
};

export const defend = async (userId: number, battleId: number) => {
  const battle = activeBattles[userId];

  if (!battle || battle.battleId !== battleId || battle.isFinished) {
    throw new Error('Batalha inválida ou já finalizada.');
  }

  // --- 1. Verificação de Energia ---
  if (battle.character.energy < ENERGY_COSTS.DEFEND) {
    // Retorna o estado da batalha sem alterações, apenas com a mensagem de erro
    return { ...battle, turnResult: "Energia insuficiente para defender!" };
  }

  // --- 2. Gasto de Energia ---
  battle.character.energy -= ENERGY_COSTS.DEFEND;

  // --- 3. Lógica do Efeito de Status ---
  // Adicionamos uma flag que a lógica de dano do inimigo precisará verificar
  battle.character.isDefending = true;

  const turnResult = `Você se prepara para o próximo ataque, bloqueando todo o dano. (-${ENERGY_COSTS.DEFEND} energia)`;

  // --- 4. Persistir o gasto de energia no Banco de Dados ---
  await prisma.character.update({
    where: { id: battle.character.id },
    data: { energy: battle.character.energy },
  });

  // --- 5. Retorna o estado atualizado da batalha ---
  // O front-end receberá o objeto 'character' com 'isDefending: true'
  return { ...battle, turnResult };
};

export const useSkill = async (userId: number, battleId: number) => {
  const battle = activeBattles[userId];

  if (!battle || battle.battleId !== battleId || battle.isFinished) {
    throw new Error('Batalha inválida ou já finalizada.');
  }

  const { character: player, monster: enemy } = battle; // Pegamos de dentro da batalha
  
  const cost = ENERGY_COSTS.ABILITY;
  const log = [];
  let uiEffect = null;

  // --- Verificações Iniciais ---
  if (player.energy < cost) {
    throw new Error("Energia insuficiente para usar a habilidade!");
  }
  // Supondo que você tenha uma propriedade para controlar o uso da habilidade
  // if (player.abilityUsed) {
  //   throw new Error("Habilidade já foi utilizada nesta batalha!");
  // }

  // --- Lógica Principal ---
  player.energy -= cost;
  // player.abilityUsed = true; // Marcar como usada
  log.push(`Você gasta ${cost} de energia para usar sua habilidade especial!`);

  // O resto da sua lógica de switch...
  switch (player.className.toLowerCase()) {
    case 'tank':
      // ...
      break;
    // ... etc ...
  }
  
  // Atualiza o banco de dados
  await prisma.character.update({
      where: { id: player.id },
      data: {
          hp: player.hp,
          energy: player.energy,
      },
  });

  return { ...battle, turnResult: log.join(' '), uiEffect };
};