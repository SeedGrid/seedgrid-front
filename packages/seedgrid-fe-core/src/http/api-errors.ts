// seedgrid:managed

import { ApiClientError } from "./api-client";

type ApiProblemRecord = Record<string, unknown>;

export function isApiClientErrorLike(
  error: unknown
): error is {
  message?: unknown;
  responseBody?: unknown;
  detail?: unknown;
  status?: unknown;
} {
  return Boolean(error && typeof error === "object");
}

export function extractApiErrorMessage(error: unknown): string | null {
  if (error instanceof ApiClientError) {
    return (
      readApiErrorMessage(error.responseBody) ??
      pickString(error.message)
    );
  }

  if (isApiClientErrorLike(error)) {
    return (
      readApiErrorMessage(error.responseBody) ??
      pickString(error.message) ??
      pickString(error.detail)
    );
  }

  if (error instanceof Error) {
    return pickString(error.message);
  }

  return null;
}

export function readApiErrorMessage(body: unknown): string | null {
  const normalizedBody = normalizeApiBody(body);

  if (!normalizedBody || typeof normalizedBody !== "object") {
    return pickString(normalizedBody);
  }

  const record = normalizedBody as ApiProblemRecord;

  if (Array.isArray(record.violations)) {
    for (const entry of record.violations) {
      const violationMessage = readRecordMessage(entry);

      if (violationMessage) {
        return violationMessage;
      }
    }
  }

  if (Array.isArray(record.errors)) {
    for (const entry of record.errors) {
      const nestedMessage = readRecordMessage(entry);

      if (nestedMessage) {
        return nestedMessage;
      }
    }
  }

  return (
    pickString(record.userMessage) ??
    pickString(record.detail) ??
    pickString(record.message) ??
    pickString(record.error) ??
    pickString(record.title)
  );
}

function normalizeApiBody(body: unknown) {
  if (typeof body !== "string") {
    return body;
  }

  const normalized = body.trim();

  if (!normalized) {
    return body;
  }

  try {
    return JSON.parse(normalized) as unknown;
  } catch {
    return body;
  }
}

function readRecordMessage(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as ApiProblemRecord;

  return (
    pickString(record.userMessage) ??
    pickString(record.message) ??
    pickString(record.error) ??
    pickString(record.description)
  );
}

function pickString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}
