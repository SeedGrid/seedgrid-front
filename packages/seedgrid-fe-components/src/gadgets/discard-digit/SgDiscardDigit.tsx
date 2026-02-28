import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type DiscardMotion = {
  tx: number;
  ty: number;
  rotateZ: number;
  rotateX: number;
  scale: number;
};

export type SgDiscardDigitProps = {
  /** Texto/valor exibido na folha do topo. */
  value: string;
  /** Cor do texto principal. */
  color?: string;
  /** Fonte (font-family) usada no texto. */
  font?: string;
  /** Cor de fundo das folhas. */
  backgroundColor?: string;
  /** Tamanho da fonte em px (escala geral do bloco). */
  fontSize?: number;
  /** Peso da fonte. */
  fontWeight?: number | string;
  /** Ativa animacao de descarte quando o valor muda. */
  animateOnChange?: boolean;
  /** Duracao total da animacao em ms. */
  transitionMs?: number;
  /** Quantidade de folhas visiveis na pilha (min 2, max 6). */
  stackDepth?: number;
  /** Classes CSS adicionais. */
  className?: string;
  /** Estilo inline adicional. */
  style?: React.CSSProperties;
};

function createRandomMotion(fontSize: number): DiscardMotion {
  const side = Math.random() < 0.5 ? -1 : 1;
  const base = Math.max(26, Math.round(fontSize * 0.55));
  return {
    tx: side * (base + Math.round(Math.random() * base * 0.55)),
    ty: Math.max(56, Math.round(fontSize * 1.45 + Math.random() * fontSize * 0.55)),
    rotateZ: side * (8 + Math.round(Math.random() * 12)),
    rotateX: -(10 + Math.round(Math.random() * 16)),
    scale: 0.68 + Math.random() * 0.14
  };
}

