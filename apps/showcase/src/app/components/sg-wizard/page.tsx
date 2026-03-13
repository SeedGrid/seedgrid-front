"use client";

import React from "react";
import { MapPin, Tag, Send } from "lucide-react";
import { SgInputEmail, SgInputPhone, SgInputText, SgPlayground, SgWizard, SgWizardPage } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
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
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const WIZARD_PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgInputEmail, SgInputPhone, SgInputText, SgWizard, SgWizardPage } from "@seedgrid/fe-components";

export default function App() {
  const [payload, setPayload] = React.useState<Record<string, string> | null>(null);
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    phone: ""
  });

  return (
    <div className="space-y-4 p-2">
      <SgWizard
        stepper="numbered"
        labels={{ next: "Next", previous: "Back", finish: "Finish" }}
        validateStep={(index) => {
          if (index !== 0) return true;
          return Boolean(formValues.name.trim()) && Boolean(formValues.email.trim());
        }}
        onFinish={async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setPayload({ ...formValues });
        }}
      >
        <SgWizardPage title="Identificacao">
          <div className="grid gap-3 sm:grid-cols-2">
            <SgInputText
              id="playground-name"
              label="Nome"
              required
              requiredMessage="Nome obrigatorio"
              inputProps={{
                value: formValues.name,
                onChange: (event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))
              }}
            />
            <SgInputEmail
              id="playground-email"
              label="Email"
              required
              requiredMessage="Email obrigatorio"
              inputProps={{
                value: formValues.email,
                onChange: (event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))
              }}
            />
          </div>
        </SgWizardPage>
        <SgWizardPage title="Contato">
          <SgInputPhone
            id="playground-phone"
            label="Telefone"
            required
            requiredMessage="Telefone obrigatorio"
            inputProps={{
              value: formValues.phone,
              onChange: (event) => setFormValues((prev) => ({ ...prev, phone: event.target.value }))
            }}
          />
        </SgWizardPage>
        <SgWizardPage title="Resumo">
          <div className="rounded border border-border bg-background p-3 text-sm">
            <div>Nome: {formValues.name || "-"}</div>
            <div>Email: {formValues.email || "-"}</div>
            <div>Telefone: {formValues.phone || "-"}</div>
          </div>
        </SgWizardPage>
      </SgWizard>

      {payload ? (
        <pre className="rounded border border-border bg-foreground/5 p-3 text-xs">
          {JSON.stringify(payload, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}`;

const WIZARD_PROPS: ShowcasePropRow[] = [
  { prop: "children", type: "ReactNode (SgWizardPage[])", defaultValue: "-", description: "Paginas renderizadas em ordem dentro do wizard." },
  { prop: "initialStep", type: "number", defaultValue: "0", description: "Indice inicial da etapa ativa." },
  { prop: "stepper", type: "\"numbered\" | \"icons\" | \"none\"", defaultValue: "\"numbered\"", description: "Modo visual do stepper." },
  { prop: "labels", type: "{ next, previous, finish }", defaultValue: "interno", description: "Override dos textos dos botoes de navegacao." },
  { prop: "validateStep", type: "(stepIndex) => boolean", defaultValue: "-", description: "Valida uma etapa antes de avancar." },
  { prop: "onBeforeNext", type: "(stepIndex) => boolean | Promise<boolean>", defaultValue: "-", description: "Hook antes de avancar para a proxima etapa." },
  { prop: "onStepChange", type: "(stepIndex) => void", defaultValue: "-", description: "Callback ao trocar de etapa." },
  { prop: "onFinish", type: "() => void | Promise<void>", defaultValue: "-", description: "Disparado quando o usuario conclui o wizard." },
  { prop: "className / style", type: "string / React.CSSProperties", defaultValue: "-", description: "Classes e estilo inline do container do wizard." },
  { prop: "SgWizardPage.className / SgWizardPage.style", type: "string / React.CSSProperties", defaultValue: "-", description: "Customizacao visual por pagina do wizard." }
];

export default function SgWizardPageDemo() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [submitted, setSubmitted] = React.useState<Record<string, string> | null>(null);
  const [step, setStep] = React.useState(0);
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    phone: ""
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.wizard.title")}
          subtitle={t(i18n, "showcase.component.wizard.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={t(i18n, "showcase.component.wizard.sections.autoValidation.title")}
        description={t(i18n, "showcase.component.wizard.sections.autoValidation.description")}
      >
        <SgWizard
          stepper="numbered"
          initialStep={0}
          onStepChange={(i) => setStep(i)}
          onFinish={async () => {
            setSubmitted(null);
            await new Promise((r) => setTimeout(r, 800));
            setSubmitted({ ...formValues });
          }}
        >
          <SgWizardPage title={t(i18n, "showcase.component.wizard.labels.step1Title")}>
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
          <SgWizardPage title={t(i18n, "showcase.component.wizard.labels.step2Title")}>
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
                <div className="rounded border border-border bg-background p-3 text-xs text-foreground/70">
                  <div className="font-semibold">{t(i18n, "showcase.component.wizard.labels.summary")}</div>
                  <div>{t(i18n, "showcase.component.wizard.labels.name")}: {formValues.name || "-"}</div>
                  <div>{t(i18n, "showcase.component.wizard.labels.email")}: {formValues.email || "-"}</div>
                  <div>{t(i18n, "showcase.component.wizard.labels.phone")}: {formValues.phone || "-"}</div>
                </div>
              </div>
            </div>
          </SgWizardPage>
          <SgWizardPage title={t(i18n, "showcase.component.wizard.labels.step3Title")}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">{t(i18n, "showcase.component.wizard.labels.step3Title")}</div>
              <p className="mt-1 text-sm text-muted-foreground">{t(i18n, "showcase.component.wizard.labels.step3Desc")}</p>
              <div className="mt-3 rounded border border-border bg-background p-3 text-sm text-foreground/80">
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
          <div className="mt-3 rounded-lg border border-border bg-background p-4 text-xs text-foreground/80">
            <div className="mb-2 text-sm font-semibold text-foreground">{t(i18n, "showcase.component.wizard.labels.payloadTitle")}</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        ) : null}
        <CodeBlock code={`import React from "react";
import { SgInputText, SgInputEmail, SgInputPhone, SgWizard, SgWizardPage } from "@seedgrid/fe-components";

const [submitted, setSubmitted] = React.useState<Record<string, string> | null>(null);
const [formValues, setFormValues] = React.useState({
  name: "",
  email: "",
  phone: ""
});

<SgWizard
  stepper="numbered"
  onFinish={async () => {
    setSubmitted(null);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted({ ...formValues });
  }}
>
  <SgWizardPage title="${t(i18n, "showcase.component.wizard.labels.step1Title")}">
    <SgInputText
      id="wizard-name"
      label="${t(i18n, "showcase.component.wizard.labels.name")}"
      required
      requiredMessage="${t(i18n, "showcase.component.wizard.messages.requiredName")}"
      inputProps={{
        value: formValues.name,
        onChange: (e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))
      }}
    />
    <SgInputEmail
      id="wizard-email"
      label="${t(i18n, "showcase.component.wizard.labels.email")}"
      required
      requiredMessage="${t(i18n, "showcase.component.wizard.messages.requiredEmail")}"
      invalidMessage="${t(i18n, "showcase.component.wizard.messages.invalidEmail")}"
      inputProps={{
        value: formValues.email,
        onChange: (e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))
      }}
    />
  </SgWizardPage>
  <SgWizardPage title="${t(i18n, "showcase.component.wizard.labels.step2Title")}">
    <SgInputPhone
      id="wizard-phone"
      label="${t(i18n, "showcase.component.wizard.labels.phone")}"
      required
      requiredMessage="${t(i18n, "showcase.component.wizard.messages.requiredPhone")}"
      lengthMessage="${t(i18n, "showcase.component.wizard.messages.invalidPhone")}"
      inputProps={{
        value: formValues.phone,
        onChange: (e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))
      }}
    />
  </SgWizardPage>
  <SgWizardPage title="${t(i18n, "showcase.component.wizard.labels.step3Title")}">
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
        title="Stepper com Icones"
        description='stepper="icons" + icon em cada SgWizardPage - exibe icone no circulo em vez de numero.'
      >
        <SgWizard
          stepper="icons"
          onFinish={() => {}}
          style={{ border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 14, padding: 12 }}
        >
          <SgWizardPage
            title="Posicao"
            icon={<MapPin className="size-5" />}
            style={{ backgroundColor: "rgba(59, 130, 246, 0.06)" }}
          >
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Passo 1 - Posicao</div>
              <p className="mt-1 text-sm text-muted-foreground">Select the desired position.</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title="Categoria" icon={<Tag className="size-5" />}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Passo 2 - Categoria</div>
              <p className="mt-1 text-sm text-muted-foreground">Choose the category.</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title="Enviar" icon={<Send className="size-5" />}>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Passo 3 - Enviar</div>
              <p className="mt-1 text-sm text-muted-foreground">Revise e envie.</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock code={`import { MapPin, Tag, Send } from "lucide-react";
import { SgWizard, SgWizardPage } from "@seedgrid/fe-components";

<SgWizard
  stepper="icons"
  onFinish={() => {}}
  style={{ border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 14, padding: 12 }}
>
  <SgWizardPage
    title="Posicao"
    icon={<MapPin className="size-5" />}
    style={{ backgroundColor: "rgba(59, 130, 246, 0.06)" }}
  >
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">Passo 1 - Posicao</div>
      <p className="mt-1 text-sm text-muted-foreground">Select the desired position.</p>
    </div>
  </SgWizardPage>
  <SgWizardPage title="Categoria" icon={<Tag className="size-5" />}>
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">Passo 2 - Categoria</div>
      <p className="mt-1 text-sm text-muted-foreground">Choose the category.</p>
    </div>
  </SgWizardPage>
  <SgWizardPage title="Enviar" icon={<Send className="size-5" />}>
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">Passo 3 - Enviar</div>
      <p className="mt-1 text-sm text-muted-foreground">Revise e envie.</p>
    </div>
  </SgWizardPage>
</SgWizard>`} />
      </Section>

      <Section
        title="Stepper Numerado"
        description='stepper="numbered" - circulos numerados com titulo de cada passo.'
      >
        <SgWizard
          stepper="numbered"
          onFinish={() => {}}
        >
          <SgWizardPage title="Introducao">
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">1. Introducao</div>
              <p className="mt-1 text-sm text-muted-foreground">Conteudo introdutorio.</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title="Detalhes">
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">2. Detalhes</div>
              <p className="mt-1 text-sm text-muted-foreground">Preencha os detalhes.</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title="Revisao">
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">3. Revisao</div>
              <p className="mt-1 text-sm text-muted-foreground">Revise as informacoes.</p>
            </div>
          </SgWizardPage>
          <SgWizardPage title="Confirmacao">
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">4. Confirmacao</div>
              <p className="mt-1 text-sm text-muted-foreground">Confirme e finalize.</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock code={`import { SgWizard, SgWizardPage } from "@seedgrid/fe-components";

<SgWizard stepper="numbered" onFinish={() => {}}>
  <SgWizardPage title="Introducao">
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">1. Introducao</div>
      <p className="mt-1 text-sm text-muted-foreground">Conteudo introdutorio.</p>
    </div>
  </SgWizardPage>
  <SgWizardPage title="Detalhes">
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">2. Detalhes</div>
      <p className="mt-1 text-sm text-muted-foreground">Preencha os detalhes.</p>
    </div>
  </SgWizardPage>
  <SgWizardPage title="Revisao">
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">3. Revisao</div>
      <p className="mt-1 text-sm text-muted-foreground">Revise as informacoes.</p>
    </div>
  </SgWizardPage>
  <SgWizardPage title="Confirmacao">
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">4. Confirmacao</div>
      <p className="mt-1 text-sm text-muted-foreground">Confirme e finalize.</p>
    </div>
  </SgWizardPage>
</SgWizard>`} />
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
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">${t(i18n, "showcase.component.wizard.labels.customStep1")}</div>
      <p className="mt-1 text-sm text-muted-foreground">${t(i18n, "showcase.component.wizard.labels.customStep1Desc")}</p>
    </div>
  </SgWizardPage>
  <SgWizardPage>
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">${t(i18n, "showcase.component.wizard.labels.customStep2")}</div>
      <p className="mt-1 text-sm text-muted-foreground">${t(i18n, "showcase.component.wizard.labels.customStep2Desc")}</p>
    </div>
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
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">${t(i18n, "showcase.component.wizard.labels.beforeNextStep1")}</div>
      <p className="mt-1 text-sm text-muted-foreground">${t(i18n, "showcase.component.wizard.labels.beforeNextStep1Desc")}</p>
    </div>
  </SgWizardPage>
  <SgWizardPage>
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">${t(i18n, "showcase.component.wizard.labels.beforeNextStep2")}</div>
      <p className="mt-1 text-sm text-muted-foreground">${t(i18n, "showcase.component.wizard.labels.beforeNextStep2Desc")}</p>
    </div>
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
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">${t(i18n, "showcase.component.wizard.labels.validateStep1")}</div>
      <p className="mt-1 text-sm text-muted-foreground">${t(i18n, "showcase.component.wizard.labels.validateStep1Desc")}</p>
    </div>
  </SgWizardPage>
  <SgWizardPage>
    <div className="rounded border border-border bg-foreground/5 p-4">
      <div className="text-sm font-semibold">${t(i18n, "showcase.component.wizard.labels.validateStep2")}</div>
      <p className="mt-1 text-sm text-muted-foreground">${t(i18n, "showcase.component.wizard.labels.validateStep2Desc")}</p>
    </div>
  </SgWizardPage>
</SgWizard>`} />
      </Section>
      <Section
        title="Playground"
        description="Sandbox para simular validacao, navegacao e submit do wizard."
      >
        <SgPlayground
          title="SgWizard Playground"
          interactive
          codeContract="appFile"
          code={WIZARD_PLAYGROUND_APP_FILE}
          height={640}
          defaultOpen
        />
      </Section>

      <ShowcasePropsReference rows={WIZARD_PROPS} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
    </div>
  </I18NReady>
  );
}


