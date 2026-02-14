"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { SgButton, SgPopup, type SgPopupAction } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

import { loadSample } from "./samples/loadSample";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <SgCodeBlockBase code={props.code} />;
}

export default function SgPopupPage() {
  const i18n = useShowcaseI18n();
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
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.popup.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t(i18n, "showcase.component.popup.subtitle")}
        </p>
      </div>

      <Section
        title={t(i18n, "showcase.component.popup.sections.basic.title")}
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
          code={loadSample("sg-popup-example-01.src")}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.popup.sections.iconHint.title")}
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
          code={loadSample("sg-popup-example-02.src")}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.popup.sections.custom.title")}
        description={t(i18n, "showcase.component.popup.sections.custom.description")}
      >
        <div className="w-full">
          <CodeBlock
            code={loadSample("sg-popup-example-03.src")}
          />
        </div>
      </Section>
    </div>
  );
}


