"use client";

import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(angle: number) {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function toSweep(startAngle: number, endAngle: number) {
  const start = normalizeAngle(startAngle);
  const end = normalizeAngle(endAngle);
  const sweep = end >= start ? end - start : end + 360 - start;
  return sweep === 0 ? 360 : sweep;
}

function polar(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  };
}

function arcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  let sweep = toSweep(startAngle, endAngle);
  if (sweep >= 360) sweep = 359.999;
  const start = polar(cx, cy, radius, startAngle);
  const end = polar(cx, cy, radius, startAngle + sweep);
  const largeArcFlag = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export type SgRadialGaugeRange = {
  start: number;
  end: number;
  color?: string;
  width?: number;
  opacity?: number;
};

export type SgRadialGaugePointerType = "needle" | "marker" | "range";
export type SgRadialGaugeMarkerShape = "circle" | "diamond" | "triangle" | "square";

export type SgRadialGaugePointer = {
  id?: string;
  type?: SgRadialGaugePointerType;
  value: number;
  color?: string;
  width?: number;
  size?: number;
  shape?: SgRadialGaugeMarkerShape;
  draggable?: boolean;
  onValueChange?: (value: number) => void;
  label?: React.ReactNode;
};

export type SgRadialGaugeAnnotation = {
  id?: string;
  value?: number;
  angle?: number;
  radiusFactor?: number;
  content: React.ReactNode;
};

