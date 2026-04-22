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
  componentId: "utility.api-errors",
  package: "@seedgrid/fe-core",
  exportName: "extractApiErrorMessage",
  slug: "extract-api-error-message",
  displayName: "API Error Message Extractor",
  category: "utility",
  subcategory: "http",
  description:
    "Reads API problem payloads and extracts the best user-facing message, prioritizing RFC7807 violations before generic detail/title fields.",
  tags: ["api", "http", "error", "rfc7807", "validation"],
  capabilities: [
    "api-client-error",
    "rfc7807",
    "violations",
    "error-message",
    "json-string-body",
  ],
  fieldSemantics: ["error", "validation", "problem-details", "http"],
  props: [
    {
      name: "error",
      type: "unknown",
      required: true,
      description:
        "ApiClientError, ApiClientError-like object, Error instance, or unknown thrown value to inspect.",
      semanticRole: "data",
    },
  ],
  states: ["empty", "problem-details", "violations", "fallback-message"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Showing API validation or problem-detail messages in UI toasts, whistles, dialogs, or notices.",
    "Normalizing backend RFC7807 responses before mapping them to feature-specific fallback translations.",
    "Handling cases where errors cross bundle boundaries and no longer satisfy instanceof ApiClientError.",
  ],
  avoidUseCases: [
    "Client-side form validation unrelated to API responses.",
    "Flows that need full structured problem objects rather than a single human-readable message.",
  ],
  synonyms: [
    "rfc7807 parser",
    "problem details",
    "api validation message",
    "violations message",
  ],
  relatedEntityFields: ["responseBody", "detail", "title", "violations", "errors"],
  compositionHints: [
    "Call extractApiErrorMessage(error) first, then apply feature-specific server/network/html fallbacks only if needed.",
    "Use alongside createApiClient so ApiClientError.responseBody is preserved end-to-end.",
  ],
  rankingSignals: {
    freeText: 0.35,
    structuredChoice: 0.2,
    date: 0,
    number: 0,
    denseLayout: 0.05,
  },
};
