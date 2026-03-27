"use client";

import React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import {
  SgGroupBox,
  SgInputPostalCode,
  SgInputEmail,
  SgInputPassword,
  SgInputPhone,
  SgInputText,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import sgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <sgCodeBlockBase code={props.code} />;
}

const GROUP_BOX_PLAYGROUND_CODE = `import * as React from "react";
import {
  SgGroupBox,
  SgInputPostalCode,
  SgInputEmail,
  SgInputPassword,
  SgInputPhone,
  SgInputText,
  SgButton,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [title, setTitle] = React.useState("Dados pessoais");
  const [width, setWidth] = React.useState(420);
  const [height, setHeight] = React.useState(220);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setTitle((prev) => prev === "Dados pessoais" ? "Informações da conta" : "Dados pessoais")}>
          trocar título
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setWidth((prev) => (prev === 420 ? 320 : 420))}>
          width: {width}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setHeight((prev) => (prev === 220 ? 180 : 220))}>
          height: {height}
        </SgButton>
      </div>

      <SgGroupBox title={title} width={width} height={height}>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded border border-border bg-muted/20 p-3 text-sm">Campo 1</div>
          <div className="rounded border border-border bg-muted/20 p-3 text-sm">Campo 2</div>
          <div className="rounded border border-border bg-muted/20 p-3 text-sm">Campo 3</div>
          <div className="rounded border border-border bg-muted/20 p-3 text-sm">Campo 4</div>
        </div>
      </SgGroupBox>
    </div>
  );
}`;

