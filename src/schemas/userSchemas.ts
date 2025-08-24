import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    nome_usuario: z.string().min(3, "Nome de usuário deve ter no mínimo 3 caracteres."),
    email: z.string().email("Formato de email inválido."),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres."),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    nome_usuario: z.string(),
    senha: z.string(),
  }),
});