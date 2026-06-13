import { Router } from 'express';
import { aiSuggestSegment, aiDraftMessage, aiInsights, aiChat } from '../controllers/ai.controller';

const router = Router();

router.post('/suggest-segment', aiSuggestSegment);
router.post('/draft-message', aiDraftMessage);
router.get('/insights', aiInsights);
router.post('/chat', aiChat);

export default router;
