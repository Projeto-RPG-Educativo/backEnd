import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Busca uma pergunta aleatória no banco de dados.
 */
export const getRandomQuestion = async () => {
  // 1. Contamos quantas perguntas existem no total no banco de dados.
  const questionCount = await prisma.question.count();

  // Se não houver nenhuma pergunta, lançamos um erro.
  if (questionCount === 0) {
    throw new Error('Nenhuma pergunta encontrada no banco de dados.');
  }

  // 2. Geramos um número aleatório para "pular" um número de registros.
  const skip = Math.floor(Math.random() * questionCount);

  // 3. Buscamos UMA pergunta (`take: 1`), pulando o número de registros que sorteamos.
  //    Isso nos dá uma pergunta aleatória de forma eficiente.
  const randomQuestion = await prisma.question.findFirst({
    skip: skip,
  });

  // 4. (Passo de Segurança) Removemos a resposta correta do objeto
  //    antes de enviá-lo para o front-end, para evitar trapaças.
  const { resposta_correta, ...questionForFrontend } = randomQuestion!;

  return questionForFrontend;
};