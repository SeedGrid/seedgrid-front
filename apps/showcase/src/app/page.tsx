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
      { slug: "sg-input-fone", name: "SgInputFone", desc: "Input de telefone brasileiro com mascara (XX) XXXXX-XXXX" }
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
