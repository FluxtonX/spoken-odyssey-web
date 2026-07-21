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

/** Custom JWT Auth endpoints */
export async function loginWithBackend(email, password) {
  const response = await backendFetch("/api/auth/login", { 
    method: "POST", 
    body: { email, password } 
  });
  return response; // Contains token and data
}

export async function registerWithBackend(userData) {
  const response = await backendFetch("/api/auth/register", { 
    method: "POST", 
    body: userData 
  });
  return response; // Contains token and data
}

export async function googleLoginWithBackend(googleToken) {
  const response = await backendFetch("/api/auth/google", { 
    method: "POST", 
    body: { googleToken } 
  });
  return response; // Contains token and data
}

/** Sync Firebase user → MongoDB (deprecated logic but kept for backward compatibility) */
export async function syncUserWithBackend(token) {
  const response = await backendFetch("/api/auth/sync", { method: "POST", token });
  return response.data;
}

export async function getProfileFromBackend(token) {
  const response = await backendFetch("/api/auth/me", { token });
  return response.data;
}

export async function verifyMockEmailOnBackend(token, code) {
  const response = await backendFetch("/api/auth/verify-mock", {
    method: "POST",
    body: { code },
    token,
  });
  return response.data;
}

export async function updateProfileOnBackend(token, formData) {
  const response = await backendFetch("/api/auth/profile", {
    method: "PUT",
    body: formData,
    token,
    isFormData: true,
  });
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
export async function getMemoriesFromBackend(token, userId = null) {
  const path = userId ? `/api/memories?userId=${userId}` : "/api/memories";
  const response = await backendFetch(path, { token });
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

/** Get discovery filter memories */
export async function getDiscoveryMemories(token, filter, theme) {
  const query = `filter=${filter || ""}&theme=${theme || ""}`;
  const response = await backendFetch(`/api/memories/discovery?${query}`, { token });
  return response.data;
}

/** Search archive (memories, albums, users) on backend */
export async function searchOnBackend(token, query, type = "all") {
  const qStr = `q=${encodeURIComponent(query || "")}&type=${encodeURIComponent(type)}`;
  const response = await backendFetch(`/api/search?${qStr}`, { token });
  return response.data;
}

/** Get suggested profiles to connect with */
export async function getSuggestedPeople(token) {
  const response = await backendFetch("/api/users/discovery", { token });
  return response.data;
}

/** Get list of connected family members */
export async function getFamilyMembers(token) {
  const response = await backendFetch("/api/users/family", { token });
  return response.data;
}

/** Bidirectionally connect family member */
export async function connectFamilyMember(token, { targetUid, email, relationship } = {}) {
  const response = await backendFetch("/api/users/family", {
    method: "POST",
    body: { firebaseUid: targetUid, email, relationship },
    token,
  });
  return response.data;
}

/** Bidirectionally disconnect family member */
export async function disconnectFamilyMember(token, targetUid) {
  const response = await backendFetch(`/api/users/family/${targetUid}`, {
    method: "DELETE",
    token,
  });
  return response.data;
}

/** Get pending family invitations */
export async function getFamilyInvitations(token) {
  const response = await backendFetch("/api/users/family/invitations", { token });
  return response.data;
}

/** Accept family invitation */
export async function acceptFamilyInvitation(token, invitationId) {
  const response = await backendFetch(`/api/users/family/invitations/${invitationId}/accept`, {
    method: "POST",
    token,
  });
  return response.data;
}

/** Decline family invitation */
export async function declineFamilyInvitation(token, invitationId) {
  const response = await backendFetch(`/api/users/family/invitations/${invitationId}/decline`, {
    method: "POST",
    token,
  });
  return response.data;
}

/** Get comments tree for a memory */
export async function getComments(token, memoryId) {
  const response = await backendFetch(`/api/memories/${memoryId}/comments`, { token });
  return response.data;
}

/** Add comment/reply to a memory */
export async function addComment(token, memoryId, text, parentCommentId = null) {
  const response = await backendFetch(`/api/memories/${memoryId}/comments`, {
    method: "POST",
    body: { text, parentCommentId },
    token,
  });
  return response.data;
}

/** React to a comment */
export async function reactToComment(token, memoryId, commentId, type) {
  const response = await backendFetch(`/api/memories/${memoryId}/comments/${commentId}/react`, {
    method: "POST",
    body: { type },
    token,
  });
  return response.data;
}

/** React to a memory */
export async function reactToMemory(token, memoryId, type) {
  const response = await backendFetch(`/api/memories/${memoryId}/react`, {
    method: "POST",
    body: { type },
    token,
  });
  return response.data;
}

/** Increment share count */
export async function shareMemoryOnBackend(token, memoryId) {
  const response = await backendFetch(`/api/memories/${memoryId}/share`, {
    method: "POST",
    token,
  });
  return response.data;
}

export async function followUser(token, targetUid) {
  const response = await backendFetch(`/api/users/follow/${targetUid}`, {
    method: "POST",
    token,
  });
  return response.data;
}

export async function unfollowUser(token, targetUid) {
  const response = await backendFetch(`/api/users/follow/${targetUid}`, {
    method: "DELETE",
    token,
  });
  return response.data;
}

export async function getFollowers(token) {
  const response = await backendFetch("/api/users/followers", { token });
  return response.data;
}

export async function getFollowing(token) {
  const response = await backendFetch("/api/users/following", { token });
  return response.data;
}

export async function sendHeartbeat(token) {
  try {
    const response = await backendFetch("/api/users/heartbeat", {
      method: "POST",
      token,
    });
    return response?.data;
  } catch (_) {
    return null;
  }
}

export function getBackendErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error instanceof BackendError) return error.message || fallback;
  if (error?.message) return error.message;
  return fallback;
}
