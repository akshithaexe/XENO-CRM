import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
  { auth: { persistSession: false } }
);

// ── Realistic demo data ──────────────────────────────────────────────

const FIRST_NAMES = [
  'Aarav', 'Priya', 'Arjun', 'Sneha', 'Rohan', 'Kavya', 'Vikram', 'Ananya',
  'Dev', 'Meera', 'Karthik', 'Nisha', 'Rahul', 'Pooja', 'Aditya', 'Divya',
  'James', 'Sarah', 'Michael', 'Emma', 'David', 'Sophia', 'Chris', 'Olivia',
  'Alex', 'Isabella', 'Daniel', 'Ava', 'Ethan', 'Mia', 'Liam', 'Charlotte',
  'Sanjay', 'Ritu', 'Amit', 'Neha', 'Raj', 'Anjali', 'Manish', 'Swati',
  'Omar', 'Fatima', 'Yuki', 'Sakura', 'Chen', 'Li', 'John', 'Emily',
  'Akash', 'Tanya',
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Jain', 'Mehta',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson',
  'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Lee',
  'Desai', 'Nair', 'Rao', 'Iyer', 'Chopra', 'Bhat', 'Verma', 'Malhotra',
  'Khan', 'Ahmed', 'Tanaka', 'Nakamura', 'Wang', 'Zhang', 'Clark', 'Lewis',
  'Robinson', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Hill',
  'Agarwal', 'Pillai',
];

const TAGS_POOL = [
  'loyal', 'new', 'high-spender', 'dormant', 'vip', 'deal-seeker',
  'frequent-buyer', 'email-engaged', 'whatsapp-user', 'premium',
  'seasonal', 'referral', 'mobile-shopper', 'weekend-shopper',
];

