"use client";

import React from "react";
import { SgInputEmail, SgInputPhone, SgInputText, SgWizard, SgWizardPage } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";

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
  return <CodeBlockBase code={ props.code } />;
}

export default function SgWizardPageDemo() {
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
        <h1 className="text-3xl font-bold">SgWizard</h1>
        <p className="mt-2 text-muted-foreground">
          Wizard multi-etapas com validacao automatica, controles de navegacao e callbacks async.
        </p>
      </div>

      <Section title="Validacao automatica" description="O wizard valida automaticamente os inputs da pagina antes de avancar. Campos required, email e telefone sao validados sem necessidade de validateStep.">
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
              <div className="text-sm font-semibold">Etapa 1 - Dados pessoais</div>
              <p className="mt-1 text-sm text-muted-foreground">Preencha nome e email para avancar.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SgInputText
                  id="wizard-name"
                  label="Nome"
                  required
                  requiredMessage="Informe o nome."
                  inputProps={{
                    value: formValues.name,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))
                  }}
                />
                <SgInputEmail
                  id="wizard-email"
                  label="Email"
                  required
                  requiredMessage="Informe o email."
                  invalidMessage="Email invalido."
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
              <div className="text-sm font-semibold">Etapa 2 - Contato</div>
              <p className="mt-1 text-sm text-muted-foreground">Informe o telefone.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SgInputPhone
                  id="wizard-phone"
                  label="Telefone"
                  required
                  requiredMessage="Informe o telefone."
                  lengthMessage="Telefone invalido."
                  inputProps={{
                    value: formValues.phone,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))
                  }}
                />
                <div className="rounded border border-border bg-white p-3 text-xs text-foreground/70">
                  <div className="font-semibold">Resumo</div>
                  <div>Nome: {formValues.name || "-"}</div>
                  <div>Email: {formValues.email || "-"}</div>
                  <div>Telefone: {formValues.phone || "-"}</div>
                </div>
              </div>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Etapa 3 - Confirmacao</div>
              <p className="mt-1 text-sm text-muted-foreground">Revise os dados e finalize.</p>
              <div className="mt-3 rounded border border-border bg-white p-3 text-sm text-foreground/80">
                <div>Nome: {formValues.name || "-"}</div>
                <div>Email: {formValues.email || "-"}</div>
                <div>Telefone: {formValues.phone || "-"}</div>
              </div>
            </div>
          </SgWizardPage>
        </SgWizard>
        <div className="mt-3 text-xs text-muted-foreground">
          Step atual: {step + 1}
        </div>
        {submitted ? (
          <div className="mt-3 rounded-lg border border-border bg-white p-4 text-xs text-foreground/80">
            <div className="mb-2 text-sm font-semibold text-foreground">Payload enviado</div>
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
      label="Nome"
      required
      requiredMessage="Informe o nome."
      inputProps={{
        value: formValues.name,
        onChange: (e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))
      }}
    />
    <SgInputEmail
      id="wizard-email"
      label="Email"
      required
      requiredMessage="Informe o email."
      invalidMessage="Email invalido."
      inputProps={{
        value: formValues.email,
        onChange: (e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))
      }}
    />
  </SgWizardPage>
  <SgWizardPage>
    <SgInputPhone
      id="wizard-phone"
      label="Telefone"
      required
      requiredMessage="Informe o telefone."
      lengthMessage="Telefone invalido."
      inputProps={{
        value: formValues.phone,
        onChange: (e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))
      }}
    />
  </SgWizardPage>
  <SgWizardPage>
    <div>Nome: {formValues.name}</div>
    <div>Email: {formValues.email}</div>
    <div>Telefone: {formValues.phone}</div>
  </SgWizardPage>
</SgWizard>

{submitted && (
  <pre>{JSON.stringify(submitted, null, 2)}</pre>
)}`} />
      </Section>

      <Section title="Labels customizados" description="Personalize os textos dos botoes.">
        <SgWizard
          labels={{ next: "Continuar", previous: "Voltar", finish: "Concluir" }}
          onFinish={() => {}}
        >
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Dados</div>
              <p className="mt-1 text-sm text-muted-foreground">Ajuste labels como quiser.</p>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Fim</div>
              <p className="mt-1 text-sm text-muted-foreground">Clique em Concluir para finalizar.</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock code={`<SgWizard
  labels={{ next: "Continuar", previous: "Voltar", finish: "Concluir" }}
  onFinish={() => {}}
>
  <SgWizardPage>
    <div>Dados</div>
  </SgWizardPage>
  <SgWizardPage>
    <div>Fim</div>
  </SgWizardPage>
</SgWizard>`} />
      </Section>

      <Section title="onBeforeNext async" description="Validacao assincrona antes de avancar (ex: consultar API).">
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
              <div className="text-sm font-semibold">Etapa 1</div>
              <p className="mt-1 text-sm text-muted-foreground">Simula validacao async (600ms).</p>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Etapa 2</div>
              <p className="mt-1 text-sm text-muted-foreground">Pode finalizar.</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock code={`<SgWizard
  onBeforeNext={async () => {
    // Simula validacao async (ex: consultar API)
    await new Promise((r) => setTimeout(r, 600));
    return true; // retorne false para bloquear
  }}
  onFinish={async () => {
    await new Promise((r) => setTimeout(r, 400));
  }}
>
  <SgWizardPage>
    <div>Etapa 1 - Simula validacao async (600ms).</div>
  </SgWizardPage>
  <SgWizardPage>
    <div>Etapa 2 - Pode finalizar.</div>
  </SgWizardPage>
</SgWizard>`} />
      </Section>

      <Section title="validateStep" description="Validacao customizada por step, alem da validacao automatica dos inputs.">
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
              <div className="text-sm font-semibold">Etapa 1</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Valida via validateStep alem da validacao automatica dos inputs.
              </p>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Etapa 2</div>
              <p className="mt-1 text-sm text-muted-foreground">Pode finalizar.</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock code={`// validateStep roda APOS a validacao automatica dos inputs.
// Use para regras de negocio que vao alem da validacao de campos.

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
    <div>Etapa 1 - Valida via validateStep.</div>
  </SgWizardPage>
  <SgWizardPage>
    <div>Etapa 2 - Pode finalizar.</div>
  </SgWizardPage>
</SgWizard>`} />
      </Section>
    </div>
  );
}