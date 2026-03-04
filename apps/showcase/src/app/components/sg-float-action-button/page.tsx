"use client";

import React from "react";
import Link from "next/link";
import { SgFloatActionButton, SgGrid, SgPlayground, type SgFABAction } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

/* â”€â”€ icons â”€â”€ */
const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
);
const FilePlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M12 18v-6"/></svg>
);
const FolderPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

/* â”€â”€ demo container for absolute positioning â”€â”€ */
function DemoBox(props: { children: React.ReactNode; className?: string; height?: string }) {
  return (
    <div className={`relative w-full rounded-md border border-dashed border-border bg-muted/20 pt-10 ${props.height ?? "h-48"} ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
}

const FAB_EXAMPLE_LINKS = [
  { id: "exemplo-1", label: "1) Positions" },
  { id: "exemplo-2", label: "2) Variants" },
  { id: "exemplo-3", label: "3) Shapes & Sizes" },
  { id: "exemplo-4", label: "4) Elevation" },
  { id: "exemplo-5", label: "5) Hint" },
  { id: "exemplo-6", label: "6) Actions - Linear Layout" },
  { id: "exemplo-7", label: "7) Circle Layout" },
  { id: "exemplo-8", label: "8) Semi-Circle Layout" },
  { id: "exemplo-9", label: "9) Quarter-Circle Layout" },
  { id: "exemplo-10", label: "10) Active Icon" },
  { id: "exemplo-11", label: "11) Animations" },
  { id: "exemplo-12", label: "12) Custom Color" },
  { id: "exemplo-13", label: "13) Disabled & Loading" },
  { id: "exemplo-14", label: "14) Drag & Drop" },
  { id: "exemplo-15", label: "15) Playground" }
];

const FAB_PLAYGROUND_CODE = `import * as React from "react";
import { Heart, Plus, Star } from "lucide-react";
import { SgButton, SgGrid, SgFloatActionButton } from "@seedgrid/fe-components";

const actions = [
  { icon: <Plus className="size-4" />, label: "New", onClick: () => {} },
  { icon: <Star className="size-4" />, label: "Favorite", onClick: () => {} },
];

export default function App() {
  const [severity, setSeverity] = React.useState<"primary" | "secondary" | "success" | "danger">("primary");
  const [shape, setShape] = React.useState<"circle" | "rounded" | "square">("circle");
  const [size, setSize] = React.useState<"sm" | "md" | "lg">("md");
  const [type, setType] = React.useState<"none" | "linear" | "circle" | "semi-circle" | "quarter-circle">("linear");
  const [direction, setDirection] = React.useState<"up" | "down" | "left" | "right">("up");

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("primary")}>primary</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("success")}>success</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("danger")}>danger</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("secondary")}>secondary</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setShape("circle")}>circle</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setShape("rounded")}>rounded</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setShape("square")}>square</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize(size === "sm" ? "md" : size === "md" ? "lg" : "sm")}>
          size: {size}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setType("linear")}>linear</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setType("circle")}>circle</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setType("semi-circle")}>semi-circle</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setType("quarter-circle")}>quarter-circle</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setDirection("up")}>up</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setDirection("down")}>down</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setDirection("left")}>left</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setDirection("right")}>right</SgButton>
      </SgGrid>

      <div className="relative h-72 rounded border border-dashed border-border bg-muted/20">
        <SgFloatActionButton
          absolute
          position="right-bottom"
          severity={severity}
          shape={shape}
          size={size}
          icon={<Heart className="size-4" />}
          actions={actions}
          type={type}
          direction={direction}
          onClick={() => {}}
        />
      </div>
    </div>
  );
}`;

export default function SgFloatActionButtonPage() {
  const i18n = useShowcaseI18n();

  const actions: SgFABAction[] = [
    { icon: <UserPlusIcon />, label: t(i18n, "showcase.component.fab.labels.newUser"), onClick: () => console.log("new user") },
    { icon: <FilePlusIcon />, label: t(i18n, "showcase.component.fab.labels.newFile"), onClick: () => console.log("new file") },
    { icon: <FolderPlusIcon />, label: t(i18n, "showcase.component.fab.labels.newFolder"), onClick: () => console.log("new folder") },
  ];

  const actionsNoLabel: SgFABAction[] = actions.map(({ label: _, ...rest }) => rest);
  const fabPropsRows = React.useMemo<ShowcasePropRow[]>(
    () => [
      { prop: "icon / activeIcon", type: "ReactNode", defaultValue: "default / -", description: t(i18n, "showcase.component.fab.props.rows.iconActiveIcon") },
      { prop: "actions", type: "SgFABAction[]", defaultValue: "[]", description: t(i18n, "showcase.component.fab.props.rows.actions") },
      { prop: "type", type: "\"none\" | \"linear\" | \"circle\" | \"semi-circle\" | \"quarter-circle\"", defaultValue: "\"none\"", description: t(i18n, "showcase.component.fab.props.rows.type") },
      { prop: "direction", type: "\"up\" | \"down\" | \"left\" | \"right\"", defaultValue: "\"up\"", description: t(i18n, "showcase.component.fab.props.rows.direction") },
      { prop: "radius", type: "number", defaultValue: "96", description: t(i18n, "showcase.component.fab.props.rows.radius") },
      { prop: "severity / color", type: "token / string", defaultValue: "primary / -", description: t(i18n, "showcase.component.fab.props.rows.severityColor") },
      { prop: "shape", type: "\"circle\" | \"rounded\" | \"square\"", defaultValue: "\"circle\"", description: t(i18n, "showcase.component.fab.props.rows.shape") },
      { prop: "size", type: "\"sm\" | \"md\" | \"lg\"", defaultValue: "\"md\"", description: t(i18n, "showcase.component.fab.props.rows.size") },
      { prop: "position / absolute", type: "position token / boolean", defaultValue: "right-bottom / false", description: t(i18n, "showcase.component.fab.props.rows.positionAbsolute") },
      { prop: "elevation", type: "\"none\" | \"sm\" | \"md\" | \"lg\"", defaultValue: "\"md\"", description: t(i18n, "showcase.component.fab.props.rows.elevation") },
      { prop: "hint / hintPosition / hintDelay", type: "string / token / number", defaultValue: "- / top / 300", description: t(i18n, "showcase.component.fab.props.rows.hint") },
      { prop: "animation / animationOn", type: "token / \"hover\" | \"always\"", defaultValue: "scale / hover", description: t(i18n, "showcase.component.fab.props.rows.animation") },
      { prop: "disabled / loading", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.fab.props.rows.disabledLoading") },
      { prop: "enableDragDrop / dragId", type: "boolean / string", defaultValue: "false / -", description: t(i18n, "showcase.component.fab.props.rows.enableDragDropDragId") },
      { prop: "onClick", type: "() => void", defaultValue: "-", description: t(i18n, "showcase.component.fab.props.rows.onClick") }
    ],
    [i18n]
  );

  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) resizeObserver.observe(stickyHeaderRef.current);

    window.addEventListener("resize", updateAnchorOffset);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateAnchorOffset);
    };
  }, [i18n.locale]);

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

  const navigateToAnchor = React.useCallback((anchorId: string) => {
    const target = document.getElementById(anchorId);
    if (!target) return;

    const scrollContainer = findScrollContainer(target);
    const extraTopGap = 12;
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
  }, [findScrollContainer]);

  const handleAnchorClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToAnchor(anchorId);
  }, [navigateToAnchor]);

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

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.fab.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.fab.subtitle")}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(i18n, "showcase.common.examples")}</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {FAB_EXAMPLE_LINKS.map((example) => (
                <Link
                  key={example.id}
                  href={`#${example.id}`}
                  onClick={(event) => handleAnchorClick(event, example.id)}
                  className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
                >
                  {example.label}
                </Link>
              ))}
              <Link
                href="#props-reference"
                onClick={(event) => handleAnchorClick(event, "props-reference")}
                className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
              >
                {t(i18n, "showcase.component.fab.props.title")}
              </Link>
            </SgGrid>
          </div>
        </div>

      {/* â”€â”€ Positions â”€â”€ */}
      <Section
        id="exemplo-1"
        title={`1) ${t(i18n, "showcase.component.fab.sections.positions.title")}`}
        description={t(i18n, "showcase.component.fab.sections.positions.description")}
      >
        <DemoBox height="h-72">
          <SgFloatActionButton absolute position="left-top" size="sm" icon={<EditIcon />} onClick={() => {}} />
          <SgFloatActionButton absolute position="center-top" size="sm" severity="secondary" icon={<EditIcon />} onClick={() => {}} />
          <SgFloatActionButton absolute position="right-top" size="sm" severity="success" icon={<EditIcon />} onClick={() => {}} />
          <SgFloatActionButton absolute position="left-center" size="sm" severity="warning" icon={<EditIcon />} onClick={() => {}} />
          <SgFloatActionButton absolute position="right-center" size="sm" severity="danger" icon={<EditIcon />} onClick={() => {}} />
          <SgFloatActionButton absolute position="left-bottom" size="sm" icon={<EditIcon />} onClick={() => {}} />
          <SgFloatActionButton absolute position="center-bottom" size="sm" severity="secondary" icon={<EditIcon />} onClick={() => {}} />
          <SgFloatActionButton absolute position="right-bottom" size="sm" severity="success" icon={<EditIcon />} onClick={() => {}} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs text-muted-foreground">8 positions</span>
          </div>
        </DemoBox>
        <CodeBlock code={`<SgFloatActionButton position="left-top" size="sm" icon={<Edit />} onClick={handleClick} />
<SgFloatActionButton position="center-top" size="sm" severity="secondary" icon={<Edit />} onClick={handleClick} />
<SgFloatActionButton position="right-top" size="sm" severity="success" icon={<Edit />} onClick={handleClick} />
<SgFloatActionButton position="left-center" size="sm" severity="warning" icon={<Edit />} onClick={handleClick} />
<SgFloatActionButton position="right-center" size="sm" severity="danger" icon={<Edit />} onClick={handleClick} />
<SgFloatActionButton position="left-bottom" size="sm" icon={<Edit />} onClick={handleClick} />
<SgFloatActionButton position="center-bottom" size="sm" severity="secondary" icon={<Edit />} onClick={handleClick} />
<SgFloatActionButton position="right-bottom" size="sm" severity="success" icon={<Edit />} onClick={handleClick} />`} />
      </Section>

      {/* â”€â”€ Variants â”€â”€ */}
      <Section
        id="exemplo-2"
        title={`2) ${t(i18n, "showcase.component.fab.sections.variants.title")}`}
        description={t(i18n, "showcase.component.fab.sections.variants.description")}
      >
        <div className="flex gap-6 items-center flex-wrap">
          {(["primary", "secondary", "success", "info", "warning", "help", "danger", "plain"] as const).map((v) => (
            <div key={v} className="flex flex-col items-center gap-2">
              <SgFloatActionButton absolute={false} severity={v} onClick={() => {}} style={{ position: "relative" }} />
              <span className="text-xs text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
        <CodeBlock code={`<SgFloatActionButton severity="primary" />
<SgFloatActionButton severity="secondary" />
<SgFloatActionButton severity="success" />
<SgFloatActionButton severity="info" />
<SgFloatActionButton severity="warning" />
<SgFloatActionButton severity="help" />
<SgFloatActionButton severity="danger" />
<SgFloatActionButton severity="plain" />`} />
      </Section>

      {/* â”€â”€ Shapes & Sizes â”€â”€ */}
      <Section
        id="exemplo-3"
        title={`3) ${t(i18n, "showcase.component.fab.sections.shapesAndSizes.title")}`}
        description={t(i18n, "showcase.component.fab.sections.shapesAndSizes.description")}
      >
        <div className="grid grid-cols-3 gap-6 w-full">
          {(["circle", "rounded", "square"] as const).map((sh) => (
            <div key={sh} className="flex flex-col items-center gap-4">
              <span className="text-xs font-medium text-muted-foreground">{sh}</span>
              <div className="flex gap-4 items-center">
                {(["sm", "md", "lg"] as const).map((sz) => (
                  <SgFloatActionButton
                    key={sz}
                    shape={sh}
                    size={sz}
                    onClick={() => {}}
                    style={{ position: "relative" }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <CodeBlock code={`<SgFloatActionButton shape="circle" size="sm" />
<SgFloatActionButton shape="rounded" size="md" />
<SgFloatActionButton shape="square" size="lg" />`} />
      </Section>

      {/* â”€â”€ Elevation â”€â”€ */}
      <Section
        id="exemplo-4"
        title={`4) ${t(i18n, "showcase.component.fab.sections.elevation.title")}`}
        description={t(i18n, "showcase.component.fab.sections.elevation.description")}
      >
        <div className="flex gap-6 items-center flex-wrap">
          {(["none", "sm", "md", "lg"] as const).map((el) => (
            <div key={el} className="flex flex-col items-center gap-2">
              <SgFloatActionButton elevation={el} onClick={() => {}} style={{ position: "relative" }} />
              <span className="text-xs text-muted-foreground">{el}</span>
            </div>
          ))}
        </div>
        <CodeBlock code={`<SgFloatActionButton elevation="none" />
<SgFloatActionButton elevation="sm" />
<SgFloatActionButton elevation="md" />
<SgFloatActionButton elevation="lg" />`} />
      </Section>

      {/* â”€â”€ Hint â”€â”€ */}
      <Section
        id="exemplo-5"
        title={`5) ${t(i18n, "showcase.component.fab.sections.hint.title")}`}
        description={t(i18n, "showcase.component.fab.sections.hint.description")}
      >
        <div className="flex gap-8 items-center flex-wrap py-4">
          {(["top", "right", "bottom", "left"] as const).map((hp) => (
            <div key={hp} className="flex flex-col items-center gap-2">
              <SgFloatActionButton
                hint={t(i18n, "showcase.component.fab.labels.addNew")}
                hintPosition={hp}
                hintDelay={0}
                onClick={() => {}}
                style={{ position: "relative" }}
              />
              <span className="text-xs text-muted-foreground">hintPosition=&quot;{hp}&quot;</span>
            </div>
          ))}
        </div>
        <CodeBlock code={`<SgFloatActionButton
  hint="Add new"
  hintPosition="top"
  hintDelay={300}
  onClick={handleClick}
/>`} />
      </Section>

      {/* â”€â”€ Actions - Linear Layout â”€â”€ */}
      <Section
        id="exemplo-6"
        title={`6) ${t(i18n, "showcase.component.fab.sections.actions.title")}`}
        description={t(i18n, "showcase.component.fab.sections.actions.description")}
      >
        <div className="grid grid-cols-2 gap-8 w-full">
          <DemoBox height="h-72" className="flex items-end justify-center">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;linear&quot; direction=&quot;up&quot;</p>
            <SgFloatActionButton absolute position="center-bottom" actions={actions} type="linear" direction="up" />
          </DemoBox>
          <DemoBox height="h-72" className="flex items-start justify-center">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;linear&quot; direction=&quot;down&quot;</p>
            <SgFloatActionButton absolute position="center-top" actions={actions} type="linear" direction="down" />
          </DemoBox>
          <DemoBox height="h-24" className="flex items-center justify-end pt-14">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;linear&quot; direction=&quot;left&quot;</p>
            <SgFloatActionButton absolute position="right-center" actions={actionsNoLabel} type="linear" direction="left" />
          </DemoBox>
          <DemoBox height="h-24" className="flex items-center justify-start pt-14">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;linear&quot; direction=&quot;right&quot;</p>
            <SgFloatActionButton absolute position="left-center" actions={actionsNoLabel} type="linear" direction="right" />
          </DemoBox>
        </div>
        <CodeBlock code={`const actions = [
  { icon: <UserPlus />, label: "New user", onClick: () => {} },
  { icon: <FilePlus />, label: "New file", onClick: () => {} },
  { icon: <FolderPlus />, label: "New folder", onClick: () => {} },
];

<SgFloatActionButton actions={actions} type="linear" direction="up" />
<SgFloatActionButton actions={actions} type="linear" direction="down" />
<SgFloatActionButton actions={actions} type="linear" direction="left" />
<SgFloatActionButton actions={actions} type="linear" direction="right" />`} />
      </Section>

      {/* â”€â”€ Circle Layout â”€â”€ */}
      <Section
        id="exemplo-7"
        title="7) Circle Layout"
        description="Actions arranged in a full circle around the button"
      >
        <DemoBox height="h-96" className="flex items-center justify-center">
          <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;circle&quot;</p>
          <SgFloatActionButton
            absolute
            position="center-top"
            actions={[...actions, ...actions, { icon: <EditIcon />, label: "Edit", onClick: () => {} }]}
            type="circle"
            radius={120}
            severity="secondary"
          />
        </DemoBox>
        <CodeBlock code={`<SgFloatActionButton
  actions={actions}
  type="circle"
  radius={120}
  severity="secondary"
/>`} />
      </Section>

      {/* â”€â”€ Semi-Circle Layout â”€â”€ */}
      <Section
        id="exemplo-8"
        title="8) Semi-Circle Layout"
        description="Actions arranged in a semi-circle (180Â°) in different directions"
      >
        <div className="grid grid-cols-2 gap-8 w-full">
          <DemoBox height="h-72" className="flex items-end justify-center">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;semi-circle&quot; direction=&quot;up&quot;</p>
            <SgFloatActionButton
              absolute
              position="center-bottom"
              actions={[...actions, { icon: <EditIcon />, label: "Edit", onClick: () => {} }, { icon: <StarIcon />, label: "Star", onClick: () => {} }]}
              type="semi-circle"
              direction="up"
              severity="success"
            />
          </DemoBox>
          <DemoBox height="h-72" className="flex items-start justify-center">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;semi-circle&quot; direction=&quot;down&quot;</p>
            <SgFloatActionButton
              absolute
              position="center-top"
              actions={[...actions, { icon: <EditIcon />, label: "Edit", onClick: () => {} }, { icon: <StarIcon />, label: "Star", onClick: () => {} }]}
              type="semi-circle"
              direction="down"
              severity="warning"
            />
          </DemoBox>
          <DemoBox height="h-48" className="flex items-center justify-end">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;semi-circle&quot; direction=&quot;left&quot;</p>
            <SgFloatActionButton
              absolute
              position="right-center"
              actions={actionsNoLabel}
              type="semi-circle"
              direction="left"
              severity="danger"
            />
          </DemoBox>
          <DemoBox height="h-48" className="flex items-center justify-start">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;semi-circle&quot; direction=&quot;right&quot;</p>
            <SgFloatActionButton
              absolute
              position="left-center"
              actions={actionsNoLabel}
              type="semi-circle"
              direction="right"
            />
          </DemoBox>
        </div>
        <CodeBlock code={`<SgFloatActionButton
  actions={actions}
  type="semi-circle"
  direction="up"
  severity="success"
/>
<SgFloatActionButton
  actions={actions}
  type="semi-circle"
  direction="down"
  severity="warning"
/>
<SgFloatActionButton
  actions={actions}
  type="semi-circle"
  direction="left"
  severity="danger"
/>
<SgFloatActionButton
  actions={actions}
  type="semi-circle"
  direction="right"
/>`} />
      </Section>

      {/* â”€â”€ Quarter-Circle Layout â”€â”€ */}
      <Section
        id="exemplo-9"
        title="9) Quarter-Circle Layout"
        description="Actions arranged in a quarter circle (90Â°) in different directions"
      >
        <div className="grid grid-cols-2 gap-8 w-full">
          <DemoBox height="h-64" className="flex items-end justify-center">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;quarter-circle&quot; direction=&quot;up&quot;</p>
            <SgFloatActionButton
              absolute
              position="center-bottom"
              actions={actions}
              type="quarter-circle"
              direction="up"
              severity="secondary"
            />
          </DemoBox>
          <DemoBox height="h-64" className="flex items-start justify-center">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;quarter-circle&quot; direction=&quot;down&quot;</p>
            <SgFloatActionButton
              absolute
              position="center-top"
              actions={actions}
              type="quarter-circle"
              direction="down"
              severity="success"
            />
          </DemoBox>
          <DemoBox height="h-48" className="flex items-center justify-end">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;quarter-circle&quot; direction=&quot;left&quot;</p>
            <SgFloatActionButton
              absolute
              position="right-center"
              actions={actionsNoLabel}
              type="quarter-circle"
              direction="left"
              severity="warning"
            />
          </DemoBox>
          <DemoBox height="h-48" className="flex items-center justify-start">
            <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">type=&quot;quarter-circle&quot; direction=&quot;right&quot;</p>
            <SgFloatActionButton
              absolute
              position="left-center"
              actions={actionsNoLabel}
              type="quarter-circle"
              direction="right"
              severity="danger"
            />
          </DemoBox>
        </div>
        <CodeBlock code={`<SgFloatActionButton
  actions={actions}
  type="quarter-circle"
  direction="up"
  severity="secondary"
/>
<SgFloatActionButton
  actions={actions}
  type="quarter-circle"
  direction="down"
  severity="success"
/>
<SgFloatActionButton
  actions={actions}
  type="quarter-circle"
  direction="left"
  severity="warning"
/>
<SgFloatActionButton
  actions={actions}
  type="quarter-circle"
  direction="right"
  severity="danger"
/>`} />
      </Section>

      {/* â”€â”€ Active Icon â”€â”€ */}
      <Section
        id="exemplo-10"
        title="10) Active Icon"
        description="Show a different icon when the menu is open"
      >
        <DemoBox height="h-72" className="flex items-end justify-center">
          <p className="absolute top-2 left-3 text-xs text-muted-foreground font-medium">activeIcon changes when open</p>
          <SgFloatActionButton
            absolute
            position="center-bottom"
            actions={actions}
            type="semi-circle"
            direction="up"
            activeIcon={<SettingsIcon />}
            severity="secondary"
          />
        </DemoBox>
        <CodeBlock code={`<SgFloatActionButton
  actions={actions}
  activeIcon={<Settings />}
  type="semi-circle"
  direction="up"
  severity="secondary"
/>`} />
      </Section>

      {/* â”€â”€ Animations â”€â”€ */}
      <Section
        id="exemplo-11"
        title={`11) ${t(i18n, "showcase.component.fab.sections.animations.title")}`}
        description={t(i18n, "showcase.component.fab.sections.animations.description")}
      >
        <div className="flex gap-6 items-center flex-wrap">
          {(["scale", "fade", "rotate", "slide", "pulse", "none"] as const).map((anim) => {
            const animationOn = "hover";
            return (
            <div key={anim} className="flex flex-col items-center gap-2">
              <SgFloatActionButton
                animation={anim}
                animationOn={animationOn}
                icon={<HeartIcon />}
                severity="danger"
                size="sm"
                onClick={() => {}}
                style={{ position: "relative" }}
              />
              <span className="text-xs text-muted-foreground">{anim}</span>
            </div>
          )})}
        </div>
        <CodeBlock code={`<SgFloatActionButton animation="scale" animationOn="hover" severity="danger" />
<SgFloatActionButton animation="fade" animationOn="hover" severity="danger" />
<SgFloatActionButton animation="slide" animationOn="hover" severity="danger" />
<SgFloatActionButton animation="rotate" animationOn="hover" severity="danger" />
<SgFloatActionButton animation="pulse" animationOn="hover" severity="danger" />`} />
      </Section>

      {/* â”€â”€ Custom Color â”€â”€ */}
      <Section
        id="exemplo-12"
        title={`12) ${t(i18n, "showcase.component.fab.sections.customColor.title")}`}
        description={t(i18n, "showcase.component.fab.sections.customColor.description")}
      >
        <div className="flex gap-6 items-center flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <SgFloatActionButton color="#8b5cf6" icon={<StarIcon />} onClick={() => {}} style={{ position: "relative" }} />
            <span className="text-xs text-muted-foreground">#8b5cf6</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SgFloatActionButton color="#ec4899" icon={<HeartIcon />} onClick={() => {}} style={{ position: "relative" }} />
            <span className="text-xs text-muted-foreground">#ec4899</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SgFloatActionButton color="#f97316" icon={<SettingsIcon />} onClick={() => {}} style={{ position: "relative" }} />
            <span className="text-xs text-muted-foreground">#f97316</span>
          </div>
        </div>
        <CodeBlock code={`<SgFloatActionButton color="#8b5cf6" icon={<Star />} />
<SgFloatActionButton color="#ec4899" icon={<Heart />} />
<SgFloatActionButton color="#f97316" icon={<Settings />} />`} />
      </Section>

      {/* â”€â”€ Disabled & Loading â”€â”€ */}
      <Section
        id="exemplo-13"
        title={`13) ${t(i18n, "showcase.component.fab.sections.disabled.title")}`}
        description={t(i18n, "showcase.component.fab.sections.disabled.description")}
      >
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-center gap-2">
            <SgFloatActionButton disabled onClick={() => {}} style={{ position: "relative" }} />
            <span className="text-xs text-muted-foreground">disabled</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SgFloatActionButton loading onClick={() => {}} style={{ position: "relative" }} />
            <span className="text-xs text-muted-foreground">loading</span>
          </div>
        </div>
        <CodeBlock code={`<SgFloatActionButton disabled />
<SgFloatActionButton loading />`} />
      </Section>

      {/* â”€â”€ Drag & Drop â”€â”€ */}
      <Section
        id="exemplo-14"
        title={`14) ${t(i18n, "showcase.component.fab.sections.dragDrop.title")}`}
        description={t(i18n, "showcase.component.fab.sections.dragDrop.description")}
      >
        <DemoBox height="h-64" className="flex items-center justify-center">
          <SgFloatActionButton
            enableDragDrop
            dragId="showcase-fab-drag"
            actions={actions}
            type="linear"
            direction="up"
            severity="info"
            absolute
            position="right-bottom"
          />
        </DemoBox>
        <CodeBlock code={`<SgFloatActionButton
  enableDragDrop
  dragId="showcase-fab-drag"
  actions={actions}
  type="linear"
  direction="up"
  severity="info"
  absolute
  position="right-bottom"
/>`} />
      </Section>

      <Section
        id="exemplo-15"
        title={`15) ${t(i18n, "showcase.component.fab.sections.playground.title")}`}
        description={t(i18n, "showcase.common.playground.description.withComponent", { component: "SgFloatActionButton" })}
      >
        <SgPlayground
          title="SgFloatActionButton Playground"
          interactive
          codeContract="appFile"
          code={FAB_PLAYGROUND_CODE}
          height={700}
          defaultOpen
        />
      </Section>

      <ShowcasePropsReference
        id="props-reference"
        title={t(i18n, "showcase.component.fab.props.title")}
        rows={fabPropsRows}
      />

      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


