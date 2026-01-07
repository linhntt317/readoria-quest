"use client";

import React from 'react';

// Check if we're in Next.js environment
const isNextJs = typeof window !== 'undefined' && 
  (window as any).__NEXT_DATA__ !== undefined;

// Custom Link component that works in both Vite and Next.js
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export const AppLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    if (isNextJs) {
      // Dynamic import for Next.js Link
      const NextLink = require('next/link').default;
      return (
        <NextLink href={href} ref={ref} {...props}>
          {children}
        </NextLink>
      );
    }
    
    // Standard anchor for Vite
    return (
      <a href={href} ref={ref} {...props}>
        {children}
      </a>
    );
  }
);

AppLink.displayName = 'AppLink';

// Custom useRouter hook that works in both Vite and Next.js
export function useAppRouter() {
  const push = React.useCallback((path: string) => {
    if (isNextJs) {
      try {
        const { useRouter } = require('next/navigation');
        const router = useRouter();
        router.push(path);
      } catch {
        window.location.href = path;
      }
    } else {
      window.location.href = path;
    }
  }, []);

  const replace = React.useCallback((path: string) => {
    if (isNextJs) {
      try {
        const { useRouter } = require('next/navigation');
        const router = useRouter();
        router.replace(path);
      } catch {
        window.location.replace(path);
      }
    } else {
      window.location.replace(path);
    }
  }, []);

  return { push, replace };
}
