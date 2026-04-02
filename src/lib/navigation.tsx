"use client";

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Navigation primitives using React Router for SPA navigation.
// Falls back to browser navigation if React Router context is unavailable.

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: React.ReactNode;
}

export const AppLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, ...props }, ref) => {
    return (
      <Link to={href} ref={ref} className={className} {...props}>
        {children}
      </Link>
    );
  }
);

AppLink.displayName = "AppLink";

export function useAppRouter() {
  let navigate: ReturnType<typeof useNavigate> | null = null;
  try {
    navigate = useNavigate();
  } catch {
    // Outside Router context — fall back to window.location
  }

  const push = React.useCallback((path: string) => {
    if (navigate) {
      navigate(path);
    } else if (typeof window !== "undefined") {
      window.location.assign(path);
    }
  }, [navigate]);

  const replace = React.useCallback((path: string) => {
    if (navigate) {
      navigate(path, { replace: true });
    } else if (typeof window !== "undefined") {
      window.location.replace(path);
    }
  }, [navigate]);

  const back = React.useCallback(() => {
    if (navigate) {
      navigate(-1);
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  }, [navigate]);

  return { push, replace, back };
}

export function useAppPathname() {
  try {
    const location = useLocation();
    return location.pathname;
  } catch {
    // Outside Router context
    return typeof window !== "undefined" ? window.location.pathname : "";
  }
}
