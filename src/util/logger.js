const logs = [];

function writeLog(level, message, meta) {
  logs.push({ level, message, meta, timestamp: new Date().toISOString() });

  const write = console[level] || console.log;
  const prefix = `[${level.toUpperCase()}] ${message}`;

  Object.keys(meta).length > 0 ? write(prefix, meta) : write(prefix);
}

export const logger = {
  error: (message, meta = {}) => writeLog("error", message, meta),
  info: (message, meta = {}) => writeLog("info", message, meta),
  warn: (message, meta = {}) => writeLog("warn", message, meta),
  getLogs: () => [...logs],
};
