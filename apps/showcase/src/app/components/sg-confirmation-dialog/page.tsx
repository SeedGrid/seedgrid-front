"use client";

import React from "react";
import { SgButton, SgConfirmationDialog, type SgConfirmationDialogButtonConfig } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { AlertTriangle, ShieldAlert, Trash2, X } from "lucide-react";
import sgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n, type ShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode; example?: boolean }) {
  return (
    <section
      data-showcase-example={props.example === false ? undefined : "true"}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <sgCodeBlockBase code={props.code} />;
}

const SECTION_TITLE_KEYS = [
  "showcase.component.confirmation.sections.basic.title",
  "showcase.component.confirmation.sections.leftIcon.title",
  "showcase.component.confirmation.sections.topIcon.title",
  "showcase.component.confirmation.sections.customButtons.title",
  "showcase.component.confirmation.sections.surface.title",
  "showcase.component.confirmation.sections.playground.title"
] as const;

function buildConfirmationProps(i18n: ShowcaseI18n): ShowcasePropRow[] {
  return [
    {
      prop: "open / defaultOpen / onOpenChange",
      type: "boolean / boolean / callback",
      defaultValue: "controlled / false / -",
      description: t(i18n, "showcase.component.confirmation.props.rows.openControl")
    },
    {
      prop: "title",
      type: "ReactNode",
      defaultValue: "-",
      description: t(i18n, "showcase.component.confirmation.props.rows.title")
    },
    {
      prop: "message",
      type: "ReactNode",
      defaultValue: "-",
      description: t(i18n, "showcase.component.confirmation.props.rows.message")
    },
    {
      prop: "icon",
      type: "ReactNode",
      defaultValue: "-",
      description: t(i18n, "showcase.component.confirmation.props.rows.icon")
    },
    {
      prop: "iconPlacement",
      type: "\"left\" | \"top\"",
      defaultValue: "left",
      description: t(i18n, "showcase.component.confirmation.props.rows.iconPlacement")
    },
    {
      prop: "severity",
      type: "SgDialogSeverity",
      defaultValue: "warning",
      description: t(i18n, "showcase.component.confirmation.props.rows.severity")
    },
    {
      prop: "showSeverityAccent",
      type: "boolean",
      defaultValue: "false",
      description: t(i18n, "showcase.component.confirmation.props.rows.showSeverityAccent")
    },
    {
      prop: "customColor / elevation",
      type: "CSSProperties[\"backgroundColor\"] / \"none\" | \"sm\" | \"md\" | \"lg\" | CSSProperties[\"boxShadow\"]",
      defaultValue: "- / -",
      description: t(i18n, "showcase.component.confirmation.props.rows.surface")
    },
    {
      prop: "cancelButton / confirmButton",
      type: "SgConfirmationDialogButtonConfig",
      defaultValue: "-",
      description: t(i18n, "showcase.component.confirmation.props.rows.buttons")
    },
    {
      prop: "onCancel / onConfirm",
      type: "() => void",
      defaultValue: "-",
      description: t(i18n, "showcase.component.confirmation.props.rows.callbacks")
    },
    {
      prop: "closeOnCancel / closeOnConfirm",
      type: "boolean",
      defaultValue: "true / true",
      description: t(i18n, "showcase.component.confirmation.props.rows.closeOnActions")
    },
    {
      prop: "closeOnEsc / closeOnOverlayClick",
      type: "boolean",
      defaultValue: "true / true",
      description: t(i18n, "showcase.component.confirmation.props.rows.closeBehaviors")
    }
  ];
}

const BASIC_CODE = `import React from "react";
import { SgButton, SgConfirmationDialog, type SgConfirmationDialogButtonConfig } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function BasicConfirmationExample() {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState("none");

  return (
    <>
      <SgButton onClick={() => setOpen(true)}>delete permission</SgButton>
      <SgConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete permission"
        message="Confirm delete?"
        severity="danger"
        onCancel={() => setResult("cancel")}
        onConfirm={() => setResult("confirm")}
      />
      <p className="text-xs text-muted-foreground">result: {result}</p>
    </>
  );
}`;

const LEFT_ICON_CODE = `import React from "react";
import { AlertTriangle } from "lucide-react";
import { SgButton, SgConfirmationDialog, type SgConfirmationDialogButtonConfig } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function LeftIconConfirmationExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <SgButton appearance="outline" onClick={() => setOpen(true)}>open warning</SgButton>
      <SgConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Unsaved changes"
        message="You have pending updates. Do you want to continue without saving?"
        icon={<AlertTriangle className="size-5 text-amber-600" />}
        iconPlacement="left"
        severity="warning"
      />
    </>
  );
}`;

const TOP_ICON_CODE = `import React from "react";
import { ShieldAlert } from "lucide-react";
import { SgButton, SgConfirmationDialog, type SgConfirmationDialogButtonConfig } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function TopIconConfirmationExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <SgButton appearance="outline" onClick={() => setOpen(true)}>open top icon</SgButton>
      <SgConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Sensitive action"
        message="This operation affects all users in the selected group."
        icon={<ShieldAlert className="size-6 text-rose-600" />}
        iconPlacement="top"
        severity="danger"
      />
    </>
  );
}`;

const CUSTOM_BUTTONS_CODE = `import React from "react";
import { Trash2, X } from "lucide-react";
import { SgButton, SgConfirmationDialog, type SgConfirmationDialogButtonConfig } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const cancelButton: SgConfirmationDialogButtonConfig = {
  label: "No, keep it",
  icon: <X className="size-4" />,
  severity: "secondary",
  appearance: "ghost"
};

const confirmButton: SgConfirmationDialogButtonConfig = {
  label: "Yes, delete",
  icon: <Trash2 className="size-4" />,
  severity: "danger"
};

export default function CustomButtonsConfirmationExample() {
  const [open, setOpen] = React.useState(false);
  const [log, setLog] = React.useState("none");

  return (
    <>
      <SgButton severity="danger" onClick={() => setOpen(true)}>delete row</SgButton>
      <SgConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete permission"
        message="Confirm delete?"
        severity="danger"
        cancelButton={cancelButton}
        confirmButton={confirmButton}
        onCancel={() => setLog("cancel")}
        onConfirm={() => setLog("confirm")}
      />
      <p className="text-xs text-muted-foreground">last action: {log}</p>
    </>
  );
}`;

const SURFACE_CODE = `import React from "react";
import { SgButton, SgConfirmationDialog, type SgConfirmationDialogButtonConfig } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function SurfaceConfirmationExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <SgButton appearance="outline" onClick={() => setOpen(true)}>open custom surface</SgButton>
      <SgConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete permission"
        message="Confirm delete?"
        severity="danger"
        customColor="#fff7ed"
        elevation="0 0 0 1px rgba(234, 88, 12, 0.22), 0 24px 56px rgba(234, 88, 12, 0.28)"
      />
    </>
  );
}`;

const PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";
import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

const SgConfirmationDialogFromLib = (SeedGrid as Record<string, unknown>).SgConfirmationDialog as
  | React.ComponentType<any>
  | undefined;
const SgButtonFromLib = (SeedGrid as Record<string, unknown>).SgButton as
  | React.ComponentType<any>
  | undefined;

export default function App() {
  const hasComponent = typeof SgConfirmationDialogFromLib === "function" && typeof SgButtonFromLib === "function";
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState<"primary" | "success" | "info" | "warning" | "danger" | "plain">("warning");
  const [iconPlacement, setIconPlacement] = React.useState<"left" | "top">("left");
  const [customButtons, setCustomButtons] = React.useState(false);
  const [lastAction, setLastAction] = React.useState("none");

  return (
    <div className="space-y-4 p-2">
      {!hasComponent ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgConfirmationDialog is not available in the published Sandpack version. Showing fallback.
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-3 text-xs">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={customButtons} onChange={(event) => setCustomButtons(event.target.checked)} />
          custom buttons
        </label>
        <label className="text-xs">
          <span className="mb-1 block">severity</span>
          <select
            className="w-full rounded border border-border px-2 py-1"
            value={severity}
            onChange={(event) => setSeverity(event.target.value as "primary" | "success" | "info" | "warning" | "danger" | "plain")}
          >
            <option value="plain">plain</option>
            <option value="primary">primary</option>
            <option value="success">success</option>
            <option value="info">info</option>
            <option value="warning">warning</option>
            <option value="danger">danger</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="mb-1 block">iconPlacement</span>
          <select
            className="w-full rounded border border-border px-2 py-1"
            value={iconPlacement}
            onChange={(event) => setIconPlacement(event.target.value as "left" | "top")}
          >
            <option value="left">left</option>
            <option value="top">top</option>
          </select>
        </label>
      </div>

      {hasComponent ? (
        <>
          <SgButtonFromLib onClick={() => setOpen(true)}>open confirmation</SgButtonFromLib>
          <SgConfirmationDialogFromLib
            open={open}
            onOpenChange={setOpen}
            title="Delete permission"
            message="Confirm delete?"
            icon={<AlertTriangle className="size-5 text-amber-600" />}
            iconPlacement={iconPlacement}
            severity={severity}
            cancelButton={customButtons ? { label: "No", icon: <X className="size-4" />, appearance: "ghost" } : undefined}
            confirmButton={customButtons ? { label: "Yes", icon: <Trash2 className="size-4" />, severity: "danger" } : undefined}
            onCancel={() => setLastAction("cancel")}
            onConfirm={() => setLastAction("confirm")}
          />
          <div className="rounded border border-border bg-muted/30 px-3 py-2 text-xs">
            last action: {lastAction}
          </div>
        </>
      ) : (
        <div className="rounded border border-border p-3 text-xs">
          fallback mode
        </div>
      )}
    </div>
  );
}
`;

export default function SgConfirmationDialogShowcase() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  const [openBasic, setOpenBasic] = React.useState(false);
  const [basicResult, setBasicResult] = React.useState("none");

  const [openLeftIcon, setOpenLeftIcon] = React.useState(false);
  const [openTopIcon, setOpenTopIcon] = React.useState(false);

  const [openCustom, setOpenCustom] = React.useState(false);
  const [customLog, setCustomLog] = React.useState("none");
  const [openSurface, setOpenSurface] = React.useState(false);

  const cancelButton = React.useMemo<SgConfirmationDialogButtonConfig>(() => ({
    label: "No, keep it",
    icon: <X className="size-4" />,
    severity: "secondary",
    appearance: "ghost"
  }), []);

  const confirmButton = React.useMemo<SgConfirmationDialogButtonConfig>(() => ({
    label: "Yes, delete",
    icon: <Trash2 className="size-4" />,
    severity: "danger"
  }), []);
  const sectionTitles = React.useMemo(
    () => SECTION_TITLE_KEYS.map((key) => t(i18n, key)),
    [i18n.locale]
  );
  const confirmationProps = React.useMemo(
    () => buildConfirmationProps(i18n),
    [i18n.locale]
  );

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgConfirmationDialog"
          subtitle={t(i18n, "showcase.component.confirmation.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={sectionTitles[0] ?? ""}>
          <SgButton onClick={() => setOpenBasic(true)}>delete permission</SgButton>
          <SgConfirmationDialog
            open={openBasic}
            onOpenChange={setOpenBasic}
            title="Delete permission"
            message="Confirm delete?"
            severity="danger"
            onCancel={() => setBasicResult("cancel")}
            onConfirm={() => setBasicResult("confirm")}
          />
          <p className="text-xs text-muted-foreground">result: {basicResult}</p>
          <CodeBlock code={BASIC_CODE} />
        </Section>

        <Section title={sectionTitles[1] ?? ""}>
          <SgButton appearance="outline" onClick={() => setOpenLeftIcon(true)}>open warning</SgButton>
          <SgConfirmationDialog
            open={openLeftIcon}
            onOpenChange={setOpenLeftIcon}
            title="Unsaved changes"
            message="You have pending updates. Do you want to continue without saving?"
            icon={<AlertTriangle className="size-5 text-amber-600" />}
            iconPlacement="left"
            severity="warning"
          />
          <CodeBlock code={LEFT_ICON_CODE} />
        </Section>

        <Section title={sectionTitles[2] ?? ""}>
          <SgButton appearance="outline" onClick={() => setOpenTopIcon(true)}>open top icon</SgButton>
          <SgConfirmationDialog
            open={openTopIcon}
            onOpenChange={setOpenTopIcon}
            title="Sensitive action"
            message="This operation affects all users in the selected group."
            icon={<ShieldAlert className="size-6 text-rose-600" />}
            iconPlacement="top"
            severity="danger"
          />
          <CodeBlock code={TOP_ICON_CODE} />
        </Section>

        <Section title={sectionTitles[3] ?? ""}>
          <SgButton severity="danger" onClick={() => setOpenCustom(true)}>delete row</SgButton>
          <SgConfirmationDialog
            open={openCustom}
            onOpenChange={setOpenCustom}
            title="Delete permission"
            message="Confirm delete?"
            severity="danger"
            cancelButton={cancelButton}
            confirmButton={confirmButton}
            onCancel={() => setCustomLog("cancel")}
            onConfirm={() => setCustomLog("confirm")}
          />
          <p className="text-xs text-muted-foreground">last action: {customLog}</p>
          <CodeBlock code={CUSTOM_BUTTONS_CODE} />
        </Section>

        <Section title={sectionTitles[4] ?? ""}>
          <SgButton appearance="outline" onClick={() => setOpenSurface(true)}>open custom surface</SgButton>
          <SgConfirmationDialog
            open={openSurface}
            onOpenChange={setOpenSurface}
            title="Delete permission"
            message="Confirm delete?"
            severity="danger"
            customColor="#fff7ed"
            elevation="0 0 0 1px rgba(234, 88, 12, 0.22), 0 24px 56px rgba(234, 88, 12, 0.28)"
          />
          <CodeBlock code={SURFACE_CODE} />
        </Section>

        <Section title={sectionTitles[5] ?? ""}>
          <SgPlayground
            title={t(i18n, "showcase.component.confirmation.sections.playground.playgroundTitle")}
            interactive
            codeContract="appFile"
            code={PLAYGROUND_APP_FILE}
            height={640}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={confirmationProps} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

