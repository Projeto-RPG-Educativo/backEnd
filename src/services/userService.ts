import bcrypt from 'bcryptjs';
import * as userRepository from '../repositories/userRepository';

export const registerUser = async (userData: any) => {
  // Regra 1: Validação básica (em um projeto real, seria mais robusta)
  if (!userData.nome_usuario || !userData.senha || !userData.email) {
    throw new Error('Nome de usuário, email e senha são obrigatórios.');
  }

  // Regra 2: Verifica se o usuário já existe no nosso "banco"
  const existingUser = await userRepository.findByUsername(userData.nome_usuario);
  if (existingUser) {
    throw new Error('Este nome de usuário já está em uso.');
  }

  // Regra 3: Criptografa a senha antes de salvar
  const senha_hash = await bcrypt.hash(userData.senha, 10); // O 10 é o "custo" do hash

  // Regra 4: Chama o repositório para "salvar" o usuário
  const newUser = await userRepository.createUser({
    nome_usuario: userData.nome_usuario,
    email: userData.email,
    senha_hash: senha_hash,
  });

  // Regra 5: NUNCA retorne a senha ou o hash da senha para o cliente
  const { senha_hash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};