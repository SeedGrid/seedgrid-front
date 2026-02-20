"use client";

import React from "react";
import Link from "next/link";
import { SgInputPassword } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import { getShowcaseI18n, t, useShowcaseI18n } from "../../../i18n";

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
  const i18n = getShowcaseI18n();
  const imports = [
    `import React from "react";`,
    `import { useForm } from "react-hook-form";`,
    `import { SgInputPassword } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({\n    defaultValues: { }\n  });\n\n  const log = (msg: string) => console.log(msg);`;

  const bodyIndented = indentCode(body.trim(), 6);

  return `${imports}\n\nexport default function Example() {\n  ${indentCode(setup, 2)}\n\n  return (\n    <form onSubmit={handleSubmit((data) => console.log(data))}>\n${bodyIndented}\n    </form>\n  );\n}`;
}

export default function SgInputPasswordPage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputPassword.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.inputPassword.subtitle")}
        </p>
        <div className="mt-3">
          <Link
            href="#props-reference"
            className="inline-flex rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
          >
            Props Reference
          </Link>
        </div>
      </div>

      <Section
        title={t(i18n, "showcase.component.inputPassword.sections.basic.title")}
        description={t(i18n, "showcase.component.inputPassword.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-basic"
            label={t(i18n, "showcase.component.inputPassword.labels.password")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.passwordHint")}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: basicValue })}
          </p>
        </div>
        <CodeBlock code={`<SgInputPassword\n  id="senha"\n  label="${t(i18n, "showcase.component.inputPassword.labels.password")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.passwordHint")}"\n  onChange={(value) => console.log(value)}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputPassword.sections.required.title")}
        description={t(i18n, "showcase.component.inputPassword.sections.required.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-required"
            label={t(i18n, "showcase.component.inputPassword.labels.requiredPassword")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.requiredHint")}
            required
          />
        </div>
        <div className="w-80">
          <SgInputPassword
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputPassword.labels.customMessage")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.requiredHint")}
            required
            requiredMessage={t(i18n, "showcase.component.inputPassword.messages.required")}
          />
        </div>
        <CodeBlock code={`<SgInputPassword\n  id="senha"\n  label="${t(i18n, "showcase.component.inputPassword.labels.requiredPassword")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.requiredHint")}"\n  required\n  requiredMessage="${t(i18n, "showcase.component.inputPassword.messages.required")}"\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputPassword.sections.validation.title")}
        description={t(i18n, "showcase.component.inputPassword.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-validation"
            label={t(i18n, "showcase.component.inputPassword.labels.min8")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.min8Hint")}
            validation={(v) =>
              v.length < 8 ? t(i18n, "showcase.component.inputPassword.messages.min8") : null
            }
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {" "}
            {validationMsg === null ? t(i18n, "showcase.common.labels.valid") : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputPassword\n  id="senha"\n  label="${t(i18n, "showcase.component.inputPassword.labels.min8")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.min8Hint")}"\n  validation={(v) =>\n    v.length < 8 ? "${t(i18n, "showcase.component.inputPassword.messages.min8")}" : null\n  }\n  onValidation={(msg) => console.log(msg)}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputPassword.sections.rules.title")}
        description={t(i18n, "showcase.component.inputPassword.sections.rules.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-rules-off"
            label={t(i18n, "showcase.component.inputPassword.labels.simple")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.simpleHint")}
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
        <CodeBlock code={`<SgInputPassword\n  id="senha"\n  label="${t(i18n, "showcase.component.inputPassword.labels.simple")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.simpleHint")}"\n  upperRequired={false}\n  lowerRequired={false}\n  numberRequired={false}\n  specialCharacterRequired={false}\n  prohibitsRepeatedCharactersInSequence={false}\n  prohibitsSequentialAscCharacters={false}\n  prohibitsSequentialDescCharacters={false}\n  minSize={4}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputPassword.sections.common.title")}
        description={t(i18n, "showcase.component.inputPassword.sections.common.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-common-error"
            label={t(i18n, "showcase.component.inputPassword.labels.common")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.commonHint")}
            commonPasswordCheck
          />
        </div>
        <CodeBlock code={`<SgInputPassword\n  id="senha"\n  label="${t(i18n, "showcase.component.inputPassword.labels.common")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.commonHint")}"\n  commonPasswordCheck\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputPassword.sections.generator.title")}
        description={t(i18n, "showcase.component.inputPassword.sections.generator.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-generate"
            label={t(i18n, "showcase.component.inputPassword.labels.strong")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.generateHint")}
            createNewPasswordButton
            minSize={10}
            showStrengthBar
          />
        </div>
        <CodeBlock code={`<SgInputPassword\n  id="senha"\n  label="${t(i18n, "showcase.component.inputPassword.labels.strong")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.generateHint")}"\n  createNewPasswordButton\n  minSize={10}\n  showStrengthBar\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputPassword.sections.counter.title")}
        description={t(i18n, "showcase.component.inputPassword.sections.counter.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-counter"
            label={t(i18n, "showcase.component.inputPassword.labels.max12")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.max12Hint")}
            maxLength={12}
            showCharCounter
          />
        </div>
        <CodeBlock code={`<SgInputPassword\n  id="senha"\n  label="${t(i18n, "showcase.component.inputPassword.labels.max12")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.max12Hint")}"\n  maxLength={12}\n  showCharCounter\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.visual.title")}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.password")}
            withBorder={false}
          />
        </div>
        <div className="w-80">
          <SgInputPassword
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.password")}
            filled
          />
        </div>
        <CodeBlock code={`<SgInputPassword id="a" label="${t(i18n, "showcase.common.labels.noBorder")}" hintText="${t(i18n, "showcase.component.inputPassword.labels.password")}" withBorder={false} />\n<SgInputPassword id="b" label="${t(i18n, "showcase.common.labels.filled")}" hintText="${t(i18n, "showcase.component.inputPassword.labels.password")}" filled />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.noClear.title")}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-noclear"
            label={t(i18n, "showcase.common.labels.noClear")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.password")}
            clearButton={false}
          />
        </div>
        <CodeBlock code={`<SgInputPassword id="x" label="${t(i18n, "showcase.common.labels.noClear")}" hintText="${t(i18n, "showcase.component.inputPassword.labels.password")}" clearButton={false} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.sizeBorder.title")}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputPassword
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.password")}
            width={200}
          />
          <SgInputPassword
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.password")}
            width={300}
            borderRadius={20}
          />
        </div>
        <CodeBlock code={`<SgInputPassword id="a" label="${t(i18n, "showcase.common.labels.width200")}" hintText="${t(i18n, "showcase.component.inputPassword.labels.password")}" width={200} />\n<SgInputPassword id="b" label="${t(i18n, "showcase.common.labels.width300Rounded")}" hintText="${t(i18n, "showcase.component.inputPassword.labels.password")}" width={300} borderRadius={20} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputPassword.sections.disabled.title")}
        description={t(i18n, "showcase.component.inputPassword.sections.disabled.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.password")}
            enabled={false}
            inputProps={{ defaultValue: t(i18n, "showcase.common.labels.notEditable") }}
          />
        </div>
        <CodeBlock code={`<SgInputPassword id="a" label="${t(i18n, "showcase.common.labels.disabled")}" hintText="${t(i18n, "showcase.component.inputPassword.labels.password")}" enabled={false} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.events.title")}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-80">
          <SgInputPassword
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            hintText={t(i18n, "showcase.component.inputPassword.labels.password")}
            required
            onChange={(v) => log(`onChange: "${v}"`)}
            onEnter={() => log(t(i18n, "showcase.component.inputPassword.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.inputPassword.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.inputPassword.logs.onClear"))}
            onValidation={(msg) =>
              log(
                `${t(i18n, "showcase.common.labels.onValidation")}: ${
                  msg ?? t(i18n, "showcase.common.labels.valid")
                }`
              )
            }
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">{t(i18n, "showcase.common.labels.interactHint")}</span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputPassword\n  id="eventos"\n  label="${t(i18n, "showcase.common.labels.typeAndLog")}"\n  hintText="${t(i18n, "showcase.component.inputPassword.labels.password")}"\n  required\n  onChange={(v) => console.log("onChange:", v)}\n  onEnter={() => console.log("${t(i18n, "showcase.component.inputPassword.logs.onEnter")}")}\n  onExit={() => console.log("${t(i18n, "showcase.component.inputPassword.logs.onExit")}")}\n  onClear={() => console.log("${t(i18n, "showcase.component.inputPassword.logs.onClear")}")}\n  onValidation={(msg) => console.log("validation:", msg)}\n/>`} />
      </Section>

      <section id="props-reference" className="scroll-mt-72 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Referência de Props</h2>
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
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Identificador do campo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label / hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Textos de label e dica.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required / requiredMessage</td><td className="py-2 pr-4">boolean / string</td><td className="py-2 pr-4">false / auto</td><td className="py-2">Validação de campo obrigatório.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validation / onValidation</td><td className="py-2 pr-4">functions</td><td className="py-2 pr-4">-</td><td className="py-2">Validação customizada e callback.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">Limite de tamanho.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">hidePassword</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Define se inicia oculto.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">createNewPasswordButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Exibe botão para gerar senha.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showStrengthBar</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Exibe barra de força.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">commonPasswordCheck</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Bloqueia senhas comuns.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">commonPasswordMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">auto</td><td className="py-2">Mensagem para senha comum.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minSize</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">8</td><td className="py-2">Tamanho mínimo da senha.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">upperRequired / lowerRequired / numberRequired / specialCharacterRequired</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Regras de composição da senha.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">prohibitsRepeatedCharactersInSequence</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Bloqueia caracteres repetidos sequenciais.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">prohibitsSequentialAscCharacters / prohibitsSequentialDescCharacters</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Bloqueia sequências crescentes/decrescentes.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">clearButton / enabled / readOnly / withBorder / filled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">varia</td><td className="py-2">Controle visual e interação.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">width / borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">100% / -</td><td className="py-2">Dimensão e borda.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange / onEnter / onExit / onClear</td><td className="py-2 pr-4">callbacks</td><td className="py-2 pr-4">-</td><td className="py-2">Eventos do componente.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
