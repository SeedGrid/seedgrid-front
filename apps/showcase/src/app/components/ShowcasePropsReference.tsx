"use client";

import React from "react";

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

export default function ShowcasePropsReference(props: Readonly<ShowcasePropsReferenceProps>) {
  const sectionId = props.id ?? "props-reference";
  const sectionTitle = props.title ?? "Referência de Props";

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
              <th className="pb-2 pr-4 font-semibold">Prop</th>
              <th className="pb-2 pr-4 font-semibold">Tipo</th>
              <th className="pb-2 pr-4 font-semibold">Padrão</th>
              <th className="pb-2 font-semibold">Descrição</th>
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
