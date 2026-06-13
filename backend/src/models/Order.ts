export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_id: string;
  items: OrderItem[];
  amount: number;
  date: string;
  channel: 'online' | 'in-store' | 'phone';
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  created_at: string;
  updated_at: string;
}

export const ORDER_WRITABLE_FIELDS = [
  'customer_id', 'items', 'amount', 'date', 'channel', 'status',
];
