"use client";

import * as React from "react";
import { SgButton, SgRoller3DDigit, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../../CodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const ALPHA = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

const BASIC_CODE = `const [digit, setDigit] = React.useState("0");

const next = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prev = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));

<div className="flex items-center gap-4">
  <SgRoller3DDigit value={digit} fontSize={32} />
  <div className="flex flex-col gap-2">
    <SgButton onClick={next} size="sm">Proximo (+1)</SgButton>
    <SgButton onClick={prev} size="sm" severity="secondary">Anterior (-1)</SgButton>
  </div>
</div>`;

const PADDED_CODE = `const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const [value, setValue] = React.useState("00");

const next = () =>
  setValue((prev) => String((Number(prev) + 1) % 60).padStart(2, "0"));

<div className="flex items-center gap-4">
  <SgRoller3DDigit value={value} items={MINUTES} fontSize={22} />
  <SgButton onClick={next} size="sm">+1 minuto</SgButton>
</div>`;

const ALPHA_CODE = `const ALPHA = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const [letter, setLetter] = React.useState("A");

const next = () => {
  const i = ALPHA.indexOf(letter);
  setLetter(ALPHA[(i + 1) % ALPHA.length]);
};

<div className="flex items-center gap-4">
  <SgRoller3DDigit value={letter} items={ALPHA} fontSize={32} />
  <SgButton onClick={next} size="sm">Proxima letra</SgButton>
</div>`;

const NAME_CODE = `const ALPHA = Array.from(" ABCDEFGHIJKLMNOPQRSTUVWXYZ");

function animateName(from: string, to: string, step: number) {
  const maxLen = Math.max(from.length, to.length);
  const padded = (s: string) => s.toUpperCase().padEnd(maxLen, " ");
  const a = padded(from);
  const b = padded(to);
  return Array.from({ length: maxLen }, (_, i) => {
    const progress = Math.min(1, step / maxLen);
    return i <= step ? b[i] : a[i];
  });
}

const NAMES = ["LUCIANO", "MARTA"];
const [nameIdx, setNameIdx] = React.useState(0);
const [step, setStep] = React.useState(7);
const currentChars = animateName(NAMES[nameIdx], NAMES[(nameIdx + 1) % NAMES.length], step);

const animate = () => {
  const next = (nameIdx + 1) % NAMES.length;
  setStep(0);
  setNameIdx(next);
  // step through characters one by one
  let s = 0;
  const id = window.setInterval(() => {
    s++;
    setStep(s);
    if (s >= NAMES[next].length) window.clearInterval(id);
  }, 120);
};

<div className="space-y-4">
  <div className="flex items-center gap-2">
    {currentChars.map((ch, i) => (
      <SgRoller3DDigit key={i} value={ch} items={ALPHA} fontSize={28} />
    ))}
  </div>
  <SgButton onClick={animate}>Animar nome</SgButton>
</div>`;

const SIZE_CODE = `<div className="flex items-end gap-4">
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Pequeno</p>
    <SgRoller3DDigit value="5" fontSize={16} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Medio</p>
    <SgRoller3DDigit value="5" fontSize={32} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Grande</p>
    <SgRoller3DDigit value="5" fontSize={56} />
  </div>
</div>`;

const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgRoller3DDigit } from "@seedgrid/fe-components";

const ALPHA = Array.from(" ABCDEFGHIJKLMNOPQRSTUVWXYZ");

function animateName(from, to, step) {
  const maxLen = Math.max(from.length, to.length);
  const pad = (s) => s.toUpperCase().padEnd(maxLen, " ");
  const a = pad(from);
  const b = pad(to);
  return Array.from({ length: maxLen }, (_, i) => (i <= step ? b[i] : a[i]));
}

const NAMES = ["LUCIANO", "MARTA", "SEEDGRID"];

