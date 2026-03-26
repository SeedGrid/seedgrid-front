import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

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
  buildMenuMaps,
  collectMenuSearchEntries,
  collectParentChain,
  computeActiveSets,
  filterMenuNodes,
  flattenVisibleNodes,
  mergeExpandedIdsForActivePath,
  resolveEffectiveActiveId,
  resolveExpandedIdsToggle,
  resolveHorizontalDockAlign,
  resolveMenuNodeActionIntent,
  resolveMenuHintPosition,
  resolveTieredNodeClickIntent,
  resolveMenuKeyboardAction,
  resolveMegaMenuActiveNode,
  resolveMegaMenuHoverActiveId,
  resolveMegaMenuInteraction,
  resolveMenuAutocompleteItems,
  resolveMenuLayoutState,
  resolveMenuSearchSelectionState,
  resolveTieredActiveState,
  resolveTieredClickState,
  resolveTieredHoverIntent,
  resolveTieredHoverPath
} = require("../dist/sandbox.cjs");

Module._load = originalLoad;

const rootParentId = "__sg_menu_root__";

function createVisibleNodes() {
  return [
    { node: { id: "dashboard" }, depth: 0 },
    { node: { id: "customers", children: [{}] }, depth: 0 },
    { node: { id: "customers-list" }, depth: 1 },
    { node: { id: "settings", url: "/settings" }, depth: 0 }
  ];
}

function createMenuTree() {
  return [
    {
      id: "dashboard",
      label: "Dashboard"
    },
    {
      id: "customers",
      label: "Customers",
      children: [
        {
          id: "customers-list",
          label: "Customer List",
          url: "/customers"
        },
        {
          id: "customers-segments",
          label: "Segments"
        }
      ]
    },
    {
      id: "settings",
      label: "Settings",
      children: [
        {
          id: "settings-profile",
          label: "Profile",
          url: "/settings/profile"
        }
      ]
    }
  ];
}

test("buildMenuMaps indexes parent, children, nodes and first urls", () => {
  const maps = buildMenuMaps(createMenuTree(), rootParentId);

  assert.equal(maps.parentById.get("dashboard"), rootParentId);
  assert.equal(maps.parentById.get("customers-list"), "customers");
  assert.deepEqual(maps.childrenByParent.get(rootParentId), ["dashboard", "customers", "settings"]);
  assert.deepEqual(maps.childrenByParent.get("customers"), ["customers-list", "customers-segments"]);
  assert.equal(maps.nodeById.get("settings")?.label, "Settings");
  assert.equal(maps.firstByUrl.get("/customers"), "customers-list");
});

test("collectParentChain walks from a node to the root without including the root marker", () => {
  const maps = buildMenuMaps(createMenuTree(), rootParentId);
  assert.deepEqual(collectParentChain(maps.parentById, "customers-list", rootParentId), ["customers"]);
  assert.deepEqual(collectParentChain(maps.parentById, "dashboard", rootParentId), []);
});

test("computeActiveSets marks exact and branch-active nodes for id and url matches", () => {
  const tree = createMenuTree();

  const byId = computeActiveSets(tree, "customers-list", undefined);
  assert.deepEqual([...byId.exact], ["customers-list"]);
  assert.deepEqual([...byId.branch], ["customers"]);

  const byUrl = computeActiveSets(tree, undefined, "/settings/profile");
  assert.deepEqual([...byUrl.exact], ["settings-profile"]);
  assert.deepEqual([...byUrl.branch], ["settings"]);
});


test("resolveEffectiveActiveId prefers explicit id, then url lookup, then local state", () => {
  const maps = buildMenuMaps(createMenuTree(), rootParentId);

  assert.equal(
    resolveEffectiveActiveId({
      activeId: "customers",
      activeUrl: "/settings/profile",
      localActiveId: "dashboard",
      firstByUrl: maps.firstByUrl
    }),
    "customers"
  );

  assert.equal(
    resolveEffectiveActiveId({
      activeUrl: "/settings/profile",
      localActiveId: "dashboard",
      firstByUrl: maps.firstByUrl
    }),
    "settings-profile"
  );

  assert.equal(
    resolveEffectiveActiveId({
      localActiveId: "dashboard",
      firstByUrl: maps.firstByUrl
    }),
    "dashboard"
  );
});

