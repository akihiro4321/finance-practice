import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

interface RequestLogData {
  method: string;
  url: string;
  ip: string;
  userAgent?: string;
  contentLength?: number;
  userId?: string;
  duration?: number;
  statusCode?: number;
  responseSize?: number;
}

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const originalSend = res.send;
  let responseBody: string;

  res.send = function(data: any): Response {
    responseBody = data;
    return originalSend.call(this, data);
  };

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const contentLength = req.get('Content-Length');
    const responseSize = responseBody ? Buffer.byteLength(responseBody, 'utf8') : 0;

    const logData: RequestLogData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent'),
      contentLength: contentLength ? parseInt(contentLength) : 0,
      userId: (req as any).user?.id,
      duration,
      statusCode: res.statusCode,
      responseSize
    };

    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    logger[logLevel](message, {
      request: {
        method: logData.method,
        url: logData.url,
        ip: logData.ip,
        userAgent: logData.userAgent,
        contentLength: logData.contentLength,
        userId: logData.userId
      },
      response: {
        statusCode: logData.statusCode,
        size: logData.responseSize,
        duration: logData.duration
      }
    });

    if (duration > 1000) {
      logger.warn('Slow request detected:', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        userId: (req as any).user?.id
      });
    }
  });

  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.passwordHash) sanitizedBody.passwordHash = '[REDACTED]';
    if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';
    if (sanitizedBody.refreshToken) sanitizedBody.refreshToken = '[REDACTED]';

    logger.debug('Request body:', sanitizedBody);
  }

  next();
};

export { requestLogger };