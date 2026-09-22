const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ============================================================
   AUTH TOKEN STORAGE
============================================================ */

const TOKEN_KEY = "meivn_auth_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ============================================================
   AUTH
============================================================ */

async function authRequest(path, body) {
  const response = await fetch(`${API_BASE_URL}/api/auth${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export async function signup({ name, email, password, username }) {
  const data = await authRequest("/signup", { name, email, password, username });
  setToken(data.token);
  return data.user;
}

export async function login({ email, password }) {
  const data = await authRequest("/login", { email, password });
  setToken(data.token);
  return data.user;
}

export async function loginWithGoogle(credential) {
  const data = await authRequest("/google", { credential });
  setToken(data.token);
  return data.user;
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { ...authHeaders() },
  });

  if (!response.ok) {
    throw new Error("Not signed in");
  }

  return response.json();
}

export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { ...authHeaders() },
    });
  } finally {
    // Sign out of this device regardless of whether the request reached the
    // server — the account and all its data stay exactly as they are.
    clearToken();
  }
}

export async function createTask(userRequest) {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      user_request: userRequest,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

export async function getTask(taskId) {
  const response = await fetch(
    `${API_BASE_URL}/api/tasks/${taskId}`,
    { headers: { ...authHeaders() } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }

  return response.json();
}

export async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    headers: { ...authHeaders() },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function deleteTask(taskId) {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  return true;
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Backend is not running");
  }

  return response.json();
}

/* ============================================================
   SETTINGS — generic request helper
============================================================ */

async function settingsRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/settings${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }
    throw new Error(`Settings request failed: ${path}`);
  }

  if (response.status === 204) {
    return true;
  }

  return response.json();
}

export const getAllSettings = () => settingsRequest("");

/* --- Account --- */
export const getAccountSettings = () => settingsRequest("/account");
export const updateAccountSettings = (payload) =>
  settingsRequest("/account", { method: "PATCH", body: JSON.stringify(payload) });
export const changePassword = (newPassword) =>
  settingsRequest("/account/change-password", {
    method: "POST",
    body: JSON.stringify({ new_password: newPassword }),
  });
export const deleteAccount = () => settingsRequest("/account", { method: "DELETE" });

/* --- Appearance --- */
export const getAppearanceSettings = () => settingsRequest("/appearance");
export const updateAppearanceSettings = (payload) =>
  settingsRequest("/appearance", { method: "PATCH", body: JSON.stringify(payload) });

/* --- Privacy & Data --- */
export const getPrivacySettings = () => settingsRequest("/privacy");
export const updatePrivacySettings = (payload) =>
  settingsRequest("/privacy", { method: "PATCH", body: JSON.stringify(payload) });
export const exportMyData = () => settingsRequest("/privacy/export");
export const clearAllConversations = () =>
  settingsRequest("/privacy/conversations", { method: "DELETE" });

/* --- Security --- */
export const getSecuritySettings = () => settingsRequest("/security");
export const updateSecuritySettings = (payload) =>
  settingsRequest("/security", { method: "PATCH", body: JSON.stringify(payload) });
export const getSessions = () => settingsRequest("/security/sessions");
export const getLoginHistory = () => settingsRequest("/security/login-history");
export const revokeSession = (sessionId) =>
  settingsRequest(`/security/sessions/${sessionId}`, { method: "DELETE" });
export const revokeAllSessions = () =>
  settingsRequest("/security/sessions", { method: "DELETE" });