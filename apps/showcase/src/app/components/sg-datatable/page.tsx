"use client";

import React from "react";
import {
  SgDatatable,
  type SgDatatableColumn,
  type SgDatatableFilterEvent,
  type SgDatatablePageEvent,
  type SgDatatableSelection,
  type SgDatatableSortEvent,
  type SgDatatableSortOrder,
  SgButton,
  SgConfirmationDialog,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { Pencil, Trash2 } from "lucide-react";
import SgCodeBlockBase from "../sgCodeBlockBase";
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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

type ProductRow = {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
};

type PermissionRow = {
  id: number;
  name: string;
  description: string;
};

const SECTION_TITLE_KEYS = [
  "showcase.component.datatable.sections.basic.title",
  "showcase.component.datatable.sections.filters.title",
  "showcase.component.datatable.sections.selection.title",
  "showcase.component.datatable.sections.template.title",
  "showcase.component.datatable.sections.actions.title",
  "showcase.component.datatable.sections.controlled.title",
  "showcase.component.datatable.sections.server.title",
  "showcase.component.datatable.sections.loading.title",
  "showcase.component.datatable.sections.playground.title"
] as const;

const PRODUCT_ROWS: ProductRow[] = [
  { id: 1, code: "P-1000", name: "Notebook Pro 14", category: "Computers", price: 1899, stock: 22, status: "INSTOCK" },
  { id: 2, code: "P-1001", name: "Mechanical Keyboard", category: "Accessories", price: 149, stock: 64, status: "INSTOCK" },
  { id: 3, code: "P-1002", name: "Ergonomic Mouse", category: "Accessories", price: 89, stock: 48, status: "INSTOCK" },
  { id: 4, code: "P-1003", name: "4K Monitor 27", category: "Monitors", price: 499, stock: 8, status: "LOWSTOCK" },
  { id: 5, code: "P-1004", name: "USB-C Dock", category: "Accessories", price: 219, stock: 11, status: "LOWSTOCK" },
  { id: 6, code: "P-1005", name: "Noise Cancelling Headset", category: "Audio", price: 329, stock: 31, status: "INSTOCK" },
  { id: 7, code: "P-1006", name: "Webcam 4K", category: "Video", price: 179, stock: 0, status: "OUTOFSTOCK" },
  { id: 8, code: "P-1007", name: "Portable SSD 2TB", category: "Storage", price: 259, stock: 19, status: "INSTOCK" },
  { id: 9, code: "P-1008", name: "Wi-Fi Router AX", category: "Networking", price: 199, stock: 5, status: "LOWSTOCK" },
  { id: 10, code: "P-1009", name: "Graphics Tablet", category: "Creative", price: 399, stock: 13, status: "INSTOCK" },
  { id: 11, code: "P-1010", name: "Studio Microphone", category: "Audio", price: 249, stock: 7, status: "LOWSTOCK" },
  { id: 12, code: "P-1011", name: "Smart Light Bar", category: "Home Office", price: 99, stock: 0, status: "OUTOFSTOCK" }
];

const PERMISSION_ROWS: PermissionRow[] = [
  { id: 1, name: "PERMIT_GET_ALL_SECRETS", description: "Permission to retrieve all secrets." },
  { id: 2, name: "PERMIT_GET_SECRET_BY_ID", description: "Permission to retrieve a secret by its ID." },
  { id: 3, name: "PERMIT_GET_SECRET_BY_NAME", description: "Permission to retrieve a secret by its name." },
  { id: 4, name: "PERMIT_CREATE_NEW_SECRET", description: "Permission to create a new secret." },
  { id: 5, name: "PERMIT_UPDATE_SECRET", description: "Permission to update an existing secret." },
  { id: 6, name: "PERMIT_DELETE_SECRET", description: "Permission to delete a secret." },
  { id: 7, name: "PERMIT_GET_ALL_USERS", description: "Permission to retrieve all users." },
  { id: 8, name: "PERMIT_GET_USER_BY_ID", description: "Permission to retrieve a user by ID." },
  { id: 9, name: "PERMIT_GET_USER_BY_NAME", description: "Permission to retrieve a user by name." },
  { id: 10, name: "PERMIT_GET_USER_BY_EMAIL", description: "Permission to retrieve a user by email." },
  { id: 11, name: "PERMIT_CREATE_USER", description: "Permission to create a user." },
  { id: 12, name: "PERMIT_DISABLE_USER", description: "Permission to disable a user account." }
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const BASE_COLUMNS: SgDatatableColumn<ProductRow>[] = [
  { field: "code", header: "Code", sortable: true },
  { field: "name", header: "Name", sortable: true },
  { field: "category", header: "Category", sortable: true },
  { field: "price", header: "Price", sortable: true, align: "right" },
  { field: "stock", header: "Stock", sortable: true, align: "right" }
];

const FILTER_COLUMNS: SgDatatableColumn<ProductRow>[] = [
  { field: "code", header: "Code", sortable: true, filter: true, filterPlaceholder: "Filter code" },
  { field: "name", header: "Name", sortable: true, filter: true, filterPlaceholder: "Filter name" },
  { field: "category", header: "Category", sortable: true, filter: true, filterPlaceholder: "Filter category" },
  { field: "status", header: "Status", sortable: true, filter: true, filterPlaceholder: "Filter status" },
  { field: "price", header: "Price", sortable: true, align: "right" }
];

const SERVER_COLUMNS: SgDatatableColumn<ProductRow>[] = [
  { field: "code", header: "Code", sortable: true, filter: true, filterPlaceholder: "Filter code" },
  { field: "name", header: "Name", sortable: true, filter: true, filterPlaceholder: "Filter name" },
  { field: "category", header: "Category", sortable: true, filter: true, filterPlaceholder: "Filter category" },
  { field: "status", header: "Status", sortable: true, filter: true, filterPlaceholder: "Filter status" },
  { field: "price", header: "Price", sortable: true, align: "right" }
];

const TEMPLATE_COLUMNS: SgDatatableColumn<ProductRow>[] = [
  {
    field: "name",
    header: "Product",
    sortable: true,
    body: (row) => (
      <div className="space-y-0.5">
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.code}</p>
      </div>
    ),
    footer: (rows) => <span>Total: {rows.length}</span>
  },
  { field: "category", header: "Category", sortable: true },
  {
    field: "status",
    header: "Status",
    sortable: true,
    body: (row) => (
      <span
        className={
          row.status === "INSTOCK"
            ? "rounded px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700"
            : row.status === "LOWSTOCK"
              ? "rounded px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700"
              : "rounded px-2 py-1 text-xs font-semibold bg-rose-100 text-rose-700"
        }
      >
        {row.status}
      </span>
    )
  },
  {
    field: "price",
    header: "Price",
    sortable: true,
    align: "right",
    body: (row) => <span>{currency.format(row.price)}</span>,
    footer: (rows) => {
      const total = rows.reduce((sum, entry) => sum + entry.price, 0);
      return <span>{currency.format(total)}</span>;
    }
  }
];

function buildDatatableProps(i18n: ShowcaseI18n): ShowcasePropRow[] {
  return [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.id") },
    { prop: "title", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.title") },
    { prop: "value", type: "T[]", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.value") },
    { prop: "columns", type: "SgDatatableColumn<T>[]", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.columns") },
    { prop: "dataKey", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.dataKey") },
    { prop: "lazy", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.datatable.props.rows.lazy") },
    { prop: "totalRecords", type: "number", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.totalRecords") },
    { prop: "paginator", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.datatable.props.rows.paginator") },
    { prop: "rows", type: "number", defaultValue: "10", description: t(i18n, "showcase.component.datatable.props.rows.rows") },
    { prop: "first", type: "number", defaultValue: "0", description: t(i18n, "showcase.component.datatable.props.rows.first") },
    { prop: "rowsPerPageOptions", type: "number[]", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.rowsPerPageOptions") },
    { prop: "onPage", type: "(event) => void", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.onPage") },
    { prop: "sortField", type: "string | null", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.sortField") },
    { prop: "sortOrder", type: "1 | -1 | 0", defaultValue: "0", description: t(i18n, "showcase.component.datatable.props.rows.sortOrder") },
    { prop: "onSort", type: "(event) => void", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.onSort") },
    { prop: "selectionMode", type: "\"single\" | \"multiple\"", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.selectionMode") },
    { prop: "selection", type: "T | T[] | null", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.selection") },
    { prop: "onSelectionChange", type: "(selection) => void", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.onSelectionChange") },
    { prop: "showGlobalFilter", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.datatable.props.rows.showGlobalFilter") },
    { prop: "showColumnFilters", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.datatable.props.rows.showColumnFilters") },
    { prop: "filters", type: "Record<string, string>", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.filters") },
    { prop: "onFilter", type: "(event) => void", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.onFilter") },
    { prop: "stripedRows", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.datatable.props.rows.stripedRows") },
    { prop: "showGridlines", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.datatable.props.rows.showGridlines") },
    { prop: "loading", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.datatable.props.rows.loading") },
    { prop: "emptyMessage", type: "string", defaultValue: "i18n", description: t(i18n, "showcase.component.datatable.props.rows.emptyMessage") },
    { prop: "groupBoxProps", type: "Partial<SgGroupBoxProps>", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.groupBoxProps") },
    { prop: "ref", type: "SgDatatableRef", defaultValue: "-", description: t(i18n, "showcase.component.datatable.props.rows.ref") }
  ];
}

const PRODUCT_ROWS_CODE = `type ProductRow = {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
};

const PRODUCT_ROWS: ProductRow[] = [
  { id: 1, code: "P-1000", name: "Notebook Pro 14", category: "Computers", price: 1899, stock: 22, status: "INSTOCK" },
  { id: 2, code: "P-1001", name: "Mechanical Keyboard", category: "Accessories", price: 149, stock: 64, status: "INSTOCK" },
  { id: 3, code: "P-1002", name: "Ergonomic Mouse", category: "Accessories", price: 89, stock: 48, status: "INSTOCK" },
  { id: 4, code: "P-1003", name: "4K Monitor 27", category: "Monitors", price: 499, stock: 8, status: "LOWSTOCK" },
  { id: 5, code: "P-1004", name: "USB-C Dock", category: "Accessories", price: 219, stock: 11, status: "LOWSTOCK" },
  { id: 6, code: "P-1005", name: "Noise Cancelling Headset", category: "Audio", price: 329, stock: 31, status: "INSTOCK" },
  { id: 7, code: "P-1006", name: "Webcam 4K", category: "Video", price: 179, stock: 0, status: "OUTOFSTOCK" },
  { id: 8, code: "P-1007", name: "Portable SSD 2TB", category: "Storage", price: 259, stock: 19, status: "INSTOCK" },
  { id: 9, code: "P-1008", name: "Wi-Fi Router AX", category: "Networking", price: 199, stock: 5, status: "LOWSTOCK" },
  { id: 10, code: "P-1009", name: "Graphics Tablet", category: "Creative", price: 399, stock: 13, status: "INSTOCK" },
  { id: 11, code: "P-1010", name: "Studio Microphone", category: "Audio", price: 249, stock: 7, status: "LOWSTOCK" },
  { id: 12, code: "P-1011", name: "Smart Light Bar", category: "Home Office", price: 99, stock: 0, status: "OUTOFSTOCK" }
];`;

const PERMISSION_ROWS_CODE = `type PermissionRow = {
  id: number;
  name: string;
  description: string;
};

const PERMISSION_ROWS: PermissionRow[] = [
  { id: 1, name: "PERMIT_GET_ALL_SECRETS", description: "Permission to retrieve all secrets." },
  { id: 2, name: "PERMIT_GET_SECRET_BY_ID", description: "Permission to retrieve a secret by its ID." },
  { id: 3, name: "PERMIT_GET_SECRET_BY_NAME", description: "Permission to retrieve a secret by its name." },
  { id: 4, name: "PERMIT_CREATE_NEW_SECRET", description: "Permission to create a new secret." },
  { id: 5, name: "PERMIT_UPDATE_SECRET", description: "Permission to update an existing secret." },
  { id: 6, name: "PERMIT_DELETE_SECRET", description: "Permission to delete a secret." },
  { id: 7, name: "PERMIT_GET_ALL_USERS", description: "Permission to retrieve all users." },
  { id: 8, name: "PERMIT_GET_USER_BY_ID", description: "Permission to retrieve a user by ID." },
  { id: 9, name: "PERMIT_GET_USER_BY_NAME", description: "Permission to retrieve a user by name." },
  { id: 10, name: "PERMIT_GET_USER_BY_EMAIL", description: "Permission to retrieve a user by email." },
  { id: 11, name: "PERMIT_CREATE_USER", description: "Permission to create a user." },
  { id: 12, name: "PERMIT_DISABLE_USER", description: "Permission to disable a user account." }
];`;

const BASE_COLUMNS_CODE = `const BASE_COLUMNS = [
  { field: "code", header: "Code", sortable: true },
  { field: "name", header: "Name", sortable: true },
  { field: "category", header: "Category", sortable: true },
  { field: "price", header: "Price", sortable: true, align: "right" },
  { field: "stock", header: "Stock", sortable: true, align: "right" }
];`;

const BASIC_CODE = `import React from "react";
import {
  SgDatatable,
  type SgDatatableColumn,
  type SgDatatableFilterEvent,
  type SgDatatablePageEvent,
  type SgDatatableSelection,
  type SgDatatableSortEvent,
  type SgDatatableSortOrder,
  SgButton,
  SgConfirmationDialog,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

${PRODUCT_ROWS_CODE}

${BASE_COLUMNS_CODE}

export default function BasicDatatableExample() {
  return (
    <SgDatatable
      id="datatable-basic"
      title="Product catalog"
      value={PRODUCT_ROWS}
      columns={BASE_COLUMNS}
      dataKey="id"
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10]}
      stripedRows
      showGridlines
    />
  );
}`;

const FILTER_CODE = `import React from "react";
import {
  SgDatatable,
  type SgDatatableColumn,
  type SgDatatableFilterEvent,
  type SgDatatablePageEvent,
  type SgDatatableSelection,
  type SgDatatableSortEvent,
  type SgDatatableSortOrder,
  SgButton,
  SgConfirmationDialog,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

${PRODUCT_ROWS_CODE}

const FILTER_COLUMNS = [
  { field: "code", header: "Code", sortable: true, filter: true, filterPlaceholder: "Filter code" },
  { field: "name", header: "Name", sortable: true, filter: true, filterPlaceholder: "Filter name" },
  { field: "category", header: "Category", sortable: true, filter: true, filterPlaceholder: "Filter category" },
  { field: "status", header: "Status", sortable: true, filter: true, filterPlaceholder: "Filter status" },
  { field: "price", header: "Price", sortable: true, align: "right" }
];

export default function FilterDatatableExample() {
  return (
    <SgDatatable
      id="datatable-filter"
      title="Search and filter"
      value={PRODUCT_ROWS}
      columns={FILTER_COLUMNS}
      dataKey="id"
      paginator
      rows={6}
      showGlobalFilter
      showColumnFilters
      showClearFiltersButton
    />
  );
}`;

const SELECTION_CODE = `import React from "react";
import {
  SgDatatable,
  type SgDatatableColumn,
  type SgDatatableFilterEvent,
  type SgDatatablePageEvent,
  type SgDatatableSelection,
  type SgDatatableSortEvent,
  type SgDatatableSortOrder,
  SgButton,
  SgConfirmationDialog,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

${PRODUCT_ROWS_CODE}

${BASE_COLUMNS_CODE}

export default function SelectionDatatableExample() {
  const [selectionMode, setSelectionMode] = React.useState<"single" | "multiple">("single");
  const [selection, setSelection] = React.useState<SgDatatableSelection<ProductRow>>(null);

  const selectionLabel = React.useMemo(() => {
    if (!selection) return "none";
    if (Array.isArray(selection)) {
      return selection.length === 0 ? "none" : selection.map((row) => row.name).join(", ");
    }
    return selection.name;
  }, [selection]);

  return (
    <>
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton
          appearance={selectionMode === "single" ? "solid" : "outline"}
          onClick={() => {
            setSelectionMode("single");
            setSelection(null);
          }}
        >
          single
        </SgButton>
        <SgButton
          appearance={selectionMode === "multiple" ? "solid" : "outline"}
          onClick={() => {
            setSelectionMode("multiple");
            setSelection([]);
          }}
        >
          multiple
        </SgButton>
        <SgButton appearance="outline" onClick={() => setSelection(selectionMode === "multiple" ? [] : null)}>
          clear selection
        </SgButton>
      </SgGrid>

      <SgDatatable
        id="datatable-selection"
        title="Selectable table"
        value={PRODUCT_ROWS}
        columns={BASE_COLUMNS}
        dataKey="id"
        paginator
        rows={5}
        selectionMode={selectionMode}
        selection={selection}
        onSelectionChange={setSelection}
      />

      <p className="text-sm text-[rgb(var(--sg-muted))]">
        selected: <strong>{selectionLabel}</strong>
      </p>
    </>
  );
}`;

const TEMPLATE_CODE = `import React from "react";
import {
  SgDatatable,
  type SgDatatableColumn,
  type SgDatatableFilterEvent,
  type SgDatatablePageEvent,
  type SgDatatableSelection,
  type SgDatatableSortEvent,
  type SgDatatableSortOrder,
  SgButton,
  SgConfirmationDialog,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

${PRODUCT_ROWS_CODE}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const TEMPLATE_COLUMNS = [
  {
    field: "name",
    header: "Product",
    sortable: true,
    body: (row) => (
      <div className="space-y-0.5">
        <p className="font-medium">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.code}</p>
      </div>
    ),
    footer: (rows) => <span>Total: {rows.length}</span>
  },
  { field: "category", header: "Category", sortable: true },
  {
    field: "status",
    header: "Status",
    sortable: true,
    body: (row) => (
      <span
        className={
          row.status === "INSTOCK"
            ? "rounded px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700"
            : row.status === "LOWSTOCK"
              ? "rounded px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700"
              : "rounded px-2 py-1 text-xs font-semibold bg-rose-100 text-rose-700"
        }
      >
        {row.status}
      </span>
    )
  },
  {
    field: "price",
    header: "Price",
    sortable: true,
    align: "right",
    body: (row) => <span>{currency.format(row.price)}</span>,
    footer: (rows) => {
      const total = rows.reduce((sum, entry) => sum + entry.price, 0);
      return <span>{currency.format(total)}</span>;
    }
  }
];

export default function TemplateDatatableExample() {
  return (
    <SgDatatable
      id="datatable-template"
      title="Custom body and footer"
      value={PRODUCT_ROWS}
      columns={TEMPLATE_COLUMNS}
      dataKey="id"
      paginator
      rows={5}
      showGridlines
    />
  );
}`;

const ACTIONS_CODE = `import React from "react";
import {
  SgDatatable,
  type SgDatatableColumn,
  type SgDatatableFilterEvent,
  type SgDatatablePageEvent,
  type SgDatatableSelection,
  type SgDatatableSortEvent,
  type SgDatatableSortOrder,
  SgButton,
  SgConfirmationDialog,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { Pencil, Trash2 } from "lucide-react";

${PERMISSION_ROWS_CODE}

export default function ActionsDatatableExample() {
  const [permissionRows, setPermissionRows] = React.useState<PermissionRow[]>(PERMISSION_ROWS);
  const [lastPermissionAction, setLastPermissionAction] = React.useState("none");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<PermissionRow | null>(null);

  const permissionColumns = React.useMemo<SgDatatableColumn<PermissionRow>[]>(() => [
    { field: "id", header: "ID", sortable: true, align: "left", width: 80 },
    { field: "name", header: "Name", sortable: true },
    { field: "description", header: "Description", sortable: true },
    {
      header: "Actions",
      align: "center",
      width: 120,
      body: (row) => (
        <SgGrid columns={2} gap={6} className="mx-auto max-w-[76px]">
          <SgButton
            size="sm"
            appearance="ghost"
            severity="secondary"
            iconOnly
            leftIcon={<Pencil className="size-4" />}
            aria-label={\`Edit \${row.name}\`}
            title={\`Edit \${row.name}\`}
            onClick={() => setLastPermissionAction(\`edit: \${row.name}\`)}
          />
          <SgButton
            size="sm"
            appearance="ghost"
            severity="danger"
            iconOnly
            leftIcon={<Trash2 className="size-4" />}
            aria-label={\`Delete \${row.name}\`}
            title={\`Delete \${row.name}\`}
            onClick={() => {
              setPendingDelete(row);
              setConfirmDeleteOpen(true);
            }}
          />
        </SgGrid>
      )
    }
  ], []);

  return (
    <>
      <SgDatatable
        id="datatable-actions"
        title="Permissions with row actions"
        value={permissionRows}
        columns={permissionColumns}
        dataKey="id"
        paginator
        rows={4}
        rowsPerPageOptions={[4, 8]}
        showGridlines
      />
      <SgConfirmationDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        closeOnOverlayClick={false}
        severity="danger"
        title="Delete permission"
        message={pendingDelete ? \`Confirm delete \${pendingDelete.name}?\` : "Confirm delete?"}
        confirmButton={{ label: "Delete", icon: <Trash2 className="size-4" />, severity: "danger" }}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setPendingDelete(null);
        }}
        onConfirm={() => {
          if (!pendingDelete) return;
          setPermissionRows((prev) => prev.filter((item) => item.id !== pendingDelete.id));
          setLastPermissionAction(\`delete: \${pendingDelete.name}\`);
          setConfirmDeleteOpen(false);
          setPendingDelete(null);
        }}
      />
      <p className="text-xs text-muted-foreground">
        last action: {lastPermissionAction}
      </p>
    </>
  );
}`;

const CONTROLLED_CODE = `import React from "react";
import {
  SgDatatable,
  type SgDatatableColumn,
  type SgDatatableFilterEvent,
  type SgDatatablePageEvent,
  type SgDatatableSelection,
  type SgDatatableSortEvent,
  type SgDatatableSortOrder,
  SgButton,
  SgConfirmationDialog,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

${PRODUCT_ROWS_CODE}

${BASE_COLUMNS_CODE}

export default function ControlledDatatableExample() {
  const [controlledSort, setControlledSort] = React.useState<{ sortField: string | null; sortOrder: SgDatatableSortOrder }>({
    sortField: "name",
    sortOrder: 1
  });
  const [controlledPage, setControlledPage] = React.useState<{ first: number; rows: number }>({ first: 0, rows: 4 });

  return (
    <>
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton
          onClick={() => {
            setControlledSort({ sortField: "price", sortOrder: -1 });
            setControlledPage({ first: 0, rows: controlledPage.rows });
          }}
        >
          sort by price desc
        </SgButton>
        <SgButton
          appearance="outline"
          onClick={() => setControlledPage((prev) => ({ ...prev, first: Math.max(0, prev.first - prev.rows) }))}
        >
          prev page
        </SgButton>
        <SgButton
          appearance="outline"
          onClick={() => setControlledPage((prev) => ({ ...prev, first: prev.first + prev.rows }))}
        >
          next page
        </SgButton>
      </SgGrid>

      <SgDatatable
        id="datatable-controlled"
        title="Controlled state"
        value={PRODUCT_ROWS}
        columns={BASE_COLUMNS}
        dataKey="id"
        paginator
        rows={controlledPage.rows}
        first={controlledPage.first}
        sortField={controlledSort.sortField}
        sortOrder={controlledSort.sortOrder}
        onSort={(event: SgDatatableSortEvent) =>
          setControlledSort({ sortField: event.sortField, sortOrder: event.sortOrder })
        }
        onPage={(event: SgDatatablePageEvent) =>
          setControlledPage({ first: event.first, rows: event.rows })
        }
      />

      <p className="text-xs text-muted-foreground">
        sort: {controlledSort.sortField ?? "none"} ({controlledSort.sortOrder}) | first: {controlledPage.first} | rows: {controlledPage.rows}
      </p>
    </>
  );
}`;

const LOADING_EMPTY_CODE = `import React from "react";
import {
  SgDatatable,
  type SgDatatableColumn,
  type SgDatatableFilterEvent,
  type SgDatatablePageEvent,
  type SgDatatableSelection,
  type SgDatatableSortEvent,
  type SgDatatableSortOrder,
  SgButton,
  SgConfirmationDialog,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

${PRODUCT_ROWS_CODE}

${BASE_COLUMNS_CODE}

export default function LoadingDatatableExample() {
  const [loading, setLoading] = React.useState(false);
  const [showEmpty, setShowEmpty] = React.useState(false);

  return (
    <>
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton appearance={loading ? "solid" : "outline"} onClick={() => setLoading((value) => !value)}>
          toggle loading
        </SgButton>
        <SgButton appearance={showEmpty ? "solid" : "outline"} onClick={() => setShowEmpty((value) => !value)}>
          toggle empty
        </SgButton>
      </SgGrid>

      <SgDatatable
        id="datatable-loading"
        title="Loading and empty"
        value={showEmpty ? [] : PRODUCT_ROWS}
        columns={BASE_COLUMNS}
        dataKey="id"
        loading={loading}
        emptyMessage="No products available."
      />
    </>
  );
}`;

type ServerQuery = {
  first: number;
  rows: number;
  sortField: string | null;
  sortOrder: SgDatatableSortOrder;
  globalFilter: string;
  filters: Record<string, string>;
};

type ServerResult = {
  data: ProductRow[];
  totalRecords: number;
};

const SERVER_DATASET: ProductRow[] = Array.from({ length: 48 }, (_, index) => {
  const base = PRODUCT_ROWS[index % PRODUCT_ROWS.length]!;
  return {
    ...base,
    id: 1000 + index,
    code: `SRV-${String(index + 1).padStart(4, "0")}`,
    name: `${base.name} ${Math.floor(index / PRODUCT_ROWS.length) + 1}`,
    price: base.price + (index % 7) * 5,
    stock: Math.max(0, base.stock + (index % 9) - 4)
  };
});

function normalizeComparable(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).toLowerCase();
}

function compareComparable(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;

  return String(a).localeCompare(String(b), undefined, {
    sensitivity: "base",
    numeric: true
  });
}

async function simulateProductsApi(query: ServerQuery): Promise<ServerResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 450));

  let filtered = [...SERVER_DATASET];
  const globalTerm = query.globalFilter.trim().toLowerCase();

  if (globalTerm) {
    filtered = filtered.filter((row) =>
      [row.code, row.name, row.category, row.status].some((value) =>
        normalizeComparable(value).includes(globalTerm)
      )
    );
  }

  for (const [field, term] of Object.entries(query.filters)) {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) continue;
    filtered = filtered.filter((row) => {
      const value = row[field as keyof ProductRow];
      return normalizeComparable(value).includes(normalizedTerm);
    });
  }

  if (query.sortField && query.sortOrder !== 0) {
    const factor = query.sortOrder === -1 ? -1 : 1;
    filtered.sort((rowA, rowB) => {
      const left = rowA[query.sortField as keyof ProductRow];
      const right = rowB[query.sortField as keyof ProductRow];
      return compareComparable(left, right) * factor;
    });
  }

  const totalRecords = filtered.length;
  const data = filtered.slice(query.first, query.first + query.rows);

  return { data, totalRecords };
}

const SERVER_SIDE_CODE = `import React from "react";
import {
  SgDatatable,
  type SgDatatableColumn,
  type SgDatatableFilterEvent,
  type SgDatatablePageEvent,
  type SgDatatableSelection,
  type SgDatatableSortEvent,
  type SgDatatableSortOrder,
  SgButton,
  SgConfirmationDialog,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

${PRODUCT_ROWS_CODE}

type ServerQuery = {
  first: number;
  rows: number;
  sortField: string | null;
  sortOrder: SgDatatableSortOrder;
  globalFilter: string;
  filters: Record<string, string>;
};

type ServerResult = {
  data: ProductRow[];
  totalRecords: number;
};

const SERVER_COLUMNS: SgDatatableColumn<ProductRow>[] = [
  { field: "code", header: "Code", sortable: true, filter: true, filterPlaceholder: "Filter code" },
  { field: "name", header: "Name", sortable: true, filter: true, filterPlaceholder: "Filter name" },
  { field: "category", header: "Category", sortable: true, filter: true, filterPlaceholder: "Filter category" },
  { field: "status", header: "Status", sortable: true, filter: true, filterPlaceholder: "Filter status" },
  { field: "price", header: "Price", sortable: true, align: "right" }
];

const SERVER_DATASET: ProductRow[] = Array.from({ length: 48 }, (_, index) => {
  const base = PRODUCT_ROWS[index % PRODUCT_ROWS.length]!;
  return {
    ...base,
    id: 1000 + index,
    code: \`SRV-\${String(index + 1).padStart(4, "0")}\`,
    name: \`\${base.name} \${Math.floor(index / PRODUCT_ROWS.length) + 1}\`,
    price: base.price + (index % 7) * 5,
    stock: Math.max(0, base.stock + (index % 9) - 4)
  };
});

function normalizeComparable(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).toLowerCase();
}

function compareComparable(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { sensitivity: "base", numeric: true });
}

async function simulateProductsApi(query: ServerQuery): Promise<ServerResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 450));

  let filtered = [...SERVER_DATASET];
  const globalTerm = query.globalFilter.trim().toLowerCase();

  if (globalTerm) {
    filtered = filtered.filter((row) =>
      [row.code, row.name, row.category, row.status].some((value) =>
        normalizeComparable(value).includes(globalTerm)
      )
    );
  }

  for (const [field, term] of Object.entries(query.filters)) {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) continue;
    filtered = filtered.filter((row) => {
      const value = row[field as keyof ProductRow];
      return normalizeComparable(value).includes(normalizedTerm);
    });
  }

  if (query.sortField && query.sortOrder !== 0) {
    const factor = query.sortOrder === -1 ? -1 : 1;
    filtered.sort((rowA, rowB) => {
      const left = rowA[query.sortField as keyof ProductRow];
      const right = rowB[query.sortField as keyof ProductRow];
      return compareComparable(left, right) * factor;
    });
  }

  const totalRecords = filtered.length;
  const data = filtered.slice(query.first, query.first + query.rows);
  return { data, totalRecords };
}

export default function ServerSideDatatableExample() {
  const [serverQuery, setServerQuery] = React.useState<ServerQuery>({
    first: 0,
    rows: 4,
    sortField: "name",
    sortOrder: 1,
    globalFilter: "",
    filters: {}
  });
  const [serverRows, setServerRows] = React.useState<ProductRow[]>([]);
  const [serverTotalRecords, setServerTotalRecords] = React.useState(0);
  const [serverLoading, setServerLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setServerLoading(true);
      try {
        const response = await simulateProductsApi(serverQuery);
        if (cancelled) return;
        setServerRows(response.data);
        setServerTotalRecords(response.totalRecords);
      } finally {
        if (!cancelled) setServerLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [serverQuery]);

  return (
    <>
      <SgDatatable
        id="datatable-server"
        title="Server-side pagination"
        value={serverRows}
        columns={SERVER_COLUMNS}
        dataKey="id"
        lazy
        totalRecords={serverTotalRecords}
        paginator
        rows={serverQuery.rows}
        first={serverQuery.first}
        rowsPerPageOptions={[4, 8, 12]}
        sortField={serverQuery.sortField}
        sortOrder={serverQuery.sortOrder}
        onSort={(event: SgDatatableSortEvent) =>
          setServerQuery((prev) => ({
            ...prev,
            first: 0,
            sortField: event.sortField,
            sortOrder: event.sortOrder
          }))
        }
        showGlobalFilter
        globalFilter={serverQuery.globalFilter}
        showColumnFilters
        filters={serverQuery.filters}
        onFilter={(event: SgDatatableFilterEvent) =>
          setServerQuery((prev) => ({
            ...prev,
            first: 0,
            globalFilter: event.globalFilter,
            filters: event.filters
          }))
        }
        onPage={(event: SgDatatablePageEvent) =>
          setServerQuery((prev) => ({
            ...prev,
            first: event.first,
            rows: event.rows
          }))
        }
        loading={serverLoading}
        showClearFiltersButton
        stripedRows
        showGridlines
      />

      <p className="text-xs text-muted-foreground">
        current page rows: {serverRows.length} | total records: {serverTotalRecords}
      </p>
    </>
  );
}`;

const PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";

const SgDatatableFromLib = (SeedGrid as Record<string, unknown>).SgDatatable as
  | React.ComponentType<any>
  | undefined;

const ROWS = [
  { id: 1, code: "A-101", name: "Alpha", category: "Tools", price: 45, stock: 14 },
  { id: 2, code: "A-102", name: "Beta", category: "Tools", price: 30, stock: 8 },
  { id: 3, code: "A-103", name: "Gamma", category: "Office", price: 72, stock: 20 },
  { id: 4, code: "A-104", name: "Delta", category: "Office", price: 15, stock: 40 },
  { id: 5, code: "A-105", name: "Omega", category: "Hardware", price: 120, stock: 5 }
];

const COLUMNS = [
  { field: "code", header: "Code", sortable: true },
  { field: "name", header: "Name", sortable: true },
  { field: "category", header: "Category", sortable: true },
  { field: "price", header: "Price", sortable: true, align: "right" },
  { field: "stock", header: "Stock", sortable: true, align: "right" }
];

export default function App() {
  const hasComponent = typeof SgDatatableFromLib === "function";
  const [rows, setRows] = React.useState(5);
  const [paginator, setPaginator] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState(false);
  const [stripedRows, setStripedRows] = React.useState(true);
  const [showGridlines, setShowGridlines] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(ROWS);

  return (
    <div className="space-y-4 p-2">
      {!hasComponent ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgDatatable is not available in the published Sandpack version. Showing fallback.
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={paginator} onChange={(event) => setPaginator(event.target.checked)} /> paginator</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={globalFilter} onChange={(event) => setGlobalFilter(event.target.checked)} /> showGlobalFilter</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={columnFilters} onChange={(event) => setColumnFilters(event.target.checked)} /> showColumnFilters</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={stripedRows} onChange={(event) => setStripedRows(event.target.checked)} /> stripedRows</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={showGridlines} onChange={(event) => setShowGridlines(event.target.checked)} /> showGridlines</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={loading} onChange={(event) => setLoading(event.target.checked)} /> loading</label>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <button className="rounded border border-border px-2 py-1 text-xs" onClick={() => setRows((prev) => Math.max(2, prev - 1))}>- rows</button>
        <button className="rounded border border-border px-2 py-1 text-xs" onClick={() => setRows((prev) => Math.min(10, prev + 1))}>+ rows</button>
        <button className="rounded border border-border px-2 py-1 text-xs" onClick={() => setData((prev) => (prev.length ? [] : ROWS))}>toggle empty</button>
      </div>

      <div className="rounded border border-border p-3">
        {hasComponent ? (
          <SgDatatableFromLib
            id="datatable-playground"
            title="Datatable Playground"
            value={data}
            columns={COLUMNS}
            dataKey="id"
            paginator={paginator}
            rows={rows}
            rowsPerPageOptions={[3, 5, 10]}
            showGlobalFilter={globalFilter}
            showColumnFilters={columnFilters}
            stripedRows={stripedRows}
            showGridlines={showGridlines}
            loading={loading}
            showClearFiltersButton
          />
        ) : (
          <table className="w-full text-sm">
            <thead><tr><th className="text-left">Code</th><th className="text-left">Name</th><th className="text-left">Category</th></tr></thead>
            <tbody>{data.map((row) => <tr key={row.id}><td>{row.code}</td><td>{row.name}</td><td>{row.category}</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
`;

export default function SgDatatableShowcase() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  const [selectionMode, setSelectionMode] = React.useState<"single" | "multiple">("single");
  const [selection, setSelection] = React.useState<SgDatatableSelection<ProductRow>>(null);

  const [controlledSort, setControlledSort] = React.useState<{ sortField: string | null; sortOrder: SgDatatableSortOrder }>({
    sortField: "name",
    sortOrder: 1
  });
  const [controlledPage, setControlledPage] = React.useState<{ first: number; rows: number }>({
    first: 0,
    rows: 4
  });

  const [serverQuery, setServerQuery] = React.useState<ServerQuery>({
    first: 0,
    rows: 4,
    sortField: "name",
    sortOrder: 1,
    globalFilter: "",
    filters: {}
  });
  const [serverRows, setServerRows] = React.useState<ProductRow[]>([]);
  const [serverTotalRecords, setServerTotalRecords] = React.useState(0);
  const [serverLoading, setServerLoading] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [showEmpty, setShowEmpty] = React.useState(false);
  const [permissionRows, setPermissionRows] = React.useState<PermissionRow[]>(PERMISSION_ROWS);
  const [lastPermissionAction, setLastPermissionAction] = React.useState("none");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<PermissionRow | null>(null);
  const sectionTitles = React.useMemo(
    () => SECTION_TITLE_KEYS.map((key) => t(i18n, key)),
    [i18n.locale]
  );
  const datatableProps = React.useMemo(
    () => buildDatatableProps(i18n),
    [i18n.locale]
  );

  const selectionLabel = React.useMemo(() => {
    if (!selection) return "none";
    if (Array.isArray(selection)) {
      return selection.length === 0 ? "none" : selection.map((row) => row.name).join(", ");
    }
    return selection.name;
  }, [selection]);

  const permissionColumns = React.useMemo<SgDatatableColumn<PermissionRow>[]>(() => [
    { field: "id", header: "ID", sortable: true, align: "left", width: 80 },
    { field: "name", header: "Name", sortable: true },
    { field: "description", header: "Description", sortable: true },
    {
      header: "Actions",
      align: "center",
      width: 120,
      body: (row) => (
        <SgGrid columns={2} gap={6} className="mx-auto max-w-[76px]">
          <SgButton
            size="sm"
            appearance="ghost"
            severity="secondary"
            iconOnly
            leftIcon={<Pencil className="size-4" />}
            aria-label={`Edit ${row.name}`}
            title={`Edit ${row.name}`}
            onClick={() => setLastPermissionAction(`edit: ${row.name}`)}
          />
          <SgButton
            size="sm"
            appearance="ghost"
            severity="danger"
            iconOnly
            leftIcon={<Trash2 className="size-4" />}
            aria-label={`Delete ${row.name}`}
            title={`Delete ${row.name}`}
            onClick={() => {
              setPendingDelete(row);
              setConfirmDeleteOpen(true);
            }}
          />
        </SgGrid>
      )
    }
  ], []);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setServerLoading(true);
      try {
        const response = await simulateProductsApi(serverQuery);
        if (cancelled) return;
        setServerRows(response.data);
        setServerTotalRecords(response.totalRecords);
      } finally {
        if (!cancelled) setServerLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [serverQuery]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgDatatable"
          subtitle={t(i18n, "showcase.component.datatable.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={sectionTitles[0] ?? ""}>
          <SgDatatable
            id="datatable-basic"
            title="Product catalog"
            value={PRODUCT_ROWS}
            columns={BASE_COLUMNS}
            dataKey="id"
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10]}
            stripedRows
            showGridlines
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-datatable/samples/basico.tsx.sample" />
        </Section>

        <Section title={sectionTitles[1] ?? ""}>
          <SgDatatable
            id="datatable-filter"
            title="Search and filter"
            value={PRODUCT_ROWS}
            columns={FILTER_COLUMNS}
            dataKey="id"
            paginator
            rows={6}
            showGlobalFilter
            showColumnFilters
            showClearFiltersButton
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-datatable/samples/filtros.tsx.sample" />
        </Section>

        <Section title={sectionTitles[2] ?? ""}>
          <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
            <SgButton
              appearance={selectionMode === "single" ? "solid" : "outline"}
              onClick={() => {
                setSelectionMode("single");
                setSelection(null);
              }}
            >
              single
            </SgButton>
            <SgButton
              appearance={selectionMode === "multiple" ? "solid" : "outline"}
              onClick={() => {
                setSelectionMode("multiple");
                setSelection([]);
              }}
            >
              multiple
            </SgButton>
            <SgButton appearance="outline" onClick={() => setSelection(selectionMode === "multiple" ? [] : null)}>
              clear selection
            </SgButton>
          </SgGrid>

          <SgDatatable
            id="datatable-selection"
            title="Selectable table"
            value={PRODUCT_ROWS}
            columns={BASE_COLUMNS}
            dataKey="id"
            paginator
            rows={5}
            selectionMode={selectionMode}
            selection={selection}
            onSelectionChange={setSelection}
          />
          <p className="text-sm text-[rgb(var(--sg-muted))]">
            selected: <strong>{selectionLabel}</strong>
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-datatable/samples/selecao.tsx.sample" />
        </Section>

        <Section title={sectionTitles[3] ?? ""}>
          <SgDatatable
            id="datatable-template"
            title="Custom body and footer"
            value={PRODUCT_ROWS}
            columns={TEMPLATE_COLUMNS}
            dataKey="id"
            paginator
            rows={5}
            showGridlines
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-datatable/samples/templates.tsx.sample" />
        </Section>

        <Section title={sectionTitles[4] ?? ""}>
          <SgDatatable
            id="datatable-actions"
            title="Permissions with row actions"
            value={permissionRows}
            columns={permissionColumns}
            dataKey="id"
            paginator
            rows={4}
            rowsPerPageOptions={[4, 8]}
            showGridlines
          />
          <SgConfirmationDialog
            open={confirmDeleteOpen}
            onOpenChange={setConfirmDeleteOpen}
            closeOnOverlayClick={false}
            severity="danger"
            title="Delete permission"
            message={pendingDelete ? `Confirm delete ${pendingDelete.name}?` : "Confirm delete?"}
            confirmButton={{ label: "Delete", icon: <Trash2 className="size-4" />, severity: "danger" }}
            onCancel={() => {
              setConfirmDeleteOpen(false);
              setPendingDelete(null);
            }}
            onConfirm={() => {
              if (!pendingDelete) return;
              setPermissionRows((prev) => prev.filter((item) => item.id !== pendingDelete.id));
              setLastPermissionAction(`delete: ${pendingDelete.name}`);
              setConfirmDeleteOpen(false);
              setPendingDelete(null);
            }}
          />
          <p className="text-xs text-muted-foreground">
            last action: {lastPermissionAction}
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-datatable/samples/acoes.tsx.sample" />
        </Section>

        <Section title={sectionTitles[5] ?? ""}>
          <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
            <SgButton
              onClick={() => {
                setControlledSort({ sortField: "price", sortOrder: -1 });
                setControlledPage({ first: 0, rows: controlledPage.rows });
              }}
            >
              sort by price desc
            </SgButton>
            <SgButton
              appearance="outline"
              onClick={() => setControlledPage((prev) => ({ ...prev, first: Math.max(0, prev.first - prev.rows) }))}
            >
              prev page
            </SgButton>
            <SgButton
              appearance="outline"
              onClick={() => setControlledPage((prev) => ({ ...prev, first: prev.first + prev.rows }))}
            >
              next page
            </SgButton>
          </SgGrid>

          <SgDatatable
            id="datatable-controlled"
            title="Controlled state"
            value={PRODUCT_ROWS}
            columns={BASE_COLUMNS}
            dataKey="id"
            paginator
            rows={controlledPage.rows}
            first={controlledPage.first}
            sortField={controlledSort.sortField}
            sortOrder={controlledSort.sortOrder}
            onSort={(event: SgDatatableSortEvent) =>
              setControlledSort({ sortField: event.sortField, sortOrder: event.sortOrder })
            }
            onPage={(event: SgDatatablePageEvent) =>
              setControlledPage({ first: event.first, rows: event.rows })
            }
          />
          <p className="text-xs text-muted-foreground">
            sort: {controlledSort.sortField ?? "none"} ({controlledSort.sortOrder}) | first: {controlledPage.first} | rows: {controlledPage.rows}
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-datatable/samples/controlado.tsx.sample" />
        </Section>

        <Section title={sectionTitles[6] ?? ""}>
          <SgDatatable
            id="datatable-server"
            title="Server-side pagination"
            value={serverRows}
            columns={SERVER_COLUMNS}
            dataKey="id"
            lazy
            totalRecords={serverTotalRecords}
            paginator
            rows={serverQuery.rows}
            first={serverQuery.first}
            rowsPerPageOptions={[4, 8, 12]}
            sortField={serverQuery.sortField}
            sortOrder={serverQuery.sortOrder}
            onSort={(event: SgDatatableSortEvent) =>
              setServerQuery((prev) => ({
                ...prev,
                first: 0,
                sortField: event.sortField,
                sortOrder: event.sortOrder
              }))
            }
            showGlobalFilter
            globalFilter={serverQuery.globalFilter}
            showColumnFilters
            filters={serverQuery.filters}
            onFilter={(event: SgDatatableFilterEvent) =>
              setServerQuery((prev) => ({
                ...prev,
                first: 0,
                globalFilter: event.globalFilter,
                filters: event.filters
              }))
            }
            onPage={(event: SgDatatablePageEvent) =>
              setServerQuery((prev) => ({
                ...prev,
                first: event.first,
                rows: event.rows
              }))
            }
            loading={serverLoading}
            showClearFiltersButton
            stripedRows
            showGridlines
          />
          <p className="text-xs text-muted-foreground">
            current page rows: {serverRows.length} | total records: {serverTotalRecords}
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-datatable/samples/server-side.tsx.sample" />
        </Section>

        <Section title={sectionTitles[7] ?? ""}>
          <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
            <SgButton appearance={loading ? "solid" : "outline"} onClick={() => setLoading((value) => !value)}>
              toggle loading
            </SgButton>
            <SgButton appearance={showEmpty ? "solid" : "outline"} onClick={() => setShowEmpty((value) => !value)}>
              toggle empty
            </SgButton>
          </SgGrid>

          <SgDatatable
            id="datatable-loading"
            title="Loading and empty"
            value={showEmpty ? [] : PRODUCT_ROWS}
            columns={BASE_COLUMNS}
            dataKey="id"
            loading={loading}
            emptyMessage="No products available."
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-datatable/samples/loading-e-vazio.tsx.sample" />
        </Section>

        <Section title={sectionTitles[8] ?? ""}>
          <SgPlayground
            title="SgDatatable Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-datatable/sg-datatable.tsx.playground"
            height={760}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={datatableProps} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


