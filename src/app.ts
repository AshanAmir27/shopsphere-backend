import express from 'express';
import { errorHandler } from './middleware/errrorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';

// create express app
const app = express();

// routes
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.route.js';
import categoryRoutes from './routes/category.route.js';
import orderRoutes from './routes/orders.route.js';

// frontend url
const frontendUrl = (process.env.NODE_ENV === 'production') ? (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
) : "http://localhost:3000";

// cors options
const corsOptions = {
  origin: frontendUrl,
  credentials: true,
}
app.use(cors(corsOptions));

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);

// health check
app.get('/api/v1/health/live', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});


app.get('/api/v1/health/ready', (req, res) => {
  const mongoReady = mongoose.connection.readyState === 1;

  if (!mongoReady) {
    return res.status(503).json({
      status: 'not_ready',
      dependencies: {
        mongodb: 'not_ready',
      },
    });
  }

  res.status(200).json({
    status: 'ready',
    dependencies: {
      mongodb: 'ready',
    },
  });
});

// error handler
app.use(errorHandler);

// export app
export default app; 