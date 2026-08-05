/**
 * HTTP client for spokenOdessie_backend (Express API).
 * Backend routes: POST /api/auth/sync, GET /api/auth/me, PUT /api/auth/profile
 * Default port matches spokenOdessie_backend/.env.local → PORT=5001
 */

import { getCachedData, setCachedData, invalidateCachePattern } from "@/lib/cache";

export class BackendError extends Error {
  constructor(message, status = 500, payload = null) {
    super(message);
    this.name = "BackendError";
    this.status = status;
    this.payload = payload;
  }
}

const BACKEND_URL = (() => {
  const customUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  // If page is loaded over HTTPS in browser, insecure http:// calls are blocked by browser Mixed Content policy.
  // Route through Next.js proxy rewrites ("") server-side instead to avoid browser security blocking.
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    customUrl?.startsWith("http://")
  ) {
    return "";
  }
  return customUrl || (process.env.NODE_ENV === "production" ? "" : "http://localhost:5001");
})();

export function getBackendBaseUrl() {
  return BACKEND_URL;
}

export function normalizeMediaUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Data URLs (base64) & full http(s) URLs are returned as-is
  if (trimmed.startsWith("data:") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Blob URLs
  if (trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // Relative backend upload path (e.g. "/uploads/..." or "uploads/...")
  const base = getBackendBaseUrl();
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return base ? `${base}${path}` : path;
}

async function backendFetch(path, { method = "GET", body, token, isFormData = false } = {}) {
  const headers = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    cache: "no-store",
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
  const cacheKey = `profile_${token ? token.slice(-16) : "public"}`;
  const cached = getCachedData(cacheKey, 3 * 60 * 1000);
  if (cached) return cached;

  const response = await backendFetch("/api/auth/me", { token });
  if (response?.data) setCachedData(cacheKey, response.data);
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
  invalidateCachePattern("profile_");
  return response.data;
}

/** Get user's albums from MongoDB */
export async function getAlbumsFromBackend(token) {
  const cacheKey = `albums_${token ? token.slice(-16) : "public"}`;
  const cached = getCachedData(cacheKey, 3 * 60 * 1000);
  if (cached) return cached;

  const response = await backendFetch("/api/albums", { token });
  if (response?.data) setCachedData(cacheKey, response.data);
  return response.data;
}

/** Get a single album's details by ID */
export async function getAlbumDetailsFromBackend(token, albumId) {
  const cacheKey = `album_detail_${albumId}_${token ? token.slice(-16) : "public"}`;
  const cached = getCachedData(cacheKey, 3 * 60 * 1000);
  if (cached) return cached;

  const response = await backendFetch(`/api/albums/${albumId}`, { token });
  if (response?.data) setCachedData(cacheKey, response.data);
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
  invalidateCachePattern("album");
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
  invalidateCachePattern("album");
  return response.data;
}

/** Delete an album from backend */
export async function deleteAlbumOnBackend(token, albumId) {
  const response = await backendFetch(`/api/albums/${albumId}`, {
    method: "DELETE",
    token,
  });
  invalidateCachePattern("album");
  return response.data;
}

/** Get memories from MongoDB */
export async function getMemoriesFromBackend(token, userId = null) {
  const cacheKey = `memories_${userId || "all"}_${token ? token.slice(-16) : "public"}`;
  const cached = getCachedData(cacheKey, 3 * 60 * 1000);
  if (cached) return cached;

  const path = userId ? `/api/memories?userId=${userId}` : "/api/memories";
  const response = await backendFetch(path, { token });
  if (response?.data) setCachedData(cacheKey, response.data);
  return response.data;
}

/** Get family shared memories */
export async function getFamilySharedMemories(token) {
  const cacheKey = `family_shared_${token ? token.slice(-16) : "public"}`;
  const cached = getCachedData(cacheKey, 3 * 60 * 1000);
  if (cached) return cached;

  try {
    const response = await backendFetch("/api/family-circle/shared-memories", { token });
    const resData = response?.data !== undefined ? response.data : response;
    if (resData) setCachedData(cacheKey, resData);
    return resData;
  } catch (err) {
    if (err?.status === 404) {
      const fallback = await backendFetch("/api/memories/family-shared", { token });
      const fbData = fallback?.data !== undefined ? fallback.data : fallback;
      if (fbData) setCachedData(cacheKey, fbData);
      return fbData;
    }
    throw err;
  }
}

/** Create a new memory with media upload (voice blob or photo/video file) using FormData */
export async function createMemoryOnBackend(token, formData) {
  const response = await backendFetch("/api/memories", {
    method: "POST",
    body: formData,
    token,
    isFormData: true,
  });
  invalidateCachePattern("memories_|family_shared_|album_");
  return response.data;
}

/** Delete a memory from backend */
export async function deleteMemoryOnBackend(token, memoryId) {
  const response = await backendFetch(`/api/memories/${memoryId}`, {
    method: "DELETE",
    token,
  });
  invalidateCachePattern("memories_|family_shared_|album_");
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
  invalidateCachePattern("memories_|family_shared_|album_");
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

/** Track memory share on backend */
export async function shareMemoryOnBackend(token, memoryId) {
  const response = await backendFetch(`/api/memories/${memoryId}/share`, {
    method: "POST",
    token,
  });
  return response.data;
}

/** React to memory with specific emotion (heart, like, care, haha, wow, angry) */
export async function reactToMemoryOnBackend(token, memoryId, reactionType) {
  return reactToMemory(token, memoryId, reactionType);
}

/** Fetch comments for a specific memory */
export async function getMemoryCommentsFromBackend(token, memoryId) {
  const response = await backendFetch(`/api/memories/${memoryId}/comments`, { token });
  return response.data;
}

/** Add a new comment or reply to a memory */
export async function addMemoryCommentOnBackend(token, memoryId, text, parentCommentId = null) {
  const response = await backendFetch(`/api/memories/${memoryId}/comments`, {
    method: "POST",
    body: { text, parentCommentId },
    token,
  });
  return response.data;
}

/** React to a comment on a memory */
export async function reactToCommentOnBackend(token, memoryId, commentId, type = "like") {
  const response = await backendFetch(`/api/memories/${memoryId}/comments/${commentId}/react`, {
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
export async function getDiscoveryMemories(token, filter, theme, searchQuery = "", page = 1, limit = 20) {
  const query = `filter=${encodeURIComponent(filter || "")}&theme=${encodeURIComponent(theme || "")}&q=${encodeURIComponent(searchQuery || "")}&page=${page}&limit=${limit}`;
  const response = await backendFetch(`/api/memories/discovery?${query}`, { token });
  return {
    data: response.data || [],
    pagination: response.pagination || null
  };
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

/** Get featured people for discovery */
export async function getFeaturedPeople(token, category = "", query = "") {
  const qStr = `category=${encodeURIComponent(category || "")}&q=${encodeURIComponent(query || "")}`;
  const response = await backendFetch(`/api/users/featured?${qStr}`, { token });
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

/** Send SMS invitation */
export async function sendSMSInvitation(token, { phoneNumber, countryCode, relationship } = {}) {
  const response = await backendFetch("/api/users/family/invitations/sms", {
    method: "POST",
    body: { phoneNumber, countryCode, relationship },
    token,
  });
  return response.data;
}

/** Create shareable link invitation */
export async function createLinkInvitation(token, { relationship } = {}) {
  const response = await backendFetch("/api/users/family/invitations/link", {
    method: "POST",
    body: { relationship },
    token,
  });
  return response.data || response;
}

/** Create QR code invitation */
export async function createQRInvitation(token, { relationship } = {}) {
  const response = await backendFetch("/api/users/family/invitations/qr", {
    method: "POST",
    body: { relationship },
    token,
  });
  return response.data;
}

/** Validate invitation token (for join via link/QR) */
export async function validateInvitationToken(token) {
  const response = await backendFetch(`/api/users/family/invitations/validate?token=${token}`);
  return response.data;
}

/** Accept invitation via token (for link/QR joins) */
export async function acceptInvitationViaToken(token, { invitationToken } = {}) {
  const response = await backendFetch("/api/users/family/invitations/accept-token", {
    method: "POST",
    body: { token: invitationToken },
    token,
  });
  return response.data;
}

/** Get notifications for user */
export async function getNotifications(token, { unreadOnly = false, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (unreadOnly) params.append('unreadOnly', 'true');
  if (limit) params.append('limit', limit.toString());
  
  const response = await backendFetch(`/api/notifications?${params.toString()}`, { token });
  return response.data;
}

/** Get unread notification count */
export async function getUnreadNotificationCount(token) {
  const response = await backendFetch("/api/notifications/unread-count", { token });
  return response.data;
}

/** Mark notification as read */
export async function markNotificationAsRead(token, notificationId) {
  const response = await backendFetch(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    token,
  });
  return response.data;
}

/** Mark all notifications as read */
export async function markAllNotificationsAsRead(token) {
  const response = await backendFetch("/api/notifications/read-all", {
    method: "PATCH",
    token,
  });
  return response.data;
}

/** Delete notification */
export async function deleteNotification(token, notificationId) {
  const response = await backendFetch(`/api/notifications/${notificationId}`, {
    method: "DELETE",
    token,
  });
  return response.data;
}

/** Get family circle members (new API) */
export async function getFamilyCircleMembers(token) {
  const response = await backendFetch("/api/family-circle/members", { token });
  return response?.data !== undefined ? response.data : response;
}

/** Check if user is family admin */
export async function isFamilyAdmin(token) {
  const response = await backendFetch("/api/family-circle/is-admin", { token });
  return response?.data !== undefined ? response.data : response;
}

/** Get pending approvals for admin */
export async function getPendingApprovals(token) {
  const response = await backendFetch("/api/family-circle/pending-approvals", { token });
  return response?.data !== undefined ? response.data : response;
}

/** Approve pending invitation (admin only) */
export async function approveInvitation(token, invitationId) {
  const response = await backendFetch(`/api/family-circle/approvals/${invitationId}/approve`, {
    method: "POST",
    token,
  });
  return response?.data !== undefined ? response.data : response;
}

/** Decline pending invitation (admin only) */
export async function declineApproval(token, invitationId) {
  const response = await backendFetch(`/api/family-circle/approvals/${invitationId}/decline`, {
    method: "POST",
    token,
  });
  return response?.data !== undefined ? response.data : response;
}

/** Promote member to admin (admin only) */
export async function promoteToAdmin(token, userId) {
  const response = await backendFetch(`/api/family-circle/members/${userId}/promote`, {
    method: "POST",
    token,
  });
  return response.data;
}

/** Demote admin to member (admin only) */
export async function demoteFromAdmin(token, userId) {
  const response = await backendFetch(`/api/family-circle/members/${userId}/demote`, {
    method: "POST",
    token,
  });
  return response.data;
}

/** Remove member from family circle (admin only) */
export async function removeFamilyMember(token, userId) {
  const response = await backendFetch(`/api/family-circle/members/${userId}`, {
    method: "DELETE",
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
    body: { type, reactionType: type },
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

/** Get user's legacy access settings */
export async function getLegacySettings(token) {
  const response = await backendFetch("/api/legacy-access", { token });
  return response?.data !== undefined ? response.data : response;
}

/** Update user's legacy access settings */
export async function updateLegacySettings(token, settingsData) {
  const response = await backendFetch("/api/legacy-access", {
    method: "PUT",
    body: settingsData,
    token,
  });
  return response?.data !== undefined ? response.data : response;
}

/** Get connected family members for legacy administrator selection */
export async function getFamilyFromBackend(token) {
  try {
    const response = await backendFetch("/api/users/family", { token });
    return response?.data !== undefined ? response.data : response;
  } catch (_) {
    return getFamilyCircleMembers(token);
  }
}

/** Get user profile details by ID from backend */
export async function getUserProfileFromBackend(token, userId) {
  if (!userId) return null;
  const response = await backendFetch(`/api/users/${userId}`, { token });
  return response.data;
}

/** Get live family badge count for logged-in user */
export async function getFamilyBadgeCount(token) {
  try {
    const response = await backendFetch("/api/users/family/badge-count", { token });
    return response?.data !== undefined ? response.data : { count: 0 };
  } catch (_) {
    return { count: 0 };
  }
}

/** Mark all family activity/notifications as seen for logged-in user */
export async function markFamilySeen(token) {
  try {
    const response = await backendFetch("/api/users/family/mark-seen", {
      method: "POST",
      token,
    });
    return response?.data !== undefined ? response.data : { success: true };
  } catch (_) {
    return { success: true };
  }
}

export function getBackendErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error instanceof BackendError) return error.message || fallback;
  if (error?.message) return error.message;
  return fallback;
}
