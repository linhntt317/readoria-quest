"use client";

import React from "react";

// Dynamically import react-router-dom to avoid crashes in Next.js SSR
let RouterLink: React.ComponentType<any> | null = null;
let useNavigateHook: (() => any) | null = null;
let useLocationHook: (() => { pathname: string }) | null = null;

try {
  const rrdom = require("react-router-dom");
  RouterLink = rrdom.Link;
  useNavigateHook = rrdom.useNavigate;
  useLocationHook = rrdom.useLocation;
} catch {
  // react-router-dom not available (e.g., Next.js SSR)
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export const AppLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, ...props }, ref) => {
    // In Vite with React Router, use Link for SPA navigation
    if (RouterLink) {
      try {
        return (
          <RouterLink to={href} ref={ref} className={className} {...props}>
            {children}
          </RouterLink>
        );
      } catch {
        // Fallback if not inside Router context
      }
    }
    // Fallback to plain anchor
    return (
      <a href={href} ref={ref} className={className} {...props}>
        {children}
      </a>
    );
  }
);

AppLink.displayName = "AppLink";

export function useAppRouter() {
  // Try to use React Router's useNavigate if available and inside Router context
  let navigate: any = null;
  if (useNavigateHook) {
    try {
      navigate = useNavigateHook();
    } catch {
      // Not inside Router context
    }
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
  const [pathname, setPathname] = React.useState(
    typeof window !== "undefined" ? window.location.pathname : ""
  );

  if (useLocationHook) {
    try {
      const location = useLocationHook();
      return location.pathname;
    } catch {
      // Not inside Router context
    }
  }

  React.useEffect(() => {
    const onChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  return pathname;
}
