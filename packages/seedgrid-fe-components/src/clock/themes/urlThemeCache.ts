const svgTextCache = new Map<string, Promise<string>>();

export function loadSvgText(url: string): Promise<string> {
  if (!svgTextCache.has(url)) {
    svgTextCache.set(
      url,
      fetch(url, { method: "GET", cache: "force-cache" }).then((res) => {
        if (!res.ok) throw new Error(`Failed to load svg: ${url} (${res.status})`);
        return res.text();
      })
    );
  }
  return svgTextCache.get(url)!;
}
