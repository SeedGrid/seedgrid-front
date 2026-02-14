"use client";

import React from "react";
import { Check, X, Bookmark, Search, Users, Bell, Heart } from "lucide-react";
import { SgButton } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";

import { loadSample } from "./samples/loadSample";

const SEVERITIES = ["primary", "secondary", "success", "info", "warning", "help", "danger"] as const;

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
  return <SgCodeBlockBase code={props.code.trim()} />;
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
          Botao com suporte a severity, appearance, shape, elevation, icons e loading.
        </p>
      </div>

      {/* â”€â”€ Basic â”€â”€ */}
      <Section title="Basic" description="Botao padrao com onClick e estado disabled.">
        <Row>
          <SgButton onClick={submit.run} loading={submit.loading}>
            Submit
          </SgButton>
          <SgButton disabled>Disabled</SgButton>
        </Row>
        <CodeBlock code={loadSample("sg-button-example-01.src")} />
      </Section>

      {/* â”€â”€ Icons â”€â”€ */}
      <Section title="Icons" description="Exemplos completos com icones para validar appearance/shape/elevation.">
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Elevated Buttons</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`raised-${s}`} severity={s} appearance="solid" elevation="sm" leftIcon={<Check className="size-4" />}>
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
            <div className="mb-2 text-sm font-medium text-muted-foreground">Outlined + Elevation</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`raised-text-${s}`} severity={s} appearance="outline" elevation="sm" leftIcon={<Check className="size-4" />}>
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

        <CodeBlock code={loadSample("sg-button-example-02.src")} />
      </Section>
      <Section title="Severities" description='severity="primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s}>{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={loadSample("sg-button-example-03.src")} />
      </Section>

      {/* â”€â”€ Raised Buttons â”€â”€ */}
      <Section title="Elevated Buttons" description='appearance="solid" + elevation="sm".'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="solid" elevation="sm">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={loadSample("sg-button-example-04.src")} />
      </Section>

      {/* â”€â”€ Rounded Buttons â”€â”€ */}
      <Section title="Rounded Buttons" description='shape="rounded" para formato pill.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} shape="rounded">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={loadSample("sg-button-example-05.src")} />
      </Section>

      {/* â”€â”€ Flat Buttons (ghost) â”€â”€ */}
      <Section title="Ghost Buttons (Flat)" description='appearance="ghost" - sem fundo, apenas texto colorido.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="ghost">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={loadSample("sg-button-example-06.src")} />
      </Section>

      {/* â”€â”€ Raised Text Buttons â”€â”€ */}
      <Section title="Outlined + Elevation" description='appearance="outline" + elevation="sm".'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="outline" elevation="sm">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={loadSample("sg-button-example-07.src")} />
      </Section>

      {/* â”€â”€ Outlined Buttons â”€â”€ */}
      <Section title="Outlined Buttons" description='appearance="outline" - apenas bordas coloridas.'>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="outline">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock code={loadSample("sg-button-example-08.src")} />
      </Section>

      {/* â”€â”€ Rounded Icon Buttons (solid) â”€â”€ */}
      <Section title="Rounded Icon Buttons" description='shape="rounded" + icon only - botoes circulares.'>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock code={loadSample("sg-button-example-09.src")} />
      </Section>

      {/* â”€â”€ Rounded Text Icon Buttons (ghost) â”€â”€ */}
      <Section title="Rounded Text Icon Buttons" description='shape="rounded" + icon only + appearance="ghost"'>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" appearance="ghost" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock code={loadSample("sg-button-example-10.src")} />
      </Section>

      {/* â”€â”€ Rounded and Outlined Icon Buttons â”€â”€ */}
      <Section title="Rounded and Outlined Icon Buttons" description='shape="rounded" + icon only + appearance="outline"'>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" appearance="outline" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock code={loadSample("sg-button-example-11.src")} />
      </Section>

      {/* â”€â”€ Sizes â”€â”€ */}
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
        <CodeBlock code={loadSample("sg-button-example-12.src")} />
      </Section>

      {/* â”€â”€ Loading â”€â”€ */}
      <Section title="Loading" description="loading=true exibe spinner e desabilita o botao.">
        <Row>
          <SgButton loading>Processing...</SgButton>
          <SgButton severity="success" loading>Saving...</SgButton>
          <SgButton severity="danger" loading leftIcon={<X className="size-4" />}>Deleting...</SgButton>
          <SgButton shape="rounded" loading leftIcon={<Check className="size-4" />} />
        </Row>
        <CodeBlock code={loadSample("sg-button-example-13.src")} />
      </Section>

      {/* â”€â”€ Custom Colors â”€â”€ */}
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
        <CodeBlock code={loadSample("sg-button-example-14.src")} />
      </Section>
    </div>
  );
}


