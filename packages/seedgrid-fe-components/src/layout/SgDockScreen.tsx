"use client";

import * as React from "react";
import { SgDockLayout, type SgDockLayoutState } from "./SgDockLayout";
import { SgScreen, type SgScreenProps } from "./SgScreen";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type SgDockScreenProps = Omit<SgScreenProps, "children" | "id"> & {
  id: string;
  screenId?: string;
  defaultState?: SgDockLayoutState;
  layoutClassName?: string;
  children?: React.ReactNode;
};

const AUTO_LAYOUT_ROOT_CLASS = "relative grid h-full w-full min-h-0 min-w-0 grid-cols-[12rem_1fr_12rem] grid-rows-[auto_1fr_auto]";

export function SgDockScreen(props: Readonly<SgDockScreenProps>) {
  const {
    id,
    screenId,
    defaultState,
    layoutClassName,
    children,
    ...screenProps
  } = props;

  return (
    <SgScreen {...screenProps} id={screenId}>
      <SgDockLayout
        id={id}
        defaultState={defaultState}
        className={cn(AUTO_LAYOUT_ROOT_CLASS, layoutClassName)}
      >
        {children}
      </SgDockLayout>
    </SgScreen>
  );
}

SgDockScreen.displayName = "SgDockScreen";
