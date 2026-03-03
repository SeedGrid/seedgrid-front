"use client";

import React from "react";
import ptBr from "./pt-BR.js";
import ptPt from "./pt-PT.js";
import enUs from "./en-US.js";
import es from "./es.js";

export type SgComponentsLocale = "pt-BR" | "pt-PT" | "en-US" | "es" | (string & {});

export type SgComponentsMessages = Record<string, string>;
export type SgComponentsMessagesByNamespace = Record<string, SgComponentsMessages>;

export type SgComponentsI18n = {
  locale: SgComponentsLocale;
  messages: SgComponentsMessages;
};

export type SgComponentsI18nInput = {
  locale?: SgComponentsLocale;
  messages?: SgComponentsMessages | SgComponentsMessagesByNamespace;
};

type SeedgridGlobal = {
  __seedgridComponentsI18n?: SgComponentsI18n;
};

const DEFAULT_I18N: SgComponentsI18n = {
  locale: "pt-BR",
  messages: ptBr
};

function resolveMessages(messages?: SgComponentsMessages | SgComponentsMessagesByNamespace): SgComponentsMessages {
  if (!messages) return {};
  const asNamespaces = messages as SgComponentsMessagesByNamespace;
  if (asNamespaces.components) return asNamespaces.components ?? {};
  return messages as SgComponentsMessages;
}

function getRuntimeI18n(): SgComponentsI18n | null {
  if (typeof globalThis === "undefined") return null;
  const globalConfig = globalThis as SeedgridGlobal;
  return globalConfig.__seedgridComponentsI18n ?? null;
}

export function setComponentsI18n(input: SgComponentsI18nInput) {
  if (typeof globalThis === "undefined") return;
  const current = getRuntimeI18n() ?? DEFAULT_I18N;
  const mergedMessages = {
    ...current.messages,
    ...resolveMessages(input.messages)
  };
  const next: SgComponentsI18n = {
    locale: input.locale ?? current.locale,
    messages: mergedMessages
  };
  (globalThis as SeedgridGlobal).__seedgridComponentsI18n = next;
}

export function getComponentsI18n(): SgComponentsI18n {
  const runtime = getRuntimeI18n();
  if (!runtime) return DEFAULT_I18N;
  return {
    locale: runtime.locale ?? DEFAULT_I18N.locale,
    messages: { ...DEFAULT_I18N.messages, ...(runtime.messages ?? {}) }
  };
}

export function resolveComponentsI18n(input?: SgComponentsI18nInput): SgComponentsI18n {
  if (!input) return getComponentsI18n();
  const base = getComponentsI18n();
  return {
    locale: input.locale ?? base.locale,
    messages: { ...base.messages, ...resolveMessages(input.messages) }
  };
}

const ComponentsI18nContext = React.createContext<SgComponentsI18n | null>(null);

export function SgComponentsI18nProvider(props: {
  locale?: SgComponentsLocale;
  messages?: SgComponentsMessages | SgComponentsMessagesByNamespace;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => {
    const mergedMessages = { ...DEFAULT_I18N.messages, ...resolveMessages(props.messages) };
    return {
      locale: props.locale ?? DEFAULT_I18N.locale,
      messages: mergedMessages
    };
  }, [props.locale, props.messages]);

  return React.createElement(ComponentsI18nContext.Provider, { value }, props.children);
}

export function useComponentsI18n(): SgComponentsI18n {
  return React.useContext(ComponentsI18nContext) ?? getComponentsI18n();
}

export function formatMessage(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = params[key];
    return value === undefined || value === null ? match : String(value);
  });
}

export function t(
  i18n: SgComponentsI18n | null | undefined,
  key: string,
  params?: Record<string, string | number>
): string {
  const messages = i18n?.messages ?? getComponentsI18n().messages;
  const template = messages[key] ?? DEFAULT_I18N.messages[key] ?? key;
  return formatMessage(template, params);
}

export const componentsMessagesPtBr = ptBr;
export const componentsMessagesPtPt = ptPt;
export const componentsMessagesEnUs = enUs;
export const componentsMessagesEs = es;
