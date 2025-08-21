import { usuarios } from './mockDatabase'; // Importa nosso banco de dados falso

// Interface para definir o formato de um novo usuário
interface NewUser {
  nome_usuario: string;
  email: string;
  senha_hash: string;
}

// Função para encontrar um usuário pelo nome
export const findByUsername = async (nome_usuario: string) => {
  const user = usuarios.find(u => u.nome_usuario === nome_usuario);
  return Promise.resolve(user); // Simula uma operação assíncrona
};

// Função para criar um novo usuário
export const createUser = async (data: NewUser) => {
  const newUser = {
    id: usuarios.length + 1, // Simula o auto-incremento do ID
    ...data,
  };
  usuarios.push(newUser);
  return Promise.resolve(newUser); // Simula uma operação assíncrona
};