/**
 * HTTP client for spokenOdessie_backend (Express API).
 * Backend routes: POST /api/auth/sync, GET /api/auth/me, PUT /api/auth/profile
 * Default port matches spokenOdessie_backend/.env.local → PORT=5001
 */

export class BackendError extends Error {
  constructor(message, status = 500, payload = null) {
    super(message);
    this.name = "BackendError";
    this.status = status;
    this.payload = payload;
  }
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5001");

async function backendFetch(path, { method = "GET", body, token, isFormData = false } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    throw new BackendError(
      payload?.message || `Request failed (${response.status})`,
      response.status,
      payload
    );
  }

  return payload;
}

/** Sync Firebase user → MongoDB (spokenOdessie_backend auth.controller syncUser) */
export async function syncUserWithBackend(token) {
  const response = await backendFetch("/api/auth/sync", { method: "POST", token });
  return response.data;
}

/** Get current user profile from MongoDB (spokenOdessie_backend auth.controller getMe) */
export async function getProfileFromBackend(token) {
  const response = await backendFetch("/api/auth/me", { token });
  return response.data;
}

export function getBackendErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error instanceof BackendError) return error.message || fallback;
  if (error?.message) return error.message;
  return fallback;
}
