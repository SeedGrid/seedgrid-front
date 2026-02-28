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

type ActiveDiscard = {
  id: number;
  value: string;
  motion: DiscardMotion;
  started: boolean;
};

type ActiveIncoming = {
  id: number;
  value: string;
  motion: DiscardMotion;
  started: boolean;
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
  /** Quantidade de folhas visiveis na pilha (min 2, max 30). Ignorado se totalNumberPages for definido. */
  stackDepth?: number;
  /** Total de paginas do monte. Quando definido, a pilha visual encolhe a cada increasePage(). */
  totalNumberPages?: number;
  /** Estrategia de animacao para mudancas por prop `value`. */
  changeAnimationMode?: "discard" | "incoming";
  /** Classes CSS adicionais. */
  className?: string;
  /** Estilo inline adicional. */
  style?: React.CSSProperties;
};

export type SgDiscardDigitHandle = {
  /** Decrementa a pagina atual (minimo 1). */
  decreasePage(): void;
  /** Incrementa a pagina atual (maximo totalNumberPages). */
  increasePage(): void;
  /** Retorna a pagina atual (1-indexed). */
  page(): number;
};

function createRandomMotion(fontSize: number): DiscardMotion {
  const side = Math.random() < 0.5 ? -1 : 1;
  const base = Math.max(26, Math.round(fontSize * 0.55));
  return {
    tx: side * (base + Math.round(Math.random() * base * 0.55)),
    ty: Math.max(56, Math.round(fontSize * 1.45 + Math.random() * fontSize * 0.55)),
    rotateZ: side * (8 + Math.round(Math.random() * 12)),
    rotateX: -(10 + Math.round(Math.random() * 16)),
    scale: 0.68 + Math.random() * 0.14,
  };
}

/** px that each sheet peeks below the one above — visible "spine" line */
const PER_LAYER_Y = 3;
/** horizontal drift per layer — subtle perspective illusion */
const PER_LAYER_X = 0;

