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
export const createCharacter = async (userId: number, characterData: { nome: string, classe: string, hp: number }) => {
  // 1. Busca a classe pelo nome (insensível a maiúsculas/minúsculas)
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

  // 2. A verificação de personagem duplicado foi removida para permitir múltiplos personagens.

  // 3. Cria o personagem no banco de dados
  const newCharacter = await prisma.character.create({
    data: {
      nome: characterData.nome,
      hp: characterData.hp,
      xp: 0,
      classe: characterData.classe, // Salva o nome da classe
      user: {
        connect: { id: userId }, // Conecta a relação com o usuário
      },
      class: {
        connect: { id: characterClass.id }, // Conecta a relação com a classe
      },
    },
  });

  // 4. Cria um inventário vazio para o novo personagem
  await prisma.inventory.create({
    data: {
      characterId: newCharacter.id
    }
  });

  return newCharacter;
};

// Garanta que esta função para listar personagens também exista
export const findCharactersByUserId = async (userId: number) => {
  return await prisma.character.findMany({
    where: { userId },
    include: { class: true },
  });
};