"use client";

import React from "react";
import { useShowcaseI18n, type ShowcaseLocale } from "../../i18n";

export type ShowcaseExampleLink = {
  id: string;
  label: string;
};

type UseShowcaseAnchorsOptions = {
  deps?: React.DependencyList;
  minOffset?: number;
  extraTopGap?: number;
};

function getExampleLabel(locale: ShowcaseLocale): string {
  if (locale === "en-US") return "Example";
  if (locale === "es") return "Ejemplo";
  if (locale === "pt-BR" || locale === "pt-PT") return "Exemplo";
  return "Example";
}

export function useShowcaseAnchors(options?: UseShowcaseAnchorsOptions) {
  const i18n = useShowcaseI18n();
  const exampleLabel = getExampleLabel(i18n.locale);
  const deps = options?.deps ?? [];
  const minOffset = options?.minOffset ?? 240;
  const extraTopGap = options?.extraTopGap ?? 12;

  const pageRef = React.useRef<HTMLDivElement | null>(null);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);
  const [exampleLinks, setExampleLinks] = React.useState<ShowcaseExampleLink[]>([]);

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(minOffset, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) resizeObserver.observe(stickyHeaderRef.current);

    window.addEventListener("resize", updateAnchorOffset);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateAnchorOffset);
    };
  }, [minOffset, ...deps]);

  const syncExampleLinks = React.useCallback(() => {
    const root = pageRef.current;
    if (!root) return 0;

    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-showcase-example="true"]'));
    const links = sections.map((section, index) => {
      const id = `exemplo-${index + 1}`;
      section.id = id;
      const titleEl =
        (section.querySelector("[data-anchor-title='true']") as HTMLElement | null) ??
        section.querySelector("h2, h3");
      const rawTitle = titleEl?.textContent?.trim() ?? `${exampleLabel} ${index + 1}`;
      const normalized = rawTitle.replace(/^\d+\)\s*/, "").trim();
      return {
        id,
        label: `${index + 1}) ${normalized || `${exampleLabel} ${index + 1}`}`
      };
    });
    setExampleLinks((prev) => {
      if (prev.length === links.length && prev.every((item, index) => item.id === links[index]?.id && item.label === links[index]?.label)) {
        return prev;
      }
      return links;
    });
    return links.length;
  }, [exampleLabel]);

  React.useEffect(() => {
    let cancelled = false;
    let retryCount = 0;
    let retryTimer = 0;

    const scheduleRetry = () => {
      retryTimer = window.setTimeout(runSync, 50);
    };

    const runSync = () => {
      if (cancelled) return;
      const count = syncExampleLinks();
      retryCount += 1;

      // I18NReady renders fallback first; keep retrying briefly until sections mount.
      if ((!pageRef.current || count === 0) && retryCount < 40) {
        scheduleRetry();
      }
    };

    runSync();
    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [syncExampleLinks, ...deps, exampleLabel]);

  const findScrollContainer = React.useCallback((element: HTMLElement | null): HTMLElement | Window => {
    let current = element?.parentElement ?? null;
    while (current) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    return window;
  }, []);

  const navigateToAnchor = React.useCallback(
    (anchorId: string) => {
      const target = document.getElementById(anchorId);
      if (!target) return;

      const scrollContainer = findScrollContainer(target);
      const titleEl =
        (target.querySelector("h1, h2, h3, [data-anchor-title='true']") as HTMLElement | null) ?? target;

      const correctIfNeeded = () => {
        const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
        const desiredTopNow = stickyBottomNow + extraTopGap;
        const currentTop = titleEl.getBoundingClientRect().top;
        const delta = currentTop - desiredTopNow;
        if (Math.abs(delta) <= 1) return;

        if (scrollContainer === window) {
          const next = Math.max(0, window.scrollY + delta);
          window.scrollTo({ top: next, behavior: "auto" });
          return;
        }

        const container = scrollContainer as HTMLElement;
        const next = Math.max(0, container.scrollTop + delta);
        container.scrollTo({ top: next, behavior: "auto" });
      };

      if (scrollContainer === window) {
        const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
        const desiredTopNow = stickyBottomNow + extraTopGap;
        const titleTop = window.scrollY + titleEl.getBoundingClientRect().top;
        window.scrollTo({ top: Math.max(0, titleTop - desiredTopNow), behavior: "auto" });
      } else {
        const container = scrollContainer as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
        const desiredTopInContainer = stickyBottomNow + extraTopGap - containerRect.top;
        const titleRect = titleEl.getBoundingClientRect();
        const titleTopInContainer = container.scrollTop + (titleRect.top - containerRect.top);
        container.scrollTo({ top: Math.max(0, titleTopInContainer - desiredTopInContainer), behavior: "auto" });
      }

      window.history.replaceState(null, "", `#${anchorId}`);
      requestAnimationFrame(() => {
        correctIfNeeded();
        requestAnimationFrame(correctIfNeeded);
      });
      window.setTimeout(correctIfNeeded, 120);
      window.setTimeout(correctIfNeeded, 260);
    },
    [extraTopGap, findScrollContainer]
  );

  const handleAnchorClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      navigateToAnchor(anchorId);
    },
    [navigateToAnchor]
  );

  const navigateToAnchorRef = React.useRef(navigateToAnchor);
  React.useEffect(() => {
    navigateToAnchorRef.current = navigateToAnchor;
  }, [navigateToAnchor]);

  React.useEffect(() => {
    const applyHashNavigation = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      navigateToAnchorRef.current(hash);
    };

    const timer = window.setTimeout(applyHashNavigation, 0);
    window.addEventListener("hashchange", applyHashNavigation);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", applyHashNavigation);
    };
  }, []);

  return {
    pageRef,
    stickyHeaderRef,
    anchorOffset,
    exampleLinks,
    handleAnchorClick
  };
}
