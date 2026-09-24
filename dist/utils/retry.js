import { RateLimitError, NetworkError } from '../errors/index.js';
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 1000;
const DEFAULT_MAX_DELAY_MS = 10000;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function withRetry(operation, options) {
    const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
    const baseDelayMs = options?.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
    const maxDelayMs = options?.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            const retryable = error instanceof RateLimitError || error instanceof NetworkError;
            if (!retryable || attempt === maxRetries) {
                throw error;
            }
            const retryAfterMs = error instanceof RateLimitError ? error.retryAfter * 1000 : undefined;
            const delay = retryAfterMs ?? Math.min(baseDelayMs * 2 ** attempt, maxDelayMs);
            console.error(`[RETRY] Intento ${attempt + 1}/${maxRetries} falló. Reintentando en ${Math.round(delay / 1000)}s...`);
            await sleep(delay);
        }
    }
    throw lastError;
}
//# sourceMappingURL=retry.js.map