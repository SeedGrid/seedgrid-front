"use client";

import React from "react";
import { SgButton } from "../buttons/SgButton";
import { SgGroupBox, type SgGroupBoxProps } from "../layout/SgGroupBox";
import { t, useComponentsI18n } from "../i18n";

export type SgDatatableRow = Record<string, unknown>;

export type SgDatatableSortOrder = 1 | -1 | 0;
export type SgDatatableSelectionMode = "single" | "multiple";
export type SgDatatableFilterMatchMode = "contains" | "startsWith" | "endsWith" | "equals";

export type SgDatatableSortEvent = {
  sortField: string | null;
  sortOrder: SgDatatableSortOrder;
};

export type SgDatatablePageEvent = {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
  totalRecords: number;
};

export type SgDatatableFilterEvent = {
  filters: Record<string, string>;
  globalFilter: string;
};

export type SgDatatableColumnAlign = "left" | "center" | "right";

export type SgDatatableCellMeta<T extends SgDatatableRow> = {
  rowIndex: number;
  field: string | undefined;
  value: unknown;
  rowData: T;
};

export type SgDatatableColumn<T extends SgDatatableRow = SgDatatableRow> = {
  field?: string;
  header: React.ReactNode;
  body?: (rowData: T, meta: SgDatatableCellMeta<T>) => React.ReactNode;
  footer?: React.ReactNode | ((rows: T[]) => React.ReactNode);
  sortable?: boolean;
  sortField?: string;
  sortFunction?: (rowA: T, rowB: T) => number;
  filter?: boolean;
  filterField?: string;
  filterPlaceholder?: string;
  filterMatchMode?: SgDatatableFilterMatchMode;
  excludeGlobalFilter?: boolean;
  align?: SgDatatableColumnAlign;
  width?: number | string;
  minWidth?: number | string;
  hidden?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string | ((rowData: T, rowIndex: number) => string | undefined);
};

export type SgDatatableSelection<T extends SgDatatableRow> = T | T[] | null;

export type SgDatatableRef<T extends SgDatatableRow = SgDatatableRow> = {
  getProcessedRows: () => T[];
  getPagedRows: () => T[];
  clearFilters: () => void;
  clearSelection: () => void;
  resetSort: () => void;
  resetPage: () => void;
  goToPage: (page: number) => void;
};

export type SgDatatableProps<T extends SgDatatableRow = SgDatatableRow> = {
  id?: string;
  title?: string;
  value: T[];
  columns: SgDatatableColumn<T>[];
  dataKey?: string;
  lazy?: boolean;
  totalRecords?: number;
  paginator?: boolean;
  rows?: number;
  first?: number;
  rowsPerPageOptions?: number[];
  onPage?: (event: SgDatatablePageEvent) => void;
  sortField?: string | null;
  sortOrder?: SgDatatableSortOrder;
  onSort?: (event: SgDatatableSortEvent) => void;
  removableSort?: boolean;
  selectionMode?: SgDatatableSelectionMode;
  selection?: SgDatatableSelection<T>;
  onSelectionChange?: (selection: SgDatatableSelection<T>) => void;
  showGlobalFilter?: boolean;
  globalFilter?: string;
  globalFilterPlaceholder?: string;
  onGlobalFilterChange?: (value: string) => void;
  showColumnFilters?: boolean;
  filters?: Record<string, string>;
  onFilter?: (event: SgDatatableFilterEvent) => void;
  showClearFiltersButton?: boolean;
  stripedRows?: boolean;
  showGridlines?: boolean;
  hoverableRows?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  style?: React.CSSProperties;
  tableClassName?: string;
  rowClassName?: string | ((rowData: T, rowIndex: number) => string | undefined);
  groupBoxProps?: Omit<Partial<SgGroupBoxProps>, "children" | "title"> & { title?: string };
};

function cn(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSize(value?: number | string) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function normalizeFilters(filters: Record<string, string> | undefined): Record<string, string> {
  if (!filters) return {};
  return Object.entries(filters).reduce<Record<string, string>>((acc, [field, value]) => {
    const text = String(value ?? "").trim();
    if (!text) return acc;
    acc[field] = text;
    return acc;
  }, {});
}

function getFieldValue(row: SgDatatableRow, field: string | undefined): unknown {
  if (!field) return undefined;
  if (!field.includes(".")) return row[field];

  const chunks = field.split(".");
  let current: unknown = row;
  for (const chunk of chunks) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[chunk];
  }
  return current;
}

