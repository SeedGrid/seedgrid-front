"use client";

import React from "react";
import { SgCard } from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../i18n";

export default function CodeBlockBase(props: { code: string }) {
  const i18n = useShowcaseI18n();
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
    <SgCard
      title={t(i18n, "showcase.common.code.title")}
      description={t(i18n, "showcase.common.code.description")}
      trailing={
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          {t(i18n, "showcase.common.code.badge")}
        </span>
      }
      collapsible
      defaultOpen={false}
      bodyClassName="pt-2"
    >
      <div className="relative">
        <button
          type="button"
          onClick={onCopy}
          className="absolute right-2 top-2 rounded border border-border bg-white/90 px-2 py-1 text-[11px] text-foreground/70 hover:text-foreground"
        >
          {copied ? t(i18n, "showcase.common.code.copied") : t(i18n, "showcase.common.code.copy")}
        </button>
        <pre className="mt-3 rounded-md bg-foreground/5 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
          {props.code}
        </pre>
      </div>
    </SgCard>
  );
}
