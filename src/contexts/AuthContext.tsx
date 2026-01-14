"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
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

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Check admin role when user changes
      if (session?.user) {
        setTimeout(async () => {
          try {
            const { data: hasAdminRole } = await supabase.rpc("has_role", {
              _user_id: session.user.id,
              _role: "admin",
            });
            setIsAdmin(!!hasAdminRole);
          } catch (error) {
            console.error("Error checking admin role:", error);
            setIsAdmin(false);
          } finally {
            setLoading(false);
          }
        }, 0);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(async () => {
          try {
            const { data: hasAdminRole } = await supabase.rpc("has_role", {
              _user_id: session.user.id,
              _role: "admin",
            });
            setIsAdmin(!!hasAdminRole);
          } catch (error) {
            console.error("Error checking admin role:", error);
            setIsAdmin(false);
          } finally {
            setLoading(false);
          }
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (
    email: string,
    password: string
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

  return (
    <AuthContext.Provider
      value={{ user, session, isAdmin, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
