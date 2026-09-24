import { RateLimitError, NetworkError } from '../errors/index.js';
import type { AsyncOperation, RetryOptions } from './types.js';

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 1000;
const DEFAULT_MAX_DELAY_MS = 10000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  operation: AsyncOperation<T>,
  options?: RetryOptions
): Promise<T> {
  const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
  const baseDelayMs = options?.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  const maxDelayMs = options?.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const retryable =
        error instanceof RateLimitError || error instanceof NetworkError;

      if (!retryable || attempt === maxRetries) {
        throw error;
      }

      const retryAfterMs =
        error instanceof RateLimitError ? error.retryAfter * 1000 : undefined;

      const delay = retryAfterMs ?? Math.min(
        baseDelayMs * 2 ** attempt,
        maxDelayMs
      );

      console.error(`[RETRY] Intento ${attempt + 1}/${maxRetries} falló. Reintentando en ${Math.round(delay / 1000)}s...`);
      await sleep(delay);
    }
  }

  throw lastError;
}