function normalizeText(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.toLowerCase();
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value instanceof Date) return value.toISOString().toLowerCase();
  return String(value).toLowerCase();
}

function matchesFilter(value: unknown, query: string, mode: SgDatatableFilterMatchMode): boolean {
  const search = query.trim().toLowerCase();
  if (!search) return true;

  const source = normalizeText(value);
  if (mode === "startsWith") return source.startsWith(search);
  if (mode === "endsWith") return source.endsWith(search);
  if (mode === "equals") return source === search;
  return source.includes(search);
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;

  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();

  return String(a).localeCompare(String(b), undefined, {
    sensitivity: "base",
    numeric: true
  });
}

function resolveMessage(translated: string, key: string, fallback: string) {
  return translated === key ? fallback : translated;
}

function buildPageWindow(currentPage: number, pageCount: number, maxButtons = 5): number[] {
  if (pageCount <= 0) return [];
  if (pageCount <= maxButtons) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, currentPage - half);
  let end = start + maxButtons - 1;
  if (end > pageCount) {
    end = pageCount;
    start = end - maxButtons + 1;
  }

  const pages: number[] = [];
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }
  return pages;
}

function getRowIdentity<T extends SgDatatableRow>(rowData: T, dataKey: string | undefined): unknown {
  if (!dataKey) return rowData;
  return getFieldValue(rowData, dataKey);
}

function rowsAreEqual<T extends SgDatatableRow>(
  rowA: T,
  rowB: T,
  dataKey: string | undefined
): boolean {
  if (!dataKey) return rowA === rowB;
  return getRowIdentity(rowA, dataKey) === getRowIdentity(rowB, dataKey);
}

function resolveAlignmentClass(align: SgDatatableColumnAlign | undefined): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

