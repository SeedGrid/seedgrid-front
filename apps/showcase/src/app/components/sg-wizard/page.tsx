"use client";

import React from "react";
import { SgInputEmail, SgInputPhone, SgInputText, SgWizard, SgWizardPage, isValidEmail } from "@seedgrid/fe-components";

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
  return (
    <pre className="mt-3 rounded-md bg-foreground/5 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
      {props.code}
    </pre>
  );
}

export default function SgWizardPageDemo() {
  const [finished, setFinished] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [canProceed, setCanProceed] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = React.useState<{ name?: string; email?: string; phone?: string }>({});

  const isStepOneValid = Boolean(formValues.name.trim()) && !errors.name && !errors.email;
  const isStepOneValidPure = Boolean(formValues.name.trim()) && isValidEmail(formValues.email);
  const isStepTwoValid = Boolean(formValues.phone.trim()) && !errors.phone;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgWizard</h1>
        <p className="mt-2 text-muted-foreground">
          Wizard multi-etapas com controles de navegação e callback async no final.
        </p>
      </div>

      <Section title="Basico" description="3 etapas com finalização.">
        <SgWizard
          initialStep={0}
          onStepChange={(i) => setStep(i)}
          validateStep={(index) => {
            if (index === 0) return canProceed && isStepOneValid;
            if (index === 1) return isStepTwoValid;
            return true;
          }}
          onBeforeFinish={() => true}
          onFinish={async () => {
            setFinished(false);
            await new Promise((r) => setTimeout(r, 800));
            setFinished(true);
          }}
        >
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Etapa 1</div>
              <p className="mt-1 text-sm text-muted-foreground">Informações básicas do cliente.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SgInputText
                  id="wizard-name"
                  label="Nome"
                  required
                  error={errors.name}
                  inputProps={{
                    value: formValues.name,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))
                  }}
                  onValidation={(msg) => setErrors((prev) => ({ ...prev, name: msg ?? undefined }))}
                />
                <SgInputEmail
                  id="wizard-email"
                  label="Email"
                  required
                  error={errors.email}
                  inputProps={{
                    value: formValues.email,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))
                  }}
                  onValidation={(msg) => setErrors((prev) => ({ ...prev, email: msg ?? undefined }))}
                />
              </div>
              <label className="mt-3 flex items-center gap-2 text-xs text-foreground/80">
                <input
                  type="checkbox"
                  checked={canProceed}
                  onChange={(e) => setCanProceed(e.target.checked)}
                />
                Marque para liberar o próximo
              </label>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Etapa 2</div>
              <p className="mt-1 text-sm text-muted-foreground">Endereço e contato.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SgInputPhone
                  id="wizard-phone"
                  label="Telefone"
                  error={errors.phone}
                  inputProps={{
                    value: formValues.phone,
                    onChange: (e) => setFormValues((prev) => ({ ...prev, phone: e.target.value }))
                  }}
                  onValidation={(msg) => setErrors((prev) => ({ ...prev, phone: msg ?? undefined }))}
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
              <div className="text-sm font-semibold">Etapa 3</div>
              <p className="mt-1 text-sm text-muted-foreground">Confirmação final.</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <div className="mt-3 text-xs text-muted-foreground">
          Step atual: {step + 1} {finished ? "• Finalizado!" : ""}
        </div>
        <CodeBlock code={`const isStepOneValid = form.name.trim().length > 0 && !errors.name && !errors.email;
const isStepTwoValid = form.phone.trim().length > 0 && !errors.phone;

<SgWizard
  validateStep={(index) => {
    if (index === 0) return isStepOneValid;
    if (index === 1) return isStepTwoValid;
    return true;
  }}
  onFinish={async () => await submit()}
>
  <SgWizardPage>
    <div>Etapa 1</div>
  </SgWizardPage>
  <SgWizardPage>
    <div>Etapa 2</div>
  </SgWizardPage>
  <SgWizardPage>
    <div>Etapa 3</div>
  </SgWizardPage>
</SgWizard>`} />
      </Section>

      <Section title="Labels customizados" description="Personalize os textos dos botões.">
        <SgWizard
          labels={{ next: "Continuar", previous: "Voltar", finish: "Concluir" }}
          onFinish={() => {
            setFinished(true);
          }}
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
  onFinish={() => submit()}
>
  <SgWizardPage>...</SgWizardPage>
  <SgWizardPage>...</SgWizardPage>
</SgWizard>`} />
      </Section>

      <Section title="Validacao async" description="Exemplo de validacao antes de avancar.">
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
              <p className="mt-1 text-sm text-muted-foreground">Simula validacao async.</p>
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
    await new Promise((r) => setTimeout(r, 600));
    return true;
  }}
  onFinish={async () => await submit()}
>
  <SgWizardPage>...</SgWizardPage>
  <SgWizardPage>...</SgWizardPage>
</SgWizard>`} />
      </Section>

      <Section title="Validacao direta" description="Valida sem depender de onValidation.">
        <SgWizard
          validateStep={(index) => {
            if (index === 0) return isStepOneValidPure;
            return true;
          }}
          onFinish={() => {
            setFinished(true);
          }}
        >
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Etapa 1</div>
              <p className="mt-1 text-sm text-muted-foreground">Usa isValidEmail direto.</p>
            </div>
          </SgWizardPage>
          <SgWizardPage>
            <div className="rounded border border-border bg-foreground/5 p-4">
              <div className="text-sm font-semibold">Etapa 2</div>
              <p className="mt-1 text-sm text-muted-foreground">Pode finalizar.</p>
            </div>
          </SgWizardPage>
        </SgWizard>
        <CodeBlock code={`const isStepOneValid = form.name.trim().length > 0 && isValidEmail(form.email);

<SgWizard
  validateStep={(index) => (index === 0 ? isStepOneValid : true)}
  onFinish={() => submit()}
>
  <SgWizardPage>...</SgWizardPage>
  <SgWizardPage>...</SgWizardPage>
</SgWizard>`} />
      </Section>
    </div>
  );
}
