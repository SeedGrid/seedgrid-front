import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return {
      extend() {
        return {
          configure() {
            return this;
          }
        };
      }
    };
  }

  return originalLoad.call(this, request, parent, isMain);
};

const {
  SgButton,
  SgSplitButton,
  SgFloatActionButton,
  SgMenu,
  SgCard,
  SgToolBar,
  SgCarousel,
  SgExpandablePanel,
  SgTreeView,
  SgDockMenu,
  SgBreadcrumb,
  SgPageControl,
  SgPageControlPage,
  SgComponentsI18nProvider,
  buildFabStorageKey,
  parseStoredFabDragPosition,
  buildDockMenuStorageKey,
  buildDockMenuLayout,
  buildDockMenuItemMotion,
  buildDockMenuLabelStyle,
  buildDockMenuContainerStyle,
  buildDockMenuContextMenuState,
  buildToolbarLayoutState,
  buildToolbarStorageKey,
  parseStoredPanelDragPosition
} = require("../dist/sandbox.cjs");

Module._load = originalLoad;

function renderWithLocale(locale, element) {
  return renderToStaticMarkup(
    React.createElement(SgComponentsI18nProvider, { locale }, element)
  );
}

test("SgButton renders disabled state and visible label", () => {
  const html = renderToStaticMarkup(
    React.createElement(SgButton, { label: "Save", disabled: true })
  );

  assert.match(html, /<button/);
  assert.match(html, /disabled=""/);
  assert.match(html, />Save</);
});

test("SgSplitButton exposes a translated toggle aria-label", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgSplitButton, {
      label: "Actions",
      items: [{ label: "Archive" }]
    })
  );

  assert.match(html, /aria-haspopup="menu"/);
  assert.match(html, /aria-label="Ouvrir la liste"/);
});

test("SgFloatActionButton exposes a translated default aria-label", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgFloatActionButton, {
      actions: [{ label: "Archive", icon: React.createElement("span", null, "A") }]
    })
  );

  assert.match(html, /aria-label="Ouvrir"/);
  assert.match(html, /aria-expanded="false"/);
});

test("SgMenu uses the locale default aria-label and still allows explicit override", () => {
  const menu = [{ id: "home", label: "Home", url: "/" }];

  const translatedHtml = renderWithLocale(
    "es",
    React.createElement(SgMenu, { menu, menuStyle: "inline" })
  );
  const overriddenHtml = renderToStaticMarkup(
    React.createElement(SgMenu, { menu, menuStyle: "inline", ariaLabel: "Navigation" })
  );

  assert.match(translatedHtml, /aria-label="Menu"/);
  assert.match(overriddenHtml, /aria-label="Navigation"/);
});

test("SgToolBar exposes a translated collapse toggle label", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(
      SgToolBar,
      { id: "main-toolbar", title: "Actions", collapsible: true },
      React.createElement("span", null, "Item")
    )
  );

  assert.match(html, /aria-label="Basculer la barre d outils"/);
});

test("SgExpandablePanel exposes a translated default aria-label", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(
      SgExpandablePanel,
      { open: true, expandTo: "right" },
      React.createElement("div", null, "Body")
    )
  );

  assert.match(html, /aria-label="Panneau extensible"/);
});

test("SgTreeView renders translated control labels for expand, collapse and clear", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgTreeView, {
      nodes: [{ id: "root", label: "Root" }],
      checkable: true
    })
  );

  assert.match(html, />Tout developper</);
  assert.match(html, />Tout reduire</);
  assert.match(html, /title="Effacer la selection"/);
});


test("SgDockMenu exposes accessible item buttons with labels and disabled state", () => {
  const html = renderToStaticMarkup(
    React.createElement(SgDockMenu, {
      items: [
        { id: "home", label: "Home", icon: React.createElement("span", null, "H") },
        { id: "alerts", label: "Alerts", icon: React.createElement("span", null, "A"), disabled: true }
      ],
      showLabels: false
    })
  );

  assert.match(html, /aria-label="Home"/);
  assert.match(html, /title="Home"/);
  assert.match(html, /aria-label="Alerts"/);
  assert.match(html, /disabled=""/);
});





