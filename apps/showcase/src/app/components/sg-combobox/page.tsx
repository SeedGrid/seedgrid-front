"use client";

import React from "react";
import { SgButton, SgCombobox, SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode; example?: boolean }) {
  return (
    <section
      id={props.id}
      data-showcase-example={props.example === false ? undefined : "true"}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

type Country = {
  id: number;
  description: string;
  code: string;
  region: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Brazil", code: "BR", region: "Americas" },
  { id: 2, description: "Argentina", code: "AR", region: "Americas" },
  { id: 3, description: "United States", code: "US", region: "Americas" },
  { id: 4, description: "Canada", code: "CA", region: "Americas" },
  { id: 5, description: "Germany", code: "DE", region: "Europe" },
  { id: 6, description: "France", code: "FR", region: "Europe" },
  { id: 7, description: "Portugal", code: "PT", region: "Europe" },
  { id: 8, description: "India", code: "IN", region: "Asia" },
  { id: 9, description: "Japan", code: "JP", region: "Asia" },
  { id: 10, description: "Australia", code: "AU", region: "Oceania" }
];

const PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";

const SgComboboxFromLib = (SeedGrid as Record<string, unknown>).SgCombobox as
  | React.ComponentType<any>
  | undefined;

type Country = {
  id: number;
  description: string;
  code: string;
  region: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Brazil", code: "BR", region: "Americas" },
  { id: 2, description: "Argentina", code: "AR", region: "Americas" },
  { id: 3, description: "United States", code: "US", region: "Americas" },
  { id: 4, description: "Canada", code: "CA", region: "Americas" },
  { id: 5, description: "Germany", code: "DE", region: "Europe" },
  { id: 6, description: "France", code: "FR", region: "Europe" },
  { id: 7, description: "Portugal", code: "PT", region: "Europe" },
  { id: 8, description: "India", code: "IN", region: "Asia" },
  { id: 9, description: "Japan", code: "JP", region: "Asia" }
];

function LocalSelectFallback(props: {
  label: string;
  value: string;
  grouped: boolean;
  source: Country[];
  onChange: (next: string) => void;
}) {
  const groups = props.source.reduce<Record<string, Country[]>>((acc, item) => {
    const key = item.region || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-md space-y-1">
      <label className="text-sm font-medium">{props.label}</label>
      <select
        className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {props.grouped
          ? Object.keys(groups).map((group) => (
              <optgroup key={group} label={group}>
                {(groups[group] ?? []).map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.description} ({item.code})
                  </option>
                ))}
              </optgroup>
            ))
          : props.source.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.description} ({item.code})
              </option>
            ))}
      </select>
    </div>
  );
}

