"use client";

import * as React from "react";

export default function I18NReady(props: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return <>{props.fallback ?? null}</>;
  return <>{props.children}</>;
}
