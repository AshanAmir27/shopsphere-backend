import 'dotenv/config';
import app from './app.js';
import connectDB from './config/connectDB.js';
import mongoose from 'mongoose';

const port = Number(process.env.PORT || '5000');
const SHUTDOWN_TIMEOUT = 10_000;

const startServer = async () => {
    await connectDB();

    const server = app.listen(port, '0.0.0.0', () => {
        console.log(
            `Server is running on port ${port} in ${
                process.env.NODE_ENV || 'development'
            } mode`
        );
    });

    let isShuttingDown = false;

    const gracefulShutdown = async (signal: string) => {
        if (isShuttingDown) {
            console.log('Shutdown already in progress...');
            return;
        }

        isShuttingDown = true;

        console.log(`${signal} received. Starting graceful shutdown...`);

        const forceShutdownTimer = setTimeout(() => {
            console.error(
                'Graceful shutdown timed out. Forcing process exit.'
            );

            process.exit(1);
        }, SHUTDOWN_TIMEOUT);

        try {
            // 1. Stop accepting new HTTP connections
            await new Promise<void>((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });

            console.log('HTTP server closed');

            // 2. Close MongoDB connection
            await mongoose.connection.close();

            console.log('MongoDB connection closed');

            // 3. Shutdown completed successfully
            clearTimeout(forceShutdownTimer);

            console.log('Graceful shutdown completed');

            process.exit(0);
        } catch (error) {
            clearTimeout(forceShutdownTimer);

            console.error('Error during graceful shutdown:', error);

            process.exit(1);
        }
    };

    process.on('SIGTERM', () => {
        gracefulShutdown('SIGTERM');
    });

    process.on('SIGINT', () => {
        gracefulShutdown('SIGINT');
    });
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});