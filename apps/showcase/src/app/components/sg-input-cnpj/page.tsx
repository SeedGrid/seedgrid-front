"use client";

import React from "react";
import { SgInputCNPJ } from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../../i18n";
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
    `import { SgInputCNPJ } from "@seedgrid/fe-components";`
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


export default function SgInputCNPJPage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const [publicaResult, setPublicaResult] = React.useState<unknown | null>(null);
  const [publicaError, setPublicaError] = React.useState<string | null>(null);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.cnpj.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.cnpj.subtitle")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(i18n, "showcase.component.cnpj.i18nNote").split("
").map((part, idx, arr) => (
            <span key={idx}>
              {part}
              {idx < arr.length - 1 ? <code className="rounded bg-muted px-1">components.*</code> : null}
            </span>
          ))}
        </p>
      </div>

      <Section title="Basico" description="CNPJ com label e hint.">
        <div className="w-80">
          <SgInputCNPJ
            id="demo-basic"
            label="CNPJ"
            hintText="00.000.000/0000-00"
            inputProps={{}}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">Valor: &quot;{basicValue}&quot;</p>
        </div>
        <CodeBlock code={`<SgInputCNPJ
  id="cnpj"
  label="CNPJ"
  hintText="00.000.000/0000-00"
  inputProps={{}}
  onChange={(value) => console.log(value)}
/>`} />
      </Section>

      <Section title="CNPJ alfanumerico" description="Exemplo com letras (A-Z) no corpo e DVs numericos.">
        <div className="w-80">
          <SgInputCNPJ
            id="demo-alnum"
            label="CNPJ alfanumerico"
            hintText="AB.12C.345/0001-40"
            inputProps={{ defaultValue: "AB.12C.345/0001-40" }}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ
  id="cnpj"
  label="CNPJ alfanumerico"
  hintText="AB.12C.345/0001-40"
  inputProps={{ defaultValue: "AB.12C.345/0001-40" }}
/>`} />
      </Section>

      <Section title="Exemplos validos (alfanumerico)" description="Lista de CNPJs alfanumericos validos.">
        <CodeBlock
          code={`// Filial 0001
9H.SD1.NFA/0001-01  (raw: 9HSD1NFA000101)
LJ.AUX.GU2/0001-40  (raw: LJAUXGU2000140)
GK.1EK.OFE/0001-58  (raw: GK1EKOFE000158)
QF.18A.388/0001-00  (raw: QF18A388000100)
KF.TG0.Z4P/0001-90  (raw: KFTG0Z4P000190)
9P.UO0.1W2/0001-07  (raw: 9PUO01W2000107)
GK.IPC.PIK/0001-52  (raw: GKIPCPIK000152)
11.TYE.JIE/0001-68  (raw: 11TYEJIE000168)
J1.KBD.U64/0001-09  (raw: J1KBDU64000109)
L2.WTW.2N8/0001-06  (raw: L2WTW2N8000106)
J0.KBM.EUL/0001-05  (raw: J0KBMEUL000105)
ZQ.V25.1CK/0001-33  (raw: ZQV251CK000133)

