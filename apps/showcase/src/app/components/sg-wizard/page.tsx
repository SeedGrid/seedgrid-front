"use client";

import React from "react";
import { SgInputEmail, SgInputPhone, SgInputText, SgWizard, SgWizardPage } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

export default function SgWizardPageDemo() {
  const i18n = useShowcaseI18n();
  const [submitted, setSubmitted] = React.useState<Record<string, string> | null>(null);
  const [step, setStep] = React.useState(0);
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    phone: ""
  });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.wizard.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.wizard.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.wizard.sections.autoValidation.title")}
        description={t(i18n, "showcase.component.wizard.sections.autoValidation.description")}
      >
        <SgWizard
          initialStep={0}
          onStepChange={(i) => setStep(i)}
          onFinish={async () => {
            setSubmitted(null);
            await new Promise((r) => setTimeout(r, 800));
            setSubmitted({ ...formValues });
          }}
        >
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.step1Title")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.step1Desc")}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SgInputText
                  id="wizard-name"
                  label={t(i18n, "showcase.component.wizard.labels.name")}
                  required
                  requiredMessage={t(i18n, "showcase.component.wizard.messages.requiredName")}
                  inputProps={{
                    value: formValues.name,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))
                  }}
                />
                <SgInputEmail
                  id="wizard-email"
                  label={t(i18n, "showcase.component.wizard.labels.email")}
                  required
                  requiredMessage={t(i18n, "showcase.component.wizard.messages.requiredEmail")}
                  invalidMessage={t(i18n, "showcase.component.wizard.messages.invalidEmail")}
                  inputProps={{
                    value: formValues.email,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))
                  }}
                />
              </div>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.step2Title")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.step2Desc")}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SgInputPhone
                  id="wizard-phone"
                  label={t(i18n, "showcase.component.wizard.labels.phone")}
                  required
                  requiredMessage={t(i18n, "showcase.component.wizard.messages.requiredPhone")}
                  lengthMessage={t(i18n, "showcase.component.wizard.messages.invalidPhone")}
                  inputProps={{
                    value: formValues.phone,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))
                  }}
                />
                <div className="rounded border border-border bg-white p-3 text-xs text-foreground/70">
                  <div className="font-semibold">{t(i18n, "showcase.component.wizard.labels.summary")}</div>
                  <div>{t(i18n, "showcase.component.wizard.labels.name")}: {formValues.name || "-"}</div>
                  <div>{t(i18n, "showcase.component.wizard.labels.email")}: {formValues.email || "-"}</div>
                  <div>{t(i18n, "showcase.component.wizard.labels.phone")}: {formValues.phone || "-"}</div>
                </div>
              </div>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.step3Title")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.step3Desc")}</p>
              <div className="mt-3 rounded border border-border bg-white p-3 text-sm text-foreground/80">
                <div>{t(i18n, "showcase.component.wizard.labels.name")}: {formValues.name || "-"}</div>
                <div>{t(i18n, "showcase.component.wizard.labels.email")}: {formValues.email || "-"}</div>
                <div>{t(i18n, "showcase.component.wizard.labels.phone")}: {formValues.phone || "-"}</div>
              </div>
            </div>
          </SgWizardPage>
        </SgWizard>
        <div className="mt-3 text-xs text-muted-foreground">
          {t(i18n, "showcase.component.wizard.labels.currentStep", { step: step + 1 })}
        </div>
        {submitted ? (
          <div className="mt-3 rounded-lg border border-border bg-white p-4 text-xs text-foreground/80">
            <div className="mb-2 text-sm font-semibold text-foreground">{t(i18n, "showcase.component.wizard.labels.payloadTitle")}</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        ) : null}
        <CodeBlock code={`const [submitted, setSubmitted] = React.useState<Record<string, string> | null>(null);
const [formValues, setFormValues] = React.useState({
  name: "",
  email: "",
  phone: ""
});

<SgWizard
  onFinish={async () => {
    setSubmitted(null);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted({ ...formValues });
  }}
>
  <SgWizardPage>
    <SgInputText
      id="wizard-name"
      label="${t(i18n, "showcase.component.wizard.labels.name")}"\n      required
      requiredMessage="${t(i18n, "showcase.component.wizard.messages.requiredName")}"\n      inputProps={{
        value: formValues.name,
        onChange: (e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))
      }}
    />
    <SgInputEmail
      id="wizard-email"
      label="${t(i18n, "showcase.component.wizard.labels.email")}"\n      required
      requiredMessage="${t(i18n, "showcase.component.wizard.messages.requiredEmail")}"\n      invalidMessage="${t(i18n, "showcase.component.wizard.messages.invalidEmail")}"\n      inputProps={{
        value: formValues.email,
        onChange: (e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))
      }}
    />
  </SgWizardPage>
  <SgWizardPage>
    <SgInputPhone
      id="wizard-phone"
      label="${t(i18n, "showcase.component.wizard.labels.phone")}"\n      required
      requiredMessage="${t(i18n, "showcase.component.wizard.messages.requiredPhone")}"\n      lengthMessage="${t(i18n, "showcase.component.wizard.messages.invalidPhone")}"\n      inputProps={{
        value: formValues.phone,
        onChange: (e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))
      }}
    />
  </SgWizardPage>
  <SgWizardPage>
    <div>${t(i18n, "showcase.component.wizard.labels.name")}: {formValues.name}</div>
    <div>${t(i18n, "showcase.component.wizard.labels.email")}: {formValues.email}</div>
    <div>${t(i18n, "showcase.component.wizard.labels.phone")}: {formValues.phone}</div>
  </SgWizardPage>
</SgWizard>

{submitted && (
  <pre>{JSON.stringify(submitted, null, 2)}</pre>
)}`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.wizard.sections.customLabels.title")}
        description={t(i18n, "showcase.component.wizard.sections.customLabels.description")}
      >
        <SgWizard
          labels={{
            next: t(i18n, "showcase.component.wizard.labels.next"),
            previous: t(i18n, "showcase.component.wizard.labels.previous"),
            finish: t(i18n, "showcase.component.wizard.labels.finish")
          }}
          onFinish={() => {}}
        >
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.customStep1")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.customStep1Desc")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.customStep2")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.customStep2Desc")}</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock code={`<SgWizard
  labels={{ next: "${t(i18n, "showcase.component.wizard.labels.next")}", previous: "${t(i18n, "showcase.component.wizard.labels.previous")}", finish: "${t(i18n, "showcase.component.wizard.labels.finish")}" }}
  onFinish={() => {}}
>
  <SgWizardPage>
    <div>${t(i18n, "showcase.component.wizard.labels.customStep1")}</div>
  </SgWizardPage>
  <SgWizardPage>
    <div>${t(i18n, "showcase.component.wizard.labels.customStep2")}</div>
  </SgWizardPage>
</SgWizard>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.wizard.sections.beforeNext.title")}
        description={t(i18n, "showcase.component.wizard.sections.beforeNext.description")}
      >
        <SgWizard
          onBeforeNext={async () => {
            await new Promise((r) => setTimeout(r, 600));
            return true;
          }}
          onFinish={async () => {
            await new Promise((r) => setTimeout(r, 400));
          }}
        >
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.beforeNextStep1")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.beforeNextStep1Desc")}</p>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.beforeNextStep2")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.beforeNextStep2Desc")}</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock code={`<SgWizard
  onBeforeNext={async () => {
    // ${t(i18n, "showcase.component.wizard.labels.beforeNextComment")}\n    await new Promise((r) => setTimeout(r, 600));
    return true; // ${t(i18n, "showcase.component.wizard.labels.beforeNextReturn")}
  }}
  onFinish={async () => {
    await new Promise((r) => setTimeout(r, 400));
  }}
>
  <SgWizardPage>
    <div>${t(i18n, "showcase.component.wizard.labels.beforeNextStep1")}</div>
  </SgWizardPage>
  <SgWizardPage>
    <div>${t(i18n, "showcase.component.wizard.labels.beforeNextStep2")}</div>
  </SgWizardPage>
</SgWizard>`} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.wizard.sections.validateStep.title")}
        description={t(i18n, "showcase.component.wizard.sections.validateStep.description")}
      >
        <SgWizard
          validateStep={(index) => {
            if (index === 0) {
              return Boolean(formValues.name.trim()) && Boolean(formValues.email.trim());
            }
            return true;
          }}
          onFinish={() => {}}
        >
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.validateStep1")}</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(i18n, "showcase.component.wizard.labels.validateStep1Desc")}
              </p>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.validateStep2")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.validateStep2Desc")}</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock code={`// ${t(i18n, "showcase.component.wizard.labels.validateStepComment1")}
// ${t(i18n, "showcase.component.wizard.labels.validateStepComment2")}

const [formValues, setFormValues] = React.useState({ name: "", email: "" });

<SgWizard
  validateStep={(index) => {
    if (index === 0) {
      return Boolean(formValues.name.trim()) && Boolean(formValues.email.trim());
    }
    return true;
  }}
  onFinish={() => {}}
>
  <SgWizardPage>
    <div>${t(i18n, "showcase.component.wizard.labels.validateStep1")}</div>
  </SgWizardPage>
  <SgWizardPage>
    <div>${t(i18n, "showcase.component.wizard.labels.validateStep2")}</div>
  </SgWizardPage>
</SgWizard>`} />
      </Section>
    </div>
  );
}
