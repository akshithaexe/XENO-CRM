-- =========================================
-- Xeno CRM — Supabase Schema
-- Run this in Supabase SQL Editor
-- =========================================

-- Enable UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- CUSTOMERS
-- =========================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  total_spend NUMERIC(12,2) DEFAULT 0,
  visit_count INT DEFAULT 0,
  last_visit TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_tags ON customers USING GIN(tags);
CREATE INDEX idx_customers_total_spend ON customers(total_spend);
CREATE INDEX idx_customers_last_visit ON customers(last_visit);

-- =========================================
-- ORDERS
-- =========================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  date TIMESTAMPTZ DEFAULT NOW(),
  channel TEXT DEFAULT 'online' CHECK (channel IN ('online', 'in-store', 'phone')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(date DESC);

-- =========================================
-- SEGMENTS
-- =========================================
CREATE TABLE IF NOT EXISTS segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  rules JSONB NOT NULL,
  audience_count INT DEFAULT 0,
  created_by TEXT DEFAULT 'system',
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- CAMPAIGNS
-- =========================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  segment_id UUID NOT NULL REFERENCES segments(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'email', 'rcs')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'running', 'completed', 'paused', 'failed')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  stats JSONB DEFAULT '{"sent":0,"delivered":0,"opened":0,"clicked":0,"failed":0}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- COMMUNICATION LOGS
-- =========================================
CREATE TABLE IF NOT EXISTS communication_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'failed', 'bounced')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commlogs_campaign_id ON communication_logs(campaign_id);
CREATE INDEX idx_commlogs_customer_id ON communication_logs(customer_id);
CREATE INDEX idx_commlogs_campaign_status ON communication_logs(campaign_id, status);

-- =========================================
-- AUTO-UPDATE updated_at TRIGGER
-- =========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_segments_updated_at BEFORE UPDATE ON segments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_commlogs_updated_at BEFORE UPDATE ON communication_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================
-- ROW LEVEL SECURITY (open for service role)
-- =========================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;

-- Allow full access for service_role (backend uses service role key)
CREATE POLICY "Service role full access" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON segments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON communication_logs FOR ALL USING (true) WITH CHECK (true);
