export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  tags: string[];
  metadata: Record<string, any>;
  total_spend: number;
  visit_count: number;
  last_visit: string | null;
  created_at: string;
  updated_at: string;
}

export const CUSTOMER_WRITABLE_FIELDS = [
  'name', 'email', 'phone', 'tags', 'metadata',
  'total_spend', 'visit_count', 'last_visit',
];
