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

export const createCharacter = async (userId: number, characterData: { nome: string, nomeDaClasse: string }) => {
  // --- Buscar a classe pelo nome para obter o ID ---
  const characterClass = await prisma.class.findUnique({
    where: { name: characterData.nomeDaClasse },
  });

  // Se a classe escolhida não existir no banco, retorna um erro
  if (!characterClass) {
    throw new Error(`Classe '${characterData.nomeDaClasse}' não encontrada.`);
  }

  // --- Verificar se o usuário já possui um personagem ---
  const existingCharacter = await prisma.character.findUnique({
    where: { userId: userId },
  });

  if (existingCharacter) {
    throw new Error('Este usuário já possui um personagem.');
  }

  // --- Criar o personagem usando o ID da classe ---
  const newCharacter = await prisma.character.create({
    data: {
      nome: characterData.nome,
      hp: characterClass.hp, // Pega o HP inicial da classe!
      xp: 0,
      // Conecta com o usuário que está criando o personagem
      user: {
        connect: { id: userId },
      },
      // Conecta com a classe usando o ID que encontramos
      class: {
        connect: { id: characterClass.id },
      },
      // ATENÇÃO:verficar o campo classe do character, tipo string, ver se precisa remover
      classe: characterClass.name, 
    },
  });

  // --- Criar um inventário vazio para o novo personagem ---
  await prisma.inventory.create({
    data: {
      characterId: newCharacter.id
    }
  });


  return newCharacter;
};