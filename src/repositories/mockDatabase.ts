// Este arquivo simula nosso banco de dados PostgreSQL em memória.
// É perfeito para desenvolver a lógica da API sem precisar de um banco real.

// Simulação da tabela 'usuarios'
export const usuarios = [
  {
    id: 1,
    nome_usuario: 'johndoe',
    email: 'john.doe@example.com',
    senha_hash: '$2b$10$abcdefghijklmnopqrstuv' // Um hash de exemplo
  }
];

// Simulação da tabela 'progresso_jogo'
export const progresso_jogo = [
  {
    id: 1,
    usuario_id: 1,
    nivel: 5,
    xp: 450,
    classe_personagem: 'Mage'
  }
];

// Adicione mais arrays para simular outras tabelas (inventário, perguntas, etc.)