/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window per key (IP or identifier).
 */

const store = new Map<string, number[]>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of store) {
    const valid = timestamps.filter((t) => now - t < 60_000);
    if (valid.length === 0) store.delete(key);
    else store.set(key, valid);
  }
}, 5 * 60_000);

/**
 * Check if a request should be rate-limited.
 * @param key - Unique identifier (e.g., IP + endpoint)
 * @param maxRequests - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60s)
 * @returns true if the request is allowed, false if rate-limited
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const timestamps = store.get(key) ?? [];
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= maxRequests) {
    return false;
  }

  valid.push(now);
  store.set(key, valid);
  return true;
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
