"use client";

import React from "react";
import { useSgTheme } from "@seedgrid/fe-theme";
import { SgButton, SgDialog } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import sgCodeBlockBase from "../sgCodeBlockBase";
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
      <div className="mt-4 flex flex-wrap items-center gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <sgCodeBlockBase code={props.code} />;
}

const DIALOG_PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgDialog } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState<"plain" | "primary" | "secondary" | "success" | "warning" | "danger">("plain");
  const [size, setSize] = React.useState<"sm" | "md" | "lg" | "xl">("md");

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-4">
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("plain")}>plain</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("primary")}>primary</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("success")}>success</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("danger")}>danger</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("sm")}>sm</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("md")}>md</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("lg")}>lg</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("xl")}>xl</SgButton>
      </div>

      <SgButton onClick={() => setOpen(true)}>Abrir dialog</SgButton>
      <SgDialog
        open={open}
        onOpenChange={setOpen}
        severity={severity}
        size={size}
        title="Configuração"
        subtitle="Exemplo interativo"
        footer={
          <>
            <SgButton appearance="ghost" onClick={() => setOpen(false)}>Cancelar</SgButton>
            <SgButton onClick={() => setOpen(false)}>Confirmar</SgButton>
          </>
        }
      >
        <div className="text-sm text-muted-foreground">Conteúdo do diálogo.</div>
      </SgDialog>
    </div>
  );
}`;

const DIALOG_PROPS: ShowcasePropRow[] = [
  { prop: "open / defaultOpen / onOpenChange", type: "boolean / boolean / callback", defaultValue: "controlado / false / -", description: "Controle de abertura." },
  { prop: "title / subtitle / children / footer", type: "ReactNode", defaultValue: "-", description: "Estrutura principal do conteúdo." },
  { prop: "size", type: "\"sm\" | \"md\" | \"lg\" | \"xl\" | \"full\"", defaultValue: "md", description: "Largura do diálogo." },
  { prop: "severity", type: "token", defaultValue: "plain", description: "Acento visual do diálogo." },
  { prop: "animation / transitionMs", type: "token / number", defaultValue: "zoom / 160", description: "Animação e duração da transição." },
  { prop: "autoCloseMs", type: "number", defaultValue: "-", description: "Fecha automaticamente após o tempo informado." },
  { prop: "customColor / elevation", type: "CSSProperties[\"backgroundColor\"] / \"none\" | \"sm\" | \"md\" | \"lg\" | CSSProperties[\"boxShadow\"]", defaultValue: "- / -", description: "Customiza cor de fundo e elevacao do card do dialog." },
  { prop: "closeable / closeOnOverlayClick / closeOnEsc", type: "boolean", defaultValue: "true / true / true", description: "Regras de fechamento." },
  { prop: "lockBodyScroll / restoreFocus", type: "boolean", defaultValue: "true / true", description: "Acessibilidade e foco." },
  { prop: "onClose / initialFocusRef / ariaLabel", type: "callback / ref / string", defaultValue: "-", description: "Controle avançado de fechamento e foco." },
  { prop: "className / style / overlayClassName / contentClassName / headerClassName / bodyClassName / footerClassName", type: "string / CSSProperties", defaultValue: "-", description: "Customização de estilos por seção." }
];

export default function SgDialogPage() {
  const i18n = useShowcaseI18n();
  const { currentMode } = useSgTheme();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });
  const [openBasic, setOpenBasic] = React.useState(false);
  const [openSeverity, setOpenSeverity] = React.useState(false);
  const [openNoClose, setOpenNoClose] = React.useState(false);
  const [openStrict, setOpenStrict] = React.useState(false);
  const [openAutoClose, setOpenAutoClose] = React.useState(false);
  const isDarkMode = currentMode === "dark";
  const basicCustomColor = isDarkMode ? "rgb(17 24 21)" : "#fff7ed";
  const basicCustomShadow = isDarkMode
    ? "0 0 0 1px rgba(74, 222, 128, 0.24), 0 24px 56px rgba(2, 8, 23, 0.58)"
    : "0 0 0 1px rgba(234, 88, 12, 0.22), 0 24px 56px rgba(234, 88, 12, 0.28)";
  const basicCustomBorder = isDarkMode
    ? "1px solid rgba(74, 222, 128, 0.2)"
    : "1px solid rgba(59, 130, 246, 0.25)";

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.dialog.title")}
          subtitle={t(i18n, "showcase.component.dialog.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={`1) ${t(i18n, "showcase.component.dialog.sections.basic.title")}`}
        description={t(i18n, "showcase.component.dialog.sections.basic.description")}
      >
        <SgButton onClick={() => setOpenBasic(true)}>
          {t(i18n, "showcase.component.dialog.labels.open")}
        </SgButton>
        <SgDialog
          open={openBasic}
          onOpenChange={setOpenBasic}
          title={t(i18n, "showcase.component.dialog.labels.title")}
          subtitle={t(i18n, "showcase.component.dialog.labels.subtitle")}
          customColor={basicCustomColor}
          elevation={basicCustomShadow}
          style={{ border: basicCustomBorder }}
          leading={<span className="text-primary">O</span>}
          trailing={<span className="text-xs opacity-70">ID: 428</span>}
          footer={
            <>
              <SgButton appearance="ghost" onClick={() => setOpenBasic(false)}>
                {t(i18n, "showcase.component.dialog.labels.cancel")}
              </SgButton>
              <SgButton onClick={() => setOpenBasic(false)}>
                {t(i18n, "showcase.component.dialog.labels.confirm")}
              </SgButton>
            </>
          }
        >
          <div className="space-y-2 text-sm">
            <p>{t(i18n, "showcase.component.dialog.labels.body")}</p>
            <input
              data-sg-dialog-initial-focus="true"
              className="h-10 w-full rounded-lg border border-border bg-background px-3"
              placeholder={t(i18n, "showcase.component.dialog.labels.input")}
            />
          </div>
        </SgDialog>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgDialog } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <SgButton onClick={() => setOpen(true)}>${t(i18n, "showcase.component.dialog.labels.open")}</SgButton>
      <SgDialog
        open={open}
        onOpenChange={setOpen}
        title="${t(i18n, "showcase.component.dialog.labels.title")}"
        subtitle="${t(i18n, "showcase.component.dialog.labels.subtitle")}"
        customColor="#fff7ed"
        elevation="0 0 0 1px rgba(234, 88, 12, 0.22), 0 24px 56px rgba(234, 88, 12, 0.28)"
        style={{ border: "1px solid rgba(59, 130, 246, 0.25)" }}
        leading={<span>O</span>}
        trailing={<span>ID: 428</span>}
        footer={
          <>
            <SgButton appearance="ghost" onClick={() => setOpen(false)}>${t(i18n, "showcase.component.dialog.labels.cancel")}</SgButton>
            <SgButton onClick={() => setOpen(false)}>${t(i18n, "showcase.component.dialog.labels.confirm")}</SgButton>
          </>
        }
      >
        <div>${t(i18n, "showcase.component.dialog.labels.body")}</div>
      </SgDialog>
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`2) ${t(i18n, "showcase.component.dialog.sections.severity.title")}`}
        description={t(i18n, "showcase.component.dialog.sections.severity.description")}
      >
        <SgButton severity="danger" onClick={() => setOpenSeverity(true)}>
          {t(i18n, "showcase.component.dialog.labels.openDanger")}
        </SgButton>
        <SgDialog
          open={openSeverity}
          onOpenChange={setOpenSeverity}
          severity="danger"
          title={t(i18n, "showcase.component.dialog.labels.dangerTitle")}
          subtitle={t(i18n, "showcase.component.dialog.labels.dangerSubtitle")}
          footer={
            <>
              <SgButton appearance="ghost" onClick={() => setOpenSeverity(false)}>
                {t(i18n, "showcase.component.dialog.labels.cancel")}
              </SgButton>
              <SgButton severity="danger" onClick={() => setOpenSeverity(false)}>
                {t(i18n, "showcase.component.dialog.labels.delete")}
              </SgButton>
            </>
          }
        >
          <div className="text-sm text-muted-foreground">
            {t(i18n, "showcase.component.dialog.labels.dangerBody")}
          </div>
        </SgDialog>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgDialog } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <SgButton severity="danger" onClick={() => setOpen(true)}>${t(i18n, "showcase.component.dialog.labels.openDanger")}</SgButton>
      <SgDialog
        open={open}
        onOpenChange={setOpen}
        severity="danger"
        title="${t(i18n, "showcase.component.dialog.labels.dangerTitle")}"
        subtitle="${t(i18n, "showcase.component.dialog.labels.dangerSubtitle")}"
        footer={
          <>
            <SgButton appearance="ghost" onClick={() => setOpen(false)}>${t(i18n, "showcase.component.dialog.labels.cancel")}</SgButton>
            <SgButton severity="danger" onClick={() => setOpen(false)}>${t(i18n, "showcase.component.dialog.labels.delete")}</SgButton>
          </>
        }
      >
        <div>${t(i18n, "showcase.component.dialog.labels.dangerBody")}</div>
      </SgDialog>
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`3) ${t(i18n, "showcase.component.dialog.sections.noClose.title")}`}
        description={t(i18n, "showcase.component.dialog.sections.noClose.description")}
      >
        <SgButton appearance="outline" onClick={() => setOpenNoClose(true)}>
          {t(i18n, "showcase.component.dialog.labels.openNoClose")}
        </SgButton>
        <SgDialog
          open={openNoClose}
          onOpenChange={setOpenNoClose}
          closeable={false}
          title={t(i18n, "showcase.component.dialog.labels.noCloseTitle")}
          subtitle={t(i18n, "showcase.component.dialog.labels.noCloseSubtitle")}
          footer={
            <>
              <SgButton appearance="ghost" onClick={() => setOpenNoClose(false)}>
                {t(i18n, "showcase.component.dialog.labels.cancel")}
              </SgButton>
              <SgButton onClick={() => setOpenNoClose(false)}>
                {t(i18n, "showcase.component.dialog.labels.confirm")}
              </SgButton>
            </>
          }
        >
          <div className="text-sm text-muted-foreground">
            {t(i18n, "showcase.component.dialog.labels.noCloseBody")}
          </div>
        </SgDialog>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgDialog } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <SgButton appearance="outline" onClick={() => setOpen(true)}>${t(i18n, "showcase.component.dialog.labels.openNoClose")}</SgButton>
      <SgDialog
        open={open}
        onOpenChange={setOpen}
        closeable={false}
        title="${t(i18n, "showcase.component.dialog.labels.noCloseTitle")}"
        subtitle="${t(i18n, "showcase.component.dialog.labels.noCloseSubtitle")}"
        footer={
          <>
            <SgButton appearance="ghost" onClick={() => setOpen(false)}>${t(i18n, "showcase.component.dialog.labels.cancel")}</SgButton>
            <SgButton onClick={() => setOpen(false)}>${t(i18n, "showcase.component.dialog.labels.confirm")}</SgButton>
          </>
        }
      >
        <div>${t(i18n, "showcase.component.dialog.labels.noCloseBody")}</div>
      </SgDialog>
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`4) ${t(i18n, "showcase.component.dialog.sections.strict.title")}`}
        description={t(i18n, "showcase.component.dialog.sections.strict.description")}
      >
        <SgButton appearance="outline" onClick={() => setOpenStrict(true)}>
          {t(i18n, "showcase.component.dialog.labels.openStrict")}
        </SgButton>
        <SgDialog
          open={openStrict}
          onOpenChange={setOpenStrict}
          closeable={false}
          closeOnOverlayClick={false}
          closeOnEsc={false}
          title={t(i18n, "showcase.component.dialog.labels.strictTitle")}
          subtitle={t(i18n, "showcase.component.dialog.labels.strictSubtitle")}
          footer={
            <>
              <SgButton appearance="ghost" onClick={() => setOpenStrict(false)}>
                {t(i18n, "showcase.component.dialog.labels.cancel")}
              </SgButton>
              <SgButton onClick={() => setOpenStrict(false)}>
                {t(i18n, "showcase.component.dialog.labels.confirm")}
              </SgButton>
            </>
          }
        >
          <div className="text-sm text-muted-foreground">
            {t(i18n, "showcase.component.dialog.labels.strictBody")}
          </div>
        </SgDialog>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgDialog } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <SgButton appearance="outline" onClick={() => setOpen(true)}>${t(i18n, "showcase.component.dialog.labels.openStrict")}</SgButton>
      <SgDialog
        open={open}
        onOpenChange={setOpen}
        closeable={false}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        title="${t(i18n, "showcase.component.dialog.labels.strictTitle")}"
        subtitle="${t(i18n, "showcase.component.dialog.labels.strictSubtitle")}"
        footer={
          <>
            <SgButton appearance="ghost" onClick={() => setOpen(false)}>${t(i18n, "showcase.component.dialog.labels.cancel")}</SgButton>
            <SgButton onClick={() => setOpen(false)}>${t(i18n, "showcase.component.dialog.labels.confirm")}</SgButton>
          </>
        }
      >
        <div>${t(i18n, "showcase.component.dialog.labels.strictBody")}</div>
      </SgDialog>
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`5) ${t(i18n, "showcase.component.dialog.sections.autoClose.title")}`}
        description={t(i18n, "showcase.component.dialog.sections.autoClose.description")}
      >
        <SgButton appearance="outline" onClick={() => setOpenAutoClose(true)}>
          {t(i18n, "showcase.component.dialog.labels.openAutoClose")}
        </SgButton>
        <SgDialog
          open={openAutoClose}
          onOpenChange={setOpenAutoClose}
          autoCloseMs={3000}
          title={t(i18n, "showcase.component.dialog.labels.autoCloseTitle")}
          subtitle={t(i18n, "showcase.component.dialog.labels.autoCloseSubtitle")}
        >
          <div className="text-sm text-muted-foreground">
            {t(i18n, "showcase.component.dialog.labels.autoCloseBody")}
          </div>
        </SgDialog>
        <CodeBlock
          code={`import React from "react";
import { SgButton, SgDialog } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <SgButton appearance="outline" onClick={() => setOpen(true)}>${t(i18n, "showcase.component.dialog.labels.openAutoClose")}</SgButton>
      <SgDialog
        open={open}
        onOpenChange={setOpen}
        autoCloseMs={3000}
        title="${t(i18n, "showcase.component.dialog.labels.autoCloseTitle")}"
        subtitle="${t(i18n, "showcase.component.dialog.labels.autoCloseSubtitle")}"
      >
        <div>${t(i18n, "showcase.component.dialog.labels.autoCloseBody")}</div>
      </SgDialog>
    </>
  );
}`}
        />
      </Section>

        <Section title="6) Playground (SgPlayground)" description="Teste interativo das principais props do SgDialog.">
          <SgPlayground
            title="SgDialog Playground"
            interactive
            codeContract="appFile"
            code={DIALOG_PLAYGROUND_CODE}
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={DIALOG_PROPS} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
