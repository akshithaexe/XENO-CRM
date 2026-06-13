import { Router } from 'express';
import { handleReceipt } from '../controllers/receipts.controller';

const router = Router();

router.post('/', handleReceipt);

export default router;
