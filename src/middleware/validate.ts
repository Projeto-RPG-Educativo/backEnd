import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Use z.ZodObject<any> para uma tipagem mais genérica e correta aqui
export const validate = (schema: z.ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json({
        message: 'Erro de validação.',
        details: error,
      });
    }
  };