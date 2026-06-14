import openrouter from '../config/openai';
import { getOverviewAnalytics } from './analyticsService';
import { logger } from '../utils/logger';
import supabase from '../config/db';

// Using a free model on OpenRouter
const MODEL = 'openrouter/free';

/**
 * Helper: wraps OpenRouter calls with retry on rate-limit (429) errors.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit =
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.includes('rate limit') ||
        error?.message?.includes('Rate limit');

      if (isRateLimit && attempt < retries) {
        const wait = (attempt + 1) * 3000;
        logger.warn(`OpenRouter rate limited, retrying in ${wait / 1000}s...`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      if (isRateLimit) {
        throw new Error('The AI service is temporarily rate-limited. Please wait a moment and try again.');
      }
      throw error;
    }
  }
  throw new Error('Unexpected retry failure');
}

/**
 * Suggests segment rules based on a natural language description.
 */
export async function suggestSegment(description: string): Promise<any> {
  return withRetry(async () => {
    const response = await openrouter.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a CRM segment builder assistant. Given a natural language description of a customer audience, return a JSON object representing segment rules.
Format:
{ "logic": "AND" or "OR", "conditions": [{ "field": "<field>", "operator": "<op>", "value": <value> }] }
Available fields: name, email, phone, tags, totalSpend, visitCount, lastVisit, createdAt.
Available operators: eq, neq, gt, gte, lt, lte, in, nin, contains, not_contains.
Return ONLY valid JSON with no explanation or markdown fences.`,
        },
        { role: 'user', content: description },
      ],
      temperature: 0.2,
    });

    const text = response.choices[0]?.message?.content?.trim() || '{}';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  });
}

/**
 * Drafts a marketing message using AI.
 */
export async function draftMessage(params: {
  segmentDescription: string;
  channel: string;
  tone?: string;
  goal?: string;
}): Promise<string> {
  return withRetry(async () => {
    const response = await openrouter.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a marketing copywriter for a CRM platform. Write compelling, concise messages. Return ONLY the message text.',
        },
        {
          role: 'user',
          content: `Write a ${params.channel} message for this audience: ${params.segmentDescription}.${params.tone ? ` Tone: ${params.tone}.` : ''}${params.goal ? ` Goal: ${params.goal}.` : ''} Include a clear call-to-action.`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  });
}

/**
 * Generates AI insights for campaign performance.
 */
export async function getInsights(analyticsData: any): Promise<string> {
  return withRetry(async () => {
    const response = await openrouter.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a marketing analytics expert. Analyze campaign performance data and provide 3-5 actionable bullet points. Be specific and data-driven.',
        },
        {
          role: 'user',
          content: `Analyze this data:\n${JSON.stringify(analyticsData, null, 2)}`,
        },
      ],
      temperature: 0.4,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  });
}

// ─── Database lookup helpers for the AI agent ────────────────────────────────

interface LookupIntent {
  action: string;
  params: Record<string, any>;
}

/**
 * Extracts structured database lookup intents from the user's message.
 * The AI decides what data it needs, then we query the DB and feed it back.
 */
async function extractLookupIntents(
  message: string,
  history: { role: string; content: string }[]
): Promise<LookupIntent[]> {
  const intentResponse = await openrouter.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a query planner for a CRM database. Given the user's message, determine what database lookups are needed to answer their question.

Available lookup actions:
- "search_customer": Search customers. Params: { "field": "phone"|"email"|"name"|"id", "value": "<search value>" }
- "list_customers": List customers with optional filters. Params: { "limit": <number>, "order_by": "created_at"|"total_spend"|"visit_count", "ascending": true|false }
- "get_customer_orders": Get orders for a customer. Params: { "customer_id": "<id>" } or { "customer_phone": "<phone>" } or { "customer_email": "<email>" }
- "search_orders": Search orders. Params: { "status": "pending"|"completed"|"cancelled"|"refunded", "limit": <number> }
- "get_campaign": Get campaign details. Params: { "name": "<name>" } or { "id": "<id>" }
- "list_campaigns": List campaigns. Params: { "status": "draft"|"scheduled"|"running"|"completed", "limit": <number> }
- "get_segment": Get segment details. Params: { "name": "<name>" } or { "id": "<id>" }
- "list_segments": List all segments. Params: { "limit": <number> }
- "get_communication_logs": Get message delivery logs. Params: { "campaign_id": "<id>", "limit": <number> }
- "none": No database lookup needed.

Return a JSON array of lookup intents. If no database lookup is needed, return [{"action":"none","params":{}}].
Return ONLY valid JSON array with no explanation or markdown fences.`,
      },
      ...history.slice(-4).map((h) => ({
        role: h.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: h.content,
      })),
      { role: 'user' as const, content: message },
    ],
    temperature: 0.1,
    max_tokens: 500,
  });

  const text = intentResponse.choices[0]?.message?.content?.trim() || '[{"action":"none","params":{}}]';
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const intents = JSON.parse(cleaned);
    return Array.isArray(intents) ? intents : [{ action: 'none', params: {} }];
  } catch {
    logger.warn('Failed to parse lookup intents:', cleaned);
    return [{ action: 'none', params: {} }];
  }
}

