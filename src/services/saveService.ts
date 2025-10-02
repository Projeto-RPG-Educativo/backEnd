// Em: src/services/saveService.ts

import { PrismaClient, Prisma } from '@prisma/client';
import { NotFoundError } from '../errors/NotFoundError';

const prisma = new PrismaClient();

/**
 * Cria um novo save ou atualiza um existente com o mesmo nome de slot.
 */
export const createOrUpdateSave = async (
  userId: number,
  characterId: number,
  slotName: string,
  currentState: Prisma.JsonObject
) => {
  const character = await prisma.character.findFirst({
    where: { id: characterId, userId: userId },
  });

  if (!character) {
    throw new NotFoundError('Personagem não encontrado ou não pertence a este usuário.');
  }

  const save = await prisma.gameSave.upsert({
    where: {
      userId_slotName: {
        userId,
        slotName,
      },
    },
    update: {
      characterState: currentState,
      savedAt: new Date(),
    },
    create: {
      userId,
      characterId,
      slotName,
      characterState: currentState,
    },
  });

  return save;
};

/**
 * Busca todos os saves de um determinado usuário.
 */
export const getSavesForUser = async (userId: number) => {
  const saves = await prisma.gameSave.findMany({
    where: { userId },
    orderBy: {
      savedAt: 'desc',
    },
  });
  return saves;
};