test("mergeExpandedIdsForActivePath appends parent ids without duplicates", () => {
  assert.deepEqual(
    mergeExpandedIdsForActivePath(["customers"], ["customers", "settings"]),
    ["customers", "settings"]
  );

  assert.deepEqual(mergeExpandedIdsForActivePath(["customers"], []), ["customers"]);
});

test("resolveTieredActiveState derives tiered path and mega-active root", () => {
  const tree = createMenuTree();
  const maps = buildMenuMaps(tree, rootParentId);

  assert.deepEqual(
    resolveTieredActiveState({
      effectiveActiveId: "customers-list",
      maps,
      menu: tree,
      rootParentId
    }),
    {
      tieredPath: ["customers"],
      megaActiveId: "customers"
    }
  );

  assert.deepEqual(
    resolveTieredActiveState({
      effectiveActiveId: "customers",
      maps,
      menu: tree,
      rootParentId
    }),
    {
      tieredPath: ["customers"],
      megaActiveId: "customers"
    }
  );

  assert.deepEqual(
    resolveTieredActiveState({
      maps,
      menu: tree,
      rootParentId
    }),
    {
      tieredPath: [],
      megaActiveId: "dashboard"
    }
  );
});


test("resolveTieredHoverPath and resolveTieredClickState update nested tiered state deterministically", () => {
  assert.deepEqual(resolveTieredHoverPath(["customers", "customers-list"], 1, "customers-segments", false), ["customers"]);
  assert.deepEqual(resolveTieredHoverPath(["customers"], 1, "customers-segments", true), ["customers", "customers-segments"]);
  assert.equal(
    resolveTieredHoverIntent({
      currentPath: ["customers"],
      depth: 1,
      nodeId: "customers-segments",
      hasChildren: true,
      openSubmenuOnHover: false
    }),
    undefined
  );
  assert.deepEqual(
    resolveTieredHoverIntent({
      currentPath: ["customers"],
      depth: 1,
      nodeId: "customers-segments",
      hasChildren: true,
      openSubmenuOnHover: true
    }),
    ["customers", "customers-segments"]
  );

  assert.deepEqual(resolveTieredClickState(["customers", "customers-list"], 1, "customers-list"), {
    nextPath: ["customers"],
    isOpenAtDepth: true
  });

  assert.deepEqual(resolveTieredClickState(["customers"], 1, "customers-segments"), {
    nextPath: ["customers", "customers-segments"],
    isOpenAtDepth: false
  });
});

test("resolveMenuSearchSelectionState derives expansion and activation intent", () => {
  assert.deepEqual(
    resolveMenuSearchSelectionState({
      currentExpandedIds: ["customers"],
      parentChain: ["customers"],
      rootToParent: ["customers"],
      nodeId: "customers-list",
      hasChildren: false,
      hasActionTarget: true
    }),
    {
      expandedIds: ["customers"],
      tieredPath: ["customers"],
      megaActiveId: "customers",
      shouldActivateNode: true
    }
  );

  assert.deepEqual(
    resolveMenuSearchSelectionState({
      currentExpandedIds: ["customers"],
      parentChain: ["customers"],
      rootToParent: ["customers"],
      nodeId: "customers-segments",
      hasChildren: true,
      hasActionTarget: false
    }),
    {
      expandedIds: ["customers", "customers-segments"],
      tieredPath: ["customers", "customers-segments"],
      megaActiveId: "customers",
      localActiveId: "customers-segments",
      shouldActivateNode: false
    }
  );
});

test("resolveMegaMenuActiveNode and resolveMegaMenuInteraction handle mega menu focus intent", () => {
  const tree = createMenuTree();

  assert.equal(resolveMegaMenuActiveNode(tree, "settings")?.id, "settings");
  assert.equal(resolveMegaMenuActiveNode(tree, "missing")?.id, "dashboard");

  assert.equal(resolveMegaMenuHoverActiveId({ nodeId: "customers", hasChildren: true }), "customers");
  assert.equal(resolveMegaMenuHoverActiveId({ nodeId: "dashboard", hasChildren: false }), undefined);

  assert.deepEqual(resolveMegaMenuInteraction({ nodeId: "customers", hasChildren: true }), {
    nextMegaActiveId: "customers",
    shouldActivateNode: false
  });

  assert.deepEqual(resolveMegaMenuInteraction({ nodeId: "dashboard", hasChildren: false }), {
    shouldActivateNode: true
  });
});

