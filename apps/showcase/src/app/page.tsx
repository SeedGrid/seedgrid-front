"use client";

import React from "react";
import Link from "next/link";
import { t, useShowcaseI18n } from "../i18n";
import SgCodeBlockBase from "./components/sgCodeBlockBase";

const COMPONENTS = [
  {
    categoryKey: "showcase.nav.inputs",
    items: [
      { slug: "sg-input-text", name: "SgInputText", desc: "Input de texto base com floating label, validacao, contador e botao limpar" },
      { slug: "sg-input-text-area", name: "SgInputTextArea", desc: "Input multi-linha com contagem de palavras e linhas" },
      { slug: "sg-input-password", name: "SgInputPassword", desc: "Input de senha com toggle de visibilidade, validacao e botao limpar" },
      { slug: "sg-input-otp", name: "SgInputOTP", desc: "Input OTP com digitos separados, colagem e mascara customizavel (# e 9)" },
      { slug: "sg-input-select", name: "SgInputSelect", desc: "Dropdown select com floating label" },
      { slug: "sg-input-date", name: "SgInputDate", desc: "Seletor de data com restricoes min/max" },
      { slug: "sg-input-birth-date", name: "SgInputBirthDate", desc: "Data de nascimento com validacao de idade minima/maxima" },
      { slug: "sg-toggle-switch", name: "SgToggleSwitch", desc: "Switch booleano com suporte a icones, estados e RHF" },
      { slug: "sg-input-email", name: "SgInputEmail", desc: "Input de email com validacao integrada e bloqueio de temporarios" },
      { slug: "sg-input-cpf", name: "SgInputCPF", desc: "Input de CPF com mascara e validacao de digitos" },
      { slug: "sg-input-cnpj", name: "SgInputCNPJ", desc: "Input de CNPJ com mascara e validacao de digitos" },
      { slug: "sg-input-cpf-cnpj", name: "SgInputCPFCNPJ", desc: "Input que aceita CPF ou CNPJ com deteccao automatica" },
      { slug: "sg-input-postal-code", name: "SgInputPostalCode", desc: "Input de codigo postal com mascara por pais (BR, PT, US, ES, UY, AR, PY)" },
      { slug: "sg-input-phone", name: "SgInputPhone", desc: "Input de telefone brasileiro com mascara (XX) XXXXX-XXXX" },
      { slug: "sg-autocomplete", name: "SgAutocomplete", desc: "Autocomplete com busca, agrupamento e render custom" },
      { slug: "sg-combobox", name: "SgCombobox", desc: "Combobox estilo select com source de objetos e onSelect(value)" },
      { slug: "sg-slider", name: "SgSlider", desc: "Slider com minValue, maxValue e onChange(value)" },
      { slug: "sg-stepper-input", name: "SgStepperInput", desc: "Input numérico com setas e step (min/max)" },
      { slug: "sg-text-editor", name: "SgTextEditor", desc: "Editor rico HTML com save/load" },
      { slug: "sg-datatable", name: "SgDatatable", desc: "Datatable com ordenacao, filtros, paginacao e selecao de linhas" }
    ]
  },
  {
    categoryKey: "showcase.nav.layout",
    items: [
      { slug: "sg-group-box", name: "SgGroupBox", desc: "Container agrupado com legenda (fieldset/legend)" },
      { slug: "sg-card", name: "SgCard", desc: "Card com header, leading/trailing, variants e collapse" },
      { slug: "sg-accordion", name: "SgAccordion", desc: "Accordion com modo vertical, horizontal e controle externo" },
      { slug: "sg-skeleton", name: "SgSkeleton", desc: "Placeholder visual para estados de carregamento" },
      { slug: "sg-screen", name: "SgScreen", desc: "Container raiz de viewport para telas e layouts complexos" },
      { slug: "sg-dock-screen", name: "SgDockScreen", desc: "Composicao pronta de SgScreen com SgDockLayout" },
      { slug: "sg-main-panel", name: "SgMainPanel", desc: "Layout dock estilo Delphi com top/left/right/bottom/client" },
      { slug: "sg-panel", name: "SgPanel", desc: "Container visual com borderStyle, padding, scroll e props de layout" },
      { slug: "sg-grid", name: "SgGrid", desc: "Grid responsivo com columns/minItemWidth, span, rowSpan e dense" },
      { slug: "sg-stack", name: "SgStack", desc: "Flex declarativo com direction, gap, justify, align e wrap" },
      { slug: "sg-badge", name: "SgBadge", desc: "Badge de status, contador e labels" },
      { slug: "sg-badge-overlay", name: "SgBadgeOverlay", desc: "Badge sobre icone/elemento" },
      { slug: "sg-avatar", name: "SgAvatar", desc: "Avatar com label, icon, image, shape, size e grupo" },
      { slug: "sg-breadcrumb", name: "SgBreadcrumb", desc: "Breadcrumb hierárquico com overflow e navegação" },
      { slug: "sg-menu", name: "SgMenu", desc: "Menu hierárquico para sidebar, drawer e inline" },
      { slug: "sg-expandable-panel", name: "SgExpandablePanel", desc: "Painel expansível inline/overlay com resize e animação" },
      { slug: "sg-dialog", name: "SgDialog", desc: "Dialog com header, severidade e footer" },
      { slug: "sg-toolbar", name: "SgToolBar", desc: "Toolbar com botoes e drag" },
      { slug: "sg-dock-layout", name: "SgDockLayout", desc: "Layout com dock zones e persistencia" },
      { slug: "sg-tree-view", name: "SgTreeView", desc: "Arvore com check, busca e confirmacao" },
      { slug: "sg-page-control", name: "SgPageControl", desc: "TabView com controle externo de página ativa e ocultação" }
    ]
  },
  {
    categoryKey: "showcase.nav.digits",
    items: [
      { slug: "digits/sg-flip-digit", name: "SgFlipDigit", desc: "Digito com animacao de flip card (estilo painel digital)" },
      { slug: "digits/sg-fade-digit", name: "SgFadeDigit", desc: "Digito com efeito de apagar/acender na troca de valor" },
      { slug: "digits/sg-roller3d-digit", name: "SgRoller3DDigit", desc: "Digito em tambor vertical com transicao 3D suave" },
      { slug: "digits/sg-matrix-digit", name: "SgMatrixDigit", desc: "Caracteres matriciais em pontos com color e backgroundColor" },
      { slug: "digits/sg-neon-digit", name: "SgNeonDigit", desc: "Texto em neon com glow configuravel (color, font, backgroundColor e shadowColor)" },
      { slug: "digits/sg-discard-digit", name: "SgDiscardDigit", desc: "Bloco de folhas com animacao 3D de descarte e troca de valor" },
      { slug: "digits/sg-segment-digit", name: "SgSegmentDigit", desc: "Digito seven-segment em SVG no estilo classico de painel digital" },
      { slug: "digits/sg-seven-segment-digit", name: "SgSevenSegmentDigit", desc: "Display de sete segmentos com suporte a digitos e caracteres hexadecimais" }
    ]
  },
  {
    categoryKey: "showcase.nav.gadgets",
    items: [
      { slug: "gadgets/sg-clock", name: "SgClock", desc: "Relogio digital e analogico com themes" },
      { slug: "gadgets/sg-calendar", name: "SgCalendar", desc: "Calendario mensal em card de gadget com drag e collapse" },
      { slug: "gadgets/sg-string-animator", name: "SgStringAnimator", desc: "Animador de texto para transicoes de caracteres" },
      { slug: "gadgets/sg-qr-code", name: "SgQRCode", desc: "QR Code com valor dinamico e logo central" },
      { slug: "gadgets/sg-linear-gauge", name: "SgLinearGauge", desc: "Gauge linear com ranges e pointers" },
      { slug: "gadgets/sg-radial-gauge", name: "SgRadialGauge", desc: "Gauge radial com needle, marker e annotations" }
    ]
  },
  {
    categoryKey: "showcase.nav.wizard",
    items: [
      { slug: "sg-wizard", name: "SgWizard", desc: "Formulario multi-etapas com navegacao e callback async" }
    ]
  }
];

