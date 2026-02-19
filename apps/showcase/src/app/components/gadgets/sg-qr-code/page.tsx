"use client";

import * as React from "react";
import { SgButton, SgQRCode } from "@seedgrid/fe-components";
import CodeBlockBase from "../../CodeBlockBase";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

export default function SgQRCodePage() {
  const [value, setValue] = React.useState("https://seedgrid.com.br");
  const [logoSrc, setLogoSrc] = React.useState("/logo-seedgrid.svg");
  const [size, setSize] = React.useState(220);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgQRCode</h1>
        <p className="mt-2 text-muted-foreground">
          Gera QR Code a partir de um valor e permite configurar um logo no centro.
        </p>
      </div>

      <Section
        title="Playground"
        description="Troque o valor do QR Code, o logo central e o tamanho."
      >
        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <label className="block space-y-1">
              <span className="text-sm font-medium">Valor do QR Code</span>
              <textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Digite texto, URL ou payload PIX"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium">Logo central (URL)</span>
              <input
                type="text"
                value={logoSrc}
                onChange={(event) => setLogoSrc(event.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="https://exemplo.com/logo.png"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium">Tamanho: {size}px</span>
              <input
                type="range"
                min={140}
                max={360}
                step={4}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="w-full"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <SgButton onClick={() => setValue("https://seedgrid.com.br")}>
                URL
              </SgButton>
              <SgButton
                severity="secondary"
                onClick={() => setValue("00020126580014BR.GOV.BCB.PIX0136contato@seedgrid.com.br5204000053039865802BR5922SEEDGRID TECNOLOGIA6009SAO PAULO62140510SEEDGRID1236304ABCD")}
              >
                Exemplo PIX
              </SgButton>
              <SgButton severity="warning" onClick={() => setLogoSrc("")}>
                Sem logo
              </SgButton>
            </div>
          </div>

          <div className="inline-flex h-fit rounded-xl border border-border bg-white p-4 shadow-sm">
            <SgQRCode
              value={value}
              size={size}
              logoSrc={logoSrc || undefined}
              logoAlt="Logo SeedGrid"
              emptyFallback={<span className="text-sm text-muted-foreground">Informe um valor</span>}
            />
          </div>
        </div>

        <div className="mt-6">
          <CodeBlockBase
            code={`import { SgQRCode } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <SgQRCode
      value="https://seedgrid.com.br"
      size={220}
      logoSrc="/logo-seedgrid.svg"
      logoAlt="SeedGrid"
    />
  );
}`}
          />
        </div>
      </Section>
    </div>
  );
}