test("SgCard exposes translated collapse toggle labels", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(
      SgCard,
      { title: "Card", collapsible: true, defaultOpen: true },
      React.createElement("div", null, "Body")
    )
  );

  assert.match(html, /aria-label="Reduire"/);
});

test("SgMenu uses translated empty states by default", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgMenu, {
      menu: [],
      menuStyle: "inline"
    })
  );

  assert.match(html, />Aucun element trouve\.</);
});
test("SgMenu uses translated search placeholder by default", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgMenu, {
      menu: [{ id: "home", label: "Home", url: "/" }],
      menuStyle: "inline",
      search: { enabled: true }
    })
  );

  assert.match(html, /placeholder="Rechercher"/);
});

test("SgTreeView uses translated search placeholder by default", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgTreeView, {
      nodes: [{ id: "root", label: "Root" }],
      searchable: true
    })
  );

  assert.match(html, /placeholder="Rechercher\.\.\."/);
});


test("SgCarousel exposes translated indicator labels", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgCarousel, {
      items: [React.createElement("div", { key: 1 }, "A"), React.createElement("div", { key: 2 }, "B")],
      showIndicators: true,
      showNavigators: false
    })
  );

  assert.match(html, /aria-label="Aller au slide 1"/);
  assert.match(html, /aria-label="Aller au slide 2"/);
});



test("FAB drag helpers normalize persisted positions deterministically", () => {
  assert.equal(buildFabStorageKey(undefined), null);
  assert.equal(buildFabStorageKey("main"), "sg-fab-pos:main");

  assert.deepEqual(parseStoredFabDragPosition({ x: 12, y: 24 }), { x: 12, y: 24 });
  assert.deepEqual(parseStoredFabDragPosition('{"x":5,"y":9}'), { x: 5, y: 9 });
  assert.equal(parseStoredFabDragPosition('{"x":"5","y":9}'), null);
  assert.equal(parseStoredFabDragPosition('{bad json'), null);
  assert.equal(parseStoredFabDragPosition({ x: Infinity, y: 9 }), null);
});

test("Dock and toolbar drag helpers build storage keys and parse persisted positions deterministically", () => {
  assert.equal(buildDockMenuStorageKey(undefined, false), null);
  assert.equal(buildDockMenuStorageKey("main", false), "sg-dockmenu-pos:main:viewport");
  assert.equal(buildDockMenuStorageKey("main", true), "sg-dockmenu-pos:main:parent");

  assert.equal(buildToolbarStorageKey("main-toolbar"), "sg-toolbar-pos:main-toolbar");

  assert.deepEqual(parseStoredPanelDragPosition({ x: 12, y: 24 }), { x: 12, y: 24 });
  assert.deepEqual(parseStoredPanelDragPosition('{"x":5,"y":9}'), { x: 5, y: 9 });
  assert.equal(parseStoredPanelDragPosition('{"x":"5","y":9}'), null);
  assert.equal(parseStoredPanelDragPosition('{bad json'), null);
  assert.equal(parseStoredPanelDragPosition({ x: Infinity, y: 9 }), null);
});

