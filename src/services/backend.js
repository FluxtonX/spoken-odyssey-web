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

export async function getProfileFromBackend(token) {
  const response = await backendFetch("/api/auth/me", { token });
  return response.data;
}

/** Get user's albums from MongoDB */
export async function getAlbumsFromBackend(token) {
  const response = await backendFetch("/api/albums", { token });
  return response.data;
}

/** Get a single album's details by ID */
export async function getAlbumDetailsFromBackend(token, albumId) {
  const response = await backendFetch(`/api/albums/${albumId}`, { token });
  return response.data;
}

/** Create a new album with cover photo upload using FormData */
export async function createAlbumOnBackend(token, formData) {
  const response = await backendFetch("/api/albums", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
  return response.data;
}

/** Update an existing album details and cover photo using FormData */
export async function updateAlbumOnBackend(token, albumId, formData) {
  const response = await backendFetch(`/api/albums/${albumId}`, {
    method: "PATCH",
    body: formData,
    token,
    isFormData: true,
  });
  return response.data;
}

/** Get memories from MongoDB */
export async function getMemoriesFromBackend(token) {
  const response = await backendFetch("/api/memories", { token });
  return response.data;
}

/** Create a new memory with media upload (voice blob or photo/video file) using FormData */
export async function createMemoryOnBackend(token, formData) {
  const response = await backendFetch("/api/memories", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
  return response.data;
}

/** Delete a memory from backend */
export async function deleteMemoryOnBackend(token, memoryId) {
  const response = await backendFetch(`/api/memories/${memoryId}`, {
    method: "DELETE",
    token,
  });
  return response.data;
}

/** Update an existing memory details and files using FormData */
export async function updateMemoryOnBackend(token, memoryId, formData) {
  const response = await backendFetch(`/api/memories/${memoryId}`, {
    method: "PATCH",
    body: formData,
    token,
    isFormData: true,
  });
  return response.data;
}

/** Get personalized feed memories from MongoDB */
export async function getFeedFromBackend(token) {
  const response = await backendFetch("/api/memories/feed", { token });
  return response.data;
}

/** Track memory interaction (view/like/comment) on backend */
export async function interactWithMemoryOnBackend(token, memoryId, type) {
  const response = await backendFetch(`/api/memories/${memoryId}/interact`, {
    method: "POST",
    body: { type },
    token,
  });
  return response.data;
}

export async function getMemoryDetailsFromBackend(token, memoryId) {
  const response = await backendFetch(`/api/memories/${memoryId}`, { token });
  return response.data;
}

export function getBackendErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error instanceof BackendError) return error.message || fallback;
  if (error?.message) return error.message;
  return fallback;
}
