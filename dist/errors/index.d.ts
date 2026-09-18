export declare class AppError extends Error {
    code: string;
    statusCode?: number | undefined;
    constructor(message: string, code: string, statusCode?: number | undefined);
}
export declare class ValidationError extends AppError {
    constructor(message: string);
}
export declare class GitHubAPIError extends AppError {
    statusCode: number;
    endpoint?: string | undefined;
    constructor(message: string, statusCode: number, endpoint?: string | undefined);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string);
}
export declare class NetworkError extends AppError {
    constructor(message?: string);
}
export declare class RateLimitError extends GitHubAPIError {
    retryAfter: number;
    constructor(retryAfter?: number);
}
//# sourceMappingURL=index.d.ts.map