test("Toolbar layout helper derives orientation and collapse affordances deterministically", () => {
  assert.deepEqual(
    buildToolbarLayoutState({
      orientationDirection: "vertical-down",
      inDock: true,
      zone: "top",
      freeDrag: false,
      dragHoverZone: null,
      effectiveZone: "top",
      showContent: true
    }),
    {
      zoneForOrientation: "top",
      resolvedOrientationDirection: "horizontal-left",
      orientation: "horizontal",
      direction: "right",
      openUp: false,
      openLeft: false,
      showLeadingCollapseButton: false,
      collapseIconDirection: "right"
    }
  );

  assert.deepEqual(
    buildToolbarLayoutState({
      orientationDirection: "horizontal-right",
      inDock: false,
      zone: "free",
      freeDrag: true,
      dragHoverZone: null,
      effectiveZone: "free",
      showContent: true
    }),
    {
      zoneForOrientation: "free",
      resolvedOrientationDirection: "horizontal-right",
      orientation: "horizontal",
      direction: "left",
      openUp: false,
      openLeft: true,
      showLeadingCollapseButton: true,
      collapseIconDirection: "right"
    }
  );

  assert.deepEqual(
    buildToolbarLayoutState({
      orientationDirection: "horizontal-right",
      inDock: false,
      zone: "free",
      freeDrag: false,
      dragHoverZone: null,
      effectiveZone: "free",
      showContent: false
    }),
    {
      zoneForOrientation: "free",
      resolvedOrientationDirection: "horizontal-right",
      orientation: "horizontal",
      direction: "left",
      openUp: false,
      openLeft: true,
      showLeadingCollapseButton: false,
      collapseIconDirection: "right"
    }
  );
});

test("Dock menu layout helper derives orientation and lift direction deterministically", () => {
  assert.deepEqual(buildDockMenuLayout("center-top"), {
    orientation: "horizontal",
    liftDirection: 1
  });

  assert.deepEqual(buildDockMenuLayout("center-bottom"), {
    orientation: "horizontal",
    liftDirection: -1
  });

  assert.deepEqual(buildDockMenuLayout("left-center"), {
    orientation: "vertical",
    liftDirection: 1
  });

  assert.deepEqual(buildDockMenuLayout("right-center"), {
    orientation: "vertical",
    liftDirection: -1
  });

  assert.deepEqual(buildDockMenuLayout("left-top"), {
    orientation: "horizontal",
    liftDirection: 1
  });
});

test("Dock menu item motion helper derives scale, translation, origin and z-index deterministically", () => {
  assert.deepEqual(
    buildDockMenuItemMotion({
      index: 2,
      hoveredIndex: 2,
      magnify: true,
      magnifyScale: 1.5,
      itemSize: 48,
      gap: 16,
      orientation: "horizontal",
      liftDirection: -1
    }),
    {
      scale: 1.5,
      translateX: 0,
      translateY: -18,
      transformOrigin: "50% 100%",
      zIndex: 3
    }
  );

  assert.deepEqual(
    buildDockMenuItemMotion({
      index: 3,
      hoveredIndex: 2,
      magnify: true,
      magnifyScale: 1.5,
      itemSize: 48,
      gap: 16,
      orientation: "horizontal",
      liftDirection: -1
    }),
    {
      scale: 1.2222222222222223,
      translateX: 18.240000000000002,
      translateY: -8.000000000000002,
      transformOrigin: "50% 100%",
      zIndex: 2
    }
  );

  assert.deepEqual(
    buildDockMenuItemMotion({
      index: 2,
      hoveredIndex: null,
      magnify: true,
      magnifyScale: 1.5,
      itemSize: 48,
      gap: 16,
      orientation: "vertical",
      liftDirection: 1
    }),
    {
      scale: 1,
      translateX: 0,
      translateY: 0,
      transformOrigin: "0% 50%",
      zIndex: 1
    }
  );
});

test("Dock menu label helper derives tooltip placement deterministically", () => {
  assert.deepEqual(buildDockMenuLabelStyle("horizontal", "center-bottom"), {
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    marginBottom: 8
  });

  assert.deepEqual(buildDockMenuLabelStyle("vertical", "left-center"), {
    left: "100%",
    top: "50%",
    transform: "translateY(-50%)",
    marginLeft: 8
  });

  assert.deepEqual(buildDockMenuLabelStyle("vertical", "right-center"), {
    right: "100%",
    top: "50%",
    transform: "translateY(-50%)",
    marginRight: 8
  });
});

