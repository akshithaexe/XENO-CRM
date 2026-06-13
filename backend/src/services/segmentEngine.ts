import supabase from '../config/db';
import { SegmentRuleGroup } from '../models/Segment';
import { applySegmentFilters } from '../utils/segmentQueryBuilder';
import { logger } from '../utils/logger';

/**
 * Evaluates segment rules against the customers table in Supabase.
 * Returns matching customer IDs and count.
 */
export async function evaluateSegment(rules: SegmentRuleGroup): Promise<{
  customerIds: string[];
  count: number;
}> {
  try {
    let query = supabase.from('customers').select('id');
    query = applySegmentFilters(query, rules);

    const { data, error } = await query;
    if (error) throw error;

    const customerIds = (data || []).map((c: { id: string }) => c.id);

    return {
      customerIds,
      count: customerIds.length,
    };
  } catch (error) {
    logger.error('Error evaluating segment:', error);
    throw error;
  }
}

/**
 * Returns the count of customers matching a segment's rules.
 */
export async function getSegmentAudienceCount(rules: SegmentRuleGroup): Promise<number> {
  let query = supabase.from('customers').select('id', { count: 'exact', head: true });
  query = applySegmentFilters(query, rules);

  const { count, error } = await query;
  if (error) {
    logger.error('Error counting segment audience:', error);
    return 0;
  }

  return count || 0;
}
