"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SgInputNumber } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
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
    `import { useForm } from "react-hook-form";`,
    `import { SgInputNumber } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      valor: "0.00"
    }
  });

  const log = (msg: string) => console.log(msg);`;

  const bodyIndented = indentCode(body.trim(), 6);

  return `${imports}

export default function Example() {
  ${indentCode(setup, 2)}

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
${bodyIndented}
    </form>
  );
}`;
}

export default function SgInputNumberPage() {
  const { register, control, handleSubmit, watch, setValue } = useForm<FieldValues>({
    defaultValues: {
      valor: "0.00",
      required: "",
      requiredCustom: "",
      controlled: "1234.00",
      prefix: "1500.00",
      suffix: "42.00",
      both: "3500.00",
      iconbtns: "9876.54",
      negativo: "-1234.00",
      minimo: "5.00",
      vazio: "",
      noborder: "120.00",
      filled: "890.00",
      w200: "10.00",
      w300: "9999.00",
      disabled: "450.00",
      standalone1: "",
      standalone2: "",
      standalone3: ""
    } as FieldValues
  });

  const basicValue = watch("valor");
  const controlledValue = watch("controlled");
  const prefixValue = watch("prefix");
  const suffixValue = watch("suffix");
  const bothValue = watch("both");
  const iconBtnValue = watch("iconbtns");
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const [iconBtnLog, setIconBtnLog] = React.useState<string[]>([]);
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const standaloneARef = React.useRef<HTMLInputElement | null>(null);
  const standaloneBRef = React.useRef<HTMLInputElement | null>(null);
  const standaloneCRef = React.useRef<HTMLInputElement | null>(null);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  React.useEffect(() => {
    if (standaloneARef.current) standaloneARef.current.value = "1200.00";
    if (standaloneBRef.current) standaloneBRef.current.value = "55.90";
    if (standaloneCRef.current) standaloneCRef.current.value = "980.00";
  }, []);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputNumber</h1>
        <p className="mt-2 text-muted-foreground">
          Input num??rico com formata????o de milhar, separador decimal por idioma e controle de decimais.
        </p>
      </div>

      <Section title="Basico (RHF)" description="Exemplo integrado com React Hook Form usando register (uncontrolled).">
        <form onSubmit={handleSubmit((data) => console.log(data))} className="w-80 space-y-2">
          <SgInputNumber id="demo-basic" label="Valor" name="valor" register={register} decimals={2} />
          <button type="submit" className="rounded border border-border px-3 py-1.5 text-xs hover:bg-black/5">Enviar</button>
          <p className="text-xs text-muted-foreground">Valor: &quot;{basicValue}&quot;</p>
        </form>
        <CodeBlock code={`<SgInputNumber
  id="demo-basic"
  label="Valor"
  name="valor"
  register={register}
  decimals={2}
/>

<button type="submit">Enviar</button>

<p>Valor: "{watch("valor")}"</p>`} />
      </Section>

      <Section title="Obrigatorio" description="Valida ao perder o foco (validateOnBlur=true por padrao).">
        <div className="w-80">
          <SgInputNumber
            id="demo-required"
            label="Campo obrigatorio"
            required
            name="required"
            register={register}
            decimals={2}
          />
        </div>
        <div className="w-80">
          <SgInputNumber
            id="demo-required-custom"
            label="Mensagem customizada"
            required
            requiredMessage="Informe um valor."
            name="requiredCustom"
            register={register}
            decimals={2}
          />
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-required"
  label="Campo obrigatorio"
  required
  name="required"
  register={register}
  decimals={2}
/>

<SgInputNumber
  id="demo-required-custom"
  label="Mensagem customizada"
  required
  requiredMessage="Informe um valor."
  name="requiredCustom"
  register={register}
  decimals={2}
/>`} />
      </Section>

      <Section title="Controlado (caso necessario)" description="Use quando precisa de watch (valor em tempo real) + setValue externos.">
        <div className="w-96 space-y-3">
          <SgInputNumber
            id="demo-controlled"
            label="Valor controlado"
            name="controlled"
            control={control}
            decimals={2}
          />
          <p className="text-xs text-muted-foreground">
            Estado atual: <code className="rounded bg-muted px-1">&quot;{controlledValue}&quot;</code>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded border border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
              onClick={() => setValue("controlled", "12345.00")}
            >
              Setar via API
            </button>
            <button
              className="rounded border px-3 py-1.5 text-sm hover:bg-muted"
              onClick={() => setValue("controlled", "0.00")}
            >
              Resetar
            </button>
            <button
              className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              onClick={() => setValue("controlled", "")}
            >
              Limpar
            </button>
          </div>
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-controlled"
  label="Valor controlado"
  name="controlled"
  control={control}
  decimals={2}
/>

<button type="button" onClick={() => setValue("controlled", "12345.00")}>
  Setar via API
</button>

<button type="button" onClick={() => setValue("controlled", "0.00")}>
  Resetar
</button>

<button type="button" onClick={() => setValue("controlled", "")}>
  Limpar
</button>

<p>Estado atual: "{controlledValue}"</p>`} />
      </Section>

      <Section title="Validacao customizada" description="Funcao de validacao retorna mensagem ou null.">
        <div className="w-80">
          <SgInputNumber
            id="demo-validation"
            label="Apenas numero par"
            name="validation"
            register={register}
            decimals={0}
            validation={(v) => {
              const n = Number(v);
              return Number.isFinite(n) && n % 2 === 0 ? null : "Use um numero par.";
            }}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            onValidation: {validationMsg === null ? "valido" : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-validation"
  label="Apenas numero par"
  name="validation"
  register={register}
  decimals={0}
  validation={(v) => {
    const n = Number(v);
    return Number.isFinite(n) && n % 2 === 0 ? null : "Use um numero par.";
  }}
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      <Section title="Icone prefixo" description="Icone posicionado a esquerda do input.">
        <div className="w-80">
          <SgInputNumber
            id="demo-prefix-icon"
            label="Buscar valor"
            name="prefixIcon"
            register={register}
            decimals={2}
            prefixIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            }
          />
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-prefix-icon"
  label="Buscar valor"
  name="prefixIcon"
  register={register}
  decimals={2}
  prefixIcon={
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  }
/>`} />
      </Section>

      <Section title="Prefixo e sufixo" description="Prefixo/sufixo sao apenas visuais.">
        <div className="w-80 space-y-2">
          <SgInputNumber
            id="demo-prefix-text"
            label="Preco"
            prefixText="R$"
            name="prefix"
            control={control}
            decimals={2}
          />
          <p className="text-xs text-muted-foreground">
            Valor: <code className="rounded bg-muted px-1">{prefixValue}</code>
          </p>
        </div>
        <div className="w-80 space-y-2">
          <SgInputNumber
            id="demo-suffix-text"
            label="Peso"
            suffixText="kg"
            name="suffix"
            control={control}
            decimals={2}
          />
          <p className="text-xs text-muted-foreground">
            Valor: <code className="rounded bg-muted px-1">{suffixValue}</code>
          </p>
        </div>
        <div className="w-96 space-y-2">
          <SgInputNumber
            id="demo-both"
            label="Valor total"
            prefixText="R$"
            suffixText="m"
            name="both"
            control={control}
            decimals={2}
          />
          <p className="text-xs text-muted-foreground">
            Valor: <code className="rounded bg-muted px-1">{bothValue}</code>
          </p>
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-prefix-text"
  label="Preco"
  prefixText="R$"
  name="prefix"
  control={control}
  decimals={2}
/>

<SgInputNumber
  id="demo-suffix-text"
  label="Peso"
  suffixText="kg"
  name="suffix"
  control={control}
  decimals={2}
/>

<SgInputNumber
  id="demo-both"
  label="Valor total"
  prefixText="R$"
  suffixText="m"
  name="both"
  control={control}
  decimals={2}
/>`} />
      </Section>

      <Section title="Botoes de icone" description="iconButtons recebe um array de ReactNode.">
        <div className="w-96 space-y-3">
          <SgInputNumber
            id="demo-iconbtns"
            label="Numero para copiar"
            name="iconbtns"
            register={register}
            decimals={2}
            iconButtons={[
              <button
                key="copy"
                type="button"
                className="text-foreground/60 hover:text-primary"
                title="Copiar valor"
                onClick={() => {
                  navigator.clipboard.writeText(iconBtnValue ?? "");
                  setIconBtnLog((prev) => [`Copiado: "${iconBtnValue}"`, ...prev].slice(0, 5));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>,
              <button
                key="alert"
                type="button"
                className="text-foreground/60 hover:text-primary"
                title="Exibir alerta"
                onClick={() => {
                  setIconBtnLog((prev) => ["Alerta disparado!", ...prev].slice(0, 5));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              </button>
            ]}
          />
          <div className="h-24 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {iconBtnLog.length === 0 ? (
              <span className="text-muted-foreground">Digite algo e clique nos icones...</span>
            ) : (
              iconBtnLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-iconbtns"
  label="Numero para copiar"
  name="iconbtns"
  register={register}
  decimals={2}
  iconButtons={[
    <button key="copy" type="button" onClick={() => navigator.clipboard.writeText(iconBtnValue ?? "")}>
      Copiar
    </button>,
    <button key="alert" type="button" onClick={() => alert("ok")}>
      Alerta
    </button>
  ]}
/>`} />
      </Section>

      <Section title="Sem negativo" description="Bloqueia o sinal de menos.">
        <div className="w-80">
          <SgInputNumber id="demo-no-negative" label="Apenas positivo" name="positivo" register={register} allowNegative={false} decimals={2} />
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-no-negative"
  label="Apenas positivo"
  name="positivo"
  register={register}
  allowNegative={false}
  decimals={2}
/>`} />
      </Section>

      <Section title="Sem decimais" description="decimals=0 (apenas inteiro com separador de milhar).">
        <div className="w-80">
          <SgInputNumber id="demo-no-decimals" label="Quantidade" name="inteiro" register={register} decimals={0} />
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-no-decimals"
  label="Quantidade"
  name="inteiro"
  register={register}
  decimals={0}
/>`} />
      </Section>

      <Section title="Min/Max" description="Valida intervalo num??rico.">
        <div className="w-80">
          <SgInputNumber
            id="demo-minmax"
            label="Entre 10 e 100"
            name="minmax"
            register={register}
            minValue={10}
            maxValue={100}
            decimals={2}
          />
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-minmax"
  label="Entre 10 e 100"
  name="minmax"
  register={register}
  minValue={10}
  maxValue={100}
  decimals={2}
/>`} />
      </Section>

      <Section title="Valor vazio" description='emptyValue="null" permite limpar totalmente.'>
        <div className="w-80">
          <SgInputNumber
            id="demo-empty"
            label="Pode ficar vazio"
            name="vazio"
            register={register}
            emptyValue="null"
            decimals={2}
          />
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-empty"
  label="Pode ficar vazio"
  name="vazio"
  register={register}
  emptyValue="null"
  decimals={2}
/>`} />
      </Section>

      <Section title="Variacoes visuais" description="Sem borda (withBorder=false) e preenchido (filled=true).">
        <div className="w-80">
          <SgInputNumber id="demo-noborder" label="Sem borda" withBorder={false} name="noborder" register={register} decimals={2} />
        </div>
        <div className="w-80">
          <SgInputNumber id="demo-filled" label="Preenchido" filled name="filled" register={register} decimals={2} />
        </div>
        <CodeBlock code={`<SgInputNumber id="demo-noborder" label="Sem borda" withBorder={false} name="noborder" register={register} decimals={2} />
<SgInputNumber id="demo-filled" label="Preenchido" filled name="filled" register={register} decimals={2} />`} />
      </Section>

      <Section title="Standalone (form completo)" description="Exemplo 100% standalone com default no load e botao salvar.">
        <div className="w-96 space-y-3">
          <SgInputNumber id="standalone-a" label="Entrada 1" decimals={2} inputProps={{ ref: standaloneARef }} />
          <SgInputNumber id="standalone-b" label="Entrada 2" decimals={2} inputProps={{ ref: standaloneBRef }} />
          <SgInputNumber id="standalone-c" label="Entrada 3" decimals={2} inputProps={{ ref: standaloneCRef }} />
          <button
            type="button"
            className="rounded border border-border px-3 py-1.5 text-xs hover:bg-black/5"
            onClick={() => {
              const payload = {
                a: standaloneARef.current?.value ?? "",
                b: standaloneBRef.current?.value ?? "",
                c: standaloneCRef.current?.value ?? ""
              };
              setEventLog((prev) => [`[salvar] ${JSON.stringify(payload)}`, ...prev].slice(0, 10));
            }}
          >
            Salvar
          </button>
        </div>
        <CodeBlock code={`import React from "react";
import { SgInputNumber } from "@seedgrid/fe-components";

export default function Example() {
  const refA = React.useRef<HTMLInputElement | null>(null);
  const refB = React.useRef<HTMLInputElement | null>(null);
  const refC = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (refA.current) refA.current.value = "1200.00";
    if (refB.current) refB.current.value = "55.90";
    if (refC.current) refC.current.value = "980.00";
  }, []);

  const handleSave = () => {
    const payload = {
      a: refA.current?.value ?? "",
      b: refB.current?.value ?? "",
      c: refC.current?.value ?? ""
    };
    console.log("Salvar:", payload);
  };

  return (
    <div className="space-y-3">
      <SgInputNumber id="a" label="Entrada 1" decimals={2} inputProps={{ ref: refA }} />
      <SgInputNumber id="b" label="Entrada 2" decimals={2} inputProps={{ ref: refB }} />
      <SgInputNumber id="c" label="Entrada 3" decimals={2} inputProps={{ ref: refC }} />
      <button type="button" onClick={handleSave}>Salvar</button>
    </div>
  );
}`} />
      </Section>

      <Section title="Eventos (standalone)" description="Exemplo sem RHF com onEnter, onExit, onChange, onClear, onValidation.">
        <div className="w-80">
          <SgInputNumber
            id="demo-events"
            label="Digite e observe o log"
            required
            decimals={2}
            onChange={(v) => log(`onChange: ${v}`)}
            onEnter={() => log("onEnter (focus)")}
            onExit={() => log("onExit (blur)")}
            onClear={() => log("onClear")}
            onValidation={(msg) => log(`onValidation: ${msg ?? "valido"}`)}
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">Interaja com o input...</span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputNumber
  id="demo-events"
  label="Digite e observe o log"
  required
  decimals={2}
  onChange={(v) => console.log("onChange:", v)}
  onEnter={() => console.log("focus")}
  onExit={() => console.log("blur")}
  onClear={() => console.log("cleared")}
  onValidation={(msg) => console.log("validation:", msg)}
/>`} />
      </Section>

      <Section title="Largura e borda" description="width e borderRadius customizaveis.">
        <div className="flex gap-4">
          <SgInputNumber id="demo-w200" label="200px" width={200} name="w200" register={register} decimals={2} />
          <SgInputNumber id="demo-w300" label="300px arredondado" width={300} borderRadius={20} name="w300" register={register} decimals={2} />
        </div>
        <CodeBlock code={`<SgInputNumber id="demo-w200" label="200px" width={200} name="w200" register={register} decimals={2} />
<SgInputNumber id="demo-w300" label="300px arredondado" width={300} borderRadius={20} name="w300" register={register} decimals={2} />`} />
      </Section>
    </div>
  );
}
