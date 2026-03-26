"use client";

import React from "react";
import ptBr from "./pt-BR.js";
import ptPt from "./pt-PT.js";
import enUs from "./en-US.js";
import es from "./es.js";
import fr from "./fr.js";

export type SgComponentsLocale = "pt-BR" | "pt-PT" | "en-US" | "en" | "es" | "fr" | (string & {});

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

export function normalizeComponentsLocale(locale?: SgComponentsLocale): SgComponentsLocale {
  if (!locale) return "en-US";
  if (locale === "en") return "en-US";
  return locale;
}

export function getBuiltInComponentsMessages(locale?: SgComponentsLocale): SgComponentsMessages {
  switch (normalizeComponentsLocale(locale)) {
    case "pt-BR":
      return ptBr;
    case "pt-PT":
      return ptPt;
    case "es":
      return es;
    case "fr":
      return fr;
    case "en-US":
    default:
      return enUs;
  }
}

const DEFAULT_I18N: SgComponentsI18n = {
  locale: "en-US",
  messages: enUs
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
  const nextLocale = normalizeComponentsLocale(input.locale ?? current.locale);
  const shouldPreserveCurrentMessages = normalizeComponentsLocale(current.locale) === nextLocale;
  const mergedMessages = {
    ...getBuiltInComponentsMessages(nextLocale),
    ...(shouldPreserveCurrentMessages ? current.messages : {}),
    ...resolveMessages(input.messages)
  };
  const next: SgComponentsI18n = {
    locale: nextLocale,
    messages: mergedMessages
  };
  (globalThis as SeedgridGlobal).__seedgridComponentsI18n = next;
}

export function getComponentsI18n(): SgComponentsI18n {
  const runtime = getRuntimeI18n();
  if (!runtime) return DEFAULT_I18N;
  const locale = normalizeComponentsLocale(runtime.locale ?? DEFAULT_I18N.locale);
  return {
    locale,
    messages: { ...getBuiltInComponentsMessages(locale), ...(runtime.messages ?? {}) }
  };
}

export function resolveComponentsI18n(input?: SgComponentsI18nInput): SgComponentsI18n {
  const base = getComponentsI18n();
  if (!input) return base;
  const locale = normalizeComponentsLocale(input.locale ?? base.locale);
  const shouldPreserveBaseMessages = normalizeComponentsLocale(base.locale) === locale;
  return {
    locale,
    messages: {
      ...getBuiltInComponentsMessages(locale),
      ...(shouldPreserveBaseMessages ? base.messages : {}),
      ...resolveMessages(input.messages)
    }
  };
}

const ComponentsI18nContext = React.createContext<SgComponentsI18n | null>(null);

export function SgComponentsI18nProvider(props: {
  locale?: SgComponentsLocale;
  messages?: SgComponentsMessages | SgComponentsMessagesByNamespace;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => {
    const locale = normalizeComponentsLocale(props.locale ?? DEFAULT_I18N.locale);
    const mergedMessages = { ...getBuiltInComponentsMessages(locale), ...resolveMessages(props.messages) };
    return {
      locale,
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
  const resolvedI18n = i18n ?? getComponentsI18n();
  const template = resolvedI18n.messages[key] ?? getBuiltInComponentsMessages(resolvedI18n.locale)[key] ?? DEFAULT_I18N.messages[key] ?? key;
  return formatMessage(template, params);
}

export const componentsMessagesPtBr = ptBr;
export const componentsMessagesPtPt = ptPt;
export const componentsMessagesEnUs = enUs;
export const componentsMessagesEn = enUs;
export const componentsMessagesEs = es;
export const componentsMessagesFr = fr;
