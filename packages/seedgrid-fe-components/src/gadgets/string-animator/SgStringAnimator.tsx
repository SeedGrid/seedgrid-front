"use client";

import * as React from "react";
import { SgFlipDigit } from "../flip-digit";
import { SgRoller3DDigit } from "../roller3d-digit";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// Default charset covers digits, A-Z, a-z and common symbols.
// Must include the default emptyChar (" ") at position 0.
export const SG_STRING_ANIMATOR_DEFAULT_CHARSET: string[] = [
  " ",
  "0","1","2","3","4","5","6","7","8","9",
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
  "a","b","c","d","e","f","g","h","i","j","k","l","m",
  "n","o","p","q","r","s","t","u","v","w","x","y","z",
  ".","!","?","-","+","#","@","$","%","&","/","*","(",")",
];

export type SgStringAnimatorStyle = "roller3d" | "flip";
export type SgStringAnimatorAlign = "left" | "right";

export type SgStringAnimatorRef = {
  /** Inicia a animacao de sourceString ate targetString */
  startAnimation: () => void;
};

export type SgStringAnimatorProps = {
  /** String exibida antes da animacao */
  sourceString: string;
  /** String de destino — o componente anima ate ela */
  targetString: string;
  /**
   * Estilo de animacao por caractere.
   * - "roller3d": tambor vertical (SgRoller3DDigit)
   * - "flip": vira o card (SgFlipDigit)
   * @default "roller3d"
   */
  style?: SgStringAnimatorStyle;
  /**
   * Velocidade de 1 (muito lento) a 100 (muito rapido).
   * Controla o intervalo de tempo entre a troca de cada caractere.
   * @default 50
   */
  velocity?: number;
  /**
   * Caractere utilizado para preencher as posicoes extras quando
   * sourceString e targetString possuem comprimentos diferentes.
   * @default " "
   */
  emptyChar?: string;
  /**
   * Alinhamento das strings:
   * - "left"  — preenche a direita com emptyChar (ideal para texto/nomes)
   * - "right" — preenche a esquerda com emptyChar (ideal para numeros)
   * @default "left"
   */
  alignTo?: SgStringAnimatorAlign;
  /**
   * Se true, inicia a animacao automaticamente quando o componente
   * monta e sempre que targetString mudar.
   * @default false
   */
  autoStart?: boolean;
  /** Tamanho da fonte em pixels — controla a escala de cada digito. @default 32 */
  fontSize?: number;
  /**
   * Conjunto de caracteres validos para o SgRoller3DDigit.
   * Deve conter todos os caracteres que podem aparecer em sourceString,
   * targetString e emptyChar. Ignorado quando style="flip".
   * @default SG_STRING_ANIMATOR_DEFAULT_CHARSET
   */
  charset?: string[];
  /** Classes CSS adicionais no container externo */
  className?: string;
};

/**
 * SgStringAnimator — anima caracter a caracter de uma string para outra.
 *
 * Usa SgRoller3DDigit (estilo tambor) ou SgFlipDigit (estilo flip) por posicao.
 * A animacao e acionada via prop `autoStart` ou pelo metodo imperativo `startAnimation()`.
 *
 * @example
 * // Animacao manual via ref
 * const ref = React.useRef<SgStringAnimatorRef>(null);
 * <SgStringAnimator ref={ref} sourceString="LUCIANO" targetString="MARTA" />
 * <button onClick={() => ref.current?.startAnimation()}>Animar</button>
 *
 * @example
 * // Animacao automatica ao trocar o alvo
 * const [target, setTarget] = React.useState("LUCIANO");
 * <SgStringAnimator sourceString="LUCIANO" targetString={target} autoStart />
 * <button onClick={() => setTarget("MARTA")}>Trocar</button>
 */