/**
 * Executes a single database lookup intent and returns the result as a string.
 */
async function executeLookup(intent: LookupIntent): Promise<string> {
  const { action, params } = intent;

  try {
    switch (action) {
      case 'search_customer': {
        const field = params.field || 'phone';
        const value = params.value || '';
        let query = supabase.from('customers').select('*');

        if (field === 'name') {
          query = query.ilike('name', `%${value}%`);
        } else if (field === 'phone') {
          // Try exact match first, then partial
          query = query.or(`phone.eq.${value},phone.ilike.%${value}%`);
        } else if (field === 'email') {
          query = query.ilike('email', `%${value}%`);
        } else if (field === 'id') {
          query = query.eq('id', value);
        }

        const { data, error } = await query.limit(5);
        if (error) return `Error searching customers: ${error.message}`;
        if (!data || data.length === 0) return `No customers found matching ${field}="${value}"`;
        return `Found ${data.length} customer(s):\n${JSON.stringify(data, null, 2)}`;
      }

      case 'list_customers': {
        const limit = params.limit || 10;
        const orderBy = params.order_by || 'created_at';
        const ascending = params.ascending ?? false;

        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order(orderBy, { ascending })
          .limit(limit);

        if (error) return `Error listing customers: ${error.message}`;
        return `Customers (${data?.length || 0}):\n${JSON.stringify(data, null, 2)}`;
      }

      case 'get_customer_orders': {
        let customerId = params.customer_id;

        // If we have phone or email instead of ID, look up the customer first
        if (!customerId && (params.customer_phone || params.customer_email)) {
          const field = params.customer_phone ? 'phone' : 'email';
          const value = params.customer_phone || params.customer_email;
          let custQuery = supabase.from('customers').select('id');
          if (field === 'phone') {
            custQuery = custQuery.or(`phone.eq.${value},phone.ilike.%${value}%`);
          } else {
            custQuery = custQuery.ilike('email', `%${value}%`);
          }
          const { data: cust } = await custQuery.limit(1).single();
          if (cust) customerId = cust.id;
          else return `No customer found with ${field}="${value}"`;
        }

        if (!customerId) return 'No customer identifier provided';

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', customerId)
          .order('date', { ascending: false })
          .limit(10);

        if (error) return `Error fetching orders: ${error.message}`;
        return `Orders (${data?.length || 0}):\n${JSON.stringify(data, null, 2)}`;
      }

      case 'search_orders': {
        let query = supabase.from('orders').select('*, customers(name, email, phone)');
        if (params.status) query = query.eq('status', params.status);
        const limit = params.limit || 10;

        const { data, error } = await query.order('date', { ascending: false }).limit(limit);
        if (error) return `Error searching orders: ${error.message}`;
        return `Orders (${data?.length || 0}):\n${JSON.stringify(data, null, 2)}`;
      }

      case 'get_campaign': {
        let query = supabase.from('campaigns').select('*, segments(name, audience_count)');
        if (params.id) query = query.eq('id', params.id);
        else if (params.name) query = query.ilike('name', `%${params.name}%`);
        else return 'No campaign identifier provided';

        const { data, error } = await query.limit(1).single();
        if (error) return `Campaign not found: ${error.message}`;
        return `Campaign details:\n${JSON.stringify(data, null, 2)}`;
      }

      case 'list_campaigns': {
        let query = supabase.from('campaigns').select('*, segments(name, audience_count)');
        if (params.status) query = query.eq('status', params.status);
        const limit = params.limit || 10;

        const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);
        if (error) return `Error listing campaigns: ${error.message}`;
        return `Campaigns (${data?.length || 0}):\n${JSON.stringify(data, null, 2)}`;
      }

      case 'get_segment': {
        let query = supabase.from('segments').select('*');
        if (params.id) query = query.eq('id', params.id);
        else if (params.name) query = query.ilike('name', `%${params.name}%`);
        else return 'No segment identifier provided';

        const { data, error } = await query.limit(1).single();
        if (error) return `Segment not found: ${error.message}`;
        return `Segment details:\n${JSON.stringify(data, null, 2)}`;
      }

      case 'list_segments': {
        const limit = params.limit || 10;
        const { data, error } = await supabase
          .from('segments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) return `Error listing segments: ${error.message}`;
        return `Segments (${data?.length || 0}):\n${JSON.stringify(data, null, 2)}`;
      }

      case 'get_communication_logs': {
        if (!params.campaign_id) return 'No campaign_id provided';
        const limit = params.limit || 20;

        const { data, error } = await supabase
          .from('communication_logs')
          .select('*, customers(name, email, phone)')
          .eq('campaign_id', params.campaign_id)
          .order('sent_at', { ascending: false })
          .limit(limit);

        if (error) return `Error fetching logs: ${error.message}`;
        return `Communication logs (${data?.length || 0}):\n${JSON.stringify(data, null, 2)}`;
      }

      case 'none':
        return '';

      default:
        return '';
    }
  } catch (err: any) {
    logger.error(`Lookup execution error [${action}]:`, err.message);
    return `Error executing ${action}: ${err.message}`;
  }
}

