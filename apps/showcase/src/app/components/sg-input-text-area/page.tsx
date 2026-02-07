"use client";

import React from "react";
import { SgInputTextArea } from "@seedgrid/fe-components";

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
  const matches = code.match(/<SgInputTextArea\b/g) ?? [];
  const count = Math.max(matches.length, 1);
  const names = Array.from({ length: count }, (_, index) => `${baseName}${count > 1 ? index + 1 : ""}`);
  let cursor = 0;
  const withControl = code.replace(/<SgInputTextArea\b/g, () => {
    const name = names[cursor] ?? baseName;
    cursor += 1;
    return `<SgInputTextArea\n  name="${name}"\n  control={control}`;
  });
  const defaults = defaultValues ?? `{ ${names.map((name) => `${name}: ""`).join(", ")} }`;
  return `import React from "react";\nimport { useForm } from "react-hook-form";\nimport { SgInputTextArea } from "@seedgrid/fe-components";\n\nexport default function Example() {\n  const { control, handleSubmit } = useForm({\n    defaultValues: ${defaults}\n  });\n\n  const onSubmit = (data) => console.log(data);\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n${withControl.split("\n").map((line) => (line ? `      ${line}` : "")).join("\n")}\n    </form>\n  );\n}`;
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

export default function SgInputTextAreaPage() {
  const [basicValue, setBasicValue] = React.useState("");
  const [controlledValue, setControlledValue] = React.useState("Texto inicial\nem multiplas linhas");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputTextArea</h1>
        <p className="mt-2 text-muted-foreground">
          Textarea multi-linha com floating label, contagem de caracteres/palavras/linhas e validacao integrada.
          Segue a mesma API do SgInputText adaptada para textarea.
        </p>
      </div>

      {/* ── Basico ── */}
      <Section title="Basico" description="Textarea com floating label e botao limpar (padrao).">
        <div className="w-96">
          <SgInputTextArea
            id="demo-basic"
            label="Descricao"
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">Valor: &quot;{basicValue}&quot;</p>
        </div>
        <CodeBlock code={`<SgInputTextArea
  id="descricao"
  label="Descricao"
  onChange={(value) => console.log(value)}
/>`} />
      </Section>

      {/* ── Required ── */}
      <Section title="Obrigatorio" description="Valida ao perder o foco (validateOnBlur=true por padrao).">
        <div className="w-96">
          <SgInputTextArea
            id="demo-required"
            label="Campo obrigatorio"
            required
          />
        </div>
        <div className="w-96">
          <SgInputTextArea
            id="demo-required-custom"
            label="Mensagem customizada"
            required
            requiredMessage="Preencha este campo!"
          />
        </div>
        <CodeBlock code={`<SgInputTextArea
  id="campo"
  label="Campo obrigatorio"
  required
  requiredMessage="Preencha este campo!"
/>`} />
      </Section>

      {/* ── Controlled ── */}
      <Section title="Controlado" description="Para controlar o valor de fora (setar, limpar, preencher via API), use textareaProps.value + textareaProps.onChange. O estado vive no pai.">
        <div className="w-96 space-y-3">
          <SgInputTextArea
            id="demo-controlled"
            label="Observacoes"
            textareaProps={{
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
              onClick={() => setControlledValue("Texto preenchido via API.\nSegunda linha.")}
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
            <li><code className="rounded bg-muted px-1">textareaProps.value</code> vincula o textarea ao seu estado</li>
            <li><code className="rounded bg-muted px-1">textareaProps.onChange</code> atualiza o estado quando o usuario digita</li>
            <li>Para setar de fora: basta chamar <code className="rounded bg-muted px-1">setValue(&quot;novo texto&quot;)</code></li>
            <li>Para limpar de fora: basta chamar <code className="rounded bg-muted px-1">setValue(&quot;&quot;)</code></li>
          </ul>
          <CodeBlock
            wrapRHF={false}
            code={`import React from "react";
import { useForm } from "react-hook-form";
import { SgInputTextArea } from "@seedgrid/fe-components";

export default function Example() {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: { obs: "" }
  });

  const onSubmit = (data) => console.log(data);
  const value = watch("obs");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SgInputTextArea
        id="obs"
        name="obs"
        control={control}
        label="Observacoes"
      />

      <button type="button" onClick={() => setValue("obs", "Texto via API.\\nSegunda linha.")}>
        Simular preenchimento via API
      </button>

      <button type="button" onClick={() => setValue("obs", "")}>
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
        <div className="w-96">
          <SgInputTextArea
            id="demo-counter"
            label="Maximo 100 caracteres"
            maxLength={100}
            showCharCounter
          />
        </div>
        <CodeBlock code={`<SgInputTextArea
  id="counter"
  label="Maximo 100 caracteres"
  maxLength={100}
  showCharCounter
/>`} />
      </Section>

      {/* ── MinLength ── */}
      <Section title="Tamanho minimo" description="Valida que o texto tem um tamanho minimo ao perder foco.">
        <div className="w-96">
          <SgInputTextArea
            id="demo-minlength"
            label="Minimo 10 caracteres"
            minLength={10}
            showCharCounter
          />
        </div>
        <CodeBlock code={`<SgInputTextArea
  id="min"
  label="Minimo 10 caracteres"
  minLength={10}
  showCharCounter
/>`} />
      </Section>

      {/* ── MinNumberOfWords ── */}
      <Section title="Minimo de palavras" description="Valida quantidade minima de palavras.">
        <div className="w-96">
          <SgInputTextArea
            id="demo-words"
            label="Minimo 5 palavras"
            minNumberOfWords={5}
            minNumberOfWordsMessage="Digite pelo menos 5 palavras."
          />
        </div>
        <CodeBlock code={`<SgInputTextArea
  id="words"
  label="Minimo 5 palavras"
  minNumberOfWords={5}
  minNumberOfWordsMessage="Digite pelo menos 5 palavras."
/>`} />
      </Section>

      {/* ── MinLines ── */}
      <Section title="Minimo de linhas" description="Valida que o texto tem um numero minimo de linhas (quebras de linha). Exclusivo do TextArea.">
        <div className="w-96">
          <SgInputTextArea
            id="demo-minlines"
            label="Minimo 3 linhas"
            minLines={3}
            minLinesMessage="Escreva pelo menos 3 linhas."
          />
        </div>
        <CodeBlock code={`<SgInputTextArea
  id="linhas"
  label="Minimo 3 linhas"
  minLines={3}
  minLinesMessage="Escreva pelo menos 3 linhas."
/>`} />
      </Section>

      {/* ── Custom Validation ── */}
      <Section title="Validacao customizada" description="Funcao de validacao retorna mensagem de erro ou null.">
        <div className="w-96">
          <SgInputTextArea
            id="demo-validation"
            label="Sem numeros"
            validation={(v) =>
              /\d/.test(v) ? "Numeros nao sao permitidos." : null
            }
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            onValidation: {validationMsg === null ? "valido" : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={String.raw`<SgInputTextArea
  id="sem-numeros"
  label="Sem numeros"
  validation={(v) =>
    /\d/.test(v) ? "Numeros nao sao permitidos." : null
  }
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      {/* ── Height + MaxLines ── */}
      <Section title="Altura e linhas visiveis" description="height controla a altura do container. maxLines define o atributo rows do textarea.">
        <div className="w-96">
          <SgInputTextArea
            id="demo-height-small"
            label="Altura 100px, 2 rows"
            height={100}
            maxLines={2}
          />
        </div>
        <div className="w-96">
          <SgInputTextArea
            id="demo-height-large"
            label="Altura 250px, 8 rows"
            height={250}
            maxLines={8}
          />
        </div>
        <CodeBlock code={`// Compacto
<SgInputTextArea
  id="a"
  label="Compacto"
  height={100}
  maxLines={2}
/>

// Expansivo
<SgInputTextArea
  id="b"
  label="Expansivo"
  height={250}
  maxLines={8}
/>`} />
      </Section>

      {/* ── Prefix Icon ── */}
      <Section title="Icone prefixo" description="Icone posicionado no canto superior esquerdo do textarea.">
        <div className="w-96">
          <SgInputTextArea
            id="demo-prefix"
            label="Notas"
            prefixIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
            }
          />
        </div>
        <CodeBlock code={`<SgInputTextArea
  id="notas"
  label="Notas"
  prefixIcon={<PencilIcon />}
/>`} />
      </Section>

      {/* ── Sem borda / Filled ── */}
      <Section title="Variacoes visuais" description="Sem borda (withBorder=false) e preenchido (filled=true).">
        <div className="w-96">
          <SgInputTextArea id="demo-noborder" label="Sem borda" withBorder={false} />
        </div>
        <div className="w-96">
          <SgInputTextArea id="demo-filled" label="Preenchido" filled />
        </div>
        <CodeBlock code={`<SgInputTextArea id="a" label="Sem borda" withBorder={false} />
<SgInputTextArea id="b" label="Preenchido" filled />`} />
      </Section>

      {/* ── Sem clear button ── */}
      <Section title="Sem botao limpar" description="clearButton=false remove o X do textarea.">
        <div className="w-96">
          <SgInputTextArea id="demo-noclear" label="Sem limpar" clearButton={false} />
        </div>
        <CodeBlock code={`<SgInputTextArea id="x" label="Sem limpar" clearButton={false} />`} />
      </Section>

      {/* ── Width / Border Radius ── */}
      <Section title="Largura e borda" description="width e borderRadius customizaveis.">
        <div className="flex gap-4">
          <SgInputTextArea id="demo-w250" label="250px" width={250} />
          <SgInputTextArea id="demo-w350" label="350px arredondado" width={350} borderRadius={16} />
        </div>
        <CodeBlock code={`<SgInputTextArea id="a" label="250px" width={250} />
<SgInputTextArea id="b" label="Arredondado" width={350} borderRadius={16} />`} />
      </Section>

      {/* ── Disabled / ReadOnly ── */}
      <Section title="Desabilitado e somente leitura" description="enabled=false desabilita, readOnly impede edicao via textareaProps.">
        <div className="w-96">
          <SgInputTextArea
            id="demo-disabled"
            label="Desabilitado"
            enabled={false}
            textareaProps={{ defaultValue: "Nao editavel" }}
          />
        </div>
        <div className="w-96">
          <SgInputTextArea
            id="demo-readonly"
            label="Somente leitura"
            textareaProps={{ readOnly: true, defaultValue: "Apenas leitura" }}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea id="a" label="Desabilitado" enabled={false} />
<SgInputTextArea
  id="b"
  label="Somente leitura"
  textareaProps={{ readOnly: true }}
/>`} />
      </Section>

      {/* ── Erro externo ── */}
      <Section title="Erro externo" description="Prop error exibe mensagem de erro vinda do pai (server-side, etc).">
        <div className="w-96">
          <SgInputTextArea
            id="demo-error"
            label="Com erro externo"
            error="Descricao muito curta."
          />
        </div>
        <CodeBlock code={`<SgInputTextArea
  id="desc"
  label="Com erro externo"
  error="Descricao muito curta."
/>`} />
      </Section>

      {/* ── Callbacks / Events ── */}
      <Section title="Eventos" description="onEnter, onExit, onChange, onClear, onValidation.">
        <div className="w-96">
          <SgInputTextArea
            id="demo-events"
            label="Digite e observe o log"
            required
            onChange={(v) => log(`onChange: "${v.replace(/\n/g, "\\n")}"`)}
            onEnter={() => log("onEnter (focus)")}
            onExit={() => log("onExit (blur)")}
            onClear={() => log("onClear")}
            onValidation={(msg) => log(`onValidation: ${msg ?? "valido"}`)}
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">Interaja com o textarea...</span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputTextArea
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
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Obrigatorio. ID do textarea e vinculo com label.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Texto do floating label.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Alias para label.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Placeholder alternativo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">error</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Mensagem de erro externa (sobrescreve validacao interna).</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">textareaProps</td><td className="py-2 pr-4">TextareaHTMLAttributes</td><td className="py-2 pr-4">{"{}"}</td><td className="py-2">Props nativas repassadas ao textarea.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">Limite maximo de caracteres.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxLines</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">4</td><td className="py-2">Numero de linhas visiveis (atributo rows).</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">Valida tamanho minimo no blur.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLines</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">Valida quantidade minima de linhas.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLinesMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">auto</td><td className="py-2">Mensagem de erro para minLines.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minNumberOfWords</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">Valida quantidade minima de palavras.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">prefixIcon</td><td className="py-2 pr-4">ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Icone no canto superior esquerdo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">clearButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Exibe botao X para limpar.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">width</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">&quot;100%&quot;</td><td className="py-2">Largura do container.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">height</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">&quot;150px&quot;</td><td className="py-2">Altura do container.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">-</td><td className="py-2">Border radius customizado.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">filled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Fundo preenchido (bg-muted).</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">withBorder</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Exibe borda ao redor.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enabled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">false desabilita o textarea.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Campo obrigatorio (valida no blur).</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">requiredMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">auto</td><td className="py-2">Mensagem quando vazio.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showCharCounter</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Exibe contador de caracteres.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validation</td><td className="py-2 pr-4">(value: string) =&gt; string | null</td><td className="py-2 pr-4">-</td><td className="py-2">Funcao de validacao customizada.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validateOnBlur</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Valida ao perder o foco.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onValidation</td><td className="py-2 pr-4">(msg: string | null) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Callback com resultado da validacao.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(value: string) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Chamado com o valor string a cada mudanca.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onEnter</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Chamado quando o textarea recebe foco.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onExit</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Chamado quando o textarea perde foco.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onClear</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Chamado ao clicar no botao limpar.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
