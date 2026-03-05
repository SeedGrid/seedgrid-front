"use client";

import React from "react";
import { useShowcaseI18n, type ShowcaseLocale } from "../../i18n";
import propsDescriptionTranslations from "../../i18n/showcase-props-descriptions.json";

export type ShowcasePropRow = {
  prop: string;
  type: string;
  defaultValue: string;
  description: string;
};

type ShowcasePropsReferenceProps = {
  rows: ShowcasePropRow[];
  id?: string;
  title?: string;
};

type PropsReferenceTexts = {
  title: string;
  colProp: string;
  colType: string;
  colDefault: string;
  colDescription: string;
};

type PropDescriptionTranslation = {
  pt: string;
  en: string;
  es: string;
};

const PROPS_REFERENCE_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", PropsReferenceTexts> = {
  "pt-BR": {
    title: "Referência de Props",
    colProp: "Prop",
    colType: "Tipo",
    colDefault: "Padrão",
    colDescription: "Descrição"
  },
  "pt-PT": {
    title: "Referência de Props",
    colProp: "Prop",
    colType: "Tipo",
    colDefault: "Padrão",
    colDescription: "Descrição"
  },
  "en-US": {
    title: "Props Reference",
    colProp: "Prop",
    colType: "Type",
    colDefault: "Default",
    colDescription: "Description"
  },
  es: {
    title: "Referencia de Props",
    colProp: "Prop",
    colType: "Tipo",
    colDefault: "Predeterminado",
    colDescription: "Descripción"
  }
};

const PROPS_DESCRIPTION_TRANSLATIONS = propsDescriptionTranslations as Record<string, PropDescriptionTranslation>;

function getLocalizedPropDescription(description: string, locale: keyof typeof PROPS_REFERENCE_TEXTS): string {
  const translations = PROPS_DESCRIPTION_TRANSLATIONS[description];
  if (!translations) return description;

  if (locale === "en-US") return translations.en;
  if (locale === "es") return translations.es;
  return translations.pt;
}

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof PROPS_REFERENCE_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function ShowcasePropsReference(props: Readonly<ShowcasePropsReferenceProps>) {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof PROPS_REFERENCE_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = PROPS_REFERENCE_TEXTS[locale];
  const sectionId = props.id ?? "props-reference";
  const sectionTitle = props.title ?? texts.title;

  return (
    <section
      id={sectionId}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{sectionTitle}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4 font-semibold">{texts.colProp}</th>
              <th className="pb-2 pr-4 font-semibold">{texts.colType}</th>
              <th className="pb-2 pr-4 font-semibold">{texts.colDefault}</th>
              <th className="pb-2 font-semibold">{texts.colDescription}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {props.rows.map((row) => (
              <tr key={row.prop}>
                <td className="py-2 pr-4 font-mono text-xs">{row.prop}</td>
                <td className="py-2 pr-4">{row.type}</td>
                <td className="py-2 pr-4">{row.defaultValue}</td>
                <td className="py-2">{getLocalizedPropDescription(row.description, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
