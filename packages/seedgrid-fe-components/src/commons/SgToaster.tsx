"use client";

import React from "react";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export type SgToasterProps = ToasterProps;

export function SgToaster(props: SgToasterProps) {
  return (
    <SonnerToaster
      richColors
      closeButton
      position="top-right"
      {...props}
    />
  );
}
