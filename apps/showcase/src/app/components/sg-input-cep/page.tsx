"use client";

import React from "react";
import { SgInputCEP, type ViaCepResponse } from "@seedgrid/fe-components";
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
  const imports = [
    `import React from "react";`,
    `import { useForm } from "react-hook-form";`,
    `import { SgInputCEP } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({\n    defaultValues: { }\n  });\n\n  const log = (msg: string) => console.log(msg);`;

  const bodyIndented = indentCode(body.trim(), 6);

  return `${imports}\n\nexport default function Example() {\n  ${indentCode(setup, 2)}\n\n  return (\n    <form onSubmit={handleSubmit((data) => console.log(data))}>\n${bodyIndented}\n    </form>\n  );\n}`;
}

export default function SgInputCEPPage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const [viaCepResult, setViaCepResult] = React.useState<ViaCepResponse | null>(null);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputCep.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.inputCep.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.inputCep.sections.basic.title")}
        description={t(i18n, "showcase.component.inputCep.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputCEP
            id="demo-basic"
            label={t(i18n, "showcase.component.inputCep.labels.cep")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cepHint")}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: `"${basicValue}"` })}
          </p>
        </div>
        <CodeBlock code={`<SgInputCEP\n  id="cep"\n  label="${t(i18n, "showcase.component.inputCep.labels.cep")}"\n  hintText="${t(i18n, "showcase.component.inputCep.labels.cepHint")}"\n  onChange={(value) => console.log(value)}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputCep.sections.required.title")}
        description={t(i18n, "showcase.component.inputCep.sections.required.description")}
      >
        <div className="w-80">
          <SgInputCEP
            id="demo-required"
            label={t(i18n, "showcase.component.inputCep.labels.required")}
            hintText={t(i18n, "showcase.component.inputCep.labels.requiredHint")}
            required
          />
        </div>
        <div className="w-80">
          <SgInputCEP
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputCep.labels.customMessage")}
            hintText={t(i18n, "showcase.component.inputCep.labels.requiredHint")}
            required
            requiredMessage={t(i18n, "showcase.component.inputCep.messages.required")}
          />
        </div>
        <CodeBlock code={`<SgInputCEP\n  id="cep"\n  label="${t(i18n, "showcase.component.inputCep.labels.required")}"\n  hintText="${t(i18n, "showcase.component.inputCep.labels.requiredHint")}"\n  required\n  requiredMessage="${t(i18n, "showcase.component.inputCep.messages.required")}"\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputCep.sections.length.title")}
        description={t(i18n, "showcase.component.inputCep.sections.length.description")}
      >
        <div className="w-80">
          <SgInputCEP
            id="demo-length"
            label={t(i18n, "showcase.component.inputCep.labels.cep")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cepHint")}
            lengthMessage={t(i18n, "showcase.component.inputCep.messages.length")}
          />
        </div>
        <CodeBlock code={`<SgInputCEP\n  id="cep"\n  label="${t(i18n, "showcase.component.inputCep.labels.cep")}"\n  hintText="${t(i18n, "showcase.component.inputCep.labels.cepHint")}"\n  lengthMessage="${t(i18n, "showcase.component.inputCep.messages.length")}"\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputCep.sections.validation.title")}
        description={t(i18n, "showcase.component.inputCep.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputCEP
            id="demo-validation"
            label={t(i18n, "showcase.component.inputCep.labels.cep")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cepHint")}
            validation={(v) => (v.startsWith("00") ? t(i18n, "showcase.component.inputCep.messages.cannotStart") : null)}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {validationMsg === null
              ? t(i18n, "showcase.common.labels.valid")
              : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputCEP\n  id="cep"\n  label="${t(i18n, "showcase.component.inputCep.labels.cep")}"\n  hintText="${t(i18n, "showcase.component.inputCep.labels.cepHint")}"\n  validation={(v) => (v.startsWith("00") ? "${t(i18n, "showcase.component.inputCep.messages.cannotStart")}" : null)}\n  onValidation={(msg) => console.log(msg)}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputCep.sections.viacep.title")}
        description={t(i18n, "showcase.component.inputCep.sections.viacep.description")}
      >
        <div className="w-80">
          <SgInputCEP
            id="demo-viacep"
            label={t(i18n, "showcase.component.inputCep.labels.cep")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cepHint")}
            validateWithViaCep
            viaCepErrorMessage={t(i18n, "showcase.component.inputCep.messages.viacep")}
            onViaCepResult={(data) => setViaCepResult(data)}
          />
        </div>
        <CodeBlock code={`<SgInputCEP\n  id="cep"\n  label="${t(i18n, "showcase.component.inputCep.labels.cep")}"\n  hintText="${t(i18n, "showcase.component.inputCep.labels.cepHint")}"\n  validateWithViaCep\n  viaCepErrorMessage="${t(i18n, "showcase.component.inputCep.messages.viacep")}"\n  onViaCepResult={(data) => console.log(data)}\n  onValidation={(msg) => console.log(msg)}\n/>`} />
        {viaCepResult ? (
          <div className="mt-3 w-full rounded border border-border bg-foreground/5 p-3 text-xs">
            <div className="mb-2 text-sm font-semibold">{t(i18n, "showcase.component.inputCep.labels.viacepResult")}</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(viaCepResult, null, 2)}</pre>
          </div>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">
          {t(i18n, "showcase.component.inputCep.notes.viacepUnavailable")}
        </p>
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.visual.title")}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputCEP
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cep")}
            withBorder={false}
          />
        </div>
        <div className="w-80">
          <SgInputCEP
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cep")}
            filled
          />
        </div>
        <CodeBlock code={`<SgInputCEP id="a" label="${t(i18n, "showcase.common.labels.noBorder")}" hintText="${t(i18n, "showcase.component.inputCep.labels.cep")}" withBorder={false} />\n<SgInputCEP id="b" label="${t(i18n, "showcase.common.labels.filled")}" hintText="${t(i18n, "showcase.component.inputCep.labels.cep")}" filled />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.noClear.title")}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-80">
          <SgInputCEP
            id="demo-noclear"
            label={t(i18n, "showcase.common.labels.noClear")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cep")}
            clearButton={false}
          />
        </div>
        <CodeBlock code={`<SgInputCEP id="x" label="${t(i18n, "showcase.common.labels.noClear")}" hintText="${t(i18n, "showcase.component.inputCep.labels.cep")}" clearButton={false} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.sizeBorder.title")}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputCEP
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cep")}
            width={200}
          />
          <SgInputCEP
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cep")}
            width={300}
            borderRadius={20}
          />
        </div>
        <CodeBlock code={`<SgInputCEP id="a" label="${t(i18n, "showcase.common.labels.width200")}" hintText="${t(i18n, "showcase.component.inputCep.labels.cep")}" width={200} />\n<SgInputCEP id="b" label="${t(i18n, "showcase.common.labels.width300Rounded")}" hintText="${t(i18n, "showcase.component.inputCep.labels.cep")}" width={300} borderRadius={20} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.disabled.title")}
        description={t(i18n, "showcase.common.sections.disabled.description")}
      >
        <div className="w-80">
          <SgInputCEP
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cep")}
            enabled={false}
            inputProps={{ defaultValue: "00000-000" }}
          />
        </div>
        <CodeBlock code={`<SgInputCEP id="a" label="${t(i18n, "showcase.common.labels.disabled")}" hintText="${t(i18n, "showcase.component.inputCep.labels.cep")}" enabled={false} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.events.title")}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-80">
          <SgInputCEP
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            hintText={t(i18n, "showcase.component.inputCep.labels.cep")}
            required
            onChange={(v) => log(`onChange: "${v}"`)}
            onEnter={() => log(t(i18n, "showcase.component.inputCep.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.inputCep.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.inputCep.logs.onClear"))}
            onValidation={(msg) => log(`onValidation: ${msg ?? t(i18n, "showcase.common.labels.valid")}`)}
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">{t(i18n, "showcase.common.labels.interactHint")}</span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputCEP\n  id="eventos"\n  label="${t(i18n, "showcase.component.inputCep.labels.withEvents")}"\n  hintText="${t(i18n, "showcase.component.inputCep.labels.cep")}"\n  required\n  onChange={(v) => console.log("onChange:", v)}\n  onEnter={() => console.log("focus")}\n  onExit={() => console.log("blur")}\n  onClear={() => console.log("cleared")}\n  onValidation={(msg) => console.log("validation:", msg)}\n/>`} />
      </Section>
    </div>
  );
}