test("resolveMenuAutocompleteItems filters by label/path and applies the result limit", () => {
  const entries = collectMenuSearchEntries(createMenuTree());

  assert.deepEqual(resolveMenuAutocompleteItems(entries, "profile"), [
    {
      id: "settings-profile",
      label: "Profile",
      value: "Settings > Profile",
      group: "Settings",
      data: { nodeId: "settings-profile", path: "Settings > Profile" }
    }
  ]);

  const limited = resolveMenuAutocompleteItems(entries, "", 2);
  assert.equal(limited.length, 2);
  assert.equal(limited[0]?.id, "dashboard");
  assert.equal(limited[1]?.id, "customers");
});

test("filterMenuNodes keeps matching branches and ancestors", () => {
  const filtered = filterMenuNodes(createMenuTree(), "profile");

  assert.deepEqual(filtered, [
    {
      id: "settings",
      label: "Settings",
      children: [
        {
          id: "settings-profile",
          label: "Profile",
          url: "/settings/profile",
          children: undefined
        }
      ]
    }
  ]);
});

test("filterMenuNodes returns the same reference when the query is blank", () => {
  const tree = createMenuTree();
  assert.strictEqual(filterMenuNodes(tree, "   "), tree);
});

test("collectMenuSearchEntries builds labels, paths and top-level groups", () => {
  const entries = collectMenuSearchEntries(createMenuTree());

  assert.deepEqual(entries, [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "Dashboard",
      group: "Dashboard"
    },
    {
      id: "customers",
      label: "Customers",
      path: "Customers",
      group: "Customers"
    },
    {
      id: "customers-list",
      label: "Customer List",
      path: "Customers > Customer List",
      group: "Customers"
    },
    {
      id: "customers-segments",
      label: "Segments",
      path: "Customers > Segments",
      group: "Customers"
    },
    {
      id: "settings",
      label: "Settings",
      path: "Settings",
      group: "Settings"
    },
    {
      id: "settings-profile",
      label: "Profile",
      path: "Settings > Profile",
      group: "Settings"
    }
  ]);
});

test("flattenVisibleNodes respects expanded state, search expansion and collapsed mode", () => {
  const tree = createMenuTree();

  assert.deepEqual(
    flattenVisibleNodes(tree, new Set(), false, false).map((item) => ({
      id: item.node.id,
      depth: item.depth,
      parentId: item.parentId
    })),
    [
      { id: "dashboard", depth: 0, parentId: rootParentId },
      { id: "customers", depth: 0, parentId: rootParentId },
      { id: "settings", depth: 0, parentId: rootParentId }
    ]
  );

  assert.deepEqual(
    flattenVisibleNodes(tree, new Set(["customers"]), false, false).map((item) => ({
      id: item.node.id,
      depth: item.depth,
      parentId: item.parentId
    })),
    [
      { id: "dashboard", depth: 0, parentId: rootParentId },
      { id: "customers", depth: 0, parentId: rootParentId },
      { id: "customers-list", depth: 1, parentId: "customers" },
      { id: "customers-segments", depth: 1, parentId: "customers" },
      { id: "settings", depth: 0, parentId: rootParentId }
    ]
  );

  assert.deepEqual(
    flattenVisibleNodes(tree, new Set(), false, true).map((item) => item.node.id),
    [
      "dashboard",
      "customers",
      "customers-list",
      "customers-segments",
      "settings",
      "settings-profile"
    ]
  );

  assert.deepEqual(
    flattenVisibleNodes(tree, new Set(["customers"]), true, false).map((item) => item.node.id),
    ["dashboard", "customers", "settings"]
  );
});

test("resolveMenuKeyboardAction moves focus through visible nodes", () => {
  const visibleNodes = createVisibleNodes();
  const parentById = new Map([
    ["dashboard", rootParentId],
    ["customers", rootParentId],
    ["customers-list", "customers"],
    ["settings", rootParentId]
  ]);

  assert.deepEqual(
    resolveMenuKeyboardAction({
      key: "ArrowDown",
      visibleNodes,
      focusedId: "dashboard",
      expandedIds: new Set(["customers"]),
      hasSearch: false,
      isCollapsed: false,
      parentById,
      rootParentId
    }),
    { type: "focus", id: "customers" }
  );

  assert.deepEqual(
    resolveMenuKeyboardAction({
      key: "ArrowUp",
      visibleNodes,
      focusedId: "customers-list",
      expandedIds: new Set(["customers"]),
      hasSearch: false,
      isCollapsed: false,
      parentById,
      rootParentId
    }),
    { type: "focus", id: "customers" }
  );
});

