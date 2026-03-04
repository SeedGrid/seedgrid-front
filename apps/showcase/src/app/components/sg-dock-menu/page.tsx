"use client";

import * as React from "react";
import {
  SgButton,
  SgDockMenu,
  SgGrid,
  SgPlayground,
  toast,
  type SgDockMenuItem
} from "@seedgrid/fe-components";
import CodeBlockBase from "../CodeBlockBase";
import I18NReady from "../I18NReady";
import { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";
import {
  Bell,
  Bookmark,
  Calendar,
  FileText,
  Heart,
  Home,
  Image,
  Mail,
  MessageSquare,
  Search,
  Settings,
  Star,
  User
} from "lucide-react";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

const BASIC_CODE = `import * as React from "react";
import { Bell, Home, Mail, Settings, User } from "lucide-react";
import { SgDockMenu, toast, type SgDockMenuItem } from "@seedgrid/fe-components";

const items: SgDockMenuItem[] = [
  { id: "home", icon: <Home size={24} />, label: "Home", onClick: () => toast.info("Home clicked") },
  { id: "mail", icon: <Mail size={24} />, label: "Mail", badge: 5, onClick: () => toast.info("Mail clicked") },
  { id: "notifications", icon: <Bell size={24} />, label: "Notifications", badge: 12, onClick: () => toast.info("Notifications clicked") },
  { id: "settings", icon: <Settings size={24} />, label: "Settings", onClick: () => toast.info("Settings clicked") },
  { id: "profile", icon: <User size={24} />, label: "Profile", onClick: () => toast.info("Profile clicked") }
];

export default function Example() {
  return (
    <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
      <SgDockMenu id="basic-dock" items={items} position="center-bottom" zIndex={10} style={{ position: "absolute" }} />
    </div>
  );
}`;

const EXTERNAL_BADGE_CODE = `import * as React from "react";
import { Bell, Home, Mail, Settings, User } from "lucide-react";
import { SgButton, SgDockMenu, SgGrid, toast, type SgDockMenuItem } from "@seedgrid/fe-components";

export default function Example() {
  const [badges, setBadges] = React.useState({ mail: 5, notifications: 12 });

  const items: SgDockMenuItem[] = [
    { id: "home", icon: <Home size={24} />, label: "Home", onClick: () => toast.info("Home clicked") },
    { id: "mail", icon: <Mail size={24} />, label: "Mail", badge: badges.mail, onClick: () => toast.info("Mail clicked") },
    { id: "notifications", icon: <Bell size={24} />, label: "Notifications", badge: badges.notifications, onClick: () => toast.info("Notifications clicked") },
    { id: "settings", icon: <Settings size={24} />, label: "Settings", onClick: () => toast.info("Settings clicked") },
    { id: "profile", icon: <User size={24} />, label: "Profile", onClick: () => toast.info("Profile clicked") }
  ];

  return (
    <div className="space-y-3">
      <SgGrid columns={{ base: 2, sm: 4 }} gap={8}>
        <SgButton type="button" size="sm" appearance="outline" onClick={() => setBadges((p) => ({ ...p, mail: p.mail + 1 }))}>+1 Mail</SgButton>
        <SgButton type="button" size="sm" appearance="outline" onClick={() => setBadges((p) => ({ ...p, notifications: p.notifications + 1 }))}>+1 Notifications</SgButton>
        <SgButton type="button" size="sm" appearance="outline" onClick={() => setBadges((p) => ({ ...p, mail: Math.max(0, p.mail - 1) }))}>-1 Mail</SgButton>
        <SgButton type="button" size="sm" appearance="outline" onClick={() => setBadges({ mail: 0, notifications: 0 })}>Reset</SgButton>
      </SgGrid>

      <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <SgDockMenu
          id="external-badge-dock"
          items={items}
          position="center-bottom"
          zIndex={10}
          style={{ position: "absolute" }}
        />
      </div>
    </div>
  );
}`;

const ANCHORED_IN_AREA_CODE = `import * as React from "react";
import { Home, Mail, Settings } from "lucide-react";
import { SgDockMenu, type SgDockMenuItem } from "@seedgrid/fe-components";

const items: SgDockMenuItem[] = [
  { id: "home", icon: <Home size={22} />, label: "Home" },
  { id: "mail", icon: <Mail size={22} />, label: "Mail" },
  { id: "settings", icon: <Settings size={22} />, label: "Settings" }
];

export default function Example() {
  return (
    <div className="relative h-56 rounded-lg border-2 border-dashed border-border bg-muted/20">
      <SgDockMenu
        id="dock-anchored"
        items={items}
        position="center-bottom"
        style={{ position: "absolute" }}
        zIndex={10}
      />
    </div>
  );
}`;

const POSITIONS_CODE = `import * as React from "react";
import { Bell, Home, Mail } from "lucide-react";
import { SgDockMenu, type SgDockMenuItem } from "@seedgrid/fe-components";

const items: SgDockMenuItem[] = [
  { id: "home", icon: <Home size={22} />, label: "Home" },
  { id: "mail", icon: <Mail size={22} />, label: "Mail", badge: 5 },
  { id: "notifications", icon: <Bell size={22} />, label: "Notifications", badge: 12 }
];

export default function Example() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-left-top" items={items} position="left-top" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
      <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-center-top" items={items} position="center-top" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
      <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-right-top" items={items} position="right-top" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
      <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-left-center" items={items} position="left-center" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
      <div className="h-40" />
      <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-right-center" items={items} position="right-center" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
      <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-left-bottom" items={items} position="left-bottom" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
      <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-center-bottom" items={items} position="center-bottom" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
      <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-right-bottom" items={items} position="right-bottom" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
    </div>
  );
}`;

const DRAG_DROP_CODE = `import * as React from "react";
import { Bell, Home, Mail, Settings, User } from "lucide-react";
import { SgDockMenu, type SgDockMenuItem } from "@seedgrid/fe-components";

const items: SgDockMenuItem[] = [
  { id: "home", icon: <Home size={24} />, label: "Home" },
  { id: "mail", icon: <Mail size={24} />, label: "Mail", badge: 5 },
  { id: "notifications", icon: <Bell size={24} />, label: "Notifications", badge: 12 },
  { id: "settings", icon: <Settings size={24} />, label: "Settings" },
  { id: "profile", icon: <User size={24} />, label: "Profile" }
];

export default function Example() {
  return (
    <div className="relative h-80 rounded-lg border-2 border-dashed border-border bg-muted/20">
      <SgDockMenu
        id="draggable-dock"
        dragId="demo-dockmenu-draggable"
        items={items}
        position="center-bottom"
        enableDragDrop
        zIndex={10} style={{ position: "absolute" }}
      />
    </div>
  );
}`;

const VARIANTS_CODE = `import * as React from "react";
import { Bell, Home, Mail, Settings } from "lucide-react";
import { SgDockMenu, type SgDockMenuItem } from "@seedgrid/fe-components";

const items: SgDockMenuItem[] = [
  { id: "home", icon: <Home size={22} />, label: "Home" },
  { id: "mail", icon: <Mail size={22} />, label: "Mail", badge: 5 },
  { id: "notifications", icon: <Bell size={22} />, label: "Notifications", badge: 12 },
  { id: "settings", icon: <Settings size={22} />, label: "Settings" }
];

export default function Example() {
  return (
    <div className="space-y-4">
      <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <SgDockMenu id="dock-no-magnify" items={items} position="center-bottom" magnify={false} zIndex={10} style={{ position: "absolute" }} />
      </div>
      <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <SgDockMenu id="dock-no-labels" items={items} position="center-bottom" showLabels={false} zIndex={10} style={{ position: "absolute" }} />
      </div>
      <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <SgDockMenu
          id="dock-custom"
          items={items}
          position="center-bottom"
          itemSize={58}
          gap={10}
          borderRadius={28}
          backgroundColor="rgba(59, 130, 246, 0.95)"
          zIndex={10} style={{ position: "absolute" }}
        />
      </div>
    </div>
  );
}`;

const MANY_ITEMS_CODE = `import * as React from "react";
import { Bookmark, Calendar, FileText, Heart, Image, MessageSquare, Search, Star } from "lucide-react";
import { SgDockMenu, type SgDockMenuItem } from "@seedgrid/fe-components";

const items: SgDockMenuItem[] = [
  { id: "search", icon: <Search size={22} />, label: "Search" },
  { id: "favorites", icon: <Heart size={22} />, label: "Favorites", badge: 3 },
  { id: "messages", icon: <MessageSquare size={22} />, label: "Messages", badge: "99+" },
  { id: "calendar", icon: <Calendar size={22} />, label: "Calendar" },
  { id: "starred", icon: <Star size={22} />, label: "Starred" },
  { id: "bookmarks", icon: <Bookmark size={22} />, label: "Bookmarks" },
  { id: "gallery", icon: <Image size={22} />, label: "Gallery" },
  { id: "documents", icon: <FileText size={22} />, label: "Documents" }
];

export default function Example() {
  return (
    <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
      <SgDockMenu id="many-items-dock" items={items} position="center-bottom" itemSize={44} gap={10} zIndex={10} style={{ position: "absolute" }} />
    </div>
  );
}`;

const CALLBACKS_AND_DISABLED_CODE = `import * as React from "react";
import { Bell, Bookmark, Calendar, FileText, Heart, Home, Image, Mail, MessageSquare, Search, Settings, Star, User } from "lucide-react";
import { SgDockMenu, type SgDockMenuItem } from "@seedgrid/fe-components";

export default function Example() {
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const log = (msg: string) => setEventLog((prev) => [msg, ...prev].slice(0, 10));

  const callbackItems: SgDockMenuItem[] = [
    { id: "search", icon: <Search size={22} />, label: "Search" },
    { id: "favorites", icon: <Heart size={22} />, label: "Favorites", badge: 3 },
    { id: "messages", icon: <MessageSquare size={22} />, label: "Messages", badge: "99+" },
    { id: "calendar", icon: <Calendar size={22} />, label: "Calendar" },
    { id: "starred", icon: <Star size={22} />, label: "Starred" },
    { id: "bookmarks", icon: <Bookmark size={22} />, label: "Bookmarks" },
    { id: "gallery", icon: <Image size={22} />, label: "Gallery" },
    { id: "documents", icon: <FileText size={22} />, label: "Documents" }
  ].slice(0, 6).map((item) => ({ ...item, onClick: () => log(item.label + " clicked") }));

  const disabledItems: SgDockMenuItem[] = [
    { id: "home", icon: <Home size={24} />, label: "Home" },
    { id: "mail", icon: <Mail size={24} />, label: "Mail", badge: 5 },
    { id: "notifications", icon: <Bell size={24} />, label: "Notifications", badge: 12, disabled: true },
    { id: "settings", icon: <Settings size={24} />, label: "Settings" },
    { id: "profile", icon: <User size={24} />, label: "Profile" }
  ];

  return (
    <div className="space-y-4">
      <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <SgDockMenu id="callback-dock" items={callbackItems} position="center-bottom" zIndex={10} style={{ position: "absolute" }} />
      </div>
      <div className="h-32 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
        {eventLog.map((entry, idx) => <div key={idx}>{entry}</div>)}
      </div>
      <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <SgDockMenu id="disabled-dock" items={disabledItems} position="center-bottom" zIndex={10} style={{ position: "absolute" }} />
      </div>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import { Bell, Home, Mail, Settings, User } from "lucide-react";
import { SgDockMenu, type SgDockMenuPosition } from "@seedgrid/fe-components";

export default function App() {
  const [position, setPosition] = React.useState<SgDockMenuPosition>("center-bottom");
  const [itemSize, setItemSize] = React.useState(48);
  const [gap, setGap] = React.useState(12);
  const [showLabels, setShowLabels] = React.useState(true);
  const [magnify, setMagnify] = React.useState(true);
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
          <select value={position} onChange={(e) => setPosition(e.target.value as SgDockMenuPosition)} className="w-full rounded border border-slate-300 px-2 py-1">
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
      </div>

      <div className="grid gap-2 text-xs sm:grid-cols-3">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />showLabels</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={magnify} onChange={(e) => setMagnify(e.target.checked)} />magnify</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={enableDragDrop} onChange={(e) => setEnableDragDrop(e.target.checked)} />enableDragDrop</label>
      </div>

      <div className="rounded border border-border bg-muted/30 px-3 py-2 text-xs">
        Last action: <strong>{lastAction}</strong>
      </div>

      <div className="relative h-96 rounded-lg border-2 border-dashed border-border bg-muted/20">
        <SgDockMenu
          id="playground-dock"
          dragId={enableDragDrop ? "playground-drag" : undefined}
          items={items}
          position={position}
          itemSize={itemSize}
          gap={gap}
          showLabels={showLabels}
          magnify={magnify}
          enableDragDrop={enableDragDrop}
          zIndex={10} style={{ position: "absolute" }}
        />
      </div>
    </div>
  );
}`;

type DockMenuTexts = {
  headerSubtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  section3Title: string;
  section3Description: string;
  section4Title: string;
  section4Description: string;
  section5Title: string;
  section5Description: string;
  section6Title: string;
  section6Description: string;
  section7Title: string;
  section7Description: string;
  section8Title: string;
  section8Description: string;
  section9Title: string;
  section9Description: string;
  logsEmpty: string;
  clickSuffix: string;
  propsTitle: string;
  propsColProp: string;
  propsColType: string;
  propsColDefault: string;
  propsColDescription: string;
  propDescId: string;
  propDescItems: string;
  propDescPosition: string;
  propDescDrag: string;
  propDescSizeGap: string;
  propDescLabels: string;
  propDescStyle: string;
  propDescOffset: string;
  propDescClassName: string;
};

const DOCK_MENU_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", DockMenuTexts> = {
  "pt-BR": {
    headerSubtitle: "Dock estilo macOS com posicoes, drag and drop, badges, labels e magnify.",
    section1Title: "1) Como prender dentro da area",
    section1Description:
      'Para ficar dentro do preview, use container com "relative" e no dock passe style={{ position: "absolute" }}.',
    section2Title: "2) Basico",
    section2Description: "Default dock at bottom center with clickable items.",
    section3Title: "3) Badge externo",
    section3Description: "Atualize o badge por estado externo e reflita no dock em tempo real.",
    section4Title: "4) Todas as posicoes",
    section4Description: "Exibe as 8 posicoes suportadas em uma grade.",
    section5Title: "5) Drag and drop",
    section5Description: "Allows dragging and saving dock position.",
    section6Title: "6) Variantes visuais",
    section6Description: "Sem magnify, sem labels e com estilo customizado.",
    section7Title: "7) Muitos itens",
    section7Description: "Example with a larger item list.",
    section8Title: "8) Callbacks e disabled",
    section8Description: "Click logs and disabled item in the same example.",
    section9Title: "9) Playground (SgPlayground)",
    section9Description: "Simulacao interativa das props principais.",
    logsEmpty: "Clique em um item para gerar logs...",
    clickSuffix: "clicked",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description",
    propDescId: "Identificador do dock.",
    propDescItems: "Itens exibidos no menu.",
    propDescPosition: "Dock position in container.",
    propDescDrag: "Enables drag and drop with persistence.",
    propDescSizeGap: "Tamanho dos itens e espaco entre eles.",
    propDescLabels: "Controla rotulos e efeito de ampliacao.",
    propDescStyle: "Ajustes visuais do dock.",
    propDescOffset: "Distancia da borda e camada de empilhamento.",
    propDescClassName: "Customizacao de estilos."
  },
  "pt-PT": {
    headerSubtitle: "Dock estilo macOS com posicoes, drag and drop, badges, labels e magnify.",
    section1Title: "1) Como prender dentro da area",
    section1Description:
      'Para ficar dentro do preview, use container com "relative" e no dock passe style={{ position: "absolute" }}.',
    section2Title: "2) Basico",
    section2Description: "Default dock at bottom center with clickable items.",
    section3Title: "3) Badge externo",
    section3Description: "Atualize o badge por estado externo e reflita no dock em tempo real.",
    section4Title: "4) Todas as posicoes",
    section4Description: "Exibe as 8 posicoes suportadas em uma grade.",
    section5Title: "5) Drag and drop",
    section5Description: "Allows dragging and saving dock position.",
    section6Title: "6) Variantes visuais",
    section6Description: "Sem magnify, sem labels e com estilo customizado.",
    section7Title: "7) Muitos itens",
    section7Description: "Example with a larger item list.",
    section8Title: "8) Callbacks e disabled",
    section8Description: "Click logs and disabled item in the same example.",
    section9Title: "9) Playground (SgPlayground)",
    section9Description: "Simulacao interativa das props principais.",
    logsEmpty: "Clique em um item para gerar logs...",
    clickSuffix: "clicked",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Description",
    propDescId: "Identificador do dock.",
    propDescItems: "Itens exibidos no menu.",
    propDescPosition: "Dock position in container.",
    propDescDrag: "Enables drag and drop with persistence.",
    propDescSizeGap: "Tamanho dos itens e espaco entre eles.",
    propDescLabels: "Controla rotulos e efeito de ampliacao.",
    propDescStyle: "Ajustes visuais do dock.",
    propDescOffset: "Distancia da borda e camada de empilhamento.",
    propDescClassName: "Customizacao de estilos."
  },
  "en-US": {
    headerSubtitle: "macOS-style dock with positions, drag and drop, badges, labels, and magnify.",
    section1Title: "1) How to keep it inside the area",
    section1Description:
      'To keep it inside preview, use a "relative" container and pass style={{ position: "absolute" }} to the dock.',
    section2Title: "2) Basic",
    section2Description: "Default dock at bottom-center with clickable items.",
    section3Title: "3) External badge",
    section3Description: "Update badge from external state and reflect it in real time.",
    section4Title: "4) All positions",
    section4Description: "Shows the 8 supported positions in a grid.",
    section5Title: "5) Drag and drop",
    section5Description: "Allows dragging and persisting dock position.",
    section6Title: "6) Visual variants",
    section6Description: "No magnify, no labels, and a custom style.",
    section7Title: "7) Many items",
    section7Description: "Example with a larger list of items.",
    section8Title: "8) Callbacks and disabled",
    section8Description: "Click logs and a disabled item in the same example.",
    section9Title: "9) Playground (SgPlayground)",
    section9Description: "Interactive simulation of main props.",
    logsEmpty: "Click an item to generate logs...",
    clickSuffix: "clicked",
    propsTitle: "Props Reference",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description",
    propDescId: "Dock identifier.",
    propDescItems: "Items rendered in the menu.",
    propDescPosition: "Dock position inside the container.",
    propDescDrag: "Enables drag and drop with persistence.",
    propDescSizeGap: "Item size and spacing between items.",
    propDescLabels: "Controls labels and magnify effect.",
    propDescStyle: "Dock visual style settings.",
    propDescOffset: "Distance from edge and stacking layer.",
    propDescClassName: "Style customization hooks."
  },
  es: {
    headerSubtitle: "Dock estilo macOS con posiciones, drag and drop, badges, labels y magnify.",
    section1Title: "1) Como fijarlo dentro del area",
    section1Description:
      'Para mantenerlo dentro del preview, usa contenedor con "relative" y en el dock pasa style={{ position: "absolute" }}.',
    section2Title: "2) Basico",
    section2Description: "Dock por defecto en el centro inferior con items clicables.",
    section3Title: "3) Badge externo",
    section3Description: "Actualiza el badge por estado externo y reflejalo en tiempo real.",
    section4Title: "4) Todas las posiciones",
    section4Description: "Muestra las 8 posiciones soportadas en una grilla.",
    section5Title: "5) Drag and drop",
    section5Description: "Permite arrastrar y guardar la posicion del dock.",
    section6Title: "6) Variantes visuales",
    section6Description: "No magnify, no labels, and custom style.",
    section7Title: "7) Muchos items",
    section7Description: "Ejemplo con lista mayor de items.",
    section8Title: "8) Callbacks y disabled",
    section8Description: "Logs de click e item deshabilitado en el mismo ejemplo.",
    section9Title: "9) Playground (SgPlayground)",
    section9Description: "Simulacion interactiva de las props principales.",
    logsEmpty: "Haz click en un item para generar logs...",
    clickSuffix: "clicked",
    propsTitle: "Referencia de Props",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Por defecto",
    propsColDescription: "Descripcion",
    propDescId: "Identificador del dock.",
    propDescItems: "Items mostrados en el menu.",
    propDescPosition: "Posicion del dock en el contenedor.",
    propDescDrag: "Activa drag and drop con persistencia.",
    propDescSizeGap: "Tamano de items y espacio entre ellos.",
    propDescLabels: "Controla labels y efecto de ampliacion.",
    propDescStyle: "Ajustes visuales del dock.",
    propDescOffset: "Distancia al borde y capa de apilamiento.",
    propDescClassName: "Style customization."
  }
};