const PRODUCT_NAMES = [
  'Wireless Earbuds', 'Running Shoes', 'Yoga Mat', 'Protein Powder',
  'Smart Watch', 'Cotton T-Shirt', 'Laptop Stand', 'Water Bottle',
  'Backpack', 'Sunglasses', 'Face Moisturizer', 'Bluetooth Speaker',
  'Desk Lamp', 'Travel Mug', 'Phone Case', 'Resistance Bands',
  'Essential Oil Set', 'Leather Wallet', 'Fitness Tracker', 'Notebook Set',
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ── Seed Functions ───────────────────────────────────────────────────

const BATCH_SIZE = 200; // Supabase max rows per insert

async function clearData() {
  console.log('🧹 Clearing existing data...');
  await supabase.from('communication_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('campaigns').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('segments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('  ✅ Old data cleared');
}

async function seedCustomers(): Promise<string[]> {
  console.log('🌱 Seeding 1000 customers...');
  const allIds: string[] = [];
  const TOTAL = 1000;

  for (let batch = 0; batch < TOTAL; batch += BATCH_SIZE) {
    const customers = [];
    const end = Math.min(batch + BATCH_SIZE, TOTAL);

    for (let i = batch; i < end; i++) {
      const first = rand(FIRST_NAMES);
      const last = rand(LAST_NAMES);
      const tagCount = randInt(1, 4);
      const tags: string[] = [];
      while (tags.length < tagCount) {
        const t = rand(TAGS_POOL);
        if (!tags.includes(t)) tags.push(t);
      }

      customers.push({
        name: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}.${i}@example.com`,
        phone: `+91${randInt(70000, 99999)}${randInt(10000, 99999)}`,
        tags,
        metadata: { source: rand(['web', 'app', 'referral', 'organic', 'ads']), city: rand(['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'New York', 'London', 'Singapore']) },
        total_spend: parseFloat((Math.random() * 5000).toFixed(2)),
        visit_count: randInt(1, 50),
        last_visit: daysAgo(randInt(0, 180)),
      });
    }

    const { data, error } = await supabase.from('customers').insert(customers).select('id');
    if (error) { console.error(`❌ Customer batch error (${batch}):`, error.message); continue; }
    allIds.push(...data.map((c: { id: string }) => c.id));
    process.stdout.write(`  📦 ${allIds.length}/${TOTAL}\r`);
  }

  console.log(`  ✅ ${allIds.length} customers created        `);
  return allIds;
}

async function seedOrders(customerIds: string[]): Promise<void> {
  console.log('🌱 Seeding 4000 orders...');
  const TOTAL = 4000;
  let created = 0;

  for (let batch = 0; batch < TOTAL; batch += BATCH_SIZE) {
    const orders = [];
    const end = Math.min(batch + BATCH_SIZE, TOTAL);

    for (let i = batch; i < end; i++) {
      const itemCount = randInt(1, 4);
      const items = [];
      let total = 0;

      for (let j = 0; j < itemCount; j++) {
        const price = parseFloat((Math.random() * 200 + 10).toFixed(2));
        const qty = randInt(1, 3);
        items.push({ name: rand(PRODUCT_NAMES), quantity: qty, price });
        total += price * qty;
      }

      orders.push({
        customer_id: rand(customerIds),
        items,
        amount: parseFloat(total.toFixed(2)),
        date: daysAgo(randInt(0, 365)),
        channel: rand(['online', 'in-store', 'phone']),
        status: rand(['completed', 'completed', 'completed', 'pending', 'cancelled']),
      });
    }

    const { error } = await supabase.from('orders').insert(orders);
    if (error) { console.error(`❌ Order batch error (${batch}):`, error.message); continue; }
    created += orders.length;
    process.stdout.write(`  📦 ${created}/${TOTAL}\r`);
  }

  console.log(`  ✅ ${created} orders created            `);
}

async function seedSegments(): Promise<string[]> {
  console.log('🌱 Seeding segments...');

  const segments = [
    {
      name: 'High Spenders',
      description: 'Customers who have spent more than $1000 total',
      rules: { logic: 'AND', conditions: [{ field: 'totalSpend', operator: 'gt', value: 1000 }] },
      created_by: 'system',
      is_ai_generated: false,
    },
    {
      name: 'Inactive (90+ days)',
      description: 'Customers who haven\'t visited in the last 90 days',
      rules: { logic: 'AND', conditions: [{ field: 'lastVisit', operator: 'lt', value: daysAgo(90) }] },
      created_by: 'system',
      is_ai_generated: false,
    },
    {
      name: 'Loyal Visitors',
      description: 'Customers with 10+ visits and at least $500 spend',
      rules: {
        logic: 'AND',
        conditions: [
          { field: 'visitCount', operator: 'gte', value: 10 },
          { field: 'totalSpend', operator: 'gte', value: 500 },
        ],
      },
      created_by: 'system',
      is_ai_generated: false,
    },
    {
      name: 'New Customers',
      description: 'Recently joined customers (last 30 days)',
      rules: { logic: 'AND', conditions: [{ field: 'createdAt', operator: 'gte', value: daysAgo(30) }] },
      created_by: 'ai',
      is_ai_generated: true,
    },
  ];

  // Calculate audience counts
  const { count } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true });
  const totalCustomers = count || 50;

  const rows = segments.map((s) => ({
    ...s,
    audience_count: Math.floor(Math.random() * totalCustomers),
  }));

  const { data, error } = await supabase.from('segments').insert(rows).select('id');
  if (error) { console.error('❌ Segment seed error:', error.message); return []; }

  console.log(`  ✅ ${data.length} segments created`);
  return data.map((s: { id: string }) => s.id);
}

async function seedCampaigns(segmentIds: string[]): Promise<void> {
  console.log('🌱 Seeding campaigns...');
  if (segmentIds.length === 0) return;

  const campaigns = [
    {
      name: 'Summer Sale Blast 🔥',
      segment_id: segmentIds[0],
      message: 'Hey! Our biggest summer sale is LIVE — up to 60% off on your favorite picks. Shop now before it\'s gone! 🛍️',
      channel: 'email',
      status: 'completed',
      stats: { sent: 42, delivered: 38, opened: 25, clicked: 12, failed: 4 },
      completed_at: daysAgo(5),
    },
    {
      name: 'Win-back Inactive Users',
      segment_id: segmentIds.length > 1 ? segmentIds[1] : segmentIds[0],
      message: 'We miss you! 💝 Come back and enjoy 20% off your next order. Use code COMEBACK20.',
      channel: 'whatsapp',
      status: 'draft',
      stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0 },
    },
  ];

  const { error } = await supabase.from('campaigns').insert(campaigns);
  if (error) { console.error('❌ Campaign seed error:', error.message); return; }

  console.log(`  ✅ ${campaigns.length} campaigns created`);
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Starting Xeno CRM seed (1000 customers, 4000 orders)...\n');

  await clearData();

  const customerIds = await seedCustomers();
  if (customerIds.length === 0) { console.error('Aborting — no customers created'); return; }

  await seedOrders(customerIds);
  const segmentIds = await seedSegments();
  await seedCampaigns(segmentIds);

  console.log('\n✨ Seed complete! Your CRM is ready.\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