test("resolveMenuKeyboardAction toggles and focuses nested menu branches", () => {
  const visibleNodes = createVisibleNodes();
  const parentById = new Map([
    ["dashboard", rootParentId],
    ["customers", rootParentId],
    ["customers-list", "customers"],
    ["settings", rootParentId]
  ]);

  assert.deepEqual(
    resolveMenuKeyboardAction({
      key: "ArrowRight",
      visibleNodes,
      focusedId: "customers",
      expandedIds: new Set(),
      hasSearch: false,
      isCollapsed: false,
      parentById,
      rootParentId
    }),
    { type: "toggle", id: "customers" }
  );

  assert.deepEqual(
    resolveMenuKeyboardAction({
      key: "ArrowRight",
      visibleNodes,
      focusedId: "customers",
      expandedIds: new Set(["customers"]),
      hasSearch: false,
      isCollapsed: false,
      parentById,
      rootParentId
    }),
    { type: "focus", id: "customers-list" }
  );

  assert.deepEqual(
    resolveMenuKeyboardAction({
      key: "ArrowLeft",
      visibleNodes,
      focusedId: "customers-list",
      expandedIds: new Set(["customers"]),
      hasSearch: false,
      isCollapsed: false,
      parentById,
      rootParentId
    }),
    { type: "focus", id: "customers" }
  );

  assert.deepEqual(
    resolveMenuKeyboardAction({
      key: "ArrowLeft",
      visibleNodes,
      focusedId: "customers",
      expandedIds: new Set(["customers"]),
      hasSearch: false,
      isCollapsed: false,
      parentById,
      rootParentId
    }),
    { type: "toggle", id: "customers" }
  );
});

test("resolveMenuKeyboardAction distinguishes branch toggles from activation", () => {
  const visibleNodes = createVisibleNodes();
  const parentById = new Map([
    ["dashboard", rootParentId],
    ["customers", rootParentId],
    ["customers-list", "customers"],
    ["settings", rootParentId]
  ]);

  assert.deepEqual(
    resolveMenuKeyboardAction({
      key: "Enter",
      visibleNodes,
      focusedId: "customers",
      expandedIds: new Set(),
      hasSearch: false,
      isCollapsed: false,
      parentById,
      rootParentId
    }),
    { type: "toggle", id: "customers" }
  );

  assert.deepEqual(
    resolveMenuKeyboardAction({
      key: " ",
      visibleNodes,
      focusedId: "settings",
      expandedIds: new Set(),
      hasSearch: false,
      isCollapsed: false,
      parentById,
      rootParentId
    }),
    { type: "activate", id: "settings" }
  );
});

test("resolveMenuKeyboardAction becomes a no-op for collapsed or search-only branch toggles", () => {
  const visibleNodes = createVisibleNodes();
  const parentById = new Map([
    ["dashboard", rootParentId],
    ["customers", rootParentId],
    ["customers-list", "customers"],
    ["settings", rootParentId]
  ]);

  assert.deepEqual(
    resolveMenuKeyboardAction({
      key: "ArrowRight",
      visibleNodes,
      focusedId: "customers",
      expandedIds: new Set(),
      hasSearch: false,
      isCollapsed: true,
      parentById,
      rootParentId
    }),
    { type: "noop" }
  );

  assert.deepEqual(
    resolveMenuKeyboardAction({
      key: "ArrowLeft",
      visibleNodes,
      focusedId: "customers",
      expandedIds: new Set(["customers"]),
      hasSearch: true,
      isCollapsed: false,
      parentById,
      rootParentId
    }),
    { type: "noop" }
  );
});


















