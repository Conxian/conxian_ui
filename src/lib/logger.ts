/**
 * Conxian Institutional Logger
 * Standardized logging for protocol-level transparency and high-trust operations.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  module?: string;
  txId?: string;
  contract?: string;
  [key: string]: unknown;
}

class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const ctxString = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctxString}`;
  }

  public info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context));
  }

  public warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  public error(message: string, context?: LogContext): void {
    console.error(this.formatMessage('error', message, context));
  }

  public debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

export const logger = Logger.getInstance();
