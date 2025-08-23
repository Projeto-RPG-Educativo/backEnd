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