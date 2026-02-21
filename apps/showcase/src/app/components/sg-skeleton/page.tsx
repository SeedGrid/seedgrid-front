"use client";

import * as React from "react";
import { SgPlayground, SgSkeleton } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

const SHAPES_CODE = `import * as React from "react";
import { SgSkeleton } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <SgSkeleton shape="text" />
      <SgSkeleton shape="rectangle" height={48} />
      <SgSkeleton shape="rounded" height={48} />
      <SgSkeleton shape="square" size={56} />
      <SgSkeleton shape="circle" size={56} />
    </div>
  );
}`;

const WIDTHS_CODE = `import * as React from "react";
import { SgSkeleton } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="max-w-md space-y-2">
      <SgSkeleton shape="text" width="100%" />
      <SgSkeleton shape="text" width="86%" />
      <SgSkeleton shape="text" width="72%" />
      <SgSkeleton shape="text" width="52%" />
    </div>
  );
}`;

const ANIMATION_CODE = `import * as React from "react";
import { SgSkeleton } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">wave</p>
        <SgSkeleton animation="wave" height={56} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">pulse</p>
        <SgSkeleton animation="pulse" height={56} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">none</p>
        <SgSkeleton animation="none" height={56} />
      </div>
    </div>
  );
}`;

const CARD_CODE = `import * as React from "react";
import { SgSkeleton } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border p-4">
      <SgSkeleton shape="rounded" height={160} />
      <div className="mt-4 space-y-2">
        <SgSkeleton shape="text" width="60%" />
        <SgSkeleton shape="text" />
        <SgSkeleton shape="text" width="82%" />
      </div>
    </div>
  );
}`;

const LIST_TABLE_CODE = `import * as React from "react";
import { SgSkeleton } from "@seedgrid/fe-components";

export default function Example() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <SgSkeleton shape="circle" size={40} />
            <div className="flex-1 space-y-2">
              <SgSkeleton shape="text" width="55%" />
              <SgSkeleton shape="text" width="35%" />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-[1fr_120px_120px] gap-3 border-b border-border p-3">
          <SgSkeleton shape="text" width="80%" />
          <SgSkeleton shape="text" width="70%" />
          <SgSkeleton shape="text" width="70%" />
        </div>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_120px_120px] gap-3 border-b border-border p-3 last:border-b-0">
            <SgSkeleton shape="text" width={(60 + ((idx % 3) * 10)) + "%"} />
            <SgSkeleton shape="text" width="55%" />
            <SgSkeleton shape="text" width="45%" />
          </div>
        ))}
      </div>
    </div>
  );
}`;

const SKELETON_PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";

const SgSkeletonFromLib = (SeedGrid as Record<string, unknown>).SgSkeleton as
  | React.ComponentType<any>
  | undefined;

function LocalSkeleton(props: {
  width?: string;
  height?: string;
  radius?: string;
  animation?: "wave" | "pulse" | "none";
}) {
  const pulse = props.animation === "pulse" ? " animate-pulse" : "";
  return (
    <div
      className={"block bg-slate-200" + pulse}
      style={{
        width: props.width,
        height: props.height,
        borderRadius: props.radius
      }}
    />
  );
}

