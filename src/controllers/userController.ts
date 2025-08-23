import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const registerUserHandler = async (req: Request, res: Response) => {
  try {
    const newUser = await userService.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUserHandler = async (req: Request, res: Response) => {
  try {
    const { nome_usuario, senha } = req.body;
    const result = await userService.loginUser(nome_usuario, senha);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};