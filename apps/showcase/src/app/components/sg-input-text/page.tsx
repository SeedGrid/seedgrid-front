"use client";

import React from "react";
import { SgInputText } from "@seedgrid/fe-components";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function buildRhfCode(code: string, baseName = "campo", defaultValues?: string) {
  const matches = code.match(/<SgInputText\b/g) ?? [];
  const count = Math.max(matches.length, 1);
  const names = Array.from({ length: count }, (_, index) => `${baseName}${count > 1 ? index + 1 : ""}`);
  let cursor = 0;
  const withControl = code.replace(/<SgInputText\b/g, () => {
    const name = names[cursor] ?? baseName;
    cursor += 1;
    return `<SgInputText\n  name="${name}"\n  control={control}`;
  });
  const defaults = defaultValues ?? `{ ${names.map((name) => `${name}: ""`).join(", ")} }`;
  return `import React from "react";\nimport { useForm } from "react-hook-form";\nimport { SgInputText } from "@seedgrid/fe-components";\n\nexport default function Example() {\n  const { control, handleSubmit } = useForm({\n    defaultValues: ${defaults}\n  });\n\n  const onSubmit = (data) => console.log(data);\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n${withControl.split("\n").map((line) => (line ? `      ${line}` : "")).join("\n")}\n    </form>\n  );\n}`;
}

function CodeBlock(props: { code: string; wrapRHF?: boolean; rhfBaseName?: string; rhfDefaultValues?: string }) {
  const content = props.wrapRHF === false
    ? props.code
    : buildRhfCode(props.code, props.rhfBaseName, props.rhfDefaultValues);
  return (
    <pre className="mt-3 rounded-md bg-foreground/5 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
      {content}
    </pre>
  );
}

