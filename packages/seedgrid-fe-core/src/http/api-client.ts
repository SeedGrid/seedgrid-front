// seedgrid:managed

import {
  captureException,
  runGuarded,
  suppressException,
  type ExceptionContext,
} from "./api-exception-handler";

type Primitive = boolean | number | string;

type QueryValue = Primitive | null | undefined;

type QueryParams = Record<string, QueryValue>;

type NextFetchOptions = {
  revalidate?: false | number;
  tags?: string[];
};

export type ApiParseMode = "json" | "response" | "text";

export type ApiRetryOptions = {
  attempts?: number;
  baseDelayMs?: number;
  retryOn?: number[];
};

export type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: BodyInit | Record<string, unknown> | null;
  headers?: HeadersInit;
  next?: NextFetchOptions;
  parseAs?: ApiParseMode;
  query?: QueryParams;
  requireAuth?: boolean;
  retry?: boolean | ApiRetryOptions;
  captureExceptions?: boolean;
};

export type ApiClientConfig = {
  baseUrl: string;
  defaultHeaders?: HeadersInit;
  defaultCache?: RequestCache;
  defaultNext?: NextFetchOptions;
  getAccessToken?: () => Promise<string | null>;
  refreshAccessToken?: () => Promise<string | null>;
  onAuthFailure?: (context: ExceptionContext) => void | Promise<void>;
  onException?: (
    error: Error,
    context: ExceptionContext
  ) => void | Promise<void>;
};

export class ApiClientError extends Error {
  readonly responseBody: unknown;
  readonly status: number;