function SgDatatableBase<T extends SgDatatableRow>(
  props: SgDatatableProps<T>,
  imperativeRef?: React.ForwardedRef<SgDatatableRef<T>>
) {
  const i18n = useComponentsI18n();
  const {
    id,
    title,
    value,
    columns,
    dataKey,
    lazy = false,
    totalRecords: controlledTotalRecords,
    paginator = false,
    rows = 10,
    first,
    rowsPerPageOptions,
    onPage,
    sortField,
    sortOrder,
    onSort,
    removableSort = true,
    selectionMode,
    selection,
    onSelectionChange,
    showGlobalFilter = false,
    globalFilter,
    globalFilterPlaceholder,
    onGlobalFilterChange,
    showColumnFilters = false,
    filters,
    onFilter,
    showClearFiltersButton = false,
    stripedRows = false,
    showGridlines = false,
    hoverableRows = true,
    loading = false,
    emptyMessage,
    className = "",
    style,
    tableClassName = "",
    rowClassName,
    groupBoxProps = {}
  } = props;

  const isFirstControlled = first !== undefined;
  const isSortFieldControlled = sortField !== undefined;
  const isSortOrderControlled = sortOrder !== undefined;
  const isSelectionControlled = selection !== undefined;
  const isGlobalFilterControlled = globalFilter !== undefined;
  const isFiltersControlled = filters !== undefined;

  const [internalFirst, setInternalFirst] = React.useState<number>(Math.max(0, first ?? 0));
  const [internalRows, setInternalRows] = React.useState<number>(Math.max(1, rows));
  const [internalSortField, setInternalSortField] = React.useState<string | null>(sortField ?? null);
  const [internalSortOrder, setInternalSortOrder] = React.useState<SgDatatableSortOrder>(sortOrder ?? 0);
  const [internalSelection, setInternalSelection] = React.useState<SgDatatableSelection<T>>(null);
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState<string>(globalFilter ?? "");
  const [internalFilters, setInternalFilters] = React.useState<Record<string, string>>(() => normalizeFilters(filters));

  React.useEffect(() => {
    if (!isFirstControlled) return;
    setInternalFirst(Math.max(0, first ?? 0));
  }, [isFirstControlled, first]);

  React.useEffect(() => {
    setInternalRows(Math.max(1, rows));
  }, [rows]);

  React.useEffect(() => {
    if (!isSortFieldControlled) return;
    setInternalSortField(sortField ?? null);
  }, [isSortFieldControlled, sortField]);

  React.useEffect(() => {
    if (!isSortOrderControlled) return;
    setInternalSortOrder(sortOrder ?? 0);
  }, [isSortOrderControlled, sortOrder]);

  React.useEffect(() => {
    if (!isSelectionControlled) return;
    setInternalSelection(selection ?? null);
  }, [isSelectionControlled, selection]);

  React.useEffect(() => {
    if (!isGlobalFilterControlled) return;
    setInternalGlobalFilter(globalFilter ?? "");
  }, [isGlobalFilterControlled, globalFilter]);

  React.useEffect(() => {
    if (!isFiltersControlled) return;
    setInternalFilters(normalizeFilters(filters));
  }, [isFiltersControlled, filters]);

  const visibleColumns = React.useMemo(
    () => columns.filter((column) => !column.hidden),
    [columns]
  );

  const currentFirst = isFirstControlled ? Math.max(0, first ?? 0) : internalFirst;
  const currentRows = Math.max(1, internalRows);
  const currentSortField = isSortFieldControlled ? sortField ?? null : internalSortField;
  const currentSortOrder = isSortOrderControlled ? sortOrder ?? 0 : internalSortOrder;
  const currentSelection = isSelectionControlled ? selection ?? null : internalSelection;
  const currentGlobalFilter = isGlobalFilterControlled ? globalFilter ?? "" : internalGlobalFilter;
  const currentFilters = isFiltersControlled ? normalizeFilters(filters) : internalFilters;

  const globalFilterColumns = React.useMemo(
    () =>
      visibleColumns.filter((column) => column.field && !column.excludeGlobalFilter) as Array<
        SgDatatableColumn<T> & { field: string }
      >,
    [visibleColumns]
  );

  const filteredRows = React.useMemo(() => {
    if (lazy) return value;

    return value.filter((rowData) => {
      const matchesGlobal = !currentGlobalFilter.trim()
        ? true
        : globalFilterColumns.some((column) => {
            const columnField = column.filterField ?? column.field;
            return matchesFilter(getFieldValue(rowData, columnField), currentGlobalFilter, "contains");
          });

      if (!matchesGlobal) return false;

      const columnFilterEntries = Object.entries(currentFilters);
      if (columnFilterEntries.length === 0) return true;

      for (const [field, query] of columnFilterEntries) {
        const column = visibleColumns.find((item) => (item.filterField ?? item.field) === field);
        if (!column) continue;
        const matchMode = column.filterMatchMode ?? "contains";
        const fieldValue = getFieldValue(rowData, field);
        if (!matchesFilter(fieldValue, query, matchMode)) return false;
      }

      return true;
    });
  }, [lazy, value, currentGlobalFilter, currentFilters, globalFilterColumns, visibleColumns]);

  const sortedRows = React.useMemo(() => {
    if (lazy) return filteredRows;
    if (!currentSortField || currentSortOrder === 0) return filteredRows;

    const sortColumn = visibleColumns.find(
      (column) => (column.sortField ?? column.field) === currentSortField
    );

    const direction = currentSortOrder === -1 ? -1 : 1;
    return [...filteredRows].sort((rowA, rowB) => {
      if (sortColumn?.sortFunction) {
        return sortColumn.sortFunction(rowA, rowB) * direction;
      }

      const sortFieldName = sortColumn?.sortField ?? sortColumn?.field ?? currentSortField;
      const aValue = getFieldValue(rowA, sortFieldName);
      const bValue = getFieldValue(rowB, sortFieldName);
      return compareValues(aValue, bValue) * direction;
    });
  }, [lazy, currentSortField, currentSortOrder, filteredRows, visibleColumns]);

  const resolvedTotalRecords = lazy ? Math.max(0, controlledTotalRecords ?? value.length) : sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(Math.max(resolvedTotalRecords, 1) / currentRows));
  const maxFirst = Math.max(0, (pageCount - 1) * currentRows);
  const safeFirst = Math.min(currentFirst, maxFirst);

  const pagedRows = React.useMemo(() => {
    if (!paginator) return sortedRows;
    if (lazy) return sortedRows;
    return sortedRows.slice(safeFirst, safeFirst + currentRows);
  }, [paginator, lazy, sortedRows, safeFirst, currentRows]);

  const currentPage = Math.floor(safeFirst / currentRows) + 1;
  const pageWindow = React.useMemo(
    () => buildPageWindow(currentPage, pageCount, 5),
    [currentPage, pageCount]
  );

  const commitPage = React.useCallback(
    (nextFirst: number, nextRows: number) => {
      const normalizedRows = Math.max(1, nextRows);
      const normalizedFirst = Math.max(0, nextFirst);
      if (!isFirstControlled) setInternalFirst(normalizedFirst);
      setInternalRows(normalizedRows);

      const nextPageCount = Math.max(1, Math.ceil(Math.max(resolvedTotalRecords, 1) / normalizedRows));
      const page = Math.floor(normalizedFirst / normalizedRows) + 1;
      onPage?.({
        first: normalizedFirst,
        rows: normalizedRows,
        page,
        pageCount: nextPageCount,
        totalRecords: resolvedTotalRecords
      });
    },
    [isFirstControlled, onPage, resolvedTotalRecords]
  );

  React.useEffect(() => {
    if (safeFirst === currentFirst) return;
    commitPage(safeFirst, currentRows);
  }, [safeFirst, currentFirst, commitPage, currentRows]);

  const commitSort = React.useCallback(
    (nextSortField: string | null, nextSortOrder: SgDatatableSortOrder) => {
      if (!isSortFieldControlled) setInternalSortField(nextSortField);
      if (!isSortOrderControlled) setInternalSortOrder(nextSortOrder);
      onSort?.({ sortField: nextSortField, sortOrder: nextSortOrder });
    },
    [isSortFieldControlled, isSortOrderControlled, onSort]
  );

  const commitSelection = React.useCallback(
    (nextSelection: SgDatatableSelection<T>) => {
      if (!isSelectionControlled) setInternalSelection(nextSelection);
      onSelectionChange?.(nextSelection);
    },
    [isSelectionControlled, onSelectionChange]
  );

  const commitFilters = React.useCallback(
    (nextFilters: Record<string, string>, nextGlobalFilter: string) => {
      if (!isFiltersControlled) setInternalFilters(nextFilters);
      if (!isGlobalFilterControlled) setInternalGlobalFilter(nextGlobalFilter);
      onGlobalFilterChange?.(nextGlobalFilter);
      onFilter?.({ filters: nextFilters, globalFilter: nextGlobalFilter });
      commitPage(0, currentRows);
    },
    [
      isFiltersControlled,
      isGlobalFilterControlled,
      onGlobalFilterChange,
      onFilter,
      commitPage,
      currentRows
    ]
  );

  const clearFilters = React.useCallback(() => {
    commitFilters({}, "");
  }, [commitFilters]);

  const resetSort = React.useCallback(() => {
    commitSort(null, 0);
  }, [commitSort]);

  const clearSelection = React.useCallback(() => {
    if (selectionMode === "multiple") {
      commitSelection([]);
      return;
    }
    commitSelection(null);
  }, [selectionMode, commitSelection]);

  const goToPage = React.useCallback(
    (page: number) => {
      const normalizedPage = Math.max(1, Math.min(page, pageCount));
      commitPage((normalizedPage - 1) * currentRows, currentRows);
    },
    [commitPage, currentRows, pageCount]
  );

  React.useImperativeHandle(
    imperativeRef,
    () => ({
      getProcessedRows: () => sortedRows,
      getPagedRows: () => pagedRows,
      clearFilters,
      clearSelection,
      resetSort,
      resetPage: () => commitPage(0, currentRows),
      goToPage
    }),
    [sortedRows, pagedRows, clearFilters, clearSelection, resetSort, commitPage, currentRows, goToPage]
  );

  const emptyLabel = emptyMessage ?? resolveMessage(
    t(i18n, "components.datatable.empty"),
    "components.datatable.empty",
    "No records found."
  );

  const loadingLabel = resolveMessage(
    t(i18n, "components.datatable.loading"),
    "components.datatable.loading",
    "Loading data..."
  );

  const globalFilterLabel = globalFilterPlaceholder ?? resolveMessage(
    t(i18n, "components.datatable.globalFilterPlaceholder"),
    "components.datatable.globalFilterPlaceholder",
    "Search in all columns"
  );

  const clearFiltersLabel = resolveMessage(
    t(i18n, "components.datatable.clearFilters"),
    "components.datatable.clearFilters",
    "Clear filters"
  );

  const prevLabel = resolveMessage(
    t(i18n, "components.datatable.prev"),
    "components.datatable.prev",
    "Prev"
  );

  const nextLabel = resolveMessage(
    t(i18n, "components.datatable.next"),
    "components.datatable.next",
    "Next"
  );

  const rowsPerPageLabel = resolveMessage(
    t(i18n, "components.datatable.rowsPerPage"),
    "components.datatable.rowsPerPage",
    "Rows per page"
  );

  const pageReport = resolveMessage(
    t(i18n, "components.datatable.pageReport", {
      first: resolvedTotalRecords === 0 ? 0 : safeFirst + 1,
      last: Math.min(safeFirst + currentRows, resolvedTotalRecords),
      total: resolvedTotalRecords
    }),
    "components.datatable.pageReport",
    `${resolvedTotalRecords === 0 ? 0 : safeFirst + 1} - ${Math.min(safeFirst + currentRows, resolvedTotalRecords)} of ${resolvedTotalRecords}`
  );

  const shouldShowToolbar = showGlobalFilter || showClearFiltersButton;
  const shouldShowFiltersRow = showColumnFilters && visibleColumns.some((column) => column.filter);
  const hasFooter = visibleColumns.some((column) => column.footer !== undefined);

  const handleHeaderSort = (column: SgDatatableColumn<T>) => {
    if (!column.sortable) return;
    const nextSortField = column.sortField ?? column.field;
    if (!nextSortField) return;

    if (currentSortField !== nextSortField) {
      commitSort(nextSortField, 1);
      return;
    }

    if (currentSortOrder === 1) {
      commitSort(nextSortField, -1);
      return;
    }

    if (currentSortOrder === -1) {
      if (removableSort) {
        commitSort(null, 0);
      } else {
        commitSort(nextSortField, 1);
      }
      return;
    }

    commitSort(nextSortField, 1);
  };

  const isRowSelected = React.useCallback(
    (rowData: T): boolean => {
      if (!selectionMode) return false;
      if (selectionMode === "single") {
        return currentSelection !== null && !Array.isArray(currentSelection)
          ? rowsAreEqual(currentSelection, rowData, dataKey)
          : false;
      }

      const list = Array.isArray(currentSelection) ? currentSelection : [];
      return list.some((entry) => rowsAreEqual(entry, rowData, dataKey));
    },
    [selectionMode, currentSelection, dataKey]
  );

  const handleRowSelection = React.useCallback(
    (rowData: T) => {
      if (!selectionMode) return;

      if (selectionMode === "single") {
        if (currentSelection !== null && !Array.isArray(currentSelection) && rowsAreEqual(currentSelection, rowData, dataKey)) {
          commitSelection(null);
        } else {
          commitSelection(rowData);
        }
        return;
      }

      const previous = Array.isArray(currentSelection) ? currentSelection : [];
      const exists = previous.some((entry) => rowsAreEqual(entry, rowData, dataKey));
      const next = exists
        ? previous.filter((entry) => !rowsAreEqual(entry, rowData, dataKey))
        : [...previous, rowData];
      commitSelection(next);
    },
    [selectionMode, currentSelection, dataKey, commitSelection]
  );

  const resolvedTitle = (groupBoxProps.title ?? title ?? "").trim() || " ";

  return (
    <div className={className} style={style}>
      <SgGroupBox {...groupBoxProps} title={resolvedTitle}>
        <div className="space-y-3">
          {shouldShowToolbar ? (
            <div className="flex flex-wrap items-center gap-2">
              {showGlobalFilter ? (
                <input
                  value={currentGlobalFilter}
                  onChange={(event) => commitFilters(currentFilters, event.target.value)}
                  placeholder={globalFilterLabel}
                  className="min-w-[220px] flex-1 rounded-md border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-input-bg,var(--sg-surface)))] px-3 py-2 text-sm text-[rgb(var(--sg-input-fg,var(--sg-text)))] placeholder:text-[rgb(var(--sg-input-placeholder,var(--sg-muted)))] outline-none focus:ring-2 focus:ring-[rgb(var(--sg-ring))]"
                />
              ) : null}

              {showClearFiltersButton ? (
                <SgButton size="sm" appearance="outline" onClick={clearFilters}>
                  {clearFiltersLabel}
                </SgButton>
              ) : null}
            </div>
          ) : null}

          <div className="relative">
            <div className="overflow-x-auto rounded-lg border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-surface))]">
              <table id={id} className={cn("min-w-full border-collapse text-sm", tableClassName)}>
                <thead>
                  <tr className="bg-[rgb(var(--sg-primary-50))]">
                    {visibleColumns.map((column, columnIndex) => {
                      const sortCandidate = column.sortField ?? column.field;
                      const isSorted = Boolean(sortCandidate) && sortCandidate === currentSortField;
                      const sortIcon = !column.sortable
                        ? null
                        : isSorted
                          ? currentSortOrder === 1
                            ? " ^"
                            : currentSortOrder === -1
                              ? " v"
                              : " <>"
                          : " <>";

                      return (
                        <th
                          key={`head-${column.field ?? columnIndex}`}
                          className={cn(
                            "px-3 py-2 font-semibold text-[rgb(var(--sg-text))]",
                            resolveAlignmentClass(column.align),
                            showGridlines ? "border-b border-r border-[rgb(var(--sg-border))] last:border-r-0" : "border-b border-[rgb(var(--sg-border))]",
                            column.headerClassName,
                            column.className
                          )}
                          style={{ width: toCssSize(column.width), minWidth: toCssSize(column.minWidth) }}
                        >
                          {column.sortable ? (
                            <button
                              type="button"
                              onClick={() => handleHeaderSort(column)}
                              className={cn(
                                "inline-flex items-center gap-1 font-semibold",
                                resolveAlignmentClass(column.align),
                                "text-[rgb(var(--sg-text))] hover:text-[rgb(var(--sg-primary-600))]"
                              )}
                            >
                              <span>{column.header}</span>
                              <span aria-hidden="true">{sortIcon}</span>
                            </button>
                          ) : (
                            <span>{column.header}</span>
                          )}
                        </th>
                      );
                    })}
                  </tr>

                  {shouldShowFiltersRow ? (
                    <tr>
                      {visibleColumns.map((column, columnIndex) => {
                        const filterField = column.filterField ?? column.field;
                        const filterValue = filterField ? currentFilters[filterField] ?? "" : "";

                        return (
                          <th
                            key={`filter-${column.field ?? columnIndex}`}
                            className={cn(
                              "px-3 py-2 align-top",
                              showGridlines ? "border-b border-r border-[rgb(var(--sg-border))] last:border-r-0" : "border-b border-[rgb(var(--sg-border))]"
                            )}
                          >
                            {column.filter && filterField ? (
                              <input
                                value={filterValue}
                                onChange={(event) => {
                                  const nextFilters = {
                                    ...currentFilters,
                                    [filterField]: event.target.value
                                  };
                                  const normalized = normalizeFilters(nextFilters);
                                  commitFilters(normalized, currentGlobalFilter);
                                }}
                                placeholder={column.filterPlaceholder ?? `Filter ${String(column.header ?? "")}`}
                                className="w-full rounded-md border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-input-bg,var(--sg-surface)))] px-2 py-1 text-xs text-[rgb(var(--sg-input-fg,var(--sg-text)))] placeholder:text-[rgb(var(--sg-input-placeholder,var(--sg-muted)))] outline-none focus:ring-2 focus:ring-[rgb(var(--sg-ring))]"
                              />
                            ) : null}
                          </th>
                        );
                      })}
                    </tr>
                  ) : null}
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={Math.max(1, visibleColumns.length)}
                        className="px-4 py-6 text-center text-sm text-[rgb(var(--sg-muted))]"
                      >
                        {loadingLabel}
                      </td>
                    </tr>
                  ) : pagedRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={Math.max(1, visibleColumns.length)}
                        className="px-4 py-6 text-center text-sm text-[rgb(var(--sg-muted))]"
                      >
                        {emptyLabel}
                      </td>
                    </tr>
                  ) : (
                    pagedRows.map((rowData, rowIndex) => {
                      const absoluteRowIndex = safeFirst + rowIndex;
                      const selected = isRowSelected(rowData);
                      const customRowClass =
                        typeof rowClassName === "function" ? rowClassName(rowData, absoluteRowIndex) : rowClassName;

                      return (
                        <tr
                          key={String(getRowIdentity(rowData, dataKey) ?? absoluteRowIndex)}
                          aria-selected={selected || undefined}
                          onClick={(event) => {
                            const target = event.target as HTMLElement;
                            if (target.closest("button,a,input,select,textarea,label,[data-sg-stop-row-select='true']")) {
                              return;
                            }
                            handleRowSelection(rowData);
                          }}
                          className={cn(
                            selectionMode ? "cursor-pointer" : "",
                            stripedRows && absoluteRowIndex % 2 === 1 ? "bg-[rgb(var(--sg-primary-50))]" : "",
                            hoverableRows ? "hover:bg-[rgb(var(--sg-primary-100))]" : "",
                            selected ? "bg-[rgb(var(--sg-primary-100))]" : "",
                            customRowClass
                          )}
                        >
                          {visibleColumns.map((column, columnIndex) => {
                            const cellField = column.field;
                            const cellValue = getFieldValue(rowData, cellField);
                            const customCellClass =
                              typeof column.bodyClassName === "function"
                                ? column.bodyClassName(rowData, absoluteRowIndex)
                                : column.bodyClassName;

                            const renderedValue = column.body
                              ? column.body(rowData, {
                                  rowData,
                                  rowIndex: absoluteRowIndex,
                                  field: cellField,
                                  value: cellValue
                                })
                              : (
                                  <span>{cellValue === null || cellValue === undefined ? "-" : String(cellValue)}</span>
                                );

                            return (
                              <td
                                key={`cell-${cellField ?? columnIndex}-${absoluteRowIndex}`}
                                className={cn(
                                  "px-3 py-2 text-[rgb(var(--sg-text))]",
                                  resolveAlignmentClass(column.align),
                                  showGridlines ? "border-b border-r border-[rgb(var(--sg-border))] last:border-r-0" : "border-b border-[rgb(var(--sg-border))]",
                                  column.className,
                                  customCellClass
                                )}
                                style={{ width: toCssSize(column.width), minWidth: toCssSize(column.minWidth) }}
                              >
                                {renderedValue}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>

                {hasFooter ? (
                  <tfoot>
                    <tr className="bg-[rgb(var(--sg-primary-50))]">
                      {visibleColumns.map((column, columnIndex) => {
                        const footerValue =
                          typeof column.footer === "function" ? column.footer(sortedRows) : column.footer;

                        return (
                          <td
                            key={`foot-${column.field ?? columnIndex}`}
                            className={cn(
                              "px-3 py-2 font-semibold text-[rgb(var(--sg-text))]",
                              resolveAlignmentClass(column.align),
                              showGridlines ? "border-t border-r border-[rgb(var(--sg-border))] last:border-r-0" : "border-t border-[rgb(var(--sg-border))]",
                              column.className
                            )}
                            style={{ width: toCssSize(column.width), minWidth: toCssSize(column.minWidth) }}
                          >
                            {footerValue ?? null}
                          </td>
                        );
                      })}
                    </tr>
                  </tfoot>
                ) : null}
              </table>
            </div>
          </div>

          {paginator ? (
            <div className="flex flex-wrap items-center gap-2">
              <SgButton
                size="sm"
                appearance="outline"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                {prevLabel}
              </SgButton>

              {pageWindow.map((pageNumber) => (
                <SgButton
                  key={`page-${pageNumber}`}
                  size="sm"
                  appearance={pageNumber === currentPage ? "solid" : "outline"}
                  onClick={() => goToPage(pageNumber)}
                >
                  {String(pageNumber)}
                </SgButton>
              ))}

              <SgButton
                size="sm"
                appearance="outline"
                disabled={currentPage >= pageCount}
                onClick={() => goToPage(currentPage + 1)}
              >
                {nextLabel}
              </SgButton>

              <span className="min-w-[180px] text-xs text-[rgb(var(--sg-muted))] md:ml-auto">
                {pageReport}
              </span>

              {rowsPerPageOptions && rowsPerPageOptions.length > 0 ? (
                <label className="ml-auto inline-flex items-center gap-2 text-xs text-[rgb(var(--sg-muted))] md:ml-0">
                  <span>{rowsPerPageLabel}</span>
                  <select
                    value={currentRows}
                    onChange={(event) => {
                      const nextRows = Number(event.target.value) || currentRows;
                      commitPage(0, nextRows);
                    }}
                    className="rounded-md border border-[rgb(var(--sg-border))] bg-[rgb(var(--sg-input-bg,var(--sg-surface)))] px-2 py-1 text-xs text-[rgb(var(--sg-input-fg,var(--sg-text)))]"
                  >
                    {rowsPerPageOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ) : null}
            </div>
          ) : null}
        </div>
      </SgGroupBox>
    </div>
  );
}

export const SgDatatable = React.forwardRef(SgDatatableBase) as <T extends SgDatatableRow>(
  props: SgDatatableProps<T> & { ref?: React.Ref<SgDatatableRef<T>> }
) => React.ReactElement;
