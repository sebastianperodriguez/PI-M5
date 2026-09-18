export class AppError extends Error {
    constructor(message, code, statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
export class ValidationError extends AppError {
    constructor(message) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
    }
}
export class GitHubAPIError extends AppError {
    constructor(message, statusCode, endpoint) {
        super(message, 'GITHUB_API_ERROR', statusCode);
        this.statusCode = statusCode;
        this.endpoint = endpoint;
        this.name = 'GitHubAPIError';
    }
}
export class AuthenticationError extends AppError {
    constructor(message = 'Token de GitHub inválido o expirado') {
        super(message, 'AUTHENTICATION_ERROR', 401);
        this.name = 'AuthenticationError';
    }
}
export class NetworkError extends AppError {
    constructor(message = 'Error de conexión con GitHub') {
        super(message, 'NETWORK_ERROR', 503);
        this.name = 'NetworkError';
    }
}
export class RateLimitError extends GitHubAPIError {
    constructor(retryAfter = 60) {
        super('Límite de peticiones a GitHub alcanzado', 403);
        this.name = 'RateLimitError';
        this.retryAfter = retryAfter;
    }
}
//# sourceMappingURL=index.js.map