test("Dock menu container style helper derives position, offsets and drag overrides deterministically", () => {
  assert.deepEqual(
    buildDockMenuContainerStyle({
      position: "center-top",
      zIndex: 50,
      enableDragDrop: false,
      dragPos: null,
      offset: undefined
    }),
    {
      style: {
        position: "fixed",
        top: 24,
        left: "50%",
        zIndex: 50
      },
      transform: "translateX(-50%)"
    }
  );

  assert.deepEqual(
    buildDockMenuContainerStyle({
      position: "right-bottom",
      zIndex: 70,
      enableDragDrop: false,
      dragPos: null,
      offset: { x: 5, y: 7 }
    }),
    {
      style: {
        position: "fixed",
        right: 19,
        bottom: 17,
        zIndex: 70
      },
      transform: ""
    }
  );

  assert.deepEqual(
    buildDockMenuContainerStyle({
      position: "center-bottom",
      zIndex: 90,
      enableDragDrop: true,
      dragPos: { x: 120, y: 240 },
      offset: { x: 3, y: 4 }
    }),
    {
      style: {
        position: "fixed",
        left: 123,
        top: 244,
        zIndex: 90
      },
      transform: ""
    }
  );
});

test("Dock menu context helper derives reset/menu availability deterministically", () => {
  assert.deepEqual(
    buildDockMenuContextMenuState({
      enableDragDrop: true,
      dragId: "main-dock",
      hasStoredPosition: true
    }),
    {
      canOpenContextMenu: true,
      canResetPosition: true
    }
  );

  assert.deepEqual(
    buildDockMenuContextMenuState({
      enableDragDrop: false,
      dragId: "main-dock",
      hasStoredPosition: true
    }),
    {
      canOpenContextMenu: false,
      canResetPosition: false
    }
  );

  assert.deepEqual(
    buildDockMenuContextMenuState({
      enableDragDrop: true,
      dragId: undefined,
      hasStoredPosition: true
    }),
    {
      canOpenContextMenu: false,
      canResetPosition: false
    }
  );

  assert.deepEqual(
    buildDockMenuContextMenuState({
      enableDragDrop: true,
      dragId: "main-dock",
      hasStoredPosition: false
    }),
    {
      canOpenContextMenu: false,
      canResetPosition: false
    }
  );
});


test("SgBreadcrumb uses translated default navigation labels", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(SgBreadcrumb, {
      items: [
        { id: "customers", label: "Customers", href: "/customers" },
        { id: "orders", label: "Orders", href: "/orders" },
        { id: "detail", label: "Detail" }
      ],
      maxItems: 2
    })
  );

  assert.match(html, /aria-label="Fil d Ariane"/);
});

test("SgPageControl uses translated default aria and empty messages", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(
      SgPageControl,
      null,
      React.createElement(SgPageControlPage, { title: "Overview", hidden: true }, React.createElement("div", null, "A"))
    )
  );

  assert.match(html, /Aucune page visible\./);
  assert.doesNotMatch(html, /No visible pages\./);
});

test("SgPageControl uses the translated tablist aria-label by default", () => {
  const html = renderWithLocale(
    "fr",
    React.createElement(
      SgPageControl,
      null,
      React.createElement(SgPageControlPage, { title: "Overview" }, React.createElement("div", null, "A")),
      React.createElement(SgPageControlPage, { title: "Profile" }, React.createElement("div", null, "B"))
    )
  );

  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-label="Controle de pages"/);
});


test("SgDockMenu consome o helper compartilhado de context menu", () => {
  const source = readFileSync(new URL("../src/menus/SgDockMenu.tsx", import.meta.url), "utf8");
  assert.match(source, /buildDockMenuContextMenuState\(/);
});


test("SgToolBar consome o helper compartilhado de layout", () => {
  const source = readFileSync(new URL("../src/layout/SgToolBar.tsx", import.meta.url), "utf8");
  assert.match(source, /buildToolbarLayoutState\(/);
});
