// src/errors/UnauthorizedError.ts
import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401); // 401 Unauthorized
  }
}