import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findCharacterById = async (id: number) => {
  return await prisma.character.findUnique({ where: { id } });
};

export const updateCharacterProgress = async (characterId: number, xp: number, hp: number) => {
  if (!characterId || xp === undefined || hp === undefined) {
    throw new Error('Dados insuficientes para salvar o progresso.');
  }

  return await prisma.character.update({
    where: { id: characterId },
    data: {
      xp: { increment: xp },
      hp: hp,
    },
  });
};

export const createCharacter = async (userId: number, characterData: { nome: string, classe: string, hp: number }) => {
  // Regra de negócio: Verifica se o usuário já não possui um personagem
  const existingCharacter = await prisma.character.findUnique({
    where: { userId: userId },
  });

  if (existingCharacter) {
    throw new Error('Este usuário já possui um personagem.');
  }

  // Usa o Prisma para criar o novo personagem no banco de dados,
  // associando-o ao 'userId' do usuário logado.
  const newCharacter = await prisma.character.create({
    data: {
      nome: characterData.nome,
      classe: characterData.classe,
      hp: characterData.hp, // O HP inicial pode ser passado pelo front ou definido aqui
      xp: 0, // XP inicial sempre começa com 0
      userId: userId, // Link com a tabela User
    },
  });

  return newCharacter;
};