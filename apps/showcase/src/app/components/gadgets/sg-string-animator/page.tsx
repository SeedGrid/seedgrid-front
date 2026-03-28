"use client";

import * as React from "react";
import { SgStringAnimator, type SgStringAnimatorRef, SgButton, SgGrid } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../../i18n";

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
// Example 1 â€” Nomes (Roller 3D, left-aligned, manual trigger)
// ---------------------------------------------------------------------------
const EX1_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="roller3d"
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
        stringAnimatorStyle="roller3d"
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
// Example 2 â€” Numeros (Roller 3D, right-aligned, manual trigger)
// ---------------------------------------------------------------------------
const EX2_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="42"
    targetString="1337"
    stringAnimatorStyle="roller3d"
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
        stringAnimatorStyle="roller3d"
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
// Example 3 â€” Estilo Flip
// ---------------------------------------------------------------------------
const EX3_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="flip"
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
        stringAnimatorStyle="flip"
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
// Example 4 â€” Estilo Neon
// ---------------------------------------------------------------------------
const EX4_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="neon"
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
        stringAnimatorStyle="neon"
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
// Example 5 â€” Estilo Fade
// ---------------------------------------------------------------------------
const EX5_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="fade"
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
        stringAnimatorStyle="fade"
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
// Example 6 â€” Estilo Discard
// ---------------------------------------------------------------------------
const EX6_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="discard"
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
        stringAnimatorStyle="discard"
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
// Example 7 â€” Estilo Matrix
// ---------------------------------------------------------------------------
const EX7_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="matrix"
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
        stringAnimatorStyle="matrix"
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
// Example 8 â€” autoStart: troca automatica ao mudar targetString
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
    stringAnimatorStyle="roller3d"
    alignTo="left"
    fontSize={28}
    autoStart
    velocity={60}
  />
  <SgButton size="sm" onClick={next}>
    Next name
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
        stringAnimatorStyle="roller3d"
        alignTo="left"
        fontSize={28}
        autoStart
        velocity={60}
      />
      <SgButton size="sm" onClick={next}>
        Next name
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 9 â€” Velocidades
// ---------------------------------------------------------------------------
const EX9_CODE = `{[
  { label: "Lento (velocity=10)",  velocity: 10 },
  { label: "Medium (velocity=50)",  velocity: 50 },
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
        stringAnimatorStyle="roller3d"
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
  { label: "Medium (velocity=50)", velocity: 50 },
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
              stringAnimatorStyle="roller3d"
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

type StringAnimatorTexts = {
  headerSubtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  section3Title: string;
  section3Description: string;
  section4Title: string;
  section4Description: string;
  section5Title: string;
  section5Description: string;
  section6Title: string;
  section6Description: string;
  section7Title: string;
  section7Description: string;
  section8Title: string;
  section8Description: string;
  section9Title: string;
  section9Description: string;
  playgroundTitle: string;
  playgroundDescription: string;
  playgroundCardTitle: string;
  propsReferenceTitle: string;
};

const STRING_ANIMATOR_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", StringAnimatorTexts> = {
  "pt-BR": {
    headerSubtitle:
      "Anima caractere por caractere de uma string para outra. Suporta seis estilos: roller3d, flip, neon, fade, discard e matrix. Configuravel em velocidade, alinhamento e cores.",
    section1Title: "Roller 3D - nomes (left-aligned)",
    section1Description:
      'Anima "LUCIANO" ate "MARTA". Posicoes extras preenchidas com espaco a direita (alignTo="left").',
    section2Title: "Roller 3D - numeros (right-aligned)",
    section2Description:
      'Anima "42" ate "1337". Espacos sao inseridos a esquerda (alignTo="right") e os digitos animam da direita para a esquerda.',
    section3Title: "Estilo Flip",
    section3Description: "Animacao de nomes usando SgFlipDigit (flip card).",
    section4Title: "Estilo Neon",
    section4Description:
      "Cada caractere usa SgNeonDigit com efeito de brilho neon. Use color e backgroundColor para personalizar.",
    section5Title: "Estilo Fade",
    section5Description:
      "Cada caractere usa SgFadeDigit: apaga o digito atual e acende o novo (efeito bulbo/display).",
    section6Title: "Estilo Discard",
    section6Description:
      "Cada caractere usa SgDiscardDigit: a folha com o valor antigo e descartada voando para fora.",
    section7Title: "Estilo Matrix",
    section7Description:
      "Cada caractere usa SgMatrixDigit: renderizado em pontos de LED 5x7. Ideal para placares e paineis digitais.",
    section8Title: "autoStart - animacao automatica",
    section8Description:
      "Com autoStart=true, a animacao e iniciada automaticamente sempre que targetString mudar. Funciona com todos os estilos.",
    section9Title: "Velocidades",
    section9Description: "Comparacao de velocity=10, 50 e 90 na mesma animacao.",
    playgroundTitle: "Playground",
    playgroundDescription: "Configure todas as props em tempo real, incluindo os novos estilos e cores.",
    playgroundCardTitle: "SgStringAnimator Playground",
    propsReferenceTitle: "Referência de Props"
  },
  "pt-PT": {
    headerSubtitle:
      "Anima caractere a caractere de uma string para outra. Suporta seis estilos: roller3d, flip, neon, fade, discard e matrix. Configuravel em velocidade, alinhamento e cores.",
    section1Title: "Roller 3D - nomes (left-aligned)",
    section1Description:
      'Anima "LUCIANO" para "MARTA". Posicoes extra preenchidas com espaco a direita (alignTo="left").',
    section2Title: "Roller 3D - numeros (right-aligned)",
    section2Description:
      'Anima "42" para "1337". Espacos sao inseridos a esquerda (alignTo="right") e os digitos animam da direita para a esquerda.',
    section3Title: "Estilo Flip",
    section3Description: "Animacao de nomes usando SgFlipDigit (flip card).",
    section4Title: "Estilo Neon",
    section4Description:
      "Cada caractere usa SgNeonDigit com efeito de brilho neon. Use color e backgroundColor para personalizar.",
    section5Title: "Estilo Fade",
    section5Description:
      "Cada caractere usa SgFadeDigit: apaga o digito atual e acende o novo (efeito de display).",
    section6Title: "Estilo Discard",
    section6Description:
      "Cada caractere usa SgDiscardDigit: a folha com o valor antigo e descartada para fora.",
    section7Title: "Estilo Matrix",
    section7Description:
      "Cada caractere usa SgMatrixDigit: renderizado em pontos de LED 5x7. Ideal para placares e paineis digitais.",
    section8Title: "autoStart - animacao automatica",
    section8Description:
      "Com autoStart=true, a animacao inicia automaticamente sempre que targetString muda. Funciona com todos os estilos.",
    section9Title: "Velocidades",
    section9Description: "Comparacao de velocity=10, 50 e 90 na mesma animacao.",
    playgroundTitle: "Playground",
    playgroundDescription: "Configure as props em tempo real, incluindo os estilos e cores.",
    playgroundCardTitle: "SgStringAnimator Playground",
    propsReferenceTitle: "Referência de Props"
  },
  "en-US": {
    headerSubtitle:
      "Animates one string into another, character by character. Supports six styles: roller3d, flip, neon, fade, discard, and matrix. Fully configurable for speed, alignment, and colors.",
    section1Title: "Roller 3D - names (left-aligned)",
    section1Description:
      'Animates "LUCIANO" into "MARTA". Extra positions are padded on the right (alignTo="left").',
    section2Title: "Roller 3D - numbers (right-aligned)",
    section2Description:
      'Animates "42" into "1337". Padding is applied on the left (alignTo="right") and digits animate from right to left.',
    section3Title: "Flip style",
    section3Description: "Name animation using SgFlipDigit (flip card).",
    section4Title: "Neon style",
    section4Description:
      "Each character uses SgNeonDigit with a neon glow effect. Use color and backgroundColor for customization.",
    section5Title: "Fade style",
    section5Description:
      "Each character uses SgFadeDigit: the current value fades out and the next one fades in.",
    section6Title: "Discard style",
    section6Description:
      "Each character uses SgDiscardDigit: the previous value is discarded with an outgoing motion.",
    section7Title: "Matrix style",
    section7Description:
      "Each character uses SgMatrixDigit with a 5x7 LED matrix rendering. Great for dashboards and digital panels.",
    section8Title: "autoStart - automatic animation",
    section8Description:
      "With autoStart=true, animation starts automatically whenever targetString changes. Works with all styles.",
    section9Title: "Speed presets",
    section9Description: "Comparison of velocity=10, 50, and 90 using the same animation.",
    playgroundTitle: "Playground",
    playgroundDescription: "Configure all props in real time, including the new styles and colors.",
    playgroundCardTitle: "SgStringAnimator Playground",
    propsReferenceTitle: "Props Reference"
  },
  es: {
    headerSubtitle:
      "Anima una cadena a otra caracter por caracter. Soporta seis estilos: roller3d, flip, neon, fade, discard y matrix. Configurable en velocidad, alineacion y colores.",
    section1Title: "Roller 3D - nombres (left-aligned)",
    section1Description:
      'Anima "LUCIANO" hasta "MARTA". Las posiciones extra se completan a la derecha (alignTo="left").',
    section2Title: "Roller 3D - numeros (right-aligned)",
    section2Description:
      'Anima "42" hasta "1337". Los espacios se insertan a la izquierda (alignTo="right") y los digitos animan de derecha a izquierda.',
    section3Title: "Estilo Flip",
    section3Description: "Animacion de nombres usando SgFlipDigit (flip card).",
    section4Title: "Estilo Neon",
    section4Description:
      "Cada caracter usa SgNeonDigit con efecto de brillo neon. Usa color y backgroundColor para personalizar.",
    section5Title: "Estilo Fade",
    section5Description:
      "Cada caracter usa SgFadeDigit: apaga el valor actual y enciende el siguiente.",
    section6Title: "Estilo Discard",
    section6Description:
      "Cada caracter usa SgDiscardDigit: la hoja con el valor anterior se descarta hacia fuera.",
    section7Title: "Estilo Matrix",
    section7Description:
      "Cada caracter usa SgMatrixDigit: renderizado en puntos LED 5x7. Ideal para paneles digitales.",
    section8Title: "autoStart - animacion automatica",
    section8Description:
      "Con autoStart=true, la animacion se inicia automaticamente cuando cambia targetString. Funciona con todos los estilos.",
    section9Title: "Velocidades",
    section9Description: "Comparacion de velocity=10, 50 y 90 en la misma animacion.",
    playgroundTitle: "Playground",
    playgroundDescription: "Configura todas las props en tiempo real, incluyendo estilos y colores.",
    playgroundCardTitle: "SgStringAnimator Playground",
    propsReferenceTitle: "Referencia de Props"
  }
};

type SupportedStringAnimatorLocale = keyof typeof STRING_ANIMATOR_TEXTS;

function isSupportedStringAnimatorLocale(locale: ShowcaseLocale): locale is SupportedStringAnimatorLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getStringAnimatorTexts(locale: ShowcaseLocale): StringAnimatorTexts {
  const normalized: SupportedStringAnimatorLocale = isSupportedStringAnimatorLocale(locale) ? locale : "en-US";
  return STRING_ANIMATOR_TEXTS[normalized];
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
  SgToggleSwitch,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const animRef = React.useRef(null);
  const [source, setSource] = React.useState("LUCIANO");
  const [target, setTarget] = React.useState("MARTA");
  const [stringAnimatorStyle, setStringAnimatorStyle] = React.useState("roller3d");
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
            value={stringAnimatorStyle}
            onChange={(e) => setStringAnimatorStyle(e.target.value)}
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
          stringAnimatorStyle={stringAnimatorStyle}
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
    prop: "stringAnimatorStyle",
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
      'Conjunto de caracteres validos para o SgRoller3DDigit. Ignorado quando stringAnimatorStyle != "roller3d".',
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
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getStringAnimatorTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

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
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        {/* 1 */}
        <Section
          title={texts.section1Title}
          description={texts.section1Description}
        >
          <Ex1 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/roller-3d-nomes-left-aligned.tsx.sample" />
        </Section>

        {/* 2 */}
        <Section
          title={texts.section2Title}
          description={texts.section2Description}
        >
          <Ex2 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/roller-3d-numeros-right-aligned.tsx.sample" />
        </Section>

        {/* 3 */}
        <Section
          title={texts.section3Title}
          description={texts.section3Description}
        >
          <Ex3 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/estilo-flip.tsx.sample" />
        </Section>

        {/* 4 */}
        <Section
          title={texts.section4Title}
          description={texts.section4Description}
        >
          <Ex4 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/estilo-neon.tsx.sample" />
        </Section>

        {/* 5 */}
        <Section
          title={texts.section5Title}
          description={texts.section5Description}
        >
          <Ex5 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/estilo-fade.tsx.sample" />
        </Section>

        {/* 6 */}
        <Section
          title={texts.section6Title}
          description={texts.section6Description}
        >
          <Ex6 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/estilo-discard.tsx.sample" />
        </Section>

        {/* 7 */}
        <Section
          title={texts.section7Title}
          description={texts.section7Description}
        >
          <Ex7 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/estilo-matrix.tsx.sample" />
        </Section>

        {/* 8 */}
        <Section
          title={texts.section8Title}
          description={texts.section8Description}
        >
          <Ex8 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/autostart-animacao-automatica.tsx.sample" />
        </Section>

        {/* 9 */}
        <Section
          title={texts.section9Title}
          description={texts.section9Description}
        >
          <Ex9 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/velocidades.tsx.sample" />
        </Section>

        {/* Playground */}
        <Section
          title={texts.playgroundTitle}
          description={texts.playgroundDescription}
        >
          <SgPlayground
            title={texts.playgroundCardTitle}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/gadgets/sg-string-animator/sg-string-animator.tsx.playground"
            height={760}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} title={texts.propsReferenceTitle} />
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{ height: `calc(${anchorOffset}px + 40vh)` }}
        />
      </div>
    </I18NReady>
  );
}


