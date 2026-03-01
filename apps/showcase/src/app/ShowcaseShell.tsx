"use client";

import React from "react";
import {
  SgToaster,
  SgComponentsI18nProvider,
  setComponentsI18n,
  componentsMessagesPtBr,
  componentsMessagesPtPt,
  componentsMessagesEnUs,
  componentsMessagesEs,
  SgDockScreen,
  SgDockZone,
  SgMenu,
  SgToolBar,
  SgToolbarIconButton,
  type SgMenuNode
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
  { group: "Inputs", slug: "sg-input-otp", label: "SgInputOTP" },
  { group: "Inputs", slug: "sg-input-date", label: "SgInputDate" },
  { group: "Inputs", slug: "sg-input-birth-date", label: "SgInputBirthDate" },
  { group: "Inputs", slug: "sg-toggle-switch", label: "SgToggleSwitch" },
  { group: "Inputs", slug: "sg-input-email", label: "SgInputEmail" },
  { group: "Inputs", slug: "sg-input-cpf", label: "SgInputCPF" },
  { group: "Inputs", slug: "sg-input-cnpj", label: "SgInputCNPJ" },
  { group: "Inputs", slug: "sg-input-cpf-cnpj", label: "SgInputCPFCNPJ" },
  { group: "Inputs", slug: "sg-input-postal-code", label: "SgInputPostalCode" },
  { group: "Inputs", slug: "sg-input-phone", label: "SgInputPhone" },
  { group: "Inputs", slug: "sg-autocomplete", label: "SgAutocomplete" },
  { group: "Inputs", slug: "sg-combobox", label: "SgCombobox" },
  { group: "Inputs", slug: "sg-slider", label: "SgSlider" },
  { group: "Inputs", slug: "sg-stepper-input", label: "SgStepperInput" },
  { group: "Inputs", slug: "sg-text-editor", label: "SgTextEditor" },
  { group: "Inputs", slug: "sg-rating", label: "SgRating" },
  { group: "Inputs", slug: "sg-radio-group", label: "SgRadioGroup" },
  { group: "Buttons", slug: "sg-button", label: "SgButton" },
  { group: "Buttons", slug: "sg-split-button", label: "SgSplitButton" },
  { group: "Buttons", slug: "sg-float-action-button", label: "SgFloatActionButton" },
  { group: "Menus", slug: "sg-dock-menu", label: "SgDockMenu" },
  { group: "Menus", slug: "sg-breadcrumb", label: "SgBreadcrumb" },
  { group: "Menus", slug: "sg-menu", label: "SgMenu" },
  { group: "Utils", slug: "sg-environment-provider", label: "SgEnvironmentProvider" },
  { group: "Layout", slug: "sg-group-box", label: "SgGroupBox" },
  { group: "Layout", slug: "sg-card", label: "SgCard" },
  { group: "Layout", slug: "sg-accordion", label: "SgAccordion" },
  { group: "Layout", slug: "sg-carousel", label: "SgCarousel" },
  { group: "Layout", slug: "sg-skeleton", label: "SgSkeleton" },
  { group: "Layout", slug: "sg-screen", label: "SgScreen" },
  { group: "Layout", slug: "sg-dock-screen", label: "SgDockScreen" },
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
  { group: "Layout", slug: "sg-avatar", label: "SgAvatar" },
  { group: "Layout", slug: "sg-expandable-panel", label: "SgExpandablePanel" },
  { group: "Layout", slug: "sg-page-control", label: "SgPageControl" },
  { group: "Digits", slug: "digits/sg-flip-digit", label: "SgFlipDigit" },
  { group: "Digits", slug: "digits/sg-fade-digit", label: "SgFadeDigit" },
  { group: "Digits", slug: "digits/sg-roller3d-digit", label: "SgRoller3DDigit" },
  { group: "Digits", slug: "digits/sg-matrix-digit", label: "SgMatrixDigit" },
  { group: "Digits", slug: "digits/sg-neon-digit", label: "SgNeonDigit" },
  { group: "Digits", slug: "digits/sg-discard-digit", label: "SgDiscardDigit" },
  { group: "Gadgets", slug: "gadgets/sg-clock", label: "SgClock" },
  { group: "Gadgets", slug: "gadgets/sg-string-animator", label: "SgStringAnimator" },
  { group: "Gadgets", slug: "gadgets/sg-qr-code", label: "SgQRCode" },
  { group: "Gadgets", slug: "gadgets/sg-linear-gauge", label: "SgLinearGauge" },
  { group: "Gadgets", slug: "gadgets/sg-radial-gauge", label: "SgRadialGauge" },
  { group: "Wizard", slug: "sg-wizard", label: "SgWizard" },
  { group: "Utils", slug: "sg-toaster", label: "SgToaster" },
  { group: "Utils", slug: "sg-playground", label: "SgPlayground" },
  { group: "Utils", slug: "sg-benchmark", label: "Benchmark" }
];

const THEME_ITEMS = [
  { slug: "theme", label: "Theme System", isTheme: true },
  { slug: "credits", label: "Creditos / Licencas", isTheme: true }
];

const MENU_GROUP_ORDER = ["Inputs", "Buttons", "Menus", "Layout", "Digits", "Gadgets", "Wizard", "Utils"] as const;

