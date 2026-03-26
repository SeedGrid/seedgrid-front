"use client";

import React from "react";
import { t, useComponentsI18n } from "../i18n";
import { canProceedWizardAction, clampWizardStep } from "./logic";

export type SgWizardPageProps = {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function SgWizardPage(props: SgWizardPageProps) {
  return <div className={props.className} style={props.style}>{props.children}</div>;
}

export type SgWizardLabels = {
  next: string;
  previous: string;
  finish: string;
};

export type SgWizardStepper = "numbered" | "icons" | "none";

export type SgWizardProps = {
  children: React.ReactNode;
  onFinish: () => void | Promise<void>;
  onStepChange?: (index: number) => void;
  onBeforeNext?: (index: number) => boolean | Promise<boolean>;
  onBeforeFinish?: (index: number) => boolean | Promise<boolean>;
  validateStep?: (index: number) => boolean | Promise<boolean>;
  initialStep?: number;
  labels?: Partial<SgWizardLabels>;
  stepper?: SgWizardStepper;
  className?: string;
  style?: React.CSSProperties;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function StepperBar({
  i18n,
  pages,
  currentStep,
  mode
}: {
  pages: Array<React.ReactElement<SgWizardPageProps>>;
  currentStep: number;
  mode: "numbered" | "icons";
  i18n: ReturnType<typeof useComponentsI18n>;
}) {
  return (
    <nav aria-label={t(i18n, "components.wizard.progress")} className="mb-8">
      <ol className="flex items-center">
        {pages.map((page, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const title = page.props.title ?? t(i18n, "components.wizard.step", { step: i + 1 });
          const icon = page.props.icon;
          const isLast = i === pages.length - 1;

          return (
            <li key={i} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`flex items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                    isCompleted
                      ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                      : isCurrent
                        ? "border-[hsl(var(--primary))] bg-[rgb(var(--sg-surface,var(--sg-bg)))] text-[hsl(var(--primary))]"
                        : "border-border bg-[rgb(var(--sg-surface,var(--sg-bg)))] text-muted-foreground"
                  }`}
                  style={{ width: 40, height: 40 }}
                >
                  {isCompleted ? (
                    <CheckIcon className="size-5" />
                  ) : mode === "icons" && icon ? (
                    <span className="flex items-center justify-center size-5">{icon}</span>
                  ) : (
                    <span className="text-sm font-semibold">{i + 1}</span>
                  )}
                </div>
                {/* Label */}
                <span
                  className={`mt-2 text-xs font-medium text-center max-w-[80px] leading-tight ${
                    isCompleted || isCurrent ? "text-[hsl(var(--primary))]" : "text-muted-foreground"
                  }`}
                >
                  {title}
                </span>
              </div>

              {/* Connector line */}
              {!isLast ? (
                <div className="flex-1 mx-2 self-start" style={{ marginTop: 19 }}>
                  <div
                    className={`h-0.5 w-full transition-colors duration-200 ${
                      isCompleted ? "bg-[hsl(var(--primary))]" : "bg-border"
                    }`}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SgWizard(props: SgWizardProps) {
  const i18n = useComponentsI18n();
  const pages = React.Children.toArray(props.children).filter(
    (child) => React.isValidElement(child) && child.type === SgWizardPage
  ) as Array<React.ReactElement<SgWizardPageProps>>;

  const stepper = props.stepper ?? "none";

  const [step, setStep] = React.useState(() => clampWizardStep(props.initialStep, pages.length));
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
      const ok = await canProceedWizardAction({
        validateCurrentPage,
        validateStep: props.validateStep,
        beforeAction: props.onBeforeNext,
        step
      });
      if (!ok) return;
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
      const ok = await canProceedWizardAction({
        validateCurrentPage,
        validateStep: props.validateStep,
        beforeAction: props.onBeforeFinish,
        step
      });
      if (!ok) return;
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
    <div className={props.className} style={props.style}>
      {stepper !== "none" ? (
        <StepperBar pages={pages} currentStep={step} mode={stepper} i18n={i18n} />
      ) : null}
      <div ref={pageRef}>{pages[step]}</div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          {!isFirst ? (
            <button
              type="button"
              onClick={goPrevious}
              className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold text-foreground/80 transition hover:bg-muted/60"
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
