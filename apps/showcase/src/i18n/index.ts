"use client";

import React from "react";
import ptBr from "./pt-BR.json";
import ptPt from "./pt-PT.json";
import enUs from "./en-US.json";
import es from "./es.json";

export type ShowcaseLocale = "pt-BR" | "pt-PT" | "en-US" | "es" | (string & {});
export type ShowcaseMessages = Record<string, string>;

export type ShowcaseI18n = {
  locale: ShowcaseLocale;
  messages: ShowcaseMessages;
};

export type ShowcaseI18nInput = {
  locale?: ShowcaseLocale;
  messages?: ShowcaseMessages;
};

type ShowcaseGlobal = {
  __seedgridShowcaseI18n?: ShowcaseI18n;
};

const DEFAULT_I18N: ShowcaseI18n = {
  locale: "en-US",
  messages: enUs
};

function getRuntimeI18n(): ShowcaseI18n | null {
  if (typeof globalThis === "undefined") return null;
  const globalConfig = globalThis as ShowcaseGlobal;
  return globalConfig.__seedgridShowcaseI18n ?? null;
}

export function setShowcaseI18n(input: ShowcaseI18nInput) {
  if (typeof globalThis === "undefined") return;
  const current = getRuntimeI18n() ?? DEFAULT_I18N;
  const next: ShowcaseI18n = {
    locale: input.locale ?? current.locale,
    messages: { ...current.messages, ...(input.messages ?? {}) }
  };
  (globalThis as ShowcaseGlobal).__seedgridShowcaseI18n = next;
}

export function getShowcaseI18n(): ShowcaseI18n {
  const runtime = getRuntimeI18n();
  if (!runtime) return DEFAULT_I18N;
  return {
    locale: runtime.locale ?? DEFAULT_I18N.locale,
    messages: { ...DEFAULT_I18N.messages, ...(runtime.messages ?? {}) }
  };
}

const ShowcaseI18nContext = React.createContext<ShowcaseI18n | null>(null);

export function ShowcaseI18nProvider(props: {
  locale?: ShowcaseLocale;
  messages?: ShowcaseMessages;
  children: React.ReactNode;
}) {
  const value: ShowcaseI18n = {
    locale: props.locale ?? DEFAULT_I18N.locale,
    messages: { ...DEFAULT_I18N.messages, ...(props.messages ?? {}) }
  };
  return React.createElement(ShowcaseI18nContext.Provider, { value }, props.children);
}

export function useShowcaseI18n(): ShowcaseI18n {
  return React.useContext(ShowcaseI18nContext) ?? getShowcaseI18n();
}

export function formatMessage(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = params[key];
    return value === undefined || value === null ? match : String(value);
  });
}

export function t(i18n: ShowcaseI18n | null | undefined, key: string, params?: Record<string, string | number>): string {
  const messages = i18n?.messages ?? getShowcaseI18n().messages;
  const template = messages[key] ?? DEFAULT_I18N.messages[key] ?? key;
  return formatMessage(template, params);
}

export const showcaseMessagesPtBr = ptBr;
export const showcaseMessagesPtPt = ptPt;
export const showcaseMessagesEnUs = enUs;
export const showcaseMessagesEs = es;
