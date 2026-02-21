"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { SgButton, SgPlayground, SgPopup, type SgPopupAction } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
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

const POPUP_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgPopup } from "@seedgrid/fe-components";

export default function App() {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<"auto" | "top" | "right" | "bottom" | "left">("auto");

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-5">
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("auto")}>auto</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("top")}>top</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("right")}>right</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("bottom")}>bottom</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPlacement("left")}>left</SgButton>
      </div>

      <SgButton ref={anchorRef} onClick={() => setOpen(true)}>
        Abrir popup
      </SgButton>

      <SgPopup
        title="Configuracao"
        subtitle="Exemplo interativo"
        open={open}
        onOpenChange={setOpen}
        anchorRef={anchorRef as React.RefObject<HTMLElement>}
        placement={placement}
        align="start"
        actions={[
          { label: "Confirmar", onClick: () => setOpen(false) },
          { label: "Cancelar", onClick: () => setOpen(false) }
        ]}
      />
    </div>
  );
}`;

const POPUP_PROPS: ShowcasePropRow[] = [
  { prop: "anchorRef", type: "RefObject<HTMLElement>", defaultValue: "-", description: "Elemento ancora obrigatorio." },
  { prop: "open / defaultOpen / onOpenChange", type: "boolean / boolean / callback", defaultValue: "controlado / false / -", description: "Controle de visibilidade." },
  { prop: "title / subtitle / children", type: "string / string / ReactNode", defaultValue: "- / - / -", description: "Conteudo textual e corpo customizado." },
  { prop: "placement / preferPlacement / align", type: "tokens", defaultValue: "auto / right / start", description: "Posicionamento e alinhamento do popup." },
  { prop: "offset / padding", type: "number", defaultValue: "8 / 8", description: "Distancia e margem de viewport." },
  { prop: "closeOnOutsideClick / closeOnEscape", type: "boolean", defaultValue: "true / true", description: "Regras de fechamento." },
  { prop: "actions", type: "SgPopupAction[]", defaultValue: "[]", description: "Acoes do rodape." },
  { prop: "className / style / zIndex / minWidth", type: "string / CSSProperties / number / number|string", defaultValue: "- / - / 1000 / -", description: "Customizacoes visuais." },
  { prop: "onOpen / onClose", type: "callbacks", defaultValue: "-", description: "Eventos de ciclo de abertura." }
];

export default function SgPopupPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const iconBtnRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [iconOpen, setIconOpen] = React.useState(false);

  const actions: SgPopupAction[] = [
    {
      label: t(i18n, "showcase.component.popup.actions.confirm"),
      onClick: () => console.log("confirm")
    },
    {
      label: t(i18n, "showcase.component.popup.actions.cancel"),
      onClick: () => console.log("cancel")
    }
  ];
  const iconActions: SgPopupAction[] = [
    {
      label: t(i18n, "showcase.component.popup.actions.approve"),
      hint: t(i18n, "showcase.component.popup.actions.approveHint"),
      icon: <Check className="h-4 w-4" />,
      onClick: () => console.log("approve")
    },
    {
      label: t(i18n, "showcase.component.popup.actions.reject"),
      hint: t(i18n, "showcase.component.popup.actions.rejectHint"),
      icon: <X className="h-4 w-4" />,
      onClick: () => console.log("reject")
    }
  ];

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.popup.title")}
          subtitle={t(i18n, "showcase.component.popup.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={`1) ${t(i18n, "showcase.component.popup.sections.basic.title")}`}
        description={t(i18n, "showcase.component.popup.sections.basic.description")}
      >
        <div className="w-full flex items-center gap-3">
          <SgButton ref={btnRef} onClick={() => setOpen(true)}>
            {t(i18n, "showcase.component.popup.labels.open")}
          </SgButton>
          <SgPopup
            title={t(i18n, "showcase.component.popup.labels.title")}
            subtitle={t(i18n, "showcase.component.popup.labels.content")}
            open={open}
            onOpenChange={setOpen}
            anchorRef={btnRef as React.RefObject<HTMLElement>}
            placement="auto"
            preferPlacement="right"
            align="start"
            actions={actions}
          />
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgPopup } from "@seedgrid/fe-components";

export default function Example() {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <SgButton ref={btnRef} onClick={() => setOpen(true)}>
        ${t(i18n, "showcase.component.popup.labels.open")}
      </SgButton>
      <SgPopup
        title="${t(i18n, "showcase.component.popup.labels.title")}"
        subtitle="${t(i18n, "showcase.component.popup.labels.content")}"
        open={open}
        onOpenChange={setOpen}
        anchorRef={btnRef as React.RefObject<HTMLElement>}
        placement="auto"
        preferPlacement="right"
        align="start"
        actions={[
          { label: "${t(i18n, "showcase.component.popup.actions.confirm")}" },
          { label: "${t(i18n, "showcase.component.popup.actions.cancel")}" }
        ]}
      />
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`2) ${t(i18n, "showcase.component.popup.sections.iconHint.title")}`}
        description={t(i18n, "showcase.component.popup.sections.iconHint.description")}
      >
        <div className="w-full flex items-center gap-3">
          <SgButton ref={iconBtnRef} onClick={() => setIconOpen(true)}>
            {t(i18n, "showcase.component.popup.labels.openIcon")}
          </SgButton>
          <SgPopup
            title={t(i18n, "showcase.component.popup.labels.title")}
            open={iconOpen}
            onOpenChange={setIconOpen}
            anchorRef={iconBtnRef as React.RefObject<HTMLElement>}
            placement="auto"
            preferPlacement="right"
            align="start"
            actions={iconActions}
          />
        </div>
        <CodeBlock
          code={`import React from "react";
import { Check, X } from "lucide-react";
import { SgButton, SgPopup } from "@seedgrid/fe-components";

export default function Example() {
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <SgButton ref={btnRef} onClick={() => setOpen(true)}>
        ${t(i18n, "showcase.component.popup.labels.openIcon")}
      </SgButton>
      <SgPopup
        title="${t(i18n, "showcase.component.popup.labels.title")}"
        open={open}
        onOpenChange={setOpen}
        anchorRef={btnRef as React.RefObject<HTMLElement>}
        placement="auto"
        preferPlacement="right"
        align="start"
        actions={[
          {
            label: "${t(i18n, "showcase.component.popup.actions.approve")}",
            hint: "${t(i18n, "showcase.component.popup.actions.approveHint")}",
            icon: <Check className="h-4 w-4" />
          },
          {
            label: "${t(i18n, "showcase.component.popup.actions.reject")}",
            hint: "${t(i18n, "showcase.component.popup.actions.rejectHint")}",
            icon: <X className="h-4 w-4" />
          }
        ]}
      />
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`3) ${t(i18n, "showcase.component.popup.sections.custom.title")}`}
        description={t(i18n, "showcase.component.popup.sections.custom.description")}
      >
        <div className="w-full">
          <CodeBlock
            code={`<SgPopup
  title="Config"
  open={open}
  onOpenChange={setOpen}
  anchorRef={btnRef as React.RefObject<HTMLElement>}
  placement="auto"
>
  <div className="grid gap-2 text-sm">
    <label className="text-xs">Modo</label>
    <input className="h-9 rounded border px-2" />
  </div>
</SgPopup>`}
          />
        </div>
      </Section>

        <Section title="4) Playground (SgPlayground)" description="Teste interativo das principais props do SgPopup.">
          <SgPlayground
            title="SgPopup Playground"
            interactive
            codeContract="appFile"
            code={POPUP_PLAYGROUND_CODE}
            height={520}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={POPUP_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