export default function App() {
  const [nameIdx, setNameIdx] = React.useState(0);
  const [step, setStep] = React.useState(10);
  const name = NAMES[nameIdx];
  const chars = animateName(NAMES[(nameIdx - 1 + NAMES.length) % NAMES.length] ?? name, name, step);

  const animate = () => {
    const next = (nameIdx + 1) % NAMES.length;
    setStep(0);
    setNameIdx(next);
    let s = 0;
    const id = window.setInterval(() => {
      s++;
      setStep(s);
      if (s >= NAMES[next].length) window.clearInterval(id);
    }, 110);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {chars.map((ch, i) => (
          <SgRoller3DDigit key={i} value={ch} items={ALPHA} fontSize={32} />
        ))}
      </div>
      <SgButton onClick={animate}>Proximo nome</SgButton>
    </div>
  );
}`;

const PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Valor atual exibido. Deve estar presente em items." },
  { prop: "items", type: "string[]", defaultValue: '["0"..."9"]', description: "Lista ordenada de todos os valores possíveis. O tambor rola ate a posicao de value." },
  { prop: "fontSize", type: "number", defaultValue: "32", description: "Tamanho da fonte em pixels. Controla a escala geral do componente." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS adicionais no container externo." },
];

function NameAnimator() {
  const NAMES_LIST = ["LUCIANO", "MARTA"];
  const [nameIdx, setNameIdx] = React.useState(0);
  const [step, setStep] = React.useState(7);

  const currentName = NAMES_LIST[nameIdx];
  const prevName = NAMES_LIST[(nameIdx - 1 + NAMES_LIST.length) % NAMES_LIST.length];
  const maxLen = Math.max(currentName.length, prevName.length);
  const padA = prevName.toUpperCase().padEnd(maxLen, " ");
  const padB = currentName.toUpperCase().padEnd(maxLen, " ");
  const chars = Array.from({ length: maxLen }, (_, i) => (i <= step ? padB[i] : padA[i]));

  const animate = React.useCallback(() => {
    const next = (nameIdx + 1) % NAMES_LIST.length;
    setStep(0);
    setNameIdx(next);
    let s = 0;
    const id = window.setInterval(() => {
      s++;
      setStep(s);
      if (s >= NAMES_LIST[next].length) window.clearInterval(id);
    }, 120);
    return () => window.clearInterval(id);
  }, [nameIdx]);

  const ALPHA_WITH_SPACE = [" ", ...ALPHA];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {chars.map((ch, i) => (
          <SgRoller3DDigit key={i} value={ch} items={ALPHA_WITH_SPACE} fontSize={28} />
        ))}
      </div>
      <SgButton onClick={animate} size="sm">Animar nome</SgButton>
    </div>
  );
}

export default function SgRoller3DDigitShowcase() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  const [digit, setDigit] = React.useState("0");
  const [minuteVal, setMinuteVal] = React.useState("00");
  const [letter, setLetter] = React.useState("A");

  const nextDigit = React.useCallback(() => setDigit((p) => String((Number(p) + 1) % 10)), []);
  const prevDigit = React.useCallback(() => setDigit((p) => String((Number(p) - 1 + 10) % 10)), []);
  const nextMinute = React.useCallback(() => setMinuteVal((p) => String((Number(p) + 1) % 60).padStart(2, "0")), []);
  const nextLetter = React.useCallback(() => {
    const i = ALPHA.indexOf(letter);
    setLetter(ALPHA[(i + 1) % ALPHA.length]);
  }, [letter]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgRoller3DDigit"
          subtitle="Tambor vertical animado — exibe qualquer valor de uma lista com transicao suave via CSS."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title="Basico (0-9)" description="Rola entre digitos simples.">
          <div className="flex items-center gap-4">
            <SgRoller3DDigit value={digit} fontSize={32} />
            <div className="flex flex-col gap-2">
              <SgButton onClick={nextDigit} size="sm">Proximo (+1)</SgButton>
              <SgButton onClick={prevDigit} size="sm" severity="secondary">Anterior (-1)</SgButton>
            </div>
          </div>
          <CodeBlockBase code={BASIC_CODE} />
        </Section>

        <Section title="Valor padded de 2 digitos" description="Items customizados: 00 a 59 (minutos/segundos).">
          <div className="flex items-center gap-4">
            <SgRoller3DDigit value={minuteVal} items={MINUTES} fontSize={22} />
            <SgButton onClick={nextMinute} size="sm">+1 minuto</SgButton>
          </div>
          <CodeBlockBase code={PADDED_CODE} />
        </Section>

        <Section title="Letras (A-Z)" description="Qualquer conjunto de caracteres pode ser usado.">
          <div className="flex items-center gap-4">
            <SgRoller3DDigit value={letter} items={ALPHA} fontSize={32} />
            <SgButton onClick={nextLetter} size="sm">Proxima letra</SgButton>
          </div>
          <CodeBlockBase code={ALPHA_CODE} />
        </Section>

        <Section
          title="Animacao de nomes"
          description='Composicao de varios SgRoller3DDigit para animar texto — exemplo: "LUCIANO" → "MARTA".'
        >
          <NameAnimator />
          <CodeBlockBase code={NAME_CODE} />
        </Section>

        <Section title="Variacoes de tamanho" description="Ajuste de escala via prop fontSize.">
          <div className="flex items-end gap-4">
            {([16, 32, 56] as const).map((fs) => (
              <div key={fs} className="text-center">
                <p className="mb-2 text-xs text-muted-foreground">{fs}px</p>
                <SgRoller3DDigit value="5" fontSize={fs} />
              </div>
            ))}
          </div>
          <CodeBlockBase code={SIZE_CODE} />
        </Section>

        <Section title="Playground" description="Animacao de nomes interativa.">
          <SgPlayground
            title="SgRoller3DDigit Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={360}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
