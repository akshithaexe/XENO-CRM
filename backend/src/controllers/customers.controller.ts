import { Request, Response, NextFunction } from 'express';
import supabase from '../config/db';
import { toCamelCase } from '../utils/mappers';
import { logger } from '../utils/logger';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, search, tags, sortBy = 'created_at', order = 'desc' } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const ascending = order === 'asc';

    // Map camelCase sort fields to snake_case
    const sortMap: Record<string, string> = {
      createdAt: 'created_at', totalSpend: 'total_spend',
      visitCount: 'visit_count', lastVisit: 'last_visit',
      name: 'name', email: 'email',
    };
    const sortCol = sortMap[sortBy as string] || (sortBy as string);

    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .order(sortCol, { ascending })
      .range(offset, offset + Number(limit) - 1);

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    if (tags) {
      const tagArray = (tags as string).split(',').map((t) => t.trim());
      query = query.contains('tags', tagArray);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data: (data || []).map(toCamelCase),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Customer not found' });
      return;
    }
    res.json({ success: true, data: toCamelCase(data) });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, tags, metadata, totalSpend, visitCount, lastVisit } = req.body;
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name, email, phone,
        tags: tags || [],
        metadata: metadata || {},
        total_spend: totalSpend || 0,
        visit_count: visitCount || 0,
        last_visit: lastVisit || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        res.status(409).json({ success: false, error: 'Customer with this email already exists' });
        return;
      }
      throw error;
    }
    logger.info(`Customer created: ${email}`);
    res.status(201).json({ success: true, data: toCamelCase(data) });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates: Record<string, any> = {};
    const fieldMap: Record<string, string> = {
      name: 'name', email: 'email', phone: 'phone', tags: 'tags',
      metadata: 'metadata', totalSpend: 'total_spend',
      visitCount: 'visit_count', lastVisit: 'last_visit',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (req.body[key] !== undefined) updates[col] = req.body[key];
    }

    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Customer not found' });
      return;
    }
    res.json({ success: true, data: toCamelCase(data) });
  } catch (error) {
    next(error);
  }
};

export const bulkCreateCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customers } = req.body;
    if (!Array.isArray(customers) || customers.length === 0) {
      res.status(400).json({ success: false, error: 'customers array is required' });
      return;
    }

    const rows = customers.map((c: any) => ({
      name: c.name,
      email: c.email,
      phone: c.phone || null,
      tags: c.tags || [],
      metadata: c.metadata || {},
      total_spend: c.totalSpend || 0,
      visit_count: c.visitCount || 0,
      last_visit: c.lastVisit || null,
    }));

    const { data, error } = await supabase.from('customers').insert(rows).select();
    if (error) throw error;

    logger.info(`Bulk created ${(data || []).length} customers`);
    res.status(201).json({ success: true, data: (data || []).map(toCamelCase), count: (data || []).length });
  } catch (error) {
    next(error);
  }
};
