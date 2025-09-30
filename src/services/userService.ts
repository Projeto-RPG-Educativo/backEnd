import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/BadRequestError';
import { UnauthorizedError } from '../errors/UnauthorizedError';

const prisma = new PrismaClient();

export const registerUser = async (userData: any) => {
  if (!userData.nome_usuario || !userData.senha || !userData.email) {
    throw new Error('Nome de usuário, email e senha são obrigatórios.');
  }

  const existingUser = await prisma.user.findUnique({ where: { nome_usuario: userData.nome_usuario } });
  if (existingUser) {
    throw new BadRequestError('Este nome de usuário já está em uso.');
  }

  const senha_hash = await bcrypt.hash(userData.senha, 10);

  const newUser = await prisma.user.create({
    data: {
      nome_usuario: userData.nome_usuario,
      email: userData.email,
      senha_hash: senha_hash,
    },
  });

  const { senha_hash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginUser = async (nome_usuario: string, senha: string) => {
  console.log("\n--- [LOGIN SERVICE] TENTATIVA DE LOGIN INICIADA ---");
  console.log("Recebido - Usuário:", nome_usuario);
  console.log("Recebido - Senha:", senha);

  // Passo 1: Encontrar o usuário no nosso "banco"
  const user = await prisma.user.findUnique({ where: { nome_usuario: nome_usuario } });
  if (!user) {
    console.log("FALHA: Usuário não encontrado no banco de dados.");
    throw new UnauthorizedError('Credenciais inválidas.');
  }
  console.log("SUCESSO: Usuário encontrado:", user);

  // Passo 2: Comparar a senha enviada com o hash salvo no "banco"
  const isPasswordValid = await bcrypt.compare(senha, user.senha_hash);
  if (!isPasswordValid) {
    console.log("FALHA: A comparação de senhas retornou 'false'. A senha está incorreta.");
    throw new UnauthorizedError('Credenciais inválidas.');
  }
  console.log("SUCESSO: Senha válida!");

  // Passo 3: Gerar o Token JWT
  const secretKey = process.env.JWT_SECRET || 'sua_chave_secreta_padrao';
  const token = jwt.sign({ id: user.id, nome_usuario: user.nome_usuario }, secretKey, { expiresIn: '10h' });
  console.log("SUCESSO: Token JWT gerado.");

  // Passo 4: Retornar os dados do usuário e o token
  return {
    message: 'Login bem-sucedido!',
    user: { id: user.id, nome_usuario: user.nome_usuario },
    token: token,
  };
};