export const SgStringAnimator = React.forwardRef<SgStringAnimatorRef, SgStringAnimatorProps>(
  function SgStringAnimator(
    {
      sourceString,
      targetString,
      style = "roller3d",
      velocity = 50,
      emptyChar = " ",
      alignTo = "left",
      autoStart = false,
      fontSize = 32,
      charset = SG_STRING_ANIMATOR_DEFAULT_CHARSET,
      className,
    },
    ref
  ) {
    // Normalize emptyChar to a single character
    const safeEmpty = emptyChar.charAt(0) || " ";

    // Clamp velocity 1-100 and compute step delay:
    // v=1 → ~600ms/char, v=50 → ~320ms/char, v=100 → ~41ms/char
    const clamped = Math.min(100, Math.max(1, velocity));
    const stepDelay = Math.round(600 - (clamped - 1) * 5.65);

    // Max length determines how many digit positions to render
    const maxLen = Math.max(sourceString.length, targetString.length, 1);

    // Pad a string to maxLen using alignTo and safeEmpty
    const pad = React.useCallback(
      (s: string): string =>
        alignTo === "right"
          ? s.padStart(maxLen, safeEmpty)
          : s.padEnd(maxLen, safeEmpty),
      [alignTo, maxLen, safeEmpty]
    );

    const paddedSource = pad(sourceString);
    const paddedTarget = pad(targetString);

    // Visible characters for each position
    const [displayChars, setDisplayChars] = React.useState<string[]>(
      () => Array.from(paddedSource)
    );

    // Ref to cancel any in-progress animation
    const cancelRef = React.useRef<(() => void) | null>(null);

    // Effective charset — always contains safeEmpty
    const effectiveCharset = React.useMemo(
      () => (charset.includes(safeEmpty) ? charset : [safeEmpty, ...charset]),
      [charset, safeEmpty]
    );

    // Core animation: step each character position from current to paddedTarget
    const triggerAnimation = React.useCallback(() => {
      cancelRef.current?.();

      const targetChars = Array.from(paddedTarget);
      let step = 0;
      let cancelled = false;
      cancelRef.current = () => {
        cancelled = true;
      };

      function tick() {
        if (cancelled || step >= targetChars.length) return;

        // Right-aligned strings animate from the rightmost position first (units digit first)
        const i = alignTo === "right" ? targetChars.length - 1 - step : step;
        step++;

        setDisplayChars((prev) => {
          const next = [...prev];
          next[i] = targetChars[i] ?? safeEmpty;
          return next;
        });

        if (step < targetChars.length) {
          const id = window.setTimeout(tick, stepDelay);
          cancelRef.current = () => {
            cancelled = true;
            window.clearTimeout(id);
          };
        }
      }

      tick();
    }, [paddedTarget, stepDelay, alignTo]);

    // Expose startAnimation via ref
    React.useImperativeHandle(ref, () => ({ startAnimation: triggerAnimation }), [
      triggerAnimation,
    ]);

    // Reset displayChars when sourceString (or derived paddedSource) changes
    React.useEffect(() => {
      cancelRef.current?.();
      setDisplayChars(Array.from(paddedSource));
    }, [paddedSource]);

    // Auto-start when targetString changes (or on first mount if autoStart)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {
      if (!autoStart) return;
      triggerAnimation();
    }, [autoStart, paddedTarget]);

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        cancelRef.current?.();
      };
    }, []);

    const gapClass = style === "flip" ? "gap-0.5" : "gap-1";

    return (
      <div className={cn("flex items-center", gapClass, className)}>
        {displayChars.map((ch, i) =>
          style === "flip" ? (
            <SgFlipDigit key={i} value={ch || safeEmpty} fontSize={fontSize} />
          ) : (
            <SgRoller3DDigit
              key={i}
              value={effectiveCharset.includes(ch) ? ch : (effectiveCharset[0] ?? " ")}
              items={effectiveCharset}
              fontSize={fontSize}
            />
          )
        )}
      </div>
    );
  }
);

SgStringAnimator.displayName = "SgStringAnimator";
