"use client";

import * as React from "react";
import QRCode from "qrcode";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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

  const [qrDataUrl, setQrDataUrl] = React.useState<string>("");
  const [hasError, setHasError] = React.useState(false);
  const normalizedValue = value?.trim() ?? "";

  const safeSize = Math.max(64, Math.round(size));
  const safeMargin = Math.max(0, Math.round(margin));
  const safeLogoPadding = Math.max(0, Math.round(logoPadding));
  const safeLogoSize = Math.max(
    18,
    Math.min(safeSize, Math.round(logoSize ?? safeSize * 0.22))
  );
  const logoContainerSize = safeLogoSize + safeLogoPadding * 2;

  React.useEffect(() => {
    let active = true;

    if (!normalizedValue) {
      setQrDataUrl("");
      setHasError(false);
      return () => {
        active = false;
      };
    }

    QRCode.toDataURL(normalizedValue, {
      width: safeSize,
      margin: safeMargin,
      color: {
        dark: fgColor,
        light: bgColor
      },
      errorCorrectionLevel
    })
      .then((dataUrl) => {
        if (!active) return;
        setQrDataUrl(dataUrl);
        setHasError(false);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        const error = cause instanceof Error ? cause : new Error("Failed to generate QR code");
        setQrDataUrl("");
        setHasError(true);
        onGenerateError?.(error);
      });

    return () => {
      active = false;
    };
  }, [
    normalizedValue,
    safeSize,
    safeMargin,
    fgColor,
    bgColor,
    errorCorrectionLevel,
    onGenerateError
  ]);

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
      {qrDataUrl && !hasError ? (
        <img
          src={qrDataUrl}
          alt="QR Code"
          width={safeSize}
          height={safeSize}
          className={cn("block h-full w-full", imageClassName)}
          draggable={false}
        />
      ) : (
        <div className="h-full w-full animate-pulse rounded-md bg-muted/40" aria-hidden="true" />
      )}

      {logoSrc && qrDataUrl && !hasError ? (
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
