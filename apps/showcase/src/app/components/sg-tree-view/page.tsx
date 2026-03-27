"use client";

import React from "react";
import {
  SgCard,
  SgTreeView,
  sgTreeFromJsonWithChecked,
  type SgTreeNode,
  type SgTreeViewRef,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { Shield, Users, FileText, BarChart3 } from "lucide-react";
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
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <sgCodeBlockBase code={props.code} />;
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

const JSON_DATA = [
  {
    id: "root",
    label: "Admin",
    children: [
      {
        id: "users",
        label: "Users",
        children: [
          { id: "users.list", label: "List users", checked: true },
          { id: "users.create", label: "Create user" }
        ]
      },
      {
        id: "reports",
        label: "Reports",
        children: [
          { id: "reports.sales", label: "Sales report", checked: true },
          { id: "reports.financial", label: "Financial report" }
        ]
      }
    ]
  }
];

const TREE_VIEW_PLAYGROUND_CODE = `import * as React from "react";
import {
  SgCard,
  SgTreeView,
  sgTreeFromJsonWithChecked,
  type SgTreeNode,
  type SgTreeViewRef,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const nodes: SgTreeNode[] = [
  {
    id: "root",
    label: "Admin",
    children: [
      {
        id: "users",
        label: "Users",
        children: [
          { id: "users.list", label: "List users" },
          { id: "users.create", label: "Create user" }
        ]
      },
      {
        id: "reports",
        label: "Reports",
        children: [
          { id: "reports.sales", label: "Sales report" },
          { id: "reports.financial", label: "Financial report" }
        ]
      }
    ]
  }
];

export default function App() {
  const [checkable, setCheckable] = React.useState(true);
  const [searchable, setSearchable] = React.useState(true);

  return (
    <div className="space-y-4 p-2">
      <div className="flex gap-4 text-xs">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={checkable} onChange={(e) => setCheckable(e.target.checked)} />checkable</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={searchable} onChange={(e) => setSearchable(e.target.checked)} />searchable</label>
      </div>
      <SgTreeView
        nodes={nodes}
        searchable={searchable}
        searchPlaceholder="Search..."
        checkable={checkable}
        defaultExpandedIds={["root", "users"]}
      />
    </div>
  );
}`;

const TREE_VIEW_PROPS: ShowcasePropRow[] = [
  { prop: "nodes", type: "SgTreeNode[]", defaultValue: "[]", description: "Estrutura hierárquica de nós." },
  { prop: "checkable / checkMode / confirmSelection", type: "boolean / token / token", defaultValue: "false / instant / all", description: "Comportamento de seleção com checkboxes." },
  { prop: "checkedIds / defaultCheckedIds / onCheckedChange", type: "string[] / string[] / callback", defaultValue: "controlado / [] / -", description: "Estado de seleção." },
  { prop: "expandedIds / defaultExpandedIds / onExpandedChange", type: "string[] / string[] / callback", defaultValue: "controlado / [] / -", description: "Estado de expansão." },
  { prop: "searchable / searchPlaceholder / searchValue", type: "boolean / string / string", defaultValue: "false / Search... / controlado", description: "Busca e filtro da árvore." },
  { prop: "size / density / tone / iconTone", type: "tokens", defaultValue: "md / normal / default / default", description: "Ajustes visuais do componente." },
  { prop: "onLeafClick / onExpand / onCollapse", type: "callbacks", defaultValue: "-", description: "Eventos de interação." },
  { prop: "confirmBar / emptyText / maxHeightClassName", type: "objeto / string / string", defaultValue: "- / No results / -", description: "Configurações complementares da interface." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes extras no container." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Inline style adicional no container." }
];

export default function SgTreeViewPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });
  const treeRef = React.useRef<SgTreeViewRef>(null);
  const confirmRef = React.useRef<SgTreeViewRef>(null);
  const [checkedIds, setCheckedIds] = React.useState<string[]>([]);
  const [readAll, setReadAll] = React.useState<string[]>([]);
  const [readLeafs, setReadLeafs] = React.useState<string[]>([]);
  const [confirmed, setConfirmed] = React.useState<string[]>([]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.treeView.title")}
          subtitle={t(i18n, "showcase.component.treeView.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={`1) ${t(i18n, "showcase.component.treeView.sections.basic.title")}`}
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
            style={{ border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 12, padding: 8 }}
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
import {
  SgCard,
  SgTreeView,
  sgTreeFromJsonWithChecked,
  type SgTreeNode,
  type SgTreeViewRef,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { Shield, Users, FileText, BarChart3 } from "lucide-react";

const nodes = [
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

export default function Example() {
  const [checkedIds, setCheckedIds] = React.useState([]);
  const [readAll, setReadAll] = React.useState([]);
  const [readLeafs, setReadLeafs] = React.useState([]);
  const treeRef = React.useRef(null);

  return (
    <>
      <SgTreeView
        ref={treeRef}
        nodes={nodes}
        searchable
        searchPlaceholder="Search..."
        checkable
        checkedIds={checkedIds}
        onCheckedChange={setCheckedIds}
        onLeafClick={(id) => console.log(id)}
        style={{ border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 12, padding: 8 }}
      />

      <button onClick={() => setReadAll(treeRef.current?.getCheckedIds() ?? [])}>
        Ler todos os checkeds
      </button>
      <button onClick={() => setReadLeafs(treeRef.current?.getCheckedLeafIds() ?? [])}>
        Ler apenas leafs
      </button>

      <div>checkedIds: {readAll.join(", ") || "-"}</div>
      <div>leafIds: {readLeafs.join(", ") || "-"}</div>
    </>
  );
}`}
        />
      </Section>

      <Section title="2) Icon Tone" description="Altere a cor dos icones para primary.">
        <SgCard title="Icons in Primary">
          <SgTreeView
            nodes={DATA}
            iconTone="primary"
            searchable
            searchPlaceholder={t(i18n, "showcase.component.treeView.labels.search")}
          />
        </SgCard>
        <CodeBlock
          code={`import { SgTreeView } from "@seedgrid/fe-components";

<SgTreeView
  nodes={nodes}
  iconTone="primary"
/>`}
        />
      </Section>

      <Section
        title={`3) ${t(i18n, "showcase.component.treeView.sections.confirm.title")}`}
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
import {
  SgCard,
  SgTreeView,
  sgTreeFromJsonWithChecked,
  type SgTreeNode,
  type SgTreeViewRef,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { Shield, Users, FileText, BarChart3 } from "lucide-react";

const nodes = [
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

export default function Example() {
  const [confirmed, setConfirmed] = React.useState([]);
  const treeRef = React.useRef(null);

  return (
    <>
      <SgTreeView
        ref={treeRef}
        nodes={nodes}
        searchable
        searchPlaceholder="Search..."
        checkable
        checkMode="confirm"
        confirmSelection="leafOnly"
        confirmBar={{
          label: "Confirmar",
          showCancel: true,
          cancelLabel: "Limpar",
          onConfirm: (ids) => setConfirmed(ids),
          onCancel: () => treeRef.current?.clearChecked()
        }}
      />

      <div>confirmIds: {confirmed.join(", ") || "-"}</div>
    </>
  );
}`}
        />
      </Section>

      <Section
        title={`4) ${t(i18n, "showcase.component.treeView.sections.size.title")}`}
        description={t(i18n, "showcase.component.treeView.sections.size.description")}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SgTreeView nodes={DATA} size="sm" density="compact" />
          <SgTreeView nodes={DATA} size="md" density="normal" />
          <SgTreeView nodes={DATA} size="lg" density="comfortable" />
        </div>
      </Section>

      <Section
        title={`5) ${t(i18n, "showcase.component.treeView.sections.expanded.title")}`}
        description={t(i18n, "showcase.component.treeView.sections.expanded.description")}
      >
        <SgCard title={t(i18n, "showcase.component.treeView.labels.expandedTitle")}>
          <SgTreeView
            nodes={DATA}
            searchable
            searchPlaceholder={t(i18n, "showcase.component.treeView.labels.search")}
            defaultExpandedIds={["root", "users"]}
          />
        </SgCard>
        <CodeBlock
          code={`import React from "react";
import {
  SgCard,
  SgTreeView,
  sgTreeFromJsonWithChecked,
  type SgTreeNode,
  type SgTreeViewRef,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const nodes = [
  {
    id: "root",
    label: "Admin",
    children: [
      {
        id: "users",
        label: "Users",
        children: [
          { id: "users.list", label: "List users" },
          { id: "users.create", label: "Create user" }
        ]
      },
      {
        id: "reports",
        label: "Reports",
        children: [
          { id: "reports.sales", label: "Sales report" },
          { id: "reports.financial", label: "Financial report" }
        ]
      }
    ]
  }
];

export default function Example() {
  return (
    <SgTreeView
      nodes={nodes}
      searchable
      searchPlaceholder="Search..."
      defaultExpandedIds={["root", "users"]}
    />
  );
}`}
        />
      </Section>

      <Section
        title={`6) ${t(i18n, "showcase.component.treeView.sections.jsonChecked.title")}`}
        description={t(i18n, "showcase.component.treeView.sections.jsonChecked.description")}
      >
        <SgCard title={t(i18n, "showcase.component.treeView.labels.jsonTitle")}>
          {(() => {
            const { nodes, checkedIds } = sgTreeFromJsonWithChecked(JSON_DATA);
            return (
              <SgTreeView
                nodes={nodes}
                checkable
                defaultCheckedIds={checkedIds}
                defaultExpandedIds={["root", "users"]}
              />
            );
          })()}
        </SgCard>
        <CodeBlock
          code={`import React from "react";
import {
  SgCard,
  SgTreeView,
  sgTreeFromJsonWithChecked,
  type SgTreeNode,
  type SgTreeViewRef,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const json = [
  {
    id: "root",
    label: "Admin",
    children: [
      {
        id: "users",
        label: "Users",
        children: [
          { id: "users.list", label: "List users", checked: true },
          { id: "users.create", label: "Create user" }
        ]
      },
      {
        id: "reports",
        label: "Reports",
        children: [
          { id: "reports.sales", label: "Sales report", checked: true },
          { id: "reports.financial", label: "Financial report" }
        ]
      }
    ]
  }
];

export default function Example() {
  const { nodes, checkedIds } = sgTreeFromJsonWithChecked(json);

  return (
    <SgTreeView
      nodes={nodes}
      checkable
      defaultCheckedIds={checkedIds}
      defaultExpandedIds={["root", "users"]}
    />
  );
}`}
        />
      </Section>

      <Section title="7) Playground (SgPlayground)" description="Teste interativo das principais props do SgTreeView.">
        <SgPlayground
          title="SgTreeView Playground"
          interactive
          codeContract="appFile"
          code={TREE_VIEW_PLAYGROUND_CODE}
          height={560}
          defaultOpen
        />
      </Section>

      <ShowcasePropsReference rows={TREE_VIEW_PROPS} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
