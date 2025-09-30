// src/errors/BadRequestError.ts
import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400); // 400 Bad Request
  }
}