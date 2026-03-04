"use client";

import React from "react";
import Link from "next/link";
import { SgGrid } from "@seedgrid/fe-components";
import type { ShowcaseExampleLink } from "./useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../i18n";

type ShowcaseStickyHeaderProps = {
  stickyHeaderRef: React.RefObject<HTMLDivElement | null>;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  exampleLinks: ShowcaseExampleLink[];
  onAnchorClick: (event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => void;
};

type StickyHeaderTexts = {
  examplesLabel: string;
  propsReferenceLabel: string;
};

const STICKY_HEADER_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", StickyHeaderTexts> = {
  "pt-BR": {
    examplesLabel: "Exemplos",
    propsReferenceLabel: "Referencia de Props"
  },
  "pt-PT": {
    examplesLabel: "Exemplos",
    propsReferenceLabel: "Referencia de Props"
  },
  "en-US": {
    examplesLabel: "Examples",
    propsReferenceLabel: "Props Reference"
  },
  es: {
    examplesLabel: "Ejemplos",
    propsReferenceLabel: "Referencia de Props"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof STICKY_HEADER_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function ShowcaseStickyHeader(props: Readonly<ShowcaseStickyHeaderProps>) {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof STICKY_HEADER_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = STICKY_HEADER_TEXTS[locale];

  return (
    <div ref={props.stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
      <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">{props.title}</h1>
        {props.subtitle ? <p className="mt-2 text-muted-foreground">{props.subtitle}</p> : null}
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{texts.examplesLabel}</p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {props.exampleLinks.map((example) => (
            <Link
              key={example.id}
              href={`#${example.id}`}
              onClick={(event) => props.onAnchorClick(event, example.id)}
              className="shrink-0 whitespace-nowrap rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
            >
              {example.label}
            </Link>
          ))}
          <Link
            href="#props-reference"
            onClick={(event) => props.onAnchorClick(event, "props-reference")}
            className="shrink-0 whitespace-nowrap rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
          >
            {texts.propsReferenceLabel}
          </Link>
        </div>
        <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2 hidden md:grid">
          {props.exampleLinks.map((example) => (
            <Link
              key={example.id}
              href={`#${example.id}`}
              onClick={(event) => props.onAnchorClick(event, example.id)}
              className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
            >
              {example.label}
            </Link>
          ))}
          <Link
            href="#props-reference"
            onClick={(event) => props.onAnchorClick(event, "props-reference")}
            className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
          >
            {texts.propsReferenceLabel}
          </Link>
        </SgGrid>
      </div>
    </div>
  );
}


