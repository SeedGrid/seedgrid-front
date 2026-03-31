import React from "react";
import { getComponentsI18n, t } from "../i18n";

export type SgWhistleId = string;
export type SgWhistleSeverity = "default" | "success" | "info" | "warning" | "error" | "loading";
export type SgWhistleBorderStyle = "solid" | "soft" | "left-accent" | "full-accent" | "none";

export type SgWhistleAction = {
  label: string;
  onClick: () => void;
};

export type SgWhistleOptions = {
  id?: string;
  severity?: SgWhistleSeverity;
  title?: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
  dismissible?: boolean;
  borderStyle?: SgWhistleBorderStyle;
  opacity?: number;
  action?: SgWhistleAction;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
};

export type SgWhistleCustomOptions = Omit<Partial<SgWhistleOptions>, "message"> & {
  message?: string;
};

export type SgWhistleRecord = Omit<SgWhistleCustomOptions, "id"> & {
  id: SgWhistleId;
  severity: SgWhistleSeverity;
  createdAt: number;
  renderer?: React.ReactNode;
};

type SgWhistleListener = (whistles: SgWhistleRecord[]) => void;
type SgWhistleRenderer = React.ReactNode | ((id: SgWhistleId) => React.ReactNode);
type SgWhistleResolvableState<T> =
  | (Omit<Partial<SgWhistleOptions>, "id" | "severity"> & { message: string })
  | ((value: T) => Omit<Partial<SgWhistleOptions>, "id" | "severity"> & { message: string });

export type SgWhistlePromiseStates<T> = {
  loading?: Omit<Partial<SgWhistleOptions>, "id" | "severity"> & { message: string };
  success?: SgWhistleResolvableState<T>;
  error?: SgWhistleResolvableState<unknown>;
};

const listeners = new Set<SgWhistleListener>();
let whistles: SgWhistleRecord[] = [];
let whistleCounter = 0;

function emitWhistles() {
  const snapshot = [...whistles];
  listeners.forEach((listener) => listener(snapshot));
}

function createWhistleId() {
  whistleCounter += 1;
  return `sg-whistle-${Date.now()}-${whistleCounter}`;
}

function upsertWhistle(nextWhistle: SgWhistleRecord) {
  const currentIndex = whistles.findIndex((item) => item.id === nextWhistle.id);

  if (currentIndex < 0) {
    whistles = [...whistles, nextWhistle];
    emitWhistles();
    return nextWhistle.id;
  }

  const currentWhistle = whistles[currentIndex]!;
  const merged: SgWhistleRecord = {
    ...currentWhistle,
    ...nextWhistle,
    createdAt: currentWhistle.createdAt
  };

  whistles = [
    ...whistles.slice(0, currentIndex),
    merged,
    ...whistles.slice(currentIndex + 1)
  ];
  emitWhistles();
  return merged.id;
}

function removeWhistles(predicate: (whistle: SgWhistleRecord) => boolean) {
  const removed = whistles.filter(predicate);
  if (removed.length === 0) {
    return;
  }

  whistles = whistles.filter((whistle) => !predicate(whistle));
  emitWhistles();

  removed.forEach((whistle) => {
    whistle.onClose?.();
  });
}

function createWhistleRecord(
  options: SgWhistleCustomOptions,
  severity: SgWhistleSeverity,
  id = options.id ?? createWhistleId()
): SgWhistleRecord {
  return {
    ...options,
    id,
    severity: options.severity ?? severity,
    createdAt: Date.now()
  };
}

function resolveState<T>(
  state: SgWhistleResolvableState<T> | undefined,
  value: T
): (Omit<Partial<SgWhistleOptions>, "id" | "severity"> & { message: string }) | undefined {
  if (state === undefined) {
    return undefined;
  }

  return typeof state === "function" ? state(value) : state;
}

function showWhistle(options: SgWhistleOptions) {
  const record = createWhistleRecord(options, options.severity ?? "default");
  return upsertWhistle(record);
}

type SgWhistleApi = {
  show: (options: SgWhistleOptions) => SgWhistleId;
  success: (options: SgWhistleOptions) => SgWhistleId;
  info: (options: SgWhistleOptions) => SgWhistleId;
  warning: (options: SgWhistleOptions) => SgWhistleId;
  error: (options: SgWhistleOptions) => SgWhistleId;
  loading: (options: SgWhistleOptions) => SgWhistleId;
  dismiss: (id?: SgWhistleId) => void;
  update: (id: SgWhistleId, options: Partial<SgWhistleOptions>) => SgWhistleId;
  custom: (renderer: SgWhistleRenderer, options?: SgWhistleCustomOptions) => SgWhistleId;
  promise: <T>(
    promiseOrFactory: Promise<T> | (() => Promise<T>),
    states: SgWhistlePromiseStates<T>,
    options?: Omit<Partial<SgWhistleOptions>, "id" | "severity" | "message">
  ) => Promise<T>;
};

export function dismissSgWhistle(id?: SgWhistleId) {
  if (!id) {
    removeWhistles(() => true);
    return;
  }

  removeWhistles((whistle) => whistle.id === id);
}

export function subscribeSgWhistles(listener: SgWhistleListener) {
  listeners.add(listener);
  listener([...whistles]);
  return () => {
    listeners.delete(listener);
  };
}

export const sgWhistle: SgWhistleApi = {
  show(options) {
    return showWhistle({ ...options, severity: options.severity ?? "default" });
  },
  success(options) {
    return showWhistle({ ...options, severity: "success" });
  },
  info(options) {
    return showWhistle({ ...options, severity: "info" });
  },
  warning(options) {
    return showWhistle({ ...options, severity: "warning" });
  },
  error(options) {
    return showWhistle({ ...options, severity: "error" });
  },
  loading(options) {
    return showWhistle({ ...options, severity: "loading" });
  },
  dismiss(id) {
    dismissSgWhistle(id);
  },
  update(id, options) {
    const currentWhistle = whistles.find((whistle) => whistle.id === id);
    if (!currentWhistle) {
      return id;
    }

    return upsertWhistle({
      ...currentWhistle,
      ...options,
      id,
      createdAt: currentWhistle.createdAt
    });
  },
  custom(renderer, options = {}) {
    const id = options.id ?? createWhistleId();
    return upsertWhistle({
      ...createWhistleRecord(options, options.severity ?? "default", id),
      renderer: typeof renderer === "function" ? renderer(id) : renderer
    });
  },
  async promise<T>(
    promiseOrFactory: Promise<T> | (() => Promise<T>),
    states: SgWhistlePromiseStates<T>,
    options?: Omit<Partial<SgWhistleOptions>, "id" | "severity" | "message">
  ) {
    const runPromise = typeof promiseOrFactory === "function" ? promiseOrFactory() : promiseOrFactory;
    const i18n = getComponentsI18n();
    const loadingState = states.loading ?? { message: t(i18n, "components.toast.loading") };
    const loadingId = sgWhistle.loading({
      ...options,
      ...loadingState,
      severity: "loading"
    });

    try {
      const value = await runPromise;
      const successState = resolveState(states.success, value);

      if (successState) {
        sgWhistle.update(loadingId, {
          ...options,
          ...successState,
          severity: "success"
        });
      } else {
        sgWhistle.dismiss(loadingId);
      }

      return value;
    } catch (error) {
      const errorState = resolveState(states.error, error);

      if (errorState) {
        sgWhistle.update(loadingId, {
          ...options,
          ...errorState,
          severity: "error"
        });
      } else {
        sgWhistle.dismiss(loadingId);
      }

      throw error;
    }
  }
};
