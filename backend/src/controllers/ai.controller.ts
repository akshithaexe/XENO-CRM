import { Request, Response, NextFunction } from 'express';
import { suggestSegment, draftMessage, getInsights, chatWithAgent } from '../services/openaiService';
import { getOverviewAnalytics } from '../services/analyticsService';

export const aiSuggestSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description } = req.body;
    if (!description) {
      res.status(400).json({ success: false, error: 'Description is required' });
      return;
    }
    const rules = await suggestSegment(description);
    res.json({ success: true, data: { rules } });
  } catch (error) {
    next(error);
  }
};

export const aiDraftMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { segmentDescription, channel, tone, goal } = req.body;
    if (!segmentDescription || !channel) {
      res.status(400).json({ success: false, error: 'segmentDescription and channel are required' });
      return;
    }
    const message = await draftMessage({ segmentDescription, channel, tone, goal });
    res.json({ success: true, data: { message } });
  } catch (error) {
    next(error);
  }
};

export const aiInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analyticsData = await getOverviewAnalytics();
    const insights = await getInsights(analyticsData);
    res.json({ success: true, data: { insights } });
  } catch (error) {
    next(error);
  }
};

export const aiChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ success: false, error: 'message is required' });
      return;
    }
    const reply = await chatWithAgent(message, history || []);
    res.json({ success: true, data: { reply } });
  } catch (error) {
    next(error);
  }
};