export default function SgInputTextPage() {
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [controlledValue, setControlledValue] = React.useState("Texto inicial");
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const [iconBtnValue, setIconBtnValue] = React.useState("");
  const [iconBtnLog, setIconBtnLog] = React.useState<string[]>([]);
  const [suffixRaw, setSuffixRaw] = React.useState("usuario");
  const [prefixRaw, setPrefixRaw] = React.useState("test.com.br");
  const [bothRaw, setBothRaw] = React.useState("app");

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputText</h1>
        <p className="mt-2 text-muted-foreground">
          Componente base de input de texto. Todos os outros inputs especializados (CPF, Email, Senha, etc.)
          sao construidos em cima dele via composicao.
        </p>
      </div>

      {/* ── Basico ── */}
      <Section title="Basico" description="Input com floating label e botao limpar (padrao).">
        <div className="w-80">
          <SgInputText
            id="demo-basic"
            label="Nome completo"
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">Valor: &quot;{basicValue}&quot;</p>
        </div>
        <CodeBlock code={`<SgInputText
  id="nome"
  label="Nome completo"
  onChange={(value) => console.log(value)}
/>`} />
      </Section>

      {/* ── Required ── */}
      <Section title="Obrigatorio" description="Valida ao perder o foco (validateOnBlur=true por padrao).">
        <div className="w-80">
          <SgInputText
            id="demo-required"
            label="Campo obrigatorio"
            required
          />
        </div>
        <div className="w-80">
          <SgInputText
            id="demo-required-custom"
            label="Mensagem customizada"
            required
            requiredMessage="Preencha este campo!"
          />
        </div>
        <CodeBlock code={`<SgInputText
  id="campo"
  label="Campo obrigatorio"
  required
  requiredMessage="Preencha este campo!"
/>`} />
      </Section>

      {/* ── Controlled ── */}
      <Section title="Controlado" description="Para controlar o valor de fora (setar, limpar, preencher via API), use inputProps.value + inputProps.onChange. O estado vive no pai.">
        <div className="w-96 space-y-3">
          <SgInputText
            id="demo-controlled"
            label="Nome do cliente"
            inputProps={{
              value: controlledValue,
              onChange: (e) => setControlledValue(e.target.value)
            }}
          />
          <p className="text-xs text-muted-foreground">
            Estado atual: <code className="rounded bg-muted px-1">&quot;{controlledValue}&quot;</code>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded border border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
              onClick={() => setControlledValue("Maria da Silva")}
            >
              Simular preenchimento via API
            </button>
            <button
              className="rounded border px-3 py-1.5 text-sm hover:bg-muted"
              onClick={() => setControlledValue("Outro valor qualquer")}
            >
              Setar outro valor
            </button>
            <button
              className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              onClick={() => setControlledValue("")}
            >
              Limpar campo
            </button>
          </div>
        </div>
        <div className="w-full">
          <p className="mb-2 text-sm font-medium">Como funciona:</p>
          <ul className="mb-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li><code className="rounded bg-muted px-1">inputProps.value</code> vincula o input ao seu estado</li>
            <li><code className="rounded bg-muted px-1">inputProps.onChange</code> atualiza o estado quando o usuario digita</li>
            <li>Para setar de fora: basta chamar <code className="rounded bg-muted px-1">setValue(&quot;novo texto&quot;)</code></li>
            <li>Para limpar de fora: basta chamar <code className="rounded bg-muted px-1">setValue(&quot;&quot;)</code></li>
          </ul>
          <CodeBlock
            wrapRHF={false}
            code={`import React from "react";
import { useForm } from "react-hook-form";
import { SgInputText } from "@seedgrid/fe-components";

export default function Example() {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: { nome: "" }
  });

  const onSubmit = (data) => console.log(data);
  const value = watch("nome");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SgInputText
        id="nome"
        name="nome"
        control={control}
        label="Nome do cliente"
      />

      <button type="button" onClick={() => setValue("nome", "Maria da Silva")}>
        Simular preenchimento via API
      </button>

      <button type="button" onClick={() => setValue("nome", "Outro valor qualquer")}>
        Setar outro valor
      </button>

      <button type="button" onClick={() => setValue("nome", "")}>
        Limpar campo
      </button>

      <p>Valor atual: "{value}"</p>
    </form>
  );
}`}
          />
        </div>
      </Section>

      {/* ── MaxLength + Counter ── */}
      <Section title="Contador de caracteres" description="Usa maxLength e showCharCounter para limitar e exibir contagem.">
        <div className="w-80">
          <SgInputText
            id="demo-counter"
            label="Maximo 20 caracteres"
            maxLength={20}
            showCharCounter
          />
        </div>
        <CodeBlock code={`<SgInputText
  id="counter"
  label="Maximo 20 caracteres"
  maxLength={20}
  showCharCounter
/>`} />
      </Section>

      {/* ── MinLength ── */}
      <Section title="Tamanho minimo" description="Valida que o texto tem um tamanho minimo ao perder foco.">
        <div className="w-80">
          <SgInputText
            id="demo-minlength"
            label="Minimo 5 caracteres"
            minLength={5}
            showCharCounter
          />
        </div>
        <CodeBlock code={`<SgInputText
  id="min"
  label="Minimo 5 caracteres"
  minLength={5}
  showCharCounter
/>`} />
      </Section>

      {/* ── MinNumberOfWords ── */}
      <Section title="Minimo de palavras" description="Valida quantidade minima de palavras.">
        <div className="w-80">
          <SgInputText
            id="demo-words"
            label="Minimo 3 palavras"
            minNumberOfWords={3}
            minNumberOfWordsMessage="Digite pelo menos 3 palavras."
          />
        </div>
        <CodeBlock code={`<SgInputText
  id="words"
  label="Minimo 3 palavras"
  minNumberOfWords={3}
  minNumberOfWordsMessage="Digite pelo menos 3 palavras."
/>`} />
      </Section>

      {/* ── Custom Validation ── */}
      <Section title="Validacao customizada" description="Funcao de validacao retorna mensagem de erro ou null.">
        <div className="w-80">
          <SgInputText
            id="demo-validation"
            label="Apenas letras"
            validation={(v) =>
              /[^a-zA-ZÀ-ú\s]/.test(v) ? "Apenas letras sao permitidas." : null
            }
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            onValidation: {validationMsg === null ? "valido" : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={String.raw`<SgInputText
  id="letras"
  label="Apenas letras"
  validation={(v) =>
    /[^a-zA-Z\s]/.test(v)
      ? "Apenas letras sao permitidas."
      : null
  }
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      {/* ── Prefix Icon ── */}
      <Section title="Icone prefixo" description="Icone posicionado a esquerda do input.">
        <div className="w-80">
          <SgInputText
            id="demo-prefix"
            label="Buscar"
            prefixIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            }
          />
        </div>
        <CodeBlock code={`<SgInputText
  id="busca"
  label="Buscar"
  prefixIcon={<SearchIcon />}
/>`} />
      </Section>

      {/* ── Icon Buttons ── */}
      {/* â”€â”€ Prefixo / Sufixo â”€â”€ */}
      <Section title="Prefixo e sufixo" description="Prefixo/sufixo sao apenas visuais. O valor retornado ja vem concatenado.">
        <div className="w-80 space-y-2">
          <SgInputText
            id="demo-suffix"
            label="Email"
            suffixText="@gmail.com"
            inputProps={{
              value: suffixRaw,
              onChange: (e) => setSuffixRaw(e.target.value)
            }}
            onChange={(value) => log(`valor completo: ${value}`)}
          />
          <p className="text-xs text-muted-foreground">
            Valor completo: <code className="rounded bg-muted px-1">{suffixRaw}@gmail.com</code>
          </p>
        </div>
        <div className="w-80 space-y-2">
          <SgInputText
            id="demo-prefix-text"
            label="Website"
            prefixText="www."
            inputProps={{
              value: prefixRaw,
              onChange: (e) => setPrefixRaw(e.target.value)
            }}
            onChange={(value) => log(`valor completo: ${value}`)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border px-2 py-1 text-xs hover:bg-muted"
              onClick={() => setPrefixRaw("test.com.br")}
            >
              Setar valor externo (test.com.br)
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Valor completo: <code className="rounded bg-muted px-1">www.{prefixRaw}</code>
          </p>
        </div>
        <div className="w-96 space-y-2">
          <SgInputText
            id="demo-both"
            label="Dominio"
            prefixText="www."
            suffixText=".seedgrid.com.br"
            inputProps={{
              value: bothRaw,
              onChange: (e) => setBothRaw(e.target.value)
            }}
          />
          <p className="text-xs text-muted-foreground">
            Valor completo:{" "}
            <code className="rounded bg-muted px-1">www.{bothRaw}.seedgrid.com.br</code>
          </p>
        </div>
        <CodeBlock
          wrapRHF={false}
          code={`import React from "react";
import { useForm } from "react-hook-form";
import { SgInputText } from "@seedgrid/fe-components";

export default function Example() {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: { site: "test.com.br" }
  });

  const onSubmit = (data) => console.log(data);
  const raw = watch("site");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SgInputText
        id="site"
        name="site"
        control={control}
        label="Website"
        prefixText="www."
        suffixText=".seedgrid.com.br"
      />

      {/* Setando valor completo: o input mostra apenas a parte do meio */}
      <button type="button" onClick={() => setValue("site", "www.test.com.br.seedgrid.com.br")}>
        Setar valor externamente
      </button>

      <p>Valor completo: {"www." + raw + ".seedgrid.com.br"}</p>
    </form>
  );
}`}
        />
      </Section>

      {/* â”€â”€ Icon Buttons â”€â”€ */}
      <Section title="Botoes de icone" description="iconButtons recebe um array de ReactNode. Cada elemento e um botao com onClick que voce controla.">
        <div className="w-96 space-y-3">
          <SgInputText
            id="demo-iconbtns"
            label="Texto para copiar"
            onChange={(v) => setIconBtnValue(v)}
            iconButtons={[
              <button
                key="copy"
                type="button"
                className="text-foreground/60 hover:text-primary"
                title="Copiar valor"
                onClick={() => {
                  navigator.clipboard.writeText(iconBtnValue);
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
                  setIconBtnLog((prev) => [`Alerta disparado!`, ...prev].slice(0, 5));
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
        <div className="w-full">
          <p className="mb-2 text-sm font-medium">Como funciona:</p>
          <ul className="mb-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Cada item do array e um <code className="rounded bg-muted px-1">&lt;button&gt;</code> normal com <code className="rounded bg-muted px-1">onClick</code></li>
            <li>Voce controla a acao: copiar, abrir modal, chamar API, etc.</li>
            <li>O componente apenas renderiza os botoes no suffix, ao lado do X de limpar</li>
          </ul>
          <CodeBlock
            wrapRHF={false}
            code={`import React from "react";
