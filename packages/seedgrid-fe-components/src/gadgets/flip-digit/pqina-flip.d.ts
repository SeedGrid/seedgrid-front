declare module "@pqina/flip" {
  interface TickInstance {
    value: string;
    root: HTMLElement;
    destroy(): void;
  }

  interface TickDOM {
    create(element: HTMLElement, options?: { value?: string }): TickInstance;
    destroy(element: HTMLElement): boolean;
    find(element: HTMLElement): TickInstance | undefined;
    parse(root?: HTMLElement): void;
  }

  interface TickStatic {
    DOM: TickDOM;
    plugin: { add(plugin: unknown): void };
  }

  const Tick: TickStatic;
  export default Tick;
}