/**
 * Conversational AI agent for the CRM assistant chat — with full database access.
 */
export async function chatWithAgent(
  message: string,
  history: { role: string; content: string }[]
): Promise<string> {
  return withRetry(async () => {
    // Step 1: Gather aggregate CRM context
    let crmContext = '';
    try {
      const stats = await getOverviewAnalytics();
      crmContext = `\n\nLive CRM overview:\n- Customers: ${stats.totalCustomers}\n- Segments: ${stats.totalSegments}\n- Campaigns: ${stats.totalCampaigns} (${stats.activeCampaigns} active, ${stats.completedCampaigns} completed)\n- Messages sent: ${stats.totalMessages}\n- Delivery: ${JSON.stringify(stats.deliveryStats)}\n- Channels: ${JSON.stringify(stats.channelBreakdown)}`;
    } catch { /* continue without CRM context */ }

    // Step 2: Extract database lookup intents from the user's message
    let dbContext = '';
    try {
      const intents = await extractLookupIntents(message, history);
      const nonEmpty = intents.filter((i) => i.action !== 'none');

      if (nonEmpty.length > 0) {
        const results = await Promise.all(nonEmpty.map(executeLookup));
        const validResults = results.filter((r) => r.length > 0);
        if (validResults.length > 0) {
          dbContext = `\n\nDatabase query results:\n${validResults.join('\n\n')}`;
        }
      }
    } catch (err: any) {
      logger.warn('Database lookup failed, continuing without:', err.message);
    }

    // Step 3: Generate the final response with all context
    const messages: any[] = [
      {
        role: 'system',
        content: `You are an AI-native CRM assistant for Xeno CRM — a campaign management platform.
You have FULL ACCESS to the CRM database and can look up any customer, order, campaign, segment, or communication log.

Help marketers with:
1. Customer lookups — find customers by phone, email, name, or ID and provide their details
2. Order history — look up orders for specific customers
3. Segment creation — suggest rules in JSON format when asked
4. Message drafting — for WhatsApp, SMS, Email, RCS
5. Performance analysis — analyze campaign metrics
6. Campaign strategy — targeting, timing, channels

When database results are provided below, use them to give precise, data-driven answers.
Be concise and actionable. Format data clearly for readability.${crmContext}${dbContext}`,
      },
      ...history.map((h) => ({
        role: h.role === 'assistant' ? 'assistant' : 'user',
        content: h.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await openrouter.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.6,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content?.trim() || 'I could not process your request. Please try again.';
  });
}
