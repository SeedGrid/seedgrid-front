"use client";

import React from "react";
import { SgBadge, SgCard } from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../../i18n";

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function extractSeedGridSymbols(code: string) {
  const symbols: string[] = code.match(/\bSg[A-Z][A-Za-z0-9_]*\b/g) ?? [];
  if (/\btoast\b/.test(code)) symbols.push("toast");
  return unique(symbols).sort((a, b) => a.localeCompare(b));
}

function extractImportedSymbolsFromNamedImports(code: string, moduleName: string) {
  const symbols = new Set<string>();
  const regex = new RegExp(
    `import\\s*(?:type\\s*)?\\{([^}]*)\\}\\s*from\\s*["']${moduleName.replace("/", "\\/")}["'];?`,
    "g"
  );

  let match = regex.exec(code);
  while (match) {
    const raw = match[1] ?? "";
    const parts = raw.split(",").map((part) => part.trim()).filter(Boolean);
    for (const part of parts) {
      const asMatch = part.match(/\bas\b\s+([A-Za-z_][A-Za-z0-9_]*)$/);
      if (asMatch?.[1]) {
        symbols.add(asMatch[1]);
      } else {
        symbols.add(part.replace(/^type\s+/, "").trim());
      }
    }
    match = regex.exec(code);
  }

  return symbols;
}

function extractReactHookFormSymbols(code: string) {
  const candidates = ["useForm", "Controller", "useController", "FieldValues"];
  return candidates.filter((name) => new RegExp(`\\b${name}\\b`).test(code));
}

function normalizeShowcaseCode(code: string) {
  const hasAnyImport = /^\s*import\s/m.test(code);
  const hasReactImport = /from\s+["']react["']/.test(code);
  const seedGridSymbols = extractSeedGridSymbols(code);
  const hasSeedGridNamespaceImport = /import\s+\*\s+as\s+[A-Za-z_][A-Za-z0-9_]*\s+from\s+["']@seedgrid\/fe-components["']/.test(code);
  const importedSeedGridSymbols = extractImportedSymbolsFromNamedImports(code, "@seedgrid/fe-components");
  const missingSeedGridSymbols = hasSeedGridNamespaceImport
    ? []
    : seedGridSymbols.filter((symbol) => !importedSeedGridSymbols.has(symbol));

  const hasRhfNamespaceImport = /import\s+\*\s+as\s+[A-Za-z_][A-Za-z0-9_]*\s+from\s+["']react-hook-form["']/.test(code);
  const importedRhfSymbols = extractImportedSymbolsFromNamedImports(code, "react-hook-form");
  const rhfSymbols = extractReactHookFormSymbols(code);
  const missingRhfSymbols = hasRhfNamespaceImport
    ? []
    : rhfSymbols.filter((symbol) => !importedRhfSymbols.has(symbol));

  const prepend: string[] = [];
  if (!hasReactImport) {
    prepend.push(`import React from "react";`);
  }
  if (missingSeedGridSymbols.length > 0) {
    prepend.push(`import { ${missingSeedGridSymbols.join(", ")} } from "@seedgrid/fe-components";`);
  }
  if (missingRhfSymbols.length > 0) {
    prepend.push(`import { ${missingRhfSymbols.join(", ")} } from "react-hook-form";`);
  }

  if (prepend.length === 0) return code;
  return `${prepend.join("\n")}${hasAnyImport ? "\n" : "\n\n"}${code}`;
}

export default function sgCodeBlockBase(props: { code: string }) {
  const i18n = useShowcaseI18n();
  const [copied, setCopied] = React.useState(false);
  const displayCode = React.useMemo(() => normalizeShowcaseCode(props.code), [props.code]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <SgCard
      title={t(i18n, "showcase.common.code.title")}
      description={t(i18n, "showcase.common.code.description")}
      cardStyle="elevated"
      trailing={
        <SgBadge
          value={t(i18n, "showcase.common.code.badge")}
          size="xs"
          badgeStyle="outline"
          severity="primary"
          hint={t(i18n, "showcase.common.code.hint")}
        />
      }
      collapsible
      defaultOpen={false}
      bodyClassName="pt-2"
    >
      <div className="relative">
        <button
          type="button"
          onClick={onCopy}
          className="absolute right-2 top-2 rounded border border-border bg-background/90 px-2 py-1 text-[11px] text-foreground/70 hover:text-foreground"
        >
          {copied ? t(i18n, "showcase.common.code.copied") : t(i18n, "showcase.common.code.copy")}
        </button>
        <pre className="mt-3 rounded-md bg-foreground/5 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
          {displayCode}
        </pre>
      </div>
    </SgCard>
  );
}
