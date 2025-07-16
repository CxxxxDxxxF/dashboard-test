import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Database } from '../config/database.js';
import { logger } from '../utils/logger.js';
const router = Router();
router.get('/', asyncHandler(async (req, res) => {
    const dbHealth = await Database.isHealthy();
    const dbConnected = Database.getConnectionStatus();
    const healthStatus = {
        status: dbHealth && dbConnected ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env['NODE_ENV'] || 'development',
        services: {
            database: {
                status: dbHealth ? 'connected' : 'disconnected',
                connected: dbConnected,
            },
            api: {
                status: 'running',
                version: '1.0.0',
            },
        },
    };
    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    logger.info('Health check requested', { status: healthStatus.status });
    res.status(statusCode).json(healthStatus);
}));
router.get('/ready', asyncHandler(async (req, res) => {
    const dbHealth = await Database.isHealthy();
    if (!dbHealth) {
        res.status(503).json({
            status: 'not ready',
            message: 'Database connection not available',
        });
        return;
    }
    res.status(200).json({
        status: 'ready',
        message: 'Service is ready to accept requests',
    });
}));
router.get('/live', (req, res) => {
    res.status(200).json({
        status: 'alive',
        message: 'Service is running',
    });
});
export default router;
//# sourceMappingURL=health.js.map