export default function SgGroupBoxPage() {
  const i18n = useShowcaseI18n();
  const groupBoxProps: ShowcasePropRow[] = [
    {
      prop: "title",
      type: "string",
      defaultValue: "-",
      description: t(i18n, "showcase.component.groupBox.props.rows.title")
    },
    {
      prop: "width / height",
      type: "number",
      defaultValue: "auto",
      description: t(i18n, "showcase.component.groupBox.props.rows.widthHeight")
    },
    {
      prop: "children",
      type: "ReactNode",
      defaultValue: "-",
      description: t(i18n, "showcase.component.groupBox.props.rows.children")
    },
    {
      prop: "className",
      type: "string",
      defaultValue: "-",
      description: t(i18n, "showcase.component.groupBox.props.rows.className")
    },
    {
      prop: "style",
      type: "React.CSSProperties",
      defaultValue: "-",
      description: "Inline style adicional do container."
    }
  ];
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });
  const { control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cep: "",
      password: ""
    }
  });
  const values = watch();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.groupBox.title")}
          subtitle={t(i18n, "showcase.component.groupBox.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={`1) ${t(i18n, "showcase.component.groupBox.sections.basic.title")}`}
        description={t(i18n, "showcase.component.groupBox.sections.basic.description")}
      >
        <div className="w-full">
          <SgGroupBox
            title={t(i18n, "showcase.component.groupBox.labels.personalData")}
            style={{ boxShadow: "inset 0 0 0 1px rgba(59, 130, 246, 0.2)" }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-border bg-foreground/5 p-3 text-sm">
                {t(i18n, "showcase.component.groupBox.labels.field1")}
              </div>
              <div className="rounded border border-border bg-foreground/5 p-3 text-sm">
                {t(i18n, "showcase.component.groupBox.labels.field2")}
              </div>
            </div>
          </SgGroupBox>
        </div>
        <CodeBlock code={`<SgGroupBox
  title="${t(i18n, "showcase.component.groupBox.labels.personalData")}"
  style={{ boxShadow: "inset 0 0 0 1px rgba(59, 130, 246, 0.2)" }}
>
  <div className="grid gap-3 sm:grid-cols-2">
    <div>${t(i18n, "showcase.component.groupBox.labels.field1")}</div>
    <div>${t(i18n, "showcase.component.groupBox.labels.field2")}</div>
  </div>
</SgGroupBox>`} />
      </Section>

      <Section
        title={`2) ${t(i18n, "showcase.component.groupBox.sections.form.title")}`}
        description={t(i18n, "showcase.component.groupBox.sections.form.description")}
      >
        <div className="w-full">
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            <SgGroupBox title={t(i18n, "showcase.component.groupBox.labels.formTitle")}>
              <div className="grid gap-4 sm:grid-cols-2">
                <SgInputText id="name" name="name" control={control} label={t(i18n, "showcase.component.groupBox.labels.fullName")} required />
                <SgInputEmail id="email" name="email" control={control} label={t(i18n, "showcase.component.groupBox.labels.email")} required />
                <SgInputPhone id="phone" name="phone" control={control} label={t(i18n, "showcase.component.groupBox.labels.phone")} required />
                <SgInputPostalCode id="cep" name="cep" control={control} label={t(i18n, "showcase.component.groupBox.labels.cep")} required />
                <div className="sm:col-span-2">
                  <SgInputPassword id="password" name="password" control={control} label={t(i18n, "showcase.component.groupBox.labels.password")} required />
                </div>
              </div>
            </SgGroupBox>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            {t(i18n, "showcase.component.groupBox.labels.values")}: {JSON.stringify(values)}
          </p>
        </div>
        <CodeBlock
          code={`import React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import {
  SgGroupBox,
  SgInputPostalCode,
  SgInputEmail,
  SgInputPassword,
  SgInputPhone,
  SgInputText,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const { control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cep: "",
      password: ""
    }
  });
  const values = watch();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SgGroupBox title="${t(i18n, "showcase.component.groupBox.labels.formTitle")}">
        <div className="grid gap-4 sm:grid-cols-2">
          <SgInputText id="name" name="name" control={control} label="${t(i18n, "showcase.component.groupBox.labels.fullName")}" required />
          <SgInputEmail id="email" name="email" control={control} label="${t(i18n, "showcase.component.groupBox.labels.email")}" required />
          <SgInputPhone id="phone" name="phone" control={control} label="${t(i18n, "showcase.component.groupBox.labels.phone")}" required />
          <SgInputPostalCode id="cep" name="cep" control={control} label="${t(i18n, "showcase.component.groupBox.labels.cep")}" required />
          <div className="sm:col-span-2">
            <SgInputPassword id="password" name="password" control={control} label="${t(i18n, "showcase.component.groupBox.labels.password")}" required />
          </div>
        </div>
      </SgGroupBox>
      <p>${t(i18n, "showcase.component.groupBox.labels.values")}: {JSON.stringify(values)}</p>
    </form>
  );
}`}
        />
      </Section>

      <Section
        title={`3) ${t(i18n, "showcase.component.groupBox.sections.size.title")}`}
        description={t(i18n, "showcase.component.groupBox.sections.size.description")}
      >
        <div className="w-full flex flex-wrap gap-4">
          <SgGroupBox title={t(i18n, "showcase.component.groupBox.labels.width320")} width={320}>
            <div className="rounded border border-border bg-foreground/5 p-3 text-sm">{t(i18n, "showcase.component.groupBox.labels.content")}</div>
          </SgGroupBox>
          <SgGroupBox title={t(i18n, "showcase.component.groupBox.labels.height180")} height={180}>
            <div className="rounded border border-border bg-foreground/5 p-3 text-sm">{t(i18n, "showcase.component.groupBox.labels.content")}</div>
          </SgGroupBox>
        </div>
        <CodeBlock code={`<SgGroupBox title="${t(i18n, "showcase.component.groupBox.labels.width320")}" width={320}>
  <div>${t(i18n, "showcase.component.groupBox.labels.content")}</div>
</SgGroupBox>

<SgGroupBox title="${t(i18n, "showcase.component.groupBox.labels.height180")}" height={180}>
  <div>${t(i18n, "showcase.component.groupBox.labels.content")}</div>
</SgGroupBox>`} />
      </Section>

      <Section
        title={`4) ${t(i18n, "showcase.component.groupBox.sections.className.title")}`}
        description={t(i18n, "showcase.component.groupBox.sections.className.description")}
      >
        <div className="w-full">
          <SgGroupBox title={t(i18n, "showcase.component.groupBox.labels.classNameTitle")} className="bg-foreground/5 p-2 rounded-xl">
            <div className="rounded border border-border bg-background p-3 text-sm">{t(i18n, "showcase.component.groupBox.labels.content")}</div>
          </SgGroupBox>
        </div>
        <CodeBlock code={`<SgGroupBox title="${t(i18n, "showcase.component.groupBox.labels.classNameTitle")}" className="bg-foreground/5 p-2 rounded-xl">
  <div>${t(i18n, "showcase.component.groupBox.labels.content")}</div>
</SgGroupBox>`} />
      </Section>

        <Section
          title="5) Playground (SgPlayground)"
          description={t(i18n, "showcase.common.playground.description.withComponent", { component: "SgGroupBox" })}
        >
          <SgPlayground
            title="SgGroupBox Playground"
            interactive
            codeContract="appFile"
            code={GROUP_BOX_PLAYGROUND_CODE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={groupBoxProps} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