// Filial 0002
B4.TMM.Q8D/0002-24  (raw: B4TMMQ8D000224)
79.B4O.GMG/0002-50  (raw: 79B4OGMG000250)
DN.FP6.V2Z/0002-05  (raw: DNFP6V2Z000205)
RY.JCA.S6R/0002-68  (raw: RYJCAS6R000268)
IW.UJ6.3BG/0002-46  (raw: IWUJ63BG000246)
OW.R9D.U0T/0002-96  (raw: OWR9DU0T000296)`}
        />
      </Section>

      <Section title="Validacao Publica CNPJ" description="Consulta publica.cnpj.ws para verificar se o CNPJ existe.">
        <div className="w-80">
          <SgInputCNPJ
            id="demo-publica"
            label="CNPJ"
            hintText="00.000.000/0000-00"
            validateWithPublicaCnpj
            publicaCnpjErrorMessage="CNPJ nao encontrado."
            onPublicaCnpjResult={(data) => {
              setPublicaResult(data);
              setPublicaError(null);
            }}
            onPublicaCnpjError={() => setPublicaError("Falha ao consultar API.")}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ
  id="cnpj"
  label="CNPJ"
  hintText="00.000.000/0000-00"
  validateWithPublicaCnpj
  publicaCnpjErrorMessage="CNPJ nao encontrado."
  onPublicaCnpjResult={(data) => console.log(data)}
  onPublicaCnpjError={(error) => console.log(error)}
  inputProps={{}}
/>`} />
        {publicaResult ? (
          <div className="mt-3 w-full rounded border border-border bg-foreground/5 p-3 text-xs">
            <div className="mb-2 text-sm font-semibold">Resultado Publica CNPJ</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(publicaResult, null, 2)}</pre>
          </div>
        ) : null}
        {publicaError ? (
          <p className="mt-2 text-xs text-muted-foreground">{publicaError}</p>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">
          Se a API estiver fora do ar, o componente nao bloqueia o usuario.
        </p>
      </Section>
      <Section title="Obrigatorio" description="Valida se esta vazio e mostra mensagem customizada.">
        <div className="w-80">
          <SgInputCNPJ
            id="demo-required"
            label="CNPJ obrigatorio"
            hintText="Obrigatorio"
            required
            inputProps={{}}
          />
        </div>
        <div className="w-80">
          <SgInputCNPJ
            id="demo-required-custom"
            label="Mensagem customizada"
            hintText="Obrigatorio"
            required
            requiredMessage="Informe o CNPJ."
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ
  id="cnpj"
  label="CNPJ obrigatorio"
  hintText="Obrigatorio"
  required
  requiredMessage="Informe o CNPJ."
  inputProps={{}}
/>`} />
      </Section>

      <Section title="Mensagem de tamanho" description="Personaliza mensagem quando CNPJ nao tem 14 digitos.">
        <div className="w-80">
          <SgInputCNPJ
            id="demo-length"
            label="CNPJ"
            hintText="00.000.000/0000-00"
            lengthMessage="CNPJ deve ter 14 digitos."
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ
  id="cnpj"
  label="CNPJ"
  hintText="00.000.000/0000-00"
  lengthMessage="CNPJ deve ter 14 digitos."
  inputProps={{}}
/>`} />
      </Section>

      <Section title="Mensagem invalida" description="Personaliza mensagem de CNPJ invalido.">
        <div className="w-80">
          <SgInputCNPJ
            id="demo-invalid"
            label="CNPJ"
            hintText="00.000.000/0000-00"
            invalidMessage="CNPJ invalido."
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ
  id="cnpj"
  label="CNPJ"
  hintText="00.000.000/0000-00"
  invalidMessage="CNPJ invalido."
  inputProps={{}}
/>`} />
      </Section>

      <Section title="Validacao customizada" description="Funcao de validacao retorna mensagem ou null.">
        <div className="w-80">
          <SgInputCNPJ
            id="demo-validation"
            label="CNPJ"
            hintText="00.000.000/0000-00"
            validation={(v) => (v.startsWith("00") ? "CNPJ nao pode iniciar com 00." : null)}
            onValidation={(msg) => setValidationMsg(msg)}
            inputProps={{}}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            onValidation: {validationMsg === null ? "valido" : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputCNPJ
  id="cnpj"
  label="CNPJ"
  hintText="00.000.000/0000-00"
  validation={(v) => (v.startsWith("00") ? "CNPJ nao pode iniciar com 00." : null)}
  onValidation={(msg) => console.log(msg)}
  inputProps={{}}
/>`} />
      </Section>

      <Section title="Variacoes visuais" description="Sem borda (withBorder=false) e preenchido (filled=true).">
        <div className="w-80">
          <SgInputCNPJ id="demo-noborder" label="Sem borda" hintText="CNPJ" withBorder={false} inputProps={{}} />
        </div>
        <div className="w-80">
          <SgInputCNPJ id="demo-filled" label="Preenchido" hintText="CNPJ" filled inputProps={{}} />
        </div>
        <CodeBlock code={`<SgInputCNPJ id="a" label="Sem borda" hintText="CNPJ" withBorder={false} inputProps={{}} />
<SgInputCNPJ id="b" label="Preenchido" hintText="CNPJ" filled inputProps={{}} />`} />
      </Section>

      <Section title="Sem botao limpar" description="clearButton=false remove o X do input.">
        <div className="w-80">
          <SgInputCNPJ id="demo-noclear" label="Sem limpar" hintText="CNPJ" clearButton={false} inputProps={{}} />
        </div>
        <CodeBlock code={`<SgInputCNPJ id="x" label="Sem limpar" hintText="CNPJ" clearButton={false} inputProps={{}} />`} />
      </Section>

      <Section title="Largura e borda" description="width e borderRadius customizaveis.">
        <div className="flex gap-4">
          <SgInputCNPJ id="demo-w200" label="200px" hintText="CNPJ" width={200} inputProps={{}} />
          <SgInputCNPJ id="demo-w300" label="Arredondado" hintText="CNPJ" width={300} borderRadius={20} inputProps={{}} />
        </div>
        <CodeBlock code={`<SgInputCNPJ id="a" label="200px" hintText="CNPJ" width={200} inputProps={{}} />
<SgInputCNPJ id="b" label="Arredondado" hintText="CNPJ" width={300} borderRadius={20} inputProps={{}} />`} />
      </Section>

      <Section title="Desabilitado" description="enabled=false desabilita.">
        <div className="w-80">
          <SgInputCNPJ
            id="demo-disabled"
            label="Desabilitado"
            hintText="CNPJ"
            enabled={false}
            inputProps={{ defaultValue: "00.000.000/0000-00" }}
          />
        </div>
        <CodeBlock code={`<SgInputCNPJ id="a" label="Desabilitado" hintText="CNPJ" enabled={false} inputProps={{}} />`} />
      </Section>

      <Section title="Eventos" description="onEnter, onExit, onChange, onClear, onValidation.">
        <div className="w-80">
          <SgInputCNPJ
            id="demo-events"
            label="Digite e observe o log"
            hintText="CNPJ"
            required
            inputProps={{}}
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
        <CodeBlock code={`<SgInputCNPJ
  id="eventos"
  label="Com eventos"
  hintText="CNPJ"
  required
  inputProps={{}}
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
