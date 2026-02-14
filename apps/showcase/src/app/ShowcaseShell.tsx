"use client";

import React from "react";
import Link from "next/link";
import {
  SgButton,
  SgToaster,
  SgFloatActionButton,
  SgStack,
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
import { usePathname, useRouter } from "next/navigation";

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
  { group: "Others", slug: "sg-code-block-base", label: "SgCodeBlockBase" },
  { group: "Utils", slug: "sg-environment-provider", label: "SgEnvironmentProvider" },
  { group: "Layout", slug: "sg-group-box", label: "SgGroupBox" },
  { group: "Layout", slug: "sg-card", label: "SgCard" },
  { group: "Layout", slug: "sg-screen", label: "SgScreen" },
  { group: "Layout", slug: "sg-main-panel", label: "SgMainPanel" },
  { group: "Layout", slug: "sg-panel", label: "SgPanel" },
  { group: "Layout", slug: "sg-grid", label: "SgGrid" },
  { group: "Layout", slug: "sg-stack", label: "SgStack" },
  { group: "Layout", slug: "sg-badge", label: "SgBadge" },
  { group: "Layout", slug: "sg-badge-overlay", label: "SgBadgeOverlay" },
  { group: "Layout", slug: "sg-popup", label: "SgPopup" },
  { group: "Layout", slug: "sg-dialog", label: "SgDialog" },
  { group: "Layout", slug: "sg-toolbar", label: "SgToolBar" },
  { group: "Layout", slug: "sg-dock-layout", label: "SgDockLayout" },
  { group: "Layout", slug: "sg-tree-view", label: "SgTreeView" },
  { group: "Gadgets", slug: "gadgets/sg-clock", label: "SgClock" },
  { group: "Gadgets", slug: "gadgets/sg-flip-digit", label: "SgFlipDigit" },
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

type ShowcaseSectionLink = {
  id: string;
  label: string;
};

function ArrowUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function sanitizeIdPart(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ShowcasePageTools(props: {
  pathname: string;
  scrollContainerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [links, setLinks] = React.useState<ShowcaseSectionLink[]>([]);

  React.useEffect(() => {
    const content = props.contentRef.current;
    if (!content) return;

    const buildLinks = () => {
      const sections = Array.from(content.querySelectorAll("section, [data-showcase-section]"));
      const usedIds = new Set<string>();
      const nextLinks: ShowcaseSectionLink[] = [];

      sections.forEach((section, index) => {
        const heading =
          section.querySelector("h2, h3") ??
          section.querySelector("[data-showcase-title]");
        if (!heading) return;

        const label = heading.textContent?.trim() ?? "";
        if (!label) return;

        const element = section as HTMLElement;
        let id = element.id;
        if (!id) {
          const suffix = sanitizeIdPart(label) || `section-${index + 1}`;
          id = `showcase-section-${suffix}`;
          if (usedIds.has(id)) id = `${id}-${index + 1}`;
          element.id = id;
        }
        if (usedIds.has(id)) return;

        usedIds.add(id);
        nextLinks.push({ id, label });
      });

      setLinks((prev) => {
        if (
          prev.length === nextLinks.length &&
          prev.every((item, index) => item.id === nextLinks[index]?.id && item.label === nextLinks[index]?.label)
        ) {
          return prev;
        }
        return nextLinks;
      });
    };

    buildLinks();
    const observer = new MutationObserver(buildLinks);
    observer.observe(content, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [props.pathname, props.contentRef]);

  if (props.pathname === "/components/sg-code-block-base") {
    return null;
  }

  return (
    <>
      {links.length > 0 ? (
        <div className="mb-6 overflow-x-auto">
          <SgStack direction="row" gap={8} className="min-w-max pb-1">
            {links.map((link) => (
              <SgButton
                key={link.id}
                appearance="outline"
                size="sm"
                onClick={() => {
                  const container = props.scrollContainerRef.current;
                  const content = props.contentRef.current;
                  if (!container || !content) return;
                  const target = document.getElementById(link.id);
                  if (!target || !content.contains(target)) return;
                  const top = target.offsetTop - 16;
                  container.scrollTo({ top, behavior: "smooth" });
                }}
              >
                {link.label}
              </SgButton>
            ))}
          </SgStack>
        </div>
      ) : null}
      <SgFloatActionButton
        hint="Ir para o inicio"
        icon={<ArrowUpIcon />}
        position="right-bottom"
        absolute
        onClick={() => {
          const container = props.scrollContainerRef.current;
          container?.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </>
  );
}

export default function ShowcaseShell(props: {
  children: React.ReactNode;
  initialLocale?: ShowcaseLocale;
  initialMessages?: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const mainRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
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
              {(["Inputs", "Buttons", "Layout", "Gadgets", "Wizard", "Others", "Utils"] as const).map((group) => {
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
          <main ref={mainRef} className="flex-1 overflow-y-auto p-8">
            <div ref={contentRef} id="showcase-page-top" className="relative min-h-full">
              <ShowcasePageTools
                pathname={pathname}
                scrollContainerRef={mainRef}
                contentRef={contentRef}
              />
              {props.children}
            </div>
          </main>
          <SgToaster />
          <ThemeEditor />
        </div>
      </SgComponentsI18nProvider>
    </ShowcaseI18nProvider>
  );
}