export default function App() {
  const hasCombobox = typeof SgComboboxFromLib === "function";
  const [selectedId, setSelectedId] = React.useState<string>("");
  const [grouped, setGrouped] = React.useState(true);
  const [openOnFocus, setOpenOnFocus] = React.useState(true);
  const [asyncMode, setAsyncMode] = React.useState(false);
  const selectedByValue = COUNTRIES.find((item) => String(item.id) === selectedId) ?? null;

  const source = React.useCallback(async () => {
    if (asyncMode) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return COUNTRIES;
  }, [asyncMode]);

  return (
    <div className="space-y-4 p-2">
      {!hasCombobox ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgCombobox ainda nao esta disponivel na versao publicada usada pelo Sandpack. Exibindo fallback local.
        </div>
      ) : null}

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
            checked={openOnFocus}
            onChange={(e) => setOpenOnFocus(e.target.checked)}
          />
          openOnFocus
        </label>
        <label className="text-sm inline-flex items-center gap-1">
          <input
            className="mr-1"
            type="checkbox"
            checked={asyncMode}
            onChange={(e) => setAsyncMode(e.target.checked)}
          />
          source async
        </label>
      </div>

      {hasCombobox ? (
        <SgComboboxFromLib
          id="cb-playground"
          label="Country"
          value={selectedId}
          source={source}
          grouped={grouped}
          openOnFocus={openOnFocus}
          loadingText="Loading countries..."
          mapItem={(raw: Country) => ({
            id: raw.id,
            label: raw.description,
            value: raw.code,
            group: raw.region
          })}
          onValueChange={(next: string | number | null) => setSelectedId(next == null ? "" : String(next))}
          renderFooter={(_, hasResults) => (
            <div className="text-xs text-slate-500">{hasResults ? "Select one option" : "No records found"}</div>
          )}
        />
      ) : (
        <LocalSelectFallback
          label="Country"
          value={selectedId}
          grouped={grouped}
          source={COUNTRIES}
          onChange={(next) => {
            setSelectedId(next);
          }}
        />
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={() => setSelectedId("5")}
        >
          Set Germany (id 5)
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={() => setSelectedId("9")}
        >
          Set Japan (id 9)
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={() => setSelectedId("")}
        >
          Clear
        </button>
      </div>

      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        <div><strong>hint:</strong> focus and type letters (B, G, J) to jump like select</div>
        <div><strong>value:</strong> {selectedId || "(none)"}</div>
        <div><strong>selected:</strong> {selectedByValue ? selectedByValue.description + " (" + selectedByValue.code + ")" : "(none)"}</div>
      </div>
    </div>
  );
}`;

export default function SgComboboxPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | number | null>(null);
  const [selectedControlled, setSelectedControlled] = React.useState<Country | null>(null);
  const [selectedAsync, setSelectedAsync] = React.useState<Country | null>(null);
  const selectedByValue = React.useMemo(
    () => COUNTRIES.find((item) => String(item.id) === String(selectedId ?? "")) ?? null,
    [selectedId]
  );

  const asyncSource = React.useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return COUNTRIES;
  }, []);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgCombobox"
          subtitle={
            <>
              Combobox no estilo <code>select</code>, sem digitação livre. O item selecionado vem de
              <code> source</code> e o evento <code>onSelect</code> devolve o objeto selecionado.
            </>
          }
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title="1) Basico com lista de objetos"
          description='Sem input livre: com foco no campo, digite letras e ele "pula" para o item correspondente.'
        >
          <div className="w-96">
            <SgCombobox<Country>
              id="cb-basic"
              label="Pais"
              source={COUNTRIES}
              openOnFocus
              grouped
              mapItem={(raw) => ({
                id: raw.id,
                label: raw.description,
                value: raw.code,
                group: raw.region
              })}
              onSelect={(value) => setSelectedCountry(value)}
            />
            <div className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs">
              {selectedCountry ? JSON.stringify(selectedCountry, null, 2) : "Nenhum item selecionado"}
            </div>
          </div>
          <CodeBlockBase
            code={`const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(null);

<SgCombobox<Country>
  id="cb-basic"
  label="Pais"
  source={COUNTRIES}
  openOnFocus
  grouped
  mapItem={(raw) => ({
    id: raw.id,
    label: raw.description,
    value: raw.code,
    group: raw.region
  })}
  onSelect={setSelectedCountry}
/>

<div>
  {selectedCountry ? JSON.stringify(selectedCountry, null, 2) : "Nenhum item selecionado"}
</div>`}
          />
        </Section>

        <Section
          title="2) Controlado por value"
          description="Use value/onValueChange para setar um valor valido programaticamente."
        >
          <div className="w-96">
            <SgCombobox<Country>
              id="cb-controlled"
              label="Pais (controlado)"
              value={selectedId}
              source={COUNTRIES}
              openOnFocus
              mapItem={(raw) => ({
                id: raw.id,
                label: `${raw.description} (${raw.code})`,
                value: raw.code,
                group: raw.region
              })}
              onValueChange={setSelectedId}
              onSelect={setSelectedControlled}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <SgButton size="sm" appearance="outline" onClick={() => setSelectedId(5)}>
                Setar Germany (id 5)
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setSelectedId(9)}>
                Setar Japan (id 9)
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setSelectedId(null)}>
                Limpar value
              </SgButton>
            </div>
            <div className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs">
              <div>value: {selectedId == null || selectedId === "" ? "(vazio)" : String(selectedId)}</div>
              <div>
                resolvido pelo value:{" "}
                {selectedByValue ? `${selectedByValue.description} (${selectedByValue.code})` : "(nenhum)"}
              </div>
              <div>
                ultimo onSelect:{" "}
                {selectedControlled ? `${selectedControlled.description} (${selectedControlled.code})` : "(nenhum)"}
              </div>
            </div>
          </div>
          <CodeBlockBase
            code={`const [selectedId, setSelectedId] = React.useState<string | number | null>(null);
const [selectedControlled, setSelectedControlled] = React.useState<Country | null>(null);
const selectedByValue = COUNTRIES.find((item) => String(item.id) === String(selectedId ?? "")) ?? null;

<SgCombobox<Country>
  id="cb-controlled"
  label="Pais (controlado)"
  value={selectedId}
  source={COUNTRIES}
  openOnFocus
  mapItem={(raw) => ({
    id: raw.id,
    label: \`\${raw.description} (\${raw.code})\`,
    value: raw.code,
    group: raw.region
  })}
  onValueChange={setSelectedId}
  onSelect={setSelectedControlled}
/>

<SgButton onClick={() => setSelectedId(5)}>Setar Germany (id 5)</SgButton>
<SgButton onClick={() => setSelectedId(9)}>Setar Japan (id 9)</SgButton>
<SgButton onClick={() => setSelectedId(null)}>Limpar value</SgButton>

<div>
  <div>value: {selectedId == null || selectedId === "" ? "(vazio)" : String(selectedId)}</div>
  <div>
    resolvido pelo value: {selectedByValue ? \`\${selectedByValue.description} (\${selectedByValue.code})\` : "(nenhum)"}
  </div>
  <div>
    ultimo onSelect: {selectedControlled ? \`\${selectedControlled.description} (\${selectedControlled.code})\` : "(nenhum)"}
  </div>
</div>`}
          />
        </Section>

        <Section
          title="3) Source async + custom render"
          description="Suporte a loadingText, renderItem, renderGroupHeader, renderFooter e itemTooltip."
        >
          <div className="w-96">
            <SgCombobox<Country>
              id="cb-async"
              label="Pais (async)"
              source={asyncSource}
              openOnFocus
              grouped
              loadingText="Carregando paises..."
              mapItem={(raw) => ({
                id: raw.id,
                label: raw.description,
                value: raw.code,
                group: raw.region
              })}
              renderGroupHeader={(group) => <span className="uppercase tracking-wide">{group}</span>}
              renderItem={(item) => (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{item.value}</span>
                  <span>{item.label}</span>
                </div>
              )}
              itemTooltip={(item) => <span>{item.label}</span>}
              renderFooter={(_, hasResults) => (
                <span className="text-xs text-muted-foreground">
                  {hasResults ? "Selecione um item da lista." : "Sem registros."}
                </span>
              )}
              onSelect={setSelectedAsync}
            />
            <div className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs">
              {selectedAsync ? `Selecionado: ${selectedAsync.description} (${selectedAsync.code})` : "Nenhum item selecionado"}
            </div>
          </div>
          <CodeBlockBase
            code={`const source = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return COUNTRIES;
};
const [selectedAsync, setSelectedAsync] = React.useState<Country | null>(null);

<SgCombobox<Country>
  id="cb-async"
  label="Pais (async)"
  source={source}
  openOnFocus
  grouped
  loadingText="Carregando paises..."
  mapItem={(raw) => ({
    id: raw.id,
    label: raw.description,
    value: raw.code,
    group: raw.region
  })}
  renderGroupHeader={(group) => <span className="uppercase tracking-wide">{group}</span>}
  renderItem={(item) => (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold">{item.value}</span>
      <span>{item.label}</span>
    </div>
  )}
  itemTooltip={(item) => <span>{item.label}</span>}
  renderFooter={(_, hasResults) => (
    <span className="text-xs text-muted-foreground">
      {hasResults ? "Selecione um item da lista." : "Sem registros."}
    </span>
  )}
  onSelect={setSelectedAsync}
/>

<div>
  {selectedAsync ? \`Selecionado: \${selectedAsync.description} (\${selectedAsync.code})\` : "Nenhum item selecionado"}
</div>`}
          />
        </Section>

        <Section
          title="4) Border radius"
          description="Aplica o raio no input e no dropdown."
        >
          <div className="w-96">
            <SgCombobox<Country>
              id="cb-radius"
              label="Pais com raio customizado"
              source={COUNTRIES}
              openOnFocus
              grouped
              borderRadius={14}
              mapItem={(raw) => ({
                id: raw.id,
                label: raw.description,
                value: raw.code,
                group: raw.region
              })}
            />
          </div>
          <CodeBlockBase
            code={`import React from "react";
import { SgCombobox } from "@seedgrid/fe-components";

type Country = {
  id: number;
  description: string;
  code: string;
  region: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Brazil", code: "BR", region: "Americas" },
  { id: 2, description: "Argentina", code: "AR", region: "Americas" },
  { id: 3, description: "United States", code: "US", region: "Americas" },
  { id: 4, description: "Canada", code: "CA", region: "Americas" },
  { id: 5, description: "Germany", code: "DE", region: "Europe" },
  { id: 6, description: "France", code: "FR", region: "Europe" },
  { id: 7, description: "Portugal", code: "PT", region: "Europe" },
  { id: 8, description: "India", code: "IN", region: "Asia" },
  { id: 9, description: "Japan", code: "JP", region: "Asia" },
  { id: 10, description: "Australia", code: "AU", region: "Oceania" }
];

export default function Example() {
  return (
    <div className="w-96">
      <SgCombobox<Country>
        id="cb-radius"
        label="Pais com raio customizado"
        source={COUNTRIES}
        openOnFocus
        grouped
        borderRadius={14}
        mapItem={(raw) => ({
          id: raw.id,
          label: raw.description,
          value: raw.code,
          group: raw.region
        })}
      />
    </div>
  );
}`}
          />
        </Section>

        <Section
          title="5) Playground (SgPlayground)"
          description="Simule cenarios com source local/async, grouped, openOnFocus e eventos."
        >
          <SgPlayground
            title="SgCombobox Playground"
            interactive
            codeContract="appFile"
            code={PLAYGROUND_APP_FILE}
            height={560}
            defaultOpen
          />
        </Section>

        <section
          id="props-reference"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">Referência de Props</h2>
          <p className="mt-1 text-sm text-muted-foreground">Propriedades públicas do SgCombobox.</p>
          <div className="mt-4 w-full overflow-x-auto">
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
                <tr><td className="py-2 pr-4 font-mono text-xs">source</td><td className="py-2 pr-4">array | async function</td><td className="py-2 pr-4">-</td><td className="py-2">Origem dos itens da lista.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">value</td><td className="py-2 pr-4">string | number | null</td><td className="py-2 pr-4">null</td><td className="py-2">Valor selecionado no modo controlado.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onValueChange</td><td className="py-2 pr-4">(value) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Dispara quando o valor muda.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onSelect</td><td className="py-2 pr-4">(item) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Retorna o item selecionado.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">mapItem</td><td className="py-2 pr-4">(raw) =&gt; item</td><td className="py-2 pr-4">auto</td><td className="py-2">Mapeia item bruto para formato do combobox.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">grouped / groupped</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Agrupa os itens por grupo.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">openOnFocus</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Abre a lista ao focar.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">-</td><td className="py-2">Define o raio de borda do campo e do dropdown.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">loadingText / emptyText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">i18n</td><td className="py-2">Textos para carregamento e lista vazia.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">renderItem</td><td className="py-2 pr-4">(item, isActive) =&gt; ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Renderização customizada do item.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">renderGroupHeader</td><td className="py-2 pr-4">(group) =&gt; ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Renderização customizada do cabeçalho de grupo.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">renderFooter</td><td className="py-2 pr-4">(query, hasResults) =&gt; ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Renderização customizada do rodapé da lista.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">itemTooltip</td><td className="py-2 pr-4">(item) =&gt; ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Conteúdo de tooltip para item.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
