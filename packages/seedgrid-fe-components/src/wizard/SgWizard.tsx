"use client";

import React from "react";
import { t, useComponentsI18n } from "../i18n";

export type SgWizardPageProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function SgWizardPage(props: SgWizardPageProps) {
  return <div className={props.className}>{props.children}</div>;
}

export type SgWizardLabels = {
  next: string;
  previous: string;
  finish: string;
};

export type SgWizardProps = {
  children: React.ReactNode;
  onFinish: () => void | Promise<void>;
  onStepChange?: (index: number) => void;
  onBeforeNext?: (index: number) => boolean | Promise<boolean>;
  onBeforeFinish?: (index: number) => boolean | Promise<boolean>;
  validateStep?: (index: number) => boolean | Promise<boolean>;
  initialStep?: number;
  labels?: Partial<SgWizardLabels>;
  className?: string;
};

export function SgWizard(props: SgWizardProps) {
  const i18n = useComponentsI18n();
  const pages = React.Children.toArray(props.children).filter(
    (child) => React.isValidElement(child) && child.type === SgWizardPage
  ) as Array<React.ReactElement<SgWizardPageProps>>;

  const [step, setStep] = React.useState(() => {
    const idx = props.initialStep ?? 0;
    return Math.min(Math.max(idx, 0), Math.max(pages.length - 1, 0));
  });
  const [isFinishing, setIsFinishing] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const pageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    props.onStepChange?.(step);
  }, [props, step]);

  const labels: SgWizardLabels = {
    next: t(i18n, "components.wizard.next"),
    previous: t(i18n, "components.wizard.previous"),
    finish: t(i18n, "components.wizard.finish"),
    ...(props.labels ?? {})
  };
  const isFirst = step <= 0;
  const isLast = step >= pages.length - 1;

  const validateCurrentPage = async (): Promise<boolean> => {
    const container = pageRef.current;
    if (!container) return true;
    const inputs = container.querySelectorAll<HTMLElement>("input, select, textarea");
    for (const input of Array.from(inputs)) {
      input.focus({ preventScroll: true });
      input.blur();
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
    const errors = container.querySelectorAll("[data-sg-error]");
    return errors.length === 0;
  };

  const goNext = async () => {
    if (isLast) return;
    if (isValidating) return;
    setIsValidating(true);
    try {
      const pageValid = await validateCurrentPage();
      if (!pageValid) return;
      if (props.validateStep) {
        const ok = await props.validateStep(step);
        if (!ok) return;
      }
      if (props.onBeforeNext) {
        const ok = await props.onBeforeNext(step);
        if (!ok) return;
      }
      setStep((prev) => Math.min(prev + 1, pages.length - 1));
    } finally {
      setIsValidating(false);
    }
  };

  const goPrevious = () => {
    if (isFirst) return;
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFinish = async () => {
    if (isFinishing) return;
    if (isValidating) return;
    setIsValidating(true);
    try {
      const pageValid = await validateCurrentPage();
      if (!pageValid) return;
      if (props.validateStep) {
        const ok = await props.validateStep(step);
        if (!ok) return;
      }
      if (props.onBeforeFinish) {
        const ok = await props.onBeforeFinish(step);
        if (!ok) return;
      }
    } finally {
      setIsValidating(false);
    }
    setIsFinishing(true);
    try {
      await props.onFinish();
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className={props.className}>
      <div ref={pageRef}>{pages[step]}</div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          {!isFirst ? (
            <button
              type="button"
              onClick={goPrevious}
              className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold text-foreground/80 transition hover:bg-black/5"
            >
              {labels.previous}
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {!isLast ? (
            <button
              type="button"
              onClick={goNext}
              disabled={isValidating}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[hsl(var(--primary))] px-5 text-sm font-semibold text-white shadow-lg shadow-[hsl(var(--primary)/0.35)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {labels.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isFinishing || isValidating}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[hsl(var(--primary))] px-5 text-sm font-semibold text-white shadow-lg shadow-[hsl(var(--primary)/0.35)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {labels.finish}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