import { useForm } from "react-hook-form";
import { SgInputText } from "@seedgrid/fe-components";

export default function Example() {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: { campo: "" }
  });

  const onSubmit = (data) => console.log(data);
  const value = watch("campo");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SgInputText
        id="campo"
        name="campo"
        control={control}
        label="Texto para copiar"
        iconButtons={[
          <button
            key="copy"
            type="button"
            onClick={() => navigator.clipboard.writeText(value)}
          >
            <CopyIcon />
          </button>,
          <button
            key="notify"
            type="button"
            onClick={() => sendNotification(value)}
          >
            <BellIcon />
          </button>
        ]}
      />
    </form>
  );
}`}
          />
        </div>
      </Section>

      {/* ── Sem borda / Filled ── */}
      <Section title="Variacoes visuais" description="Sem borda (withBorder=false) e preenchido (filled=true).">
        <div className="w-80">
          <SgInputText id="demo-noborder" label="Sem borda" withBorder={false} />
        </div>
        <div className="w-80">
          <SgInputText id="demo-filled" label="Preenchido" filled />
        </div>
        <CodeBlock code={`<SgInputText id="a" label="Sem borda" withBorder={false} />
<SgInputText id="b" label="Preenchido" filled />`} />
      </Section>

      {/* ── Sem clear button ── */}
      <Section title="Sem botao limpar" description="clearButton=false remove o X do input.">
        <div className="w-80">
          <SgInputText id="demo-noclear" label="Sem limpar" clearButton={false} />
        </div>
        <CodeBlock code={`<SgInputText id="x" label="Sem limpar" clearButton={false} />`} />
      </Section>

      {/* ── Width / Border Radius ── */}
      <Section title="Largura e borda" description="width e borderRadius customizaveis.">
        <div className="flex gap-4">
          <SgInputText id="demo-w200" label="200px" width={200} />
          <SgInputText id="demo-w300" label="300px arredondado" width={300} borderRadius={20} />
        </div>
        <CodeBlock code={`<SgInputText id="a" label="200px" width={200} />
