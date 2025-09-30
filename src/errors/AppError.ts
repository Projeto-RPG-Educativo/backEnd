// Esta é a nossa classe de erro base.
// Ela garante que todo erro gerado por nós terá uma mensagem e um status code HTTP.
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}