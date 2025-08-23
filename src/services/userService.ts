import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registerUser = async (userData: any) => {
  if (!userData.nome_usuario || !userData.senha || !userData.email) {
    throw new Error('Nome de usuário, email e senha são obrigatórios.');
  }

  const existingUser = await prisma.user.findUnique({ where: { nome_usuario: userData.nome_usuario } });
  if (existingUser) {
    throw new Error('Este nome de usuário já está em uso.');
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
  const user = await prisma.user.findUnique({ where: { nome_usuario: nome_usuario } });
  if (!user) {
    throw new Error('Credenciais inválidas.');
  }

  const isPasswordValid = await bcrypt.compare(senha, user.senha_hash);
  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas.');
  }

  const secretKey = process.env.JWT_SECRET || 'sua_chave_secreta_padrao';
  const token = jwt.sign({ id: user.id, nome_usuario: user.nome_usuario }, secretKey, { expiresIn: '1h' });

  return {
    message: 'Login bem-sucedido!',
    user: { id: user.id, nome_usuario: user.nome_usuario },
    token: token,
  };
};