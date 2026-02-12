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
  componentsMessagesEs,
  SgAutocomplete,
  type SgAutocompleteItem
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
import { ThemeEditor } from "./ThemeEditor";
import { useRouter } from "next/navigation";

const COMPONENTS = [
  { group: "Inputs", slug: "sg-input-text", label: "SgInputText" },
  { group: "Inputs", slug: "sg-input-number", label: "SgInputNumber" },
  { group: "Inputs", slug: "sg-currency-edit", label: "SgCurrencyEdit" },
  { group: "Inputs", slug: "sg-input-text-area", label: "SgInputTextArea" },
  { group: "Inputs", slug: "sg-input-password", label: "SgInputPassword" },
  { group: "Inputs", slug: "sg-input-select", label: "SgInputSelect" },
  { group: "Inputs", slug: "sg-input-date", label: "SgInputDate" },
  { group: "Inputs", slug: "sg-input-birth-date", label: "SgInputBirthDate" },
  { group: "Inputs", slug: "sg-input-email", label: "SgInputEmail" },
  { group: "Inputs", slug: "sg-input-cpf", label: "SgInputCPF" },
  { group: "Inputs", slug: "sg-input-cnpj", label: "SgInputCNPJ" },
  { group: "Inputs", slug: "sg-input-cpf-cnpj", label: "SgInputCPFCNPJ" },
  { group: "Inputs", slug: "sg-input-postal-code", label: "SgInputPostalCode" },
  { group: "Inputs", slug: "sg-input-phone", label: "SgInputPhone" },
  { group: "Inputs", slug: "sg-autocomplete", label: "SgAutocomplete" },
  { group: "Inputs", slug: "sg-text-editor", label: "SgTextEditor" },
  { group: "Buttons", slug: "sg-button", label: "SgButton" },
  { group: "Buttons", slug: "sg-split-button", label: "SgSplitButton" },
  { group: "Buttons", slug: "sg-float-action-button", label: "SgFloatActionButton" },
  { group: "Utils", slug: "sg-environment-provider", label: "SgEnvironmentProvider" },
  { group: "Layout", slug: "sg-group-box", label: "SgGroupBox" },
  { group: "Layout", slug: "sg-card", label: "SgCard" },
  { group: "Layout", slug: "sg-badge", label: "SgBadge" },
  { group: "Layout", slug: "sg-badge-overlay", label: "SgBadgeOverlay" },
  { group: "Layout", slug: "sg-popup", label: "SgPopup" },
  { group: "Layout", slug: "sg-dialog", label: "SgDialog" },
  { group: "Layout", slug: "sg-toolbar", label: "SgToolBar" },
  { group: "Layout", slug: "sg-dock-layout", label: "SgDockLayout" },
  { group: "Layout", slug: "sg-tree-view", label: "SgTreeView" },
  { group: "Layout", slug: "sg-clock", label: "SgClock" },
  { group: "Wizard", slug: "sg-wizard", label: "SgWizard" },
  { group: "Utils", slug: "sg-benchmark", label: "Benchmark" }
];

const THEME_ITEMS = [
  { slug: "theme", label: "Theme System", isTheme: true }
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
  const router = useRouter();
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
          <aside className="w-72 shrink-0 border-r border-border bg-muted/30 p-4 overflow-y-auto overflow-x-hidden sticky top-0 h-screen">
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
            <div className="mb-4">
              <SgAutocomplete<SgAutocompleteItem>
                id="nav-search"
                label={t({ locale, messages }, "showcase.nav.search.label")}
                placeholder={t({ locale, messages }, "showcase.nav.search.placeholder")}
                openOnFocus={false}
                showDropDownButton
                minLengthForSearch={1}
                grouped
                clearOnSelect
                source={(query) => {
                  const q = (query ?? "").toLowerCase();
                  const items: SgAutocompleteItem[] = [
                    ...THEME_ITEMS.map((item) => ({
                      id: item.slug,
                      label: item.label,
                      value: item.slug,
                      group: "Theme",
                      data: { slug: item.slug, path: `/${item.slug}` }
                    })),
                    ...COMPONENTS.map((item) => ({
                      id: item.slug,
                      label: item.label,
                      value: item.slug,
                      group: item.group,
                      data: { slug: item.slug, path: `/components/${item.slug}` }
                    }))
                  ];
                  if (!q) return items;
                  return items.filter((item) =>
                    item.label.toLowerCase().includes(q) ||
                    item.value?.toLowerCase().includes(q) ||
                    item.group?.toLowerCase().includes(q)
                  );
                }}
                onSelect={(item) => {
                  const path = (item.data as { path?: string } | undefined)?.path;
                  if (path) router.push(path);
                }}
              />
            </div>
            <nav className="flex flex-col gap-0.5">
              {THEME_ITEMS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-md px-3 py-2 text-sm hover:bg-primary/10 transition-colors font-semibold"
                >
                  {c.label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              {(["Inputs", "Buttons", "Layout", "Wizard", "Utils"] as const).map((group) => {
                const items = COMPONENTS.filter((c) => c.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group} className="mb-2 flex flex-col gap-0.5">
                    <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {group}
                    </div>
                    {items.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/components/${c.slug}`}
                        className="rounded-md px-3 py-2 text-sm hover:bg-primary/10 transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                );
              })}
            </nav>
          </aside>
          <main className="flex-1 p-8 overflow-y-auto">{props.children}</main>
          <SgToaster />
          <ThemeEditor />
        </div>
      </SgComponentsI18nProvider>
    </ShowcaseI18nProvider>
  );
}
