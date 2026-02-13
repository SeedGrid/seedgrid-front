import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgFlipDigitProps = {
  /** The character to display (single char) */
  value: string;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Font size in pixels */
  fontSize?: number;
  /** Additional CSS classes */
  className?: string;
};

/**
 * SgFlipDigit - Animated flip card for single character display
 *
 * @example
 * ```tsx
 * const [digit, setDigit] = useState("0");
 * <SgFlipDigit value={digit} />
 * ```
 */
export function SgFlipDigit({
  value,
  width = 80,
  height = 120,
  fontSize = 70,
  className
}: SgFlipDigitProps) {
  const prevRef = React.useRef(value);
  const [prev, setPrev] = React.useState(value);
  const [flip, setFlip] = React.useState(false);
  const [animKey, setAnimKey] = React.useState(0);

  React.useEffect(() => {
    if (value === prevRef.current) return;
    setPrev(prevRef.current);
    setFlip(false);
    const raf = window.requestAnimationFrame(() => {
      setAnimKey((v) => v + 1);
      setFlip(true);
    });
    const id = window.setTimeout(() => {
      setFlip(false);
      prevRef.current = value;
    }, 1200);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(id);
    };
  }, [value]);

  const panel =
    "relative overflow-hidden rounded-lg bg-neutral-900 text-white shadow-[0_10px_24px_rgba(0,0,0,0.4)]";
  const seam = "absolute left-0 right-0 top-1/2 z-10 h-[3px] bg-gradient-to-b from-black/70 to-transparent shadow-[0_3px_8px_rgba(0,0,0,0.7),0_-2px_6px_rgba(255,255,255,0.25)]";
  const half = "absolute left-0 w-full overflow-hidden";
  const glossTop = "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:content-['']";
  const glossBottom = "after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/30 after:to-transparent after:content-['']";

  // Calculate positioning to ensure perfect centering
  const digitContainerStyle = {
    fontSize,
    width: "100%",
    height: height,
    lineHeight: `${height}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  return (
    <>
      <style>{`
        .sg-flip-top {
          background: #1a1a1a;
          border-radius: 8px 8px 0 0;
          animation: sgFlipTopAnim 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) both;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          will-change: transform;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2);
        }
        .sg-flip-bottom {
          background: #1a1a1a;
          border-radius: 0 0 8px 8px;
          animation: sgFlipBottomAnim 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) both;
          animation-delay: 0.6s;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          will-change: transform;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.2);
        }
        @keyframes sgFlipTopAnim {
          0% {
            transform: rotateX(0deg);
            z-index: 30;
          }
          100% {
            transform: rotateX(-180deg);
            z-index: 5;
          }
        }
        @keyframes sgFlipBottomAnim {
          0% {
            transform: rotateX(180deg);
            z-index: 5;
          }
          100% {
            transform: rotateX(0deg);
            z-index: 30;
          }
        }
      `}</style>

      <div
        className={cn(panel, glossTop, glossBottom, className)}
        style={{ width, height, transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        <div className={seam} />

        {/* Static top half - shows upper portion of NEW digit (destination) */}
        <div className={cn(half, "top-0")} style={{ height: height / 2 }}>
          <div
            className="absolute font-bold font-mono"
            style={{
              ...digitContainerStyle,
              top: 0,
              left: 0
            }}
          >
            {value}
          </div>
        </div>

        {/* Static bottom half - shows lower portion of NEW digit (destination) */}
        <div className={cn(half, "bottom-0")} style={{ height: height / 2 }}>
          <div
            className="absolute font-bold font-mono"
            style={{
              ...digitContainerStyle,
              top: -(height / 2),
              left: 0
            }}
          >
            {value}
          </div>
        </div>

        {flip ? (
          <>
            {/* Animated top half - flips away to reveal new digit underneath */}
            <div className="absolute left-0 top-0 z-20 w-full overflow-hidden rounded-t-lg" style={{ height: height / 2 }}>
              <div
                key={`top-${animKey}`}
                className="sg-flip-top"
                style={{
                  transformOrigin: "center bottom",
                  height: "100%",
                  width: "100%"
                }}
              >
                <div
                  className="absolute font-bold font-mono"
                  style={{
                    ...digitContainerStyle,
                    top: 0,
                    left: 0
                  }}
                >
                  {prev}
                </div>
              </div>
            </div>

            {/* Animated bottom half - flips into place showing new digit */}
            <div className="absolute bottom-0 left-0 z-20 w-full overflow-hidden rounded-b-lg" style={{ height: height / 2 }}>
              <div
                key={`bottom-${animKey}`}
                className="sg-flip-bottom"
                style={{
                  transformOrigin: "center top",
                  height: "100%",
                  width: "100%"
                }}
              >
                <div
                  className="absolute font-bold font-mono"
                  style={{
                    ...digitContainerStyle,
                    top: -(height / 2),
                    left: 0
                  }}
                >
                  {value}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
