import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const registerUserHandler = async (req: Request, res: Response) => {
  try {
    // 1. Pega os dados do corpo da requisição (o JSON que o front-end envia)
    const userData = req.body;

    // 2. Chama o service, que contém a lógica de negócio
    const newUser = await userService.registerUser(userData);

    // 3. Se tudo deu certo, envia a resposta com status 201 (Created)
    res.status(201).json(newUser);
  } catch (error: any) {
    // 4. Se ocorrer qualquer erro no service (ex: usuário já existe), captura aqui
    res.status(400).json({ message: error.message });
  }
};