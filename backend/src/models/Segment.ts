export interface SegmentRule {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'not_contains';
  value: any;
}

export interface SegmentRuleGroup {
  logic: 'AND' | 'OR';
  conditions: (SegmentRule | SegmentRuleGroup)[];
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  rules: SegmentRuleGroup;
  audience_count: number;
  created_by: string;
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export const SEGMENT_WRITABLE_FIELDS = [
  'name', 'description', 'rules', 'audience_count',
  'created_by', 'is_ai_generated',
];
