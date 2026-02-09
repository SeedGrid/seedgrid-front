"use client";

import React from "react";
import Link from "next/link";
import {
  SgToaster,
  SgComponentsI18nProvider,
  setComponentsI18n,
  componentsMessagesPtBr,
  componentsMessagesPtPt,
  componentsMessagesEnUs,
  componentsMessagesEs
} from "@seedgrid/fe-components";
import {
  ShowcaseI18nProvider,
  setShowcaseI18n,
  t,
  showcaseMessagesEnUs,
  showcaseMessagesEs,
  showcaseMessagesPtBr,
  showcaseMessagesPtPt,
  type ShowcaseLocale
} from "../i18n";

const COMPONENTS = [
  { slug: "sg-input-text", label: "SgInputText" },
  { slug: "sg-input-number", label: "SgInputNumber" },
  { slug: "sg-input-text-area", label: "SgInputTextArea" },
  { slug: "sg-input-password", label: "SgInputPassword" },
  { slug: "sg-input-select", label: "SgInputSelect" },
  { slug: "sg-input-date", label: "SgInputDate" },
  { slug: "sg-input-birth-date", label: "SgInputBirthDate" },
  { slug: "sg-input-email", label: "SgInputEmail" },
  { slug: "sg-input-cpf", label: "SgInputCPF" },
  { slug: "sg-input-cnpj", label: "SgInputCNPJ" },
  { slug: "sg-input-cpf-cnpj", label: "SgInputCPFCNPJ" },
  { slug: "sg-input-cep", label: "SgInputCEP" },
  { slug: "sg-input-phone", label: "SgInputPhone" },
  { slug: "sg-autocomplete", label: "SgAutocomplete" },
  { slug: "sg-button", label: "SgButton" },
  { slug: "sg-group-box", label: "SgGroupBox" },
  { slug: "sg-wizard", label: "SgWizard" },
  { slug: "sg-benchmark", label: "Benchmark" }
];

const LOCALES: Array<{ value: ShowcaseLocale; label: string }> = [
  { value: "pt-BR", label: "pt-BR (Portugues do Brasil)" },
  { value: "pt-PT", label: "pt-PT (Portugues de Portugal)" },
  { value: "en-US", label: "en-US (Ingles dos Estados Unidos)" },
  { value: "es", label: "es (Espanhol)" }
];

const MESSAGES_BY_LOCALE: Record<ShowcaseLocale, Record<string, string>> = {
  "pt-BR": showcaseMessagesPtBr,
  "pt-PT": showcaseMessagesPtPt,
  "en-US": showcaseMessagesEnUs,
  es: showcaseMessagesEs
};

const COMPONENTS_MESSAGES_BY_LOCALE: Record<ShowcaseLocale, Record<string, string>> = {
  "pt-BR": componentsMessagesPtBr,
  "pt-PT": componentsMessagesPtPt,
  "en-US": componentsMessagesEnUs,
  es: componentsMessagesEs
};

function LocaleSwitcher(props: {
  value: ShowcaseLocale;
  onChange: (next: ShowcaseLocale) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>Idioma</span>
      <select
        className="rounded border border-border bg-white px-2 py-1 text-xs"
        value={props.value}
        onChange={(event) => {
          const next = event.target.value as ShowcaseLocale;
          props.onChange(next);
        }}
      >
        {LOCALES.map((locale) => (
          <option key={locale.value} value={locale.value}>
            {locale.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ShowcaseShell(props: {
  children: React.ReactNode;
  initialLocale?: ShowcaseLocale;
  initialMessages?: Record<string, string>;
}) {
  const [locale, setLocale] = React.useState<ShowcaseLocale>(props.initialLocale ?? "pt-BR");
  const [messages, setMessages] = React.useState<Record<string, string>>(
    props.initialMessages ?? showcaseMessagesPtBr
  );

  React.useEffect(() => {
    let stored: ShowcaseLocale | null = null;
    try {
      stored = (localStorage.getItem("seedgrid-showcase-locale") as ShowcaseLocale | null) ?? null;
    } catch {
      stored = null;
    }
    if (stored && MESSAGES_BY_LOCALE[stored]) {
      const nextMessages = MESSAGES_BY_LOCALE[stored] ?? showcaseMessagesPtBr;
      const nextComponentMessages =
        COMPONENTS_MESSAGES_BY_LOCALE[stored] ?? componentsMessagesPtBr;
      setLocale(stored);
      setMessages(nextMessages);
      setShowcaseI18n({ locale: stored, messages: nextMessages });
      setComponentsI18n({ locale: stored, messages: nextComponentMessages });
      return;
    }
    setShowcaseI18n({ locale, messages });
    setComponentsI18n({
      locale,
      messages: COMPONENTS_MESSAGES_BY_LOCALE[locale] ?? componentsMessagesPtBr
    });
  }, []);

  React.useEffect(() => {
    setShowcaseI18n({ locale, messages });
    setComponentsI18n({
      locale,
      messages: COMPONENTS_MESSAGES_BY_LOCALE[locale] ?? componentsMessagesPtBr
    });
    try {
      localStorage.setItem("seedgrid-showcase-locale", locale);
    } catch {
      // ignore
    }
  }, [locale, messages]);

  return (
    <ShowcaseI18nProvider locale={locale} messages={messages}>
      <SgComponentsI18nProvider
        locale={locale}
        messages={COMPONENTS_MESSAGES_BY_LOCALE[locale] ?? componentsMessagesPtBr}
      >
        <div className="flex min-h-screen">
          <aside className="w-64 shrink-0 border-r border-border bg-muted/30 p-4 overflow-y-auto">
            <Link href="/" className="block mb-6">
              <span className="text-lg font-bold text-primary">{t({ locale, messages }, "showcase.app.brand")}</span>
              <span className="block text-xs text-muted-foreground">
                {t({ locale, messages }, "showcase.app.subtitle")}
              </span>
            </Link>
            <div className="mb-4">
              <LocaleSwitcher
                value={locale}
                onChange={(next) => {
                  const nextMessages = MESSAGES_BY_LOCALE[next] ?? showcaseMessagesPtBr;
                  setLocale(next);
                  setMessages(nextMessages);
                }}
              />
            </div>
            <nav className="flex flex-col gap-0.5">
              {COMPONENTS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/components/${c.slug}`}
                  className="rounded-md px-3 py-2 text-sm hover:bg-primary/10 transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-8 overflow-y-auto">{props.children}</main>
          <SgToaster />
        </div>
      </SgComponentsI18nProvider>
    </ShowcaseI18nProvider>
  );
}
