export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(400, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(404, message);
  }
}