export type SgRadialGaugeProps = {
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;

  pointers?: SgRadialGaugePointer[];
  onPointerValueChange?: (pointerId: string, value: number, pointer: SgRadialGaugePointer) => void;
  ranges?: SgRadialGaugeRange[];
  annotations?: SgRadialGaugeAnnotation[];

  startAngle?: number;
  endAngle?: number;
  isAxisInversed?: boolean;

  showPrimaryPointer?: boolean;
  primaryPointerType?: SgRadialGaugePointerType;
  primaryPointerColor?: string;
  primaryPointerWidth?: number;
  primaryPointerSize?: number;
  primaryPointerShape?: SgRadialGaugeMarkerShape;
  primaryPointerDraggable?: boolean;
  primaryPointerLabel?: React.ReactNode;

  showTicks?: boolean;
  showLabels?: boolean;
  majorTickCount?: number;
  minorTicksPerInterval?: number;
  labelFormatter?: (value: number) => React.ReactNode;

  axisColor?: string;
  ringThickness?: number;
  axisWidth?: number;
  radiusFactor?: number;
  centerContent?: React.ReactNode;

  width?: number;
  height?: number;
  animate?: boolean;
  animationDuration?: number;

  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

const MAIN_POINTER_ID = "__sg-radial-main-pointer__";

type PointerMeta = {
  id: string;
  pointer: SgRadialGaugePointer;
  value: number;
  isPrimary: boolean;
};

export function SgRadialGauge(props: Readonly<SgRadialGaugeProps>) {
  const {
    min = 0,
    max = 100,
    value,
    defaultValue = min,
    onValueChange,
    pointers = [],
    onPointerValueChange,
    ranges = [],
    annotations = [],
    startAngle = 135,
    endAngle = 45,
    isAxisInversed = false,
    showPrimaryPointer = true,
    primaryPointerType = "needle",
    primaryPointerColor = "hsl(var(--primary))",
    primaryPointerWidth = 3,
    primaryPointerSize = 12,
    primaryPointerShape = "circle",
    primaryPointerDraggable = false,
    primaryPointerLabel,
    showTicks = true,
    showLabels = true,
    majorTickCount = 5,
    minorTicksPerInterval = 1,
    labelFormatter,
    axisColor = "hsl(var(--border))",
    ringThickness,
    axisWidth = 14,
    radiusFactor = 0.9,
    centerContent,
    width = 300,
    height = 300,
    animate = true,
    animationDuration = 350,
    className,
    style,
    ariaLabel = "Radial gauge"
  } = props;

  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 100;
  const span = safeMax - safeMin;

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
      pointers.map((pointer, index) => pointer.id ?? `sg-radial-pointer-${index}`),
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
        const pointerId = pointerIds[i] ?? `sg-radial-pointer-${i}`;
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

  const totalWidth = Math.max(160, Math.floor(width));
  const totalHeight = Math.max(160, Math.floor(height));
  const cx = totalWidth / 2;
  const cy = totalHeight / 2;
  const rawAxisWidth = ringThickness ?? axisWidth;
  const safeAxisWidth = Number.isFinite(rawAxisWidth) ? Math.max(1, rawAxisWidth) : 14;
  const safeRadiusFactorRaw = Number.isFinite(radiusFactor) ? radiusFactor : 0.9;
  const safeRadiusFactor = Math.max(0.1, safeRadiusFactorRaw);
  const availableRadius = Math.max(
    8,
    Math.min(totalWidth, totalHeight) / 2 - safeAxisWidth / 2 - 6
  );
  const baseRadius = clamp(availableRadius * safeRadiusFactor, 8, availableRadius);

  const sweep = React.useMemo(() => toSweep(startAngle, endAngle), [endAngle, startAngle]);

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

  const valueToAngle = React.useCallback(
    (raw: number) => {
      const ratio = valueToRatio(raw);
      return startAngle + sweep * ratio;
    },
    [startAngle, sweep, valueToRatio]
  );

  const angleToValue = React.useCallback(
    (rawAngle: number) => {
      const start = normalizeAngle(startAngle);
      const target = normalizeAngle(rawAngle);
      const distance = (target - start + 360) % 360;
      const ratio = clamp(distance / sweep, 0, 1);
      return ratioToValue(ratio);
    },
    [ratioToValue, startAngle, sweep]
  );

  const majorCount = Math.max(1, Math.floor(majorTickCount));
  const minorCount = Math.max(0, Math.floor(minorTicksPerInterval));

  const pointerList = React.useMemo<PointerMeta[]>(() => {
    const list: PointerMeta[] = [];
    if (showPrimaryPointer) {
      list.push({
        id: MAIN_POINTER_ID,
        isPrimary: true,
        value: currentValue,
        pointer: {
          id: MAIN_POINTER_ID,
          type: primaryPointerType,
          value: currentValue,
          color: primaryPointerColor,
          width: primaryPointerWidth,
          size: primaryPointerSize,
          shape: primaryPointerShape,
          draggable: primaryPointerDraggable,
          label: primaryPointerLabel
        }
      });
    }
    for (let i = 0; i < pointers.length; i += 1) {
      const pointer = pointers[i];
      if (!pointer) continue;
      const id = pointerIds[i] ?? `sg-radial-pointer-${i}`;
      const dragValue = dragPointerValues[id];
      list.push({
        id,
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
    primaryPointerLabel,
    primaryPointerShape,
    primaryPointerSize,
    primaryPointerType,
    primaryPointerWidth,
    safeMax,
    safeMin,
    showPrimaryPointer
  ]);

  const pointerMap = React.useMemo(() => {
    const map = new Map<string, PointerMeta>();
    for (const pointer of pointerList) map.set(pointer.id, pointer);
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
      const angle = normalizeAngle((Math.atan2(localY - cy, localX - cx) * 180) / Math.PI);
      const next = clamp(angleToValue(angle), safeMin, safeMax);

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
    angleToValue,
    cx,
    cy,
    draggingPointerId,
    onPointerValueChange,
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

  const centerNode = centerContent ?? (
    <div className="pointer-events-none select-none text-center">
      <div className="text-xs uppercase text-muted-foreground">Value</div>
      <div className="text-xl font-semibold text-foreground">{Math.round(currentValue)}</div>
    </div>
  );

  return (
    <div
      className={cn("relative inline-flex select-none", className)}
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
      >
        <path
          d={arcPath(cx, cy, baseRadius, startAngle, endAngle)}
          fill="none"
          stroke={axisColor}
          strokeWidth={safeAxisWidth}
          strokeLinecap="round"
        />

        {ranges.map((range, index) => {
          const start = clamp(Math.min(range.start, range.end), safeMin, safeMax);
          const end = clamp(Math.max(range.start, range.end), safeMin, safeMax);
          const startA = valueToAngle(start);
          const endA = valueToAngle(end);
          return (
            <path
              key={`range-${index}`}
              d={arcPath(cx, cy, baseRadius, startA, endA)}
              fill="none"
              stroke={range.color ?? "hsl(var(--primary))"}
              strokeWidth={range.width ?? safeAxisWidth + 2}
              strokeOpacity={range.opacity ?? 0.55}
              strokeLinecap="round"
            />
          );
        })}

        {showTicks
          ? majorValues.map((majorValue, index) => {
              const majorAngle = valueToAngle(majorValue);
              const pOuter = polar(cx, cy, baseRadius + safeAxisWidth / 2 + 1, majorAngle);
              const pInner = polar(cx, cy, baseRadius - safeAxisWidth / 2 - 10, majorAngle);

              const nextValue =
                index < majorValues.length - 1
                  ? majorValues[index + 1] ?? majorValue
                  : majorValue;
              const segment = nextValue - majorValue;

              return (
                <g key={`major-${index}`}>
                  <line
                    x1={pOuter.x}
                    y1={pOuter.y}
                    x2={pInner.x}
                    y2={pInner.y}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1.4}
                  />

                  {index < majorValues.length - 1 && minorCount > 0
                    ? Array.from({ length: minorCount }).map((_, minorIndex) => {
                        const t = (minorIndex + 1) / (minorCount + 1);
                        const minorValue = majorValue + segment * t;
                        const minorAngle = valueToAngle(minorValue);
                        const mOuter = polar(cx, cy, baseRadius + safeAxisWidth / 2, minorAngle);
                        const mInner = polar(cx, cy, baseRadius - safeAxisWidth / 2 - 6, minorAngle);
                        return (
                          <line
                            key={`minor-${index}-${minorIndex}`}
                            x1={mOuter.x}
                            y1={mOuter.y}
                            x2={mInner.x}
                            y2={mInner.y}
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth={1}
                            strokeOpacity={0.8}
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
              const angle = valueToAngle(majorValue);
              const point = polar(cx, cy, baseRadius - safeAxisWidth / 2 - 22, angle);
              return (
                <text
                  key={`label-${index}`}
                  x={point.x}
                  y={point.y + 3}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  {labelFormatter ? labelFormatter(majorValue) : Math.round(majorValue)}
                </text>
              );
            })
          : null}

        {pointerList.map((entry) => {
          const pointer = entry.pointer;
          const pointerType = pointer.type ?? "needle";
          const color =
            pointer.color ?? (entry.isPrimary ? primaryPointerColor : "hsl(var(--secondary))");
          const angle = valueToAngle(entry.value);
          const size = pointer.size ?? (pointerType === "needle" ? 10 : 12);
          const widthPx = pointer.width ?? (pointerType === "needle" ? 3 : safeAxisWidth);
          const draggable = !!pointer.draggable;
          const label =
            pointer.label !== undefined
              ? pointer.label
              : entry.isPrimary && pointerType === "needle"
              ? Math.round(entry.value)
              : null;

          const onPointerDown = (event: React.PointerEvent<SVGGElement>) => {
            if (!draggable) return;
            event.preventDefault();
            setDraggingPointerId(entry.id);
          };

          if (pointerType === "range") {
            const endAnglePointer = valueToAngle(entry.value);
            return (
              <g
                key={entry.id}
                style={animatedStyle}
                className={draggable ? "cursor-pointer" : ""}
                onPointerDown={onPointerDown}
              >
                <path
                  d={arcPath(cx, cy, baseRadius, valueToAngle(safeMin), endAnglePointer)}
                  fill="none"
                  stroke={color}
                  strokeWidth={widthPx}
                  strokeLinecap="round"
                />
              </g>
            );
          }

          if (pointerType === "marker") {
            const markerPoint = polar(cx, cy, baseRadius - safeAxisWidth / 2, angle);
            return (
              <g
                key={entry.id}
                style={animatedStyle}
                className={draggable ? "cursor-pointer" : ""}
                onPointerDown={onPointerDown}
              >
                {pointer.shape === "diamond" ? (
                  <polygon
                    points={`${markerPoint.x},${markerPoint.y - size / 2} ${markerPoint.x + size / 2},${markerPoint.y} ${markerPoint.x},${markerPoint.y + size / 2} ${markerPoint.x - size / 2},${markerPoint.y}`}
                    fill={color}
                  />
                ) : pointer.shape === "triangle" ? (
                  <polygon
                    points={`${markerPoint.x - size / 2},${markerPoint.y + size / 2} ${markerPoint.x + size / 2},${markerPoint.y + size / 2} ${markerPoint.x},${markerPoint.y - size / 2}`}
                    fill={color}
                  />
                ) : pointer.shape === "square" ? (
                  <rect
                    x={markerPoint.x - size / 2}
                    y={markerPoint.y - size / 2}
                    width={size}
                    height={size}
                    fill={color}
                  />
                ) : (
                  <circle cx={markerPoint.x} cy={markerPoint.y} r={size / 2} fill={color} />
                )}
              </g>
            );
          }

          const tip = polar(cx, cy, baseRadius - safeAxisWidth / 2 - 4, angle);
          const tail = polar(cx, cy, baseRadius * 0.14, angle + 180);
          return (
            <g
              key={entry.id}
              style={animatedStyle}
              className={draggable ? "cursor-pointer" : ""}
              onPointerDown={onPointerDown}
            >
              <line
                x1={tail.x}
                y1={tail.y}
                x2={tip.x}
                y2={tip.y}
                stroke={color}
                strokeWidth={widthPx}
                strokeLinecap="round"
              />
              <circle cx={cx} cy={cy} r={Math.max(4, size * 0.42)} fill={color} />

              {label !== null ? (
                <text x={tip.x} y={tip.y - 8} textAnchor="middle" className="fill-foreground text-[11px]">
                  {label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      {annotations.map((annotation, index) => {
        const angle =
          annotation.angle !== undefined
            ? annotation.angle
            : annotation.value !== undefined
            ? valueToAngle(annotation.value)
            : valueToAngle(currentValue);
        const radius = baseRadius * (annotation.radiusFactor ?? 0.62);
        const point = polar(cx, cy, radius, angle);
        const left = `${(point.x / totalWidth) * 100}%`;
        const top = `${(point.y / totalHeight) * 100}%`;
        return (
          <div
            key={annotation.id ?? `annotation-${index}`}
            className="pointer-events-none absolute"
            style={{ left, top, transform: "translate(-50%, -50%)" }}
          >
            {annotation.content}
          </div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {centerNode}
      </div>
    </div>
  );
}

SgRadialGauge.displayName = "SgRadialGauge";
