"use client";

import React from "react";
import { SgAutocomplete, type SgAutocompleteItem } from "@seedgrid/fe-components";
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

function wrapExample(code: string) {
  return `import React from "react";
import { useForm } from "react-hook-form";
import { SgAutocomplete, type SgAutocompleteItem } from "@seedgrid/fe-components";

type Country = {
  id: number;
  description: string;
  code: string;
  flag: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Afghanistan", code: "AF", flag: "🇦🇫" },
  { id: 2, description: "Albania", code: "AL", flag: "🇦🇱" },
  { id: 3, description: "Brazil", code: "BR", flag: "🇧🇷" },
  { id: 4, description: "South Africa", code: "ZA", flag: "🇿🇦" }
];

const source = async (query: string) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const q = query.toLowerCase();
  return COUNTRIES.filter((c) => c.description.toLowerCase().includes(q));
};

const mapItem = (raw: Country): SgAutocompleteItem => ({
  id: raw.id,
  label: raw.description,
  data: raw
});

export default function Example() {
  const { control, handleSubmit } = useForm({
    defaultValues: { pais: "" }
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
${code.split("\n").map((line) => (line ? `      ${line}` : "")).join("\n")}
    </form>
  );
}`;
}

type Country = {
  id: number;
  description: string;
  code: string;
  flag: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Afghanistan", code: "AF", flag: "🇦🇫" },
  { id: 2, description: "Albania", code: "AL", flag: "🇦🇱" },
  { id: 3, description: "Algeria", code: "DZ", flag: "🇩🇿" },
  { id: 4, description: "American Samoa", code: "AS", flag: "🇦🇸" },
  { id: 5, description: "Andorra", code: "AD", flag: "🇦🇩" },
  { id: 6, description: "Angola", code: "AO", flag: "🇦🇴" },
  { id: 7, description: "Argentina", code: "AR", flag: "🇦🇷" },
  { id: 8, description: "Australia", code: "AU", flag: "🇦🇺" },
  { id: 9, description: "Brazil", code: "BR", flag: "🇧🇷" },
  { id: 10, description: "Canada", code: "CA", flag: "🇨🇦" },
  { id: 11, description: "Central African Republic", code: "CF", flag: "🇨🇫" },
  { id: 12, description: "Chile", code: "CL", flag: "🇨🇱" },
  { id: 13, description: "Colombia", code: "CO", flag: "🇨🇴" },
  { id: 14, description: "France", code: "FR", flag: "🇫🇷" },
  { id: 15, description: "Germany", code: "DE", flag: "🇩🇪" },
  { id: 16, description: "India", code: "IN", flag: "🇮🇳" },
  { id: 17, description: "South Africa", code: "ZA", flag: "🇿🇦" },
  { id: 18, description: "United States", code: "US", flag: "🇺🇸" }
];

const source = async (query: string) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const q = query.toLowerCase();
  return COUNTRIES.filter((c) => c.description.toLowerCase().includes(q));
};

export default function SgAutocompletePage() {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<SgAutocompleteItem | null>(null);

  const mapItem = (raw: Country): SgAutocompleteItem => ({
    id: raw.id,
    label: raw.description,
    group: raw.description[0],
    data: raw
  });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SgAutocomplete</h1>
        <p className="mt-2 text-muted-foreground">
          Autocomplete com busca, agrupamento, renderizacao customizada e cache.
        </p>
      </div>

      <Section title="Basico" description="Digita e mostra resultados conforme a busca.">
        <div className="w-80">
          <SgAutocomplete
            id="ac-basic"
            label="Pais"
            source={source}
            mapItem={mapItem}
            minLengthForSearch={1}
            onSelect={(item) => {
              setSelectedId(Number(item.id));
              setSelectedLabel(item.label);
              setSelectedItem(item);
            }}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Selecionado: {selectedLabel ? `${selectedLabel} (id ${selectedId})` : "nenhum"}
          </p>
          {selectedItem ? (
            <pre className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs">{JSON.stringify(selectedItem, null, 2)}</pre>
          ) : null}
        </div>
        <CodeBlock code={wrapExample(`const [selected, setSelected] = React.useState<SgAutocompleteItem | null>(null);

<SgAutocomplete
  id="pais"
  name="pais"
  control={control}
  label="Pais"
  source={source}
  mapItem={(raw) => ({
    id: raw.id,
    label: raw.description
  })}
  minLengthForSearch={1}
  onSelect={(item) => setSelected(item)}
/>

{selected ? (
  <pre>{JSON.stringify(selected, null, 2)}</pre>
) : null}`)} />
      </Section>

      <Section title="Custom Content" description="Renderiza item com bandeira.">
        <div className="w-80">
          <SgAutocomplete
            id="ac-custom"
            label="Pais"
            source={source}
            mapItem={mapItem}
            renderItem={(item) => {
              const data = item.data as Country;
              return (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{data.flag}</span>
                  <span>{item.label}</span>
                </div>
              );
            }}
          />
        </div>
        <CodeBlock code={wrapExample(`<SgAutocomplete
  id="pais"
  name="pais"
  control={control}
  label="Pais"
  source={source}
  mapItem={mapItem}
  renderItem={(item) => (
    <div className="flex items-center gap-2">
      <span>{item.data.flag}</span>
      <span>{item.label}</span>
    </div>
  )}
/>`)} />
      </Section>

      <Section title="Grouped" description="Agrupa por primeira letra.">
        <div className="w-80">
          <SgAutocomplete
            id="ac-grouped"
            label="Pais"
            source={source}
            mapItem={mapItem}
            grouped
          />
        </div>
        <CodeBlock code={wrapExample(`<SgAutocomplete
  id="pais"
  name="pais"
  control={control}
  label="Pais"
  source={source}
  mapItem={mapItem}
  grouped
/>`)} />
      </Section>

      <Section title="DropDown Button" description="Botao para abrir/fechar a lista.">
        <div className="w-80">
          <SgAutocomplete
            id="ac-dropdown"
            label="Pais"
            source={source}
            mapItem={mapItem}
            showDropDownButton
            openOnFocus
          />
        </div>
        <CodeBlock code={wrapExample(`<SgAutocomplete
  id="pais"
  name="pais"
  control={control}
  label="Pais"
  source={source}
  showDropDownButton
  openOnFocus
/>`)} />
      </Section>

      <Section title="Footer" description="Footer customizado com acao.">
        <div className="w-80">
          <SgAutocomplete
            id="ac-footer"
            label="Pais"
            source={source}
            mapItem={mapItem}
            renderFooter={(query, hasResults) => (
              <button
                type="button"
                className="w-full rounded bg-primary px-3 py-2 text-sm font-semibold text-white"
              >
                {hasResults ? `Adicionar "${query}"` : "Add new"}
              </button>
            )}
          />
        </div>
        <CodeBlock code={wrapExample(`<SgAutocomplete
  id="pais"
  name="pais"
  control={control}
  label="Pais"
  source={source}
  renderFooter={(query) => (
    <button>Adicionar "{query}"</button>
  )}
/>`)} />
      </Section>

      <Section title="Min Length" description="So busca a partir de 3 caracteres.">
        <div className="w-80">
          <SgAutocomplete
            id="ac-min"
            label="Pais"
            source={source}
            mapItem={mapItem}
            minLengthForSearch={3}
          />
        </div>
        <CodeBlock code={wrapExample(`<SgAutocomplete
  id="pais"
  name="pais"
  control={control}
  label="Pais"
  source={source}
  minLengthForSearch={3}
/>`)} />
      </Section>
    </div>
  );
}