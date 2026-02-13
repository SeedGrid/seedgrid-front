"use client";

import React from "react";
import { SgFlipDigit, SgButton } from "@seedgrid/fe-components";

// Componente de debug para mostrar frames individuais
function DebugFlipDigit({
  currentValue,
  prevValue,
  transform,
  width = 120,
  height = 180,
  fontSize = 120
}: {
  currentValue: string;
  prevValue: string;
  transform: { type: 'top' | 'bottom'; rotation: number } | null;
  width?: number;
  height?: number;
  fontSize?: number;
}) {
  const panel =
    "relative overflow-hidden rounded-lg bg-neutral-900 text-white shadow-[0_10px_24px_rgba(0,0,0,0.4)]";
  const seam = "absolute left-0 right-0 top-1/2 z-10 h-[3px] bg-gradient-to-b from-black/70 to-transparent shadow-[0_3px_8px_rgba(0,0,0,0.7),0_-2px_6px_rgba(255,255,255,0.25)]";
  const half = "absolute left-0 w-full overflow-hidden";

  return (
    <div
      className={panel}
      style={{ width, height, transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      <div className={seam} />

      {/* Top half - static */}
      <div className={half + " top-0"} style={{ height: height / 2 }}>
        <div
          className="absolute font-bold font-mono"
          style={{
            fontSize,
            lineHeight: `${height}px`,
            width: "100%",
            height: height,
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {transform ? currentValue : prevValue}
        </div>
      </div>

      {/* Bottom half - static */}
      <div className={half + " bottom-0"} style={{ height: height / 2 }}>
        <div
          className="absolute font-bold font-mono"
          style={{
            fontSize,
            lineHeight: `${height}px`,
            width: "100%",
            height: height,
            top: -(height / 2),
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {transform?.type === 'bottom' ? currentValue : prevValue}
        </div>
      </div>

      {/* Animated layer */}
      {transform && (
        <>
          {transform.type === 'top' && (
            <div className="absolute left-0 top-0 z-20 w-full overflow-hidden rounded-t-lg" style={{ height: height / 2 }}>
              <div
                style={{
                  transformOrigin: "center bottom",
                  transform: `rotateX(${transform.rotation}deg)`,
                  height: "100%",
                  width: "100%",
                  background: "#1a1a1a",
                  borderRadius: "8px 8px 0 0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)",
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d"
                }}
              >
                <div
                  className="absolute font-bold font-mono"
                  style={{
                    fontSize,
                    lineHeight: `${height}px`,
                    width: "100%",
                    height: height,
                    top: 0,
                    left: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {prevValue}
                </div>
              </div>
            </div>
          )}

          {transform.type === 'bottom' && (
            <div className="absolute bottom-0 left-0 z-20 w-full overflow-hidden rounded-b-lg" style={{ height: height / 2 }}>
              <div
                style={{
                  transformOrigin: "center top",
                  transform: `rotateX(${transform.rotation}deg)`,
                  height: "100%",
                  width: "100%",
                  background: "#1a1a1a",
                  borderRadius: "0 0 8px 8px",
                  boxShadow: "0 -2px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.2)",
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d"
                }}
              >
                <div
                  className="absolute font-bold font-mono"
                  style={{
                    fontSize,
                    lineHeight: `${height}px`,
                    width: "100%",
                    height: height,
                    top: -(height / 2),
                    left: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {currentValue}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SgFlipDigitShowcase() {
  const [digit, setDigit] = React.useState("0");
  const [letter, setLetter] = React.useState("A");

  // Debug controls
  const [debugDigit, setDebugDigit] = React.useState("0");
  const [debugPrevDigit, setDebugPrevDigit] = React.useState("0");
  const [animationStep, setAnimationStep] = React.useState(0);
  // Steps: 0=static, 1=top-start, 2=top-25%, 3=top-50%, 4=top-75%, 5=top-end, 6=bottom-start, 7=bottom-50%, 8=bottom-end, 9=complete
  const totalSteps = 9;

  const nextDigit = () => {
    const current = parseInt(digit, 10);
    setDigit(String((current + 1) % 10));
  };

  const prevDigit = () => {
    const current = parseInt(digit, 10);
    setDigit(String((current - 1 + 10) % 10));
  };

  const randomDigit = () => {
    setDigit(String(Math.floor(Math.random() * 10)));
  };

  const nextLetter = () => {
    const current = letter.charCodeAt(0);
    const next = current >= 90 ? 65 : current + 1; // A-Z loop
    setLetter(String.fromCharCode(next));
  };

  // Controle manual de animação frame-by-frame
  const nextStep = () => {
    if (animationStep < totalSteps) {
      setAnimationStep(animationStep + 1);
    }
  };

  const prevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };

  const resetAnimation = () => {
    setAnimationStep(0);
  };

  const startNewFlip = (targetDigit: string) => {
    setDebugPrevDigit(debugDigit);
    setDebugDigit(targetDigit);
    setAnimationStep(0);
  };

  // Calcula as transformações baseado no step atual
  const getTransformForStep = (step: number): { type: "top" | "bottom"; rotation: number } | null => {
    // Step 0: static (sem animação)
    // Steps 1-5: top half flip (0deg -> -180deg)
    // Steps 6-9: bottom half flip (180deg -> 0deg)
    if (step === 0) return null;

    if (step >= 1 && step <= 5) {
      // Top half animation
      const progress = (step - 1) / 4; // 0, 0.25, 0.5, 0.75, 1
      const rotation = progress * -180;
      return { type: 'top' as const, rotation };
    }

    if (step >= 6 && step <= 9) {
      // Bottom half animation
      const progress = (step - 6) / 3; // 0, 0.33, 0.66, 1
      const rotation = 180 - (progress * 180);
      return { type: 'bottom' as const, rotation };
    }

    return null;
  };

  const currentTransform = getTransformForStep(animationStep);

  const getStepDescription = (step: number) => {
    const descriptions = [
      "Estático (inicial)",
      "Top flip: início (0°)",
      "Top flip: 25% (-45°)",
      "Top flip: 50% (-90°)",
      "Top flip: 75% (-135°)",
      "Top flip: fim (-180°)",
      "Bottom flip: início (180°)",
      "Bottom flip: 50% (90°)",
      "Bottom flip: 75% (45°)",
      "Bottom flip: fim (0°) - Completo"
    ];
    return descriptions[step] || "";
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--sg-bg))] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[rgb(var(--sg-text))] mb-2">
            SgFlipDigit
          </h1>
          <p className="text-[rgb(var(--sg-muted))]">
            Componente de flip animado para exibição de dígitos e caracteres únicos
          </p>
        </div>

        {/* Debug Section - Step by Step */}
        <section className="bg-yellow-950/40 border-2 border-yellow-700 rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-yellow-200 mb-2">
              🐛 DEBUG: Animação Frame-by-Frame
            </h2>
            <p className="text-sm text-yellow-100">
              Controle manual de cada frame da animação. Avance ou volte um passo por vez para capturar screenshots.
            </p>
          </div>

          <div className="flex items-start gap-6">
            {/* Debug Digit Display */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-sm text-yellow-100 font-mono space-y-1">
                <div>Anterior: <span className="font-bold text-white">{debugPrevDigit}</span></div>
                <div>Atual: <span className="font-bold text-lg text-white">{debugDigit}</span></div>
                <div className="text-xs text-yellow-200">
                  Step {animationStep} de {totalSteps}
                </div>
              </div>

              <DebugFlipDigit
                currentValue={debugDigit}
                prevValue={debugPrevDigit}
                transform={currentTransform}
                width={120}
                height={180}
                fontSize={120}
              />

              <div className="text-xs text-yellow-100 text-center max-w-[120px]">
                {getStepDescription(animationStep)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 space-y-4">
              {/* Frame controls */}
              <div>
                <p className="text-sm text-yellow-100 mb-2 font-semibold">Controle de Frames:</p>
                <div className="flex gap-2">
                  <SgButton
                    onClick={prevStep}
                    disabled={animationStep === 0}
                    severity="secondary"
                    size="sm"
                  >
                    ◀️ Frame Anterior
                  </SgButton>
                  <SgButton
                    onClick={nextStep}
                    disabled={animationStep >= totalSteps}
                    severity="warning"
                    size="sm"
                  >
                    ▶️ Próximo Frame
                  </SgButton>
                  <SgButton
                    onClick={resetAnimation}
                    severity="info"
                    size="sm"
                  >
                    🔄 Reset
                  </SgButton>
                </div>
              </div>

              {/* Jump to specific number */}
              <div>
                <p className="text-sm text-yellow-100 mb-2 font-semibold">
                  Iniciar nova animação para número:
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <SgButton
                      key={num}
                      onClick={() => startNewFlip(String(num))}
                      disabled={debugDigit === String(num)}
                      severity={debugDigit === String(num) ? "success" : "secondary"}
                      size="sm"
                    >
                      {num}
                    </SgButton>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-4 p-3 bg-yellow-950/70 rounded border border-yellow-600">
                <p className="text-xs text-yellow-50">
                  <strong>Como usar:</strong><br/>
                  1. Escolha um número destino (ex: clicar em "5")<br/>
                  2. Use "Próximo Frame" para avançar passo a passo<br/>
                  3. Cada frame fica PARADO até você clicar<br/>
                  4. Capture screenshot em cada passo<br/>
                  5. Use "Frame Anterior" para voltar se necessário<br/>
                  6. "Reset" volta ao frame 0 (estático)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Teste básico - Dígitos */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--sg-text))]">
            Teste com Dígitos (0-9)
          </h2>
          <div className="flex items-center gap-4">
            <SgFlipDigit value={digit} />
            <div className="flex flex-col gap-2">
              <SgButton onClick={nextDigit} size="sm">
                Próximo (+1)
              </SgButton>
              <SgButton onClick={prevDigit} size="sm" severity="secondary">
                Anterior (-1)
              </SgButton>
              <SgButton onClick={randomDigit} size="sm" severity="info">
                Aleatório
              </SgButton>
            </div>
          </div>
        </section>

        {/* Teste com Letras */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--sg-text))]">
            Teste com Letras (A-Z)
          </h2>
          <div className="flex items-center gap-4">
            <SgFlipDigit value={letter} />
            <div className="flex flex-col gap-2">
              <SgButton onClick={nextLetter} size="sm">
                Próxima Letra
              </SgButton>
            </div>
          </div>
        </section>

        {/* Diferentes tamanhos */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--sg-text))]">
            Diferentes Tamanhos
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-[rgb(var(--sg-muted))] mb-2">Pequeno</p>
              <SgFlipDigit value={digit} width={50} height={75} fontSize={45} />
            </div>
            <div className="text-center">
              <p className="text-xs text-[rgb(var(--sg-muted))] mb-2">Médio (padrão)</p>
              <SgFlipDigit value={digit} />
            </div>
            <div className="text-center">
              <p className="text-xs text-[rgb(var(--sg-muted))] mb-2">Grande</p>
              <SgFlipDigit value={digit} width={120} height={180} fontSize={120} />
            </div>
          </div>
        </section>

        {/* Sequência de dígitos */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[rgb(var(--sg-text))]">
            Sequência (simulando relógio)
          </h2>
          <div className="flex items-center gap-2">
            <SgFlipDigit value={digit} />
            <SgFlipDigit value={String((parseInt(digit) + 1) % 10)} />
            <span className="text-4xl font-bold text-white mx-2">:</span>
            <SgFlipDigit value={String((parseInt(digit) + 2) % 10)} />
            <SgFlipDigit value={String((parseInt(digit) + 3) % 10)} />
          </div>
        </section>

        {/* Info de uso */}
        <section className="bg-[rgb(var(--sg-surface))] border border-[rgb(var(--sg-border))] rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[rgb(var(--sg-text))]">
            Como usar
          </h3>
          <div className="space-y-2 text-sm text-[rgb(var(--sg-muted))]">
            <p><strong>Básico:</strong></p>
            <code className="block bg-[rgb(var(--sg-muted-surface))] p-2 rounded">
              {`<SgFlipDigit value="5" />`}
            </code>

            <p className="mt-4"><strong>Com tamanhos personalizados:</strong></p>
            <code className="block bg-[rgb(var(--sg-muted-surface))] p-2 rounded">
              {`<SgFlipDigit value="5" width={100} height={150} fontSize={90} />`}
            </code>

            <p className="mt-4"><strong>Props:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><code>value</code>: string - O caractere a exibir (obrigatório)</li>
              <li><code>width</code>: number - Largura em pixels (padrão: 80)</li>
              <li><code>height</code>: number - Altura em pixels (padrão: 120)</li>
              <li><code>fontSize</code>: number - Tamanho da fonte em pixels (padrão: 70)</li>
              <li><code>className</code>: string - Classes CSS adicionais</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
