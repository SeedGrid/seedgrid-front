"use client";

import React from "react";
import { SgInputPassword } from "@seedgrid/fe-components";
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
        <CodeBlock code={loadSample("sg-input-password-example-01.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-02.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-03.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-04.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-05.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-06.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-07.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-08.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-09.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-10.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-11.src")} />
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
        <CodeBlock code={loadSample("sg-input-password-example-12.src")} />
      </Section>
    </div>
  );
}


