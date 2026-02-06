export type HttpClientOptions = {
  baseUrl: string;
  getAccessToken?: () => string | null;
};

export function createHttpClient(opts: HttpClientOptions) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const token = opts.getAccessToken?.();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(`${opts.baseUrl}${path}`, { ...init, headers });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  return { request };
}
