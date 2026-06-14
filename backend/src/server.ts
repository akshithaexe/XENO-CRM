import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { testConnection } from './config/db';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { startRetryJob } from './jobs/retryFailedReceipts';
import { logger } from './utils/logger';

// Route imports
import customerRoutes from './routes/customers';
import orderRoutes from './routes/orders';
import segmentRoutes from './routes/segments';
import campaignRoutes from './routes/campaigns';
import receiptRoutes from './routes/receipts';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3035', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const start = async () => {
  await testConnection();
  startRetryJob();

  app.listen(PORT, () => {
    logger.info(`🚀 Backend server running on http://localhost:${PORT}`);
  });
};

if (process.env.VERCEL !== '1') {
  start().catch((err) => {
    logger.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
