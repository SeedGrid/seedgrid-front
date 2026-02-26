"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toNumber(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

export type SgLinearGaugeRange = {
  start: number;
  end: number;
  color?: string;
  thickness?: number;
  opacity?: number;
  label?: React.ReactNode;
};

export type SgLinearGaugePointerShape =
  | "triangle"
  | "inverted-triangle"
  | "circle"
  | "diamond"
  | "rect";

export type SgLinearGaugePointer = {
  id?: string;
  value: number;
  color?: string;
  size?: number;
  shape?: SgLinearGaugePointerShape;
  draggable?: boolean;
  onValueChange?: (value: number) => void;
  label?: React.ReactNode;
};

export type SgLinearGaugeProps = {
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;

  pointers?: SgLinearGaugePointer[];
  onPointerValueChange?: (pointerId: string, value: number, pointer: SgLinearGaugePointer) => void;

  ranges?: SgLinearGaugeRange[];

  orientation?: "horizontal" | "vertical";
  isAxisInversed?: boolean;

  showPrimaryPointer?: boolean;
  primaryPointerShape?: SgLinearGaugePointerShape;
  primaryPointerColor?: string;
  primaryPointerSize?: number;
  primaryPointerDraggable?: boolean;

  barPointer?: boolean;
  barColor?: string;
  barThickness?: number;

  showTicks?: boolean;
  showLabels?: boolean;
  majorTickCount?: number;
  minorTicksPerInterval?: number;
  labelFormatter?: (value: number) => React.ReactNode;

  axisColor?: string;
  axisThickness?: number;
  width?: number;
  height?: number;
  animate?: boolean;
  animationDuration?: number;

  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

type PointerMeta = {
  id: string;
  pointer: SgLinearGaugePointer;
  value: number;
  isPrimary: boolean;
};

const MAIN_POINTER_ID = "__sg-linear-main-pointer__";

export function SgLinearGauge(props: Readonly<SgLinearGaugeProps>) {
  const {
    min = 0,
    max = 100,
    value,
    defaultValue = min,
    onValueChange,
    pointers = [],
    onPointerValueChange,
    ranges = [],
    orientation = "horizontal",
    isAxisInversed = false,
    showPrimaryPointer = true,
    primaryPointerShape = "triangle",
    primaryPointerColor = "hsl(var(--primary))",
    primaryPointerSize = 11,
    primaryPointerDraggable = false,
    barPointer = true,
    barColor = "hsl(var(--primary))",
    barThickness = 8,
    showTicks = true,
    showLabels = true,
    majorTickCount = 5,
    minorTicksPerInterval = 1,
    labelFormatter,
    axisColor = "hsl(var(--border))",
    axisThickness = 10,
    width = orientation === "horizontal" ? 360 : 140,
    height = orientation === "horizontal" ? 120 : 360,
    animate = true,
    animationDuration = 350,
    className,
    style,
    ariaLabel = "Linear gauge"
  } = props;

  const safeMin = toNumber(min, 0);
  const safeMax = toNumber(max, 100);
  const hasRange = safeMax > safeMin;
  const span = hasRange ? safeMax - safeMin : 1;

  const [innerValue, setInnerValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValueRaw = isControlled ? (value as number) : innerValue;
  const currentValue = clamp(currentValueRaw, safeMin, safeMax);

  const setMainValue = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, safeMin, safeMax);
      if (!isControlled) setInnerValue(clamped);
      onValueChange?.(clamped);
    },
    [isControlled, onValueChange, safeMax, safeMin]
  );

  React.useEffect(() => {
    if (isControlled) return;
    setInnerValue((prev) => clamp(prev, safeMin, safeMax));
  }, [isControlled, safeMin, safeMax]);

  const pointerIds = React.useMemo(
    () =>
      pointers.map((pointer, index) => pointer.id ?? `sg-linear-pointer-${index}`),
    [pointers]
  );

  const [dragPointerValues, setDragPointerValues] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    setDragPointerValues((prev) => {
      const next = { ...prev };
      let changed = false;
      for (let i = 0; i < pointers.length; i += 1) {
        const pointer = pointers[i];
        if (!pointer) continue;
        const pointerId = pointerIds[i] ?? `sg-linear-pointer-${i}`;
        const clamped = clamp(pointer.value, safeMin, safeMax);
        if (next[pointerId] !== clamped) {
          next[pointerId] = clamped;
          changed = true;
        }
      }
      for (const key of Object.keys(next)) {
        if (!pointerIds.includes(key)) {
          delete next[key];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [pointerIds, pointers, safeMax, safeMin]);

  const majorCount = Math.max(1, Math.floor(majorTickCount));
  const minorCount = Math.max(0, Math.floor(minorTicksPerInterval));
  const totalWidth = Math.max(120, Math.floor(width));
  const totalHeight = Math.max(90, Math.floor(height));

  const labelSpace = showLabels ? 20 : 8;
  const tickSpace = showTicks ? 14 : 6;

  const axisStart =
    orientation === "horizontal"
      ? { x: 16, y: totalHeight - labelSpace - tickSpace - 4 }
      : { x: totalWidth - labelSpace - tickSpace - 4, y: totalHeight - 16 };
  const axisEnd =
    orientation === "horizontal"
      ? { x: totalWidth - 16, y: totalHeight - labelSpace - tickSpace - 4 }
      : { x: totalWidth - labelSpace - tickSpace - 4, y: 16 };

  const valueToRatio = React.useCallback(
    (raw: number) => {
      const normalized = clamp((raw - safeMin) / span, 0, 1);
      return isAxisInversed ? 1 - normalized : normalized;
    },
    [isAxisInversed, safeMin, span]
  );

  const ratioToValue = React.useCallback(
    (ratioRaw: number) => {
      const ratio = clamp(ratioRaw, 0, 1);
      const normalized = isAxisInversed ? 1 - ratio : ratio;
      return safeMin + normalized * span;
    },
    [isAxisInversed, safeMin, span]
  );

  const valueToPoint = React.useCallback(
    (raw: number) => {
      const ratio = valueToRatio(raw);
      const x = axisStart.x + ratio * (axisEnd.x - axisStart.x);
      const y = axisStart.y + ratio * (axisEnd.y - axisStart.y);
      return { x, y };
    },
    [axisEnd.x, axisEnd.y, axisStart.x, axisStart.y, valueToRatio]
  );

  const pointToValue = React.useCallback(
    (x: number, y: number) => {
      if (orientation === "horizontal") {
        const ratio = (x - axisStart.x) / (axisEnd.x - axisStart.x || 1);
        return ratioToValue(ratio);
      }
      const ratio = (y - axisStart.y) / (axisEnd.y - axisStart.y || 1);
      return ratioToValue(ratio);
    },
    [axisEnd.x, axisEnd.y, axisStart.x, axisStart.y, orientation, ratioToValue]
  );

  const pointerList = React.useMemo<PointerMeta[]>(() => {
    const list: PointerMeta[] = [];
    if (showPrimaryPointer) {
      list.push({
        id: MAIN_POINTER_ID,
        isPrimary: true,
        pointer: {
          id: MAIN_POINTER_ID,
          value: currentValue,
          color: primaryPointerColor,
          shape: primaryPointerShape,
          size: primaryPointerSize,
          draggable: primaryPointerDraggable
        },
        value: currentValue
      });
    }

    for (let i = 0; i < pointers.length; i += 1) {
      const pointer = pointers[i];
      if (!pointer) continue;
      const pointerId = pointerIds[i] ?? `sg-linear-pointer-${i}`;
      const dragValue = dragPointerValues[pointerId];
      list.push({
        id: pointerId,
        isPrimary: false,
        pointer,
        value: clamp(dragValue ?? pointer.value, safeMin, safeMax)
      });
    }
    return list;
  }, [
    currentValue,
    dragPointerValues,
    pointerIds,
    pointers,
    primaryPointerColor,
    primaryPointerDraggable,
    primaryPointerShape,
    primaryPointerSize,
    safeMax,
    safeMin,
    showPrimaryPointer
  ]);

  const pointerMap = React.useMemo(() => {
    const map = new Map<string, PointerMeta>();
    for (const item of pointerList) map.set(item.id, item);
    return map;
  }, [pointerList]);

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [draggingPointerId, setDraggingPointerId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!draggingPointerId) return;
    const onMove = (event: PointerEvent) => {
      const svg = svgRef.current;
      const pointerMeta = pointerMap.get(draggingPointerId);
      if (!svg || !pointerMeta) return;
      const rect = svg.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const localX = ((event.clientX - rect.left) / rect.width) * totalWidth;
      const localY = ((event.clientY - rect.top) / rect.height) * totalHeight;
      const next = clamp(pointToValue(localX, localY), safeMin, safeMax);

      if (pointerMeta.isPrimary) {
        setMainValue(next);
      } else {
        setDragPointerValues((prev) => ({
          ...prev,
          [pointerMeta.id]: next
        }));
        pointerMeta.pointer.onValueChange?.(next);
        onPointerValueChange?.(pointerMeta.id, next, pointerMeta.pointer);
      }
    };

    const onEnd = () => {
      setDraggingPointerId(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    };
  }, [
    draggingPointerId,
    onPointerValueChange,
    pointToValue,
    pointerMap,
    safeMax,
    safeMin,
    setMainValue,
    totalHeight,
    totalWidth
  ]);

  const majorValues = React.useMemo(() => {
    const values: number[] = [];
    for (let i = 0; i <= majorCount; i += 1) {
      values.push(safeMin + (span * i) / majorCount);
    }
    return values;
  }, [majorCount, safeMin, span]);

  const animatedStyle: React.CSSProperties = animate
    ? { transition: `all ${animationDuration}ms ease-out` }
    : {};

  const primaryBarEnd = valueToPoint(currentValue);
  const primaryBarStart = valueToPoint(safeMin);

  return (
    <div
      className={cn("inline-flex select-none", className)}
      role="meter"
      aria-label={ariaLabel}
      aria-valuemin={safeMin}
      aria-valuemax={safeMax}
      aria-valuenow={currentValue}
      style={style}
    >
      <svg
        ref={svgRef}
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="overflow-visible"
      >
        <line
          x1={axisStart.x}
          y1={axisStart.y}
          x2={axisEnd.x}
          y2={axisEnd.y}
          stroke={axisColor}
          strokeLinecap="round"
          strokeWidth={axisThickness}
        />

        {ranges.map((range, index) => {
          const start = clamp(Math.min(range.start, range.end), safeMin, safeMax);
          const end = clamp(Math.max(range.start, range.end), safeMin, safeMax);
          const p1 = valueToPoint(start);
          const p2 = valueToPoint(end);
          return (
            <line
              key={`range-${index}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={range.color ?? "hsl(var(--primary))"}
              strokeLinecap="round"
              strokeWidth={range.thickness ?? axisThickness + 2}
              strokeOpacity={range.opacity ?? 0.55}
            />
          );
        })}

        {barPointer ? (
          <line
            x1={primaryBarStart.x}
            y1={primaryBarStart.y}
            x2={primaryBarEnd.x}
            y2={primaryBarEnd.y}
            stroke={barColor}
            strokeLinecap="round"
            strokeWidth={barThickness}
            style={animatedStyle}
          />
        ) : null}

        {showTicks
          ? majorValues.map((majorValue, index) => {
              const point = valueToPoint(majorValue);
              const nextValue =
                index < majorValues.length - 1
                  ? majorValues[index + 1] ?? majorValue
                  : majorValue;
              const segment = nextValue - majorValue;

              return (
                <g key={`major-${index}`}>
                  {orientation === "horizontal" ? (
                    <line
                      x1={point.x}
                      y1={axisStart.y + axisThickness / 2}
                      x2={point.x}
                      y2={axisStart.y + axisThickness / 2 + 10}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={1.4}
                    />
                  ) : (
                    <line
                      x1={axisStart.x - axisThickness / 2}
                      y1={point.y}
                      x2={axisStart.x - axisThickness / 2 - 10}
                      y2={point.y}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={1.4}
                    />
                  )}

                  {index < majorValues.length - 1 && minorCount > 0
                    ? Array.from({ length: minorCount }).map((_, minorIndex) => {
                        const t = (minorIndex + 1) / (minorCount + 1);
                        const minorValue = majorValue + segment * t;
                        const minorPoint = valueToPoint(minorValue);
                        return orientation === "horizontal" ? (
                          <line
                            key={`minor-${index}-${minorIndex}`}
                            x1={minorPoint.x}
                            y1={axisStart.y + axisThickness / 2}
                            x2={minorPoint.x}
                            y2={axisStart.y + axisThickness / 2 + 6}
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth={1}
                            strokeOpacity={0.75}
                          />
                        ) : (
                          <line
                            key={`minor-${index}-${minorIndex}`}
                            x1={axisStart.x - axisThickness / 2}
                            y1={minorPoint.y}
                            x2={axisStart.x - axisThickness / 2 - 6}
                            y2={minorPoint.y}
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth={1}
                            strokeOpacity={0.75}
                          />
                        );
                      })
                    : null}
                </g>
              );
            })
          : null}

        {showLabels
          ? majorValues.map((majorValue, index) => {
              const point = valueToPoint(majorValue);
              return orientation === "horizontal" ? (
                <text
                  key={`label-${index}`}
                  x={point.x}
                  y={axisStart.y + axisThickness / 2 + 23}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  {labelFormatter ? labelFormatter(majorValue) : Math.round(majorValue)}
                </text>
              ) : (
                <text
                  key={`label-${index}`}
                  x={axisStart.x - axisThickness / 2 - 14}
                  y={point.y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground text-[11px]"
                >
                  {labelFormatter ? labelFormatter(majorValue) : Math.round(majorValue)}
                </text>
              );
            })
          : null}

        {pointerList.map((entry, index) => {
          const pointer = entry.pointer;
          const point = valueToPoint(entry.value);
          const color =
            pointer.color ??
            (entry.isPrimary ? primaryPointerColor : "hsl(var(--secondary))");
          const size = pointer.size ?? (entry.isPrimary ? primaryPointerSize : 9);
          const shape = pointer.shape ?? "circle";
          const draggable = !!pointer.draggable;
          const pointerStyle = animatedStyle;

          const handlePointerDown = (event: React.PointerEvent<SVGGElement>) => {
            if (!draggable) return;
            event.preventDefault();
            setDraggingPointerId(entry.id);
          };

          const label =
            pointer.label !== undefined
              ? pointer.label
              : entry.isPrimary
              ? Math.round(entry.value)
              : null;

          return (
            <g
              key={entry.id}
              style={pointerStyle}
              className={draggable ? "cursor-pointer" : ""}
              onPointerDown={handlePointerDown}
            >
              {shape === "circle" ? (
                <circle cx={point.x} cy={point.y} r={size / 2} fill={color} />
              ) : shape === "diamond" ? (
                <polygon
                  points={`${point.x},${point.y - size / 2} ${point.x + size / 2},${point.y} ${point.x},${point.y + size / 2} ${point.x - size / 2},${point.y}`}
                  fill={color}
                />
              ) : shape === "rect" ? (
                <rect
                  x={point.x - size / 2}
                  y={point.y - size / 2}
                  width={size}
                  height={size}
                  rx={2}
                  fill={color}
                />
              ) : shape === "inverted-triangle" ? (
                orientation === "horizontal" ? (
                  <polygon
                    points={`${point.x - size / 2},${point.y - size / 2} ${point.x + size / 2},${point.y - size / 2} ${point.x},${point.y + size / 2}`}
                    fill={color}
                  />
                ) : (
                  <polygon
                    points={`${point.x - size / 2},${point.y - size / 2} ${point.x - size / 2},${point.y + size / 2} ${point.x + size / 2},${point.y}`}
                    fill={color}
                  />
                )
              ) : orientation === "horizontal" ? (
                <polygon
                  points={`${point.x - size / 2},${point.y + size / 2} ${point.x + size / 2},${point.y + size / 2} ${point.x},${point.y - size / 2}`}
                  fill={color}
                />
              ) : (
                <polygon
                  points={`${point.x + size / 2},${point.y - size / 2} ${point.x + size / 2},${point.y + size / 2} ${point.x - size / 2},${point.y}`}
                  fill={color}
                />
              )}

              {label !== null ? (
                orientation === "horizontal" ? (
                  <text
                    x={point.x}
                    y={point.y - size - 6 - index * 13}
                    textAnchor="middle"
                    className="fill-foreground text-[11px]"
                  >
                    {label}
                  </text>
                ) : (
                  <text
                    x={point.x + size + 8}
                    y={point.y + 3}
                    textAnchor="start"
                    className="fill-foreground text-[11px]"
                  >
                    {label}
                  </text>
                )
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

SgLinearGauge.displayName = "SgLinearGauge";
