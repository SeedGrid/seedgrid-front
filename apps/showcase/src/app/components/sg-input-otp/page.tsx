"use client";

import React from "react";
import Link from "next/link";
import { SgButton, SgGrid, SgInputOTP, SgPlayground, type SgInputOTPRef } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  const trimmed = props.code.trimStart();
  const content = trimmed.startsWith("import ") ? props.code : wrapFullExample(props.code);
  return <CodeBlockBase code={content} />;
}

function indentCode(source: string, spaces: number) {
  const pad = " ".repeat(spaces);
  return source
    .split("\n")
    .map((line) => (line.length ? `${pad}${line}` : line))
    .join("\n");
}

function wrapFullExample(body: string) {
  const imports = [
    `import React from "react";`,
    `import { SgButton, SgInputOTP, type SgInputOTPRef } from "@seedgrid/fe-components";`
  ].join("\n");
  const bodyIndented = indentCode(body.trim(), 4);
  return `${imports}\n\nexport default function Example() {\n${bodyIndented}\n}`;
}

function ValuePanel(props: { masked: string; raw: string; expectedLength: number; completeValue?: string }) {
  const complete = props.raw.length === props.expectedLength;
  return (
    <div className="rounded-md border border-border bg-foreground/5 p-3 text-xs">
      <p><strong>masked:</strong> {props.masked || "(vazio)"}</p>
      <p><strong>raw:</strong> {props.raw || "(vazio)"}</p>
      <p><strong>completo:</strong> {complete ? "sim" : "nao"}</p>
      {props.completeValue ? (
        <p><strong>onComplete:</strong> {props.completeValue}</p>
      ) : null}
    </div>
  );
}

const OTP_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgGrid, SgInputOTP, type SgInputOTPRef } from "@seedgrid/fe-components";