export default function HomePage() {
  const i18n = useShowcaseI18n();

  const renderWithTokens = (text: string, tokens: Record<string, React.ReactNode>) => {
    const pattern = new RegExp(`(${Object.keys(tokens).map((k) => `\\{${k}\\}`).join("|")})`, "g");
    return text.split(pattern).map((part, index) => {
      const key = part.replace(/[{}]/g, "");
      return tokens[key] ? <span key={index}>{tokens[key]}</span> : <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold">{t(i18n, "showcase.home.title")}</h1>
      <p className="mt-2 text-muted-foreground">
        {renderWithTokens(t(i18n, "showcase.home.description"), {
          pkg: <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">@seedgrid/fe-components</code>
        })}
      </p>

      <section className="mt-6 rounded-lg border border-border bg-foreground/5 p-5">
        <h2 className="text-lg font-semibold">{t(i18n, "showcase.home.install.title")}</h2>
        <pre className="mt-3 rounded-md bg-foreground/5 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
          pnpm add @seedgrid/fe-components @seedgrid/fe-theme react-hook-form
        </pre>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-foreground/5 p-5">
        <h2 className="text-lg font-semibold">{t(i18n, "showcase.home.about.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {renderWithTokens(t(i18n, "showcase.home.about.p1"), {
            name: <code className="rounded bg-muted px-1">name</code>,
            control: <code className="rounded bg-muted px-1">control</code>,
            controller: <code className="rounded bg-muted px-1">Controller</code>
          })}
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>{t(i18n, "showcase.home.about.li1")}</li>
          <li>{t(i18n, "showcase.home.about.li2")}</li>
          <li>{t(i18n, "showcase.home.about.li3")}</li>
          <li>{t(i18n, "showcase.home.about.li4")}</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          {renderWithTokens(t(i18n, "showcase.home.about.p2"), {
            name: <code className="rounded bg-muted px-1">name</code>,
            control: <code className="rounded bg-muted px-1">control</code>
          })}
        </p>
        <SgCodeBlockBase code={`import { useForm } from "react-hook-form";
import { SgInputText, SgInputEmail } from "@seedgrid/fe-components";

const { register, handleSubmit } = useForm({
  defaultValues: { nome: "", email: "" }
});

<form onSubmit={handleSubmit(onSubmit)}>
  <SgInputText
    id="nome"
    name="nome"
    register={register}
    label="Nome"
    required
    requiredMessage="Informe o nome."
  />

  <SgInputEmail
    id="email"
    name="email"
    register={register}
    label="Email"
    required
  />
</form>`} />
      </section>

      <section className="mt-8 rounded-lg border border-border bg-foreground/5 p-5">
        <h2 className="text-lg font-semibold">{t(i18n, "showcase.home.i18n.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {renderWithTokens(t(i18n, "showcase.home.i18n.p1"), {
            namespace: <code className="rounded bg-muted px-1">components.*</code>
          })}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(i18n, "showcase.home.i18n.p2")}
        </p>
        <SgCodeBlockBase code={`import { SgComponentsI18nProvider } from "@seedgrid/fe-components";

const messagesEn = {
  "components.inputs.required": "Required field.",
  "components.inputs.email.invalid": "Invalid email."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-US">
      <body>
        <SgComponentsI18nProvider locale="en-US" messages={messagesEn}>
          {children}
        </SgComponentsI18nProvider>
      </body>
    </html>
  );
}`} />
        <p className="mt-3 text-sm text-muted-foreground">
          {t(i18n, "showcase.home.i18n.p3")}
        </p>
        <SgCodeBlockBase code={`import { setComponentsI18n } from "@seedgrid/fe-components";

setComponentsI18n({
  locale: "en-US",
  messages: {
    "components.inputs.required": "Required field.",
    "components.password.common": "Password is too common."
  }
});`} />
      </section>

      {COMPONENTS.map((group) => (
        <section key={group.categoryKey} className="mt-8">
          <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4">
            {t(i18n, group.categoryKey)}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <Link
                key={item.slug}
                href={`/components/${item.slug}`}
                className="group rounded-lg border border-border p-4 hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <h3 className="font-semibold text-primary group-hover:underline">{item.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
