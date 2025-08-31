import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const activeBattles: any = {};

/**
 * Inicia uma nova batalha. ESTA FUNÇÃO JÁ ESTÁ CORRETA.
 */
export const startBattle = async (userId: number, monsterId: number) => {
  const character = await prisma.character.findUnique({
    where: { userId },
    include: {
      class: true,
    },
  });

  const monster = await prisma.monster.findUnique({ where: { id: monsterId } });

  if (!character || !monster || !character.class) {
    throw new Error('Personagem, monstro ou classe não encontrado.');
  }

  const questionCount = await prisma.question.count();
  const skip = Math.floor(Math.random() * questionCount);
  const firstQuestion = await prisma.question.findFirst({
    skip: skip,
  });

  if (!firstQuestion) {
    throw new Error('Nenhuma pergunta encontrada no banco de dados.');
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
 * Processa a resposta, agora com a lógica de dano expandida para todas as classes.
 */
export const processAnswer = async (userId: number, battleId: number, questionId: number, answer: string) => {
  const battle = activeBattles[userId];

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
  let damageDealt = 0;

  if (answer.toUpperCase() === question.resposta_correta) {
    // --- LÓGICA DE DANO ATUALIZADA AQUI ---
    // Decidimos qual atributo usar com base no nome da classe
    switch (battle.character.className.toLowerCase()) {
      // Classes de dano físico usam 'strength'
      case 'tank':
      case 'lutador':
      case 'ladino':
      case 'paladino':
        damageDealt = battle.character.strength;
        break;
      
      // Classes de dano mágico/híbrido usam 'intelligence'
      // Supondo que 'mago' será uma de suas classes
      case 'mago': 
      case 'bardo':
        damageDealt = battle.character.intelligence;
        break;
      
      // Um fallback inteligente: se a classe não for nenhuma das acima,
      // usa o maior atributo entre força e inteligência.
      default:
        damageDealt = Math.max(battle.character.strength, battle.character.intelligence) || 5;
    }

    battle.monster.hp -= damageDealt;
    turnResult = `Você acertou! O monstro sofreu ${damageDealt} de dano.`;
    
  } else {
    battle.character.hp -= battle.monster.dano;
    turnResult = `Você errou! O monstro te atacou e causou ${battle.monster.dano} de dano.`;
  }

  // O resto da função para verificar o fim da batalha permanece o mesmo
  if (battle.monster.hp <= 0) {
    battle.isFinished = true;
    turnResult += ' Você venceu a batalha!';
    await prisma.character.update({
      where: { id: battle.character.id },
      data: { hp: battle.character.hp, xp: { increment: 50 } },
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
};