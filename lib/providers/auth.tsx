"use client";

import {
  ContextType,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useState } from "react";
import {
  Session,
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { Database } from "../../types/supabase";

const MY_EMAIL = "eiirwp@gmail.com";

export type AuthState = "loading" | "signedOut" | "signedIn";

export type AuthProviderProps = {
  children: ReactNode;
};

export type AuthContextType = {
  auth: SupabaseAuthClient;
  authState: AuthState;
  user: User | null;
  isMe: boolean;
};

export const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const supabase = createClientComponentClient<Database>();

  const [session, setSession] = useState<Session | null>(null);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleSessionChange = (session: Session | null) => {
      setSession(session);
      if (session) {
        setAuthState("signedIn");
        supabase.auth
          .getUser()
          .then((userResponse) => setUser(userResponse.data.user))
          .catch(() => setUser(null));
      } else {
        setAuthState("signedOut");
        setUser(null);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSessionChange(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      handleSessionChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const context: AuthContextType = useMemo<AuthContextType>(
    () => ({
      auth: supabase.auth,
      authState: authState,
      user,
      isMe: user?.email === MY_EMAIL,
    }),
    [authState, supabase.auth, user]
  );

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
