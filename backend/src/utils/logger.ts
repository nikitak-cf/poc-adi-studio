import winston from 'winston';
import { env } from '../config/env';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

const level = () => (env.NODE_ENV === 'development' ? 'debug' : 'warn');

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, requestId, ...meta } = info;
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    const reqId = requestId ? `[${requestId}]` : '';
    return `${timestamp} ${level} ${reqId} ${message} ${metaStr}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports: any[] = [
  new winston.transports.Console({ format: consoleFormat }),
];

if (env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat,
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
  transports.push(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat,
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  exitOnError: false,
});

export const stream = {
  write: (message: string) => logger.http(message.trim()),
};

export default logger;