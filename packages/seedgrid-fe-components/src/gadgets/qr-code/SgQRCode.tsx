"use client";

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type QrErrorBoundaryProps = {
  resetKey: string;
  fallback: React.ReactNode;
  onError?: (error: Error) => void;
  children: React.ReactNode;
};

type QrErrorBoundaryState = {
  hasError: boolean;
};

class QrErrorBoundary extends React.Component<QrErrorBoundaryProps, QrErrorBoundaryState> {
  state: QrErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): QrErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  componentDidUpdate(prevProps: QrErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export type SgQRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type SgQRCodeProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  value?: string;
  size?: number;
  margin?: number;
  fgColor?: string;
  bgColor?: string;
  errorCorrectionLevel?: SgQRCodeErrorCorrectionLevel;
  logoSrc?: string;
  logoAlt?: string;
  logoSize?: number;
  logoPadding?: number;
  logoBackgroundColor?: string;
  logoBorderRadius?: number;
  imageClassName?: string;
  logoClassName?: string;
  emptyFallback?: React.ReactNode;
  onGenerateError?: (error: Error) => void;
};

export function SgQRCode(props: Readonly<SgQRCodeProps>) {
  const {
    value,
    size = 220,
    margin = 2,
    fgColor = "#000000",
    bgColor = "#FFFFFF",
    errorCorrectionLevel = "H",
    logoSrc,
    logoAlt = "Logo",
    logoSize,
    logoPadding = 6,
    logoBackgroundColor = "#FFFFFF",
    logoBorderRadius = 12,
    imageClassName,
    logoClassName,
    emptyFallback,
    onGenerateError,
    className,
    style,
    ...rest
  } = props;

  const normalizedValue = value?.trim() ?? "";

  const safeSize = Math.max(64, Math.round(size));
  const safeMargin = Math.max(0, Math.round(margin));
  const safeLogoPadding = Math.max(0, Math.round(logoPadding));
  const safeLogoSize = Math.max(
    18,
    Math.min(safeSize, Math.round(logoSize ?? safeSize * 0.22))
  );
  const logoContainerSize = safeLogoSize + safeLogoPadding * 2;
  const qrResetKey = `${normalizedValue}|${safeSize}|${safeMargin}|${fgColor}|${bgColor}|${errorCorrectionLevel}`;

  if (!normalizedValue) {
    if (!emptyFallback) return null;
    return (
      <div
        className={cn("inline-flex items-center justify-center", className)}
        style={{ width: safeSize, height: safeSize, ...style }}
        {...rest}
      >
        {emptyFallback}
      </div>
    );
  }

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: safeSize, height: safeSize, ...style }}
      {...rest}
    >
      <QrErrorBoundary
        resetKey={qrResetKey}
        onError={onGenerateError}
        fallback={<div className="h-full w-full animate-pulse rounded-md bg-muted/40" aria-hidden="true" />}
      >
        <QRCodeSVG
          value={normalizedValue}
          size={safeSize}
          marginSize={safeMargin}
          fgColor={fgColor}
          bgColor={bgColor}
          level={errorCorrectionLevel}
          title="QR Code"
          className={cn("block h-full w-full", imageClassName)}
        />
      </QrErrorBoundary>

      {logoSrc ? (
        <span
          className={cn("absolute inline-flex items-center justify-center overflow-hidden", logoClassName)}
          style={{
            width: logoContainerSize,
            height: logoContainerSize,
            padding: safeLogoPadding,
            borderRadius: logoBorderRadius,
            backgroundColor: logoBackgroundColor
          }}
        >
          <img
            src={logoSrc}
            alt={logoAlt}
            width={safeLogoSize}
            height={safeLogoSize}
            className="block h-full w-full object-contain"
            draggable={false}
          />
        </span>
      ) : null}
    </div>
  );
}

SgQRCode.displayName = "SgQRCode";
