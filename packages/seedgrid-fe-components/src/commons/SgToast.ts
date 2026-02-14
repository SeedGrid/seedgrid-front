import React from "react";

export type SgToastId = string;
export type SgToastType = "default" | "success" | "info" | "warning" | "error" | "loading";

export type SgToastAction = {
  label: React.ReactNode;
  onClick?: () => void;
};

export type SgToastOptions = {
  id?: SgToastId;
  description?: React.ReactNode;
  duration?: number;
  action?: SgToastAction;
  closeButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export type SgToastRecord = Omit<SgToastOptions, "id"> & {
  id: SgToastId;
  type: SgToastType;
  title?: React.ReactNode;
  createdAt: number;
};

type SgToastListener = (toasts: SgToastRecord[]) => void;

const listeners = new Set<SgToastListener>();
let toasts: SgToastRecord[] = [];
let toastCounter = 0;

function emitToasts() {
  const snapshot = [...toasts];
  listeners.forEach((listener) => listener(snapshot));
}

function createToastId() {
  toastCounter += 1;
  return `sg-toast-${Date.now()}-${toastCounter}`;
}

function upsertToast(nextToast: SgToastRecord) {
  const currentIndex = toasts.findIndex((item) => item.id === nextToast.id);

  if (currentIndex < 0) {
    toasts = [...toasts, nextToast];
  } else {
    const currentToast = toasts[currentIndex];
    const merged: SgToastRecord = {
      ...currentToast,
      ...nextToast
    };
    toasts = [...toasts.slice(0, currentIndex), merged, ...toasts.slice(currentIndex + 1)];
  }

  emitToasts();
  return nextToast.id;
}

function showToast(type: SgToastType, title?: React.ReactNode, options: SgToastOptions = {}) {
  const id = options.id ?? createToastId();
  return upsertToast({
    ...options,
    id,
    type,
    title,
    createdAt: Date.now()
  });
}

export function dismissSgToast(id?: SgToastId) {
  if (!id) {
    toasts = [];
    emitToasts();
    return;
  }

  const previousCount = toasts.length;
  toasts = toasts.filter((item) => item.id !== id);
  if (toasts.length !== previousCount) {
    emitToasts();
  }
}

export function subscribeSgToasts(listener: SgToastListener) {
  listeners.add(listener);
  listener([...toasts]);
  return () => {
    listeners.delete(listener);
  };
}

export type SgToastPromiseMessages<T> = {
  loading?: React.ReactNode;
  success?: React.ReactNode | ((value: T) => React.ReactNode);
  error?: React.ReactNode | ((error: unknown) => React.ReactNode);
};

export type SgToastFn = ((title?: React.ReactNode, options?: SgToastOptions) => SgToastId) & {
  message: (title?: React.ReactNode, options?: SgToastOptions) => SgToastId;
  success: (title?: React.ReactNode, options?: SgToastOptions) => SgToastId;
  info: (title?: React.ReactNode, options?: SgToastOptions) => SgToastId;
  warning: (title?: React.ReactNode, options?: SgToastOptions) => SgToastId;
  error: (title?: React.ReactNode, options?: SgToastOptions) => SgToastId;
  loading: (title?: React.ReactNode, options?: SgToastOptions) => SgToastId;
  custom: (
    renderer: React.ReactNode | ((id: SgToastId) => React.ReactNode),
    options?: SgToastOptions
  ) => SgToastId;
  dismiss: (id?: SgToastId) => void;
  promise: <T>(
    promiseOrFactory: Promise<T> | (() => Promise<T>),
    messages: SgToastPromiseMessages<T>,
    options?: SgToastOptions
  ) => Promise<T>;
};

const baseToast = ((title?: React.ReactNode, options?: SgToastOptions) =>
  showToast("default", title, options)) as SgToastFn;

baseToast.message = (title?: React.ReactNode, options?: SgToastOptions) =>
  showToast("default", title, options);

baseToast.success = (title?: React.ReactNode, options?: SgToastOptions) =>
  showToast("success", title, options);

baseToast.info = (title?: React.ReactNode, options?: SgToastOptions) =>
  showToast("info", title, options);

baseToast.warning = (title?: React.ReactNode, options?: SgToastOptions) =>
  showToast("warning", title, options);

baseToast.error = (title?: React.ReactNode, options?: SgToastOptions) =>
  showToast("error", title, options);

baseToast.loading = (title?: React.ReactNode, options?: SgToastOptions) =>
  showToast("loading", title, options);

baseToast.custom = (
  renderer: React.ReactNode | ((id: SgToastId) => React.ReactNode),
  options?: SgToastOptions
) => {
  const id = options?.id ?? createToastId();
  const title = typeof renderer === "function" ? renderer(id) : renderer;
  return showToast("default", title, { ...options, id });
};

baseToast.dismiss = (id?: SgToastId) => {
  dismissSgToast(id);
};

baseToast.promise = async <T>(
  promiseOrFactory: Promise<T> | (() => Promise<T>),
  messages: SgToastPromiseMessages<T>,
  options?: SgToastOptions
) => {
  const runPromise = typeof promiseOrFactory === "function" ? promiseOrFactory() : promiseOrFactory;

  const loadingId = baseToast.loading(messages.loading ?? "Loading...", options);

  try {
    const value = await runPromise;

    if (messages.success !== undefined) {
      const successTitle = typeof messages.success === "function" ? messages.success(value) : messages.success;
      baseToast.success(successTitle, { ...options, id: loadingId });
    } else {
      baseToast.dismiss(loadingId);
    }

    return value;
  } catch (error) {
    if (messages.error !== undefined) {
      const errorTitle = typeof messages.error === "function" ? messages.error(error) : messages.error;
      baseToast.error(errorTitle, { ...options, id: loadingId });
    } else {
      baseToast.dismiss(loadingId);
    }

    throw error;
  }
};

export const toast = baseToast;
