"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type User = { id: string; name: string; roles: string[] };

type AuthState = {
  user: User | null;
  accessToken: string | null;
};

type AuthContextValue = AuthState & {
  login: (args: { accessToken: string; user: User }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider(props: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    user: null,
    accessToken: null
  }));

  const login = useCallback((args: { accessToken: string; user: User }) => {
    setState({ user: args.user, accessToken: args.accessToken });
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, accessToken: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, logout }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
