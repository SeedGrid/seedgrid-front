"use client";

import React from "react";
import { SgButton, SgPanel, SgScreen } from "@seedgrid/fe-components";

export default function ExampleSgPanelDockScreenComposition() {
  return (
      <SgScreen>
        <SgPanel align="top" contentPadding={8} minHeightPx={100}>
          <SgPanel
            align="right"
            contentDirection="row"
            contentPadding={8}
            contentAlign="center"
          >
            <SgButton label="TESTE" />
            <SgButton label="TESTE" />
            <SgButton label="TESTE" />
          </SgPanel>
        </SgPanel>

        <SgPanel align="left" width={10} contentPadding={8}>
          <SgButton label="TESTE" />
          <SgButton label="TESTE" />
          <SgButton label="TESTE" />
        </SgPanel>

        <SgPanel align="client" contentPadding={12}>
          client
        </SgPanel>

        <SgPanel align="bottom" height={5} contentPadding={8} minHeightPx={100}>
          <SgPanel align="left" contentDirection="row" contentPadding={8}>
            <SgButton label="TESTE" />
            <SgButton label="TESTE" />
            <SgButton label="TESTE" />
          </SgPanel>
        </SgPanel>
      </SgScreen>
  );
}