  constructor(message: string, status: number, responseBody?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

const DEFAULT_RETRY_STATUSES = [429, 502, 503, 504];

export function createApiClient(config: ApiClientConfig) {
  function shouldCapture(options: ApiRequestOptions) {
    return options.captureExceptions !== false;
  }

  async function request<T = unknown>(
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return runGuarded(
      async () => {
        const retry = resolveRetryOptions(options.retry);
        let refreshedToken = false;
        let latestAccessToken: string | null | undefined;
        const requiresAuth = options.requireAuth ?? true;

        for (let attempt = 0; attempt <= retry.attempts; attempt += 1) {
          try {
            latestAccessToken ??= await readAccessToken(
              config.getAccessToken,
              requiresAuth
            );

            const url = buildUrl(config.baseUrl, path, options.query);
            const requestInit = buildRequestInit(config, options, latestAccessToken);

            console.log("[API Request] Curl:", formatCurlCommand(url, requestInit));
            console.log("[API Request] URL:", url);
            console.log("[API Request] Method:", requestInit.method);
            console.log("[API Request] Body:", requestInit.body);
            console.log("[API Request] Headers:", requestInit.headers);

            const response = await fetch(url, requestInit);
            console.log('aqui ', response);
            if (
              response.status === 401 &&
              !refreshedToken &&
              typeof config.refreshAccessToken === "function" &&
              requiresAuth
            ) {
              refreshedToken = true;
              latestAccessToken = await config.refreshAccessToken();

              if (!latestAccessToken) {
                const responseBody = await readResponseBody(response);
                const error = new ApiClientError(
                  `API request failed with status ${response.status}`,
                  response.status,
                  responseBody
                );
                const context = {
                  area: "api" as const,
                  source: path,
                  retryable: false,
                  status: response.status,
                };

                await config.onAuthFailure?.(context);
                if (shouldCapture(options)) {
                  await config.onException?.(error, context);
                  await captureException(error, context);
                } else {
                  suppressException(error);
                }
                throw error;
              }

              attempt -= 1;
              continue;
            }

            if (response.ok) {
              return parseResponse<T>(response, options.parseAs ?? "json");
            }

            const responseBody = await readResponseBody(response);
            const error = new ApiClientError(
              `API request failed with status ${response.status}`,
              response.status,
              responseBody
            );

            if (shouldRetryStatus(response.status, retry, attempt)) {
              await sleep(backoffDelay(retry.baseDelayMs, attempt));
              continue;
            }

            const context = {
              area: "api" as const,
              source: path,
              retryable: false,
              status: response.status,
            };

            if (response.status === 401 && requiresAuth) {
              await config.onAuthFailure?.(context);
            }

            if (shouldCapture(options)) {
              await config.onException?.(error, context);
              await captureException(error, context);
            } else {
              suppressException(error);
            }
            throw error;
          } catch (error) {
            console.log('chegou no catch ', error);
            if (shouldRetryNetworkFailure(error, retry, attempt)) {
              await sleep(backoffDelay(retry.baseDelayMs, attempt));
              continue;
            }

            const normalized = error instanceof Error ? error : new Error(String(error));
            const context = {
              area: "api" as const,
              source: path,
              retryable: isNetworkError(error),
            };
            if (shouldCapture(options)) {
              await config.onException?.(normalized, context);
              await captureException(normalized, context);
            } else {
              suppressException(normalized);
            }
            throw normalized;
          }
        }

        throw new Error("API request exhausted retry attempts");
      },
      {
        area: "api",
        source: path,
      }
    );
  }

  return {
    request,
    get: <T = unknown>(path: string, options: ApiRequestOptions = {}) =>
      request<T>(path, {
        ...options,
        method: "GET",
      }),
    post: <T = unknown>(path: string, options: ApiRequestOptions = {}) =>
      request<T>(path, {
        ...options,
        method: "POST",
      }),
    put: <T = unknown>(path: string, options: ApiRequestOptions = {}) =>
      request<T>(path, {
        ...options,
        method: "PUT",
      }),
    patch: <T = unknown>(path: string, options: ApiRequestOptions = {}) =>
      request<T>(path, {
        ...options,
        method: "PATCH",
      }),
    delete: <T = unknown>(path: string, options: ApiRequestOptions = {}) =>
      request<T>(path, {
        ...options,
        method: "DELETE",
      }),
  };
}

export function formatCurlCommand(url: string, init: RequestInit) {
  const method = (init.method ?? "GET").toUpperCase();
  const sanitizedUrl = escapeSingleQuotes(url);
  const headers = new Headers(init.headers ?? {});
  const headerArgs = Array.from(headers.entries())
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(" ");
  const bodyArg = buildBodyArg(init.body);
  const parts = [`curl -X ${method} '${sanitizedUrl}'`];

  if (headerArgs) {
    parts.push(headerArgs);
  }

  if (bodyArg) {
    parts.push(bodyArg);
  }

  return parts.join(" ");
}

function buildBodyArg(body: BodyInit | null | undefined) {
  if (typeof body === "string") {
    return `--data-raw '${escapeSingleQuotes(body)}'`;
  }

  if (body instanceof URLSearchParams) {
    return `--data-raw '${escapeSingleQuotes(body.toString())}'`;
  }

  return "";
}

function escapeSingleQuotes(value: string) {
  return value.replace(/'/g, "'\\''");
}

async function parseResponse<T>(
  response: Response,
  parseAs: ApiParseMode
): Promise<T> {
  if (parseAs === "response") {
    return response as T;
  }

  if (parseAs === "text") {
    return (await response.text()) as T;
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function buildRequestInit(
  config: ApiClientConfig,
  options: ApiRequestOptions,
  accessToken?: string | null
) {
  const headers = new Headers(config.defaultHeaders ?? {});
  mergeHeaders(headers, options.headers);

  const body = normalizeBody(options.body, headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return {
    ...options,
    body,
    cache: options.cache ?? config.defaultCache,
    headers,
    next: options.next ?? config.defaultNext,
  } as RequestInit & { next?: NextFetchOptions };
}

function normalizeBody(
  body: ApiRequestOptions["body"],
  headers: Headers
): BodyInit | null | undefined {
  if (body == null) {
    return body;
  }

  if (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer
  ) {
    return body;
  }

  headers.set("Content-Type", "application/json");
  return JSON.stringify(body);
}

function mergeHeaders(target: Headers, source?: HeadersInit) {
  if (!source) {
    return;
  }

  new Headers(source).forEach((value, key) => {
    target.set(key, value);
  });
}

function buildUrl(baseUrl: string, path: string, query?: QueryParams) {
  const url = new URL(path, baseUrl);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value == null) {
      continue;
    }
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

function resolveRetryOptions(retry: boolean | ApiRetryOptions | undefined) {
  if (retry === false || retry == null) {
    return {
      attempts: 0,
      baseDelayMs: 250,
      retryOn: DEFAULT_RETRY_STATUSES,
    };
  }

  if (retry === true) {
    return {
      attempts: 2,
      baseDelayMs: 250,
      retryOn: DEFAULT_RETRY_STATUSES,
    };
  }

  return {
    attempts: retry.attempts ?? 2,
    baseDelayMs: retry.baseDelayMs ?? 250,
    retryOn: retry.retryOn ?? DEFAULT_RETRY_STATUSES,
  };
}

function shouldRetryStatus(
  status: number,
  retry: ReturnType<typeof resolveRetryOptions>,
  attempt: number
) {
  return attempt < retry.attempts && retry.retryOn.includes(status);
}

function shouldRetryNetworkFailure(
  error: unknown,
  retry: ReturnType<typeof resolveRetryOptions>,
  attempt: number
) {
  return attempt < retry.attempts && isNetworkError(error);
}

function isNetworkError(error: unknown) {
  return error instanceof TypeError;
}

function backoffDelay(baseDelayMs: number, attempt: number) {
  return baseDelayMs * (attempt + 1);
}

async function sleep(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function readAccessToken(
  getAccessToken: ApiClientConfig["getAccessToken"],
  requireAuth: boolean
) {
  if (!requireAuth || typeof getAccessToken !== "function") {
    return null;
  }

  return getAccessToken();
}

async function readResponseBody(response: Response) {
  const contentType = response.headers.get("Content-Type") ?? "";
  console.log("[readResponseBody] contentType:", contentType);
  console.log("[readResponseBody] response.status:", response.status);

  if (isJsonContentType(contentType)) {
    const cloned = response.clone();
    const text = await cloned.text();
    console.log("[readResponseBody] response text:", text);

    const json = await response.json();
    console.log("[readResponseBody] parsed json:", json);
    return json;
  }

  const text = await response.text();
  console.log("[readResponseBody] response text (not json):", text);
  return text;
}

function isJsonContentType(contentType: string) {
  const normalized = contentType.trim().toLowerCase();

  return normalized.includes("/json") || normalized.includes("+json");
}