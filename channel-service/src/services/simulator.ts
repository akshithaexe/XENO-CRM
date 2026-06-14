import { sendCallback } from '../utils/callbackDispatcher';

interface SendRequest {
  campaignId: string;
  customerId: string;
  logId: string;
  channel: string;
  message: string;
  totalSpend?: number;
}

type EventStatus = 'delivered' | 'failed' | 'opened' | 'read' | 'clicked' | 'converted';

/**
 * Determine customer tier from totalSpend for intelligent simulation.
 * High-value: ₹10k+   → best engagement
 * Regular:    ₹1k-10k  → average engagement
 * Inactive:   <₹1k     → low engagement
 */
function getCustomerTier(totalSpend: number = 0): 'high' | 'regular' | 'inactive' {
  if (totalSpend >= 10000) return 'high';
  if (totalSpend >= 1000) return 'regular';
  return 'inactive';
}

/**
 * Probabilities for each event by customer tier.
 * Each stage is conditional on the previous stage succeeding.
 */
const EVENT_PROBABILITIES: Record<string, Record<EventStatus, number>> = {
  high: {
    delivered: 0.95,
    failed: 0.05,
    opened: 0.80,
    read: 0.60,
    clicked: 0.40,
    converted: 0.15,
  },
  regular: {
    delivered: 0.90,
    failed: 0.10,
    opened: 0.50,
    read: 0.30,
    clicked: 0.20,
    converted: 0.05,
  },
  inactive: {
    delivered: 0.85,
    failed: 0.15,
    opened: 0.25,
    read: 0.10,
    clicked: 0.05,
    converted: 0.01,
  },
};

/**
 * Simulates the full delivery lifecycle with intelligent, tier-based probabilities:
 * SENT → DELIVERED → OPENED → READ → CLICKED → CONVERTED
 * or SENT → FAILED (at delivery stage)
 */
export function simulateDelivery(req: SendRequest): void {
  const { campaignId, customerId, logId, totalSpend } = req;
  const tier = getCustomerTier(totalSpend);
  const probs = EVENT_PROBABILITIES[tier];

  console.log(`[Simulator] Customer ${customerId} | tier=${tier} | spend=₹${totalSpend || 0}`);

  // Stage 1: Delivery (1-3s delay)
  const deliveryDelay = 1000 + Math.random() * 2000;

  setTimeout(async () => {
    // Check if delivery succeeds
    if (Math.random() < probs.delivered) {
      await sendCallback({
        logId,
        campaignId,
        customerId,
        status: 'delivered',
        timestamp: new Date().toISOString(),
      });
      console.log(`[Simulator] ✅ DELIVERED → ${customerId}`);

      // Stage 2: Opened (2-5s after delivery)
      const openDelay = 2000 + Math.random() * 3000;
      setTimeout(async () => {
        if (Math.random() < probs.opened) {
          await sendCallback({
            logId,
            campaignId,
            customerId,
            status: 'opened',
            timestamp: new Date().toISOString(),
          });
          console.log(`[Simulator] 📬 OPENED → ${customerId}`);

          // Stage 3: Read (1-3s after open)
          const readDelay = 1000 + Math.random() * 2000;
          setTimeout(async () => {
            if (Math.random() < probs.read) {
              await sendCallback({
                logId,
                campaignId,
                customerId,
                status: 'read',
                timestamp: new Date().toISOString(),
              });
              console.log(`[Simulator] 👁️ READ → ${customerId}`);

              // Stage 4: Clicked (1-3s after read)
              const clickDelay = 1000 + Math.random() * 2000;
              setTimeout(async () => {
                if (Math.random() < probs.clicked) {
                  await sendCallback({
                    logId,
                    campaignId,
                    customerId,
                    status: 'clicked',
                    timestamp: new Date().toISOString(),
                  });
                  console.log(`[Simulator] 🔗 CLICKED → ${customerId}`);

                  // Stage 5: Converted (2-5s after click)
                  const convertDelay = 2000 + Math.random() * 3000;
                  setTimeout(async () => {
                    if (Math.random() < probs.converted) {
                      await sendCallback({
                        logId,
                        campaignId,
                        customerId,
                        status: 'converted',
                        timestamp: new Date().toISOString(),
                      });
                      console.log(`[Simulator] 💰 CONVERTED → ${customerId}`);
                    }
                  }, convertDelay);
                }
              }, clickDelay);
            }
          }, readDelay);
        }
      }, openDelay);
    } else {
      // Delivery failed
      await sendCallback({
        logId,
        campaignId,
        customerId,
        status: 'failed',
        timestamp: new Date().toISOString(),
        failureReason: 'Simulated delivery failure — channel unavailable',
      });
      console.log(`[Simulator] ❌ FAILED → ${customerId}`);
    }
  }, deliveryDelay);
}
