import winston from 'winston';
import path from 'path';

const logLevel = process.env.LOG_LEVEL || 'info';
const logFormat = process.env.LOG_FORMAT || 'combined';
const logFilePath = process.env.LOG_FILE_PATH || 'logs/app.log';
const logMaxSize = process.env.LOG_MAX_SIZE || '10m';
const logMaxFiles = parseInt(process.env.LOG_MAX_FILES || '5');

const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: process.env.NODE_ENV === 'development' }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    level: logLevel,
    handleExceptions: true,
    handleRejections: true,
  })
];

if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.resolve(logFilePath),
      level: logLevel,
      handleExceptions: true,
      handleRejections: true,
      maxsize: parseInt(logMaxSize) || 10485760, // 10MB
      maxFiles: logMaxFiles,
      tailable: true,
    }),
    new winston.transports.File({
      filename: path.resolve('logs/error.log'),
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
      maxsize: parseInt(logMaxSize) || 10485760, // 10MB
      maxFiles: logMaxFiles,
      tailable: true,
    })
  );
}

const logger = winston.createLogger({
  level: logLevel,
  format: customFormat,
  transports,
  exitOnError: false,
});

if (process.env.NODE_ENV === 'development') {
  logger.debug('Logger initialized in development mode');
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at Promise', { reason, promise });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown', { error });
  process.exit(1);
});

export { logger };