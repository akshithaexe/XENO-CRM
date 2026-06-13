import { Request, Response, NextFunction } from 'express';
import { getCampaignAnalytics, getOverviewAnalytics } from '../services/analyticsService';

export const campaignAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCampaignAnalytics(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const overviewAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getOverviewAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