test("resolveTieredNodeClickIntent derives next path and activation intent", () => {
  assert.deepEqual(
    resolveTieredNodeClickIntent({
      currentPath: ["customers"],
      depth: 1,
      nodeId: "segments",
      hasChildren: false,
      hasActionTarget: true
    }),
    {
      nextPath: ["customers"],
      shouldActivateNode: true,
      isOpenAtDepth: false
    }
  );

  assert.deepEqual(
    resolveTieredNodeClickIntent({
      currentPath: ["customers", "segments"],
      depth: 1,
      nodeId: "segments",
      hasChildren: true,
      hasActionTarget: false
    }),
    {
      nextPath: ["customers"],
      shouldActivateNode: false,
      isOpenAtDepth: true
    }
  );

  assert.deepEqual(
    resolveTieredNodeClickIntent({
      currentPath: ["customers"],
      depth: 1,
      nodeId: "segments",
      hasChildren: true,
      hasActionTarget: false
    }),
    {
      nextPath: ["customers", "segments"],
      shouldActivateNode: false,
      isOpenAtDepth: false
    }
  );

  assert.deepEqual(
    resolveTieredNodeClickIntent({
      currentPath: ["customers"],
      depth: 1,
      nodeId: "segments",
      hasChildren: true,
      hasActionTarget: true
    }),
    {
      nextPath: ["customers", "segments"],
      shouldActivateNode: true,
      isOpenAtDepth: false
    }
  );
});

