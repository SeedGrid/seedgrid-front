"use client";

import React from "react";

export default function CodeBlockBase(props: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onCopy}
        className="absolute right-2 top-2 rounded border border-border bg-white/90 px-2 py-1 text-[11px] text-foreground/70 hover:text-foreground"
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
      <pre className="mt-3 rounded-md bg-foreground/5 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
        {props.code}
      </pre>
    </div>
  );
}
