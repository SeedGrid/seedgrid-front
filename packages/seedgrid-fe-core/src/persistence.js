/* ─── Persistence types ─── */
/* ─── Pure functions ─── */
export function buildSgPersistenceKey(baseKey, namespace, scope) {
    const resolved = namespace ?? "";
    if (!resolved)
        return null;
    const resolvedScope = (scope ?? "").trim();
    if (!resolvedScope)
        return `sg:${resolved}:${baseKey}`;
    return `sg:${resolved}:${resolvedScope}:${baseKey}`;
}
export function createLocalStorageStrategy(options) {
    const prefix = options?.prefix ?? "";
    const full = (key) => (prefix ? `${prefix}${key}` : key);
    return {
        load: (key) => {
            try {
                const raw = window.localStorage.getItem(full(key));
                if (raw == null)
                    return null;
                return JSON.parse(raw);
            }
            catch {
                return null;
            }
        },
        save: (key, state) => {
            try {
                window.localStorage.setItem(full(key), JSON.stringify(state));
            }
            catch {
                // ignore
            }
        },
        clear: (key) => {
            try {
                window.localStorage.removeItem(full(key));
            }
            catch {
                // ignore
            }
        }
    };
}
export function createApiPersistenceStrategy(args) {
    const fetcher = args.fetcher ?? fetch;
    const base = args.baseUrl.replace(/\/$/, "");
    const version = args.stateVersion;
    const scope = args.scope;
    return {
        load: async (key) => {
            const res = await fetcher(`${base}/sg/persistence?key=${encodeURIComponent(key)}`, {
                method: "GET"
            });
            if (!res.ok)
                throw new Error(`SG persistence load failed (${res.status})`);
            const data = (await res.json());
            if (!data?.found || !data.record)
                return null;
            return data.record.state;
        },
        save: async (key, state) => {
            const record = {
                protocolVersion: 1,
                key,
                scope,
                stateVersion: version,
                updatedAt: new Date().toISOString(),
                state
            };
            const res = await fetcher(`${base}/sg/persistence`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ record })
            });
            if (!res.ok)
                throw new Error(`SG persistence save failed (${res.status})`);
        },
        clear: async (key) => {
            const res = await fetcher(`${base}/sg/persistence?key=${encodeURIComponent(key)}`, {
                method: "DELETE"
            });
            if (!res.ok)
                throw new Error(`SG persistence clear failed (${res.status})`);
        }
    };
}
export function createCompositePersistenceStrategy(args) {
    const { mode, primary, secondary } = args;
    return {
        load: async (key) => {
            if (mode === "strict") {
                return await primary.load(key);
            }
            if (mode === "mirror") {
                try {
                    const remote = await primary.load(key);
                    if (remote !== null && remote !== undefined)
                        return remote;
                }
                catch {
                    // ignore and fallback
                }
                return await secondary.load(key);
            }
            try {
                return await primary.load(key);
            }
            catch {
                return await secondary.load(key);
            }
        },
        save: async (key, state) => {
            if (mode === "strict") {
                await primary.save(key, state);
                return;
            }
            if (mode === "mirror") {
                await Promise.allSettled([
                    Promise.resolve(primary.save(key, state)),
                    Promise.resolve(secondary.save(key, state))
                ]);
                return;
            }
            try {
                await primary.save(key, state);
            }
            catch {
                await secondary.save(key, state);
            }
        },
        clear: async (key) => {
            if (mode === "strict") {
                await primary.clear(key);
                return;
            }
            if (mode === "mirror") {
                await Promise.allSettled([
                    Promise.resolve(primary.clear(key)),
                    Promise.resolve(secondary.clear(key))
                ]);
                return;
            }
            try {
                await primary.clear(key);
            }
            catch {
                await secondary.clear(key);
            }
        }
    };
}
