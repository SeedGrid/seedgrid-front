import test from "node:test";
import assert from "node:assert/strict";

const math = await import(new URL("../dist/gadgets/gauge/math.js", import.meta.url));

const {
  normalizeGaugeRange,
  valueToGaugeRatio,
  ratioToGaugeValue,
  angleToRadialGaugeValue,
  pointToLinearGaugeValue,
  clientPointToLocalGaugePoint,
  clientPointToRadialGaugeValue,
  clientPointToLinearGaugeValue
} = math;

test("normalizeGaugeRange repairs invalid max values", () => {
  assert.deepEqual(normalizeGaugeRange(10, 5), { min: 10, max: 110, span: 100 });
});

test("ratio/value conversion respects axis inversion", () => {
  assert.equal(valueToGaugeRatio(25, 0, 100, false), 0.25);
  assert.equal(valueToGaugeRatio(25, 0, 100, true), 0.75);
  assert.equal(ratioToGaugeValue(0.25, 0, 100, false), 25);
  assert.equal(ratioToGaugeValue(0.25, 0, 100, true), 75);
});

test("angleToRadialGaugeValue maps sweep distance to values", () => {
  assert.equal(
    Math.round(angleToRadialGaugeValue({ rawAngle: 225, startAngle: 135, sweep: 270, min: 0, max: 100, isAxisInversed: false })),
    33
  );
  assert.equal(
    Math.round(angleToRadialGaugeValue({ rawAngle: 225, startAngle: 135, sweep: 270, min: 0, max: 100, isAxisInversed: true })),
    67
  );
});

test("pointToLinearGaugeValue maps points for both orientations", () => {
  assert.equal(
    pointToLinearGaugeValue({
      x: 60, y: 0, axisStart: { x: 10, y: 100 }, axisEnd: { x: 110, y: 100 }, orientation: "horizontal", min: 0, max: 100, isAxisInversed: false
    }),
    50
  );
  assert.equal(
    pointToLinearGaugeValue({
      x: 0, y: 60, axisStart: { x: 100, y: 10 }, axisEnd: { x: 100, y: 110 }, orientation: "vertical", min: 0, max: 100, isAxisInversed: false
    }),
    50
  );
});


test("clientPointToLocalGaugePoint converts pointer coordinates into local SVG coordinates", () => {
  assert.deepEqual(
    clientPointToLocalGaugePoint({
      clientX: 60,
      clientY: 110,
      rect: { left: 10, top: 10, width: 100, height: 200 },
      totalWidth: 200,
      totalHeight: 400
    }),
    { x: 100, y: 200 }
  );
});

test("clientPointToRadialGaugeValue resolves drag values from client coordinates", () => {
  assert.equal(
    Math.round(clientPointToRadialGaugeValue({
      clientX: 150,
      clientY: 100,
      rect: { left: 0, top: 0, width: 200, height: 200 },
      totalWidth: 200,
      totalHeight: 200,
      cx: 100,
      cy: 100,
      startAngle: 0,
      sweep: 180,
      min: 0,
      max: 100,
      isAxisInversed: false
    }) ?? -1),
    0
  );
});

test("clientPointToLinearGaugeValue resolves drag values from client coordinates", () => {
  assert.equal(
    clientPointToLinearGaugeValue({
      clientX: 60,
      clientY: 0,
      rect: { left: 10, top: 0, width: 100, height: 100 },
      totalWidth: 120,
      totalHeight: 100,
      axisStart: { x: 20, y: 50 },
      axisEnd: { x: 100, y: 50 },
      orientation: "horizontal",
      min: 0,
      max: 100,
      isAxisInversed: false
    }),
    50
  );
});
