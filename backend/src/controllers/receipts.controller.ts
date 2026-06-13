import { Request, Response, NextFunction } from 'express';
import { processReceipt } from '../services/receiptProcessor';

export const handleReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await processReceipt(req.body);
    res.json({ success: true, message: 'Receipt processed' });
  } catch (error) {
    next(error);
  }
};
