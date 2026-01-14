import { useLoading } from "@/contexts/LoadingContext";
import { useCallback } from "react";

/**
 * Hook to wrap async functions with loading state
 * Usage: const { execute } = useAsyncWithLoading(async () => { ... });
 */
export function useAsyncWithLoading() {
  const { showLoading, hideLoading } = useLoading();

  const execute = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      showLoading();
      try {
        const result = await fn();
        return result;
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  const executeWithTimeout = useCallback(
    async <T>(
      fn: () => Promise<T>,
      timeoutMs: number = 30000
    ): Promise<T | null> => {
      showLoading();
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        );
        const result = await Promise.race([fn(), timeoutPromise]);
        return result;
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  return { execute, executeWithTimeout };
}
