// Minimal Razorpay client for the Worker runtime (no Node SDK).
// Docs: https://razorpay.com/docs/api/orders/ and
// https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/

import { hmacSha256Hex, safeEqual } from './auth';

export interface RazorpayEnv {
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  amount_paid: number;
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
}

export function razorpayConfigured(env: RazorpayEnv): boolean {
  return !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);
}

function authHeader(env: RazorpayEnv): string {
  return 'Basic ' + btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
}

export async function createRazorpayOrder(
  env: RazorpayEnv,
  params: { amountPaise: number; receipt: string; notes?: Record<string, string> }
): Promise<RazorpayOrder> {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: authHeader(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: params.amountPaise,
      currency: 'INR',
      receipt: params.receipt.slice(0, 40),
      notes: params.notes || {}
    })
  });
  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.description || `Razorpay order creation failed (${res.status})`);
  }
  return data as RazorpayOrder;
}

export async function fetchRazorpayOrder(env: RazorpayEnv, razorpayOrderId: string): Promise<RazorpayOrder> {
  const res = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpayOrderId)}`, {
    headers: { Authorization: authHeader(env) }
  });
  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.description || `Razorpay order lookup failed (${res.status})`);
  }
  return data as RazorpayOrder;
}

/** Checkout handler signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret). */
export async function verifyCheckoutSignature(
  env: RazorpayEnv,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): Promise<boolean> {
  if (!env.RAZORPAY_KEY_SECRET) return false;
  const expected = await hmacSha256Hex(env.RAZORPAY_KEY_SECRET, `${razorpayOrderId}|${razorpayPaymentId}`);
  return safeEqual(expected, signature);
}

/** Webhook signature: HMAC_SHA256(raw body, webhook secret). */
export async function verifyWebhookSignature(
  env: RazorpayEnv,
  rawBody: string,
  signature: string
): Promise<boolean> {
  if (!env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = await hmacSha256Hex(env.RAZORPAY_WEBHOOK_SECRET, rawBody);
  return safeEqual(expected, signature);
}