export default function App() {
  const otpRef = React.useRef<SgInputOTPRef | null>(null);
  const [mask, setMask] = React.useState("###-###-99");
  const [masked, setMasked] = React.useState("");
  const [raw, setRaw] = React.useState("");

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance={mask === "###-###-99" ? "solid" : "outline"} onClick={() => setMask("###-###-99")}>
          mask ###-###-99
        </SgButton>
        <SgButton size="sm" appearance={mask === "999999" ? "solid" : "outline"} onClick={() => setMask("999999")}>
          mask 999999
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.focus()}>
          Focar
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.clear()}>
          Limpar
        </SgButton>
      </SgGrid>

      <SgInputOTP
        id="playground-otp"
        ref={otpRef}
        label="SgInputOTP Playground"
        hintText="Digite ou cole o código"
        mask={mask}
        onChange={setMasked}
        onRawChange={setRaw}
      />

      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        <div><strong>masked:</strong> {masked || "(vazio)"}</div>
        <div><strong>raw:</strong> {raw || "(vazio)"}</div>
      </div>
    </div>
  );
}`;

export default function SgInputOTPPage() {
  const otpRef = React.useRef<SgInputOTPRef | null>(null);
  const [basicMasked, setBasicMasked] = React.useState("");
  const [basicRaw, setBasicRaw] = React.useState("");
  const [maskMasked, setMaskMasked] = React.useState("");
  const [maskRaw, setMaskRaw] = React.useState("");
  const [pasteMasked, setPasteMasked] = React.useState("");
  const [pasteRaw, setPasteRaw] = React.useState("");
  const [completeValue, setCompleteValue] = React.useState("");
  const [refReadout, setRefReadout] = React.useState('Clique em "Ler conteúdo".');
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) resizeObserver.observe(stickyHeaderRef.current);

    window.addEventListener("resize", updateAnchorOffset);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateAnchorOffset);
    };
  }, []);

  const findScrollContainer = React.useCallback((element: HTMLElement | null): HTMLElement | Window => {
    let current = element?.parentElement ?? null;
    while (current) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    return window;
  }, []);

  const navigateToAnchor = React.useCallback((anchorId: string) => {
    const target = document.getElementById(anchorId);
    if (!target) return;

    const scrollContainer = findScrollContainer(target);
    const extraTopGap = 12;
    const titleEl = (target.querySelector("[data-anchor-title='true']") as HTMLElement | null) ?? target;

    const correctIfNeeded = () => {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const currentTop = titleEl.getBoundingClientRect().top;
      const delta = currentTop - desiredTopNow;
      if (Math.abs(delta) <= 1) return;

      if (scrollContainer === window) {
        window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior: "auto" });
        return;
      }

      const container = scrollContainer as HTMLElement;
      container.scrollTo({ top: Math.max(0, container.scrollTop + delta), behavior: "auto" });
    };

    if (scrollContainer === window) {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const titleTop = window.scrollY + titleEl.getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(0, titleTop - desiredTopNow), behavior: "auto" });
    } else {
      const container = scrollContainer as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopInContainer = stickyBottomNow + extraTopGap - containerRect.top;
      const titleRect = titleEl.getBoundingClientRect();
      const titleTopInContainer = container.scrollTop + (titleRect.top - containerRect.top);
      container.scrollTo({ top: Math.max(0, titleTopInContainer - desiredTopInContainer), behavior: "auto" });
    }

    window.history.replaceState(null, "", `#${anchorId}`);
    requestAnimationFrame(() => {
      correctIfNeeded();
      requestAnimationFrame(correctIfNeeded);
    });
    window.setTimeout(correctIfNeeded, 120);
    window.setTimeout(correctIfNeeded, 260);
  }, [findScrollContainer]);

  const handleAnchorClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToAnchor(anchorId);
  }, [navigateToAnchor]);

  const navigateToAnchorRef = React.useRef(navigateToAnchor);
  React.useEffect(() => {
    navigateToAnchorRef.current = navigateToAnchor;
  }, [navigateToAnchor]);

  React.useEffect(() => {
    const applyHashNavigation = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      navigateToAnchorRef.current(hash);
    };

    const timer = window.setTimeout(applyHashNavigation, 0);
    window.addEventListener("hashchange", applyHashNavigation);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", applyHashNavigation);
    };
  }, []);

  const exampleLinks = React.useMemo(
    () => [
      { id: "exemplo-1", label: "1) Básico" },
      { id: "exemplo-2", label: "2) Máscara customizada" },
      { id: "exemplo-3", label: "3) Colagem + onComplete" },
      { id: "exemplo-4", label: "4) Acesso por ref" },
      { id: "exemplo-5", label: "5) Playground" }
    ],
    []
  );

  return (
    <I18NReady>
      <div
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky -top-8 z-50 isolate bg-background pb-2 pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgInputOTP</h1>
            <p className="mt-2 text-muted-foreground">
              Input OTP com dígitos separados, suporte a colagem e máscara configurável.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Exemplos</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {exampleLinks.map((example) => (
                <Link
                  key={example.id}
                  href={`#${example.id}`}
                  onClick={(event) => handleAnchorClick(event, example.id)}
                  className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
                >
                  {example.label}
                </Link>
              ))}
              <Link
                href="#props-reference"
                onClick={(event) => handleAnchorClick(event, "props-reference")}
                className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
              >
                Props Reference
              </Link>
            </SgGrid>
          </div>
        </div>

        <Section id="exemplo-1" title="1) Básico" description="Máscara padrão: 999999.">
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP
              id="otp-basic"
              label="Código OTP"
              hintText="Digite os 6 dígitos"
              onChange={setBasicMasked}
              onRawChange={setBasicRaw}
            />
            <ValuePanel masked={basicMasked} raw={basicRaw} expectedLength={6} />
          </div>
          <CodeBlock code={`const [masked, setMasked] = React.useState("");\nconst [raw, setRaw] = React.useState("");\n\nreturn (\n  <SgInputOTP\n    id="otp-basic"\n    label="Código OTP"\n    hintText="Digite os 6 dígitos"\n    onChange={setMasked}\n    onRawChange={setRaw}\n  />\n);`} />
        </Section>

        <Section id="exemplo-2" title="2) Máscara customizada" description='Exemplo: "###-###-99".'>
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP
              id="otp-mask"
              label="Token de acesso"
              hintText="Formato: ###-###-99"
              mask="###-###-99"
              onChange={setMaskMasked}
              onRawChange={setMaskRaw}
            />
            <ValuePanel masked={maskMasked} raw={maskRaw} expectedLength={8} />
          </div>
          <CodeBlock code={`<SgInputOTP\n  id="otp-mask"\n  label="Token de acesso"\n  hintText="Formato: ###-###-99"\n  mask="###-###-99"\n  onChange={setMaskMasked}\n  onRawChange={setMaskRaw}\n/>`} />
        </Section>

        <Section id="exemplo-3" title="3) Colagem + onComplete" description="Cole um OTP e receba callback ao completar.">
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP
              id="otp-paste"
              label="Cole o código"
              hintText='Teste colando: "AB1-CD2-34"'
              mask="###-###-99"
              onChange={setPasteMasked}
              onRawChange={setPasteRaw}
              onComplete={(value) => setCompleteValue(value)}
            />
            <ValuePanel masked={pasteMasked} raw={pasteRaw} expectedLength={8} completeValue={completeValue} />
          </div>
          <CodeBlock code={`<SgInputOTP\n  id="otp-paste"\n  label="Cole o código"\n  hintText='Teste colando: "AB1-CD2-34"'\n  mask="###-###-99"\n  onChange={setPasteMasked}\n  onRawChange={setPasteRaw}\n  onComplete={(value) => setCompleteValue(value)}\n/>`} />
        </Section>

        <Section id="exemplo-4" title="4) Acesso por ref" description="Focar, limpar e ler valores via API do ref.">
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP id="otp-ref" ref={otpRef} label="OTP por ref" hintText="Use os botões abaixo" mask="###-###-99" />
            <SgGrid columns={{ base: 1, sm: 3 }} gap={8}>
              <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.focus()}>Focar</SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.clear()}>Limpar</SgButton>
              <SgButton
                size="sm"
                appearance="outline"
                onClick={() => {
                  const masked = otpRef.current?.getMaskedValue() ?? "";
                  const raw = otpRef.current?.getRawValue() ?? "";
                  setRefReadout(`masked="${masked || "(vazio)"}" | raw="${raw || "(vazio)"}"`);
                }}
              >
                Ler conteúdo
              </SgButton>
            </SgGrid>
            <div className="rounded-md border border-border bg-foreground/5 p-3 text-xs">
              <strong>saida:</strong> {refReadout}
            </div>
          </div>
          <CodeBlock code={`const otpRef = React.useRef<SgInputOTPRef | null>(null);\n\nreturn (\n  <>\n    <SgInputOTP id="otp-ref" ref={otpRef} mask="###-###-99" />\n    <SgButton onClick={() => otpRef.current?.focus()}>Focar</SgButton>\n    <SgButton onClick={() => otpRef.current?.clear()}>Limpar</SgButton>\n    <SgButton onClick={() => console.log(otpRef.current?.getMaskedValue())}>Ler conteúdo</SgButton>\n  </>\n);`} />
        </Section>

        <Section id="exemplo-5" title="5) Playground" description="Simule as principais props em tempo real.">
          <SgPlayground
            title="SgInputOTP Playground"
            interactive
            codeContract="appFile"
            code={OTP_PLAYGROUND_CODE}
            height={620}
            defaultOpen
          />
        </Section>

        <section
          id="props-reference"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">Referência de Props</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-semibold">Prop</th>
                  <th className="pb-2 pr-4 font-semibold">Tipo</th>
                  <th className="pb-2 pr-4 font-semibold">Padrão</th>
                  <th className="pb-2 font-semibold">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Identificador do componente.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">label / hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Textos de label e dica.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">mask</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">"999999"</td><td className="py-2">Máscara (`#` alfanumérico e `9` numérico).</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">value / defaultValue</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Modo controlado e valor inicial.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">required / requiredMessage</td><td className="py-2 pr-4">boolean / string</td><td className="py-2 pr-4">false / auto</td><td className="py-2">Validação obrigatória.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onChange / onRawChange / onComplete</td><td className="py-2 pr-4">callbacks</td><td className="py-2 pr-4">-</td><td className="py-2">Retorno de valor formatado, bruto e completo.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">enabled / readOnly</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true / false</td><td className="py-2">Controle de edição.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">className / groupClassName / slotClassName / separatorClassName</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Customização visual.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">register / control / name</td><td className="py-2 pr-4">react-hook-form</td><td className="py-2 pr-4">-</td><td className="py-2">Integração com RHF.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">ref API</td><td className="py-2 pr-4">SgInputOTPRef</td><td className="py-2 pr-4">-</td><td className="py-2">Métodos: focus, clear, getRawValue, getMaskedValue.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
