import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
class Database {
    static instance;
    static isConnected = false;
    static getInstance() {
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
            if (process.env.NODE_ENV === 'development') {
                Database.instance.$on('query', (e) => {
                    logger.debug(`Query: ${e.query}`);
                    logger.debug(`Params: ${e.params}`);
                    logger.debug(`Duration: ${e.duration}ms`);
                });
            }
            Database.instance.$on('error', (e) => {
                logger.error('Database error:', e);
            });
            process.on('beforeExit', async () => {
                await Database.disconnect();
            });
        }
        return Database.instance;
    }
    static async connect() {
        try {
            const client = Database.getInstance();
            await client.$connect();
            Database.isConnected = true;
            logger.info('Database connected successfully');
        }
        catch (error) {
            logger.error('Database connection failed:', error);
            throw new Error('Failed to connect to database');
        }
    }
    static async disconnect() {
        if (Database.instance && Database.isConnected) {
            await Database.instance.$disconnect();
            Database.isConnected = false;
            logger.info('Database disconnected');
        }
    }
    static async isHealthy() {
        try {
            const client = Database.getInstance();
            await client.$queryRaw `SELECT 1`;
            return true;
        }
        catch (error) {
            logger.error('Database health check failed:', error);
            return false;
        }
    }
    static getConnectionStatus() {
        return Database.isConnected;
    }
}
export { Database };
export default Database.getInstance();
//# sourceMappingURL=database.js.map