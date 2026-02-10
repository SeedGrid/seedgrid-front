"use client";

import React from "react";
import { useSgTheme } from "../src/theme/ThemeProvider";

/**
 * Componente de demonstração do SeedThemeProvider
 * Mostra todas as cores e tokens disponíveis
 */
export function ThemeDemo() {
  const { setMode, currentMode, setTheme } = useSgTheme();

  const seedColors = [
    { name: "Verde SeedGrid", value: "#16803D" },
    { name: "Azul", value: "#0EA5E9" },
    { name: "Roxo", value: "#7C3AED" },
    { name: "Rosa", value: "#EC4899" },
    { name: "Laranja", value: "#F97316" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[rgb(var(--sg-text))]">
          SeedGrid Theme Demo
        </h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => setMode(currentMode === "light" ? "dark" : "light")}
            className="
              px-4 py-2 rounded-[var(--sg-radius)]
              bg-[rgb(var(--sg-primary-600))]
              text-[rgb(var(--sg-on-primary))]
              hover:bg-[rgb(var(--sg-primary-700))]
              transition
            "
          >
            {currentMode === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>

      {/* Seed Color Selector */}
      <div className="
        p-6 rounded-[var(--sg-radius)]
        bg-[rgb(var(--sg-surface))]
        border border-[rgb(var(--sg-border))]
      ">
        <h2 className="text-xl font-semibold text-[rgb(var(--sg-text))] mb-4">
          Escolha uma Seed Color
        </h2>
        <div className="flex gap-3 flex-wrap">
          {seedColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setTheme({ seed: color.value })}
              className="
                px-4 py-2 rounded-[var(--sg-radius)]
                border-2 border-[rgb(var(--sg-border))]
                hover:border-[rgb(var(--sg-primary-600))]
                transition
              "
              style={{ backgroundColor: color.value, color: "white" }}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color Palettes */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-[rgb(var(--sg-text))]">
          Paletas de Cores
        </h2>
        
        {["primary", "secondary", "tertiary", "warning", "error", "info", "success"].map((palette) => (
          <div key={palette}>
            <h3 className="text-lg font-medium text-[rgb(var(--sg-text))] mb-2 capitalize">
              {palette}
            </h3>
            <div className="flex gap-1">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((stop) => (
                <div
                  key={stop}
                  className="flex-1 h-16 rounded flex items-end justify-center pb-1 text-xs font-mono"
                  style={{
                    backgroundColor: `rgb(var(--sg-${palette}-${stop}))`,
                    color: stop >= 500 ? "white" : "black",
                  }}
                >
                  {stop}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Component Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-[rgb(var(--sg-text))]">
          Componentes
        </h2>

        {/* Buttons */}
        <div className="
          p-6 rounded-[var(--sg-radius)]
          bg-[rgb(var(--sg-surface))]
          border border-[rgb(var(--sg-border))]
        ">
          <h3 className="text-lg font-medium text-[rgb(var(--sg-text))] mb-4">Botões</h3>
          <div className="flex gap-3 flex-wrap">
            {["primary", "secondary", "success", "info", "warning", "error"].map((variant) => (
              <button
                key={variant}
                className={`
                  px-4 py-2 rounded-[var(--sg-radius)]
                  bg-[rgb(var(--sg-${variant}-600))]
                  text-[rgb(var(--sg-on-${variant}))]
                  hover:bg-[rgb(var(--sg-${variant}-700))]
                  border border-[rgb(var(--sg-border))]
                  transition capitalize
                `}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-[rgb(var(--sg-text))]">Alertas</h3>
          
          {["info", "success", "warning", "error"].map((type) => (
            <div
              key={type}
              className={`
                p-4 rounded-[var(--sg-radius)]
                bg-[rgb(var(--sg-${type}-100))]
                text-[rgb(var(--sg-${type}-700))]
                border border-[rgb(var(--sg-${type}-300))]
              `}
            >
              <strong className="capitalize">{type}:</strong> Este é um alerta de {type}.
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

