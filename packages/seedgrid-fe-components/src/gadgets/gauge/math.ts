export type GaugeOrientation = "horizontal" | "vertical";

export function clampGaugeValue(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function normalizeGaugeRange(min: number, max: number) {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 100;
  return {
    min: safeMin,
    max: safeMax,
    span: safeMax - safeMin
  };
}

export function normalizeAngle(angle: number) {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function valueToGaugeRatio(raw: number, min: number, max: number, isAxisInversed: boolean) {
  const { span } = normalizeGaugeRange(min, max);
  const safeValue = clampGaugeValue(raw, min, max);
  const normalized = clampGaugeValue((safeValue - min) / span, 0, 1);
  return isAxisInversed ? 1 - normalized : normalized;
}

export function ratioToGaugeValue(ratioRaw: number, min: number, max: number, isAxisInversed: boolean) {
  const { span } = normalizeGaugeRange(min, max);
  const ratio = clampGaugeValue(ratioRaw, 0, 1);
  const normalized = isAxisInversed ? 1 - ratio : ratio;
  return min + normalized * span;
}

export function angleToRadialGaugeValue(params: {
  rawAngle: number;
  startAngle: number;
  sweep: number;
  min: number;
  max: number;
  isAxisInversed: boolean;
}) {
  const start = normalizeAngle(params.startAngle);
  const target = normalizeAngle(params.rawAngle);
  const distance = (target - start + 360) % 360;
  const ratio = clampGaugeValue(distance / params.sweep, 0, 1);
  return ratioToGaugeValue(ratio, params.min, params.max, params.isAxisInversed);
}

export function pointToLinearGaugeValue(params: {
  x: number;
  y: number;
  axisStart: { x: number; y: number };
  axisEnd: { x: number; y: number };
  orientation: GaugeOrientation;
  min: number;
  max: number;
  isAxisInversed: boolean;
}) {
  const ratio =
    params.orientation === "horizontal"
      ? (params.x - params.axisStart.x) / (params.axisEnd.x - params.axisStart.x || 1)
      : (params.y - params.axisStart.y) / (params.axisEnd.y - params.axisStart.y || 1);

  return ratioToGaugeValue(ratio, params.min, params.max, params.isAxisInversed);
}


export type GaugeClientRectLike = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function clientPointToLocalGaugePoint(params: {
  clientX: number;
  clientY: number;
  rect: GaugeClientRectLike;
  totalWidth: number;
  totalHeight: number;
}) {
  if (params.rect.width <= 0 || params.rect.height <= 0) return null;
  return {
    x: ((params.clientX - params.rect.left) / params.rect.width) * params.totalWidth,
    y: ((params.clientY - params.rect.top) / params.rect.height) * params.totalHeight
  };
}

export function pointToRadialGaugeAngle(params: {
  x: number;
  y: number;
  cx: number;
  cy: number;
}) {
  return normalizeAngle((Math.atan2(params.y - params.cy, params.x - params.cx) * 180) / Math.PI);
}

export function clientPointToRadialGaugeValue(params: {
  clientX: number;
  clientY: number;
  rect: GaugeClientRectLike;
  totalWidth: number;
  totalHeight: number;
  cx: number;
  cy: number;
  startAngle: number;
  sweep: number;
  min: number;
  max: number;
  isAxisInversed: boolean;
}) {
  const local = clientPointToLocalGaugePoint(params);
  if (!local) return null;
  const angle = pointToRadialGaugeAngle({ x: local.x, y: local.y, cx: params.cx, cy: params.cy });
  return clampGaugeValue(
    angleToRadialGaugeValue({
      rawAngle: angle,
      startAngle: params.startAngle,
      sweep: params.sweep,
      min: params.min,
      max: params.max,
      isAxisInversed: params.isAxisInversed
    }),
    params.min,
    params.max
  );
}

export function clientPointToLinearGaugeValue(params: {
  clientX: number;
  clientY: number;
  rect: GaugeClientRectLike;
  totalWidth: number;
  totalHeight: number;
  axisStart: { x: number; y: number };
  axisEnd: { x: number; y: number };
  orientation: GaugeOrientation;
  min: number;
  max: number;
  isAxisInversed: boolean;
}) {
  const local = clientPointToLocalGaugePoint(params);
  if (!local) return null;
  return clampGaugeValue(
    pointToLinearGaugeValue({
      x: local.x,
      y: local.y,
      axisStart: params.axisStart,
      axisEnd: params.axisEnd,
      orientation: params.orientation,
      min: params.min,
      max: params.max,
      isAxisInversed: params.isAxisInversed
    }),
    params.min,
    params.max
  );
}
