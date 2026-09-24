export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const envLevel = (process.env.LOG_LEVEL || 'info').toUpperCase();
const currentLevel: LogLevel =
  LogLevel[envLevel as keyof typeof LogLevel] ?? LogLevel.INFO;

function sanitize(message: string): string {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    return message.split(token).join('[REDACTED]');
  }
  return message;
}

function write(level: LogLevel, tag: string, message: string): void {
  if (level < currentLevel) {
    return;
  }
  const line = `[${new Date().toISOString()}] [${tag}] ${sanitize(message)}`;
  console.error(line);
}

export const logger = {
  debug: (message: string) => write(LogLevel.DEBUG, 'DEBUG', message),
  info: (message: string) => write(LogLevel.INFO, 'INFO', message),
  warn: (message: string) => write(LogLevel.WARN, 'WARN', message),
  error: (message: string) => write(LogLevel.ERROR, 'ERROR', message),
};