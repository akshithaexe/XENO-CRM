export interface SegmentRule {
  field: string;
  operator: string;
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
  audienceCount: number;
  createdBy: string;
  isAIGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}
