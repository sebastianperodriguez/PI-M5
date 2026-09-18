import {
  AppError,
  ValidationError,
  GitHubAPIError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
} from './index.js';

interface GitHubErrorResponse {
  status?: number;
  message?: string;
  documentation_url?: string;
}

export function handleGitHubError(
  error: unknown,
  context?: string
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const err = error as GitHubErrorResponse & { code?: string };

  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return new NetworkError(
      'No se pudo conectar a GitHub. Verifica tu conexión a internet.'
    );
  }

  if (err.status === 401) {
    return new AuthenticationError(
      'Tu token de GitHub es inválido o ha expirado. '
    );
  }

  if (err.status === 403) {
    if (err.message?.includes('rate limit')) {
      const retryAfter = 60;
      return new RateLimitError(retryAfter);
    }
    return new GitHubAPIError(
      'No tienes permisos para realizar esta acción. ' +
      'Verifica que tu token tenga los permisos necesarios.',
      403
    );
  }

  if (err.status === 404) {
    const resource = context || 'recurso';
    return new GitHubAPIError(
      `El ${resource} no fue encontrado. Verifica el nombre e intenta de nuevo.`,
      404
    );
  }

  if (err.status === 422) {
    return new ValidationError(
      'Los datos proporcionados no son válidos. ' +
      'Verifica que el nombre del repositorio cumpla las reglas de GitHub ' +
      '(3-100 caracteres, alfanuméricos, guiones y guiones bajos).'
    );
  }

  return new GitHubAPIError(
    err.message || 'Error desconocido al comunicarse con GitHub',
    err.status || 500
  );
}

export function handleValidationError(message: string): ValidationError {
  return new ValidationError(message);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}
