export class AppError extends Error {
    constructor(public readonly message: string, public readonly statusCode: number = 400) {
        super(message);
    }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
