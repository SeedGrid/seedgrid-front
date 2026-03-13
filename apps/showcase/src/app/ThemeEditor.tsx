"use client";

import React from "react";
import { useSgTheme } from "@seedgrid/fe-theme";
import {
  SgFloatActionButton,
  SgInputText,
  SgDialog,
  SgCard,
  SgButton,
  SgBadge,
  SgToggleSwitch,
} from "@seedgrid/fe-components";
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

const PALETTE_COLORS = ["primary", "secondary", "tertiary", "warning", "error", "info", "success"] as const;
const PALETTE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

const SEMANTIC_TOKENS = [
  "bg", "surface", "muted-surface", "border", "ring",
  "text", "muted", "disabled", "on-disabled",
  "link", "link-hover",
  "badge", "on-badge", "tooltip", "on-tooltip",
  "on-primary", "on-secondary", "on-tertiary",
  "on-warning", "on-error", "on-info", "on-success",
] as const;

type ComponentTokenGroup = { label: string; tokens: string[] };

const COMPONENT_TOKEN_GROUPS: ComponentTokenGroup[] = [
  {
    label: "Button Primary",
    tokens: ["btn-primary-bg", "btn-primary-fg", "btn-primary-border", "btn-primary-hover-bg", "btn-primary-active-bg", "btn-primary-ring"],
  },
  {
    label: "Button Secondary",
    tokens: ["btn-secondary-bg", "btn-secondary-fg", "btn-secondary-hover-bg"],
  },
  {
    label: "Button Success",
    tokens: ["btn-success-bg", "btn-success-fg", "btn-success-hover-bg"],
  },
  {
    label: "Button Danger",
    tokens: ["btn-danger-bg", "btn-danger-fg", "btn-danger-hover-bg"],
  },
  {
    label: "Button Plain",
    tokens: ["btn-plain-bg", "btn-plain-fg", "btn-plain-border", "btn-plain-hover-bg"],
  },
  {
    label: "Input",
    tokens: ["input-bg", "input-fg", "input-border", "input-border-hover", "input-border-focus", "input-ring", "input-placeholder", "input-disabled-bg", "input-disabled-fg"],
  },
  {
    label: "Card",
    tokens: ["card-bg", "card-fg", "card-border", "card-header-bg"],
  },
  {
    label: "Alert",
    tokens: ["alert-info-bg", "alert-info-fg", "alert-info-border", "alert-success-bg", "alert-success-fg", "alert-success-border", "alert-warning-bg", "alert-warning-fg", "alert-warning-border", "alert-error-bg", "alert-error-fg", "alert-error-border"],
  },
  {
    label: "Badge / Tooltip",
    tokens: ["badge-bg", "badge-fg", "tooltip-bg", "tooltip-fg"],
  },
  {
    label: "Modal / Menu / Table",
    tokens: ["modal-bg", "modal-fg", "menu-bg", "menu-fg", "menu-border", "menu-item-hover-bg", "table-bg", "table-header-bg", "table-row-hover-bg", "table-row-selected-bg"],
  },
];

function TokenSwatch({ cssVar, label, raw }: { cssVar: string; label: string; raw?: boolean }) {
  // raw=true means the CSS var holds raw RGB values (e.g. "22 128 61") and needs rgb() wrapping
  // raw=false means the CSS var holds a complete color value (e.g. "rgb(22 128 61)")
  const bg = raw ? `rgb(var(${cssVar}))` : `var(${cssVar})`;
  return (
    <div className="flex items-center gap-1.5" title={cssVar}>
      <div
        className="w-5 h-5 rounded border border-[rgb(var(--sg-border))] shrink-0"
        style={{ backgroundColor: bg }}
      />
      <span className="text-[10px] text-[rgb(var(--sg-muted))] truncate">{label}</span>
    </div>
  );
}

