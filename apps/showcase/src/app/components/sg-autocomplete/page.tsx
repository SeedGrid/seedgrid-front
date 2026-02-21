"use client";

import React from "react";
import { SgAutocomplete, SgPlayground, type SgAutocompleteItem } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode; example?: boolean }) {
  return (
    <section
      data-showcase-example={props.example === false ? undefined : "true"}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

function wrapExample(label: string, code: string) {
  return `import React from "react";
import { useForm } from "react-hook-form";
import { SgAutocomplete, type SgAutocompleteItem } from "@seedgrid/fe-components";

type Country = {
  id: number;
  description: string;
  code: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Afghanistan", code: "AF" },
  { id: 2, description: "Albania", code: "AL" },
  { id: 3, description: "Brazil", code: "BR" },
  { id: 4, description: "South Africa", code: "ZA" }
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
    defaultValues: { country: "" }
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
${code.split("\n").map((line) => (line ? `      ${line}` : "")).join("\n")}
    </form>
  );
}`.replace("label=\"\"", `label=\"${label}\"`);
}

const AUTOCOMPLETE_PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgAutocomplete } from "@seedgrid/fe-components";

type Country = {
  id: number;
  description: string;
  code: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Afghanistan", code: "AF" },
  { id: 2, description: "Albania", code: "AL" },
  { id: 3, description: "Brazil", code: "BR" },
  { id: 4, description: "Canada", code: "CA" },
  { id: 5, description: "Germany", code: "DE" },
  { id: 6, description: "India", code: "IN" },
  { id: 7, description: "United States", code: "US" }
];

const source = async (query: string) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const q = query.toLowerCase();
  return COUNTRIES.filter((c) => c.description.toLowerCase().includes(q));
};

