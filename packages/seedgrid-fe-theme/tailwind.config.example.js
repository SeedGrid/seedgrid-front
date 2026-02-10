/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sg: {
          // Neutrals (single tokens)
          bg: "rgb(var(--sg-bg) / <alpha-value>)",
          surface: "rgb(var(--sg-surface) / <alpha-value>)",
          "muted-surface": "rgb(var(--sg-muted-surface) / <alpha-value>)",
          border: "rgb(var(--sg-border) / <alpha-value>)",
          ring: "rgb(var(--sg-ring) / <alpha-value>)",
          text: "rgb(var(--sg-text) / <alpha-value>)",
          muted: "rgb(var(--sg-muted) / <alpha-value>)",
          disabled: "rgb(var(--sg-disabled) / <alpha-value>)",
          "on-disabled": "rgb(var(--sg-on-disabled) / <alpha-value>)",
          link: "rgb(var(--sg-link) / <alpha-value>)",
          "link-hover": "rgb(var(--sg-link-hover) / <alpha-value>)",
          badge: "rgb(var(--sg-badge) / <alpha-value>)",
          "on-badge": "rgb(var(--sg-on-badge) / <alpha-value>)",
          tooltip: "rgb(var(--sg-tooltip) / <alpha-value>)",
          "on-tooltip": "rgb(var(--sg-on-tooltip) / <alpha-value>)",
          
          // On colors
          "on-primary": "rgb(var(--sg-on-primary) / <alpha-value>)",
          "on-secondary": "rgb(var(--sg-on-secondary) / <alpha-value>)",
          "on-tertiary": "rgb(var(--sg-on-tertiary) / <alpha-value>)",
          "on-warning": "rgb(var(--sg-on-warning) / <alpha-value>)",
          "on-error": "rgb(var(--sg-on-error) / <alpha-value>)",
          "on-info": "rgb(var(--sg-on-info) / <alpha-value>)",
          "on-success": "rgb(var(--sg-on-success) / <alpha-value>)",
          
          // Palettes
          primary: palette("primary"),
          secondary: palette("secondary"),
          tertiary: palette("tertiary"),
          warning: palette("warning"),
          error: palette("error"),
          info: palette("info"),
          success: palette("success"),
        },
      },
      borderRadius: {
        sg: "var(--sg-radius)",
      },
    },
  },
  plugins: [],
};

function palette(name) {
  return {
    50: `rgb(var(--sg-${name}-50) / <alpha-value>)`,
    100: `rgb(var(--sg-${name}-100) / <alpha-value>)`,
    200: `rgb(var(--sg-${name}-200) / <alpha-value>)`,
    300: `rgb(var(--sg-${name}-300) / <alpha-value>)`,
    400: `rgb(var(--sg-${name}-400) / <alpha-value>)`,
    500: `rgb(var(--sg-${name}-500) / <alpha-value>)`,
    600: `rgb(var(--sg-${name}-600) / <alpha-value>)`,
    700: `rgb(var(--sg-${name}-700) / <alpha-value>)`,
    800: `rgb(var(--sg-${name}-800) / <alpha-value>)`,
    900: `rgb(var(--sg-${name}-900) / <alpha-value>)`,
  };
}

