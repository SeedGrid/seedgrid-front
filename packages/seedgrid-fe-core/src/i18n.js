export function mergeMessages(target, add) {
    const out = { ...target };
    for (const ns of Object.keys(add)) {
        out[ns] = { ...(out[ns] ?? {}), ...(add[ns] ?? {}) };
    }
    return out;
}
