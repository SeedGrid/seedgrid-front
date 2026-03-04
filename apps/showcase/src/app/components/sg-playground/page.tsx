"use client";

import React from "react";
import { SgPlayground } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function ExampleCodeCard(props: { code: string }) {
  return (
    <div className="mt-4">
      <CodeBlockBase code={props.code} />
    </div>
  );
}

const READONLY_CODE = `<SgButton severity="primary">Save</SgButton>
<SgButton appearance="outline">Cancel</SgButton>`;

const RENDER_BODY_CODE = `<SgStack gap={12}>
  <SgInputText id="name" label="Name" />
  <SgStack direction="row" gap={8}>
    <SgButton severity="primary">Save</SgButton>
    <SgButton appearance="outline">Cancel</SgButton>
  </SgStack>
</SgStack>`;

const APP_FILE_CODE = `import * as React from "react";
import { SgButton, SgCard, SgInputText, SgStack } from "@seedgrid/fe-components";

export default function App() {
  const [name, setName] = React.useState("");

  return (
    <SgCard title="Quick Form" description="appFile mode example">
      <SgStack gap={12}>
        <SgInputText
          id="name"
          label="Name"
          value={name}
          onChange={setName}
        />
        <SgButton severity="primary" onClick={() => alert("Saved: " + name)}>
          Save
        </SgButton>
      </SgStack>
    </SgCard>
  );
}`;

const READONLY_EXAMPLE_IMPL = `<SgPlayground
  title="Read-only snippet"
  description="Ideal for simple documentation."
  code={READONLY_CODE}
  defaultOpen={false}
/>;
`;

const RENDER_BODY_EXAMPLE_IMPL = `<SgPlayground
  title="Editor + real-time preview"
  description="Use Run to refresh the preview."
  interactive
  code={RENDER_BODY_CODE}
  defaultImports={'import { SgButton, SgInputText, SgStack } from "@seedgrid/fe-components";'}
  height={380}
/>;
`;

const APP_FILE_EXAMPLE_IMPL = `<SgPlayground
  title="Complete App.tsx"
  interactive
  codeContract="appFile"
  code={APP_FILE_CODE}
  height={420}
/>;
`;

const VISUAL_VARIANTS_EXAMPLE_IMPL = `<SgPlayground
  interactive
  code={RENDER_BODY_CODE}
  defaultImports={'import { SgButton, SgInputText, SgStack } from "@seedgrid/fe-components";'}
  withCard={false}
  expandable={false}
  resizable={false}
  height={300}
  previewPadding={16}
/>;
`;

const SG_PLAYGROUND_PROPS: ShowcasePropRow[] = [
  { prop: "title / description", type: "string", defaultValue: "- / -", description: "Header shown in the playground card." },
  { prop: "interactive", type: "boolean", defaultValue: "false", description: "Enables executable editor + preview." },
  { prop: "code", type: "string", defaultValue: "-", description: "Initial code shown in editor/block." },
  { prop: "codeContract", type: "\"renderBody\" | \"appFile\"", defaultValue: "\"renderBody\"", description: "Code contract interpreted by sandbox." },
  { prop: "defaultImports", type: "string", defaultValue: "-", description: "Imports injected automatically in renderBody mode." },
  { prop: "defaultOpen", type: "boolean", defaultValue: "false", description: "Sets initial expanded state." },
  { prop: "height", type: "number", defaultValue: "420", description: "Preview/editor area height." },
  { prop: "withCard", type: "boolean", defaultValue: "true", description: "Renders external card wrapper." },
  { prop: "expandable / resizable", type: "boolean / boolean", defaultValue: "true / true", description: "Controls expand and resize behavior." },
  { prop: "previewPadding", type: "number", defaultValue: "24", description: "Padding applied to iframe/preview." }
];

export default function SgPlaygroundPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgPlayground"
          subtitle="Playground with code editor + preview, supporting renderBody and appFile."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title="1) Read-only mode (code only)"
        description="When interactive=false, it works as a collapsible code block."
      >
        <div className="space-y-4">
          <SgPlayground
            title="Read-only snippet"
            description="Ideal for simple documentation."
            code={READONLY_CODE}
            defaultOpen={false}
          />
          <ExampleCodeCard code={READONLY_EXAMPLE_IMPL} />
        </div>
      </Section>

      <Section
        title="2) Interactive mode (renderBody)"
        description="Receives only JSX body and auto-builds an example App."
      >
        <div className="space-y-4">
          <SgPlayground
            title="Editor + real-time preview"
            description="Use Run to refresh the preview."
            interactive
            code={RENDER_BODY_CODE}
            defaultImports={`import { SgButton, SgInputText, SgStack } from "@seedgrid/fe-components";`}
            height={380}
          />
          <ExampleCodeCard code={RENDER_BODY_EXAMPLE_IMPL} />
        </div>
      </Section>

      <Section
        title="3) appFile mode"
        description="When codeContract=appFile, you control the full App.tsx file."
      >
        <div className="space-y-4">
          <SgPlayground
            title="Complete App.tsx"
            interactive
            codeContract="appFile"
            code={APP_FILE_CODE}
            height={420}
          />
          <ExampleCodeCard code={APP_FILE_EXAMPLE_IMPL} />
        </div>
      </Section>

      <Section
        title="4) Visual variations"
        description="Example without external card and without resize/expand."
      >
        <div className="space-y-4">
          <SgPlayground
            interactive
            code={RENDER_BODY_CODE}
            defaultImports={`import { SgButton, SgInputText, SgStack } from "@seedgrid/fe-components";`}
            withCard={false}
            expandable={false}
            resizable={false}
            height={300}
            previewPadding={16}
          />
          <ExampleCodeCard code={VISUAL_VARIANTS_EXAMPLE_IMPL} />
        </div>
      </Section>

      <ShowcasePropsReference rows={SG_PLAYGROUND_PROPS} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
    </div>
  </I18NReady>
  );
}
