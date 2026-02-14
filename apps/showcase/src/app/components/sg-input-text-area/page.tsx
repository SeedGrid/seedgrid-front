"use client";

import React from "react";
import { SgInputTextArea } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
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
    `import { SgInputTextArea } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({\n    defaultValues: { }\n  });\n\n  const log = (msg: string) => console.log(msg);`;

  const bodyIndented = indentCode(body.trim(), 6);

  return `${imports}\n\nexport default function Example() {\n  ${indentCode(setup, 2)}\n\n  return (\n    <form onSubmit={handleSubmit((data) => console.log(data))}>\n${bodyIndented}\n    </form>\n  );\n}`;
}

export default function SgInputTextAreaPage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");
  const [controlledValue, setControlledValue] = React.useState(
    t(i18n, "showcase.component.inputTextArea.defaults.controlled")
  );
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  React.useEffect(() => {
    setControlledValue(t(i18n, "showcase.component.inputTextArea.defaults.controlled"));
  }, [i18n.locale]);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputTextArea.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.inputTextArea.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.basic.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.basic.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-basic"
            label={t(i18n, "showcase.component.inputTextArea.labels.description")}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: basicValue })}
          </p>
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="descricao"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.description")}"\n  onChange={(value) => console.log(value)}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.required.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.required.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-required"
            label={t(i18n, "showcase.component.inputTextArea.labels.requiredField")}
            required
          />
        </div>
        <div className="w-96">
          <SgInputTextArea
            id="demo-required-custom"
            label={t(i18n, "showcase.component.inputTextArea.labels.customMessage")}
            required
            requiredMessage={t(i18n, "showcase.component.inputTextArea.messages.requiredCustom")}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="campo"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.requiredField")}"\n  required\n  requiredMessage="${t(i18n, "showcase.component.inputTextArea.messages.requiredCustom")}"\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.controlled.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.controlled.description")}
      >
        <div className="w-96 space-y-3">
          <SgInputTextArea
            id="demo-controlled"
            label={t(i18n, "showcase.component.inputTextArea.labels.notes")}
            textareaProps={{
              value: controlledValue,
              onChange: (e) => setControlledValue(e.target.value)
            }}
          />
          <p className="text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentState")}: {" "}
            <code className="rounded bg-muted px-1">&quot;{controlledValue}&quot;</code>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded border border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
              onClick={() => setControlledValue(t(i18n, "showcase.component.inputTextArea.values.apiSample"))}
            >
              {t(i18n, "showcase.component.inputTextArea.actions.setApi")}
            </button>
            <button
              className="rounded border px-3 py-1.5 text-sm hover:bg-muted"
              onClick={() => setControlledValue(t(i18n, "showcase.component.inputTextArea.values.otherSample"))}
            >
              {t(i18n, "showcase.component.inputTextArea.actions.setOther")}
            </button>
            <button
              className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              onClick={() => setControlledValue("")}
            >
              {t(i18n, "showcase.component.inputTextArea.actions.clear")}
            </button>
          </div>
        </div>
        <div className="w-full">
          <p className="mb-2 text-sm font-medium">{t(i18n, "showcase.component.inputTextArea.labels.howItWorks")}</p>
          <ul className="mb-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>{t(i18n, "showcase.component.inputTextArea.bullets.controlled.1")}</li>
            <li>{t(i18n, "showcase.component.inputTextArea.bullets.controlled.2")}</li>
            <li>{t(i18n, "showcase.component.inputTextArea.bullets.controlled.3")}</li>
            <li>{t(i18n, "showcase.component.inputTextArea.bullets.controlled.4")}</li>
          </ul>
          <CodeBlock
            code={`import React from "react";\nimport { useForm } from "react-hook-form";\nimport { SgInputTextArea } from "@seedgrid/fe-components";\n\nexport default function Example() {\n  const { control, handleSubmit, setValue, watch } = useForm({\n    defaultValues: { obs: "" }\n  });\n\n  const onSubmit = (data) => console.log(data);\n  const value = watch("obs");\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <SgInputTextArea\n        id="obs"\n        name="obs"\n        control={control}\n        label="${t(i18n, "showcase.component.inputTextArea.labels.notes")}"\n      />\n\n      <button type="button" onClick={() => setValue("obs", "${t(i18n, "showcase.component.inputTextArea.values.apiSample").replace(/\n/g, "\\n")}")}>\n        ${t(i18n, "showcase.component.inputTextArea.actions.setApi")}\n      </button>\n\n      <button type="button" onClick={() => setValue("obs", "")}>\n        ${t(i18n, "showcase.component.inputTextArea.actions.clear")}\n      </button>\n\n      <p>${t(i18n, "showcase.common.labels.currentState")}: "{value}"</p>\n    </form>\n  );\n}`}
          />
        </div>
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.counter.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.counter.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-counter"
            label={t(i18n, "showcase.component.inputTextArea.labels.max100")}
            maxLength={100}
            showCharCounter
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="counter"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.max100")}"\n  maxLength={100}\n  showCharCounter\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.minLength.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.minLength.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-minlength"
            label={t(i18n, "showcase.component.inputTextArea.labels.min10")}
            minLength={10}
            showCharCounter
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="min"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.min10")}"\n  minLength={10}\n  showCharCounter\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.minWords.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.minWords.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-words"
            label={t(i18n, "showcase.component.inputTextArea.labels.min5Words")}
            minNumberOfWords={5}
            minNumberOfWordsMessage={t(i18n, "showcase.component.inputTextArea.messages.min5Words")}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="words"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.min5Words")}"\n  minNumberOfWords={5}\n  minNumberOfWordsMessage="${t(i18n, "showcase.component.inputTextArea.messages.min5Words")}"\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.minLines.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.minLines.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-minlines"
            label={t(i18n, "showcase.component.inputTextArea.labels.min3Lines")}
            minLines={3}
            minLinesMessage={t(i18n, "showcase.component.inputTextArea.messages.min3Lines")}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="linhas"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.min3Lines")}"\n  minLines={3}\n  minLinesMessage="${t(i18n, "showcase.component.inputTextArea.messages.min3Lines")}"\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.validation.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.validation.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-validation"
            label={t(i18n, "showcase.component.inputTextArea.labels.noNumbers")}
            validation={(v) =>
              /\d/.test(v) ? t(i18n, "showcase.component.inputTextArea.messages.noNumbers") : null
            }
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {" "}
            {validationMsg === null ? t(i18n, "showcase.common.labels.valid") : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={String.raw`<SgInputTextArea\n  id="sem-numeros"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.noNumbers")}"\n  validation={(v) =>\n    /\\d/.test(v) ? "${t(i18n, "showcase.component.inputTextArea.messages.noNumbers")}" : null\n  }\n  onValidation={(msg) => console.log(msg)}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.sizeLines.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.sizeLines.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-height-small"
            label={t(i18n, "showcase.component.inputTextArea.labels.heightSmall")}
            height={100}
            maxLines={2}
          />
        </div>
        <div className="w-96">
          <SgInputTextArea
            id="demo-height-large"
            label={t(i18n, "showcase.component.inputTextArea.labels.heightLarge")}
            height={250}
            maxLines={8}
          />
        </div>
        <CodeBlock code={`// ${t(i18n, "showcase.component.inputTextArea.labels.compact")}\n<SgInputTextArea\n  id="a"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.compact")}"\n  height={100}\n  maxLines={2}\n/>\n\n// ${t(i18n, "showcase.component.inputTextArea.labels.expanded")}\n<SgInputTextArea\n  id="b"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.expanded")}"\n  height={250}\n  maxLines={8}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.prefixIcon.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.prefixIcon.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-prefix"
            label={t(i18n, "showcase.component.inputTextArea.labels.notes")}
            prefixIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/></svg>
            }
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="notas"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.notes")}"\n  prefixIcon={<PencilIcon />}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.visual.title")}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-96">
          <SgInputTextArea id="demo-noborder" label={t(i18n, "showcase.common.labels.noBorder")} withBorder={false} />
        </div>
        <div className="w-96">
          <SgInputTextArea id="demo-filled" label={t(i18n, "showcase.common.labels.filled")} filled />
        </div>
        <CodeBlock code={`<SgInputTextArea id="a" label="${t(i18n, "showcase.common.labels.noBorder")}" withBorder={false} />\n<SgInputTextArea id="b" label="${t(i18n, "showcase.common.labels.filled")}" filled />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.noClear.title")}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-96">
          <SgInputTextArea id="demo-noclear" label={t(i18n, "showcase.common.labels.noClear")} clearButton={false} />
        </div>
        <CodeBlock code={`<SgInputTextArea id="x" label="${t(i18n, "showcase.common.labels.noClear")}" clearButton={false} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.sizeBorder.title")}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputTextArea id="demo-w250" label={t(i18n, "showcase.component.inputTextArea.labels.width250")} width={250} />
          <SgInputTextArea id="demo-w350" label={t(i18n, "showcase.component.inputTextArea.labels.width350Rounded")} width={350} borderRadius={16} />
        </div>
        <CodeBlock code={`<SgInputTextArea id="a" label="${t(i18n, "showcase.component.inputTextArea.labels.width250")}" width={250} />\n<SgInputTextArea id="b" label="${t(i18n, "showcase.component.inputTextArea.labels.width350Rounded")}" width={350} borderRadius={16} />`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.disabledReadonly.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.disabledReadonly.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            enabled={false}
            textareaProps={{ defaultValue: t(i18n, "showcase.common.labels.notEditable") }}
          />
        </div>
        <div className="w-96">
          <SgInputTextArea
            id="demo-readonly"
            label={t(i18n, "showcase.component.inputTextArea.labels.readonly")}
            textareaProps={{ readOnly: true, defaultValue: t(i18n, "showcase.component.inputTextArea.defaults.readonly") }}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea id="a" label="${t(i18n, "showcase.common.labels.disabled")}" enabled={false} />\n<SgInputTextArea\n  id="b"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.readonly")}"\n  textareaProps={{ readOnly: true }}\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputTextArea.sections.externalError.title")}
        description={t(i18n, "showcase.component.inputTextArea.sections.externalError.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-error"
            label={t(i18n, "showcase.component.inputTextArea.labels.externalError")}
            error={t(i18n, "showcase.component.inputTextArea.messages.externalError")}
          />
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="desc"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.externalError")}"\n  error="${t(i18n, "showcase.component.inputTextArea.messages.externalError")}"\n/>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.events.title")}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-96">
          <SgInputTextArea
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            required
            onChange={(v) => log(`onChange: "${v.replace(/\n/g, "\\n")}"`)}
            onEnter={() => log(t(i18n, "showcase.component.inputTextArea.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.inputTextArea.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.inputTextArea.logs.onClear"))}
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
              <span className="text-muted-foreground">
                {t(i18n, "showcase.component.inputTextArea.labels.interactHint")}
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock code={`<SgInputTextArea\n  id="eventos"\n  label="${t(i18n, "showcase.component.inputTextArea.labels.withEvents")}"\n  required\n  onChange={(v) => console.log("onChange:", v)}\n  onEnter={() => console.log("${t(i18n, "showcase.component.inputTextArea.logs.onEnter")}")} \n  onExit={() => console.log("${t(i18n, "showcase.component.inputTextArea.logs.onExit")}")} \n  onClear={() => console.log("${t(i18n, "showcase.component.inputTextArea.logs.onClear")}")} \n  onValidation={(msg) => console.log("validation:", msg)}\n/>`} />
      </Section>

      <section className="rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">{t(i18n, "showcase.component.inputTextArea.props.title")}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputTextArea.props.headers.prop")}</th>
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputTextArea.props.headers.type")}</th>
                <th className="pb-2 pr-4 font-semibold">{t(i18n, "showcase.component.inputTextArea.props.headers.default")}</th>
                <th className="pb-2 font-semibold">{t(i18n, "showcase.component.inputTextArea.props.headers.description")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.id")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.label")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">labelText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.labelText")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">hintText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.hintText")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">error</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.error")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">textareaProps</td><td className="py-2 pr-4">TextareaHTMLAttributes</td><td className="py-2 pr-4">{`{}`}</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.textareaProps")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.maxLength")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxLines</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">4</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.maxLines")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLength</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.minLength")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLines</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.minLines")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLinesMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">auto</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.minLinesMessage")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minNumberOfWords</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.minNumberOfWords")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">prefixIcon</td><td className="py-2 pr-4">ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.prefixIcon")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">clearButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.clearButton")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">width</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">"100%"</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.width")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">height</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">"150px"</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.height")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.borderRadius")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">filled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.filled")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">withBorder</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.withBorder")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enabled</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.enabled")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">required</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.required")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">requiredMessage</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">auto</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.requiredMessage")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showCharCounter</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.showCharCounter")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validation</td><td className="py-2 pr-4">(value: string) =&gt; string | null</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.validation")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">validateOnBlur</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.validateOnBlur")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onValidation</td><td className="py-2 pr-4">(msg: string | null) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.onValidation")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(value: string) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.onChange")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onEnter</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.onEnter")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onExit</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.onExit")}</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onClear</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, "showcase.component.inputTextArea.props.rows.onClear")}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


