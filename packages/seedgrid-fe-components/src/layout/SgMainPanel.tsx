"use client";

import * as React from "react";
import type { SgPanelAlign, SgPanelPercent, SgPanelProps } from "./SgPanel";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSpace(value?: number | string) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function toCssPercent(value?: SgPanelPercent) {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}%` : value;
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

  const element = node as React.ReactElement<any>;
  const mergedStyle = { ...(element.props.style ?? {}), ...extraStyle };

  return React.cloneElement(element, {
    key: element.key ?? key,
    className: cn(element.props.className, extraClassName),
    style: mergedStyle
  });
}

type DockItem = {
  key: React.Key;
  node: React.ReactNode;
  align: SgPanelAlign;
  width?: SgPanelPercent;
  height?: SgPanelPercent;
};

export type SgMainPanelProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  gap?: number | string;
  padding?: number | string;
  children?: React.ReactNode;
};

export function SgMainPanel(props: Readonly<SgMainPanelProps>) {
  const {
    gap = 0,
    padding,
    className,
    style,
    children,
    ...rest
  } = props;

  const allItems = React.Children.toArray(children).map((node, index) => {
    const key = (React.isValidElement(node) ? node.key : null) ?? `dock-${index}`;
    if (!React.isValidElement<SgPanelProps>(node)) {
      return { key, node, align: "client" as const };
    }

    return {
      key,
      node,
      align: node.props.align ?? "client",
      width: node.props.width,
      height: node.props.height
    };
  });

  const top = allItems.filter((item) => item.align === "top");
  const bottom = allItems.filter((item) => item.align === "bottom");
  const left = allItems.filter((item) => item.align === "left");
  const right = allItems.filter((item) => item.align === "right");
  const client = allItems.filter((item) => item.align === "client");

  const gapCss = toCssSpace(gap);
  const dockGapStyle: React.CSSProperties | undefined =
    gapCss !== undefined ? { gap: gapCss } : undefined;

  return (
    <div
      className={cn("flex h-full w-full min-h-0 min-w-0 flex-col", className)}
      style={{
        ...style,
        padding: toCssSpace(padding),
        ...(dockGapStyle ?? null)
      }}
      {...rest}
    >
      {top.map((item, index) => {
        const heightCss = toCssPercent(item.height);
        return cloneWithLayout(
          item.node,
          item.key ?? `top-${index}`,
          {
            width: "100%",
            ...(heightCss !== undefined
              ? { height: heightCss, flex: `0 0 ${heightCss}` }
              : { flex: "0 0 auto" })
          },
          "w-full"
        );
      })}

      <div className="flex flex-1 min-h-0 min-w-0" style={dockGapStyle}>
        {left.map((item, index) => {
          const widthCss = toCssPercent(item.width);
          return cloneWithLayout(
            item.node,
            item.key ?? `left-${index}`,
            {
              height: "100%",
              ...(widthCss !== undefined
                ? { width: widthCss, flex: `0 0 ${widthCss}` }
                : { flex: "0 0 auto" })
            },
            "h-full min-h-0"
          );
        })}

        <div className="flex flex-1 min-h-0 min-w-0" style={dockGapStyle}>
          {client.map((item, index) => (
            <div key={item.key ?? `client-${index}`} className="flex-1 min-h-0 min-w-0">
              {cloneWithLayout(
                item.node,
                item.key ?? `client-inner-${index}`,
                {
                  width: "100%",
                  height: "100%"
                },
                "h-full w-full"
              )}
            </div>
          ))}
        </div>

        {right.map((item, index) => {
          const widthCss = toCssPercent(item.width);
          return cloneWithLayout(
            item.node,
            item.key ?? `right-${index}`,
            {
              height: "100%",
              ...(widthCss !== undefined
                ? { width: widthCss, flex: `0 0 ${widthCss}` }
                : { flex: "0 0 auto" })
            },
            "h-full min-h-0"
          );
        })}
      </div>

      {bottom.map((item, index) => {
        const heightCss = toCssPercent(item.height);
        return cloneWithLayout(
          item.node,
          item.key ?? `bottom-${index}`,
          {
            width: "100%",
            ...(heightCss !== undefined
              ? { height: heightCss, flex: `0 0 ${heightCss}` }
              : { flex: "0 0 auto" })
          },
          "w-full"
        );
      })}
    </div>
  );
}

SgMainPanel.displayName = "SgMainPanel";
