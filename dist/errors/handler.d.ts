import { AppError, ValidationError } from './index.js';
export declare function handleGitHubError(error: unknown, context?: string): AppError;
export declare function handleValidationError(message: string): ValidationError;
export declare function getErrorMessage(error: unknown): string;
//# sourceMappingURL=handler.d.ts.map