export default function App() {
  const hasSkeleton = typeof SgSkeletonFromLib === "function";
  const [shape, setShape] = React.useState<"text" | "rectangle" | "rounded" | "square" | "circle">("text");
  const [animation, setAnimation] = React.useState<"wave" | "pulse" | "none">("wave");
  const [width, setWidth] = React.useState("100%");
  const [height, setHeight] = React.useState("16");
  const [size, setSize] = React.useState("56");
  const [customRadius, setCustomRadius] = React.useState("");

  const useSize = shape === "square" || shape === "circle";
  const hPx = Number(height) || 16;
  const sPx = Number(size) || 56;
  const radius =
    customRadius.trim() ||
    (shape === "circle" ? "9999px" : shape === "square" ? "0px" : shape === "rounded" ? "12px" : shape === "text" ? "9999px" : "6px");

  return (
    <div className="space-y-4 p-2">
      {!hasSkeleton ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgSkeleton ainda nao esta na versao publicada usada pelo Sandpack. Exibindo fallback.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs">
          <span className="mb-1 block font-medium">Shape</span>
          <select value={shape} onChange={(e) => setShape(e.target.value as any)} className="w-full rounded border border-slate-300 px-2 py-1">
            <option value="text">text</option>
            <option value="rectangle">rectangle</option>
            <option value="rounded">rounded</option>
            <option value="square">square</option>
            <option value="circle">circle</option>
          </select>
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">Animation</span>
          <select value={animation} onChange={(e) => setAnimation(e.target.value as any)} className="w-full rounded border border-slate-300 px-2 py-1">
            <option value="wave">wave</option>
            <option value="pulse">pulse</option>
            <option value="none">none</option>
          </select>
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">Width</span>
          <input value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1" />
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">Height (px)</span>
          <input value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1" />
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">Size (px)</span>
          <input value={size} onChange={(e) => setSize(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1" />
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">Border radius (opcional)</span>
          <input value={customRadius} onChange={(e) => setCustomRadius(e.target.value)} placeholder="ex: 18px" className="w-full rounded border border-slate-300 px-2 py-1" />
        </label>
      </div>

      <div className="rounded-xl border border-border p-5">
        {hasSkeleton ? (
          <SgSkeletonFromLib
            shape={shape}
            animation={animation}
            width={useSize ? undefined : width}
            height={useSize ? undefined : hPx}
            size={useSize ? sPx : undefined}
            borderRadius={radius}
          />
        ) : (
          <LocalSkeleton
            width={useSize ? sPx + "px" : width}
            height={useSize ? sPx + "px" : hPx + "px"}
            radius={radius}
            animation={animation}
          />
        )}
      </div>
    </div>
  );
}`;

const SKELETON_PROPS: ShowcasePropRow[] = [
  { prop: "shape", type: "\"text\" | \"rectangle\" | \"rounded\" | \"square\" | \"circle\"", defaultValue: "text", description: "Forma base do placeholder." },
  { prop: "animation", type: "\"wave\" | \"pulse\" | \"none\"", defaultValue: "wave", description: "Tipo de animação visual." },
  { prop: "width / height", type: "number | string", defaultValue: "100% / 1rem", description: "Dimensões principais do skeleton." },
  { prop: "size", type: "number | string", defaultValue: "-", description: "Atalho para largura e altura em shapes simétricos." },
  { prop: "borderRadius", type: "number | string", defaultValue: "auto", description: "Raio de borda customizado." }
];

export default function SgSkeletonPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgSkeleton"
          subtitle="Placeholder visual para estados de carregamento inspirado no Skeleton do PrimeFaces."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title="1) Shapes basicos"
        description='Variacoes principais: "text", "rectangle", "rounded", "square" e "circle".'
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SgSkeleton shape="text" />
          <SgSkeleton shape="rectangle" height={48} />
          <SgSkeleton shape="rounded" height={48} />
          <SgSkeleton shape="square" size={56} />
          <SgSkeleton shape="circle" size={56} />
        </div>
        <div className="mt-6">
          <CodeBlockBase code={SHAPES_CODE} />
        </div>
      </Section>

      <Section
        title="2) Larguras de texto"
        description="Use o shape text em larguras diferentes para simular linhas reais."
      >
        <div className="max-w-md space-y-2">
          <SgSkeleton shape="text" width="100%" />
          <SgSkeleton shape="text" width="86%" />
          <SgSkeleton shape="text" width="72%" />
          <SgSkeleton shape="text" width="52%" />
        </div>
        <div className="mt-6">
          <CodeBlockBase code={WIDTHS_CODE} />
        </div>
      </Section>

      <Section
        title="3) Animacao"
        description='Escolha entre "wave", "pulse" ou "none".'
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">wave</p>
            <SgSkeleton animation="wave" height={56} />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">pulse</p>
            <SgSkeleton animation="pulse" height={56} />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">none</p>
            <SgSkeleton animation="none" height={56} />
          </div>
        </div>
        <div className="mt-6">
          <CodeBlockBase code={ANIMATION_CODE} />
        </div>
      </Section>

      <Section
        title="4) Card placeholder"
        description="Exemplo de loading para card (imagem + titulo + texto)."
      >
        <div className="w-full max-w-sm rounded-xl border border-border p-4">
          <SgSkeleton shape="rounded" height={160} />
          <div className="mt-4 space-y-2">
            <SgSkeleton shape="text" width="60%" />
            <SgSkeleton shape="text" />
            <SgSkeleton shape="text" width="82%" />
          </div>
        </div>
        <div className="mt-6">
          <CodeBlockBase code={CARD_CODE} />
        </div>
      </Section>

      <Section
        title="5) Lista e tabela"
        description="Composicoes comuns para placeholders em telas de dados."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <SgSkeleton shape="circle" size={40} />
                <div className="flex-1 space-y-2">
                  <SgSkeleton shape="text" width="55%" />
                  <SgSkeleton shape="text" width="35%" />
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-[1fr_120px_120px] gap-3 border-b border-border p-3">
              <SgSkeleton shape="text" width="80%" />
              <SgSkeleton shape="text" width="70%" />
              <SgSkeleton shape="text" width="70%" />
            </div>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_120px_120px] gap-3 border-b border-border p-3 last:border-b-0">
                <SgSkeleton shape="text" width={`${60 + ((idx % 3) * 10)}%`} />
                <SgSkeleton shape="text" width="55%" />
                <SgSkeleton shape="text" width="45%" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <CodeBlockBase code={LIST_TABLE_CODE} />
        </div>
      </Section>

      <Section
        title="6) Playground (SgPlayground)"
        description="Playground para simular shape, tamanho, raio e animacao em tempo real."
      >
        <SgPlayground
          title="SgSkeleton Playground"
          interactive
          codeContract="appFile"
          code={SKELETON_PLAYGROUND_APP_FILE}
          height={640}
          defaultOpen
        />
      </Section>

        <ShowcasePropsReference rows={SKELETON_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
