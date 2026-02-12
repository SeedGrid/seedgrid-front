"use client";

import React from "react";
import { useSgTheme } from "@seedgrid/fe-theme";
import { SgFloatActionButton, SgInputText } from "@seedgrid/fe-components";
import { t, useShowcaseI18n } from "../i18n";

const PRESET_COLORS = [
  { name: "Verde SeedGrid", value: "#16803D" },
  { name: "Azul", value: "#0EA5E9" },
  { name: "Roxo", value: "#7C3AED" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Laranja", value: "#F97316" },
  { name: "Vermelho", value: "#EF4444" },
  { name: "Amarelo", value: "#F59E0B" },
  { name: "Verde", value: "#10B981" },
];

export function ThemeEditor() {
  const i18n = useShowcaseI18n();
  const { setTheme, setMode, currentMode, currentTheme } = useSgTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [customColor, setCustomColor] = React.useState("#16803D");
  const colorInputRef = React.useRef<HTMLInputElement | null>(null);

  // Snapshot to revert on cancel
  const snapshotThemeRef = React.useRef<Record<string, unknown> | null>(null);
  const snapshotModeRef = React.useRef<"light" | "dark">("light");

  const isValidCustom = /^#[0-9a-fA-F]{6}$/.test(customColor);

  const openEditor = () => {
    snapshotThemeRef.current = { ...currentTheme };
    snapshotModeRef.current = currentMode;
    setTheme({ persistMode: false });
    setIsOpen(true);
  };

  const cancelEditor = () => {
    if (snapshotThemeRef.current) {
      setTheme({ ...snapshotThemeRef.current, persistMode: true });
    }
    setMode(snapshotModeRef.current);
    setIsOpen(false);
  };

  const applyEditor = () => {
    setTheme({ persistMode: true });
    setIsOpen(false);
  };

  const handlePresetClick = (color: string) => {
    setCustomColor(color);
    setTheme({ seed: color });
  };

  const handleCustomClick = () => {
    if (isValidCustom) {
      setTheme({ seed: customColor });
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    setTheme({ seed: color });
    colorInputRef.current?.blur();
  };

  const handleTextChange = (fullValue: string) => {
    setCustomColor(fullValue);
    if (/^#[0-9a-fA-F]{6}$/.test(fullValue)) {
      setTheme({ seed: fullValue });
    }
  };

  const toggleMode = () => {
    setMode(currentMode === "light" ? "dark" : "light");
  };

  return (
    <>
      <SgFloatActionButton
        enableDragDrop
        dragId="theme-editor-fab"
        hint={t(i18n, "showcase.themeEditor.hint")}
        onClick={() => (isOpen ? cancelEditor() : openEditor())}
        icon={(
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
            />
          </svg>
        )}
        severity="primary"
        position="right-bottom"
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/50 flex items-start justify-center pt-2 sm:pt-4 px-4"
          onClick={cancelEditor}
        >
          <div
            className="
              bg-[rgb(var(--sg-surface))]
              rounded-[var(--sg-radius)]
              border border-[rgb(var(--sg-border))]
              p-6 max-w-md w-full
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[rgb(var(--sg-text))]">
                {t(i18n, "showcase.themeEditor.title")}
              </h2>
              <button
                onClick={cancelEditor}
                className="
                  text-[rgb(var(--sg-muted))]
                  hover:text-[rgb(var(--sg-text))]
                  transition
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[rgb(var(--sg-text))] mb-2">
                {t(i18n, "showcase.themeEditor.mode")}
              </label>
              <button
                onClick={toggleMode}
                className="
                  w-full px-4 py-3 rounded-[var(--sg-radius)]
                  bg-[rgb(var(--sg-primary-600))]
                  text-[rgb(var(--sg-on-primary))]
                  hover:bg-[rgb(var(--sg-primary-700))]
                  transition font-medium
                  flex items-center justify-center gap-2
                "
              >
                {currentMode === "light"
                  ? t(i18n, "showcase.themeEditor.modeToDark")
                  : t(i18n, "showcase.themeEditor.modeToLight")}
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[rgb(var(--sg-text))] mb-2">
                {t(i18n, "showcase.themeEditor.customColor")}
              </label>
              <div className="flex gap-2 items-start">
                <input
                  type="color"
                  value={isValidCustom ? customColor : "#000000"}
                  onChange={handleColorPickerChange}
                  ref={colorInputRef}
                  className="w-12 h-12 rounded-[var(--sg-radius)] border border-[rgb(var(--sg-border))] cursor-pointer shrink-0"
                />
                <SgInputText
                  id="theme-custom-hex"
                  label={t(i18n, "showcase.themeEditor.customColor")}
                  prefixText="#"
                  maxLength={6}
                  clearButton={false}
                  validateOnBlur={false}
                  inputProps={{ value: customColor.replace("#", "") }}
                  validation={(raw) =>
                    /^[0-9a-fA-F]{6}$/.test(raw)
                      ? null
                      : t(i18n, "showcase.themeEditor.invalidHex")
                  }
                  onChange={handleTextChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[rgb(var(--sg-text))] mb-3">
                {t(i18n, "showcase.themeEditor.presets")}
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={handleCustomClick}
                  className={`
                    h-12 rounded-[var(--sg-radius)]
                    border-2
                    transition-all
                    relative group
                    ${isValidCustom
                      ? "border-[rgb(var(--sg-border))] hover:border-[rgb(var(--sg-primary-600))] hover:scale-105 cursor-pointer"
                      : "border-dashed border-[rgb(var(--sg-border))] cursor-not-allowed opacity-50"
                    }
                  `}
                  style={isValidCustom ? { backgroundColor: customColor } : undefined}
                  disabled={!isValidCustom}
                  title={t(i18n, "showcase.themeEditor.custom")}
                >
                  {!isValidCustom && (
                    <span className="text-xs text-[rgb(var(--sg-muted))]">
                      {t(i18n, "showcase.themeEditor.custom")}
                    </span>
                  )}
                  <span className="
                    absolute -top-8 left-1/2 -translate-x-1/2
                    bg-[rgb(var(--sg-tooltip))]
                    text-[rgb(var(--sg-on-tooltip))]
                    px-2 py-1 rounded text-xs whitespace-nowrap
                    opacity-0 group-hover:opacity-100
                    transition-opacity pointer-events-none
                  ">
                    {t(i18n, "showcase.themeEditor.custom")}
                  </span>
                </button>
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetClick(preset.value)}
                    className="
                      h-12 rounded-[var(--sg-radius)]
                      border-2 border-[rgb(var(--sg-border))]
                      hover:border-[rgb(var(--sg-primary-600))]
                      hover:scale-105
                      transition-all
                      relative group
                    "
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                  >
                    <span className="
                      absolute -top-8 left-1/2 -translate-x-1/2
                      bg-[rgb(var(--sg-tooltip))]
                      text-[rgb(var(--sg-on-tooltip))]
                      px-2 py-1 rounded text-xs whitespace-nowrap
                      opacity-0 group-hover:opacity-100
                      transition-opacity pointer-events-none
                    ">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={applyEditor}
              className="
                w-full mt-6 px-4 py-3 rounded-[var(--sg-radius)]
                bg-[rgb(var(--sg-primary-600))]
                text-[rgb(var(--sg-on-primary))]
                hover:bg-[rgb(var(--sg-primary-700))]
                transition font-medium
              "
            >
              {t(i18n, "showcase.themeEditor.apply")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
