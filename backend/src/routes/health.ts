import { Router, Request, Response } from 'express';
import { testConnection } from '@/config/database';
import { logger } from '@/utils/logger';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: {
      status: 'connected' | 'disconnected';
      responseTime?: number;
    };
    memory: {
      used: number;
      free: number;
      total: number;
      usage: string;
    };
    cpu: {
      usage: string;
    };
  };
}

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const dbConnected = await testConnection();
    const dbResponseTime = Date.now() - startTime;
    
    const memoryUsage = process.memoryUsage();
    const totalMemory = require('os').totalmem();
    const freeMemory = require('os').freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);
    
    const cpuUsage = process.cpuUsage();
    const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2);
    
    const healthData: HealthStatus = {
      status: dbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbConnected ? 'connected' : 'disconnected',
          responseTime: dbResponseTime
        },
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          free: Math.round(freeMemory / 1024 / 1024),
          total: Math.round(totalMemory / 1024 / 1024),
          usage: `${memoryUsagePercent}%`
        },
        cpu: {
          usage: `${cpuPercent}ms`
        }
      }
    };
    
    const statusCode = healthData.status === 'healthy' ? 200 : 503;
    
    if (statusCode === 503) {
      logger.warn('Health check failed:', healthData);
    }
    
    res.status(statusCode).json(healthData);
  } catch (error) {
    logger.error('Health check error:', error);
    
    const errorHealthData: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: 'disconnected'
        },
        memory: {
          used: 0,
          free: 0,
          total: 0,
          usage: '0%'
        },
        cpu: {
          usage: '0ms'
        }
      }
    };
    
    res.status(503).json(errorHealthData);
  }
});

router.get('/ping', (req: Request, res: Response): void => {
  res.status(200).json({
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

router.get('/version', (req: Request, res: Response): void => {
  res.status(200).json({
    version: process.env.npm_package_version || '1.0.0',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

export { router as healthRouter };