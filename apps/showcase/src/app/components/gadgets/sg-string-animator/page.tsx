"use client";

import * as React from "react";
import {
  SgStringAnimator,
  type SgStringAnimatorRef,
  SgButton,
  SgPlayground,
  SgGrid,
} from "@seedgrid/fe-components";
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
      <h2 data-anchor-title="true" className="text-lg font-semibold">
        {props.title}
      </h2>
      {props.description ? (
        <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
      ) : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Example 1 — Nomes (Roller 3D, left-aligned, manual trigger)
// ---------------------------------------------------------------------------
const EX1_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    style="roller3d"
    alignTo="left"
    fontSize={28}
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex1() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        style="roller3d"
        alignTo="left"
        fontSize={28}
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 2 — Numeros (Roller 3D, right-aligned, manual trigger)
// ---------------------------------------------------------------------------
const EX2_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="42"
    targetString="1337"
    style="roller3d"
    alignTo="right"
    fontSize={28}
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex2() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="42"
        targetString="1337"
        style="roller3d"
        alignTo="right"
        fontSize={28}
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 3 — Estilo Flip
// ---------------------------------------------------------------------------
const EX3_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    style="flip"
    alignTo="left"
    fontSize={28}
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex3() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        style="flip"
        alignTo="left"
        fontSize={28}
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 4 — Estilo Neon
// ---------------------------------------------------------------------------
const EX4_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    style="neon"
    alignTo="left"
    fontSize={28}
    color="#e4fbff"
    backgroundColor="#090f22"
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex4() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        style="neon"
        alignTo="left"
        fontSize={28}
        color="#e4fbff"
        backgroundColor="#090f22"
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 5 — Estilo Fade
// ---------------------------------------------------------------------------
const EX5_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    style="fade"
    alignTo="left"
    fontSize={28}
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex5() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        style="fade"
        alignTo="left"
        fontSize={28}
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 6 — Estilo Discard
// ---------------------------------------------------------------------------
const EX6_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    style="discard"
    alignTo="left"
    fontSize={28}
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex6() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        style="discard"
        alignTo="left"
        fontSize={28}
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 7 — Estilo Matrix
// ---------------------------------------------------------------------------
const EX7_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    style="matrix"
    alignTo="left"
    color="#22d3ee"
    backgroundColor="#0b1220"
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex7() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        style="matrix"
        alignTo="left"
        color="#22d3ee"
        backgroundColor="#0b1220"
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 8 — autoStart: troca automatica ao mudar targetString
// ---------------------------------------------------------------------------
const EX8_CODE = `const NAMES = ["LUCIANO", "MARTA", "PEDRO", "ANA", "SEEDGRID"];
const [idx, setIdx] = React.useState(0);
const [target, setTarget] = React.useState(NAMES[0] ?? "");

const next = () => {
  const nextIdx = (idx + 1) % NAMES.length;
  const nextName = NAMES[nextIdx] ?? NAMES[0] ?? "";
  setIdx(nextIdx);
  setTarget(nextName);
};

<div className="flex flex-col gap-4">
  <SgStringAnimator
    sourceString={NAMES[(idx - 1 + NAMES.length) % NAMES.length] ?? target}
    targetString={target}
    style="roller3d"
    alignTo="left"
    fontSize={28}
    autoStart
    velocity={60}
  />
  <SgButton size="sm" onClick={next}>
    Proximo nome
  </SgButton>
</div>`;

const EX8_NAMES = ["LUCIANO", "MARTA", "PEDRO", "ANA", "SEEDGRID"];

function Ex8() {
  const [idx, setIdx] = React.useState(0);
  const [target, setTarget] = React.useState(EX8_NAMES[0] ?? "");

  const next = () => {
    const nextIdx = (idx + 1) % EX8_NAMES.length;
    const nextName = EX8_NAMES[nextIdx] ?? EX8_NAMES[0] ?? "";
    setIdx(nextIdx);
    setTarget(nextName);
  };

  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        sourceString={EX8_NAMES[(idx - 1 + EX8_NAMES.length) % EX8_NAMES.length] ?? target}
        targetString={target}
        style="roller3d"
        alignTo="left"
        fontSize={28}
        autoStart
        velocity={60}
      />
      <SgButton size="sm" onClick={next}>
        Proximo nome
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 9 — Velocidades
// ---------------------------------------------------------------------------
const EX9_CODE = `{[
  { label: "Lento (velocity=10)",  velocity: 10 },
  { label: "Medio (velocity=50)",  velocity: 50 },
  { label: "Rapido (velocity=90)", velocity: 90 },
].map(({ label, velocity }) => {
  const r = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div key={label} className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <SgStringAnimator
        ref={r}
        sourceString="ORIGEM"
        targetString="DESTINO"
        style="roller3d"
        alignTo="left"
        fontSize={22}
        velocity={velocity}
      />
      <SgButton size="sm" onClick={() => r.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
})}`;

const VELOCITY_CASES = [
  { label: "Lento (velocity=10)", velocity: 10 },
  { label: "Medio (velocity=50)", velocity: 50 },
  { label: "Rapido (velocity=90)", velocity: 90 },
] as const;

function Ex9() {
  const refs = [
    React.useRef<SgStringAnimatorRef>(null),
    React.useRef<SgStringAnimatorRef>(null),
    React.useRef<SgStringAnimatorRef>(null),
  ] as const;

  return (
    <SgGrid columns={{ base: 1, md: 3 }} gap={24}>
      {VELOCITY_CASES.map(({ label, velocity }, i) => {
        const ref = refs[i] ?? refs[0];
        return (
          <div key={label} className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">{label}</span>
            <SgStringAnimator
              ref={ref}
              sourceString="ORIGEM"
              targetString="DESTINO"
              style="roller3d"
              alignTo="left"
              fontSize={22}
              velocity={velocity}
            />
            <SgButton size="sm" onClick={() => ref.current?.startAnimation()}>
              Animar
            </SgButton>
          </div>
        );
      })}
    </SgGrid>
  );
}

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------
const PLAYGROUND_CODE = `import * as React from "react";
import {
  SgStringAnimator,
  type SgStringAnimatorRef,
  SgButton,
  SgGrid,
  SgInputText,
  SgSlider,
  SgToggleSwitch,
} from "@seedgrid/fe-components";

export default function App() {
  const animRef = React.useRef(null);
  const [source, setSource] = React.useState("LUCIANO");
  const [target, setTarget] = React.useState("MARTA");
  const [style, setStyle] = React.useState("roller3d");
  const [alignTo, setAlignTo] = React.useState("left");
  const [velocity, setVelocity] = React.useState(50);
  const [fontSize, setFontSize] = React.useState(28);
  const [emptyChar, setEmptyChar] = React.useState(" ");
  const [autoStart, setAutoStart] = React.useState(false);
  const [color, setColor] = React.useState("");
  const [backgroundColor, setBackgroundColor] = React.useState("");

  return (
    <div className="space-y-6 p-4">
      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <SgInputText
          id="pg-source"
          label="sourceString"
          value={source}
          onChange={(v) => setSource(v.toUpperCase())}
        />
        <SgInputText
          id="pg-target"
          label="targetString"
          value={target}
          onChange={(v) => setTarget(v.toUpperCase())}
        />
      </SgGrid>

      <SgGrid columns={{ base: 2, md: 4 }} gap={12}>
        <label className="text-xs font-medium">
          style
          <select
            className="mt-1 block w-full rounded border border-border bg-background px-2 py-1 text-xs"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value="roller3d">roller3d</option>
            <option value="flip">flip</option>
            <option value="neon">neon</option>
            <option value="fade">fade</option>
            <option value="discard">discard</option>
            <option value="matrix">matrix</option>
          </select>
        </label>

        <label className="text-xs font-medium">
          alignTo
          <select
            className="mt-1 block w-full rounded border border-border bg-background px-2 py-1 text-xs"
            value={alignTo}
            onChange={(e) => setAlignTo(e.target.value)}
          >
            <option value="left">left</option>
            <option value="right">right</option>
          </select>
        </label>

        <label className="text-xs font-medium">
          emptyChar
          <input
            className="mt-1 block w-full rounded border border-border bg-background px-2 py-1 text-xs"
            value={emptyChar}
            maxLength={1}
            onChange={(e) => setEmptyChar(e.target.value || " ")}
          />
        </label>

        <SgToggleSwitch
          id="pg-autostart"
          label="autoStart"
          checked={autoStart}
          onChange={setAutoStart}
        />
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <SgInputText
          id="pg-color"
          label="color (neon/fade/discard/matrix)"
          value={color}
          onChange={setColor}
          placeholder="ex: #e4fbff"
        />
        <SgInputText
          id="pg-bg"
          label="backgroundColor (neon/fade/discard/matrix)"
          value={backgroundColor}
          onChange={setBackgroundColor}
          placeholder="ex: #090f22"
        />
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <label className="text-xs font-medium">
          velocity ({velocity})
          <input
            className="mt-1 block w-full"
            type="range"
            min={1}
            max={100}
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
          />
        </label>
        <label className="text-xs font-medium">
          fontSize ({fontSize}px)
          <input
            className="mt-1 block w-full"
            type="range"
            min={14}
            max={60}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>
      </SgGrid>

      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
        <SgStringAnimator
          ref={animRef}
          sourceString={source}
          targetString={target}
          style={style}
          alignTo={alignTo}
          velocity={velocity}
          fontSize={fontSize}
          emptyChar={emptyChar}
          autoStart={autoStart}
          {...(color ? { color } : {})}
          {...(backgroundColor ? { backgroundColor } : {})}
        />
        <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
          startAnimation()
        </SgButton>
      </div>
    </div>
  );
}`;

// ---------------------------------------------------------------------------
// Props reference
// ---------------------------------------------------------------------------
const PROPS: ShowcasePropRow[] = [
  {
    prop: "sourceString",
    type: "string",
    defaultValue: "-",
    description: "String exibida antes da animacao. Ao mudar, o display reseta para ela.",
  },
  {
    prop: "targetString",
    type: "string",
    defaultValue: "-",
    description: "String de destino. A animacao transiciona cada caractere ate o alvo.",
  },
  {
    prop: "style",
    type: '"roller3d" | "flip" | "neon" | "fade" | "discard" | "matrix"',
    defaultValue: '"roller3d"',
    description:
      'Estilo de animacao por caractere: tambor vertical, flip card, neon, fade, discard (folha voadora) ou matrix LED.',
  },
  {
    prop: "velocity",
    type: "number",
    defaultValue: "50",
    description: "Velocidade de 1 (lento) a 100 (rapido). Controla o delay entre cada caractere.",
  },
  {
    prop: "emptyChar",
    type: "string",
    defaultValue: '" "',
    description:
      "Caractere para preencher posicoes extras quando as strings tem comprimentos diferentes.",
  },
  {
    prop: "alignTo",
    type: '"left" | "right"',
    defaultValue: '"left"',
    description:
      '"left" preenche a direita (nomes), "right" preenche a esquerda (numeros). Determina tambem a ordem de animacao dos caracteres.',
  },
  {
    prop: "autoStart",
    type: "boolean",
    defaultValue: "false",
    description:
      "Se true, inicia animacao automaticamente ao montar e sempre que targetString mudar.",
  },
  {
    prop: "fontSize",
    type: "number",
    defaultValue: "32",
    description: "Tamanho da fonte em pixels. Controla a escala de cada digito.",
  },
  {
    prop: "color",
    type: "string",
    defaultValue: "-",
    description:
      "Cor principal do texto/ponto. Aplicada nos estilos neon, fade, discard e matrix.",
  },
  {
    prop: "backgroundColor",
    type: "string",
    defaultValue: "-",
    description: "Cor de fundo de cada digito. Aplicada nos estilos neon, fade, discard e matrix.",
  },
  {
    prop: "charset",
    type: "string[]",
    defaultValue: "DEFAULT_CHARSET",
    description:
      'Conjunto de caracteres validos para o SgRoller3DDigit. Ignorado quando style != "roller3d".',
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "-",
    description: "Classes CSS adicionais no container externo.",
  },
  {
    prop: "ref",
    type: "SgStringAnimatorRef",
    defaultValue: "-",
    description: "Ref imperativa. Expoe o metodo startAnimation() para acionar a animacao manualmente.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SgStringAnimatorShowcase() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={
          { ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties
        }
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgStringAnimator"
          subtitle="Anima caracter a caracter de uma string para outra. Suporta seis estilos: roller3d, flip, neon, fade, discard e matrix. Configuravel em velocidade, alinhamento e cores."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        {/* 1 */}
        <Section
          title="Roller 3D — nomes (left-aligned)"
          description='Anima "LUCIANO" ate "MARTA". Posicoes extras preenchidas com espaco a direita (alignTo="left").'
        >
          <Ex1 />
          <CodeBlockBase code={EX1_CODE} />
        </Section>

        {/* 2 */}
        <Section
          title="Roller 3D — numeros (right-aligned)"
          description='Anima "42" ate "1337". Espacos sao inseridos a esquerda (alignTo="right") e os digitos animam da direita para a esquerda.'
        >
          <Ex2 />
          <CodeBlockBase code={EX2_CODE} />
        </Section>

        {/* 3 */}
        <Section
          title="Estilo Flip"
          description="Animacao de nomes usando SgFlipDigit (flip card)."
        >
          <Ex3 />
          <CodeBlockBase code={EX3_CODE} />
        </Section>

        {/* 4 */}
        <Section
          title="Estilo Neon"
          description="Cada caractere usa SgNeonDigit com efeito de brilho neon. Use color e backgroundColor para personalizar."
        >
          <Ex4 />
          <CodeBlockBase code={EX4_CODE} />
        </Section>

        {/* 5 */}
        <Section
          title="Estilo Fade"
          description="Cada caractere usa SgFadeDigit: apaga o digito atual e acende o novo (efeito bulbo/display)."
        >
          <Ex5 />
          <CodeBlockBase code={EX5_CODE} />
        </Section>

        {/* 6 */}
        <Section
          title="Estilo Discard"
          description="Cada caractere usa SgDiscardDigit: a folha com o valor antigo e descartada voando para fora."
        >
          <Ex6 />
          <CodeBlockBase code={EX6_CODE} />
        </Section>

        {/* 7 */}
        <Section
          title="Estilo Matrix"
          description="Cada caractere usa SgMatrixDigit: renderizado em pontos de LED 5x7. Ideal para placares e paineis digitais."
        >
          <Ex7 />
          <CodeBlockBase code={EX7_CODE} />
        </Section>

        {/* 8 */}
        <Section
          title="autoStart — animacao automatica"
          description="Com autoStart=true, a animacao e iniciada automaticamente sempre que targetString mudar. Funciona com todos os estilos."
        >
          <Ex8 />
          <CodeBlockBase code={EX8_CODE} />
        </Section>

        {/* 9 */}
        <Section
          title="Velocidades"
          description="Comparacao de velocity=10, 50 e 90 na mesma animacao."
        >
          <Ex9 />
          <CodeBlockBase code={EX9_CODE} />
        </Section>

        {/* Playground */}
        <Section
          title="Playground"
          description="Configure todas as props em tempo real, incluindo os novos estilos e cores."
        >
          <SgPlayground
            title="SgStringAnimator Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={760}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} />
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{ height: `calc(${anchorOffset}px + 40vh)` }}
        />
      </div>
    </I18NReady>
  );
}
