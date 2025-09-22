import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Adicionamos a propriedade 'user' à interface Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // ✅ INÍCIO DA CORREÇÃO
  // Adicionado para lidar com a requisição de 'preflight' do CORS.
  if (req.method === 'OPTIONS') {
    return next();
  }
  // ✅ FIM DA CORREÇÃO

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  const secretKey = process.env.JWT_SECRET || 'sua_chave_secreta_padrao';

  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Anexa os dados do usuário (id, nome_usuario) à requisição
    next();
  });
};