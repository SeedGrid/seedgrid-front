"use client";

import * as React from "react";
import { SgButton, type SgButtonProps } from "../buttons/SgButton";
import { t, useComponentsI18n } from "../i18n";
import { SgDialog, type SgDialogProps, type SgDialogSeverity } from "./SgDialog";

export type SgConfirmationDialogButtonConfig = {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  severity?: SgButtonProps["severity"];
  appearance?: SgButtonProps["appearance"];
  shape?: SgButtonProps["shape"];
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export type SgConfirmationDialogProps = Omit<
  SgDialogProps,
  "title" | "children" | "footer" | "severity" | "shadow" | "showTopAccent"
> & {
  title?: React.ReactNode;
  message?: React.ReactNode;
  icon?: React.ReactNode;
  iconPlacement?: "left" | "top";
  severity?: SgDialogSeverity;
  customColor?: SgDialogProps["customColor"];
  elevation?: SgDialogProps["elevation"];
  showSeverityAccent?: boolean;
  cancelButton?: SgConfirmationDialogButtonConfig;
  confirmButton?: SgConfirmationDialogButtonConfig;
  onCancel?: () => void;
  onConfirm?: () => void;
  closeOnCancel?: boolean;
  closeOnConfirm?: boolean;
};

function resolveButtonSeverity(
  dialogSeverity: SgDialogSeverity | undefined,
  fallback: NonNullable<SgButtonProps["severity"]>
): NonNullable<SgButtonProps["severity"]> {
  if (!dialogSeverity || dialogSeverity === "plain") return fallback;
  return dialogSeverity;
}

function DefaultCancelIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DefaultConfirmIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DefaultInfoSeverityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-sky-600" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7" r="1.25" fill="currentColor" />
    </svg>
  );
}

function DefaultWarningSeverityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-amber-600" aria-hidden="true">
      <path d="M12 3L22 20H2L12 3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 9v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17.25" r="1.1" fill="currentColor" />
    </svg>
  );
}

function DefaultDangerSeverityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-red-600" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function defaultSeverityIcon(severity: SgDialogSeverity): React.ReactNode {
  switch (severity) {
    case "info":
      return <DefaultInfoSeverityIcon />;
    case "warning":
      return <DefaultWarningSeverityIcon />;
    case "danger":
      return <DefaultDangerSeverityIcon />;
    default:
      return undefined;
  }
}

export function SgConfirmationDialog(props: Readonly<SgConfirmationDialogProps>) {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onClose,
    title,
    message,
    icon,
    iconPlacement = "left",
    severity = "warning",
    customColor,
    elevation,
    showSeverityAccent = false,
    cancelButton,
    confirmButton,
    onCancel,
    onConfirm,
    closeOnCancel = true,
    closeOnConfirm = true,
    closeable = false,
    size = "sm",
    ...dialogProps
  } = props;

  const i18n = useComponentsI18n();
  const isControlled = openProp !== undefined;
  const [openUncontrolled, setOpenUncontrolled] = React.useState<boolean>(defaultOpen);
  const open = isControlled ? Boolean(openProp) : openUncontrolled;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setOpenUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const fireCancel = React.useCallback(() => {
    cancelButton?.onClick?.();
    onCancel?.();
  }, [cancelButton, onCancel]);

  const handleCancel = React.useCallback(() => {
    fireCancel();
    if (closeOnCancel) setOpen(false);
  }, [fireCancel, closeOnCancel, setOpen]);

  const handleConfirm = React.useCallback(() => {
    confirmButton?.onClick?.();
    onConfirm?.();
    if (closeOnConfirm) setOpen(false);
  }, [confirmButton, onConfirm, closeOnConfirm, setOpen]);

  const handleDialogOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next && open) {
        fireCancel();
      }
      setOpen(next);
    },
    [open, fireCancel, setOpen]
  );

  const cancelLabel = cancelButton?.label ?? t(i18n, "components.actions.cancel");
  const confirmLabel = confirmButton?.label ?? t(i18n, "components.actions.confirm");

  const cancelIcon = cancelButton?.icon ?? <DefaultCancelIcon />;
  const confirmIcon = confirmButton?.icon ?? <DefaultConfirmIcon />;
  const resolvedIcon = icon !== undefined ? icon : defaultSeverityIcon(severity);

  const cancelSeverity = cancelButton?.severity ?? "secondary";
  const confirmSeverity = confirmButton?.severity ?? resolveButtonSeverity(severity, "primary");
  const resolvedCancelCustomColors =
    cancelButton?.appearance === undefined &&
    cancelButton?.severity === undefined &&
    cancelButton?.className === undefined
      ? {
          // SgButton outline uses `bg` as the text color token, so keep it visible here.
          bg: "hsl(var(--foreground))",
          fg: "hsl(var(--foreground))",
          border: "hsl(var(--border))",
          hoverBg: "hsl(var(--muted) / 0.8)",
          hoverFg: "hsl(var(--foreground))",
          hoverBorder: "hsl(var(--border))",
          activeBg: "hsl(var(--muted))",
        }
      : undefined;

  const messageBlock = (
    <div className="text-sm text-muted-foreground">
      {message}
    </div>
  );

  return (
    <SgDialog
      {...dialogProps}
      open={open}
      onOpenChange={handleDialogOpenChange}
      onClose={onClose}
      closeable={closeable}
      severity={severity}
      showTopAccent={showSeverityAccent}
      customColor={customColor}
      elevation={elevation}
      title={title}
      size={size}
      footer={(
        <>
          <SgButton
            size="sm"
            appearance={cancelButton?.appearance ?? "outline"}
            severity={cancelSeverity}
            shape={cancelButton?.shape ?? "rounded"}
            disabled={cancelButton?.disabled}
            className={cancelButton?.className}
            customColors={resolvedCancelCustomColors}
            leftIcon={cancelIcon}
            onClick={handleCancel}
          >
            {cancelLabel}
          </SgButton>
          <SgButton
            size="sm"
            appearance={confirmButton?.appearance ?? "solid"}
            severity={confirmSeverity}
            shape={confirmButton?.shape ?? "rounded"}
            disabled={confirmButton?.disabled}
            className={confirmButton?.className}
            leftIcon={confirmIcon}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </SgButton>
        </>
      )}
    >
      {resolvedIcon ? (
        iconPlacement === "top" ? (
          <div className="flex flex-col items-start gap-3">
            <div className="shrink-0">{resolvedIcon}</div>
            {messageBlock}
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="shrink-0">{resolvedIcon}</div>
            <div className="min-w-0">{messageBlock}</div>
          </div>
        )
      ) : (
        messageBlock
      )}
    </SgDialog>
  );
}

SgConfirmationDialog.displayName = "SgConfirmationDialog";

