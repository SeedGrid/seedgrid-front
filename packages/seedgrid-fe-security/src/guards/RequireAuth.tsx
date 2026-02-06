"use client";

import React from "react";
import { useAuth } from "../auth/useAuth";

export function RequireAuth(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return props.fallback ?? <div>Nao autenticado.</div>;
  return <>{props.children}</>;
}
