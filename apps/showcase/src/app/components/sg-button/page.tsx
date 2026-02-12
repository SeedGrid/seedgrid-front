"use client";

import React from "react";
import { Check, X, Bookmark, Search, Users, Bell, Heart, Filter } from "lucide-react";
import { SgButton } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";

const SEVERITIES = ["primary", "secondary", "success", "info", "warning", "help", "danger"] as const;
const SEVERITIES_WITH_PLAIN = [...SEVERITIES, "plain"] as const;

const ICON_MAP = [
  { severity: "primary", icon: <Bookmark className="size-4" /> },
  { severity: "secondary", icon: <Search className="size-4" /> },
  { severity: "success", icon: <Users className="size-4" /> },
  { severity: "info", icon: <Bell className="size-4" /> },
  { severity: "help", icon: <Heart className="size-4" /> },
  { severity: "danger", icon: <X className="size-4" /> },
  { severity: "warning", icon: <Check className="size-4" /> },
] as const;

function useFakeProcess(durationMs: number) {
  const [loading, setLoading] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  const run = React.useCallback(() => {
    if (timerRef.current) return;
    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      setLoading(false);
      timerRef.current = null;
    }, durationMs);
  }, [durationMs]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return { loading, run };
}

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="text-sm text-muted-foreground">{props.description}</p> : null}
      {props.children}
    </section>
  );
}

function Row(props: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{props.children}</div>;
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code.trim()} />;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function SgButtonShowcase() {
  const submit = useFakeProcess(2000);

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold">SgButton</h1>
        <p className="mt-2 text-muted-foreground">
          Botao com suporte a severity, appearance, shape, raised, icons e loading.
        </p>
      </div>

      {/* ── Basic ── */}
      <Section title="Basic" description="Botao padrao com onClick e estado disabled.">
        <Row>
          <SgButton onClick={submit.run} loading={submit.loading}>
            Submit
          </SgButton>
          <SgButton disabled>Disabled</SgButton>
        </Row>
        <CodeBlock code={`import { SgButton } from "@seedgrid/fe-components";

<SgButton onClick={() => console.log("click")} loading={isLoading}>
  Submit
</SgButton>

<SgButton disabled>Disabled</SgButton>`} />
      </Section>

      {/* ── Icons ── */}
      <Section title="Icons" description="Exemplos completos com icones para validar appearance/shape/raised.">
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Raised Buttons</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`raised-${s}`} severity={s} raised leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Rounded Buttons</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`rounded-${s}`} severity={s} shape="rounded" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Ghost Buttons (Flat)</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`flat-${s}`} severity={s} appearance="ghost" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Raised Text Buttons</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`raised-text-${s}`} severity={s} appearance="outline" raised leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Outlined Buttons</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`outline-${s}`} severity={s} appearance="outline" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>
        </div>

        <CodeBlock code={`import { Check } from "lucide-react";
import { SgButton } from "@seedgrid/fe-components";

// Raised Buttons
<SgButton severity="primary" raised leftIcon={<Check className="size-4" />}>Primary</SgButton>
<SgButton severity="info" raised leftIcon={<Check className="size-4" />}>Info</SgButton>
<SgButton severity="danger" raised leftIcon={<Check className="size-4" />}>Danger</SgButton>

// Rounded Buttons
<SgButton severity="secondary" shape="rounded" leftIcon={<Check className="size-4" />}>Secondary</SgButton>
<SgButton severity="success" shape="rounded" leftIcon={<Check className="size-4" />}>Success</SgButton>

// Ghost Buttons (Flat)
<SgButton severity="secondary" appearance="ghost" leftIcon={<Check className="size-4" />}>Secondary</SgButton>
<SgButton severity="warning" appearance="ghost" leftIcon={<Check className="size-4" />}>Warning</SgButton>

// Raised Text Buttons (outline + raised)
<SgButton severity="primary" appearance="outline" raised leftIcon={<Check className="size-4" />}>Primary</SgButton>
<SgButton severity="help" appearance="outline" raised leftIcon={<Check className="size-4" />}>Help</SgButton>

// Outlined Buttons
<SgButton severity="info" appearance="outline" leftIcon={<Check className="size-4" />}>Info</SgButton>
<SgButton severity="danger" appearance="outline" leftIcon={<Check className="size-4" />}>Danger</SgButton>`} />
      </Section>
      <Section title="Severities" description='severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s}>{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`import { SgButton } from "@seedgrid/fe-components";

