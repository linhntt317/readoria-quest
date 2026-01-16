"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const showLoading = () => {
    setIsLoading(true);
    // Auto-hide loading after 30 seconds to prevent stuck state
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 30000);
  };

  const hideLoading = () => {
    setIsLoading(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  };

  const handleSetIsLoading = (loading: boolean) => {
    if (loading) {
      showLoading();
    } else {
      hideLoading();
    }
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading: handleSetIsLoading,
        showLoading,
        hideLoading,
      }}
    >
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-foreground">Đang tải...</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
