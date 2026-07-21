const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const AUTH_TOKEN_KEY = "garud_auth_token";
const LEGACY_AUTH_TOKEN_KEY = "garud_token";
export const WORKFLOW_UPDATED_EVENT = "garud-workflow-updated";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T> {
  status: "ok" | "error";
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown> | FormData | null;
  auth?: boolean;
}

interface UploadOptions {
  onProgress?: (progress: number) => void;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ValidationError {
  msg?: string;
}

function getErrorMessage(payload: unknown) {
  if (typeof payload === "object" && payload) {
    if ("message" in payload && payload.message) {
      return String(payload.message);
    }

    if ("errors" in payload && Array.isArray(payload.errors)) {
      const messages = payload.errors
        .map((error: ValidationError) => error.msg)
        .filter(Boolean);

      if (messages.length > 0) {
        return messages.join(", ");
      }
    }
  }

  return "Request failed";
}

function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const localToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (localToken) {
      return localToken;
    }

    const legacyToken = window.localStorage.getItem(LEGACY_AUTH_TOKEN_KEY);
    if (legacyToken) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, legacyToken);
      window.localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
      return legacyToken;
    }
  } catch {
    return null;
  }

  return null;
}

function buildHeaders(options: RequestOptions) {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false) {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
}

function buildBody(body: RequestOptions["body"]) {
  if (body == null || body instanceof FormData || body instanceof Blob || body instanceof URLSearchParams) {
    return body as BodyInit | null;
  }

  if (typeof body === "object") {
    return JSON.stringify(body);
  }

  return body;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const headers = buildHeaders(options);
  const body = buildBody(options.body);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method: options.method ?? "GET",
    headers,
    body,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      setAuthToken(null);
    }

    throw new ApiError(getErrorMessage(payload), response.status);
  }

  return (payload as ApiResponse<T>) ?? { status: "ok" };
}

export function uploadApiFile<T>(path: string, formData: FormData, options: UploadOptions = {}) {
  return new Promise<ApiResponse<T>>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${API_BASE_URL}${path}`);

    const token = getStoredToken();
    if (token) {
      request.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    request.upload.onprogress = (event) => {
      if (event.lengthComputable && options.onProgress) {
        options.onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    request.onload = () => {
      const contentType = request.getResponseHeader("content-type") ?? "";
      const payload = contentType.includes("application/json") && request.responseText
        ? JSON.parse(request.responseText)
        : request.responseText;

      if (request.status < 200 || request.status >= 300) {
        if (request.status === 401) {
          setAuthToken(null);
        }

        reject(new ApiError(getErrorMessage(payload), request.status));
        return;
      }

      resolve((payload as ApiResponse<T>) ?? { status: "ok" });
    };

    request.onerror = () => {
      reject(new ApiError("Upload failed", request.status || 0));
    };

    request.send(formData);
  });
}

export function notifyWorkflowUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(WORKFLOW_UPDATED_EVENT));
}

function getFilenameFromDisposition(disposition: string | null, fallbackFilename: string) {
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? fallbackFilename;
}

export async function downloadApiFile(path: string, fallbackFilename: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: buildHeaders({}),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json") ? await response.json() : await response.text();

    if (response.status === 401) {
      setAuthToken(null);
    }

    throw new ApiError(getErrorMessage(payload), response.status);
  }

  const blob = await response.blob();
  const filename = getFilenameFromDisposition(response.headers.get("content-disposition"), fallbackFilename);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function getAuthToken() {
  return getStoredToken();
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);

    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      return;
    }

    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // Storage can be unavailable in restricted browser modes.
  }
}
