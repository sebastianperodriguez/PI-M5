import { describe, it, expect, vi } from 'vitest';
import { withRetry } from '../src/utils/retry.js';
import { RateLimitError, NetworkError, GitHubAPIError } from '../src/errors/index.js';

describe('withRetry', () => {
  it('reintenta cuando hay RateLimitError y eventualmente tiene éxito', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new RateLimitError(0))
      .mockRejectedValueOnce(new RateLimitError(0))
      .mockResolvedValueOnce('ok');

    const result = await withRetry(operation, {
      maxRetries: 3,
      baseDelayMs: 0,
    });

    expect(result).toBe('ok');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('reintenta cuando hay NetworkError', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new NetworkError())
      .mockResolvedValueOnce('ok');

    const result = await withRetry(operation, {
      maxRetries: 2,
      baseDelayMs: 0,
    });

    expect(result).toBe('ok');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('no reintenta errores que no son retryables', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new GitHubAPIError('Not found', 404));

    await expect(
      withRetry(operation, { maxRetries: 3, baseDelayMs: 0 })
    ).rejects.toThrow('Not found');

    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('propaga el error si se agotan los reintentos', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(new RateLimitError(0));

    await expect(
      withRetry(operation, { maxRetries: 2, baseDelayMs: 0 })
    ).rejects.toBeInstanceOf(RateLimitError);

    expect(operation).toHaveBeenCalledTimes(3);
  });
});