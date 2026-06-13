import { SupabaseClient } from '@supabase/supabase-js';
import { SegmentRule, SegmentRuleGroup } from '../models/Segment';

/**
 * Maps our operator names to Supabase PostgREST filter methods.
 */
const OPERATOR_MAP: Record<string, string> = {
  eq: 'eq',
  neq: 'neq',
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  contains: 'ilike',
  not_contains: 'not.ilike',
  in: 'in',
  nin: 'not.in',
};

/**
 * Maps our rule field names to actual DB column names (snake_case).
 */
const FIELD_MAP: Record<string, string> = {
  totalSpend: 'total_spend',
  visitCount: 'visit_count',
  lastVisit: 'last_visit',
  createdAt: 'created_at',
  name: 'name',
  email: 'email',
  phone: 'phone',
  tags: 'tags',
  total_spend: 'total_spend',
  visit_count: 'visit_count',
  last_visit: 'last_visit',
  created_at: 'created_at',
};

/**
 * Builds a single PostgREST filter string from a rule.
 * Returns a string like: "total_spend.gt.500"
 */
function buildFilterString(rule: SegmentRule): string {
  const col = FIELD_MAP[rule.field] || rule.field;
  const op = OPERATOR_MAP[rule.operator] || 'eq';

  let val = rule.value;

  if (op === 'ilike' || op === 'not.ilike') {
    val = `%${val}%`;
  }

  if (op === 'in' || op === 'not.in') {
    const arr = Array.isArray(val) ? val : [val];
    return `${col}.${op}.(${arr.join(',')})`;
  }

  // For 'contains' on arrays (tags), use the 'cs' operator
  if (rule.field === 'tags' && (rule.operator === 'contains' || rule.operator === 'in')) {
    const arr = Array.isArray(val) ? val : [val];
    return `tags.cs.{${arr.join(',')}}`;
  }

  return `${col}.${op}.${val}`;
}

/**
 * Recursively builds a PostgREST-compatible filter string for a rule group.
 * For AND: each filter is chained (default PostgREST behavior)
 * For OR: conditions are joined with comma in .or() 
 */
function buildGroupFilterString(group: SegmentRuleGroup): string {
  const parts: string[] = [];

  for (const condition of group.conditions) {
    if ('logic' in condition && 'conditions' in condition) {
      // Nested group — wrap in and() or or()
      const nested = buildGroupFilterString(condition as SegmentRuleGroup);
      parts.push(nested);
    } else {
      const rule = condition as SegmentRule;
      parts.push(buildFilterString(rule));
    }
  }

  if (group.logic === 'OR') {
    return parts.join(',');
  }

  // For AND, wrap in and()
  return `and(${parts.join(',')})`;
}

/**
 * Applies segment rules to a Supabase query on the customers table.
 * Returns a query builder with filters applied.
 */
export function applySegmentFilters(
  query: any,
  rules: SegmentRuleGroup
): any {
  if (!rules.conditions || rules.conditions.length === 0) {
    return query;
  }

  // Build filter strings and apply them
  for (const condition of rules.conditions) {
    if ('logic' in condition && 'conditions' in condition) {
      // Nested group
      const nested = condition as SegmentRuleGroup;
      const filterStr = buildGroupFilterString(nested);
      if (nested.logic === 'OR') {
        query = query.or(filterStr);
      } else {
        query = query.or(filterStr); // and() is default
      }
    } else {
      const rule = condition as SegmentRule;
      const col = FIELD_MAP[rule.field] || rule.field;
      const val = rule.value;

      switch (rule.operator) {
        case 'eq':
          query = query.eq(col, val);
          break;
        case 'neq':
          query = query.neq(col, val);
          break;
        case 'gt':
          query = query.gt(col, val);
          break;
        case 'gte':
          query = query.gte(col, val);
          break;
        case 'lt':
          query = query.lt(col, val);
          break;
        case 'lte':
          query = query.lte(col, val);
          break;
        case 'contains':
          if (rule.field === 'tags') {
            query = query.contains(col, Array.isArray(val) ? val : [val]);
          } else {
            query = query.ilike(col, `%${val}%`);
          }
          break;
        case 'not_contains':
          query = query.not(col, 'ilike', `%${val}%`);
          break;
        case 'in':
          query = query.in(col, Array.isArray(val) ? val : [val]);
          break;
        case 'nin':
          query = query.not(col, 'in', `(${(Array.isArray(val) ? val : [val]).join(',')})`);
          break;
      }
    }
  }

  // If top-level logic is OR, we need to combine differently
  if (rules.logic === 'OR' && rules.conditions.length > 1) {
    const parts = (rules.conditions as SegmentRule[]).map((r) => {
      const col = FIELD_MAP[r.field] || r.field;
      const opMap: Record<string, string> = {
        eq: 'eq', neq: 'neq', gt: 'gt', gte: 'gte',
        lt: 'lt', lte: 'lte', contains: 'ilike', in: 'in',
      };
      const op = opMap[r.operator] || 'eq';
      let v = r.value;
      if (r.operator === 'contains') v = `%${v}%`;
      return `${col}.${op}.${v}`;
    });
    // Re-do query with OR filter
    return query.or(parts.join(','));
  }

  return query;
}
