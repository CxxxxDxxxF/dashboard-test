import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

/**
 * Database configuration and Prisma client setup
 * Handles connection pooling, logging, and error handling
 */
class Database {
  private static instance: PrismaClient;
  private static isConnected = false;

  /**
   * Get singleton Prisma client instance
   * @returns PrismaClient instance
   */
  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'event' },
          { level: 'info', emit: 'event' },
          { level: 'warn', emit: 'event' },
        ],
        errorFormat: 'pretty',
      });

      // Log queries in development
      if (process.env.NODE_ENV === 'development') {
        Database.instance.$on('query', (e) => {
          logger.debug(`Query: ${e.query}`);
          logger.debug(`Params: ${e.params}`);
          logger.debug(`Duration: ${e.duration}ms`);
        });
      }

      // Log errors
      Database.instance.$on('error', (e) => {
        logger.error('Database error:', e);
      });

      // Handle graceful shutdown
      process.on('beforeExit', async () => {
        await Database.disconnect();
      });
    }

    return Database.instance;
  }

  /**
   * Connect to database
   * @throws Error if connection fails
   */
  public static async connect(): Promise<void> {
    try {
      const client = Database.getInstance();
      await client.$connect();
      Database.isConnected = true;
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw new Error('Failed to connect to database');
    }
  }

  /**
   * Disconnect from database
   */
  public static async disconnect(): Promise<void> {
    if (Database.instance && Database.isConnected) {
      await Database.instance.$disconnect();
      Database.isConnected = false;
      logger.info('Database disconnected');
    }
  }

  /**
   * Check database connection health
   * @returns boolean indicating connection status
   */
  public static async isHealthy(): Promise<boolean> {
    try {
      const client = Database.getInstance();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Get connection status
   * @returns boolean indicating if connected
   */
  public static getConnectionStatus(): boolean {
    return Database.isConnected;
  }
}

export { Database };
export default Database.getInstance(); 