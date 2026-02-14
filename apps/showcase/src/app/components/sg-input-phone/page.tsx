"use client";

import React from "react";
import { SgInputPhone } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { getShowcaseI18n, t, useShowcaseI18n } from "../../../i18n";

import { loadSample } from "./samples/loadSample";

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
    `import { SgInputPhone } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({\n    defaultValues: { }\n  });\n\n  const log = (msg: string) => console.log(msg);`;

  const bodyIndented = indentCode(body.trim(), 6);

  return `${imports}\n\nexport default function Example() {\n  ${indentCode(setup, 2)}\n\n  return (\n    <form onSubmit={handleSubmit((data) => console.log(data))}>\n${bodyIndented}\n    </form>\n  );\n}`;
}

export default function SgInputPhonePage() {
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
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputPhone.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.inputPhone.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.inputPhone.sections.basic.title")}
        description={t(i18n, "showcase.component.inputPhone.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-basic"
            label={t(i18n, "showcase.component.inputPhone.labels.phone")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phoneHint")}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: `"${basicValue}"` })}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-phone-example-01.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputPhone.sections.required.title")}
        description={t(i18n, "showcase.component.inputPhone.sections.required.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-required"
            label={t(i18n, "showcase.component.inputPhone.labels.required")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.requiredHint")}
            required
          />
        </div>
        <div className="w-80">
          <SgInputPhone
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputPhone.labels.customMessage")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.requiredHint")}
            required
            requiredMessage={t(i18n, "showcase.component.inputPhone.messages.required")}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-phone-example-02.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputPhone.sections.invalid.title")}
        description={t(i18n, "showcase.component.inputPhone.sections.invalid.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-invalid"
            label={t(i18n, "showcase.component.inputPhone.labels.phone")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phoneHint")}
            invalidMessage={t(i18n, "showcase.component.inputPhone.messages.invalid")}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-phone-example-03.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputPhone.sections.validation.title")}
        description={t(i18n, "showcase.component.inputPhone.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-validation"
            label={t(i18n, "showcase.component.inputPhone.labels.phone")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phoneHint")}
            validation={(v) => (v.startsWith("(00)") ? t(i18n, "showcase.component.inputPhone.messages.dddInvalid") : null)}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {validationMsg === null
              ? t(i18n, "showcase.common.labels.valid")
              : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-phone-example-04.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.visual.title")}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            withBorder={false}
          />
        </div>
        <div className="w-80">
          <SgInputPhone
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            filled
          />
        </div>
        <CodeBlock code={loadSample("sg-input-phone-example-05.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.noClear.title")}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-noclear"
            label={t(i18n, "showcase.common.labels.noClear")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            clearButton={false}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-phone-example-06.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.sizeBorder.title")}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputPhone
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            width={200}
          />
          <SgInputPhone
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            width={300}
            borderRadius={20}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-phone-example-07.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.disabled.title")}
        description={t(i18n, "showcase.common.sections.disabled.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            enabled={false}
            inputProps={{ defaultValue: "(11) 99999-0000" }}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-phone-example-08.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.events.title")}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-80">
          <SgInputPhone
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            hintText={t(i18n, "showcase.component.inputPhone.labels.phone")}
            required
            onChange={(v) => log(`onChange: "${v}"`)}
            onEnter={() => log(t(i18n, "showcase.component.inputPhone.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.inputPhone.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.inputPhone.logs.onClear"))}
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
        <CodeBlock code={loadSample("sg-input-phone-example-09.src")} />
      </Section>
    </div>
  );
}


