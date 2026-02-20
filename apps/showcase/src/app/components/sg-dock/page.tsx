"use client";

import React from "react";
import { SgDock, SgPlayground, SgButton, toast, type SgDockItem } from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import {
  Home,
  Mail,
  Bell,
  Settings,
  User,
  Search,
  Heart,
  MessageSquare,
  Calendar,
  Star,
  Bookmark,
  Image,
  FileText,
  Download,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";

function Section(props: {
  title: string;
  description?: string;
  children: React.ReactNode;
  showDock?: boolean;
  onToggleDock?: () => void;
}) {
  return (
    <section className="rounded-lg border border-border p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{props.title}</h2>
          {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
        </div>
        {props.onToggleDock && (
          <SgButton
            onClick={props.onToggleDock}
            size="sm"
            variant={props.showDock ? "default" : "outline"}
          >
            {props.showDock ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show
              </>
            )}
          </SgButton>
        )}
      </div>
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { code: string }) {
  return <CodeBlockBase code={props.code} />;
}

const DOCK_PLAYGROUND_APP_FILE = `import * as React from "react";
import { SgDock } from "@seedgrid/fe-components";
import { Home, Mail, Bell, Settings, User } from "lucide-react";

export default function App() {
  const [position, setPosition] = React.useState<
    "left-top" | "left-center" | "left-bottom" |
    "center-top" | "center-bottom" |
    "right-top" | "right-center" | "right-bottom"
  >("center-bottom");
  const [itemSize, setItemSize] = React.useState(48);
  const [gap, setGap] = React.useState(8);
  const [borderRadius, setBorderRadius] = React.useState(16);
  const [elevation, setElevation] = React.useState<"none" | "sm" | "md" | "lg">("lg");
  const [showLabels, setShowLabels] = React.useState(true);
  const [magnify, setMagnify] = React.useState(true);
  const [magnifyScale, setMagnifyScale] = React.useState(1.5);
  const [enableDragDrop, setEnableDragDrop] = React.useState(false);
  const [lastAction, setLastAction] = React.useState("none");

  const items = [
    { id: "home", icon: <Home size={22} />, label: "Home", onClick: () => setLastAction("Home clicked") },
    { id: "mail", icon: <Mail size={22} />, label: "Mail", badge: 5, onClick: () => setLastAction("Mail clicked") },
    { id: "alerts", icon: <Bell size={22} />, label: "Alerts", badge: 2, onClick: () => setLastAction("Alerts clicked") },
    { id: "settings", icon: <Settings size={22} />, label: "Settings", onClick: () => setLastAction("Settings clicked") },
    { id: "profile", icon: <User size={22} />, label: "Profile", onClick: () => setLastAction("Profile clicked") }
  ];

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs">
          <span className="mb-1 block font-medium">position</span>
          <select value={position} onChange={(e) => setPosition(e.target.value as typeof position)} className="w-full rounded border border-slate-300 px-2 py-1">
            <option value="left-top">left-top</option>
            <option value="center-top">center-top</option>
            <option value="right-top">right-top</option>
            <option value="left-center">left-center</option>
            <option value="right-center">right-center</option>
            <option value="left-bottom">left-bottom</option>
            <option value="center-bottom">center-bottom</option>
            <option value="right-bottom">right-bottom</option>
          </select>
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">itemSize: {itemSize}px</span>
          <input type="range" min={32} max={80} value={itemSize} onChange={(e) => setItemSize(Number(e.target.value))} className="w-full" />
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">gap: {gap}px</span>
          <input type="range" min={0} max={24} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full" />
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">borderRadius: {borderRadius}px</span>
          <input type="range" min={0} max={40} value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full" />
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">elevation</span>
          <select value={elevation} onChange={(e) => setElevation(e.target.value as "none" | "sm" | "md" | "lg")} className="w-full rounded border border-slate-300 px-2 py-1">
            <option value="none">none</option>
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </label>

        <label className="text-xs">
          <span className="mb-1 block font-medium">magnifyScale: {magnifyScale.toFixed(1)}</span>
          <input type="range" min={1} max={2.5} step={0.1} value={magnifyScale} onChange={(e) => setMagnifyScale(Number(e.target.value))} className="w-full" />
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 text-xs">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
          showLabels
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={magnify} onChange={(e) => setMagnify(e.target.checked)} />
          magnify
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={enableDragDrop} onChange={(e) => setEnableDragDrop(e.target.checked)} />
          enableDragDrop
        </label>
      </div>

      <div className="rounded border border-border bg-muted/30 px-3 py-2 text-xs">
        Last action: <strong>{lastAction}</strong>
      </div>

      <div className="relative h-96 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <p className="absolute left-1/2 top-4 -translate-x-1/2 text-xs text-muted-foreground">
          Preview area
        </p>
        <SgDock
          id="playground-dock"
          dragId={enableDragDrop ? "playground-drag" : undefined}
          items={items}
          position={position}
          itemSize={itemSize}
          gap={gap}
          borderRadius={borderRadius}
          elevation={elevation}
          showLabels={showLabels}
          magnify={magnify}
          magnifyScale={magnifyScale}
          enableDragDrop={enableDragDrop}
          zIndex={10}
        />
      </div>
    </div>
  );
}
`;

export default function SgDockPage() {
  const [eventLog, setEventLog] = React.useState<string[]>([]);

  // Show/hide states for each example
  const [showBasic, setShowBasic] = React.useState(false);
  const [showPositions, setShowPositions] = React.useState(false);
  const [showDragDrop, setShowDragDrop] = React.useState(false);
  const [showNoMagnify, setShowNoMagnify] = React.useState(false);
  const [showNoLabels, setShowNoLabels] = React.useState(false);
  const [showCustom, setShowCustom] = React.useState(false);
  const [showManyItems, setShowManyItems] = React.useState(false);
  const [showCallbacks, setShowCallbacks] = React.useState(false);
  const [showDisabled, setShowDisabled] = React.useState(false);

  const log = (msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  // Sample dock items
  const basicItems: SgDockItem[] = [
    {
      id: "home",
      icon: <Home size={24} />,
      label: "Home",
      onClick: () => toast.info("Home clicked")
    },
    {
      id: "mail",
      icon: <Mail size={24} />,
      label: "Mail",
      badge: 5,
      onClick: () => toast.info("Mail clicked")
    },
    {
      id: "notifications",
      icon: <Bell size={24} />,
      label: "Notifications",
      badge: 12,
      onClick: () => toast.info("Notifications clicked")
    },
    {
      id: "settings",
      icon: <Settings size={24} />,
      label: "Settings",
      onClick: () => toast.info("Settings clicked")
    },
    {
      id: "profile",
      icon: <User size={24} />,
      label: "Profile",
      onClick: () => toast.info("Profile clicked")
    }
  ];

  const extendedItems: SgDockItem[] = [
    {
      id: "search",
      icon: <Search size={22} />,
      label: "Search",
      onClick: () => log("Search clicked")
    },
    {
      id: "favorites",
      icon: <Heart size={22} />,
      label: "Favorites",
      badge: 3,
      onClick: () => log("Favorites clicked")
    },
    {
      id: "messages",
      icon: <MessageSquare size={22} />,
      label: "Messages",
      badge: "99+",
      onClick: () => log("Messages clicked")
    },
    {
      id: "calendar",
      icon: <Calendar size={22} />,
      label: "Calendar",
      onClick: () => log("Calendar clicked")
    },
    {
      id: "starred",
      icon: <Star size={22} />,
      label: "Starred",
      onClick: () => log("Starred clicked")
    },
    {
      id: "bookmarks",
      icon: <Bookmark size={22} />,
      label: "Bookmarks",
      onClick: () => log("Bookmarks clicked")
    },
    {
      id: "gallery",
      icon: <Image size={22} />,
      label: "Gallery",
      onClick: () => log("Gallery clicked")
    },
    {
      id: "documents",
      icon: <FileText size={22} />,
      label: "Documents",
      onClick: () => log("Documents clicked")
    }
  ];

  const disabledItems: SgDockItem[] = basicItems.map((item, index) =>
    index === 2 ? { ...item, disabled: true } : item
  );

  return (
    <div className="max-w-7xl space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-bold">SgDock</h1>
        <p className="mt-2 text-muted-foreground">
          Um componente de dock/menu estilo macOS com suporte a drag & drop, tooltips, badges e efeito de magnificação.
        </p>
      </div>

      {/* Basic Example */}
      <Section
        title="Básico"
        description="Dock simples na parte inferior central da tela"
        showDock={showBasic}
        onToggleDock={() => setShowBasic(!showBasic)}
      >
        <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {showBasic ? "O dock aparecerá na parte inferior central desta área" : "Clique em 'Show' para exibir o dock"}
          </p>
          {showBasic && (
            <SgDock
              id="basic-dock"
              items={basicItems}
              position="center-bottom"
              zIndex={10}
            />
          )}
        </div>
        <CodeBlock
          code={`const items: SgDockItem[] = [
  {
    id: "home",
    icon: <Home size={24} />,
    label: "Home",
    onClick: () => toast.info("Home clicked")
  },
  {
    id: "mail",
    icon: <Mail size={24} />,
    label: "Mail",
    badge: 5,
    onClick: () => toast.info("Mail clicked")
  },
  // ... more items
];

<SgDock
  items={items}
  position="center-bottom"
/>`}
        />
      </Section>

      {/* All Positions */}
      <Section
        title="Todas as Posições"
        description="O dock pode ser posicionado em 8 locais diferentes da tela"
        showDock={showPositions}
        onToggleDock={() => setShowPositions(!showPositions)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Top Row */}
            <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
              <p className="absolute left-1/2 top-4 -translate-x-1/2 text-xs text-muted-foreground">left-top</p>
              {showPositions && (
                <SgDock
                  id="dock-left-top"
                  items={basicItems.slice(0, 3)}
                  position="left-top"
                  itemSize={36}
                  gap={4}
                  zIndex={10}
                />
              )}
            </div>
            <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
              <p className="absolute left-1/2 top-4 -translate-x-1/2 text-xs text-muted-foreground">center-top</p>
              {showPositions && (
                <SgDock
                  id="dock-center-top"
                  items={basicItems.slice(0, 3)}
                  position="center-top"
                  itemSize={36}
                  gap={4}
                  zIndex={10}
                />
              )}
            </div>
            <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
              <p className="absolute left-1/2 top-4 -translate-x-1/2 text-xs text-muted-foreground">right-top</p>
              {showPositions && (
                <SgDock
                  id="dock-right-top"
                  items={basicItems.slice(0, 3)}
                  position="right-top"
                  itemSize={36}
                  gap={4}
                  zIndex={10}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Middle Row */}
            <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">left-center</p>
              {showPositions && (
                <SgDock
                  id="dock-left-center"
                  items={basicItems.slice(0, 3)}
                  position="left-center"
                  itemSize={36}
                  gap={4}
                  zIndex={10}
                />
              )}
            </div>
            <div className="h-48" />
            <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">right-center</p>
              {showPositions && (
                <SgDock
                  id="dock-right-center"
                  items={basicItems.slice(0, 3)}
                  position="right-center"
                  itemSize={36}
                  gap={4}
                  zIndex={10}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Bottom Row */}
            <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">left-bottom</p>
              {showPositions && (
                <SgDock
                  id="dock-left-bottom"
                  items={basicItems.slice(0, 3)}
                  position="left-bottom"
                  itemSize={36}
                  gap={4}
                  zIndex={10}
                />
              )}
            </div>
            <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">center-bottom</p>
              {showPositions && (
                <SgDock
                  id="dock-center-bottom"
                  items={basicItems.slice(0, 3)}
                  position="center-bottom"
                  itemSize={36}
                  gap={4}
                  zIndex={10}
                />
              )}
            </div>
            <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">right-bottom</p>
              {showPositions && (
                <SgDock
                  id="dock-right-bottom"
                  items={basicItems.slice(0, 3)}
                  position="right-bottom"
                  itemSize={36}
                  gap={4}
                  zIndex={10}
                />
              )}
            </div>
          </div>
        </div>
        <CodeBlock
          code={`<SgDock items={items} position="left-top" />
<SgDock items={items} position="center-top" />
<SgDock items={items} position="right-top" />
<SgDock items={items} position="left-center" />
<SgDock items={items} position="right-center" />
<SgDock items={items} position="left-bottom" />
<SgDock items={items} position="center-bottom" />
<SgDock items={items} position="right-bottom" />`}
        />
      </Section>

      {/* With Drag & Drop */}
      <Section
        title="Com Drag & Drop"
        description="Arraste o dock para reposicioná-lo. Clique com botão direito para resetar a posição."
        showDock={showDragDrop}
        onToggleDock={() => setShowDragDrop(!showDragDrop)}
      >
        <div className="relative h-96 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <div className="absolute left-1/2 top-8 -translate-x-1/2 rounded-lg bg-primary/10 px-4 py-2 text-center">
            <p className="text-sm font-medium text-primary">
              {showDragDrop ? "⬆️ Arraste o dock abaixo para mover" : "Clique em 'Show' para exibir"}
            </p>
            {showDragDrop && (
              <p className="mt-1 text-xs text-muted-foreground">
                Clique com botão direito para resetar
              </p>
            )}
          </div>
          {showDragDrop && (
            <SgDock
              id="draggable-dock"
              dragId="demo-draggable"
              items={basicItems}
              position="center-bottom"
              enableDragDrop
              zIndex={10}
            />
          )}
        </div>
        <CodeBlock
          code={`<SgDock
  items={items}
  position="center-bottom"
  enableDragDrop
  dragId="my-dock"
/>`}
        />
      </Section>

      {/* Without Magnify */}
      <Section
        title="Sem Efeito de Magnificação"
        description="Dock sem o efeito de zoom ao passar o mouse"
        showDock={showNoMagnify}
        onToggleDock={() => setShowNoMagnify(!showNoMagnify)}
      >
        <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {showNoMagnify ? "Passe o mouse para notar a ausência do efeito de zoom" : "Clique em 'Show' para exibir"}
          </p>
          {showNoMagnify && (
            <SgDock
              id="no-magnify-dock"
              items={basicItems}
              position="center-bottom"
              magnify={false}
              zIndex={10}
            />
          )}
        </div>
        <CodeBlock
          code={`<SgDock
  items={items}
  position="center-bottom"
  magnify={false}
/>`}
        />
      </Section>

      {/* Without Labels */}
      <Section
        title="Sem Labels"
        description="Dock sem tooltips ao passar o mouse"
        showDock={showNoLabels}
        onToggleDock={() => setShowNoLabels(!showNoLabels)}
      >
        <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {showNoLabels ? "Passe o mouse - não há tooltips" : "Clique em 'Show' para exibir"}
          </p>
          {showNoLabels && (
            <SgDock
              id="no-labels-dock"
              items={basicItems}
              position="center-bottom"
              showLabels={false}
              zIndex={10}
            />
          )}
        </div>
        <CodeBlock
          code={`<SgDock
  items={items}
  position="center-bottom"
  showLabels={false}
/>`}
        />
      </Section>

      {/* Custom Styling */}
      <Section
        title="Estilização Customizada"
        description="Dock com cores, tamanhos e bordas personalizadas"
        showDock={showCustom}
        onToggleDock={() => setShowCustom(!showCustom)}
      >
        <div className="space-y-4">
          <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
            <p className="absolute left-1/2 top-4 -translate-x-1/2 text-xs text-muted-foreground">
              Grande, arredondado
            </p>
            {showCustom && (
              <SgDock
                id="custom-dock-1"
                items={basicItems.slice(0, 4)}
                position="center-bottom"
                itemSize={64}
                gap={12}
                borderRadius={32}
                backgroundColor="rgba(59, 130, 246, 0.95)"
                zIndex={10}
              />
            )}
          </div>
          <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
            <p className="absolute left-1/2 top-4 -translate-x-1/2 text-xs text-muted-foreground">
              Pequeno, quadrado
            </p>
            {showCustom && (
              <SgDock
                id="custom-dock-2"
                items={basicItems.slice(0, 4)}
                position="center-bottom"
                itemSize={36}
                gap={4}
                borderRadius={6}
                backgroundColor="rgba(34, 197, 94, 0.95)"
                elevation="sm"
                zIndex={10}
              />
            )}
          </div>
        </div>
        <CodeBlock
          code={`<SgDock
  items={items}
  position="center-bottom"
  itemSize={64}
  gap={12}
  borderRadius={32}
  backgroundColor="rgba(59, 130, 246, 0.95)"
/>

<SgDock
  items={items}
  position="center-bottom"
  itemSize={36}
  gap={4}
  borderRadius={6}
  backgroundColor="rgba(34, 197, 94, 0.95)"
  elevation="sm"
/>`}
        />
      </Section>

      {/* Many Items */}
      <Section
        title="Muitos Items"
        description="Dock com vários items e scroll overflow"
        showDock={showManyItems}
        onToggleDock={() => setShowManyItems(!showManyItems)}
      >
        <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {showManyItems ? "Dock com 8 items" : "Clique em 'Show' para exibir"}
          </p>
          {showManyItems && (
            <SgDock
              id="many-items-dock"
              items={extendedItems}
              position="center-bottom"
              itemSize={44}
              gap={6}
              zIndex={10}
            />
          )}
        </div>
        <CodeBlock
          code={`const manyItems: SgDockItem[] = [
  { id: "search", icon: <Search />, label: "Search", onClick: () => {} },
  { id: "favorites", icon: <Heart />, label: "Favorites", badge: 3, onClick: () => {} },
  { id: "messages", icon: <MessageSquare />, label: "Messages", badge: "99+", onClick: () => {} },
  // ... 8 items total
];

<SgDock
  items={manyItems}
  position="center-bottom"
/>`}
        />
      </Section>

      {/* With Callbacks */}
      <Section
        title="Com Callbacks"
        description="Dock com logs de eventos ao clicar nos items"
        showDock={showCallbacks}
        onToggleDock={() => setShowCallbacks(!showCallbacks)}
      >
        <div className="space-y-4">
          <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {showCallbacks ? "Clique nos items para ver os logs" : "Clique em 'Show' para exibir"}
            </p>
            {showCallbacks && (
              <SgDock
                id="callback-dock"
                items={extendedItems.slice(0, 6).map(item => ({
                  ...item,
                  onClick: () => {
                    log(`${item.label} clicked`);
                    item.onClick?.();
                  }
                }))}
                position="center-bottom"
                zIndex={10}
              />
            )}
          </div>
          <div className="h-40 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">
                Clique nos items do dock para ver os eventos...
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
        <CodeBlock
          code={`const items: SgDockItem[] = [
  {
    id: "search",
    icon: <Search size={22} />,
    label: "Search",
    onClick: () => {
      log("Search clicked");
      // Your custom logic
    }
  },
  // ... more items
];

<SgDock items={items} position="center-bottom" />`}
        />
      </Section>

      {/* Disabled Items */}
      <Section
        title="Items Desabilitados"
        description="Alguns items podem estar desabilitados"
        showDock={showDisabled}
        onToggleDock={() => setShowDisabled(!showDisabled)}
      >
        <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {showDisabled ? "O terceiro item (Notifications) está desabilitado" : "Clique em 'Show' para exibir"}
          </p>
          {showDisabled && (
            <SgDock
              id="disabled-dock"
              items={disabledItems}
              position="center-bottom"
              zIndex={10}
            />
          )}
        </div>
        <CodeBlock
          code={`const items: SgDockItem[] = [
  { id: "home", icon: <Home />, label: "Home", onClick: () => {} },
  { id: "mail", icon: <Mail />, label: "Mail", onClick: () => {} },
  { id: "notifications", icon: <Bell />, label: "Notifications", disabled: true, onClick: () => {} },
  { id: "settings", icon: <Settings />, label: "Settings", onClick: () => {} },
];

<SgDock items={items} position="center-bottom" />`}
        />
      </Section>

      {/* Playground */}
      <Section
        title="🎮 Playground Interativo"
        description="Experimente diferentes configurações do dock em tempo real"
      >
        <SgPlayground
          title="SgDock Playground"
          interactive
          codeContract="appFile"
          code={DOCK_PLAYGROUND_APP_FILE}
          height={700}
          defaultOpen
        />
      </Section>

      {/* Props Reference */}
      <section className="rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Referência de Props</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">Prop</th>
                <th className="pb-2 pr-4 font-semibold">Tipo</th>
                <th className="pb-2 pr-4 font-semibold">Padrão</th>
                <th className="pb-2 font-semibold">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">id</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Identificador único do dock</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">items</td>
                <td className="py-2 pr-4">SgDockItem[]</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Array de items a exibir no dock (obrigatório)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">position</td>
                <td className="py-2 pr-4">SgDockPosition</td>
                <td className="py-2 pr-4">&quot;center-bottom&quot;</td>
                <td className="py-2">Posição do dock na tela</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">enableDragDrop</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">false</td>
                <td className="py-2">Habilita drag & drop para reposicionar</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">dragId</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">ID para persistir a posição do drag (necessário se enableDragDrop=true)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">offset</td>
                <td className="py-2 pr-4">{"{ x?: number; y?: number }"}</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Offset adicional da borda em pixels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">itemSize</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">48</td>
                <td className="py-2">Tamanho de cada item em pixels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">gap</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">8</td>
                <td className="py-2">Espaçamento entre items em pixels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">backgroundColor</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">&quot;rgba(255, 255, 255, 0.95)&quot;</td>
                <td className="py-2">Cor de fundo do dock</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">showLabels</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Mostra tooltips ao passar o mouse</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">magnify</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Ativa efeito de magnificação ao hover</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">magnifyScale</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">1.5</td>
                <td className="py-2">Escala da magnificação</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">borderRadius</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">16</td>
                <td className="py-2">Border radius do container em pixels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">elevation</td>
                <td className="py-2 pr-4">&quot;none&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</td>
                <td className="py-2 pr-4">&quot;lg&quot;</td>
                <td className="py-2">Nível de sombra</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">zIndex</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">50</td>
                <td className="py-2">Z-index do dock</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">className</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Classe CSS customizada para o container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">itemClassName</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Classe CSS customizada para os items</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-base font-semibold">SgDockItem</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-semibold">Propriedade</th>
                <th className="pb-2 pr-4 font-semibold">Tipo</th>
                <th className="pb-2 font-semibold">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">id</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2">Identificador único (obrigatório)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">icon</td>
                <td className="py-2 pr-4">ReactNode</td>
                <td className="py-2">Ícone a exibir (obrigatório)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">label</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2">Texto do tooltip (obrigatório)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">onClick</td>
                <td className="py-2 pr-4">() =&gt; void</td>
                <td className="py-2">Callback ao clicar no item</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">disabled</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2">Item desabilitado</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">badge</td>
                <td className="py-2 pr-4">string | number</td>
                <td className="py-2">Badge/contador a exibir</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">className</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2">Classe CSS customizada</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