function PaletteRow({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-[rgb(var(--sg-text))] w-16 shrink-0 font-medium capitalize">{color}</span>
      <div className="flex gap-0.5 flex-1">
        {PALETTE_STOPS.map((stop) => (
          <div
            key={stop}
            className="flex-1 h-6 rounded-sm border border-black/10"
            style={{ backgroundColor: `rgb(var(--sg-${color}-${stop}))` }}
            title={`--sg-${color}-${stop}`}
          />
        ))}
      </div>
    </div>
  );
}

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

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) cancelEditor();
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

      <SgDialog
        open={isOpen}
        onOpenChange={handleDialogOpenChange}
        title={t(i18n, "showcase.themeEditor.title")}
        size="lg"
        severity="primary"
        footer={
          <>
            <SgButton appearance="ghost" onClick={cancelEditor}>
              {t(i18n, "showcase.themeEditor.cancel")}
            </SgButton>
            <SgButton severity="primary" onClick={applyEditor}>
              {t(i18n, "showcase.themeEditor.apply")}
            </SgButton>
          </>
        }
      >
        <div className="space-y-6">
          {/* Mode toggle */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--sg-text))] mb-2">
              {t(i18n, "showcase.themeEditor.mode")}
            </label>
            <SgToggleSwitch
              id="theme-editor-mode-switch"
              checked={currentMode === "dark"}
              onChange={(checked) => setMode(checked ? "dark" : "light")}
              label={
                currentMode === "light"
                  ? t(i18n, "showcase.themeEditor.modeToDark")
                  : t(i18n, "showcase.themeEditor.modeToLight")
              }
            />
          </div>

          {/* Custom color */}
          <div>
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

          {/* Preset colors */}
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

          {/* Token Preview */}
          <SgCard
            collapsible
            defaultOpen={false}
            title={t(i18n, "showcase.themeEditor.tokenPreview")}
            cardStyle="outlined"
            size="sm"
          >
            <div className="space-y-5">
              {/* A) Color Palette */}
              <div>
                <h4 className="text-xs font-semibold text-[rgb(var(--sg-text))] mb-2 uppercase tracking-wide">
                  {t(i18n, "showcase.themeEditor.palette")}
                </h4>
                <div className="space-y-1">
                  {PALETTE_COLORS.map((color) => (
                    <PaletteRow key={color} color={color} />
                  ))}
                </div>
                <div className="flex justify-between mt-1 px-16">
                  {PALETTE_STOPS.map((stop) => (
                    <span key={stop} className="text-[9px] text-[rgb(var(--sg-muted))]">{stop}</span>
                  ))}
                </div>
              </div>

              {/* B) Semantic Tokens */}
              <div>
                <h4 className="text-xs font-semibold text-[rgb(var(--sg-text))] mb-2 uppercase tracking-wide">
                  {t(i18n, "showcase.themeEditor.semanticTokens")}
                </h4>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
                  {SEMANTIC_TOKENS.map((token) => (
                    <TokenSwatch
                      key={token}
                      cssVar={`--sg-${token}`}
                      label={token}
                      raw
                    />
                  ))}
                </div>
              </div>

              {/* C) Component Tokens */}
              <div>
                <h4 className="text-xs font-semibold text-[rgb(var(--sg-text))] mb-2 uppercase tracking-wide">
                  {t(i18n, "showcase.themeEditor.componentTokens")}
                </h4>
                <div className="space-y-3">
                  {COMPONENT_TOKEN_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-medium text-[rgb(var(--sg-text))] mb-1">{group.label}</p>
                      <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                        {group.tokens.map((token) => (
                          <TokenSwatch
                            key={token}
                            cssVar={`--sg-${token}`}
                            label={token}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* D) Mini Components */}
              <div>
                <h4 className="text-xs font-semibold text-[rgb(var(--sg-text))] mb-2 uppercase tracking-wide">
                  {t(i18n, "showcase.themeEditor.components")}
                </h4>

                {/* Buttons solid */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(["primary", "secondary", "success", "info", "warning", "danger", "help"] as const).map((sev) => (
                    <SgButton key={sev} severity={sev} size="sm">{sev}</SgButton>
                  ))}
                </div>
                {/* Buttons outline */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(["primary", "secondary", "success", "info", "warning", "danger", "help"] as const).map((sev) => (
                    <SgButton key={sev} severity={sev} size="sm" appearance="outline">{sev}</SgButton>
                  ))}
                </div>

                {/* Badges solid */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(["primary", "secondary", "success", "info", "warning", "danger", "neutral"] as const).map((sev) => (
                    <SgBadge key={sev} severity={sev} value={sev} size="sm" />
                  ))}
                </div>
                {/* Badges soft */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(["primary", "secondary", "success", "info", "warning", "danger", "neutral"] as const).map((sev) => (
                    <SgBadge key={sev} severity={sev} badgeStyle="soft" value={sev} size="sm" />
                  ))}
                </div>

                {/* Input example */}
                <div className="max-w-xs">
                  <SgInputText
                    id="theme-preview-input"
                    label="Input Example"
                    placeholder="Placeholder text"
                    clearButton={false}
                  />
                </div>
              </div>
            </div>
          </SgCard>
        </div>
      </SgDialog>
    </>
  );
}
