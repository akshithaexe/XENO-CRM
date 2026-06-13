import { Router, Request, Response } from 'express';
import { simulateDelivery } from '../services/simulator';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { campaignId, customerId, logId, channel, message } = req.body;

  if (!campaignId || !customerId || !logId || !channel || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Kick off async delivery simulation
  simulateDelivery({ campaignId, customerId, logId, channel, message });

  console.log(`[Send] Accepted message for customer ${customerId} via ${channel}`);
  res.json({ success: true, message: 'Message accepted for delivery' });
});

export default router;
