"use client";

import React from "react";
import { SgAutocomplete, type SgAutocompleteItem } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";
import { loadSample } from "./samples/loadSample";

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
  return (
    <SgCodeBlockBase
      code={props.code}
      interactive
      codeContract="appFile"
      title="Autocomplete Playground"
      dependencies={{
        "react-hook-form": "^7.0.0"
      }}
    />
  );
}

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
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.autocomplete.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.autocomplete.subtitle")}
        </p>
      </div>

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
        <CodeBlock code={loadSample("sg-autocomplete-example-01.src")} />
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
        <CodeBlock code={loadSample("sg-autocomplete-example-02.src")} />
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
        <CodeBlock code={loadSample("sg-autocomplete-example-03.src")} />
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
        <CodeBlock code={loadSample("sg-autocomplete-example-04.src")} />
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
        <CodeBlock code={loadSample("sg-autocomplete-example-05.src")} />
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
        <CodeBlock code={loadSample("sg-autocomplete-example-06.src")} />
      </Section>
    </div>
  );
}


