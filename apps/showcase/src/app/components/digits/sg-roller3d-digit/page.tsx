"use client";

import * as React from "react";
import { SgButton, SgRoller3DDigit, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../../CodeBlockBase";
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
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

type RollerTexts = {
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
  propsReferenceTitle: string;
};

const ROLLER_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", RollerTexts> = {
  "pt-BR": {
    headerSubtitle: "Animated vertical drum - displays any value from a list with smooth CSS transition.",
    section1Title: "Basico (0-9)",
    section1Description: "Rola entre digitos simples.",
    section2Title: "2-digit padded value",
    section2Description: "Items customizados: 00 a 59 (minutos/segundos).",
    section3Title: "Letras (A-Z)",
    section3Description: "Qualquer conjunto de caracteres pode ser usado.",
    section4Title: "Animacao de nomes",
    section4Description:
      'Composicao de varios SgRoller3DDigit para animar texto - exemplo: "LUCIANO" -> "MARTA".',
    section5Title: "Variacoes de tamanho",
    section5Description: "Ajuste de escala via prop fontSize.",
    section6Title: "Playground",
    section6Description: "Animacao de nomes interativa.",
    propsReferenceTitle: "Referência de Props",
  },
  "pt-PT": {
    headerSubtitle: "Animated vertical drum - displays any value from a list with smooth CSS transition.",
    section1Title: "Basico (0-9)",
    section1Description: "Rola entre digitos simples.",
    section2Title: "2-digit padded value",
    section2Description: "Items customizados: 00 a 59 (minutos/segundos).",
    section3Title: "Letras (A-Z)",
    section3Description: "Qualquer conjunto de caracteres pode ser usado.",
    section4Title: "Animacao de nomes",
    section4Description:
      'Composicao de varios SgRoller3DDigit para animar texto - exemplo: "LUCIANO" -> "MARTA".',
    section5Title: "Variacoes de tamanho",
    section5Description: "Ajuste de escala via prop fontSize.",
    section6Title: "Playground",
    section6Description: "Animacao de nomes interativa.",
    propsReferenceTitle: "Referência de Props",
  },
  "en-US": {
    headerSubtitle: "Animated vertical drum - displays any value from a list with smooth CSS transition.",
    section1Title: "Basic (0-9)",
    section1Description: "Rolls through simple digits.",
    section2Title: "2-digit padded value",
    section2Description: "Custom items: 00 to 59 (minutes/seconds).",
    section3Title: "Letters (A-Z)",
    section3Description: "Any character set can be used.",
    section4Title: "Name animation",
    section4Description:
      'Composition with multiple SgRoller3DDigit to animate text - example: "LUCIANO" -> "MARTA".',
    section5Title: "Size variations",
    section5Description: "Scale adjustment via fontSize prop.",
    section6Title: "Playground",
    section6Description: "Interactive name animation.",
    propsReferenceTitle: "Props Reference",
  },
  es: {
    headerSubtitle: "Tambor vertical animado - muestra cualquier valor de una lista con transicion CSS suave.",
    section1Title: "Basico (0-9)",
    section1Description: "Rota entre digitos simples.",
    section2Title: "2-digit padded value",
    section2Description: "Custom items: 00 to 59 (minutes/seconds).",
    section3Title: "Letras (A-Z)",
    section3Description: "Se puede usar cualquier conjunto de caracteres.",
    section4Title: "Animacion de nombres",
    section4Description:
      'Composicion de varios SgRoller3DDigit para animar texto - ejemplo: "LUCIANO" -> "MARTA".',
    section5Title: "Variaciones de tamano",
    section5Description: "Ajuste de escala mediante la prop fontSize.",
    section6Title: "Playground",
    section6Description: "Animacion de nombres interactiva.",
    propsReferenceTitle: "Referencia de Props",
  },
};

type SupportedRollerLocale = keyof typeof ROLLER_TEXTS;

function isSupportedRollerLocale(locale: ShowcaseLocale): locale is SupportedRollerLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getRollerTexts(locale: ShowcaseLocale): RollerTexts {
  const normalized: SupportedRollerLocale = isSupportedRollerLocale(locale) ? locale : "en-US";
  return ROLLER_TEXTS[normalized];
}

const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const ALPHA = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

const BASIC_CODE = `const [digit, setDigit] = React.useState("0");

const next = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prev = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));

<div className="flex items-center gap-4">
  <SgRoller3DDigit value={digit} fontSize={32} />
  <div className="flex flex-col gap-2">
    <SgButton onClick={next} size="sm">Next (+1)</SgButton>
    <SgButton onClick={prev} size="sm" severity="secondary">Previous (-1)</SgButton>
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
  const nextLetter = ALPHA[(i + 1) % ALPHA.length] ?? ALPHA[0] ?? "A";
  setLetter(nextLetter);
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
  const fromName = NAMES[nameIdx] ?? "";
  const toName = NAMES[next] ?? "";
  const maxSteps = Math.max(fromName.length, toName.length);
  let s = 0;
  const id = window.setInterval(() => {
    s++;
    setStep(s);
    if (s >= maxSteps) window.clearInterval(id);
  }, 120);
};

<div className="space-y-4">
  <div className="flex items-center gap-2">
    {currentChars.map((ch, i) => (
      <SgRoller3DDigit key={i} value={ch} items={ALPHA} fontSize={28} transitionMs={110} />
    ))}
  </div>
  <SgButton onClick={animate}>Animar nome</SgButton>
</div>`;

