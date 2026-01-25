"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const checkAdminRole = async (userId: string) => {
      if (!isMounted) return;

      setLoading(true);
      try {
        const { data: hasAdminRole, error } = await supabase.rpc("has_role", {
          _user_id: userId,
          _role: "admin",
        });

        if (error) throw error;

        if (isMounted) {
          setIsAdmin(!!hasAdminRole);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await checkAdminRole(nextSession.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    // Check for existing session ONLY on initial mount
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!isMounted) return;

      if (!initialSession) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      } else {
        // Session exists, check admin role
        setSession(initialSession);
        setUser(initialSession.user);
        checkAdminRole(initialSession.user.id);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ error: any }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If login successful, wait for auth state to update
    if (!error) {
      return new Promise((resolve) => {
        const checkAuth = setInterval(async () => {
          const {
            data: { session: currentSession },
          } = await supabase.auth.getSession();
          if (currentSession?.user) {
            clearInterval(checkAuth);
            // Check admin role
            try {
              const { data: hasAdminRole } = await supabase.rpc("has_role", {
                _user_id: currentSession.user.id,
                _role: "admin",
              });
              setIsAdmin(!!hasAdminRole);
            } catch (error) {
              console.error("Error checking admin role:", error);
              setIsAdmin(false);
            }
            resolve({ error: null });
          }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkAuth);
          resolve({ error });
        }, 5000);
      });
    }

    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl =
      typeof window !== "undefined" ? `${window.location.origin}/` : "";
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(
    () => ({ user, session, isAdmin, loading, signIn, signUp, signOut }),
    [user, session, isAdmin, loading],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
