/**
 * apiClient
 * ---------
 * Centralized HTTP client for frontend → backend communication.
 * - No business logic
 * - No orchestration
 * - No agreement-specific knowledge
 */

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiRequestOptions<TBody> {
  method: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
}

export async function apiRequest<TResponse, TBody = unknown>(
  url: string,
  options: ApiRequestOptions<TBody>
): Promise<TResponse> {
  const res = await fetch(url, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let payload: unknown = null;

  try {
    payload = await res.json();
  } catch {
    // response has no JSON body (allowed)
  }

  if (!res.ok) {
    const message =
      (payload as any)?.error ||
      `API request failed with status ${res.status}`;

    throw new ApiError(message, res.status, payload);
  }

  return payload as TResponse;
}
