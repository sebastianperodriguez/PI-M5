export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
const envLevel = (process.env.LOG_LEVEL || 'info').toUpperCase();
const currentLevel = LogLevel[envLevel] ?? LogLevel.INFO;
function sanitize(message) {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
        return message.split(token).join('[REDACTED]');
    }
    return message;
}
function write(level, tag, message) {
    if (level < currentLevel) {
        return;
    }
    const line = `[${new Date().toISOString()}] [${tag}] ${sanitize(message)}`;
    console.error(line);
}
export const logger = {
    debug: (message) => write(LogLevel.DEBUG, 'DEBUG', message),
    info: (message) => write(LogLevel.INFO, 'INFO', message),
    warn: (message) => write(LogLevel.WARN, 'WARN', message),
    error: (message) => write(LogLevel.ERROR, 'ERROR', message),
};
//# sourceMappingURL=logging.js.map