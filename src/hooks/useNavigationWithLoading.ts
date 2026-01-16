import { useAppRouter } from "@/lib/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { useCallback } from "react";

/**
 * Hook for navigation with automatic loading state
 * Automatically shows loading spinner when navigating and hides after 2 seconds
 */
export function useNavigationWithLoading() {
  const router = useAppRouter();
  const { showLoading, hideLoading } = useLoading();

  const push = useCallback(
    (href: string, delay: number = 500) => {
      showLoading();
      // Hide loading after delay to allow page to settle
      setTimeout(() => {
        hideLoading();
      }, delay);
      router.push(href);
    },
    [router, showLoading, hideLoading]
  );

  const replace = useCallback(
    (href: string, delay: number = 500) => {
      showLoading();
      setTimeout(() => {
        hideLoading();
      }, delay);
      router.replace(href);
    },
    [router, showLoading, hideLoading]
  );

  const back = useCallback(() => {
    showLoading();
    setTimeout(() => {
      hideLoading();
    }, 300);
    router.back();
  }, [router, showLoading, hideLoading]);

  return { push, replace, back };
}
