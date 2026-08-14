interface ApiError {
  status?: number;
  statusCode?: number;
  message?: string;
}

/**
 * Helper generic untuk retry asynchronous function dengan exponential backoff.
 *
 * @param fn Fungsi asynchronous yang akan dieksekusi
 * @param maxRetries Jumlah maksimal percobaan ulang (default: 3)
 * @param delay Jeda waktu awal dalam milidetik (default: 1000ms)
 * @returns Promise dengan tipe kembalian dari fungsi fn (T)
 */
export async function callAIWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      // Type narrowing untuk memastikan objek error aman dibaca
      const apiError = error as ApiError;
      const status = apiError?.status ?? apiError?.statusCode;
      const isRateLimitOrBusy = status === 429 || status === 503;

      // Jika sudah mencapai batas retry atau bukan error 429/503, teruskan error ke pemanggil
      if (attempt === maxRetries || !isRateLimitOrBusy) {
        throw error;
      }

      // Jeda: 1s, 2s, 4s...
      const backoffDelay = delay * Math.pow(2, attempt - 1);
      await new Promise<void>((resolve) => setTimeout(resolve, backoffDelay));
    }
  }

  // Fallback exhaustiveness check (secara runtime tidak akan tercapai)
  throw new Error("Failed after maximum retries");
}