const SHELL_MENU: SgMenuNode[] = [
  ...THEME_ITEMS.map((item) => ({
    id: `theme-${item.slug}`,
    label: item.label,
    url: `/${item.slug}`
  })),
  ...MENU_GROUP_ORDER.map((group) => {
    const children = COMPONENTS.filter((item) => item.group === group).map((item) => ({
      id: `component-${item.slug}`,
      label: item.label,
      url: `/components/${item.slug}`
    }));
    return {
      id: `group-${group.toLowerCase()}`,
      label: group,
      children
    };
  }).filter((node) => node.children.length > 0)
];

const SIDEBAR_THEME_VARS = {
  "--primary": "27 62% 47%",
  "--primary-foreground": "0 0% 100%",
  "--muted": "35 55% 94%",
  "--muted-foreground": "28 30% 36%",
  "--border": "32 42% 83%",
  "--input": "32 42% 83%",
  "--ring": "27 62% 47%",
  "--sg-bg": "247 243 238",
  "--sg-surface": "255 250 245",
  "--sg-muted-surface": "242 233 223",
  "--sg-border": "226 206 188",
  "--sg-ring": "197 106 45",
  "--sg-text": "43 31 20",
  "--sg-muted": "126 95 70",
  "--sg-primary-500": "197 106 45",
  "--sg-primary-600": "168 87 38",
  "--sg-primary-hover": "168 87 38",
  "--sg-primary-active": "147 74 32",
  "--sg-on-primary": "255 255 255",
  "--sg-link": "197 106 45",
  "--sg-link-hover": "168 87 38"
} as React.CSSProperties;

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

export default function ShowcaseShell(props: {
  children: React.ReactNode;
  initialLocale?: ShowcaseLocale;
  initialMessages?: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = React.useState<ShowcaseLocale>(props.initialLocale ?? "pt-BR");
  const [messages, setMessages] = React.useState<Record<string, string>>(
    props.initialMessages ?? showcaseMessagesPtBr
  );
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);

  const applyLocale = React.useCallback((next: ShowcaseLocale) => {
    const nextMessages = MESSAGES_BY_LOCALE[next] ?? showcaseMessagesPtBr;
    setLocale(next);
    setMessages(nextMessages);
  }, []);

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
        <SgDockScreen
          id="showcase-shell-dock"
          screenId="showcase-shell-screen"
          fullscreen={false}
          className="h-screen w-full"
          layoutClassName="!grid-cols-[auto_minmax(0,1fr)_auto] !grid-rows-[auto_minmax(0,1fr)]"
        >
          <SgDockZone zone="top" className="col-span-3 row-start-1 !p-0 border-b border-[#e2cebc] bg-[#f7f3ee]">
            <div className="px-2 py-1">
              <SgToolBar
                id="showcase-locale-toolbar"
                title="Idioma"
                orientationDirection="horizontal-left"
                collapsible={false}
                dockZone="top"
              >
                {LOCALES.map((item) => (
                  <SgToolbarIconButton
                    key={item.value}
                    icon={item.value.split("-")[0]?.toUpperCase()}
                    label={item.value}
                    hint={item.label}
                    severity={locale === item.value ? "primary" : "plain"}
                    onClick={() => applyLocale(item.value)}
                  />
                ))}
              </SgToolBar>
            </div>
          </SgDockZone>

          <SgDockZone zone="left" className="col-start-1 row-start-2 !p-0 border-r border-[#e2cebc] bg-[#f7f3ee]">
            <SgMenu
              id="showcase-shell-menu-dockable"
              menu={SHELL_MENU}
              selection={{ activeUrl: pathname ?? undefined }}
              brand={{
                imageSrc: "/logo-seedgrid.svg",
                title: "Components Showcase",
                onClick: () => router.push("/")
              }}
              variant="sidebar"
              menuStyle="panel"
              mode="multiple"
              defaultExpandedIds={[]}
              collapsed={sidebarCollapsed}
              onCollapsedChange={setSidebarCollapsed}
              showCollapseButton
              search={{ enabled: true, placeholder: t({ locale, messages }, "showcase.nav.search.placeholder") }}
              dockable
              dockZone="left"
              draggable
              expandedWidth={288}
              collapsedWidth={76}
              border
              className="h-full bg-[#f7f3ee] text-[#2b1f14]"
              style={SIDEBAR_THEME_VARS}
              ariaLabel="Menu do showcase"
              onNavigate={(node) => {
                if (node.url) router.push(node.url);
              }}
            />
          </SgDockZone>

          <SgDockZone zone="right" className="col-start-3 row-start-2 !p-0 border-l border-[#e2cebc] bg-[#f7f3ee]">
            <div className="h-full w-14" />
          </SgDockZone>

          <SgDockZone zone="free" className="col-start-2 row-start-2 !p-0 !items-stretch !justify-start">
            <main className="h-full w-full overflow-y-auto p-2">{props.children}</main>
          </SgDockZone>
        </SgDockScreen>
        <SgToaster />
        <ThemeEditor />
      </SgComponentsI18nProvider>
    </ShowcaseI18nProvider>
  );
}
