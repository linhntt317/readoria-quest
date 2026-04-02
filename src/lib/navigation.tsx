"use client";

import React from "react";

// Navigation primitives that work in both Vite (with React Router) and Next.js environments.
// Uses require() to avoid SSR crashes when react-router-dom context is missing.

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export const AppLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, ...props }, ref) => {
    // In Vite with React Router, use Link for SPA navigation
    try {
      const { Link } = require("react-router-dom");
      return (
        <Link to={href} ref={ref} className={className} {...props}>
          {children}
        </Link>
      );
    } catch {
      // Fallback to plain anchor
    }
    return (
      <a href={href} ref={ref} className={className} {...props}>
        {children}
      </a>
    );
  }
);

AppLink.displayName = "AppLink";

export function useAppRouter() {
  let navigate: any = null;
  try {
    const { useNavigate } = require("react-router-dom");
    navigate = useNavigate();
  } catch {
    // Not inside Router context or SSR
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
  const [fallbackPathname, setFallbackPathname] = React.useState(
    typeof window !== "undefined" ? window.location.pathname : ""
  );

  React.useEffect(() => {
    const onChange = () => setFallbackPathname(window.location.pathname);
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  try {
    const { useLocation } = require("react-router-dom");
    const location = useLocation();
    return location.pathname;
  } catch {
    return fallbackPathname;
  }
}
