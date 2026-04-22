type SgMetaPropV0 = {
  name: string;
  type: string;
  required?: boolean;
  default?: unknown;
  description?: string;
  semanticRole?:
    | "value"
    | "label"
    | "validation"
    | "behavior"
    | "appearance"
    | "event"
    | "data";
  bindable?: boolean;
};

type SgMetaV0 = {
  version: "0.1";
  componentId: string;
  package: string;
  exportName: string;
  slug: string;
  displayName: string;
  category: string;
  subcategory?: string;
  description: string;
  tags?: string[];
  capabilities?: string[];
  fieldSemantics?: string[];
  props?: SgMetaPropV0[];
  states?: string[];
};

type SgAiHintsV0 = {
  version: "0.1";
  preferredUseCases: string[];
  avoidUseCases?: string[];
  synonyms?: string[];
  relatedEntityFields?: string[];
  compositionHints?: string[];
  rankingSignals?: {
    freeText?: number;
    structuredChoice?: number;
    date?: number;
    number?: number;
    denseLayout?: number;
  };
};

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.use-debounced-value",
  package: "@seedgrid/fe-core",
  exportName: "useDebouncedValue",
  slug: "use-debounced-value",
  displayName: "Use Debounced Value",
  category: "hook",
  subcategory: "interaction",
  description:
    "React hook that returns a debounced version of a value with optional normalization before commit.",
  tags: ["hook", "debounce", "search", "filter", "input"],
  capabilities: ["delay", "normalize", "typed-value", "react-hook"],
  fieldSemantics: ["search", "filter", "input", "debounce"],
  props: [
    {
      name: "value",
      type: "T",
      required: true,
      description: "Current source value that should be debounced.",
      semanticRole: "value",
    },
    {
      name: "delayMs",
      type: "number",
      required: true,
      description: "Debounce delay in milliseconds before the debounced value updates.",
      semanticRole: "behavior",
    },
    {
      name: "normalize",
      type: "(nextValue: T) => T",
      required: false,
      description: "Optional normalization function applied before the debounced value is stored.",
      semanticRole: "behavior",
    },
  ],
  states: ["idle", "pending", "debounced"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Search inputs that should wait before querying paginated APIs.",
    "Filter forms that should debounce local or remote state synchronization.",
    "Shared debounce logic for multiple domain modules without pulling feature config into the core package.",
  ],
  avoidUseCases: [
    "Immediate form validation that must react to every keystroke.",
    "Complex stream composition better handled by dedicated observable pipelines.",
  ],
  synonyms: ["debounced search", "debounced input", "debounced state", "search debounce"],
  relatedEntityFields: ["search", "filter", "query", "text input"],
  compositionHints: [
    "Wrap domain-specific normalization or min-length logic outside the hook and keep this hook generic.",
    "Use with server-side pagination so list fetches are triggered only after the debounced value settles.",
  ],
  rankingSignals: {
    freeText: 0.3,
    structuredChoice: 0.25,
    date: 0,
    number: 0,
    denseLayout: 0.05,
  },
};
