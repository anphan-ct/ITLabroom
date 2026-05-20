import { AUTH_ROLES } from "../interfaces/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const AUTH_COOKIE_KEY = "it_lab_room_auth";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const AUTH_ENDPOINTS = {
  [AUTH_ROLES.ADMIN]: "/api/auth/admin/login",
  [AUTH_ROLES.STUDENT]: "/api/auth/students/login",
  [AUTH_ROLES.TEACHER]: "/api/auth/teachers/login",
};

/**
 * Chuẩn hóa lỗi trả về từ backend để UI hiển thị rõ ràng.
 *
 * @param {Response} response
 * @returns {Promise<Error>}
 */
async function buildApiError(response) {
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const message = payload?.message || "Không thể kết nối đến máy chủ";
  const error = new Error(message);
  error.status = response.status;
  error.payload = payload;

  return error;
}

function getCookieValue(name) {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return cookie.substring(name.length + 1);
}

function setCookie(name, value, maxAge = AUTH_COOKIE_MAX_AGE) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/**
 * Gọi API đăng nhập theo từng vai trò.
 *
 * @param {import("../interfaces/auth").AuthRole} role
 * @param {import("../interfaces/auth").LoginPayload} credentials
 * @returns {Promise<import("../interfaces/auth").ApiResponse>}
 */
export async function loginByRole(role, credentials) {
  const endpoint = AUTH_ENDPOINTS[role];

  if (!endpoint) {
    throw new Error("Vai trò đăng nhập không hợp lệ");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email?.trim(),
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    throw await buildApiError(response);
  }

  return response.json();
}

/**
 * Lưu phiên đăng nhập Sanctum vào cookie để các màn sau dùng Bearer token.
 *
 * @param {import("../interfaces/auth").AuthRole} role
 * @param {import("../interfaces/auth").AuthData} authData
 */
export function saveAuthSession(role, authData) {
  const session = {
    role,
    tokenType: authData.token_type,
    accessToken: authData.access_token,
    user: authData.user,
  };

  setCookie(AUTH_COOKIE_KEY, encodeURIComponent(JSON.stringify(session)));
}

export function getAuthSession() {
  const rawSession = getCookieValue(AUTH_COOKIE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(rawSession));
  } catch {
    deleteCookie(AUTH_COOKIE_KEY);
    return null;
  }
}

export function clearAuthSession() {
  deleteCookie(AUTH_COOKIE_KEY);
}

export function getAuthToken() {
  return getAuthSession()?.accessToken || null;
}

export { AUTH_COOKIE_KEY };