<SgInputText id="b" label="Arredondado" width={300} borderRadius={20} />`} />
      </Section>

      {/* ── Disabled / ReadOnly ── */}
      <Section title="Desabilitado e somente leitura" description="enabled=false desabilita, readOnly=true impede edicao.">
        <div className="w-80">
          <SgInputText
            id="demo-disabled"
            label="Desabilitado"
            enabled={false}
            inputProps={{ defaultValue: "Nao editavel" }}
          />
        </div>
        <div className="w-80">
          <SgInputText
            id="demo-readonly"
            label="Somente leitura"
            readOnly
            inputProps={{ defaultValue: "Apenas leitura" }}
          />
        </div>
        <CodeBlock code={`<SgInputText id="a" label="Desabilitado" enabled={false} />
<SgInputText id="b" label="Somente leitura" readOnly />`} />
      </Section>

      {/* ── Erro externo ── */}
      <Section title="Erro externo" description="Prop error exibe mensagem de erro vinda do pai (server-side, etc).">
        <div className="w-80">
          <SgInputText
            id="demo-error"
            label="Com erro externo"
            error="Este email ja esta cadastrado."
          />
        </div>
        <CodeBlock code={`<SgInputText
  id="email"
  label="Com erro externo"
  error="Este email ja esta cadastrado."
/>`} />
      </Section>

      {/* ── Callbacks / Events ── */}
      <Section title="Eventos" description="onEnter, onExit, onChange, onClear, onValidation.">
        <div className="w-80">
          <SgInputText
            id="demo-events"
            label="Digite e observe o log"
            required
            onChange={(v) => log(`onChange: "${v}"`)}
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
        <CodeBlock code={`<SgInputText
  id="eventos"
  label="Com eventos"
  required
  onChange={(v) => console.log("onChange:", v)}
  onEnter={() => console.log("focus")}
  onExit={() => console.log("blur")}
  onClear={() => console.log("cleared")}
  onValidation={(msg) => console.log("validation:", msg)}
/>`} />
      </Section>

      {/* ── Props Reference ── */}
      <section className="rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Referencia de Props</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">Prop</th>
                <th className="pb-2 pr-4 font-semibold">Tipo</th>
                <th className="pb-2 pr-4 font-semibold">Padrao</th>
                <th className="pb-2 font-semibold">Descricao</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Obrigatorio. ID do input e vinculo com label.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Texto do floating label.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Alias para label.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Placeholder alternativo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">prefixText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Texto fixo antes do valor (visual + concatenado no valor).</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">suffixText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Texto fixo depois do valor (visual + concatenado no valor).</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">error</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Mensagem de erro externa (sobrescreve validacao interna).</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">type</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">&quot;text&quot;</td><td className="py-2">Tipo HTML do input.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">placeholder</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">labelText</td><td className="py-2">Placeholder do input.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">inputProps</td><td className="py-2 pr-4">InputHTMLAttributes</td><td className="py-2 pr-4">{"{}"}</td><td className="py-2">Props nativas repassadas ao input.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">Limite maximo de caracteres.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">Valida tamanho minimo no blur.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minNumberOfWords</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">Valida quantidade minima de palavras.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">prefixIcon</td><td className="py-2 pr-4">ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Icone a esquerda do input.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">iconButtons</td><td className="py-2 pr-4">ReactNode[]</td><td className="py-2 pr-4">-</td><td className="py-2">Botoes extras no suffix.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">clearButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Exibe botao X para limpar.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">width</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">&quot;100%&quot;</td><td className="py-2">Largura do container.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">-</td><td className="py-2">Border radius customizado.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">filled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Fundo preenchido (bg-muted).</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">withBorder</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Exibe borda ao redor.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enabled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">false desabilita o input.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">readOnly</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Somente leitura.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Campo obrigatorio (valida no blur).</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">requiredMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">&quot;Campo obrigatorio.&quot;</td><td className="py-2">Mensagem quando vazio.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showCharCounter</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Exibe contador de caracteres.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validation</td><td className="py-2 pr-4">(value: string) =&gt; string | null</td><td className="py-2 pr-4">-</td><td className="py-2">Funcao de validacao customizada.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validateOnBlur</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Valida ao perder o foco.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onValidation</td><td className="py-2 pr-4">(msg: string | null) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Callback com resultado da validacao.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(value: string) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Chamado com o valor string a cada mudanca.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onEnter</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Chamado quando o input recebe foco.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onExit</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Chamado quando o input perde foco.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onClear</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Chamado ao clicar no botao limpar.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