export function SgDiscardDigit({
  value,
  color = "#0f172a",
  font,
  backgroundColor = "#f8fafc",
  fontSize = 64,
  fontWeight = 700,
  animateOnChange = true,
  transitionMs = 640,
  stackDepth = 4,
  className,
  style
}: Readonly<SgDiscardDigitProps>) {
  const depth = Math.max(2, Math.min(6, stackDepth));
  const cardWidth = Math.max(74, Math.round(fontSize * 1.14));
  const cardHeight = Math.max(96, Math.round(fontSize * 1.52));
  const radius = Math.max(8, Math.round(fontSize * 0.15));
  const textSize = Math.max(18, Math.round(fontSize * 0.86));

  const [displayValue, setDisplayValue] = React.useState(value);
  const [targetValue, setTargetValue] = React.useState(value);
  const [discarding, setDiscarding] = React.useState(false);
  const [motion, setMotion] = React.useState<DiscardMotion>(() => createRandomMotion(fontSize));
  const latestValueRef = React.useRef(value);

  React.useEffect(() => {
    latestValueRef.current = value;
    setTargetValue(value);
  }, [value]);

  React.useEffect(() => {
    if (!animateOnChange) {
      setDiscarding(false);
      setDisplayValue(value);
      setTargetValue(value);
      return;
    }
    if (discarding) return;
    if (latestValueRef.current === displayValue) return;

    setMotion(createRandomMotion(fontSize));
    setDiscarding(true);
  }, [animateOnChange, discarding, displayValue, fontSize, value]);

  React.useEffect(() => {
    if (!discarding) return;
    const timer = window.setTimeout(() => {
      const next = latestValueRef.current;
      setDisplayValue(next);
      setTargetValue(next);
      setDiscarding(false);
    }, Math.max(120, transitionMs));
    return () => window.clearTimeout(timer);
  }, [discarding, transitionMs]);

  const shownBackValue = discarding ? targetValue : displayValue;
  const shadowTone = "rgba(2, 8, 23, 0.25)";
  const subtleTone = "rgba(2, 8, 23, 0.12)";

  return (
    <div
      role="img"
      aria-label={value}
      className={cn("inline-flex", className)}
      style={{
        position: "relative",
        width: cardWidth + 40,
        height: cardHeight + 48,
        perspective: "1000px",
        justifyContent: "center",
        alignItems: "center",
        ...style
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: Math.round(cardWidth * 0.92),
          height: Math.max(18, Math.round(cardHeight * 0.18)),
          left: "50%",
          top: cardHeight + 24,
          transform: "translateX(-50%)",
          filter: "blur(9px)",
          background: "radial-gradient(ellipse at center, rgba(2, 8, 23, 0.35) 0%, rgba(2, 8, 23, 0.06) 70%, transparent 100%)"
        }}
      />

      {Array.from({ length: Math.max(0, depth - 2) }).map((_, index) => {
        const layer = index + 1;
        const offsetY = layer * 4;
        const offsetX = layer * 2;
        return (
          <div
            key={`stack-${layer}`}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: cardWidth,
              height: cardHeight,
              borderRadius: radius,
              backgroundColor,
              transform: `translate3d(${offsetX}px, ${offsetY}px, ${-layer * 3}px)`,
              boxShadow: `0 ${8 + layer * 3}px ${14 + layer * 4}px ${subtleTone}, inset 0 1px 0 rgba(255, 255, 255, 0.7)`,
              opacity: 0.9 - layer * 0.07,
              zIndex: 2 + layer
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          width: cardWidth,
          height: cardHeight,
          borderRadius: radius,
          backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: discarding ? "translate3d(0, 0px, 0) scale(1)" : "translate3d(0, 3px, 0) scale(0.995)",
          opacity: discarding ? 1 : 0.97,
          boxShadow: `0 12px 20px ${subtleTone}, inset 0 1px 0 rgba(255, 255, 255, 0.75)`,
          transition: `opacity ${Math.round(transitionMs * 0.52)}ms ease, transform ${Math.round(transitionMs * 0.52)}ms ease`,
          zIndex: 20,
          overflow: "hidden"
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 28%, rgba(255,255,255,0) 55%), linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.09) 100%)",
            pointerEvents: "none"
          }}
        />
        <span
          style={{
            position: "relative",
            zIndex: 1,
            color,
            fontFamily: font,
            fontSize: textSize,
            fontWeight,
            lineHeight: 1,
            userSelect: "none",
            textShadow: `0 1px 0 rgba(255,255,255,0.45), 0 10px 16px rgba(2,8,23,0.1)`
          }}
        >
          {shownBackValue}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          width: cardWidth,
          height: cardHeight,
          borderRadius: radius,
          backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: discarding
            ? `translate3d(${motion.tx}px, ${motion.ty}px, 74px) rotateX(${motion.rotateX}deg) rotateZ(${motion.rotateZ}deg) scale(${motion.scale})`
            : "translate3d(0, 0, 80px) rotateX(0deg) rotateZ(0deg) scale(1)",
          transformOrigin: "50% 20%",
          opacity: discarding ? 0 : 1,
          boxShadow: discarding
            ? `0 7px 15px ${shadowTone}, 0 22px 26px rgba(2, 8, 23, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.72)`
            : `0 16px 22px ${shadowTone}, 0 30px 30px rgba(2, 8, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
          transition: `transform ${transitionMs}ms cubic-bezier(0.2, 0.82, 0.2, 1), opacity ${transitionMs}ms ease, box-shadow ${Math.round(transitionMs * 0.65)}ms ease`,
          zIndex: 40,
          overflow: "hidden"
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.16) 30%, rgba(255,255,255,0) 58%), linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.12) 100%)",
            pointerEvents: "none"
          }}
        />
        <span
          style={{
            position: "relative",
            zIndex: 1,
            color,
            fontFamily: font,
            fontSize: textSize,
            fontWeight,
            lineHeight: 1,
            userSelect: "none",
            textShadow: `0 1px 0 rgba(255,255,255,0.45), 0 12px 18px rgba(2,8,23,0.13)`
          }}
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
}
