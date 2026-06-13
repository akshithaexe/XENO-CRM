import { sendCallback } from '../utils/callbackDispatcher';

interface SendRequest {
  campaignId: string;
  customerId: string;
  logId: string;
  channel: string;
  message: string;
}

/**
 * Simulates the delivery lifecycle with random delays:
 * sent → delivered → opened → clicked (probabilistic)
 */
export function simulateDelivery(req: SendRequest): void {
  const { campaignId, customerId, logId } = req;

  // Simulate delivery delay (1-3 seconds)
  const deliveryDelay = 1000 + Math.random() * 2000;

  setTimeout(async () => {
    // 90% chance of successful delivery
    if (Math.random() < 0.9) {
      await sendCallback({
        logId,
        campaignId,
        customerId,
        status: 'delivered',
        timestamp: new Date().toISOString(),
      });

      // Simulate open (60% chance, after 2-5 seconds)
      const openDelay = 2000 + Math.random() * 3000;
      setTimeout(async () => {
        if (Math.random() < 0.6) {
          await sendCallback({
            logId,
            campaignId,
            customerId,
            status: 'opened',
            timestamp: new Date().toISOString(),
          });

          // Simulate click (30% chance, after 1-3 seconds)
          const clickDelay = 1000 + Math.random() * 2000;
          setTimeout(async () => {
            if (Math.random() < 0.3) {
              await sendCallback({
                logId,
                campaignId,
                customerId,
                status: 'clicked',
                timestamp: new Date().toISOString(),
              });
            }
          }, clickDelay);
        }
      }, openDelay);
    } else {
      // 10% chance of failure
      await sendCallback({
        logId,
        campaignId,
        customerId,
        status: 'failed',
        timestamp: new Date().toISOString(),
        failureReason: 'Simulated delivery failure',
      });
    }
  }, deliveryDelay);
}
