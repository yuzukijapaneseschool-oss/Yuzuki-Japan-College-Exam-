const crypto = require('crypto');

/**
 * PayHere Configuration & Utilities for YUZUKI Japan College
 */

function getPayHereConfig() {
  const env = (process.env.PAYHERE_ENV || process.env.PAYHERE_MODE || 'sandbox').toLowerCase();
  const merchantId = process.env.PAYHERE_MERCHANT_ID || '1220000'; // Default sandbox merchant ID
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'sandbox_merchant_secret_yuzuki_2026';
  const currency = (process.env.PAYHERE_CURRENCY || 'USD').toUpperCase();
  
  const checkoutUrl = (env === 'live' || env === 'production')
    ? 'https://www.payhere.lk/pay/checkout'
    : 'https://sandbox.payhere.lk/pay/checkout';

  const baseUrl = process.env.APP_BASE_URL || process.env.PUBLIC_BASE_URL || process.env.BASE_URL || 'https://yuzukijapancollege.edu.lk';
  const notifyUrl = process.env.PAYHERE_NOTIFY_URL || `${baseUrl}/api/payments/practice-pass/notify`;
  const returnUrl = process.env.PAYHERE_RETURN_URL || `${baseUrl}/student-dashboard?payment=success`;
  const cancelUrl = process.env.PAYHERE_CANCEL_URL || `${baseUrl}/student-dashboard?payment=cancelled`;

  return {
    env,
    mode: env,
    merchantId,
    merchantSecret,
    currency,
    checkoutUrl,
    notifyUrl,
    returnUrl,
    cancelUrl,
    usdPrice: 9.99,
    approxLkrPrice: 3050.00
  };
}

/**
 * Generate PayHere MD5 Checkout Hash
 * Format: strtoupper(md5(merchant_id + order_id + number_format(amount, 2, '.', '') + currency + strtoupper(md5(merchant_secret))))
 */
function generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret) {
  const formattedAmount = Number(amount).toFixed(2);
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
  return crypto
    .createHash('md5')
    .update(hashString)
    .digest('hex')
    .toUpperCase();
}

/**
 * Verify PayHere IPN Notify Signature
 * Format: strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))
 */
function verifyPayHereNotifySignature(params, merchantSecret) {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig
  } = params;

  if (!merchant_id || !order_id || !payhere_amount || !payhere_currency || !status_code || !md5sig) {
    return false;
  }

  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const hashString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;
  const localSig = crypto
    .createHash('md5')
    .update(hashString)
    .digest('hex')
    .toUpperCase();

  return localSig === (md5sig || '').toUpperCase();
}

module.exports = {
  getPayHereConfig,
  generatePayHereHash,
  verifyPayHereNotifySignature
};
