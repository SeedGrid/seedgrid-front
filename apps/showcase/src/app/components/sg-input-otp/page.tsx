"use client";

import React from "react";
import { SgButton, SgInputOTP, SgPlayground, type SgInputOTPRef } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-6">{props.children}</div>
    </section>
  );
}

function ValuePanel(props: { masked: string; raw: string; expectedLength: number }) {
  const complete = props.raw.length === props.expectedLength;
  return (
    <div className="rounded-md border border-border bg-foreground/5 p-3 text-xs">
      <p>
        <strong>masked:</strong> {props.masked || "(vazio)"}
      </p>
      <p>
        <strong>raw:</strong> {props.raw || "(vazio)"}
      </p>
      <p>
        <strong>completo:</strong> {complete ? "sim" : "nao"}
      </p>
    </div>
  );
}

const OTP_PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgButton, SgInputOTP as SgInputOTPFromLib, SgStack } from "@seedgrid/fe-components";

type SgInputOTPRef = {
  focus: (slotIndex?: number) => void;
  clear: () => void;
  getRawValue: () => string;
  getMaskedValue: () => string;
};

type LocalOtpFallbackProps = {
  id?: string;
  label?: string;
  hintText?: string;
  onChange?: (value: string) => void;
  onRawChange?: (value: string) => void;
};

const SLOT_COUNT = 8;

function toMasked(raw: string) {
  const p1 = raw.slice(0, 3);
  const p2 = raw.slice(3, 6);
  const p3 = raw.slice(6, 8);
  return [p1, p2, p3].filter(Boolean).join("-");
}

function isAccepted(index: number, char: string) {
  if (index < 6) return /^[A-Za-z0-9]$/.test(char);
  return /^[0-9]$/.test(char);
}

const LocalOtpFallback = React.forwardRef<SgInputOTPRef, LocalOtpFallbackProps>(function LocalOtpFallback(
  props,
  ref
) {
  const [parts, setParts] = React.useState<string[]>(() => Array.from({ length: SLOT_COUNT }, () => ""));
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  const focusSlot = React.useCallback((index: number) => {
    const safeIndex = Math.max(0, Math.min(SLOT_COUNT - 1, index));
    const node = refs.current[safeIndex];
    if (!node) return;
    node.focus();
    node.select();
  }, []);

  const commit = React.useCallback(
    (next: string[]) => {
      setParts(next);
      const raw = next.join("");
      props.onRawChange?.(raw);
      props.onChange?.(toMasked(raw));
    },
    [props]
  );

  const applyFrom = React.useCallback(
    (startIndex: number, text: string) => {
      const next = [...parts];
      let pointer = Math.max(0, Math.min(SLOT_COUNT - 1, startIndex));
      for (const sourceChar of text) {
        const char = sourceChar.toUpperCase();
        while (pointer < SLOT_COUNT && !isAccepted(pointer, char)) {
          pointer += 1;
        }
        if (pointer >= SLOT_COUNT) break;
        next[pointer] = char;
        pointer += 1;
      }
      commit(next);
      focusSlot(pointer);
    },
    [commit, focusSlot, parts]
  );

  React.useImperativeHandle(
    ref,
    () => ({
      focus: (slotIndex = 0) => {
        focusSlot(slotIndex);
      },
      clear: () => {
        commit(Array.from({ length: SLOT_COUNT }, () => ""));
        focusSlot(0);
      },
      getRawValue: () => parts.join(""),
      getMaskedValue: () => toMasked(parts.join(""))
    }),
    [commit, focusSlot, parts]
  );

  return (
    <div className="space-y-2">
      {props.label ? <div className="text-sm font-medium">{props.label}</div> : null}
      <div className="inline-flex items-center gap-2">
        {Array.from({ length: SLOT_COUNT }).map((_, index) => {
          const value = parts[index] ?? "";
          return (
            <React.Fragment key={index}>
              {index === 3 || index === 6 ? (
                <span className="select-none px-1 text-lg text-foreground/60">-</span>
              ) : null}
              <input
                className="h-11 w-10 rounded border border-border bg-white text-center text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={value}
                maxLength={1}
                inputMode={index < 6 ? "text" : "numeric"}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => {
                  const typed = event.currentTarget.value ?? "";
                  if (!typed) {
                    const next = [...parts];
                    next[index] = "";
                    commit(next);
                    return;
                  }
                  applyFrom(index, typed);
                }}
                onPaste={(event) => {
                  event.preventDefault();
                  const pasted = event.clipboardData.getData("text") ?? "";
                  if (!pasted) return;
                  applyFrom(index, pasted);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace") {
                    event.preventDefault();
                    const next = [...parts];
                    if (next[index]) {
                      next[index] = "";
                      commit(next);
                      return;
                    }
                    if (index > 0) {
                      next[index - 1] = "";
                      commit(next);
                      focusSlot(index - 1);
                    }
                  }
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    focusSlot(index - 1);
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    focusSlot(index + 1);
                  }
                }}
              />
            </React.Fragment>
          );
        })}
      </div>
      {props.hintText ? <div className="text-xs text-muted-foreground">{props.hintText}</div> : null}
    </div>
  );
});