export default function App() {
  const [selected, setSelected] = React.useState<{ id: number | string; label: string } | null>(null);
  const [grouped, setGrouped] = React.useState(false);
  const [showDropDownButton, setShowDropDownButton] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm inline-flex items-center gap-1">
          <input
            className="mr-1"
            type="checkbox"
            checked={grouped}
            onChange={(e) => setGrouped(e.target.checked)}
          />
          grouped
        </label>
        <label className="text-sm inline-flex items-center gap-1">
          <input
            className="mr-1"
            type="checkbox"
            checked={showDropDownButton}
            onChange={(e) => setShowDropDownButton(e.target.checked)}
          />
          showDropDownButton
        </label>
      </div>

      <div className="w-80">
        <SgAutocomplete
          id="ac-playground"
          label="Country"
          source={source}
          minLengthForSearch={1}
          grouped={grouped}
          showDropDownButton={showDropDownButton}
          openOnFocus
          mapItem={(raw: Country) => ({
            id: raw.id,
            label: raw.description,
            group: raw.description[0]
          })}
          onSelect={(item) => setSelected({ id: item.id, label: item.label })}
        />
      </div>

      <div className="rounded border border-border bg-muted/30 p-3 text-xs">
        {selected ? \`Selecionado: \${selected.label} (id \${selected.id})\` : "Nenhum item selecionado"}
      </div>
    </div>
  );
}`;

type Country = {
  id: number;
  description: string;
  code: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Afghanistan", code: "AF" },
  { id: 2, description: "Albania", code: "AL" },
  { id: 3, description: "Algeria", code: "DZ" },
  { id: 4, description: "American Samoa", code: "AS" },
  { id: 5, description: "Andorra", code: "AD" },
  { id: 6, description: "Angola", code: "AO" },
  { id: 7, description: "Argentina", code: "AR" },
  { id: 8, description: "Australia", code: "AU" },
  { id: 9, description: "Brazil", code: "BR" },
  { id: 10, description: "Canada", code: "CA" },
  { id: 11, description: "Central African Republic", code: "CF" },
  { id: 12, description: "Chile", code: "CL" },
  { id: 13, description: "Colombia", code: "CO" },
  { id: 14, description: "France", code: "FR" },
  { id: 15, description: "Germany", code: "DE" },
  { id: 16, description: "India", code: "IN" },
  { id: 17, description: "South Africa", code: "ZA" },
  { id: 18, description: "United States", code: "US" }
];

const source = async (query: string) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const q = query.toLowerCase();
  return COUNTRIES.filter((c) => c.description.toLowerCase().includes(q));
};

export default function SgAutocompletePage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({ deps: [i18n.locale] });
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
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.autocomplete.title")}
          subtitle={t(i18n, "showcase.component.autocomplete.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={t(i18n, "showcase.component.autocomplete.sections.basic.title")}
        description={t(i18n, "showcase.component.autocomplete.sections.basic.description")}
      >
        <div className="w-80">
          <SgAutocomplete
            id="ac-basic"
            label={t(i18n, "showcase.component.autocomplete.labels.country")}
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
            {t(i18n, "showcase.component.autocomplete.labels.selected")}: {selectedLabel
              ? `${selectedLabel} (id ${selectedId})`
              : t(i18n, "showcase.component.autocomplete.labels.none")}
          </p>
          {selectedItem ? (
            <pre className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs">{JSON.stringify(selectedItem, null, 2)}</pre>
          ) : null}
        </div>
        <CodeBlock code={wrapExample(
          t(i18n, "showcase.component.autocomplete.labels.country"),
          `const [selected, setSelected] = React.useState<SgAutocompleteItem | null>(null);

<SgAutocomplete
  id="country"
  name="country"
  control={control}
  label=""
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
) : null}`
        )} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.autocomplete.sections.custom.title")}
        description={t(i18n, "showcase.component.autocomplete.sections.custom.description")}
      >
        <div className="w-80">
          <SgAutocomplete
            id="ac-custom"
            label={t(i18n, "showcase.component.autocomplete.labels.country")}
            source={source}
            mapItem={mapItem}
            renderItem={(item) => {
              const data = item.data as Country;
              return (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{data.code}</span>
                  <span>{item.label}</span>
                </div>
              );
            }}
          />
        </div>
        <CodeBlock code={wrapExample(
          t(i18n, "showcase.component.autocomplete.labels.country"),
          `<SgAutocomplete
  id="country"
  name="country"
  control={control}
  label=""
  source={source}
  mapItem={mapItem}
  renderItem={(item) => (
    <div className="flex items-center gap-2">
      <span>{item.data.code}</span>
      <span>{item.label}</span>
    </div>
  )}
/>`
        )} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.autocomplete.sections.grouped.title")}
        description={t(i18n, "showcase.component.autocomplete.sections.grouped.description")}
      >
        <div className="w-80">
          <SgAutocomplete
            id="ac-grouped"
            label={t(i18n, "showcase.component.autocomplete.labels.country")}
            source={source}
            mapItem={mapItem}
            grouped
          />
        </div>
        <CodeBlock code={wrapExample(
          t(i18n, "showcase.component.autocomplete.labels.country"),
          `<SgAutocomplete
  id="country"
  name="country"
  control={control}
  label=""
  source={source}
  mapItem={mapItem}
  grouped
/>`
        )} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.autocomplete.sections.dropdown.title")}
        description={t(i18n, "showcase.component.autocomplete.sections.dropdown.description")}
      >
        <div className="w-80">
          <SgAutocomplete
            id="ac-dropdown"
            label={t(i18n, "showcase.component.autocomplete.labels.country")}
            source={source}
            mapItem={mapItem}
            showDropDownButton
            openOnFocus
          />
        </div>
        <CodeBlock code={wrapExample(
          t(i18n, "showcase.component.autocomplete.labels.country"),
          `<SgAutocomplete
  id="country"
  name="country"
  control={control}
  label=""
  source={source}
  showDropDownButton
  openOnFocus
/>`
        )} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.autocomplete.sections.footer.title")}
        description={t(i18n, "showcase.component.autocomplete.sections.footer.description")}
      >
        <div className="w-80">
          <SgAutocomplete
            id="ac-footer"
            label={t(i18n, "showcase.component.autocomplete.labels.country")}
            source={source}
            mapItem={mapItem}
            renderFooter={(query, hasResults) => (
              <button
                type="button"
                className="w-full rounded bg-primary px-3 py-2 text-sm font-semibold text-white"
              >
                {hasResults
                  ? t(i18n, "showcase.component.autocomplete.actions.addQuery", { query })
                  : t(i18n, "showcase.component.autocomplete.actions.addNew")}
              </button>
            )}
          />
        </div>
        <CodeBlock code={wrapExample(
          t(i18n, "showcase.component.autocomplete.labels.country"),
          `<SgAutocomplete
  id="country"
  name="country"
  control={control}
  label=""
  source={source}
  renderFooter={(query) => (
    <button>${t(i18n, "showcase.component.autocomplete.actions.addNew")} \\"{query}\\"</button>
  )}
/>`
        )} />
      </Section>

      <Section
        title={t(i18n, "showcase.component.autocomplete.sections.minLength.title")}
        description={t(i18n, "showcase.component.autocomplete.sections.minLength.description")}
      >
        <div className="w-80">
          <SgAutocomplete
            id="ac-min"
            label={t(i18n, "showcase.component.autocomplete.labels.country")}
            source={source}
            mapItem={mapItem}
            minLengthForSearch={3}
          />
        </div>
        <CodeBlock code={wrapExample(
          t(i18n, "showcase.component.autocomplete.labels.country"),
          `<SgAutocomplete
  id="country"
  name="country"
  control={control}
  label=""
  source={source}
          minLengthForSearch={3}
/>`
        )} />
      </Section>

      <Section
        title="7) Border radius"
        description="Aplica o raio no input e no dropdown."
      >
        <div className="w-80">
          <SgAutocomplete
            id="ac-radius"
            label="Country"
            source={source}
            mapItem={mapItem}
            minLengthForSearch={1}
            showDropDownButton
            openOnFocus
            borderRadius={14}
          />
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgAutocomplete, type SgAutocompleteItem } from "@seedgrid/fe-components";

type Country = {
  id: number;
  description: string;
  code: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Afghanistan", code: "AF" },
  { id: 2, description: "Albania", code: "AL" },
  { id: 3, description: "Brazil", code: "BR" },
  { id: 4, description: "South Africa", code: "ZA" }
];

const source = async (query: string) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const q = query.toLowerCase();
  return COUNTRIES.filter((c) => c.description.toLowerCase().includes(q));
};

const mapItem = (raw: Country): SgAutocompleteItem => ({
  id: raw.id,
  label: raw.description,
  group: raw.description[0],
  data: raw
});

export default function Example() {
  return (
    <div className="w-80">
      <SgAutocomplete
        id="ac-radius"
        label="Country"
        source={source}
        mapItem={mapItem}
        minLengthForSearch={1}
        showDropDownButton
        openOnFocus
        borderRadius={14}
      />
    </div>
  );
}`}
        />
      </Section>

      <Section
        title="8) Playground"
        description="Simule as principais props do SgAutocomplete em tempo real."
      >
        <SgPlayground
          title="SgAutocomplete Playground"
          interactive
          codeContract="appFile"
          code={AUTOCOMPLETE_PLAYGROUND_APP_FILE}
          height={620}
          defaultOpen
        />
      </Section>

      <section
        id="props-reference"
        className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
      >
        <h2 data-anchor-title="true" className="text-lg font-semibold">Referência de Props</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">Prop</th>
                <th className="pb-2 pr-4 font-semibold">Tipo</th>
                <th className="pb-2 pr-4 font-semibold">Padrão</th>
                <th className="pb-2 font-semibold">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-2 pr-4 font-mono text-xs">id</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Identificador do componente.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">label</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">-</td><td className="py-2">Texto do campo.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">source</td><td className="py-2 pr-4">array | async function</td><td className="py-2 pr-4">-</td><td className="py-2">Origem dos itens pesquisáveis.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">mapItem</td><td className="py-2 pr-4">(raw) =&gt; item</td><td className="py-2 pr-4">auto</td><td className="py-2">Mapeamento do item bruto para item visual.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">grouped</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Agrupa itens por `group`.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">minLengthForSearch</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">0</td><td className="py-2">Quantidade mínima de caracteres para pesquisar.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showDropDownButton</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Exibe botão para abrir lista.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">-</td><td className="py-2">Define o raio de borda do campo e do dropdown.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">openOnFocus</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Abre lista ao focar.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderItem / renderFooter</td><td className="py-2 pr-4">functions</td><td className="py-2 pr-4">-</td><td className="py-2">Renderizações customizadas dos itens e rodapé.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onSelect</td><td className="py-2 pr-4">(item) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Callback quando item é selecionado.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
    </div>
    </I18NReady>
  );
}
