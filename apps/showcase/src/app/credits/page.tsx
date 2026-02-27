"use client";

import React from "react";

interface ThirdPartyLib {
  name: string;
  version: string;
  license: string;
  url: string;
  description: string;
  usedIn: string;
}

const THIRD_PARTY_LIBS: ThirdPartyLib[] = [
  {
    name: "@pqina/flip",
    version: "1.8.4",
    license: "MIT",
    url: "https://pqina.nl/flip/",
    description: "Beautifully animated flip clock component. Powers the flip animation in SgFlipDigit.",
    usedIn: "SgFlipDigit",
  },
  {
    name: "@codesandbox/sandpack-react",
    version: "2.x",
    license: "Apache-2.0",
    url: "https://sandpack.codesandbox.io/",
    description: "In-browser code editor and live preview used in the interactive playground.",
    usedIn: "SgPlayground",
  },
  {
    name: "qrcode",
    version: "1.x",
    license: "MIT",
    url: "https://github.com/soldair/node-qrcode",
    description: "QR code generator for Node.js and the browser.",
    usedIn: "SgQRCode",
  },
  {
    name: "@tiptap/react",
    version: "2.x",
    license: "MIT",
    url: "https://tiptap.dev/",
    description: "Headless, framework-agnostic rich text editor built on ProseMirror.",
    usedIn: "SgTextEditor",
  },
  {
    name: "lucide-react",
    version: "0.468+",
    license: "ISC",
    url: "https://lucide.dev/",
    description: "Clean and consistent icon library used throughout the component set.",
    usedIn: "Varios componentes",
  },
];

const LICENSE_COLORS: Record<string, string> = {
  MIT: "bg-emerald-100 text-emerald-800",
  "Apache-2.0": "bg-sky-100 text-sky-800",
  ISC: "bg-violet-100 text-violet-800",
};

export default function CreditsPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Creditos e Bibliotecas de Terceiros</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Listagem de todas as bibliotecas open-source utilizadas nos componentes da Seedgrid,
          com suas respectivas licencas e links de referencia.
        </p>
      </div>

      <div className="space-y-4">
        {THIRD_PARTY_LIBS.map((lib) => (
          <div
            key={lib.name}
            className="rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <a
                  href={lib.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-base font-semibold text-primary hover:underline"
                >
                  {lib.name}
                </a>
                <span className="text-xs text-muted-foreground">v{lib.version}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "rounded px-2 py-0.5 text-xs font-medium",
                    LICENSE_COLORS[lib.license] ?? "bg-gray-100 text-gray-700",
                  ].join(" ")}
                >
                  {lib.license}
                </span>
                <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {lib.usedIn}
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{lib.description}</p>
            <a
              href={lib.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-muted-foreground hover:text-primary hover:underline"
            >
              {lib.url}
            </a>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        <p>
          Todas as bibliotecas listadas acima sao distribuidas sob licencas compatíveis com uso
          open-source e comercial. Os creditos acima sao fornecidos conforme exigido por cada
          licenca.
        </p>
      </div>
    </div>
  );
}
