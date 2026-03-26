export function clampWizardStep(initialStep: number | undefined, pageCount: number): number {
  const step = initialStep ?? 0;
  return Math.min(Math.max(step, 0), Math.max(pageCount - 1, 0));
}

export type WizardGuardRunner = {
  validateCurrentPage: () => boolean | Promise<boolean>;
  validateStep?: (index: number) => boolean | Promise<boolean>;
  beforeAction?: (index: number) => boolean | Promise<boolean>;
  step: number;
};

export async function canProceedWizardAction(runner: WizardGuardRunner): Promise<boolean> {
  const pageValid = await runner.validateCurrentPage();
  if (!pageValid) return false;

  if (runner.validateStep) {
    const stepValid = await runner.validateStep(runner.step);
    if (!stepValid) return false;
  }

  if (runner.beforeAction) {
    const allowed = await runner.beforeAction(runner.step);
    if (!allowed) return false;
  }

  return true;
}
