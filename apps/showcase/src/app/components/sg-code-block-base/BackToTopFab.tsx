"use client";

import * as React from "react";
import { SgFloatActionButton } from "@seedgrid/fe-components";

function ArrowUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export default function BackToTopFab(props: Readonly<{ targetId: string }>) {
  return (
    <SgFloatActionButton
      hint="Ir para o inicio"
      icon={<ArrowUpIcon />}
      position="right-bottom"
      severity="primary"
      onClick={() => {
        const target = document.getElementById(props.targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  );
}
