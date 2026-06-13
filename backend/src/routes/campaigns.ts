import { Router } from 'express';
import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  launchCampaign,
  getCampaignLogs,
} from '../controllers/campaigns.controller';

const router = Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.get('/:id/logs', getCampaignLogs);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);
router.post('/:id/launch', launchCampaign);

export default router;
