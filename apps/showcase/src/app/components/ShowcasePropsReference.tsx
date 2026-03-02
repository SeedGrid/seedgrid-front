"use client";

import React from "react";
import { useShowcaseI18n, type ShowcaseLocale } from "../../i18n";

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

const PROPS_REFERENCE_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", PropsReferenceTexts> = {
  "pt-BR": {
    title: "Referencia de Props",
    colProp: "Prop",
    colType: "Tipo",
    colDefault: "Padrao",
    colDescription: "Descricao"
  },
  "pt-PT": {
    title: "Referencia de Props",
    colProp: "Prop",
    colType: "Tipo",
    colDefault: "Padrao",
    colDescription: "Descricao"
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
    colDescription: "Descripcion"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof PROPS_REFERENCE_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

export default function ShowcasePropsReference(props: Readonly<ShowcasePropsReferenceProps>) {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof PROPS_REFERENCE_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "pt-BR";
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
                <td className="py-2">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

