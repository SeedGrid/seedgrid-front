"use client";

import React from "react";
import { DEFAULT_BLOCKED_EMAIL_DOMAINS, SgInputEmail } from "@seedgrid/fe-components";

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

export default function SgInputEmailPage() {
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputEmail</h1>
        <p className="mt-2 text-muted-foreground">
          Input de email com validação integrada, customização de mensagens e suporte a ícones extras.
        </p>
      </div>

      <Section title="Basico" description="Email com label e hint.">
        <div className="w-80">
          <SgInputEmail
            id="demo-basic"
            label="Email"
            hintText="exemplo@dominio.com"
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">Valor: &quot;{basicValue}&quot;</p>
        </div>
        <CodeBlock code={`<SgInputEmail
  id="email"
  label="Email"
  hintText="exemplo@dominio.com"
  onChange={(value) => console.log(value)}
/>`} />
      </Section>

      <Section title="Obrigatorio" description="Valida se esta vazio e mostra mensagem customizada.">
        <div className="w-80">
          <SgInputEmail
            id="demo-required"
            label="Email obrigatorio"
            hintText="Obrigatorio"
            required
          />
        </div>
        <div className="w-80">
          <SgInputEmail
            id="demo-required-custom"
            label="Mensagem customizada"
            hintText="Obrigatorio"
            required
            requiredMessage="Informe o email."
          />
        </div>
        <CodeBlock code={`<SgInputEmail
  id="email"
  label="Email obrigatorio"
  hintText="Obrigatorio"
  required
  requiredMessage="Informe o email."
/>`} />
      </Section>

      <Section title="Mensagem invalida" description="Personaliza mensagem de email inválido.">
        <div className="w-80">
          <SgInputEmail
            id="demo-invalid"
            label="Email"
            hintText="exemplo@dominio.com"
            invalidMessage="Email invalido."
          />
        </div>
        <CodeBlock code={`<SgInputEmail
  id="email"
  label="Email"
  hintText="exemplo@dominio.com"
  invalidMessage="Email invalido."
/>`} />
      </Section>

      <Section title="Bloqueio de email temporario" description="blockFakeMail=true (padrao) bloqueia dominios descartaveis.">
        <div className="w-80">
          <SgInputEmail
            id="demo-blocked"
            label="Email"
            hintText="exemplo@dominio.com"
          />
        </div>
        <div className="w-80">
          <SgInputEmail
            id="demo-blocked-off"
            label="Sem bloqueio"
            hintText="exemplo@dominio.com"
            blockFakeMail={false}
          />
        </div>
        <CodeBlock code={`<SgInputEmail
  id="email"
  label="Email"
  blockFakeMail={false}
/>`} />
      </Section>

      <Section title="Validacao customizada" description="Funcao de validacao retorna mensagem ou null.">
        <div className="w-80">
          <SgInputEmail
            id="demo-validation"
            label="Somente dominio .com"
            hintText="seu@dominio.com"
            validation={(v) => (v.endsWith(".com") ? null : "Use dominio .com.")}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            onValidation: {validationMsg === null ? "valido" : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputEmail
  id="email"
  label="Somente dominio .com"
  hintText="seu@dominio.com"
  validation={(v) => (v.endsWith(".com") ? null : "Use dominio .com.")}
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      <Section title="Lista bloqueada padrao" description="Dominios bloqueados por default.">
        <CodeBlock code={JSON.stringify({ blockedEmailDomains: DEFAULT_BLOCKED_EMAIL_DOMAINS }, null, 2)} />
      </Section>

      <Section title="Config JSON" description="A aplicacao host pode carregar um JSON e adicionar dominios em runtime.">
        <CodeBlock code={`// Exemplo (app host)
// 1) Coloque o arquivo em public/seedgrid-blocked-email-domains.json
// {
//   "blockedEmailDomains": ["exemplo.com", "teste.com"]
// }
//
// 2) No startup da app:
fetch("/seedgrid-blocked-email-domains.json")
  .then((res) => res.json())
  .then((data) => {
    window.__seedgridBlockedEmailDomains = data.blockedEmailDomains ?? [];
  });`} />
      </Section>

      <Section title="Variacoes visuais" description="Sem borda (withBorder=false) e preenchido (filled=true).">
        <div className="w-80">
          <SgInputEmail id="demo-noborder" label="Sem borda" hintText="Email" withBorder={false} />
        </div>
        <div className="w-80">
          <SgInputEmail id="demo-filled" label="Preenchido" hintText="Email" filled />
        </div>
        <CodeBlock code={`<SgInputEmail id="a" label="Sem borda" hintText="Email" withBorder={false} />
<SgInputEmail id="b" label="Preenchido" hintText="Email" filled />`} />
      </Section>

      <Section title="Sem botao limpar" description="clearButton=false remove o X do input.">
        <div className="w-80">
          <SgInputEmail id="demo-noclear" label="Sem limpar" hintText="Email" clearButton={false} />
        </div>
        <CodeBlock code={`<SgInputEmail id="x" label="Sem limpar" hintText="Email" clearButton={false} />`} />
      </Section>

      <Section title="Largura e borda" description="width e borderRadius customizaveis.">
        <div className="flex gap-4">
          <SgInputEmail id="demo-w200" label="200px" hintText="Email" width={200} />
          <SgInputEmail id="demo-w300" label="Arredondado" hintText="Email" width={300} borderRadius={20} />
        </div>
        <CodeBlock code={`<SgInputEmail id="a" label="200px" hintText="Email" width={200} />
<SgInputEmail id="b" label="Arredondado" hintText="Email" width={300} borderRadius={20} />`} />
      </Section>

      <Section title="Desabilitado" description="enabled=false desabilita.">
        <div className="w-80">
          <SgInputEmail
            id="demo-disabled"
            label="Desabilitado"
            hintText="Email"
            enabled={false}
            inputProps={{ defaultValue: "Nao editavel" }}
          />
        </div>
        <CodeBlock code={`<SgInputEmail id="a" label="Desabilitado" hintText="Email" enabled={false} />`} />
      </Section>

      <Section title="Eventos" description="onEnter, onExit, onChange, onClear, onValidation.">
        <div className="w-80">
          <SgInputEmail
            id="demo-events"
            label="Digite e observe o log"
            hintText="Email"
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
        <CodeBlock code={`<SgInputEmail
  id="eventos"
  label="Com eventos"
  hintText="Email"
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