type SupportedDockMenuLocale = keyof typeof DOCK_MENU_TEXTS;

function isSupportedDockMenuLocale(locale: ShowcaseLocale): locale is SupportedDockMenuLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getDockMenuTexts(locale: ShowcaseLocale): DockMenuTexts {
  const normalized: SupportedDockMenuLocale = isSupportedDockMenuLocale(locale) ? locale : "en-US";
  return DOCK_MENU_TEXTS[normalized];
}

function getDockMenuProps(texts: DockMenuTexts): ShowcasePropRow[] {
  return [
    { prop: "id", type: "string", defaultValue: "-", description: texts.propDescId },
    { prop: "items", type: "SgDockMenuItem[]", defaultValue: "[]", description: texts.propDescItems },
    {
      prop: "position",
      type: "SgDockMenuPosition",
      defaultValue: "center-bottom",
      description: texts.propDescPosition
    },
    {
      prop: "enableDragDrop / dragId",
      type: "boolean / string",
      defaultValue: "false / -",
      description: texts.propDescDrag
    },
    { prop: "itemSize / gap", type: "number", defaultValue: "48 / 12", description: texts.propDescSizeGap },
    {
      prop: "showLabels / magnify / magnifyScale",
      type: "boolean / boolean / number",
      defaultValue: "true / true / 1.35",
      description: texts.propDescLabels
    },
    {
      prop: "backgroundColor / borderRadius / elevation",
      type: "string / number / token",
      defaultValue: "- / auto / md",
      description: texts.propDescStyle
    },
    { prop: "offset / zIndex", type: "number / number", defaultValue: "16 / 10", description: texts.propDescOffset },
    {
      prop: "className / itemClassName / style",
      type: "string / string / CSSProperties",
      defaultValue: "- / - / -",
      description: texts.propDescClassName
    }
  ];
}

