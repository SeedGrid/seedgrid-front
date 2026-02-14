"use client";

import React from "react";
import { SgInputDate } from "@seedgrid/fe-components";
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
    `import { SgInputDate } from "@seedgrid/fe-components";`
  ].join("\n");

  const setup = `const { register, control, handleSubmit, watch, setValue } = useForm({\n    defaultValues: { }\n  });\n\n  const log = (msg: string) => console.log(msg);`;

  const bodyIndented = indentCode(body.trim(), 6);

  return `${imports}\n\nexport default function Example() {\n  ${indentCode(setup, 2)}\n\n  return (\n    <form onSubmit={handleSubmit((data) => console.log(data))}>\n${bodyIndented}\n    </form>\n  );\n}`;
}

export default function SgInputDatePage() {
  const i18n = useShowcaseI18n();
  const [basicValue, setBasicValue] = React.useState("");

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputDate.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.inputDate.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.inputDate.sections.basic.title")}
        description={t(i18n, "showcase.component.inputDate.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputDate
            id="demo-basic"
            label={t(i18n, "showcase.component.inputDate.labels.date")}
            hintText={t(i18n, "showcase.component.inputDate.labels.dateHint")}
            onChange={(v) => setBasicValue(v)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.currentValue", { value: basicValue })}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-date-example-01.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputDate.sections.range.title")}
        description={t(i18n, "showcase.component.inputDate.sections.range.description")}
      >
        <div className="w-80">
          <SgInputDate
            id="demo-range"
            label={t(i18n, "showcase.component.inputDate.labels.period")}
            minDate="2020-01-01"
            maxDate="2030-12-31"
          />
        </div>
        <CodeBlock code={loadSample("sg-input-date-example-02.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.inputDate.sections.fixed.title")}
        description={t(i18n, "showcase.component.inputDate.sections.fixed.description")}
      >
        <div className="w-80">
          <SgInputDate
            id="demo-float"
            label={t(i18n, "showcase.component.inputDate.labels.eventDate")}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-date-example-03.src")} />
      </Section>
    </div>
  );
}


