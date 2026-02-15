"use client";

import React from "react";
import Link from "next/link";
import { SgInputCPF, SgButton, SgStack } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import BackToTopFab from "../sg-code-block-base/BackToTopFab";
import { t, useShowcaseI18n } from "../../../i18n";

import { loadSample } from "./samples/loadSample";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={props.id} className="rounded-lg border border-border p-6">
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

  const sectionLinks = [
    { href: "#section-basic", label: "1) Básico" },
    { href: "#section-required", label: "2) Required" },
    { href: "#section-length", label: "3) Length" },
    { href: "#section-invalid", label: "4) Invalid" },
    { href: "#section-validation", label: "5) Validation" },
    { href: "#section-visual", label: "6) Visual" },
    { href: "#section-no-clear", label: "7) No Clear" },
    { href: "#section-size-border", label: "8) Size/Border" },
    { href: "#section-disabled", label: "9) Disabled" },
    { href: "#section-events", label: "10) Events" }
  ];

  return (
    <SgStack className="w-full" gap={32}>
      <SgStack id="examples-top" gap={8}>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.cpf.title")}</h1>
        <p className="text-muted-foreground">
          {t(i18n, "showcase.component.cpf.subtitle")}
        </p>
        <SgStack direction="row" gap={8} wrap>
          {sectionLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <SgButton appearance="outline" size="sm">
                {item.label}
              </SgButton>
            </Link>
          ))}
        </SgStack>
      </SgStack>

      <Section
        id="section-basic"
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
        <CodeBlock code={loadSample("sg-input-cpf-example-01.src")} />
      </Section>

      <Section
        id="section-required"
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
        <CodeBlock code={loadSample("sg-input-cpf-example-02.src")} />
      </Section>

      <Section
        id="section-length"
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
        <CodeBlock code={loadSample("sg-input-cpf-example-03.src")} />
      </Section>

      <Section
        id="section-invalid"
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
        <CodeBlock code={loadSample("sg-input-cpf-example-04.src")} />
      </Section>

      <Section
        id="section-validation"
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
        <CodeBlock code={loadSample("sg-input-cpf-example-05.src")} />
      </Section>

      <Section
        id="section-visual"
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
        <CodeBlock code={loadSample("sg-input-cpf-example-06.src")} />
      </Section>

      <Section
        id="section-no-clear"
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
        <CodeBlock code={loadSample("sg-input-cpf-example-07.src")} />
      </Section>

      <Section
        id="section-size-border"
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
        <CodeBlock code={loadSample("sg-input-cpf-example-08.src")} />
      </Section>

      <Section
        id="section-disabled"
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
        <CodeBlock code={loadSample("sg-input-cpf-example-09.src")} />
      </Section>

      <Section
        id="section-events"
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
        <CodeBlock code={loadSample("sg-input-cpf-example-10.src")} />
      </Section>

      <BackToTopFab targetId="examples-top" />
    </SgStack>
  );
}

