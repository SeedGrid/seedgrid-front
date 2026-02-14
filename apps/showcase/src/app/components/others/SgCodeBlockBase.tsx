"use client";

import * as React from "react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  type SandpackFiles,
  useSandpack
} from "@codesandbox/sandpack-react";
import { SgButton } from "@seedgrid/fe-components";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgCodeBlockBaseProps = {
  code: string;
  interactive?: boolean;
  codeContract?: "renderBody" | "appFile";
  title?: string;
  height?: number;
  className?: string;
  dependencies?: Record<string, string>;
  defaultImports?: string;
  previewWrapperClassName?: string;
  seedgridDependency?: string;
};

function ReadonlyBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

function buildAppTsxFromRenderBody(
  renderBody: string,
  defaultImports: string,
  wrapperClassName?: string
) {
  const body = renderBody
    .replace(/\t/g, "  ")
    .split("\n")
    .map((line) => (line ? `        ${line}` : ""))
    .join("\n");

  if (!wrapperClassName) {
    return `import * as React from "react";
${defaultImports}

export default function App() {
  return (
    <>
${body}
    </>
  );
}
`;
  }

  return `import * as React from "react";
${defaultImports}

export default function App() {
  return (
    <div className="${wrapperClassName}">
      <>
${body}
      </>
    </div>
  );
}
`;
}

function RunButton() {
  const { sandpack } = useSandpack();

  return (
    <SgButton severity="primary" size="sm" onClick={() => sandpack.runSandpack()}>
      Run
    </SgButton>
  );
}

export default function SgCodeBlockBase(props: Readonly<SgCodeBlockBaseProps>) {
  const {
    code,
    interactive = false,
    codeContract = "renderBody",
    title,
    height = 360,
    className,
    dependencies,
    defaultImports,
    previewWrapperClassName = "h-[420px] rounded-xl border border-border bg-muted/30 p-3",
    seedgridDependency
  } = props;

  if (!interactive) {
    return (
      <div className={cn("space-y-2", className)}>
        {title ? <div className="text-sm font-medium">{title}</div> : null}
        <ReadonlyBlock code={code} />
      </div>
    );
  }

  const seedgridDefaultImports = defaultImports ?? `import {
  SgScreen,
  SgMainPanel,
  SgPanel,
  SgGrid,
  SgStack,
  SgButton,
  SgAutocomplete
} from "@seedgrid/fe-components";`;

  const appTsx =
    codeContract === "appFile"
      ? code
      : buildAppTsxFromRenderBody(code, seedgridDefaultImports, previewWrapperClassName);

  const resolvedSeedgridDependency =
    seedgridDependency ?? process.env.NEXT_PUBLIC_SANDPACK_SEEDGRID_DEPENDENCY ?? "";

  if (!resolvedSeedgridDependency) {
    return (
      <div className={cn("rounded-lg border border-amber-400/60 bg-amber-50 p-4 text-sm", className)}>
        <p className="font-medium text-amber-900">Interactive disabled: dependency not configured.</p>
        <p className="mt-1 text-amber-800">
          Set <code>NEXT_PUBLIC_SANDPACK_SEEDGRID_DEPENDENCY</code> with a real public version or URL,
          for example <code>0.2.0</code> or <code>https://.../seedgrid-fe-components.tgz</code>.
        </p>
      </div>
    );
  }

  const files: SandpackFiles = {
    "/App.tsx": { code: appTsx, active: true }
  };

  const deps: Record<string, string> = {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    "@seedgrid/fe-components": resolvedSeedgridDependency,
    ...(dependencies ?? {})
  };

  return (
    <div className={cn("rounded-lg border border-border", className)}>
      <SandpackProvider
        template="react-ts"
        files={files}
        customSetup={{ dependencies: deps }}
        options={{
          autorun: false,
          activeFile: "/App.tsx",
          visibleFiles: ["/App.tsx"]
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{title ?? "Example"}</span>
            <span className="text-xs text-muted-foreground">
              {codeContract === "renderBody" ? "editable snippet" : "editable App.tsx"}
            </span>
          </div>
          <RunButton />
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "1fr 1fr"
          }}
        >
          <div className="min-w-0 border-r border-border">
            <SandpackCodeEditor showLineNumbers wrapContent style={{ height }} />
          </div>
          <div className="min-w-0">
            <SandpackPreview style={{ height }} />
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
}

