import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seed...');

  const classes = await prisma.class.createMany({
    data: [
      { name: 'tank', hp: 150, mp: 20, strength: 80, intelligence: 20 },
      { name: 'mago', hp: 80, mp: 150, strength: 20, intelligence: 150 },
      { name: 'lutador', hp: 120, mp: 10, strength: 120, intelligence: 10 },
      { name: 'ladino', hp: 90, mp: 30, strength: 90, intelligence: 90 },
      { name: 'paladino', hp: 130, mp: 50, strength: 100, intelligence: 50 },
      { name: 'bardo', hp: 100, mp: 100, strength: 50, intelligence: 100 },
    ],
    skipDuplicates: true, // Isso evita erros se você rodar o script mais de uma vez
  });

  console.log(`Foram criadas ${classes.count} classes.`);
}

main()
  .catch((e) => {
    console.error(e);
    throw new Error('Falha no processo de seed.');
  })
  .finally(async () => {
    await prisma.$disconnect();
  });