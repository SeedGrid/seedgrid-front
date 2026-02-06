"use client";

import React from "react";
import { SgInputCEP } from "@seedgrid/fe-components";

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
  return (
    <pre className="mt-3 rounded-md bg-foreground/5 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
      {props.code}
    </pre>
  );
}

export default function SgInputCEPPage() {
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputCEP</h1>
        <p className="mt-2 text-muted-foreground">
          Input de CEP com máscara e validação de tamanho.
        </p>
      </div>

      <Section title="Basico" description="CEP com label e hint.">
        <div className="w-80">
          <SgInputCEP
            id="demo-basic"
            label="CEP"
            hintText="00000-000"
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">Valor: &quot;{basicValue}&quot;</p>
        </div>
        <CodeBlock code={`<SgInputCEP
  id="cep"
  label="CEP"
  hintText="00000-000"
  onChange={(value) => console.log(value)}
/>`} />
      </Section>

      <Section title="Obrigatorio" description="Valida se esta vazio e mostra mensagem customizada.">
        <div className="w-80">
          <SgInputCEP
            id="demo-required"
            label="CEP obrigatorio"
            hintText="Obrigatorio"
            required
          />
        </div>
        <div className="w-80">
          <SgInputCEP
            id="demo-required-custom"
            label="Mensagem customizada"
            hintText="Obrigatorio"
            required
            requiredMessage="Informe o CEP."
          />
        </div>
        <CodeBlock code={`<SgInputCEP
  id="cep"
  label="CEP obrigatorio"
  hintText="Obrigatorio"
  required
  requiredMessage="Informe o CEP."
/>`} />
      </Section>

      <Section title="Mensagem de tamanho" description="Personaliza mensagem quando CEP não tem 8 dígitos.">
        <div className="w-80">
          <SgInputCEP
            id="demo-length"
            label="CEP"
            hintText="00000-000"
            lengthMessage="CEP deve ter 8 digitos."
          />
        </div>
        <CodeBlock code={`<SgInputCEP
  id="cep"
  label="CEP"
  hintText="00000-000"
  lengthMessage="CEP deve ter 8 digitos."
/>`} />
      </Section>

      <Section title="Validacao customizada" description="Funcao de validacao retorna mensagem ou null.">
        <div className="w-80">
          <SgInputCEP
            id="demo-validation"
            label="CEP"
            hintText="00000-000"
            validation={(v) => (v.startsWith("00") ? "CEP nao pode iniciar com 00." : null)}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            onValidation: {validationMsg === null ? "valido" : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputCEP
  id="cep"
  label="CEP"
  hintText="00000-000"
  validation={(v) => (v.startsWith("00") ? "CEP nao pode iniciar com 00." : null)}
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      <Section title="Variacoes visuais" description="Sem borda (withBorder=false) e preenchido (filled=true).">
        <div className="w-80">
          <SgInputCEP id="demo-noborder" label="Sem borda" hintText="CEP" withBorder={false} />
        </div>
        <div className="w-80">
          <SgInputCEP id="demo-filled" label="Preenchido" hintText="CEP" filled />
        </div>
        <CodeBlock code={`<SgInputCEP id="a" label="Sem borda" hintText="CEP" withBorder={false} />
<SgInputCEP id="b" label="Preenchido" hintText="CEP" filled />`} />
      </Section>

      <Section title="Sem botao limpar" description="clearButton=false remove o X do input.">
        <div className="w-80">
          <SgInputCEP id="demo-noclear" label="Sem limpar" hintText="CEP" clearButton={false} />
        </div>
        <CodeBlock code={`<SgInputCEP id="x" label="Sem limpar" hintText="CEP" clearButton={false} />`} />
      </Section>

      <Section title="Largura e borda" description="width e borderRadius customizaveis.">
        <div className="flex gap-4">
          <SgInputCEP id="demo-w200" label="200px" hintText="CEP" width={200} />
          <SgInputCEP id="demo-w300" label="Arredondado" hintText="CEP" width={300} borderRadius={20} />
        </div>
        <CodeBlock code={`<SgInputCEP id="a" label="200px" hintText="CEP" width={200} />
<SgInputCEP id="b" label="Arredondado" hintText="CEP" width={300} borderRadius={20} />`} />
      </Section>

      <Section title="Desabilitado" description="enabled=false desabilita.">
        <div className="w-80">
          <SgInputCEP
            id="demo-disabled"
            label="Desabilitado"
            hintText="CEP"
            enabled={false}
            inputProps={{ defaultValue: "00000-000" }}
          />
        </div>
        <CodeBlock code={`<SgInputCEP id="a" label="Desabilitado" hintText="CEP" enabled={false} />`} />
      </Section>

      <Section title="Eventos" description="onEnter, onExit, onChange, onClear, onValidation.">
        <div className="w-80">
          <SgInputCEP
            id="demo-events"
            label="Digite e observe o log"
            hintText="CEP"
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
        <CodeBlock code={`<SgInputCEP
  id="eventos"
  label="Com eventos"
  hintText="CEP"
  required
  onChange={(v) => console.log("onChange:", v)}
  onEnter={() => console.log("focus")}
  onExit={() => console.log("blur")}
  onClear={() => console.log("cleared")}
  onValidation={(msg) => console.log("validation:", msg)}
/>`} />
      </Section>
    </div>
  );
}
