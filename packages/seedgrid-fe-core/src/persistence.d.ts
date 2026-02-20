export type NamespaceProvider = {
    getNamespace: () => string | null;
};
export type PersistenceStrategy = {
    load: (key: string) => unknown | Promise<unknown>;
    save: (key: string, state: unknown) => void | Promise<void>;
    clear: (key: string) => void | Promise<void>;
};
export type SgPersistenceRecordDTO = {
    protocolVersion: 1;
    key: string;
    scope: string;
    stateVersion: number;
    updatedAt: string;
    state: unknown;
};
export type SgPersistenceMode = "strict" | "fallback" | "mirror";
export type SgPersistenceConfig = {
    scope: string;
    mode: SgPersistenceMode;
    stateVersion: number;
};
export type SgEnvironmentValue = {
    namespaceProvider: NamespaceProvider;
    persistenceStrategy: PersistenceStrategy;
    persistence: SgPersistenceConfig;
};
export type SgEnvironment = SgEnvironmentValue;
export declare function buildSgPersistenceKey(baseKey: string, namespace?: string | null, scope?: string | null): string | null;
export declare function createLocalStorageStrategy(options?: {
    prefix?: string;
}): PersistenceStrategy;
export declare function createApiPersistenceStrategy(args: {
    baseUrl: string;
    fetcher?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    scope: string;
    stateVersion: number;
}): PersistenceStrategy;
export declare function createCompositePersistenceStrategy(args: {
    mode: SgPersistenceMode;
    primary: PersistenceStrategy;
    secondary: PersistenceStrategy;
}): PersistenceStrategy;
//# sourceMappingURL=persistence.d.ts.map