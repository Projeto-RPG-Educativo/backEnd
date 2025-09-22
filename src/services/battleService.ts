import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const activeBattles: any = {};

/**
 * Inicia uma nova batalha para um usuário, carregando os dados necessários do banco.
 */
export const startBattle = async (userId: number, monsterId: number) => {
  try {
    const character = await prisma.character.findFirst({
      where: { userId: userId },
      include: { class: true },
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