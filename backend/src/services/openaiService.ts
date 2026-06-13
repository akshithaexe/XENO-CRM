import openrouter from '../config/openai';
import { getOverviewAnalytics } from './analyticsService';
import { logger } from '../utils/logger';

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

/**
 * Conversational AI agent for the CRM assistant chat.
 */
export async function chatWithAgent(
  message: string,
  history: { role: string; content: string }[]
): Promise<string> {
  return withRetry(async () => {
    let crmContext = '';
    try {
      const stats = await getOverviewAnalytics();
      crmContext = `\n\nLive CRM data:\n- Customers: ${stats.totalCustomers}\n- Segments: ${stats.totalSegments}\n- Campaigns: ${stats.totalCampaigns} (${stats.activeCampaigns} active, ${stats.completedCampaigns} completed)\n- Messages sent: ${stats.totalMessages}\n- Delivery: ${JSON.stringify(stats.deliveryStats)}\n- Channels: ${JSON.stringify(stats.channelBreakdown)}`;
    } catch { /* continue without CRM context */ }

    const messages: any[] = [
      {
        role: 'system',
        content: `You are an AI-native CRM assistant for Xeno CRM — a campaign management platform.

Help marketers with:
1. Segment creation — suggest rules in JSON format when asked
2. Message drafting — for WhatsApp, SMS, Email, RCS
3. Performance analysis — analyze campaign metrics
4. Campaign strategy — targeting, timing, channels

Be concise and actionable.${crmContext}`,
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