export default function SgDockMenuPage() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => getDockMenuTexts(i18n.locale), [i18n.locale]);
  const dockMenuProps = React.useMemo(() => getDockMenuProps(texts), [texts]);
  const [eventLog, setEventLog] = React.useState<string[]>([]);
  const [externalBadges, setExternalBadges] = React.useState({ mail: 5, notifications: 12 });
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const basicItems: SgDockMenuItem[] = [
    { id: "home", icon: <Home size={24} />, label: "Home", onClick: () => toast.info("Home clicked") },
    { id: "mail", icon: <Mail size={24} />, label: "Mail", badge: 5, onClick: () => toast.info("Mail clicked") },
    { id: "notifications", icon: <Bell size={24} />, label: "Notifications", badge: 12, onClick: () => toast.info("Notifications clicked") },
    { id: "settings", icon: <Settings size={24} />, label: "Settings", onClick: () => toast.info("Settings clicked") },
    { id: "profile", icon: <User size={24} />, label: "Profile", onClick: () => toast.info("Profile clicked") }
  ];

  const positionItems = basicItems.slice(0, 3);

  const manyItems: SgDockMenuItem[] = [
    { id: "search", icon: <Search size={22} />, label: "Search" },
    { id: "favorites", icon: <Heart size={22} />, label: "Favorites", badge: 3 },
    { id: "messages", icon: <MessageSquare size={22} />, label: "Messages", badge: "99+" },
    { id: "calendar", icon: <Calendar size={22} />, label: "Calendar" },
    { id: "starred", icon: <Star size={22} />, label: "Starred" },
    { id: "bookmarks", icon: <Bookmark size={22} />, label: "Bookmarks" },
    { id: "gallery", icon: <Image size={22} />, label: "Gallery" },
    { id: "documents", icon: <FileText size={22} />, label: "Documents" }
  ];

  const callbackItems: SgDockMenuItem[] = manyItems.slice(0, 6).map((item) => ({
    ...item,
    onClick: () =>
      setEventLog((prev) => [`[${new Date().toLocaleTimeString(i18n.locale)}] ${item.label} ${texts.clickSuffix}`, ...prev].slice(0, 10))
  }));

  const disabledItems: SgDockMenuItem[] = basicItems.map((item, index) =>
    index === 2 ? { ...item, disabled: true } : item
  );

  const externalBadgeItems: SgDockMenuItem[] = [
    { id: "home", icon: <Home size={24} />, label: "Home", onClick: () => toast.info("Home clicked") },
    { id: "mail", icon: <Mail size={24} />, label: "Mail", badge: externalBadges.mail, onClick: () => toast.info("Mail clicked") },
    { id: "notifications", icon: <Bell size={24} />, label: "Notifications", badge: externalBadges.notifications, onClick: () => toast.info("Notifications clicked") },
    { id: "settings", icon: <Settings size={24} />, label: "Settings", onClick: () => toast.info("Settings clicked") },
    { id: "profile", icon: <User size={24} />, label: "Profile", onClick: () => toast.info("Profile clicked") }
  ];

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-7xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgDockMenu"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={texts.section1Title}
        description={texts.section1Description}
      >
        <div className="relative h-56 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <SgDockMenu
            id="dock-anchored"
            items={basicItems.slice(0, 3)}
            position="center-bottom"
            zIndex={10}
            style={{ position: "absolute" }}
          />
        </div>
        <CodeBlockBase code={ANCHORED_IN_AREA_CODE} />
      </Section>

      <Section title={texts.section2Title} description={texts.section2Description}>
        <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <SgDockMenu id="basic-dock" items={basicItems} position="center-bottom" zIndex={10} style={{ position: "absolute" }} />
        </div>
        <CodeBlockBase code={BASIC_CODE} />
      </Section>

      <Section title={texts.section3Title} description={texts.section3Description}>
        <SgGrid columns={{ base: 2, sm: 4 }} gap={8}>
          <SgButton
            type="button"
            size="sm"
            appearance="outline"
            onClick={() => setExternalBadges((p) => ({ ...p, mail: p.mail + 1 }))}
          >
            +1 Mail
          </SgButton>
          <SgButton
            type="button"
            size="sm"
            appearance="outline"
            onClick={() => setExternalBadges((p) => ({ ...p, notifications: p.notifications + 1 }))}
          >
            +1 Notifications
          </SgButton>
          <SgButton
            type="button"
            size="sm"
            appearance="outline"
            onClick={() => setExternalBadges((p) => ({ ...p, mail: Math.max(0, p.mail - 1) }))}
          >
            -1 Mail
          </SgButton>
          <SgButton
            type="button"
            size="sm"
            appearance="outline"
            onClick={() => setExternalBadges({ mail: 0, notifications: 0 })}
          >
            Reset
          </SgButton>
        </SgGrid>
        <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <SgDockMenu
            id="external-badge-dock"
            items={externalBadgeItems}
            position="center-bottom"
            zIndex={10}
            style={{ position: "absolute" }}
          />
        </div>
        <CodeBlockBase code={EXTERNAL_BADGE_CODE} />
      </Section>

      <Section title={texts.section4Title} description={texts.section4Description}>
        <div className="grid grid-cols-3 gap-4">
          <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-left-top" items={positionItems} position="left-top" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
          <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-center-top" items={positionItems} position="center-top" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
          <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-right-top" items={positionItems} position="right-top" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
          <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-left-center" items={positionItems} position="left-center" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
          <div className="h-40" />
          <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-right-center" items={positionItems} position="right-center" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
          <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-left-bottom" items={positionItems} position="left-bottom" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
          <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-center-bottom" items={positionItems} position="center-bottom" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
          <div className="relative h-40 rounded-lg border-2 border-dashed border-border bg-muted/20"><SgDockMenu id="dock-right-bottom" items={positionItems} position="right-bottom" itemSize={36} gap={8} zIndex={10} style={{ position: "absolute" }} /></div>
        </div>
        <CodeBlockBase code={POSITIONS_CODE} />
      </Section>

      <Section title={texts.section5Title} description={texts.section5Description}>
        <div className="relative h-80 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <SgDockMenu
            id="draggable-dock"
            dragId="demo-dockmenu-draggable"
            items={basicItems}
            position="center-bottom"
            enableDragDrop
            zIndex={10} style={{ position: "absolute" }}
          />
        </div>
        <CodeBlockBase code={DRAG_DROP_CODE} />
      </Section>

      <Section title={texts.section6Title} description={texts.section6Description}>
        <div className="space-y-4">
          <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
            <SgDockMenu id="dock-no-magnify" items={basicItems.slice(0, 4)} position="center-bottom" magnify={false} zIndex={10} style={{ position: "absolute" }} />
          </div>
          <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
            <SgDockMenu id="dock-no-labels" items={basicItems.slice(0, 4)} position="center-bottom" showLabels={false} zIndex={10} style={{ position: "absolute" }} />
          </div>
          <div className="relative h-48 rounded-lg border-2 border-dashed border-border bg-muted/20">
            <SgDockMenu
              id="dock-custom"
              items={basicItems.slice(0, 4)}
              position="center-bottom"
              itemSize={58}
              gap={10}
              borderRadius={28}
              backgroundColor="rgba(59, 130, 246, 0.95)"
              zIndex={10} style={{ position: "absolute" }}
            />
          </div>
        </div>
        <CodeBlockBase code={VARIANTS_CODE} />
      </Section>

      <Section title={texts.section7Title} description={texts.section7Description}>
        <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
          <SgDockMenu id="many-items-dock" items={manyItems} position="center-bottom" itemSize={44} gap={10} zIndex={10} style={{ position: "absolute" }} />
        </div>
        <CodeBlockBase code={MANY_ITEMS_CODE} />
      </Section>

      <Section title={texts.section8Title} description={texts.section8Description}>
        <div className="space-y-4">
          <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
            <SgDockMenu id="callback-dock" items={callbackItems} position="center-bottom" zIndex={10} style={{ position: "absolute" }} />
          </div>
          <div className="h-32 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
            {eventLog.length === 0 ? (
              <span className="text-muted-foreground">{texts.logsEmpty}</span>
            ) : (
              eventLog.map((entry, idx) => <div key={idx}>{entry}</div>)
            )}
          </div>
          <div className="relative h-64 rounded-lg border-2 border-dashed border-border bg-muted/20">
            <SgDockMenu id="disabled-dock" items={disabledItems} position="center-bottom" zIndex={10} style={{ position: "absolute" }} />
          </div>
        </div>
        <CodeBlockBase code={CALLBACKS_AND_DISABLED_CODE} />
      </Section>

      <Section title={texts.section9Title} description={texts.section9Description}>
        <SgPlayground
          title="SgDockMenu Playground"
          interactive
          codeContract="appFile"
          code={PLAYGROUND_CODE}
          height={700}
          defaultOpen
        />
      </Section>

        <section
          id="props-reference"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">{texts.propsTitle}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-semibold">{texts.propsColProp}</th>
                  <th className="pb-2 pr-4 font-semibold">{texts.propsColType}</th>
                  <th className="pb-2 pr-4 font-semibold">{texts.propsColDefault}</th>
                  <th className="pb-2 font-semibold">{texts.propsColDescription}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dockMenuProps.map((row) => (
                  <tr key={row.prop}>
                    <td className="py-2 pr-4 font-mono text-xs">{row.prop}</td>
                    <td className="py-2 pr-4">{row.type}</td>
                    <td className="py-2 pr-4">{row.defaultValue}</td>
                    <td className="py-2">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

