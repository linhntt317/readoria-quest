"use client";

import React from "react";

// Navigation primitives that use browser APIs.
// In the Vite SPA entry (main.tsx), BrowserRouter provides history-based
// navigation automatically through <Link> rendered by React Router routes.
// This file provides a safe fallback that works everywhere (Next.js SSR,
// Vite dev, production) without importing react-router-dom hooks directly,
// which would crash in Next.js SSR where there is no <Router> context.

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export const AppLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let browser handle external links, new tab, ctrl/cmd+click
      if (
        props.target === "_blank" ||
        e.metaKey || e.ctrlKey || e.shiftKey ||
        href.startsWith("http") ||
        href.startsWith("mailto:")
      ) {
        props.onClick?.(e);
        return;
      }

      e.preventDefault();
      props.onClick?.(e);
      window.history.pushState({}, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
    };

    return (
      <a href={href} ref={ref} {...props} onClick={handleClick}>
        {children}
      </a>
    );
  }
);

AppLink.displayName = "AppLink";

export function useAppRouter() {
  const push = React.useCallback((path: string) => {
    if (typeof window === "undefined") return;
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  const replace = React.useCallback((path: string) => {
    if (typeof window === "undefined") return;
    window.history.replaceState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  const back = React.useCallback(() => {
    if (typeof window === "undefined") return;
    window.history.back();
  }, []);

  return { push, replace, back };
}

export function useAppPathname() {
  const [pathname, setPathname] = React.useState(
    typeof window !== "undefined" ? window.location.pathname : ""
  );

  React.useEffect(() => {
    const onChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  return pathname;
}
