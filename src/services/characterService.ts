import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// As funções findCharacterById e updateCharacterProgress já estão corretas
export const findCharacterById = async (id: number) => {
  return await prisma.character.findUnique({ where: { id } });
};

export const updateCharacterProgress = async (characterId: number, xp: number, hp: number) => {
  if (!characterId || xp === undefined || hp === undefined) {
    throw new Error('Dados insuficientes para salvar o progresso.');
  }

  return await prisma.character.update({
    where: { id: characterId },
    data: { xp: { increment: xp }, hp: hp },
  });
};

// --- FUNÇÃO createCharacter TOTALMENTE CORRIGIDA ---
export const createCharacter = async (userId: number, characterData: { classe: string }) => {
  // A verificação de personagem existente foi removida.
  
  // 1. Busca os dados da classe para a criação
  const characterClass = await prisma.class.findFirst({
    where: { 
      name: {
        equals: characterData.classe,
        mode: 'insensitive',
      }
    },
  });

  if (!characterClass) {
    throw new Error(`Classe '${characterData.classe}' não encontrada no banco de dados.`);
  }

  // 2. Cria o novo personagem no banco de dados sem verificar.
  const newCharacter = await prisma.character.create({
    data: {
      nome: `Herói ${characterClass.name}`,
      hp: characterClass.hp,
      xp: 0,
      classe: characterClass.name,
      user: {
        connect: { id: userId },
      },
      class: {
        connect: { id: characterClass.id },
      },
    },
  });

  // 3. Cria um inventário vazio para o novo personagem
  await prisma.inventory.create({
    data: {
      characterId: newCharacter.id
    }
  });

  console.log(`[SERVICE] Novo personagem criado para o usuário ${userId}.`);
  return newCharacter;
};