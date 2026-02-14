"use client";

import React from "react";
import { SgInputCPF } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

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
  return <SgCodeBlockBase code={content} />;
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
    `import { SgInputCPF } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({\n    defaultValues: { }\n  });\n\n  const log = (msg: string) => console.log(msg);`;

  const bodyIndented = indentCode(body.trim(), 6);

  return `${imports}\n\nexport default function Example() {\n  ${indentCode(setup, 2)}\n\n  return (\n    <form onSubmit={handleSubmit((data) => console.log(data))}>\n${bodyIndented}\n    </form>\n  );\n}`;
}

export default function SgInputCPFPage() {
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
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.cpf.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.cpf.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.cpf.sections.basic.title")}
        description={t(i18n, "showcase.component.cpf.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputCPF
            id="demo-basic"
            label={t(i18n, "showcase.component.cpf.labels.cpf")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpfHint")}
            inputProps={{}}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: `\"${basicValue}\"` })}
          </p>
        </div>
        <CodeBlock code={`<SgInputCPF\n  id="cpf"\n  label="${t(i18n, "showcase.component.cpf.labels.cpf")}"\n  hintText="${t(i18n, "showcase.component.cpf.labels.cpfHint")}"\n  inputProps={{}}\n  onChange={(value) => console.log(value)}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.cpf.sections.required.title")}
        description={t(i18n, "showcase.component.cpf.sections.required.description")}
      >
        <div className="w-80">
          <SgInputCPF
            id="demo-required"
            label={t(i18n, "showcase.component.cpf.labels.required")}
            hintText={t(i18n, "showcase.component.cpf.labels.requiredHint")}
            required
            inputProps={{}}
          />
        </div>
        <div className="w-80">
          <SgInputCPF
            id="demo-required-custom"
            label={t(i18n, "showcase.component.cpf.labels.customMessage")}
            hintText={t(i18n, "showcase.component.cpf.labels.requiredHint")}
            required
            requiredMessage={t(i18n, "showcase.component.cpf.messages.required")}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCPF\n  id="cpf"\n  label="${t(i18n, "showcase.component.cpf.labels.required")}"\n  hintText="${t(i18n, "showcase.component.cpf.labels.requiredHint")}"\n  required\n  requiredMessage="${t(i18n, "showcase.component.cpf.messages.required")}"\n  inputProps={{}}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.cpf.sections.length.title")}
        description={t(i18n, "showcase.component.cpf.sections.length.description")}
      >
        <div className="w-80">
          <SgInputCPF
            id="demo-length"
            label={t(i18n, "showcase.component.cpf.labels.cpf")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpfHint")}
            lengthMessage={t(i18n, "showcase.component.cpf.messages.length")}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCPF\n  id="cpf"\n  label="${t(i18n, "showcase.component.cpf.labels.cpf")}"\n  hintText="${t(i18n, "showcase.component.cpf.labels.cpfHint")}"\n  lengthMessage="${t(i18n, "showcase.component.cpf.messages.length")}"\n  inputProps={{}}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.cpf.sections.invalid.title")}
        description={t(i18n, "showcase.component.cpf.sections.invalid.description")}
      >
        <div className="w-80">
          <SgInputCPF
            id="demo-invalid"
            label={t(i18n, "showcase.component.cpf.labels.cpf")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpfHint")}
            invalidMessage={t(i18n, "showcase.component.cpf.messages.invalid")}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCPF\n  id="cpf"\n  label="${t(i18n, "showcase.component.cpf.labels.cpf")}"\n  hintText="${t(i18n, "showcase.component.cpf.labels.cpfHint")}"\n  invalidMessage="${t(i18n, "showcase.component.cpf.messages.invalid")}"\n  inputProps={{}}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.cpf.sections.validation.title")}
        description={t(i18n, "showcase.component.cpf.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputCPF
            id="demo-validation"
            label={t(i18n, "showcase.component.cpf.labels.cpf")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpfHint")}
            validation={(v) => (v.startsWith("123") ? t(i18n, "showcase.component.cpf.messages.cannotStart") : null)}
            onValidation={(msg) => setValidationMsg(msg)}
            inputProps={{}}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {validationMsg === null
              ? t(i18n, "showcase.common.labels.valid")
              : `\"${validationMsg}\"`}
          </p>
        </div>
        <CodeBlock code={`<SgInputCPF\n  id="cpf"\n  label="${t(i18n, "showcase.component.cpf.labels.cpf")}"\n  hintText="${t(i18n, "showcase.component.cpf.labels.cpfHint")}"\n  validation={(v) => (v.startsWith("123") ? "${t(i18n, "showcase.component.cpf.messages.cannotStart")}" : null)}\n  onValidation={(msg) => console.log(msg)}\n  inputProps={{}}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.visual.title")}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputCPF
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpf")}
            withBorder={false}
            inputProps={{}}
          />
        </div>
        <div className="w-80">
          <SgInputCPF
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpf")}
            filled
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCPF id="a" label="${t(i18n, "showcase.common.labels.noBorder")}" hintText="${t(i18n, "showcase.component.cpf.labels.cpf")}" withBorder={false} inputProps={{}} />\n<SgInputCPF id="b" label="${t(i18n, "showcase.common.labels.filled")}" hintText="${t(i18n, "showcase.component.cpf.labels.cpf")}" filled inputProps={{}} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.noClear.title")}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-80">
          <SgInputCPF
            id="demo-noclear"
            label={t(i18n, "showcase.common.labels.noClear")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpf")}
            clearButton={false}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCPF id="x" label="${t(i18n, "showcase.common.labels.noClear")}" hintText="${t(i18n, "showcase.component.cpf.labels.cpf")}" clearButton={false} inputProps={{}} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.sizeBorder.title")}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputCPF
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpf")}
            width={200}
            inputProps={{}}
          />
          <SgInputCPF
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpf")}
            width={300}
            borderRadius={20}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={`<SgInputCPF id="a" label="${t(i18n, "showcase.common.labels.width200")}" hintText="${t(i18n, "showcase.component.cpf.labels.cpf")}" width={200} inputProps={{}} />\n<SgInputCPF id="b" label="${t(i18n, "showcase.common.labels.width300Rounded")}" hintText="${t(i18n, "showcase.component.cpf.labels.cpf")}" width={300} borderRadius={20} inputProps={{}} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.disabled.title")}
        description={t(i18n, "showcase.common.sections.disabled.description")}
      >
        <div className="w-80">
          <SgInputCPF
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpf")}
            enabled={false}
            inputProps={{ defaultValue: "000.000.000-00" }}
          />
        </div>
        <CodeBlock code={`<SgInputCPF id="a" label="${t(i18n, "showcase.common.labels.disabled")}" hintText="${t(i18n, "showcase.component.cpf.labels.cpf")}" enabled={false} inputProps={{}} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.events.title")}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-80">
          <SgInputCPF
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            hintText={t(i18n, "showcase.component.cpf.labels.cpf")}
            required
            inputProps={{}}
            onChange={(v) => log(`onChange: \"${v}\"`)}
            onEnter={() => log(t(i18n, "showcase.component.cpf.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.cpf.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.cpf.logs.onClear"))}
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
        <CodeBlock code={`<SgInputCPF\n  id="eventos"\n  label="${t(i18n, "showcase.component.cpf.labels.withEvents")}"\n  hintText="${t(i18n, "showcase.component.cpf.labels.cpf")}"\n  required\n  inputProps={{}}\n  onChange={(v) => console.log("onChange:", v)}\n  onEnter={() => console.log("focus")}\n  onExit={() => console.log("blur")}\n  onClear={() => console.log("cleared")}\n  onValidation={(msg) => console.log("validation:", msg)}\n/>`} />
      </Section>
    </div>
  );
}


