export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class GitHubAPIError extends AppError {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint?: string
  ) {
    super(message, 'GITHUB_API_ERROR', statusCode);
    this.name = 'GitHubAPIError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Token de GitHub inválido o expirado') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Error de conexión con GitHub') {
    super(message, 'NETWORK_ERROR', 503);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends GitHubAPIError {
  public retryAfter: number;

  constructor(retryAfter: number = 60) {
    super('Límite de peticiones a GitHub alcanzado', 403);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}
