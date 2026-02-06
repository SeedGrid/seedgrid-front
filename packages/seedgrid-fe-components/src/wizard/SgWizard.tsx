"use client";

import React from "react";

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
  initialStep?: number;
  labels?: Partial<SgWizardLabels>;
  className?: string;
};

const DEFAULT_LABELS: SgWizardLabels = {
  next: "Próximo",
  previous: "Anterior",
  finish: "Finalizar"
};

export function SgWizard(props: SgWizardProps) {
  const pages = React.Children.toArray(props.children).filter(
    (child) => React.isValidElement(child) && child.type === SgWizardPage
  ) as Array<React.ReactElement<SgWizardPageProps>>;

  const [step, setStep] = React.useState(() => {
    const idx = props.initialStep ?? 0;
    return Math.min(Math.max(idx, 0), Math.max(pages.length - 1, 0));
  });
  const [isFinishing, setIsFinishing] = React.useState(false);

  React.useEffect(() => {
    props.onStepChange?.(step);
  }, [props, step]);

  const labels = { ...DEFAULT_LABELS, ...(props.labels ?? {}) };
  const isFirst = step <= 0;
  const isLast = step >= pages.length - 1;

  const goNext = () => {
    if (isLast) return;
    setStep((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const goPrevious = () => {
    if (isFirst) return;
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFinish = async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    try {
      await props.onFinish();
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className={props.className}>
      <div>{pages[step]}</div>
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
              className="inline-flex h-10 items-center justify-center rounded-full bg-[hsl(var(--primary))] px-5 text-sm font-semibold text-white shadow-lg shadow-[hsl(var(--primary)/0.35)] transition hover:brightness-95"
            >
              {labels.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isFinishing}
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




