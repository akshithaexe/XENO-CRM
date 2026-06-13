import { Request, Response, NextFunction } from 'express';
import supabase from '../config/db';
import { toCamelCase } from '../utils/mappers';
import { logger } from '../utils/logger';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId, items, amount, date, channel, status } = req.body;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        items: items || [],
        amount,
        date: date || new Date().toISOString(),
        channel: channel || 'online',
        status: status || 'completed',
      })
      .select()
      .single();

    if (error) throw error;

    // Update customer stats
    const { data: customer } = await supabase
      .from('customers')
      .select('total_spend, visit_count')
      .eq('id', customerId)
      .single();

    if (customer) {
      await supabase
        .from('customers')
        .update({
          total_spend: (customer.total_spend || 0) + amount,
          visit_count: (customer.visit_count || 0) + 1,
          last_visit: date || new Date().toISOString(),
        })
        .eq('id', customerId);
    }

    logger.info(`Order created for customer ${customerId}`);
    res.status(201).json({ success: true, data: toCamelCase(data) });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { data, count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('customer_id', req.params.customerId)
      .order('date', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

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

export const bulkCreateOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders) || orders.length === 0) {
      res.status(400).json({ success: false, error: 'orders array is required' });
      return;
    }

    const rows = orders.map((o: any) => ({
      customer_id: o.customerId,
      items: o.items || [],
      amount: o.amount,
      date: o.date || new Date().toISOString(),
      channel: o.channel || 'online',
      status: o.status || 'completed',
    }));

    const { data, error } = await supabase.from('orders').insert(rows).select();
    if (error) throw error;

    logger.info(`Bulk created ${(data || []).length} orders`);
    res.status(201).json({ success: true, data: (data || []).map(toCamelCase), count: (data || []).length });
  } catch (error) {
    next(error);
  }
};
