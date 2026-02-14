"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  SgGroupBox,
  SgInputPostalCode,
  SgInputEmail,
  SgInputPassword,
  SgInputPhone,
  SgInputText
} from "@seedgrid/fe-components";
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
  return <SgCodeBlockBase code={props.code} />;
}

export default function SgGroupBoxPage() {
  const i18n = useShowcaseI18n();
  const { control, handleSubmit, watch } = useForm({
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
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.groupBox.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.groupBox.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.groupBox.sections.basic.title")}
        description={t(i18n, "showcase.component.groupBox.sections.basic.description")}
      >
        <div className="w-full">
          <SgGroupBox title={t(i18n, "showcase.component.groupBox.labels.personalData")}>
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
        <CodeBlock code={loadSample("sg-group-box-example-01.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.groupBox.sections.form.title")}
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
          code={loadSample("sg-group-box-example-02.src")}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.groupBox.sections.size.title")}
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
        <CodeBlock code={loadSample("sg-group-box-example-03.src")} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.groupBox.sections.className.title")}
        description={t(i18n, "showcase.component.groupBox.sections.className.description")}
      >
        <div className="w-full">
          <SgGroupBox title={t(i18n, "showcase.component.groupBox.labels.classNameTitle")} className="bg-foreground/5 p-2 rounded-xl">
            <div className="rounded border border-border bg-white p-3 text-sm">{t(i18n, "showcase.component.groupBox.labels.content")}</div>
          </SgGroupBox>
        </div>
        <CodeBlock code={loadSample("sg-group-box-example-04.src")} />
      </Section>
    </div>
  );
}


