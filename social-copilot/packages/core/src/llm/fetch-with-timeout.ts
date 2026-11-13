const DEFAULT_TIMEOUT_MS = 20_000;

export interface FetchRetryOptions {
  retries: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  /**
   * Retry on these HTTP statuses (commonly 429, 5xx).
   * Defaults to [429, 500, 502, 503, 504].
   */
  retryOnStatuses?: number[];
}

function createAbortError(): Error {
  if (typeof DOMException === 'function') {
    return new DOMException('Aborted', 'AbortError');
  }
  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (!signal) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  if (signal.aborted) {
    return Promise.reject(createAbortError());
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(createAbortError());
    };
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

function computeBackoffMs(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
  const jitter = Math.floor(Math.random() * Math.min(250, baseDelayMs));
  return Math.min(maxDelayMs, exp + jitter);
}

function parseRetryAfterMs(retryAfter: string | null): number | null {
  if (!retryAfter) return null;

  const trimmed = retryAfter.trim();
  if (!trimmed) return null;

  // "Retry-After: <delay-seconds>"
  const seconds = Number(trimmed);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.floor(seconds * 1000);
  }

  // "Retry-After: <http-date>"
  const date = Date.parse(trimmed);
  if (!Number.isFinite(date)) return null;
  const delta = date - Date.now();
  return delta > 0 ? Math.floor(delta) : 0;
}

/**
 * Fetch helper with AbortController-based timeout protection.
 */
export async function fetchWithTimeout(
  resource: string,
  options: RequestInit & { timeoutMs?: number; retry?: FetchRetryOptions }
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, retry, signal: rawUpstreamSignal, ...requestInit } = options;
  const upstreamSignal = rawUpstreamSignal ?? undefined;
  const retries = retry?.retries ?? 0;
  const baseDelayMs = retry?.baseDelayMs ?? 500;
  const maxDelayMs = retry?.maxDelayMs ?? 5000;
  const retryOnStatuses = retry?.retryOnStatuses ?? [429, 500, 502, 503, 504];

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    const onUpstreamAbort = () => controller.abort();
    if (upstreamSignal) {
      if (upstreamSignal.aborted) {
        controller.abort();
      } else {
        upstreamSignal.addEventListener('abort', onUpstreamAbort, { once: true });
      }
    }

    try {
      const response = await fetch(resource, { ...requestInit, signal: controller.signal });
      if (response.ok) return response;

      if (attempt >= retries || !retryOnStatuses.includes(response.status)) {
        return response;
      }

      const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
      const baseDelay = computeBackoffMs(attempt, baseDelayMs, maxDelayMs);
      const delay = retryAfterMs === null
        ? baseDelay
        : Math.min(maxDelayMs, Math.max(retryAfterMs, baseDelay));
      await sleep(delay, upstreamSignal);
      continue;
    } catch (error) {
      if ((error as DOMException)?.name === 'AbortError') {
        if (!timedOut) throw error;
        if (attempt >= retries) {
          throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        const delay = computeBackoffMs(attempt, baseDelayMs, maxDelayMs);
        await sleep(delay, upstreamSignal);
        continue;
      }
      // Network errors from fetch are commonly surfaced as TypeError.
      // Treat these as retryable (when configured) for better resilience.
      const isNetworkError = error instanceof TypeError;
      if (isNetworkError && attempt < retries) {
        const delay = computeBackoffMs(attempt, baseDelayMs, maxDelayMs);
        await sleep(delay, upstreamSignal);
        continue;
      }
      throw error;
    } finally {
      clearTimeout(timer);
      upstreamSignal?.removeEventListener('abort', onUpstreamAbort);
    }
  }

  // Unreachable, but keep TS happy.
  throw new Error('fetchWithTimeout: unreachable');
}
