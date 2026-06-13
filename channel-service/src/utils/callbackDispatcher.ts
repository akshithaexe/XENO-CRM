import axios from 'axios';

const CRM_RECEIPT_URL = process.env.CRM_RECEIPT_URL || 'http://localhost:5000/api/receipts';
const MAX_RETRIES = 3;

/**
 * Dispatches a delivery callback to the CRM backend with exponential backoff.
 */
export async function sendCallback(payload: {
  logId: string;
  campaignId: string;
  customerId: string;
  status: string;
  timestamp: string;
  failureReason?: string;
}): Promise<void> {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      await axios.post(CRM_RECEIPT_URL, payload, { timeout: 5000 });
      console.log(`[Callback] Sent ${payload.status} for log ${payload.logId}`);
      return;
    } catch (error) {
      attempt++;
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      console.warn(`[Callback] Attempt ${attempt} failed for log ${payload.logId}, retrying in ${delay}ms`);

      if (attempt >= MAX_RETRIES) {
        console.error(`[Callback] Failed to send callback for log ${payload.logId} after ${MAX_RETRIES} attempts`);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
