import { Router } from 'express';
import { campaignAnalytics, overviewAnalytics } from '../controllers/analytics.controller';

const router = Router();

router.get('/overview', overviewAnalytics);
router.get('/campaigns/:id', campaignAnalytics);

export default router;
