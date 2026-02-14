"use client";

import React from "react";
import { SgInputCNPJ } from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../../i18n";
import SgCodeBlockBase from "../others/SgCodeBlockBase";

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
    `import { SgInputCNPJ } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({\n    defaultValues: { }\n  });\n\n  const log = (msg: string) => console.log(msg);`;

  const bodyIndented = indentCode(body.trim(), 6);

  return `${imports}\n\nexport default function Example() {\n  ${indentCode(setup, 2)}\n\n  return (\n    <form onSubmit={handleSubmit((data) => console.log(data))}>\n${bodyIndented}\n    </form>\n  );\n}`;
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
          {t(i18n, "showcase.component.cnpj.i18nNote").split("\n").map((part, idx, arr) => (
            <span key={idx}>
              {part}
              {idx < arr.length - 1 ? <code className="rounded bg-muted px-1">components.*</code> : null}
            </span>
          ))}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.cnpj.sections.basic.title")}
        description={t(i18n, "showcase.component.cnpj.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-basic"
            label={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpjHint")}
            inputProps={{}}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: `\"${basicValue}\"` })}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-01.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.cnpj.sections.alnum.title")}
        description={t(i18n, "showcase.component.cnpj.sections.alnum.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-alnum"
            label={t(i18n, "showcase.component.cnpj.labels.alnum")}
            hintText={t(i18n, "showcase.component.cnpj.labels.alnumHint")}
            inputProps={{ defaultValue: "AB.12C.345/0001-40" }}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-02.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.cnpj.sections.alnumList.title")}
        description={t(i18n, "showcase.component.cnpj.sections.alnumList.description")}
      >
        <CodeBlock
          code={loadSample("sg-input-cnpj-example-03.src")}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.cnpj.sections.publica.title")}
        description={t(i18n, "showcase.component.cnpj.sections.publica.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-publica"
            label={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpjHint")}
            validateWithPublicaCnpj
            publicaCnpjErrorMessage={t(i18n, "showcase.component.cnpj.messages.publicaNotFound")}
            onPublicaCnpjResult={(data) => {
              setPublicaResult(data);
              setPublicaError(null);
            }}
            onPublicaCnpjError={() => setPublicaError(t(i18n, "showcase.component.cnpj.messages.publicaError"))}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-04.src")} />
        {publicaResult ? (
          <div className="mt-3 w-full rounded border border-border bg-foreground/5 p-3 text-xs">
            <div className="mb-2 text-sm font-semibold">{t(i18n, "showcase.component.cnpj.labels.publicaResult")}</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(publicaResult, null, 2)}</pre>
          </div>
        ) : null}
        {publicaError ? (
          <p className="mt-2 text-xs text-muted-foreground">{publicaError}</p>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">
          {t(i18n, "showcase.component.cnpj.notes.publicaUnavailable")}
        </p>
      </Section>

      <Section
        title={t(i18n, "showcase.component.cnpj.sections.required.title")}
        description={t(i18n, "showcase.component.cnpj.sections.required.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-required"
            label={t(i18n, "showcase.component.cnpj.labels.required")}
            hintText={t(i18n, "showcase.component.cnpj.labels.requiredHint")}
            required
            inputProps={{}}
          />
        </div>
        <div className="w-80">
          <SgInputCNPJ
            id="demo-required-custom"
            label={t(i18n, "showcase.component.cnpj.labels.customMessage")}
            hintText={t(i18n, "showcase.component.cnpj.labels.requiredHint")}
            required
            requiredMessage={t(i18n, "showcase.component.cnpj.messages.required")}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-05.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.cnpj.sections.length.title")}
        description={t(i18n, "showcase.component.cnpj.sections.length.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-length"
            label={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpjHint")}
            lengthMessage={t(i18n, "showcase.component.cnpj.messages.length")}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-06.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.cnpj.sections.invalid.title")}
        description={t(i18n, "showcase.component.cnpj.sections.invalid.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-invalid"
            label={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpjHint")}
            invalidMessage={t(i18n, "showcase.component.cnpj.messages.invalid")}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-07.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.cnpj.sections.validation.title")}
        description={t(i18n, "showcase.component.cnpj.sections.validation.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-validation"
            label={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpjHint")}
            validation={(v) => (v.startsWith("00") ? t(i18n, "showcase.component.cnpj.messages.cannotStart") : null)}
            onValidation={(msg) => setValidationMsg(msg)}
            inputProps={{}}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {validationMsg === null
              ? t(i18n, "showcase.common.labels.valid")
              : `\"${validationMsg}\"`}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-08.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.visual.title")}
        description={t(i18n, "showcase.common.sections.visual.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-noborder"
            label={t(i18n, "showcase.common.labels.noBorder")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            withBorder={false}
            inputProps={{}}
          />
        </div>
        <div className="w-80">
          <SgInputCNPJ
            id="demo-filled"
            label={t(i18n, "showcase.common.labels.filled")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            filled
            inputProps={{}}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-09.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.noClear.title")}
        description={t(i18n, "showcase.common.sections.noClear.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-noclear"
            label={t(i18n, "showcase.common.labels.noClear")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            clearButton={false}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-10.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.sizeBorder.title")}
        description={t(i18n, "showcase.common.sections.sizeBorder.description")}
      >
        <div className="flex gap-4">
          <SgInputCNPJ
            id="demo-w200"
            label={t(i18n, "showcase.common.labels.width200")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            width={200}
            inputProps={{}}
          />
          <SgInputCNPJ
            id="demo-w300"
            label={t(i18n, "showcase.common.labels.width300Rounded")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            width={300}
            borderRadius={20}
            inputProps={{}}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-11.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.disabled.title")}
        description={t(i18n, "showcase.common.sections.disabled.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-disabled"
            label={t(i18n, "showcase.common.labels.disabled")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            enabled={false}
            inputProps={{ defaultValue: "00.000.000/0000-00" }}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-cnpj-example-12.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.common.sections.events.title")}
        description={t(i18n, "showcase.common.sections.events.description")}
      >
        <div className="w-80">
          <SgInputCNPJ
            id="demo-events"
            label={t(i18n, "showcase.common.labels.typeAndLog")}
            hintText={t(i18n, "showcase.component.cnpj.labels.cnpj")}
            required
            inputProps={{}}
            onChange={(v) => log(`onChange: \"${v}\"`)}
            onEnter={() => log(t(i18n, "showcase.component.cnpj.logs.onEnter"))}
            onExit={() => log(t(i18n, "showcase.component.cnpj.logs.onExit"))}
            onClear={() => log(t(i18n, "showcase.component.cnpj.logs.onClear"))}
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
        <CodeBlock code={loadSample("sg-input-cnpj-example-13.src")} />
      </Section>
    </div>
  );
}