export const SgDiscardDigit = React.forwardRef<SgDiscardDigitHandle, SgDiscardDigitProps>(
function SgDiscardDigit({
  value,
  color = "#0f172a",
  font,
  backgroundColor = "#f8fafc",
  fontSize = 64,
  fontWeight = 700,
  animateOnChange = true,
  transitionMs = 640,
  stackDepth = 20,
  totalNumberPages,
  changeAnimationMode = "discard",
  className,
  style,
}: Readonly<SgDiscardDigitProps>, ref) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const directionRef = React.useRef<"next" | "prev">("next");

  React.useImperativeHandle(ref, () => ({
    decreasePage() {
      directionRef.current = "prev";
      setCurrentPage((p) => Math.max(1, p - 1));
    },
    increasePage() {
      directionRef.current = "next";
      setCurrentPage((p) => (totalNumberPages != null ? Math.min(totalNumberPages, p + 1) : p + 1));
    },
    page() {
      return currentPage;
    },
  }), [currentPage, totalNumberPages]);

  const depth = totalNumberPages != null
    ? Math.max(1, Math.min(30, totalNumberPages - currentPage + 1))
    : Math.max(2, Math.min(30, stackDepth));

  // ── Dimensions ─────────────────────────────────────────────────────────────
  const cardW = Math.max(74, Math.round(fontSize * 1.14));
  const cardH = Math.max(96, Math.round(fontSize * 1.52));
  const radius = Math.max(8, Math.round(fontSize * 0.15));
  const textSize = Math.max(18, Math.round(fontSize * 0.86));

  // depth-1 backing layers so total visible sheets = depth
  const numStack = depth - 1;
  const PAD = 10;
  const containerW = cardW + PAD * 2 + Math.ceil(numStack * PER_LAYER_X);
  const containerH = cardH + numStack * PER_LAYER_Y + PAD * 2;
  // Left edge where cards start (horizontally centered)
  const cardLeft = Math.floor((containerW - cardW) / 2);

  // ── Paper aesthetics ────────────────────────────────────────────────────────
  const paperEdgeSoft = "rgba(15, 23, 42, 0.16)";
  const paperEdgeMid = "rgba(15, 23, 42, 0.26)";
  const paperTexture =
    "repeating-linear-gradient(0deg, rgba(15,23,42,0.025) 0px, rgba(15,23,42,0.025) 1px, transparent 1px, transparent 4px)";

  // ── State ───────────────────────────────────────────────────────────────────
  const [displayValue, setDisplayValue] = React.useState(value);
  const [activeDiscard, setActiveDiscard] = React.useState<ActiveDiscard | null>(null);
  const [activeIncoming, setActiveIncoming] = React.useState<ActiveIncoming | null>(null);
  const discardIdRef = React.useRef(0);
  const latestValueRef = React.useRef(value);

  React.useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  React.useEffect(() => {
    if (!animateOnChange) {
      setActiveDiscard(null);
      setActiveIncoming(null);
      setDisplayValue(value);
      return;
    }
    if (value === displayValue && activeDiscard === null && activeIncoming === null) return;

    const shouldUseIncoming =
      directionRef.current === "prev" || changeAnimationMode === "incoming";

    if (shouldUseIncoming) {
      // Incoming: nova folha sobe por baixo revelando o valor anterior
      if (activeIncoming === null && value !== displayValue) {
        const nextId = ++discardIdRef.current;
        setActiveIncoming({
          id: nextId,
          value,
          motion: createRandomMotion(fontSize),
          started: false,
        });
        // displayValue permanece no valor antigo; atualiza só ao fim da animacao
      }
    } else {
      // Discard: folha atual voa para fora, revelando o novo valor
      if (activeIncoming === null) {
        if (activeDiscard === null) {
          const nextId = ++discardIdRef.current;
          setActiveDiscard({
            id: nextId,
            value: displayValue,
            motion: createRandomMotion(fontSize),
            started: false,
          });
        }
        setDisplayValue(value);
      }
    }
    directionRef.current = "next";
  }, [activeDiscard, activeIncoming, animateOnChange, changeAnimationMode, displayValue, fontSize, value]);

  // ── RAF: discard ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!activeDiscard || activeDiscard.started) return;
    let raf = 0;
    raf = window.requestAnimationFrame(() => {
      setActiveDiscard((prev) =>
        prev && prev.id === activeDiscard.id ? { ...prev, started: true } : prev,
      );
    });
    return () => window.cancelAnimationFrame(raf);
  }, [activeDiscard]);

  // ── RAF: incoming ────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!activeIncoming || activeIncoming.started) return;
    let raf = 0;
    raf = window.requestAnimationFrame(() => {
      setActiveIncoming((prev) =>
        prev && prev.id === activeIncoming.id ? { ...prev, started: true } : prev,
      );
    });
    return () => window.cancelAnimationFrame(raf);
  }, [activeIncoming]);

  // ── Cleanup: discard ─────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!activeDiscard || !activeDiscard.started) return;
    const currentId = activeDiscard.id;
    const timer = window.setTimeout(() => {
      setActiveDiscard((prev) => (prev && prev.id === currentId ? null : prev));
      const latest = latestValueRef.current;
      setDisplayValue((prev) => (prev === latest ? prev : latest));
    }, Math.max(120, transitionMs));
    return () => window.clearTimeout(timer);
  }, [activeDiscard, transitionMs]);

  // ── Cleanup: incoming ────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!activeIncoming || !activeIncoming.started) return;
    const currentId = activeIncoming.id;
    const timer = window.setTimeout(() => {
      setActiveIncoming((prev) => (prev && prev.id === currentId ? null : prev));
      setDisplayValue(latestValueRef.current);
    }, Math.max(120, transitionMs));
    return () => window.clearTimeout(timer);
  }, [activeIncoming, transitionMs]);

  // ── Stack layers ────────────────────────────────────────────────────────────
  // i=0 → BOTTOM of stack (most displaced, lowest z-index = 1)
  // i=numStack-1 → just below main card (least displaced, highest z-index = numStack)
  // Each layer shows exactly PER_LAYER_Y px of its bottom edge.
  const stackLayers = React.useMemo(() => {
    return Array.from({ length: numStack }, (_, i) => {
      const distFromTop = numStack - i; // 1 = closest to main, numStack = bottom
      return {
        top: PAD + distFromTop * PER_LAYER_Y,
        left: cardLeft + distFromTop * PER_LAYER_X,
        // Subtle darkening toward the bottom of the stack
        opacity: Math.max(0.80, 1 - (distFromTop - 1) * 0.007),
        zIndex: i + 1, // bottom=1 (behind), top-of-stack=numStack (in front)
      };
    });
  }, [numStack, cardLeft]);

  const shadowTone = "rgba(2, 8, 23, 0.28)";
  const subtleTone = "rgba(2, 8, 23, 0.12)";

  return (
    <div
      role="img"
      aria-label={value}
      className={cn("inline-block", className)}
      style={{
        position: "relative",
        width: containerW,
        height: containerH,
        perspective: "1000px",
        ...style,
      }}
    >
      {/* Ground shadow — sits below the full stack */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: Math.round(cardW * 0.88),
          height: Math.max(14, Math.round(cardH * 0.12)),
          left: "50%",
          top: PAD + cardH + numStack * PER_LAYER_Y + 2,
          transform: "translateX(-50%)",
          filter: "blur(8px)",
          background:
            "radial-gradient(ellipse at center, rgba(2,8,23,0.30) 0%, rgba(2,8,23,0.05) 70%, transparent 100%)",
        }}
      />

      {/* ── Backing sheets ─────────────────────────────────────────────────── */}
      {stackLayers.map((layer, i) => (
        <div
          key={`sheet-${i}`}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: layer.top,
            left: layer.left,
            width: cardW,
            height: cardH,
            borderRadius: radius,
            backgroundColor,
            // Visible top + side borders; bottom border slightly stronger so each
            // 3-px strip is legible as a distinct sheet edge.
            border: `1px solid ${paperEdgeSoft}`,
            borderBottom: `1px solid ${paperEdgeMid}`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.70), inset 0 -1px 0 rgba(15,23,42,0.06)`,
            opacity: layer.opacity,
            zIndex: layer.zIndex,
          }}
        />
      ))}

      {/* ── Main (top) card ────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: PAD,
          left: cardLeft,
          width: cardW,
          height: cardH,
          borderRadius: radius,
          backgroundColor,
          border: `1px solid ${paperEdgeSoft}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 16px ${subtleTone}, 0 0 0 1px rgba(255,255,255,0.22), inset 0 1px 0 rgba(255,255,255,0.80), inset 0 -1px 0 rgba(15,23,42,0.07)`,
          transition: `opacity ${Math.round(transitionMs * 0.52)}ms ease`,
          zIndex: numStack + 1,
          overflow: "hidden",
        }}
      >
        {/* Paper gloss + texture */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 28%, rgba(255,255,255,0) 55%), linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.09) 100%), ${paperTexture}`,
            pointerEvents: "none",
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
            textShadow: `0 1px 0 rgba(255,255,255,0.45), 0 10px 16px rgba(2,8,23,0.10)`,
          }}
        >
          {displayValue}
        </span>
      </div>

      {/* ── Incoming card (slides in from below on decreasePage) ──────────── */}
      {activeIncoming ? (
        <div
          style={{
            position: "absolute",
            top: PAD,
            left: cardLeft,
            width: cardW,
            height: cardH,
            borderRadius: radius,
            backgroundColor,
            border: `1px solid ${paperEdgeMid}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: activeIncoming.started
              ? "translate3d(0, 0, 80px) rotateX(0deg) rotateZ(0deg) scale(1)"
              : `translate3d(${activeIncoming.motion.tx}px, ${activeIncoming.motion.ty}px, 74px) rotateX(${activeIncoming.motion.rotateX}deg) rotateZ(${activeIncoming.motion.rotateZ}deg) scale(${activeIncoming.motion.scale})`,
            transformOrigin: "50% 80%",
            opacity: activeIncoming.started ? 1 : 0,
            boxShadow: `0 16px 22px ${shadowTone}, 0 30px 30px rgba(2,8,23,0.18), 0 0 0 1px rgba(255,255,255,0.26), inset 0 1px 0 rgba(255,255,255,0.82), inset 0 -1px 0 rgba(15,23,42,0.10)`,
            transition: `transform ${transitionMs}ms cubic-bezier(0.18, 0.78, 0.18, 1), opacity ${Math.round(transitionMs * 0.6)}ms ease`,
            zIndex: numStack + 20,
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(160deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.16) 30%, rgba(255,255,255,0) 58%), linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.12) 100%), ${paperTexture}`,
              pointerEvents: "none",
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
              textShadow: `0 1px 0 rgba(255,255,255,0.45), 0 12px 18px rgba(2,8,23,0.13)`,
            }}
          >
            {activeIncoming.value}
          </span>
        </div>
      ) : null}

      {/* ── Discarded card (flies off on change) ──────────────────────────── */}
      {activeDiscard ? (
        <div
          style={{
            position: "absolute",
            top: PAD,
            left: cardLeft,
            width: cardW,
            height: cardH,
            borderRadius: radius,
            backgroundColor,
            border: `1px solid ${paperEdgeMid}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: activeDiscard.started
              ? `translate3d(${activeDiscard.motion.tx}px, ${activeDiscard.motion.ty}px, 74px) rotateX(${activeDiscard.motion.rotateX}deg) rotateZ(${activeDiscard.motion.rotateZ}deg) scale(${activeDiscard.motion.scale})`
              : "translate3d(0, 0, 80px) rotateX(0deg) rotateZ(0deg) scale(1)",
            transformOrigin: "50% 20%",
            opacity: activeDiscard.started ? 0 : 1,
            boxShadow: activeDiscard.started
              ? `0 7px 15px ${shadowTone}, 0 22px 26px rgba(2,8,23,0.14), inset 0 1px 0 rgba(255,255,255,0.72)`
              : `0 16px 22px ${shadowTone}, 0 30px 30px rgba(2,8,23,0.18), 0 0 0 1px rgba(255,255,255,0.26), inset 0 1px 0 rgba(255,255,255,0.82), inset 0 -1px 0 rgba(15,23,42,0.10)`,
            transition: `transform ${transitionMs}ms cubic-bezier(0.2, 0.82, 0.2, 1), opacity ${transitionMs}ms ease, box-shadow ${Math.round(transitionMs * 0.65)}ms ease`,
            zIndex: numStack + 20,
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(160deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.16) 30%, rgba(255,255,255,0) 58%), linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.12) 100%), ${paperTexture}`,
              pointerEvents: "none",
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
              textShadow: `0 1px 0 rgba(255,255,255,0.45), 0 12px 18px rgba(2,8,23,0.13)`,
            }}
          >
            {activeDiscard.value}
          </span>
        </div>
      ) : null}
    </div>
  );
});

SgDiscardDigit.displayName = "SgDiscardDigit";
