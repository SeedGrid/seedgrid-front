import Link from "next/link";

const COMPONENTS = [
  {
    category: "Inputs",
    items: [
      { slug: "sg-input-text", name: "SgInputText", desc: "Input de texto base com floating label, validacao, contador e botao limpar" },
      { slug: "sg-input-text-area", name: "SgInputTextArea", desc: "Input multi-linha com contagem de palavras e linhas" },
      { slug: "sg-input-password", name: "SgInputPassword", desc: "Input de senha com toggle de visibilidade, validacao e botao limpar" },
      { slug: "sg-input-select", name: "SgInputSelect", desc: "Dropdown select com floating label" },
      { slug: "sg-input-date", name: "SgInputDate", desc: "Seletor de data com restricoes min/max" },
      { slug: "sg-input-birth-date", name: "SgInputBirthDate", desc: "Data de nascimento com validacao de idade minima/maxima" },
      { slug: "sg-input-email", name: "SgInputEmail", desc: "Input de email com validacao integrada e bloqueio de temporarios" },
      { slug: "sg-input-cpf", name: "SgInputCPF", desc: "Input de CPF com mascara e validacao de digitos" },
      { slug: "sg-input-cnpj", name: "SgInputCNPJ", desc: "Input de CNPJ com mascara e validacao de digitos" },
      { slug: "sg-input-cpf-cnpj", name: "SgInputCPFCNPJ", desc: "Input que aceita CPF ou CNPJ com deteccao automatica" },
      { slug: "sg-input-cep", name: "SgInputCEP", desc: "Input de CEP com mascara e validacao" },
      { slug: "sg-input-phone", name: "SgInputPhone", desc: "Input de telefone brasileiro com mascara (XX) XXXXX-XXXX" },
      { slug: "sg-autocomplete", name: "SgAutocomplete", desc: "Autocomplete com busca, agrupamento e render custom" }
    ]
  },
  {
    category: "Layout",
    items: [
      { slug: "sg-group-box", name: "SgGroupBox", desc: "Container agrupado com legenda (fieldset/legend)" }
    ]
  },
  {
    category: "Wizard",
    items: [
      { slug: "sg-wizard", name: "SgWizard", desc: "Formulario multi-etapas com navegacao e callback async" }
    ]
  }
];

export default function HomePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold">SeedGrid Components</h1>
      <p className="mt-2 text-muted-foreground">
        Catalogo interativo de todos os componentes do pacote <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">@seedgrid/fe-components</code>.
        Clique em qualquer componente para ver exemplos interativos e documentacao de props.
      </p>

      <section className="mt-6 rounded-lg border border-border bg-foreground/5 p-5">
        <h2 className="text-lg font-semibold">About</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Os componentes SG encapsulam o React Hook Form. Quando voce informa{" "}
          <code className="rounded bg-muted px-1">name</code> e <code className="rounded bg-muted px-1">control</code>, o componente
          ja aplica o <code className="rounded bg-muted px-1">Controller</code> internamente.
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>Menos boilerplate: nao precisa escrever Controller em cada campo.</li>
          <li>Validacao e mensagens padronizadas no proprio componente.</li>
          <li>UI consistente (labels, errors, spacing e comportamento).</li>
          <li>Fica mais simples reaproveitar layouts e regras entre telas.</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Voce ainda pode usar o componente sem RHF (apenas como input controlado), mas com{" "}
          <code className="rounded bg-muted px-1">name</code> e <code className="rounded bg-muted px-1">control</code> ele vira um wrapper do RHF.
        </p>
        <pre className="mt-3 rounded-md bg-white/70 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">{`import { useForm } from "react-hook-form";
import { SgInputText, SgInputEmail } from "@seedgrid/fe-components";

const { control, handleSubmit } = useForm({
  defaultValues: { nome: "", email: "" }
});

<form onSubmit={handleSubmit(onSubmit)}>
  <SgInputText
    id="nome"
    name="nome"
    control={control}
    label="Nome"
    required
    requiredMessage="Informe o nome."
  />

  <SgInputEmail
    id="email"
    name="email"
    control={control}
    label="Email"
    required
  />
</form>`}</pre>
      </section>

      {COMPONENTS.map((group) => (
        <section key={group.category} className="mt-8">
          <h2 className="text-xl font-semibold border-b border-border pb-2 mb-4">{group.category}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <Link
                key={item.slug}
                href={`/components/${item.slug}`}
                className="group rounded-lg border border-border p-4 hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <h3 className="font-semibold text-primary group-hover:underline">{item.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-12 rounded-lg bg-muted/50 p-6">
        <h2 className="text-lg font-semibold">Instalacao</h2>
        <pre className="mt-3 rounded-md bg-foreground/5 p-4 text-sm font-mono overflow-x-auto">
{`import { SgInputText } from "@seedgrid/fe-components";
import type { SgInputTextProps } from "@seedgrid/fe-components";`}
        </pre>
      </section>
    </div>
  );
}
