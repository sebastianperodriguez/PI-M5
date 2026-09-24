export interface ToolResult {
  data: string;
  isError?: boolean;
}

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

export type AsyncOperation<T> = () => Promise<T>;