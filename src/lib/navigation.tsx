"use client";

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Navigation primitives using React Router for SPA navigation.

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
  const navigate = useNavigate();

  const push = React.useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const replace = React.useCallback((path: string) => {
    navigate(path, { replace: true });
  }, [navigate]);

  const back = React.useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return { push, replace, back };
}

export function useAppPathname() {
  const location = useLocation();
  return location.pathname;
}
