import type { ThemeVars } from "./ThemeConfig";

/**
 * Generate component-level tokens from base palette tokens.
 * This creates semantic aliases like --sg-btn-primary-bg, --sg-input-border, etc.
 * so components can use consistent tokens without choosing specific stops (600/700) manually.
 */
export function generateComponentTokens(baseVars: ThemeVars): ThemeVars {
  const componentVars: ThemeVars = {};

  // Helper to wrap RGB values
  const rgb = (varName: string) => {
    const value = baseVars[varName];
    return value ? `rgb(${value})` : "";
  };

  // Button tokens
  // Primary button
  componentVars["--sg-btn-primary-bg"] = rgb("--sg-primary-600");
  componentVars["--sg-btn-primary-fg"] = rgb("--sg-on-primary");
  componentVars["--sg-btn-primary-border"] = rgb("--sg-primary-600");
  componentVars["--sg-btn-primary-hover-bg"] = rgb("--sg-primary-700");
  componentVars["--sg-btn-primary-active-bg"] = rgb("--sg-primary-800");
  componentVars["--sg-btn-primary-ring"] = rgb("--sg-primary-400");

  // Secondary button
  componentVars["--sg-btn-secondary-bg"] = rgb("--sg-secondary-600");
  componentVars["--sg-btn-secondary-fg"] = rgb("--sg-on-secondary");
  componentVars["--sg-btn-secondary-border"] = rgb("--sg-secondary-600");
  componentVars["--sg-btn-secondary-hover-bg"] = rgb("--sg-secondary-700");
  componentVars["--sg-btn-secondary-active-bg"] = rgb("--sg-secondary-800");
  componentVars["--sg-btn-secondary-ring"] = rgb("--sg-secondary-400");

  // Success button
  componentVars["--sg-btn-success-bg"] = rgb("--sg-success-600");
  componentVars["--sg-btn-success-fg"] = rgb("--sg-on-success");
  componentVars["--sg-btn-success-border"] = rgb("--sg-success-600");
  componentVars["--sg-btn-success-hover-bg"] = rgb("--sg-success-700");
  componentVars["--sg-btn-success-active-bg"] = rgb("--sg-success-800");
  componentVars["--sg-btn-success-ring"] = rgb("--sg-success-400");

  // Info button
  componentVars["--sg-btn-info-bg"] = rgb("--sg-info-600");
  componentVars["--sg-btn-info-fg"] = rgb("--sg-on-info");
  componentVars["--sg-btn-info-border"] = rgb("--sg-info-600");
  componentVars["--sg-btn-info-hover-bg"] = rgb("--sg-info-700");
  componentVars["--sg-btn-info-active-bg"] = rgb("--sg-info-800");
  componentVars["--sg-btn-info-ring"] = rgb("--sg-info-400");

  // Warning button
  componentVars["--sg-btn-warning-bg"] = rgb("--sg-warning-600");
  componentVars["--sg-btn-warning-fg"] = rgb("--sg-on-warning");
  componentVars["--sg-btn-warning-border"] = rgb("--sg-warning-600");
  componentVars["--sg-btn-warning-hover-bg"] = rgb("--sg-warning-700");
  componentVars["--sg-btn-warning-active-bg"] = rgb("--sg-warning-800");
  componentVars["--sg-btn-warning-ring"] = rgb("--sg-warning-400");

  // Danger/Error button
  componentVars["--sg-btn-danger-bg"] = rgb("--sg-error-600");
  componentVars["--sg-btn-danger-fg"] = rgb("--sg-on-error");
  componentVars["--sg-btn-danger-border"] = rgb("--sg-error-600");
  componentVars["--sg-btn-danger-hover-bg"] = rgb("--sg-error-700");
  componentVars["--sg-btn-danger-active-bg"] = rgb("--sg-error-800");
  componentVars["--sg-btn-danger-ring"] = rgb("--sg-error-400");

  // Help button (uses tertiary color for better visibility)
  componentVars["--sg-btn-help-bg"] = rgb("--sg-tertiary-600");
  componentVars["--sg-btn-help-fg"] = rgb("--sg-on-tertiary");
  componentVars["--sg-btn-help-border"] = rgb("--sg-tertiary-600");
  componentVars["--sg-btn-help-hover-bg"] = rgb("--sg-tertiary-700");
  componentVars["--sg-btn-help-active-bg"] = rgb("--sg-tertiary-800");
  componentVars["--sg-btn-help-ring"] = rgb("--sg-tertiary-400");

  // Plain/Ghost button
  componentVars["--sg-btn-plain-bg"] = "transparent";
  componentVars["--sg-btn-plain-fg"] = rgb("--sg-text");
  componentVars["--sg-btn-plain-border"] = rgb("--sg-border");
  componentVars["--sg-btn-plain-hover-bg"] = rgb("--sg-muted-surface");
  componentVars["--sg-btn-plain-active-bg"] = rgb("--sg-border");
  componentVars["--sg-btn-plain-ring"] = rgb("--sg-ring");

  // Input tokens
  componentVars["--sg-input-bg"] = rgb("--sg-surface");
  componentVars["--sg-input-fg"] = rgb("--sg-text");
  componentVars["--sg-input-border"] = rgb("--sg-border");
  componentVars["--sg-input-border-hover"] = rgb("--sg-primary-400");
  componentVars["--sg-input-border-focus"] = rgb("--sg-primary-600");
  componentVars["--sg-input-ring"] = rgb("--sg-ring");
  componentVars["--sg-input-placeholder"] = rgb("--sg-muted");
  componentVars["--sg-input-disabled-bg"] = rgb("--sg-disabled");
  componentVars["--sg-input-disabled-fg"] = rgb("--sg-on-disabled");

  // Card tokens
  componentVars["--sg-card-bg"] = rgb("--sg-surface");
  componentVars["--sg-card-fg"] = rgb("--sg-text");
  componentVars["--sg-card-border"] = rgb("--sg-border");
  componentVars["--sg-card-header-bg"] = rgb("--sg-muted-surface");

  // Alert/Banner tokens
  componentVars["--sg-alert-info-bg"] = rgb("--sg-info-100");
  componentVars["--sg-alert-info-fg"] = rgb("--sg-info-700");
  componentVars["--sg-alert-info-border"] = rgb("--sg-info-300");

  componentVars["--sg-alert-success-bg"] = rgb("--sg-success-100");
  componentVars["--sg-alert-success-fg"] = rgb("--sg-success-700");
  componentVars["--sg-alert-success-border"] = rgb("--sg-success-300");

  componentVars["--sg-alert-warning-bg"] = rgb("--sg-warning-100");
  componentVars["--sg-alert-warning-fg"] = rgb("--sg-warning-700");
  componentVars["--sg-alert-warning-border"] = rgb("--sg-warning-300");

  componentVars["--sg-alert-error-bg"] = rgb("--sg-error-100");
  componentVars["--sg-alert-error-fg"] = rgb("--sg-error-700");
  componentVars["--sg-alert-error-border"] = rgb("--sg-error-300");

  // Badge tokens
  componentVars["--sg-badge-bg"] = rgb("--sg-badge");
  componentVars["--sg-badge-fg"] = rgb("--sg-on-badge");

  // Tooltip tokens
  componentVars["--sg-tooltip-bg"] = rgb("--sg-tooltip");
  componentVars["--sg-tooltip-fg"] = rgb("--sg-on-tooltip");

  // Modal/Dialog tokens
  componentVars["--sg-modal-bg"] = rgb("--sg-surface");
  componentVars["--sg-modal-fg"] = rgb("--sg-text");
  componentVars["--sg-modal-overlay"] = "rgb(0 0 0)";

  // Dropdown/Menu tokens
  componentVars["--sg-menu-bg"] = rgb("--sg-surface");
  componentVars["--sg-menu-fg"] = rgb("--sg-text");
  componentVars["--sg-menu-border"] = rgb("--sg-border");
  componentVars["--sg-menu-item-hover-bg"] = rgb("--sg-muted-surface");
  componentVars["--sg-menu-item-active-bg"] = rgb("--sg-primary-100");

  // Table tokens
  componentVars["--sg-table-bg"] = rgb("--sg-surface");
  componentVars["--sg-table-fg"] = rgb("--sg-text");
  componentVars["--sg-table-border"] = rgb("--sg-border");
  componentVars["--sg-table-header-bg"] = rgb("--sg-muted-surface");
  componentVars["--sg-table-row-hover-bg"] = rgb("--sg-muted-surface");
  componentVars["--sg-table-row-selected-bg"] = rgb("--sg-primary-100");

  return componentVars;
}

