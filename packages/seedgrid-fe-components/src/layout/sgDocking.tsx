"use client";

import * as React from "react";

export type SgDockAlign = "top" | "left" | "bottom" | "right" | "client";
export type SgDockPercent = number | `${number}%`;
export type SgDockContentDirection = "row" | "column";
export type SgDockContentJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";
export type SgDockContentAlign = "start" | "center" | "end" | "stretch";

type DockLikeProps = {
  align?: SgDockAlign;
  width?: SgDockPercent;
  height?: SgDockPercent;
  minWidthPx?: number;
  minHeightPx?: number;
  className?: string;
  style?: React.CSSProperties;
};

type DockItem = {
  key: React.Key;
  node: React.ReactNode;
  align: SgDockAlign;
  width?: SgDockPercent;
  height?: SgDockPercent;
  minWidthPx?: number;
  minHeightPx?: number;
};

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function toCssSpace(value?: number | string) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export function toCssPercent(value?: SgDockPercent) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}%` : value;
}

export function getDefaultContentDirection(
  align: SgDockAlign | undefined
): SgDockContentDirection {
  return align === "top" || align === "bottom" ? "row" : "column";
}

export function getDefaultContentAlign(
  align: SgDockAlign | undefined
): SgDockContentAlign {
  return align === "top" || align === "bottom" ? "start" : "stretch";
}

export function getDefaultContentGap() {
  return 10;
}

function getJustifyClass(justify: SgDockContentJustify) {
  const map: Record<SgDockContentJustify, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly"
  };
  return map[justify];
}

function getAlignClass(align: SgDockContentAlign) {
  const map: Record<SgDockContentAlign, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch"
  };
  return map[align];
}

function isDockPanelElement(node: React.ReactNode): node is React.ReactElement<DockLikeProps> {
  if (!React.isValidElement<DockLikeProps>(node)) return false;
  const elementType = node.type as { displayName?: string; name?: string };
  const typeName = elementType.displayName ?? elementType.name;
  return typeName === "SgPanel" && node.props.align !== undefined;
}

function cloneWithLayout(
  node: React.ReactNode,
  key: React.Key,
  extraStyle: React.CSSProperties,
  extraClassName?: string
) {
  if (!React.isValidElement(node)) {
    return (
      <div key={key} style={extraStyle} className={extraClassName}>
        {node}
      </div>
    );
  }

  const element = node as React.ReactElement<DockLikeProps>;
  const mergedStyle = { ...(element.props.style ?? {}), ...extraStyle };

  return React.cloneElement(element, {
    key: element.key ?? key,
    className: cn(element.props.className, extraClassName),
    style: mergedStyle
  });
}

function renderDockItem(
  item: DockItem,
  index: number,
  axis: SgDockAlign
) {
  if (axis === "top" || axis === "bottom") {
    const heightCss = toCssPercent(item.height);
    return cloneWithLayout(
      item.node,
      item.key ?? `${axis}-${index}`,
      {
        width: "100%",
        minWidth: 0,
        ...(item.minHeightPx !== undefined ? { minHeight: `${item.minHeightPx}px` } : null),
        ...(heightCss !== undefined
          ? { height: heightCss, flex: `0 0 ${heightCss}` }
          : { height: "auto", flex: "0 0 auto" })
      },
      "w-full min-w-0"
    );
  }

  if (axis === "left" || axis === "right") {
    const widthCss = toCssPercent(item.width);
    return cloneWithLayout(
      item.node,
      item.key ?? `${axis}-${index}`,
      {
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        ...(item.minWidthPx !== undefined ? { minWidth: `${item.minWidthPx}px` } : null),
        ...(widthCss !== undefined
          ? { width: widthCss, flex: `0 0 ${widthCss}` }
          : { width: "auto", flex: "0 0 auto" })
      },
      "h-full min-h-0 min-w-0"
    );
  }

  return cloneWithLayout(
    item.node,
    item.key ?? `client-${index}`,
    {
      width: "100%",
      height: "100%",
      minWidth: 0,
      minHeight: 0,
      flex: "1 1 0%"
    },
    "h-full w-full min-h-0 min-w-0"
  );
}

export function renderDockContent(options: {
  children?: React.ReactNode;
  align?: SgDockAlign;
  contentDirection?: SgDockContentDirection;
  contentGap?: number | string;
  contentJustify?: SgDockContentJustify;
  contentAlign?: SgDockContentAlign;
  contentWrap?: boolean;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
}) {
  const {
    children,
    align,
    contentDirection,
    contentGap,
    contentJustify,
    contentAlign,
    contentWrap,
    contentClassName,
    contentStyle
  } = options;

  const resolvedContentDirection =
    contentDirection ?? getDefaultContentDirection(align);
  const resolvedContentGap = contentGap ?? getDefaultContentGap();
  const resolvedContentJustify = contentJustify ?? "start";
  const resolvedContentAlign =
    contentAlign ?? getDefaultContentAlign(align);
  const resolvedContentWrap = contentWrap ?? false;
  const gapCss = toCssSpace(resolvedContentGap);

  const dockItems: DockItem[] = [];
  const looseChildren: React.ReactNode[] = [];

  React.Children.forEach(children, (node, index) => {
    if (isDockPanelElement(node)) {
      dockItems.push({
        key: node.key ?? `dock-${index}`,
        node,
        align: node.props.align ?? "client",
        width: node.props.width,
        height: node.props.height,
        minWidthPx: node.props.minWidthPx,
        minHeightPx: node.props.minHeightPx
      });
      return;
    }

    looseChildren.push(node);
  });

  const top = dockItems.filter((item) => item.align === "top");
  const bottom = dockItems.filter((item) => item.align === "bottom");
  const left = dockItems.filter((item) => item.align === "left");
  const right = dockItems.filter((item) => item.align === "right");
  const client = dockItems.filter((item) => item.align === "client");
  const hasDockChildren = dockItems.length > 0;

  if (!hasDockChildren) {
    return (
      <div
        className={cn(
          "flex flex-1 min-h-0 min-w-0",
          resolvedContentDirection === "row" ? "flex-row" : "flex-col",
          getJustifyClass(resolvedContentJustify),
          getAlignClass(resolvedContentAlign),
          resolvedContentWrap ? "flex-wrap" : "",
          contentClassName
        )}
        style={{
          gap: toCssSpace(resolvedContentGap),
          ...contentStyle
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 min-w-0 flex-col" style={gapCss ? { gap: gapCss } : undefined}>
      {top.map((item, index) => renderDockItem(item, index, "top"))}

      <div className="flex flex-1 min-h-0 min-w-0" style={gapCss ? { gap: gapCss } : undefined}>
        {left.map((item, index) => renderDockItem(item, index, "left"))}

        <div className="flex flex-1 min-h-0 min-w-0" style={gapCss ? { gap: gapCss } : undefined}>
          {client.map((item, index) => renderDockItem(item, index, "client"))}

          {looseChildren.length > 0 ? (
            <div
              className={cn(
                "flex flex-1 min-h-0 min-w-0",
                resolvedContentDirection === "row" ? "flex-row" : "flex-col",
                getJustifyClass(resolvedContentJustify),
                getAlignClass(resolvedContentAlign),
                resolvedContentWrap ? "flex-wrap" : "",
                contentClassName
              )}
              style={{
                gap: toCssSpace(resolvedContentGap),
                ...contentStyle
              }}
            >
              {looseChildren}
            </div>
          ) : null}
        </div>

        {right.map((item, index) => renderDockItem(item, index, "right"))}
      </div>

      {bottom.map((item, index) => renderDockItem(item, index, "bottom"))}
    </div>
  );
}
