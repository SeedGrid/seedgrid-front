"use client";

import React from "react";
import Link from "next/link";
import { SgButton, SgInputBirthDate, SgStack } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { getShowcaseI18n, t, useShowcaseI18n } from "../../../i18n";
import BackToTopFab from "../sg-code-block-base/BackToTopFab";

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
  const i18n = getShowcaseI18n();
  const imports = [
    `import React from "react";`,
    `import { useForm } from "react-hook-form";`,
    `import { SgInputBirthDate } from "@seedgrid/fe-components";`
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


export default function SgInputBirthDatePage() {
  const i18n = useShowcaseI18n();
  const [validationMsg, setValidationMsg] = React.useState<string | null>(null);

  const sectionLinks = [
    { href: "#basic", label: t(i18n, "showcase.component.inputBirthDate.sections.basic.title") },
    { href: "#required", label: t(i18n, "showcase.component.inputBirthDate.sections.required.title") },
    { href: "#range", label: t(i18n, "showcase.component.inputBirthDate.sections.range.title") }
  ];

  return (
    <SgStack className="w-full" gap={32}>
      <SgStack id="examples-top" gap={8}>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.inputBirthDate.title")}</h1>
        <p className="text-muted-foreground">
          {t(i18n, "showcase.component.inputBirthDate.subtitle")}
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
        id="basic"
        title={t(i18n, "showcase.component.inputBirthDate.sections.basic.title")}
        description={t(i18n, "showcase.component.inputBirthDate.sections.basic.description")}
      >
        <div className="w-80">
          <SgInputBirthDate
            id="demo-basic"
            label={t(i18n, "showcase.component.inputBirthDate.labels.birthDate")}
            minAge={18}
            onValidation={(msg) => setValidationMsg(msg)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t(i18n, "showcase.common.labels.onValidation")}: {validationMsg === null
              ? t(i18n, "showcase.common.labels.valid")
              : `"${validationMsg}"`}
          </p>
        </div>
        <CodeBlock code={loadSample("sg-input-birth-date-example-01.src")} />
      </Section>

      <Section
        id="required"
        title={t(i18n, "showcase.component.inputBirthDate.sections.required.title")}
        description={t(i18n, "showcase.component.inputBirthDate.sections.required.description")}
      >
        <div className="w-80">
          <SgInputBirthDate
            id="demo-required"
            label={t(i18n, "showcase.component.inputBirthDate.labels.birthDate")}
            minAge={18}
            required
            requiredMessage={t(i18n, "showcase.component.inputBirthDate.messages.required")}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-birth-date-example-02.src")} />
      </Section>

      <Section
        id="range"
        title={t(i18n, "showcase.component.inputBirthDate.sections.range.title")}
        description={t(i18n, "showcase.component.inputBirthDate.sections.range.description")}
      >
        <div className="w-80">
          <SgInputBirthDate
            id="demo-range"
            label={t(i18n, "showcase.component.inputBirthDate.labels.birthDate")}
            minAge={12}
            maxAge={80}
          />
        </div>
        <CodeBlock code={loadSample("sg-input-birth-date-example-03.src")} />
      </Section>
      <BackToTopFab targetId="examples-top" />
    </SgStack>
  );
}


