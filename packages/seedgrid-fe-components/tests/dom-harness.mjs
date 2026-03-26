import { JSDOM } from "jsdom";
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";

const GLOBAL_KEYS = [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLInputElement",
  "Node",
  "Event",
  "InputEvent",
  "MouseEvent",
  "KeyboardEvent",
  "PointerEvent",
  "CustomEvent",
  "DOMRect",
  "MutationObserver",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "matchMedia",
  "localStorage",
  "IS_REACT_ACT_ENVIRONMENT"
];

export function setupDomHarness() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/"
  });
  const { window } = dom;
  const previous = new Map();

  for (const key of GLOBAL_KEYS) {
    previous.set(key, globalThis[key]);
  }

  const setGlobal = (key, value) => {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value
    });
  };

  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      media: "",
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      }
    });
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id) => clearTimeout(id);
  }

  setGlobal("window", window);
  setGlobal("document", window.document);
  setGlobal("navigator", window.navigator);
  setGlobal("HTMLElement", window.HTMLElement);
  setGlobal("HTMLInputElement", window.HTMLInputElement);
  setGlobal("Node", window.Node);
  setGlobal("Event", window.Event);
  setGlobal("InputEvent", window.InputEvent ?? window.Event);
  setGlobal("MouseEvent", window.MouseEvent);
  setGlobal("KeyboardEvent", window.KeyboardEvent);
  setGlobal("PointerEvent", window.PointerEvent ?? class PointerEvent extends window.MouseEvent {});
  setGlobal("CustomEvent", window.CustomEvent);
  setGlobal(
    "DOMRect",
    window.DOMRect ??
      class DOMRect {
        constructor(x = 0, y = 0, width = 0, height = 0) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.top = y;
          this.left = x;
          this.right = x + width;
          this.bottom = y + height;
        }
      }
  );
  setGlobal("MutationObserver", window.MutationObserver);
  setGlobal("getComputedStyle", window.getComputedStyle.bind(window));
  setGlobal("requestAnimationFrame", (cb) => setTimeout(() => cb(Date.now()), 0));
  setGlobal("cancelAnimationFrame", (id) => clearTimeout(id));
  setGlobal("matchMedia", window.matchMedia.bind(window));
  setGlobal("localStorage", window.localStorage);
  setGlobal("IS_REACT_ACT_ENVIRONMENT", true);

  if (!window.HTMLElement.prototype.setPointerCapture) {
    window.HTMLElement.prototype.setPointerCapture = function setPointerCapture() {};
  }
  if (!window.HTMLElement.prototype.releasePointerCapture) {
    window.HTMLElement.prototype.releasePointerCapture = function releasePointerCapture() {};
  }
  if (!window.HTMLElement.prototype.attachEvent) {
    window.HTMLElement.prototype.attachEvent = function attachEvent() {};
  }
  if (!window.HTMLElement.prototype.detachEvent) {
    window.HTMLElement.prototype.detachEvent = function detachEvent() {};
  }

  const cleanups = [];

  function restore() {
    while (cleanups.length) {
      cleanups.pop()();
    }
    for (const [key, value] of previous.entries()) {
      if (value === undefined) delete globalThis[key];
      else {
        Object.defineProperty(globalThis, key, {
          configurable: true,
          writable: true,
          value
        });
      }
    }
    dom.window.close();
  }

  return {
    window,
    document: window.document,
    restore,
    async render(element) {
      const container = window.document.createElement("div");
      window.document.body.appendChild(container);
      const root = createRoot(container);
      cleanups.push(() => {
        act(() => root.unmount());
        container.remove();
      });
      await act(async () => {
        root.render(element);
      });
      return { root, container };
    }
  };
}

export async function flushDom() {
  await act(async () => {
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

export function setElementRect(element, rect) {
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      x: rect.left,
      y: rect.top,
      top: rect.top,
      left: rect.left,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      width: rect.width,
      height: rect.height,
      toJSON() {
        return this;
      }
    })
  });
}

export async function dispatchMouse(target, type, init = {}) {
  const event = new globalThis.MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    ...init
  });
  await act(async () => {
    target.dispatchEvent(event);
  });
  return event;
}

export async function dispatchPointer(target, type, init = {}) {
  const EventCtor = globalThis.PointerEvent ?? globalThis.MouseEvent;
  const event = new EventCtor(type, {
    bubbles: true,
    cancelable: true,
    ...init
  });
  await act(async () => {
    target.dispatchEvent(event);
  });
  return event;
}

export async function dispatchKeyboard(target, type, init = {}) {
  const event = new globalThis.KeyboardEvent(type, {
    bubbles: true,
    cancelable: true,
    ...init
  });
  await act(async () => {
    target.dispatchEvent(event);
  });
  return event;
}

export async function dispatchFocus(target) {
  await act(async () => {
    target.focus?.();
  });
}

export async function dispatchBlur(target) {
  await act(async () => {
    target.blur?.();
  });
}

export async function dispatchInput(target, value) {
  const setter = Object.getOwnPropertyDescriptor(globalThis.HTMLInputElement.prototype, "value")?.set;
  await act(async () => {
    target.focus?.();
    target.dispatchEvent(new globalThis.KeyboardEvent("keydown", { bubbles: true, cancelable: true }));
    target.dispatchEvent(
      new globalThis.InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        data: String(value)
      })
    );
    const previousValue = target.value;
    if (setter) setter.call(target, value);
    else target.value = value;
    target._valueTracker?.setValue?.(previousValue);
    target.dispatchEvent(new globalThis.InputEvent("input", { bubbles: true, cancelable: true, data: String(value) }));
    target.dispatchEvent(new globalThis.Event("change", { bubbles: true, cancelable: true }));
    target.dispatchEvent(new globalThis.KeyboardEvent("keyup", { bubbles: true, cancelable: true }));
  });
}
