import { Pool, PoolConfig } from 'pg';
import { logger } from '@/utils/logger';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  min: number;
  max: number;
  connectionTimeoutMillis: number;
  idleTimeoutMillis: number;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'finance_practice_dev',
  user: process.env.DB_USER || 'finance_user',
  password: process.env.DB_PASSWORD || 'finance_password',
  ssl: process.env.DB_SSL === 'true',
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  max: parseInt(process.env.DB_POOL_MAX || '10'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
};

const poolConfig: PoolConfig = {
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.user,
  password: config.password,
  ssl: config.ssl ? { rejectUnauthorized: false } : false,
  min: config.min,
  max: config.max,
  connectionTimeoutMillis: config.connectionTimeoutMillis,
  idleTimeoutMillis: config.idleTimeoutMillis,
};

const pool = new Pool(poolConfig);

pool.on('connect', (client) => {
  logger.debug(`Connected to database: ${config.database}`);
});

pool.on('error', (err) => {
  logger.error('Database pool error:', err);
});

pool.on('remove', (client) => {
  logger.debug('Database client removed from pool');
});

const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version()');
    logger.info('Database connection test successful:', {
      currentTime: result.rows[0].current_time,
      version: result.rows[0].version.substring(0, 50) + '...'
    });
    client.release();
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
};

const executeQuery = async <T = any>(
  text: string,
  params?: any[]
): Promise<T[]> => {
  const client = await pool.connect();
  try {
    const start = Date.now();
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.ENABLE_QUERY_LOGGING === 'true') {
      logger.debug('Query executed:', {
        text: text.substring(0, 100) + '...',
        duration: `${duration}ms`,
        rows: result.rowCount
      });
    }
    
    return result.rows as T[];
  } finally {
    client.release();
  }
};

const executeTransaction = async <T = any>(
  queries: Array<{ text: string; params?: any[] }>
): Promise<T[][]> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const results: T[][] = [];
    for (const query of queries) {
      const result = await client.query(query.text, query.params);
      results.push(result.rows as T[]);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const shutdown = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info('Database pool closed successfully');
  } catch (error) {
    logger.error('Error closing database pool:', error);
  }
};

export {
  pool,
  config,
  testConnection,
  executeQuery,
  executeTransaction,
  shutdown
};