"use client";

import React from "react";
import { SgFloatActionButton, type SgFABAction } from "@seedgrid/fe-components";
import SgCodeBlockBase from "../others/SgCodeBlockBase";
import { t, useShowcaseI18n } from "../../../i18n";

import { loadSample } from "./samples/loadSample";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <SgCodeBlockBase code={props.code} />;
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

export default function SgFloatActionButtonPage() {
  const i18n = useShowcaseI18n();

  const actions: SgFABAction[] = [
    { icon: <UserPlusIcon />, label: t(i18n, "showcase.component.fab.labels.newUser"), onClick: () => console.log("new user") },
    { icon: <FilePlusIcon />, label: t(i18n, "showcase.component.fab.labels.newFile"), onClick: () => console.log("new file") },
    { icon: <FolderPlusIcon />, label: t(i18n, "showcase.component.fab.labels.newFolder"), onClick: () => console.log("new folder") },
  ];

  const actionsNoLabel: SgFABAction[] = actions.map(({ label: _, ...rest }) => rest);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.fab.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.fab.subtitle")}</p>
      </div>

      {/* â”€â”€ Positions â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.fab.sections.positions.title")}
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
        <CodeBlock code={loadSample("sg-float-action-button-example-01.src")} />
      </Section>

      {/* â”€â”€ Variants â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.fab.sections.variants.title")}
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
        <CodeBlock code={loadSample("sg-float-action-button-example-02.src")} />
      </Section>

      {/* â”€â”€ Shapes & Sizes â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.fab.sections.shapesAndSizes.title")}
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
        <CodeBlock code={loadSample("sg-float-action-button-example-03.src")} />
      </Section>

      {/* â”€â”€ Elevation â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.fab.sections.elevation.title")}
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
        <CodeBlock code={loadSample("sg-float-action-button-example-04.src")} />
      </Section>

      {/* â”€â”€ Hint â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.fab.sections.hint.title")}
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
        <CodeBlock code={loadSample("sg-float-action-button-example-05.src")} />
      </Section>

      {/* â”€â”€ Actions - Linear Layout â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.fab.sections.actions.title")}
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
        <CodeBlock code={loadSample("sg-float-action-button-example-06.src")} />
      </Section>

      {/* â”€â”€ Circle Layout â”€â”€ */}
      <Section
        title="Circle Layout"
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
        <CodeBlock code={loadSample("sg-float-action-button-example-07.src")} />
      </Section>

      {/* â”€â”€ Semi-Circle Layout â”€â”€ */}
      <Section
        title="Semi-Circle Layout"
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
        <CodeBlock code={loadSample("sg-float-action-button-example-08.src")} />
      </Section>

      {/* â”€â”€ Quarter-Circle Layout â”€â”€ */}
      <Section
        title="Quarter-Circle Layout"
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
        <CodeBlock code={loadSample("sg-float-action-button-example-09.src")} />
      </Section>

      {/* â”€â”€ Active Icon â”€â”€ */}
      <Section
        title="Active Icon"
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
        <CodeBlock code={loadSample("sg-float-action-button-example-10.src")} />
      </Section>

      {/* â”€â”€ Animations â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.fab.sections.animations.title")}
        description={t(i18n, "showcase.component.fab.sections.animations.description")}
      >
        <div className="flex gap-6 items-center flex-wrap">
          {(["scale", "fade", "rotate", "slide", "pulse", "none"] as const).map((anim) => {
            const animationOn = anim === "fade" || anim === "slide" ? "mount" : "hover";
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
        <CodeBlock code={loadSample("sg-float-action-button-example-11.src")} />
      </Section>

      {/* â”€â”€ Custom Color â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.fab.sections.customColor.title")}
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
        <CodeBlock code={loadSample("sg-float-action-button-example-12.src")} />
      </Section>

      {/* â”€â”€ Disabled & Loading â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.fab.sections.disabled.title")}
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
        <CodeBlock code={loadSample("sg-float-action-button-example-13.src")} />
      </Section>

      {/* â”€â”€ Drag & Drop â”€â”€ */}
      <Section
        title={t(i18n, "showcase.component.fab.sections.dragDrop.title")}
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
        <CodeBlock code={loadSample("sg-float-action-button-example-14.src")} />
      </Section>
    </div>
  );
}


