import { Request, Response, NextFunction } from 'express';
import supabase from '../config/db';
import { toCamelCase } from '../utils/mappers';
import { evaluateSegment, getSegmentAudienceCount } from '../services/segmentEngine';
import { logger } from '../utils/logger';

export const getSegments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('segments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: (data || []).map(toCamelCase) });
  } catch (error) {
    next(error);
  }
};

export const getSegmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('segments')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Segment not found' });
      return;
    }
    res.json({ success: true, data: toCamelCase(data) });
  } catch (error) {
    next(error);
  }
};

export const createSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, rules, createdBy, isAIGenerated } = req.body;

    // Calculate audience count
    const audienceCount = await getSegmentAudienceCount(rules);

    const { data, error } = await supabase
      .from('segments')
      .insert({
        name,
        description: description || '',
        rules,
        audience_count: audienceCount,
        created_by: createdBy || 'system',
        is_ai_generated: isAIGenerated || false,
      })
      .select()
      .single();

    if (error) throw error;

    logger.info(`Segment created: ${name} (audience: ${audienceCount})`);
    res.status(201).json({ success: true, data: toCamelCase(data) });
  } catch (error) {
    next(error);
  }
};

export const updateSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates: Record<string, any> = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.rules !== undefined) {
      updates.rules = req.body.rules;
      updates.audience_count = await getSegmentAudienceCount(req.body.rules);
    }

    const { data, error } = await supabase
      .from('segments')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Segment not found' });
      return;
    }
    res.json({ success: true, data: toCamelCase(data) });
  } catch (error) {
    next(error);
  }
};

export const deleteSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await supabase.from('segments').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Segment deleted' });
  } catch (error) {
    next(error);
  }
};

export const previewSegment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rules } = req.body;
    const { customerIds, count } = await evaluateSegment(rules);
    res.json({
      success: true,
      data: { audienceCount: count, sampleCustomerIds: customerIds.slice(0, 10) },
    });
  } catch (error) {
    next(error);
  }
};
