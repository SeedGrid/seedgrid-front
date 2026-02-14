"use client";

import React from "react";
import { SgButton, SgDialog } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap items-center gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <SgCodeBlockBase code={props.code} />;
}

export default function SgDialogPage() {
  const i18n = useShowcaseI18n();
  const [openBasic, setOpenBasic] = React.useState(false);
  const [openSeverity, setOpenSeverity] = React.useState(false);
  const [openNoClose, setOpenNoClose] = React.useState(false);
  const [openStrict, setOpenStrict] = React.useState(false);
  const [openAutoClose, setOpenAutoClose] = React.useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.dialog.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.dialog.subtitle")}</p>
      </div>

      <Section
        title={t(i18n, "showcase.component.dialog.sections.basic.title")}
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
          leading={<span className="text-primary">â—Ž</span>}
          trailing={<span className="text-xs text-muted-foreground">ID: 428</span>}
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
        leading={<span>â—Ž</span>}
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
        title={t(i18n, "showcase.component.dialog.sections.severity.title")}
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
        title={t(i18n, "showcase.component.dialog.sections.noClose.title")}
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
        title={t(i18n, "showcase.component.dialog.sections.strict.title")}
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
        title={t(i18n, "showcase.component.dialog.sections.autoClose.title")}
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
    </div>
  );
}


