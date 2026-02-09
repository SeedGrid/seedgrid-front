"use client";

import React from "react";
import { SgInputPassword } from "@seedgrid/fe-components";
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
  return <CodeBlockBase code={wrapFullExample(props.code)} />;
}

function indentCode(source: string, spaces: number) {
  const pad = " ".repeat(spaces);
  return source
    .split("
")
    .map((line) => (line.length ? `${pad}${line}` : line))
    .join("
");
}

function wrapFullExample(body: string) {
  const imports = [
    `import React from "react";`,
    `import { useForm } from "react-hook-form";`,
    `import { SgInputPassword } from "@seedgrid/fe-components";`
  ].join("
");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: { }
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


export default function SgInputPasswordPage() {
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgInputPassword</h1>
        <p className="mt-2 text-muted-foreground">
          Input de senha com toggle de visibilidade, validacao customizada, botao limpar e contador.
        </p>
      </div>

      <Section title="Basico" description="Senha com label, hint e toggle de visibilidade.">
        <div className="w-80">
          <SgInputPassword
            id="demo-basic"
            label="Senha"
            hintText="Digite sua senha"
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">Valor: &quot;{basicValue}&quot;</p>
        </div>
        <CodeBlock code={`<SgInputPassword
  id="senha"
  label="Senha"
  hintText="Digite sua senha"
  onChange={(value) => console.log(value)}
/>`} />
      </Section>

      <Section title="Obrigatorio" description="Valida se esta vazio e mostra mensagem customizada.">
        <div className="w-80">
          <SgInputPassword
            id="demo-required"
            label="Senha obrigatoria"
            hintText="Obrigatorio"
            required
          />
        </div>
        <div className="w-80">
          <SgInputPassword
            id="demo-required-custom"
            label="Mensagem customizada"
            hintText="Obrigatorio"
            required
            requiredMessage="Informe a senha."
          />
        </div>
        <CodeBlock code={`<SgInputPassword
  id="senha"
  label="Senha obrigatoria"
  hintText="Obrigatorio"
  required
  requiredMessage="Informe a senha."
/>`} />
      </Section>

      <Section title="Validacao customizada" description="Funcao de validacao retorna mensagem ou null.">
        <div className="w-80">
          <SgInputPassword
            id="demo-validation"
            label="Minimo 8"
            hintText="Minimo 8 caracteres"
            validation={(v) =>
              v.length < 8 ? "Senha precisa ter no minimo 8 caracteres." : null
            }
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            onValidation: {validationMsg === null ? "valido" : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputPassword
  id="senha"
  label="Minimo 8"
  hintText="Minimo 8 caracteres"
  validation={(v) =>
    v.length < 8 ? "Senha precisa ter no minimo 8 caracteres." : null
  }
  onValidation={(msg) => console.log(msg)}
/>`} />
      </Section>

      <Section title="Regras configuraveis" description="Exemplo com regras desativadas.">
        <div className="w-80">
          <SgInputPassword
            id="demo-rules-off"
            label="Senha simples"
            hintText="Sem regras extras"
            upperRequired={false}
            lowerRequired={false}
            numberRequired={false}
            specialCharacterRequired={false}
            prohibitsRepeatedCharactersInSequence={false}
            prohibitsSequentialAscCharacters={false}
            prohibitsSequentialDescCharacters={false}
            minSize={4}
          />
        </div>
        <CodeBlock code={`<SgInputPassword
  id="senha"
  label="Senha simples"
  hintText="Sem regras extras"
  upperRequired={false}
  lowerRequired={false}
  numberRequired={false}
  specialCharacterRequired={false}
  prohibitsRepeatedCharactersInSequence={false}
  prohibitsSequentialAscCharacters={false}
  prohibitsSequentialDescCharacters={false}
  minSize={4}
/>`} />
      </Section>

      <Section title="Senha comum" description="Trata senha comum como erro.">
        <div className="w-80">
          <SgInputPassword
            id="demo-common-error"
            label="Senha comum (erro)"
            hintText="Ex: Senha1234"
            commonPasswordCheck
          />
        </div>
        <CodeBlock code={`<SgInputPassword
  id="senha"
  label="Senha comum (erro)"
  hintText="Ex: Senha1234"
  commonPasswordCheck
/>`} />
      </Section>

      <Section title="Gerador de senha" description="Botao para criar senha conforme regras.">
        <div className="w-80">
          <SgInputPassword
            id="demo-generate"
            label="Senha segura"
            hintText="Clique para gerar"
            createNewPasswordButton
            minSize={10}
            showStrengthBar
          />
        </div>
        <CodeBlock code={`<SgInputPassword
  id="senha"
  label="Senha segura"
  hintText="Clique para gerar"
  createNewPasswordButton
  minSize={10}
  showStrengthBar
/>`} />
      </Section>

      <Section title="Contador de caracteres" description="Limita e exibe contagem.">
        <div className="w-80">
          <SgInputPassword
            id="demo-counter"
            label="Maximo 12"
            hintText="Até 12 caracteres"
            maxLength={12}
            showCharCounter
          />
        </div>
        <CodeBlock code={`<SgInputPassword
  id="senha"
  label="Maximo 12"
  hintText="Até 12 caracteres"
  maxLength={12}
  showCharCounter
/>`} />
      </Section>

      <Section title="Variacoes visuais" description="Sem borda (withBorder=false) e preenchido (filled=true).">
        <div className="w-80">
          <SgInputPassword id="demo-noborder" label="Sem borda" hintText="Senha" withBorder={false} />
        </div>
        <div className="w-80">
          <SgInputPassword id="demo-filled" label="Preenchido" hintText="Senha" filled />
        </div>
        <CodeBlock code={`<SgInputPassword id="a" label="Sem borda" hintText="Senha" withBorder={false} />
<SgInputPassword id="b" label="Preenchido" hintText="Senha" filled />`} />
      </Section>

      <Section title="Sem botao limpar" description="clearButton=false remove o X do input.">
        <div className="w-80">
          <SgInputPassword id="demo-noclear" label="Sem limpar" hintText="Senha" clearButton={false} />
        </div>
        <CodeBlock code={`<SgInputPassword id="x" label="Sem limpar" hintText="Senha" clearButton={false} />`} />
      </Section>

      <Section title="Largura e borda" description="width e borderRadius customizaveis.">
        <div className="flex gap-4">
          <SgInputPassword id="demo-w200" label="200px" hintText="Senha" width={200} />
          <SgInputPassword id="demo-w300" label="Arredondado" hintText="Senha" width={300} borderRadius={20} />
        </div>
        <CodeBlock code={`<SgInputPassword id="a" label="200px" hintText="Senha" width={200} />
<SgInputPassword id="b" label="Arredondado" hintText="Senha" width={300} borderRadius={20} />`} />
      </Section>

      <Section title="Desabilitado" description="enabled=false desabilita.">
        <div className="w-80">
          <SgInputPassword
            id="demo-disabled"
            label="Desabilitado"
            hintText="Senha"
            enabled={false}
            inputProps={{ defaultValue: "Nao editavel" }}
          />
        </div>
        <CodeBlock code={`<SgInputPassword id="a" label="Desabilitado" hintText="Senha" enabled={false} />`} />
      </Section>

      <Section title="Eventos" description="onEnter, onExit, onChange, onClear, onValidation.">
        <div className="w-80">
          <SgInputPassword
            id="demo-events"
            label="Digite e observe o log"
            hintText="Senha"
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
        <CodeBlock code={`<SgInputPassword
  id="eventos"
  label="Com eventos"
  hintText="Senha"
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