<SgButton severity="primary">Primary</SgButton>
<SgButton severity="secondary">Secondary</SgButton>
<SgButton severity="success">Success</SgButton>
<SgButton severity="info">Info</SgButton>
<SgButton severity="warning">Warning</SgButton>
<SgButton severity="help">Help</SgButton>
<SgButton severity="danger">Danger</SgButton>`} />
      </Section>

      {/* ── Raised Buttons ── */}
      <Section title="Raised Buttons" description="raised adiciona sombra ao botao.">
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} raised>{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" raised>Primary</SgButton>
<SgButton severity="secondary" raised>Secondary</SgButton>
<SgButton severity="success" raised>Success</SgButton>
<SgButton severity="info" raised>Info</SgButton>
<SgButton severity="warning" raised>Warning</SgButton>
<SgButton severity="help" raised>Help</SgButton>
<SgButton severity="danger" raised>Danger</SgButton>`} />
      </Section>

      {/* ── Rounded Buttons ── */}
      <Section title="Rounded Buttons" description='shape="rounded" para formato pill.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} shape="rounded">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" shape="rounded">Primary</SgButton>
<SgButton severity="secondary" shape="rounded">Secondary</SgButton>
<SgButton severity="success" shape="rounded">Success</SgButton>
<SgButton severity="info" shape="rounded">Info</SgButton>
<SgButton severity="warning" shape="rounded">Warning</SgButton>
<SgButton severity="help" shape="rounded">Help</SgButton>
<SgButton severity="danger" shape="rounded">Danger</SgButton>`} />
      </Section>

      {/* ── Flat Buttons (ghost) ── */}
      <Section title="Flat Buttons" description='appearance="ghost" - sem fundo, apenas texto colorido.'>
        <Row>
          {SEVERITIES_WITH_PLAIN.map((s) => (
            <SgButton key={s} severity={s} appearance="ghost">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" appearance="ghost">Primary</SgButton>
<SgButton severity="secondary" appearance="ghost">Secondary</SgButton>
<SgButton severity="success" appearance="ghost">Success</SgButton>
<SgButton severity="info" appearance="ghost">Info</SgButton>
<SgButton severity="warning" appearance="ghost">Warning</SgButton>
<SgButton severity="help" appearance="ghost">Help</SgButton>
<SgButton severity="danger" appearance="ghost">Danger</SgButton>
<SgButton severity="plain" appearance="ghost">Plain</SgButton>`} />
      </Section>

      {/* ── Raised Text Buttons ── */}
      <Section title="Raised Text Buttons" description='appearance="outline" + raised - bordas com sombra.'>
        <Row>
          {SEVERITIES_WITH_PLAIN.map((s) => (
            <SgButton key={s} severity={s} appearance="outline" raised>{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" appearance="outline" raised>Primary</SgButton>
<SgButton severity="secondary" appearance="outline" raised>Secondary</SgButton>
<SgButton severity="success" appearance="outline" raised>Success</SgButton>
<SgButton severity="info" appearance="outline" raised>Info</SgButton>
<SgButton severity="warning" appearance="outline" raised>Warning</SgButton>
<SgButton severity="help" appearance="outline" raised>Help</SgButton>
<SgButton severity="danger" appearance="outline" raised>Danger</SgButton>
<SgButton severity="plain" appearance="outline" raised>Plain</SgButton>`} />
      </Section>

      {/* ── Outlined Buttons ── */}
      <Section title="Outlined Buttons" description='appearance="outline" - apenas bordas coloridas.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="outline">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" appearance="outline">Primary</SgButton>
<SgButton severity="secondary" appearance="outline">Secondary</SgButton>
<SgButton severity="success" appearance="outline">Success</SgButton>
<SgButton severity="info" appearance="outline">Info</SgButton>
<SgButton severity="warning" appearance="outline">Warning</SgButton>
<SgButton severity="help" appearance="outline">Help</SgButton>
<SgButton severity="danger" appearance="outline">Danger</SgButton>`} />
      </Section>

      {/* ── Rounded Icon Buttons (solid) ── */}
      <Section title="Rounded Icon Buttons" description='shape="rounded" + icon only - botoes circulares.'>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock code={`import { Bookmark, Search, Users, Bell, Heart, X, Check } from "lucide-react";
import { SgButton } from "@seedgrid/fe-components";

<SgButton severity="primary" shape="rounded" leftIcon={<Bookmark className="size-4" />} />
<SgButton severity="secondary" shape="rounded" leftIcon={<Search className="size-4" />} />
<SgButton severity="success" shape="rounded" leftIcon={<Users className="size-4" />} />
<SgButton severity="danger" shape="rounded" leftIcon={<X className="size-4" />} />`} />
      </Section>

      {/* ── Rounded Text Icon Buttons (ghost) ── */}
      <Section title="Rounded Text Icon Buttons" description='shape="rounded" + icon only + appearance="ghost"'>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" appearance="ghost" leftIcon={icon} />
          ))}
          <SgButton severity="plain" shape="rounded" appearance="ghost" leftIcon={<Filter className="size-4" />} />
        </Row>
        <CodeBlock code={`<SgButton severity="primary" shape="rounded" appearance="ghost" leftIcon={<Check className="size-4" />} />
<SgButton severity="secondary" shape="rounded" appearance="ghost" leftIcon={<Bookmark className="size-4" />} />
<SgButton severity="danger" shape="rounded" appearance="ghost" leftIcon={<X className="size-4" />} />`} />
      </Section>

      {/* ── Rounded and Outlined Icon Buttons ── */}
      <Section title="Rounded and Outlined Icon Buttons" description='shape="rounded" + icon only + appearance="outline"'>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" appearance="outline" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock code={`<SgButton severity="primary" shape="rounded" appearance="outline" leftIcon={<Check className="size-4" />} />
