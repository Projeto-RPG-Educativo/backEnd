// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Se o erro for uma instância da nossa classe AppError,
  // nós confiamos no statusCode e na mensagem que definimos.
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  // Se for um erro inesperado (não previsto),
  // retornamos um erro genérico 500 para não expor detalhes do sistema.
  console.error(error); // Log do erro para depuração
  return res.status(500).json({
    message: 'Internal Server Error',
  });
};