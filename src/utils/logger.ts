/**
 * Structured logging utility
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  info(message: string, data?: unknown): void {
    const logEntry = this.formatLog('info', message, data);
    if (this.isDevelopment) {
      console.log(`[INFO] ${logEntry.timestamp} - ${message}`, data || '');
    }
  }

  warn(message: string, data?: unknown): void {
    const logEntry = this.formatLog('warn', message, data);
    if (this.isDevelopment) {
      console.warn(`[WARN] ${logEntry.timestamp} - ${message}`, data || '');
    }
  }

  error(message: string, data?: unknown): void {
    const logEntry = this.formatLog('error', message, data);
    console.error(`[ERROR] ${logEntry.timestamp} - ${message}`, data || '');
  }

  debug(message: string, data?: unknown): void {
    const logEntry = this.formatLog('debug', message, data);
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${logEntry.timestamp} - ${message}`, data || '');
    }
  }
}

export const logger = new Logger();
