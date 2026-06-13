import { Request, Response, NextFunction } from 'express';
import supabase from '../config/db';
import { toCamelCase } from '../utils/mappers';
import { dispatchCampaign } from '../services/campaignDispatcher';
import { logger } from '../utils/logger';

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;

    let query = supabase
      .from('campaigns')
      .select('*, segments(name, audience_count)')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, data: (data || []).map(toCamelCase) });
  } catch (error) {
    next(error);
  }
};

export const getCampaignById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*, segments(*)')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Campaign not found' });
      return;
    }
    res.json({ success: true, data: toCamelCase(data) });
  } catch (error) {
    next(error);
  }
};

export const createCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, segmentId, message, channel, status, scheduledAt } = req.body;

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        name,
        segment_id: segmentId,
        message,
        channel,
        status: status || 'draft',
        scheduled_at: scheduledAt || null,
        stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0 },
      })
      .select()
      .single();

    if (error) throw error;

    logger.info(`Campaign created: ${name}`);
    res.status(201).json({ success: true, data: toCamelCase(data) });
  } catch (error) {
    next(error);
  }
};

export const updateCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check current status
    const { data: existing } = await supabase
      .from('campaigns')
      .select('status')
      .eq('id', req.params.id)
      .single();

    if (!existing) {
      res.status(404).json({ success: false, error: 'Campaign not found' });
      return;
    }

    if (existing.status === 'running' || existing.status === 'completed') {
      res.status(400).json({ success: false, error: 'Cannot update a running or completed campaign' });
      return;
    }

    const updates: Record<string, any> = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.segmentId !== undefined) updates.segment_id = req.body.segmentId;
    if (req.body.message !== undefined) updates.message = req.body.message;
    if (req.body.channel !== undefined) updates.channel = req.body.channel;
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.scheduledAt !== undefined) updates.scheduled_at = req.body.scheduledAt;

    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: toCamelCase(data) });
  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase.from('campaigns').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    next(error);
  }
};

export const launchCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, status')
      .eq('id', req.params.id)
      .single();

    if (!campaign) {
      res.status(404).json({ success: false, error: 'Campaign not found' });
      return;
    }

    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      res.status(400).json({ success: false, error: `Cannot launch campaign with status: ${campaign.status}` });
      return;
    }

    // Launch asynchronously
    dispatchCampaign(campaign.id).catch((err) => {
      logger.error('Background campaign dispatch failed:', err);
    });

    res.json({ success: true, message: 'Campaign launch initiated', data: { campaignId: campaign.id } });
  } catch (error) {
    next(error);
  }
};

export const getCampaignLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { data, count, error } = await supabase
      .from('communication_logs')
      .select('*, customers(name, email)', { count: 'exact' })
      .eq('campaign_id', req.params.id)
      .order('sent_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: (data || []).map(toCamelCase),
      pagination: { page: Number(page), limit: Number(limit), total: count || 0 },
    });
  } catch (error) {
    next(error);
  }
};
