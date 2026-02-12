"use client";

import React from "react";
import {
  SgCard,
  SgTreeView,
  type SgTreeNode,
  type SgTreeViewRef
} from "@seedgrid/fe-components";
import { Shield, Users, FileText, BarChart3 } from "lucide-react";
import CodeBlockBase from "../CodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const DATA: SgTreeNode[] = [
  {
    id: "root",
    label: "Admin",
    icon: <Shield className="h-4 w-4" />,
    children: [
      {
        id: "users",
        label: "Users",
        icon: <Users className="h-4 w-4" />,
        children: [
          { id: "users.list", label: "List users", icon: <FileText className="h-4 w-4" /> },
          { id: "users.create", label: "Create user", icon: <FileText className="h-4 w-4" /> }
        ]
      },
      {
        id: "reports",
        label: "Reports",
        icon: <BarChart3 className="h-4 w-4" />,
        children: [
          { id: "reports.sales", label: "Sales report", icon: <FileText className="h-4 w-4" /> },
          { id: "reports.financial", label: "Financial report", icon: <FileText className="h-4 w-4" /> }
        ]
      }
    ]
  }
];

export default function SgTreeViewPage() {
  const i18n = useShowcaseI18n();
  const treeRef = React.useRef<SgTreeViewRef>(null);
  const confirmRef = React.useRef<SgTreeViewRef>(null);
  const [checkedIds, setCheckedIds] = React.useState<string[]>([]);
  const [readAll, setReadAll] = React.useState<string[]>([]);
  const [readLeafs, setReadLeafs] = React.useState<string[]>([]);
  const [confirmed, setConfirmed] = React.useState<string[]>([]);

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.treeView.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.treeView.subtitle")}</p>
      </div>

      <Section
        title={t(i18n, "showcase.component.treeView.sections.basic.title")}
        description={t(i18n, "showcase.component.treeView.sections.basic.description")}
      >
        <SgCard title={t(i18n, "showcase.component.treeView.labels.permissions")}>
          <SgTreeView
            ref={treeRef}
            nodes={DATA}
            searchable
            searchPlaceholder={t(i18n, "showcase.component.treeView.labels.search")}
            checkable
            checkedIds={checkedIds}
            onCheckedChange={setCheckedIds}
            onLeafClick={(id) => console.log("leaf click", id)}
            size="md"
            density="normal"
            tone="default"
          />
        </SgCard>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-sm"
            onClick={() => setReadAll(treeRef.current?.getCheckedIds() ?? [])}
          >
            {t(i18n, "showcase.component.treeView.labels.readAll")}
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-sm"
            onClick={() => setReadLeafs(treeRef.current?.getCheckedLeafIds() ?? [])}
          >
            {t(i18n, "showcase.component.treeView.labels.readLeafs")}
          </button>
        </div>
        <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">checkedIds:</span>{" "}
            {readAll.length ? readAll.join(", ") : "-"}
          </div>
          <div>
            <span className="font-medium text-foreground">leafIds:</span>{" "}
            {readLeafs.length ? readLeafs.join(", ") : "-"}
          </div>
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgTreeView } from "@seedgrid/fe-components";

export default function Example() {
  const [checkedIds, setCheckedIds] = React.useState([]);
  const treeRef = React.useRef(null);

  return (
    <>
      <SgTreeView
        ref={treeRef}
        nodes={nodes}
        searchable
        checkable
        checkedIds={checkedIds}
        onCheckedChange={setCheckedIds}
        onLeafClick={(id) => console.log(id)}
      />
      <button onClick={() => console.log(treeRef.current?.getCheckedIds())}>
        Ler todos os checkeds
      </button>
      <button onClick={() => console.log(treeRef.current?.getCheckedLeafIds())}>
        Ler apenas leafs
      </button>
    </>
  );
}`}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.treeView.sections.confirm.title")}
        description={t(i18n, "showcase.component.treeView.sections.confirm.description")}
      >
        <SgCard title={t(i18n, "showcase.component.treeView.labels.confirmTitle")}>
          <SgTreeView
            ref={confirmRef}
            nodes={DATA}
            searchable
            searchPlaceholder={t(i18n, "showcase.component.treeView.labels.search")}
            checkable
            checkMode="confirm"
            confirmSelection="leafOnly"
            confirmBar={{
              label: t(i18n, "showcase.component.treeView.labels.confirm"),
              showCancel: true,
              cancelLabel: t(i18n, "showcase.component.treeView.labels.clear"),
              onConfirm: (ids) => setConfirmed(ids),
              onCancel: () => confirmRef.current?.clearChecked()
            }}
          />
        </SgCard>
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">confirmIds:</span>{" "}
          {confirmed.length ? confirmed.join(", ") : "-"}
        </div>
        <CodeBlock
          code={`import React from "react";
import { SgTreeView } from "@seedgrid/fe-components";

export default function Example() {
  const [confirmed, setConfirmed] = React.useState([]);
  const treeRef = React.useRef(null);

  return (
    <>
      <SgTreeView
        ref={treeRef}
        nodes={nodes}
        checkable
        checkMode="confirm"
        confirmSelection="leafOnly"
        confirmBar={{
          label: "${t(i18n, "showcase.component.treeView.labels.confirm")}",
          showCancel: true,
          cancelLabel: "${t(i18n, "showcase.component.treeView.labels.clear")}",
          onConfirm: (ids) => setConfirmed(ids),
          onCancel: () => treeRef.current?.clearChecked()
        }}
      />
      <div>confirmIds: {confirmed.join(", ")}</div>
    </>
  );
}`}
        />
      </Section>

      <Section
        title={t(i18n, "showcase.component.treeView.sections.size.title")}
        description={t(i18n, "showcase.component.treeView.sections.size.description")}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SgTreeView nodes={DATA} size="sm" density="compact" />
          <SgTreeView nodes={DATA} size="md" density="normal" />
          <SgTreeView nodes={DATA} size="lg" density="comfortable" />
        </div>
      </Section>
    </div>
  );
}