export default function App() {
  const hasOtp = typeof SgInputOTPFromLib === "function";
  const [masked, setMasked] = React.useState("");
  const [raw, setRaw] = React.useState("");
  const otpRef = React.useRef<SgInputOTPRef | null>(null);
  const OtpComponent = (hasOtp ? SgInputOTPFromLib : LocalOtpFallback) as React.ComponentType<any>;

  return (
    <div className="space-y-4 p-2">
      {!hasOtp ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgInputOTP ainda nao esta na versao publicada do pacote usada pelo Sandpack. Exibindo fallback local.
        </div>
      ) : null}

      <OtpComponent
        id="otp-playground"
        label="OTP com mascara"
        hintText="Cole ou digite"
        mask="###-###-99"
        onChange={setMasked}
        onRawChange={setRaw}
        ref={otpRef}
      />

      <div className="rounded border border-border bg-muted/40 p-2 text-xs">
        <div><strong>masked:</strong> {masked || "(vazio)"}</div>
        <div><strong>raw:</strong> {raw || "(vazio)"}</div>
      </div>

      <SgStack direction="row" gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.focus()}>
          Focar
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.clear()}>
          Limpar
        </SgButton>
        <SgButton size="sm" severity="primary" onClick={() => alert(otpRef.current?.getMaskedValue() || "")}>
          Ler conteudo
        </SgButton>
      </SgStack>
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
  const [refReadout, setRefReadout] = React.useState('Clique em "Ler conteudo".');

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputOTP</h1>
        <p className="mt-2 text-muted-foreground">
          Input OTP com digitos separados, suporte a colagem e mascara customizavel
          usando <code>#</code> (alfanumerico) e <code>9</code> (numerico).
        </p>
      </div>

      <Section
        title="1) OTP basico (6 digitos)"
        description="Mascara padrao: 999999."
      >
        <div className="w-full max-w-md space-y-3">
          <SgInputOTP
            id="otp-basic"
            label="Codigo OTP"
            hintText="Digite os 6 digitos"
            onChange={setBasicMasked}
            onRawChange={setBasicRaw}
          />
          <ValuePanel masked={basicMasked} raw={basicRaw} expectedLength={6} />
        </div>
        <div className="w-full max-w-2xl">
          <CodeBlockBase
            code={`const [masked, setMasked] = React.useState("");
const [raw, setRaw] = React.useState("");

<SgInputOTP
  id="otp-basic"
  label="Codigo OTP"
  hintText="Digite os 6 digitos"
  onChange={setMasked}
  onRawChange={setRaw}
/>`}
          />
        </div>
      </Section>

      <Section
        title="2) Mascara customizada"
        description='Exemplo: "###-###-99" onde # = alfanumerico e 9 = numero.'
      >
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
        <div className="w-full max-w-2xl">
          <CodeBlockBase
            code={`<SgInputOTP
  id="otp-mask"
  label="Token de acesso"
  hintText="Formato: ###-###-99"
  mask="###-###-99"
  onChange={(masked) => console.log(masked)}
  onRawChange={(raw) => console.log(raw)}
/>`}
          />
        </div>
      </Section>

      <Section
        title="3) Colagem de OTP"
        description='Cole um texto como "AB1-CD2-34" ou "AB1CD234". O componente distribui automaticamente nas caixas.'
      >
        <div className="w-full max-w-md space-y-3">
          <SgInputOTP
            id="otp-paste"
            label="Cole o codigo"
            hintText='Teste colando: "AB1-CD2-34"'
            mask="###-###-99"
            onChange={setPasteMasked}
            onRawChange={setPasteRaw}
          />
          <ValuePanel masked={pasteMasked} raw={pasteRaw} expectedLength={8} />
        </div>
        <div className="w-full max-w-2xl">
          <CodeBlockBase
            code={`<SgInputOTP
  id="otp-paste"
  label="Cole o codigo"
  hintText='Teste colando: "AB1-CD2-34"'
  mask="###-###-99"
/>`}
          />
        </div>
      </Section>

      <Section
        title="4) Acesso ao conteudo via ref"
        description="Use o ref para focar, limpar e ler o valor atual (raw/masked)."
      >
        <div className="w-full max-w-md space-y-3">
          <SgInputOTP
            id="otp-ref"
            label="OTP controlado por ref"
            hintText="Clique nos botoes abaixo"
            mask="###-###-99"
            ref={otpRef}
          />

          <div className="flex flex-wrap gap-2">
            <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.focus()}>
              Focar
            </SgButton>
            <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.clear()}>
              Limpar
            </SgButton>
            <SgButton
              size="sm"
              severity="primary"
              onClick={() => {
                const masked = otpRef.current?.getMaskedValue() ?? "";
                const raw = otpRef.current?.getRawValue() ?? "";
                setRefReadout(`masked="${masked || "(vazio)"}" | raw="${raw || "(vazio)"}"`);
              }}
            >
              Ler conteudo
            </SgButton>
          </div>

          <div className="rounded-md border border-border bg-foreground/5 p-3 text-xs">
            <strong>saida:</strong> {refReadout}
          </div>
        </div>
        <div className="w-full max-w-2xl">
          <CodeBlockBase
            code={`const otpRef = React.useRef<SgInputOTPRef | null>(null);

<SgInputOTP id="otp-ref" mask="###-###-99" ref={otpRef} />

otpRef.current?.focus();
otpRef.current?.clear();
otpRef.current?.getRawValue();
otpRef.current?.getMaskedValue();`}
          />
        </div>
      </Section>

      <Section
        title="5) Playground OTP (SgPlayground)"
        description="Playground interativo para testar o OTP em tempo real."
      >
        <div className="w-full">
          <SgPlayground
            title="SgInputOTP Playground"
            description="Edite e rode o exemplo."
            interactive
            codeContract="appFile"
            code={OTP_PLAYGROUND_APP_FILE}
            seedgridDependency="0.2.8"
            height={500}
          />
        </div>
      </Section>
    </div>
  );
}