test("SgMenu consome o helper compartilhado de clique tiered", () => {
  const source = readFileSync(new URL("../src/layout/SgMenu.tsx", import.meta.url), "utf8");

  assert.match(source, /resolveTieredNodeClickIntent\(\{/);
});

test("resolveMenuNodeActionIntent distinguishes panel toggle, flat noop and activation", () => {
  assert.equal(
    resolveMenuNodeActionIntent({
      variant: "panel",
      hasChildren: true,
      hasActionTarget: false,
      isCollapsed: false
    }),
    "toggle"
  );

  assert.equal(
    resolveMenuNodeActionIntent({
      variant: "panel",
      hasChildren: true,
      hasActionTarget: false,
      isCollapsed: true
    }),
    "activate"
  );

  assert.equal(
    resolveMenuNodeActionIntent({
      variant: "flat",
      hasChildren: true,
      hasActionTarget: false
    }),
    "noop"
  );

  assert.equal(
    resolveMenuNodeActionIntent({
      variant: "flat",
      hasChildren: false,
      hasActionTarget: true
    }),
    "activate"
  );
});

test("SgMenu consumes the shared node action-intent helper", () => {
  const source = readFileSync(new URL("../src/layout/SgMenu.tsx", import.meta.url), "utf8");

  assert.match(source, /resolveMenuNodeActionIntent\(\{/);
  assert.match(source, /variant: "panel"/);
  assert.match(source, /variant: "flat"/);
});

test("resolveExpandedIdsToggle handles multiple and accordion expansion deterministically", () => {
  const maps = buildMenuMaps(createMenuTree(), rootParentId);

  assert.deepEqual(
    resolveExpandedIdsToggle({
      currentIds: ["customers"],
      nodeId: "customers",
      mode: "multiple",
      parentById: maps.parentById,
      childrenByParent: maps.childrenByParent,
      rootParentId
    }),
    []
  );

  assert.deepEqual(
    resolveExpandedIdsToggle({
      currentIds: ["customers"],
      nodeId: "settings",
      mode: "accordion",
      parentById: maps.parentById,
      childrenByParent: maps.childrenByParent,
      rootParentId
    }),
    ["settings"]
  );

  assert.deepEqual(
    resolveExpandedIdsToggle({
      currentIds: ["customers-list"],
      nodeId: "customers-segments",
      mode: "accordion",
      parentById: maps.parentById,
      childrenByParent: maps.childrenByParent,
      rootParentId
    }),
    ["customers-segments"]
  );
});

test("SgMenu consumes the shared expanded-id toggle helper", () => {
  const source = readFileSync(new URL("../src/layout/SgMenu.tsx", import.meta.url), "utf8");

  assert.match(source, /resolveExpandedIdsToggle\(\{/);
});

test("resolveMenuHintPosition and resolveHorizontalDockAlign derive stable hint and dock coordinates", () => {
  assert.deepEqual(
    resolveMenuHintPosition({
      isConnected: true,
      rect: { left: 10, right: 50, top: 20, width: 40, height: 30 },
      placement: "right"
    }),
    { x: 58, y: 35 }
  );

  assert.deepEqual(
    resolveMenuHintPosition({
      isConnected: true,
      rect: { left: 10, right: 50, top: 20, width: 40, height: 30 },
      placement: "top"
    }),
    { x: 30, y: 12 }
  );

  assert.equal(
    resolveMenuHintPosition({
      isConnected: false,
      rect: { left: 10, right: 50, top: 20, width: 40, height: 30 },
      placement: "top"
    }),
    null
  );

  assert.equal(resolveHorizontalDockAlign(20, { left: 10, width: 40 }), "left");
  assert.equal(resolveHorizontalDockAlign(40, { left: 10, width: 40 }), "right");
});

test("SgMenu consumes the shared hint-position and dock-align helpers", () => {
  const source = readFileSync(new URL("../src/layout/SgMenu.tsx", import.meta.url), "utf8");

  assert.match(source, /resolveMenuHintPositionHelper\(\{/);
  assert.match(source, /resolveHorizontalDockAlign\(upEvent\.clientX, zoneRect\)/);
});

test("resolveMenuLayoutState derives dock orientation, alignment and sidebar width", () => {
  assert.deepEqual(
    resolveMenuLayoutState({
      dockMode: true,
      effectiveDockZone: "top",
      orientationDirection: "horizontal-right",
      position: "left",
      horizontalDockAlign: "right",
      isCollapsed: false,
      menuStyle: "inline",
      effectiveMenuStyle: "mega-horizontal",
      pinnedState: true,
      expandedWidthCss: "280px",
      collapsedWidthCss: "72px"
    }),
    {
      resolvedPosition: "right",
      isHorizontalDockZone: true,
      isVerticalDockZone: false,
      tieredOpenToLeft: true,
      isMegaMenuStyle: true,
      dockAlign: null,
      sidebarWidthCss: "100%"
    }
  );

  assert.deepEqual(
    resolveMenuLayoutState({
      dockMode: true,
      effectiveDockZone: "left",
      orientationDirection: "vertical-top",
      position: "right",
      horizontalDockAlign: null,
      isCollapsed: true,
      menuStyle: "hybrid",
      effectiveMenuStyle: "panel",
      pinnedState: false,
      expandedWidthCss: "320px",
      collapsedWidthCss: "64px"
    }),
    {
      resolvedPosition: "left",
      isHorizontalDockZone: false,
      isVerticalDockZone: true,
      tieredOpenToLeft: false,
      isMegaMenuStyle: false,
      dockAlign: "start",
      sidebarWidthCss: "64px"
    }
  );

  assert.deepEqual(
    resolveMenuLayoutState({
      dockMode: false,
      effectiveDockZone: null,
      orientationDirection: "vertical-down",
      position: "right",
      horizontalDockAlign: null,
      isCollapsed: false,
      menuStyle: "sidebar",
      effectiveMenuStyle: "panel",
      pinnedState: false,
      expandedWidthCss: "300px",
      collapsedWidthCss: "80px"
    }),
    {
      resolvedPosition: "right",
      isHorizontalDockZone: false,
      isVerticalDockZone: false,
      tieredOpenToLeft: true,
      isMegaMenuStyle: false,
      dockAlign: null,
      sidebarWidthCss: "300px"
    }
  );
});

test("SgMenu consumes the shared layout-state helper", () => {
  const source = readFileSync(new URL("../src/layout/SgMenu.tsx", import.meta.url), "utf8");

  assert.match(source, /resolveMenuLayoutState\(\{/);
  assert.match(source, /const layoutState = React\.useMemo/);
  assert.match(source, /const dockAlignStyle: React\.CSSProperties \| undefined =/);
  assert.match(source, /const sidebarWidthStyle = sidebarWidthCss/);
});



test("SgMenu consumes the shared search-selection helper", () => {
  const source = readFileSync(new URL("../src/layout/SgMenu.tsx", import.meta.url), "utf8");

  assert.match(source, /resolveMenuSearchSelectionState\(\{/);
  assert.match(source, /const nextState = resolveMenuSearchSelectionState\(\{/);
});

test("SgMenu consumes the shared autocomplete, tiered and mega-menu helpers", () => {
  const source = readFileSync(new URL("../src/layout/SgMenu.tsx", import.meta.url), "utf8");

  assert.match(source, /resolveMenuAutocompleteItems\(searchEntries, query\)/);
  assert.match(source, /resolveTieredHoverIntent\(\{/);
  assert.match(source, /resolveTieredNodeClickIntent\(\{/);
  assert.match(source, /resolveMegaMenuActiveNode\(items, megaActiveId\)/);
  assert.match(source, /resolveMegaMenuHoverActiveId\(\{/);
  assert.match(source, /resolveMegaMenuInteraction\(\{/);
});
