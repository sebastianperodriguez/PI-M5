import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  GitHubAPIError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
} from '../src/errors/index.js';
import { handleGitHubError, getErrorMessage } from '../src/errors/handler.js';

describe('handleGitHubError', () => {
  it('transforma un error 401 en AuthenticationError', () => {
    const error = handleGitHubError({ status: 401, message: 'Bad credentials' });
    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.message).toContain('token');
  });

  it('transforma un error 404 en mensaje amigable con contexto', () => {
    const err = new Error('Not Found') as Error & { status?: number };
    err.status = 404;
    const error = handleGitHubError(err, 'repositorio');
    expect(error).toBeInstanceOf(GitHubAPIError);
    expect(error.message).toContain('El repositorio no fue encontrado');
  });

  it('transforma un 403 con rate limit en RateLimitError', () => {
    const err = new Error('API rate limit exceeded') as Error & { status?: number };
    err.status = 403;
    const error = handleGitHubError(err);
    expect(error).toBeInstanceOf(RateLimitError);
    expect(error).toBeInstanceOf(GitHubAPIError);
  });

  it('transforma un 403 sin rate limit en error de permisos', () => {
    const err = new Error('Forbidden') as Error & { status?: number };
    err.status = 403;
    const error = handleGitHubError(err);
    expect(error).toBeInstanceOf(GitHubAPIError);
    expect(error.message).toContain('No tienes permisos');
  });

  it('transforma un 422 en ValidationError', () => {
    const err = new Error('Validation Failed') as Error & { status?: number };
    err.status = 422;
    const error = handleGitHubError(err);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toContain('reglas de GitHub');
  });

  it('detecta errores de red', () => {
    const error = handleGitHubError({ code: 'ENOTFOUND' });
    expect(error).toBeInstanceOf(NetworkError);
    expect(error.message).toContain('conexión');
  });

  it('devuelve el mismo error si ya es AppError', () => {
    const original = new ValidationError('Test');
    const error = handleGitHubError(original);
    expect(error).toBe(original);
  });
});

describe('getErrorMessage', () => {
  it('extrae el mensaje de un AppError', () => {
    const error = new AuthenticationError('Token inválido');
    expect(getErrorMessage(error)).toBe('Token inválido');
  });

  it('extrae el mensaje de un Error estándar', () => {
    const error = new Error('Algo salió mal');
    expect(getErrorMessage(error)).toBe('Algo salió mal');
  });

  it('retorna mensaje genérico para valores desconocidos', () => {
    expect(getErrorMessage(null)).toBe('Ocurrió un error inesperado. Intenta de nuevo.');
  });
});

describe('clases de error', () => {
  it('mantiene el code y statusCode correctos', () => {
    const error = new GitHubAPIError('Not found', 404);
    expect(error.code).toBe('GITHUB_API_ERROR');
    expect(error.statusCode).toBe(404);
    expect(error).toBeInstanceOf(AppError);
  });

  it('RateLimitError tiene retryAfter por defecto de 60s', () => {
    const error = new RateLimitError();
    expect(error.retryAfter).toBe(60);
  });
});