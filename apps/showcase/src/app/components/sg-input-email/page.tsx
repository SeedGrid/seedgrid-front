"use client";

import React from "react";
import { DEFAULT_BLOCKED_EMAIL_DOMAINS, SgInputEmail } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

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
    `import { SgInputEmail, DEFAULT_BLOCKED_EMAIL_DOMAINS } from "@seedgrid/fe-components";`
  ].join("\n");

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


export default function SgInputEmailPage() {
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
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputEmail.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.inputEmail.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.inputEmail.sections.basic.title")}
        description={t(i18n, "showcase.component.inputEmail.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-basic"
            label={t(i18n, "showcase.component.inputEmail.labels.email")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.emailHint")}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: basicValue })}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-email-example-01.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputEmail.sections.required.title")}
        description={t(i18n, "showcase.component.inputEmail.sections.required.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-required"
            label={t(i18n, "showcase.component.inputEmail.labels.required")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.requiredHint")}
            required
          />
        </div>
        <div className="w-80">
          <SgInputEmail
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputEmail.labels.customMessage")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.requiredHint")}
            required
            requiredMessage={t(i18n, "showcase.component.inputEmail.messages.required")}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-email-example-02.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputEmail.sections.invalid.title")}
        description={t(i18n, "showcase.component.inputEmail.sections.invalid.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-invalid"
            label={t(i18n, "showcase.component.inputEmail.labels.email")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.emailHint")}
            invalidMessage={t(i18n, "showcase.component.inputEmail.messages.invalid")}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-email-example-03.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputEmail.sections.blocked.title")}
        description={t(i18n, "showcase.component.inputEmail.sections.blocked.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-blocked"
            label={t(i18n, "showcase.component.inputEmail.labels.email")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.emailHint")}
          />
        </div>
        <div className="w-80">
          <SgInputEmail
            id="demo-blocked-off"
            label={t(i18n, "showcase.component.inputEmail.labels.noBlock")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.emailHint")}
            blockFakeMail={false}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-email-example-04.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputEmail.sections.validation.title")}
        description={t(i18n, "showcase.component.inputEmail.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-validation"
            label={t(i18n, "showcase.component.inputEmail.labels.onlyCom")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.domainHint")}
            validation={(v) =>
              v.endsWith(".com") ? null : t(i18n, "showcase.component.inputEmail.messages.onlyCom")
            }
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}:{" "}
            {validationMsg === null ? t(i18n, "showcase.common.labels.valid") : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-email-example-05.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputEmail.sections.blockedList.title")}
        description={t(i18n, "showcase.component.inputEmail.sections.blockedList.description")}
      >
        <div className="w-full overflow-x-auto rounded border border-border bg-foreground/5 p-3 font-mono text-xs">
          {DEFAULT_BLOCKED_EMAIL_DOMAINS.join(", ")}
        </div>
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputEmail.sections.json.title")}
        description={t(i18n, "showcase.component.inputEmail.sections.json.description")}
      >
        <CodeBlock
          code={loadSample("sg-input-email-example-06.src")}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.visual.title")}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            withBorder={false}
          />
        </div>
        <div className="w-80">
          <SgInputEmail
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            filled
          />
        </div>
        <CodeBlock code={loadSample("sg-input-email-example-07.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.noClear.title")}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-noclear"
            label={t(i18n, "showcase.common.labels.noClear")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            clearButton={false}
          />
        </div>
        <CodeBlock
          code={loadSample("sg-input-email-example-08.src")}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.sizeBorder.title")}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputEmail
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            width={200}
          />
          <SgInputEmail
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            width={300}
            borderRadius={20}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-email-example-09.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.disabled.title")}
        description={t(i18n, "showcase.common.sections.disabled.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            enabled={false}
            inputProps={{ defaultValue: t(i18n, "showcase.common.labels.notEditable") }}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-email-example-10.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.events.title")}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-80">
          <SgInputEmail
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            hintText={t(i18n, "showcase.component.inputEmail.labels.email")}
            required
            onChange={(v) => log(`onChange: "${v}"`)}
            onEnter={() => log("onEnter (focus)")}
            onExit={() => log("onExit (blur)")}
            onClear={() => log("onClear")}
            onValidation={(msg) => log(`onValidation: ${msg ?? "valido"}`)}
          />
          <div className="mt-3 h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">
                {t(i18n, "showcase.common.labels.interactHint")}
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={loadSample("sg-input-email-example-11.src")} />
      </Section>
    </div>
  );
}





