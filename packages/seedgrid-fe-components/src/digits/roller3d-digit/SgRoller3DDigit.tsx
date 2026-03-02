import * as React from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgRoller3DDigitProps = {
  /** Current value to display â€” must be present in `items` */
  value: string;
  /**
   * Ordered list of all possible values this roller can show.
   * The drum scrolls to the position of `value` in this list.
   * @default ["0","1","2","3","4","5","6","7","8","9"]
   */
  items?: string[];
  /** Font size in pixels â€” controls overall scale */
  fontSize?: number;
  /** Transition duration in milliseconds */
  transitionMs?: number;
  /** Additional CSS classes on the outer wrapper */
  className?: string;
};

const DEFAULT_ITEMS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * SgRoller3DDigit â€” a vertical drum/roller that animates between values.
 *
 * Renders a scrolling strip of items and smoothly transitions to the
 * position of `value` in the `items` list using a CSS transform.
 * Works with digits, letters, padded numbers or any custom strings.
 *
 * @example
 * // Digit roller (default 0â€“9)
 * <SgRoller3DDigit value="7" fontSize={32} />
 *
 * @example
 * // Padded time roller (e.g. minutes 00â€“59)
 * const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
 * <SgRoller3DDigit value="42" items={MINUTES} fontSize={22} />
 *
 * @example
 * // Letter roller (Aâ€“Z) â€” animate names character by character
 * const ALPHA = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
 * <SgRoller3DDigit value="M" items={ALPHA} fontSize={32} />
 */
export function SgRoller3DDigit({
  value,
  items = DEFAULT_ITEMS,
  fontSize = 32,
  transitionMs = 500,
  className,
}: SgRoller3DDigitProps) {
  const idx = Math.max(0, items.indexOf(value));

  // Dimensions are derived from fontSize so the component scales uniformly.
  // The ratios match the original SgClock roller3d proportions exactly when
  // charCount=2 and fontSize = sizePx * 1.35.
  const charCount = Math.max(...items.map((s) => s.length), 1);
  const itemH = Math.round(fontSize * 1.2);
  const w = Math.round(fontSize * (0.7 * charCount + 0.7));
  const h = Math.round(fontSize * 2.7);
  const translateY = -idx * itemH + h / 2 - itemH / 2;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white dark:bg-neutral-800",
        "ring-1 ring-black/5 dark:ring-white/10",
        "shadow-[inset_0_0_28px_rgba(0,0,0,0.08),0_8px_28px_rgba(0,0,0,0.12)]",
        // top fade
        "before:absolute before:inset-0 before:z-10 before:bg-gradient-to-b before:from-black/[0.06] before:to-transparent before:content-['']",
        // bottom fade
        "after:absolute after:inset-0 after:z-10 after:bg-gradient-to-t after:from-black/[0.12] after:to-transparent after:content-['']",
        className
      )}
      style={{ width: w, height: h }}
    >
      {/* Center selector indicator */}
      <div className="absolute left-0 right-0 top-1/2 z-20 h-px bg-red-500/70" />

      {/* Scrolling drum */}
      <div
        className="absolute left-0 top-0 w-full transition-transform [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]"
        style={{ transform: `translateY(${translateY}px)`, transitionDuration: `${transitionMs}ms` }}
      >
        {items.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="flex select-none items-center justify-center font-medium tabular-nums"
            style={{
              height: itemH,
              fontSize,
              lineHeight: 1,
              color: i === idx ? "rgb(30 30 34)" : "rgb(163 163 170)",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}


