import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simulação de uma "sessão de batalha" em memória.
// A chave é o ID do usuário para simplificar.
const activeBattles: any = {};

/**
 * Inicia uma nova batalha para um usuário contra um monstro.
 */
export const startBattle = async (userId: number, monsterId: number) => {
  const character = await prisma.character.findUnique({ where: { userId } });
  const monster = await prisma.monster.findUnique({ where: { id: monsterId } });

  if (!character || !monster) {
    throw new Error('Personagem ou monstro não encontrado.');
  }

  // Pega uma pergunta aleatória do banco de dados
  const questionCount = await prisma.question.count();
  const skip = Math.floor(Math.random() * questionCount);
  const firstQuestion = await prisma.question.findFirst({
    skip: skip,
  });

  if (!firstQuestion) {
    throw new Error('Nenhuma pergunta encontrada no banco de dados.');
  }

  // Cria e armazena o estado inicial da batalha
  const battleState = {
    battleId: Date.now(), // ID simples para a batalha
    character: { id: character.id, hp: character.hp },
    monster: { id: monster.id, hp: monster.hp, dano: monster.dano },
    currentQuestion: {
      id: firstQuestion.id,
      texto: firstQuestion.texto_pergunta,
      opcoes: [firstQuestion.opcao_a, firstQuestion.opcao_b, firstQuestion.opcao_c],
    },
    isFinished: false,
  };

  activeBattles[userId] = battleState;

  return battleState;
};

/**
 * Processa a resposta de um jogador para uma pergunta.
 */
export const processAnswer = async (userId: number, battleId: number, questionId: number, answer: string) => {
  const battle = activeBattles[userId];

  // Validações de segurança
  if (!battle || battle.battleId !== battleId || battle.isFinished) {
    throw new Error('Batalha inválida ou já finalizada.');
  }
  if (battle.currentQuestion.id !== questionId) {
    throw new Error('Pergunta fora de sequência.');
  }

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) {
    throw new Error('Pergunta não encontrada.');
  }

  let turnResult = '';

  // Verifica a resposta e calcula o dano
  if (answer.toUpperCase() === question.resposta_correta) {
    turnResult = `Você acertou! O monstro sofreu dano.`;
    battle.monster.hp -= 20; // Dano fixo de 20 para simplificar
  } else {
    turnResult = `Você errou! O monstro te atacou.`;
    battle.character.hp -= battle.monster.dano;
  }

  // Verifica se a batalha terminou
  if (battle.monster.hp <= 0) {
    battle.isFinished = true;
    turnResult += ' Você venceu a batalha!';
    // Atualiza o progresso do personagem no banco de dados
    await prisma.character.update({
      where: { id: battle.character.id },
      data: { hp: battle.character.hp, xp: { increment: 50 } }, // Ganha 50 XP
    });
  } else if (battle.character.hp <= 0) {
    battle.isFinished = true;
    turnResult += ' Você foi derrotado.';
    // Apenas atualiza a vida do personagem no banco
    await prisma.character.update({
      where: { id: battle.character.id },
      data: { hp: 0 },
    });
  }

  // Se a batalha não terminou, busca a próxima pergunta
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
    // Se a batalha terminou, remove a sessão da memória
    delete activeBattles[userId];
  }
  
  // Retorna o estado atualizado da batalha, incluindo o resultado do turno
  return { ...battle, turnResult };
};