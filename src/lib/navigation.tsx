"use client";

import React from "react";

// NOTE:
// This project runs in a Vite-based preview environment, while production uses Next.js.
// Importing `next/navigation`, `next/link`, or `next/image` inside `src/` causes runtime
// crashes in preview ("expected app router to be mounted").
//
// To keep preview stable, this file provides safe navigation primitives that work
// everywhere by falling back to regular browser navigation.

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export const AppLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    return (
      <a href={href} ref={ref} {...props}>
        {children}
      </a>
    );
  }
);

AppLink.displayName = "AppLink";

export function useAppRouter() {
  const push = React.useCallback((path: string) => {
    if (typeof window === "undefined") return;
    window.location.assign(path);
  }, []);

  const replace = React.useCallback((path: string) => {
    if (typeof window === "undefined") return;
    window.location.replace(path);
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
