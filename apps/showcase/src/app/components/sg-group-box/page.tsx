"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { SgGroupBox, SgInputCEP, SgInputEmail, SgInputPassword, SgInputPhone, SgInputText } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";

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
  return <CodeBlockBase code={ props.code } />;
}

export default function SgGroupBoxPage() {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cep: "",
      senha: ""
    }
  });
  const values = watch();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgGroupBox</h1>
        <p className="mt-2 text-muted-foreground">
          Container com legend (fieldset) para agrupar campos.
        </p>
      </div>

      <Section title="Basico" description="Uso simples do GroupBox.">
        <div className="w-full">
          <SgGroupBox title="Dados pessoais">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-border bg-foreground/5 p-3 text-sm">Campo 1</div>
              <div className="rounded border border-border bg-foreground/5 p-3 text-sm">Campo 2</div>
            </div>
          </SgGroupBox>
        </div>
        <CodeBlock code={`<SgGroupBox title="Dados pessoais">
  <div className="grid gap-3 sm:grid-cols-2">
    <div>Campo 1</div>
    <div>Campo 2</div>
  </div>
</SgGroupBox>`} />
      </Section>

      <Section title="Formulario" description="Exemplo com inputs reais dentro do GroupBox.">
        <div className="w-full">
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            <SgGroupBox title="Cadastro">
              <div className="grid gap-4 sm:grid-cols-2">
                <SgInputText id="nome" name="nome" control={control} label="Nome completo" required />
                <SgInputEmail id="email" name="email" control={control} label="Email" required />
                <SgInputPhone id="telefone" name="telefone" control={control} label="Telefone" required />
                <SgInputCEP id="cep" name="cep" control={control} label="CEP" required />
                <div className="sm:col-span-2">
                  <SgInputPassword id="senha" name="senha" control={control} label="Senha" required />
                </div>
              </div>
            </SgGroupBox>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">Valores: {JSON.stringify(values)}</p>
        </div>
        <CodeBlock
          code={`import React from "react";
import { useForm } from "react-hook-form";
import {
  SgGroupBox,
  SgInputCEP,
  SgInputEmail,
  SgInputPassword,
  SgInputPhone,
  SgInputText
} from "@seedgrid/fe-components";

export default function Example() {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cep: "",
      senha: ""
    }
  });
  const values = watch();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SgGroupBox title="Cadastro">
        <div className="grid gap-4 sm:grid-cols-2">
          <SgInputText id="nome" name="nome" control={control} label="Nome completo" required />
          <SgInputEmail id="email" name="email" control={control} label="Email" required />
          <SgInputPhone id="telefone" name="telefone" control={control} label="Telefone" required />
          <SgInputCEP id="cep" name="cep" control={control} label="CEP" required />
          <div className="sm:col-span-2">
            <SgInputPassword id="senha" name="senha" control={control} label="Senha" required />
          </div>
        </div>
      </SgGroupBox>
      <p>Valores: {JSON.stringify(values)}</p>
    </form>
  );
}`}
        />
      </Section>

      <Section title="Tamanho" description="Largura e altura customizaveis.">
        <div className="w-full flex flex-wrap gap-4">
          <SgGroupBox title="Largura 320px" width={320}>
            <div className="rounded border border-border bg-foreground/5 p-3 text-sm">Conteudo</div>
          </SgGroupBox>
          <SgGroupBox title="Altura 180px" height={180}>
            <div className="rounded border border-border bg-foreground/5 p-3 text-sm">Conteudo</div>
          </SgGroupBox>
        </div>
        <CodeBlock code={`<SgGroupBox title="Largura 320px" width={320}>
  <div>Conteudo</div>
</SgGroupBox>

<SgGroupBox title="Altura 180px" height={180}>
  <div>Conteudo</div>
</SgGroupBox>`} />
      </Section>

      <Section title="Classe customizada" description="Use className para ajustar layout externo.">
        <div className="w-full">
          <SgGroupBox title="Com className" className="bg-foreground/5 p-2 rounded-xl">
            <div className="rounded border border-border bg-white p-3 text-sm">Conteudo</div>
          </SgGroupBox>
        </div>
        <CodeBlock code={`<SgGroupBox title="Com className" className="bg-foreground/5 p-2 rounded-xl">
  <div>Conteudo</div>
</SgGroupBox>`} />
      </Section>
    </div>
  );
}