<SgButton severity="secondary" shape="rounded" appearance="outline" leftIcon={<Bookmark className="size-4" />} />
<SgButton severity="danger" shape="rounded" appearance="outline" leftIcon={<X className="size-4" />} />`} />
      </Section>

      {/* ── Sizes ── */}
      <Section title="Sizes" description='size="sm" | "md" | "lg"'>
        <Row>
          <SgButton size="sm">Small</SgButton>
          <SgButton size="md">Medium</SgButton>
          <SgButton size="lg">Large</SgButton>
        </Row>
        <Row>
          <SgButton size="sm" shape="rounded" leftIcon={<Check className="size-4" />} />
          <SgButton size="md" shape="rounded" leftIcon={<Check className="size-4" />} />
          <SgButton size="lg" shape="rounded" leftIcon={<Check className="size-4" />} />
        </Row>
        <CodeBlock code={`<SgButton size="sm">Small</SgButton>
<SgButton size="md">Medium</SgButton>
<SgButton size="lg">Large</SgButton>

// Icon buttons in different sizes
<SgButton size="sm" shape="rounded" leftIcon={<Check className="size-4" />} />
<SgButton size="md" shape="rounded" leftIcon={<Check className="size-4" />} />
<SgButton size="lg" shape="rounded" leftIcon={<Check className="size-4" />} />`} />
      </Section>

      {/* ── Loading ── */}
      <Section title="Loading" description="loading=true exibe spinner e desabilita o botao.">
        <Row>
          <SgButton loading>Processing...</SgButton>
          <SgButton severity="success" loading>Saving...</SgButton>
          <SgButton severity="danger" loading leftIcon={<X className="size-4" />}>Deleting...</SgButton>
          <SgButton shape="rounded" loading leftIcon={<Check className="size-4" />} />
        </Row>
        <CodeBlock code={`<SgButton loading>Processing...</SgButton>
<SgButton severity="success" loading>Saving...</SgButton>
<SgButton severity="danger" loading leftIcon={<X className="size-4" />}>Deleting...</SgButton>
<SgButton shape="rounded" loading leftIcon={<Check className="size-4" />} />`} />
      </Section>

      {/* ── Custom Colors ── */}
      <Section title="Custom Colors" description="customColors permite qualquer cor via CSS.">
        <Row>
          <SgButton
            customColors={{
              bg: "#0f172a",
              fg: "#ffffff",
              hoverBg: "#020617",
              ring: "rgba(15,23,42,.35)"
            }}
          >
            Brand Dark
          </SgButton>
          <SgButton
            customColors={{
              bg: "#ec4899",
              fg: "#ffffff",
              border: "#db2777",
              hoverBg: "#db2777",
              ring: "rgba(236,72,153,.35)"
            }}
          >
            Pink
          </SgButton>
          <SgButton
            appearance="outline"
            customColors={{
              bg: "#8b5cf6",
              fg: "#8b5cf6",
              border: "#8b5cf6",
              ring: "rgba(139,92,246,.35)"
            }}
          >
            Violet Outline
          </SgButton>
        </Row>
        <CodeBlock code={`<SgButton
  customColors={{
    bg: "#0f172a",
    fg: "#ffffff",
    hoverBg: "#020617",
    ring: "rgba(15,23,42,.35)"
  }}
>
  Brand Dark
</SgButton>

<SgButton
  customColors={{
    bg: "#ec4899",
    fg: "#ffffff",
    border: "#db2777",
    hoverBg: "#db2777",
    ring: "rgba(236,72,153,.35)"
  }}
>
  Pink
</SgButton>

<SgButton
  appearance="outline"
  customColors={{
    bg: "#8b5cf6",
    fg: "#8b5cf6",
    border: "#8b5cf6",
    ring: "rgba(139,92,246,.35)"
  }}
>
  Violet Outline
</SgButton>`} />
      </Section>
    </div>
  );
}
