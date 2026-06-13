import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import sendRoutes from './routes/send';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'channel-service', timestamp: new Date().toISOString() });
});

// Routes
app.use('/send', sendRoutes);

app.listen(PORT, () => {
  console.log(`📡 Channel service running on http://localhost:${PORT}`);
});

export default app;
