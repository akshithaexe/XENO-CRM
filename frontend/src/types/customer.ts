export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  metadata: Record<string, any>;
  totalSpend: number;
  visitCount: number;
  lastVisit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  search?: string;
  tags?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
