import express from 'express';
import { errorHandler } from './middleware/errrorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.route.js';
import categoryRoutes from './routes/category.route.js';
import orderRoutes from './routes/orders.route.js';

// cors must run before routes (and before credentialed requests fail preflight)
app.use(cors({
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);

// health check
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// error handler
app.use(errorHandler);

export default app; 