const SIZE_CODE = `<div className="flex items-end gap-4">
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Small</p>
    <SgRoller3DDigit value="5" fontSize={16} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Medium</p>
    <SgRoller3DDigit value="5" fontSize={32} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Large</p>
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
    const fromName = NAMES[nameIdx] ?? "";
    const toName = NAMES[next] ?? "";
    const maxSteps = Math.max(fromName.length, toName.length);
    let s = 0;
    const id = window.setInterval(() => {
      s++;
      setStep(s);
      if (s >= maxSteps) window.clearInterval(id);
    }, 110);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {chars.map((ch, i) => (
          <SgRoller3DDigit key={i} value={ch} items={ALPHA} fontSize={32} transitionMs={110} />
        ))}
      </div>
      <SgButton onClick={animate}>Next name</SgButton>
    </div>
  );
}`;

const PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Current displayed value. Must exist in items." },
  { prop: "items", type: "string[]", defaultValue: '["0"..."9"]', description: "Ordered list of all possible values. The drum rolls to the value position." },
  { prop: "fontSize", type: "number", defaultValue: "32", description: "Tamanho da fonte em pixels. Controla a escala geral do componente." },
  { prop: "transitionMs", type: "number", defaultValue: "500", description: "Roll transition duration in milliseconds." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS adicionais no container externo." },
];

function NameAnimator() {
  const NAMES_LIST = ["LUCIANO", "MARTA"];
  const [nameIdx, setNameIdx] = React.useState(0);
  const [step, setStep] = React.useState(7);

  const currentName = NAMES_LIST[nameIdx] ?? NAMES_LIST[0] ?? "";
  const prevName = NAMES_LIST[(nameIdx - 1 + NAMES_LIST.length) % NAMES_LIST.length] ?? currentName;
  const maxLen = Math.max(currentName.length, prevName.length);
  const padA = prevName.toUpperCase().padEnd(maxLen, " ");
  const padB = currentName.toUpperCase().padEnd(maxLen, " ");
  const chars = Array.from({ length: maxLen }, (_, i) => (i <= step ? (padB[i] ?? " ") : (padA[i] ?? " ")));

  const animate = React.useCallback(() => {
    const next = (nameIdx + 1) % NAMES_LIST.length;
    setStep(0);
    setNameIdx(next);
    const nextName = NAMES_LIST[next] ?? currentName;
    const maxSteps = Math.max(currentName.length, nextName.length);
    let s = 0;
    const id = window.setInterval(() => {
      s++;
      setStep(s);
      if (s >= maxSteps) window.clearInterval(id);
    }, 120);
    return () => window.clearInterval(id);
  }, [currentName, nameIdx]);

  const ALPHA_WITH_SPACE = [" ", ...ALPHA];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {chars.map((ch, i) => (
          <SgRoller3DDigit key={i} value={ch} items={ALPHA_WITH_SPACE} fontSize={28} transitionMs={110} />
        ))}
      </div>
      <SgButton onClick={animate} size="sm">Animar nome</SgButton>
    </div>
  );
}

export default function SgRoller3DDigitShowcase() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getRollerTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const [digit, setDigit] = React.useState("0");
  const [minuteVal, setMinuteVal] = React.useState("00");
  const [letter, setLetter] = React.useState("A");

  const nextDigit = React.useCallback(() => setDigit((p) => String((Number(p) + 1) % 10)), []);
  const prevDigit = React.useCallback(() => setDigit((p) => String((Number(p) - 1 + 10) % 10)), []);
  const nextMinute = React.useCallback(() => setMinuteVal((p) => String((Number(p) + 1) % 60).padStart(2, "0")), []);
  const nextLetter = React.useCallback(() => {
    const i = ALPHA.indexOf(letter);
    const next = ALPHA[(i + 1) % ALPHA.length] ?? ALPHA[0] ?? "A";
    setLetter(next);
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
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="flex items-center gap-4">
            <SgRoller3DDigit value={digit} fontSize={32} />
            <div className="flex flex-col gap-2">
              <SgButton onClick={nextDigit} size="sm">Next (+1)</SgButton>
              <SgButton onClick={prevDigit} size="sm" severity="secondary">Previous (-1)</SgButton>
            </div>
          </div>
          <CodeBlockBase code={BASIC_CODE} />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="flex items-center gap-4">
            <SgRoller3DDigit value={minuteVal} items={MINUTES} fontSize={22} />
            <SgButton onClick={nextMinute} size="sm">+1 minuto</SgButton>
          </div>
          <CodeBlockBase code={PADDED_CODE} />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <div className="flex items-center gap-4">
            <SgRoller3DDigit value={letter} items={ALPHA} fontSize={32} />
            <SgButton onClick={nextLetter} size="sm">Proxima letra</SgButton>
          </div>
          <CodeBlockBase code={ALPHA_CODE} />
        </Section>

        <Section
          title={texts.section4Title}
          description={texts.section4Description}
        >
          <NameAnimator />
          <CodeBlockBase code={NAME_CODE} />
        </Section>

        <Section title={texts.section5Title} description={texts.section5Description}>
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

        <Section title={texts.section6Title} description={texts.section6Description}>
          <SgPlayground
            title="SgRoller3DDigit Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_CODE}
            height={360}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} title={texts.propsReferenceTitle} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


