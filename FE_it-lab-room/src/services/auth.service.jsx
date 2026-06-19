import { CONST_APIS } from "../constants/apis.constant";
import { CONST_METHODS } from "../constants/methods.constant";
import { AUTH_ROLES } from "../constants/roles.constant";
import { AUTH_COOKIE_KEY, AUTH_COOKIE_MAX_AGE } from "../constants/storage.constant";
import { deleteCookie, getCookieValue, setCookie } from "../helpers/cookie.helper";
import { fetcher } from "../helpers/fetcher.helper";

const AUTH_ENDPOINTS = {
  [AUTH_ROLES.ADMIN]: CONST_APIS.AUTH.ADMIN_LOGIN,
  [AUTH_ROLES.STUDENT]: CONST_APIS.AUTH.STUDENT_LOGIN,
  [AUTH_ROLES.TEACHER]: CONST_APIS.AUTH.TEACHER_LOGIN,
};

/**
 * Gọi API đăng nhập theo từng vai trò.
 *
 * @param {import("../interfaces/model/IAuth.interface").AuthRole} role
 * @param {import("../interfaces/model/IAuth.interface").LoginPayload} credentials
 * @returns {Promise<import("../interfaces/model/IAuth.interface").ApiResponse>}
 */
export async function loginByRole(role, credentials) {
  const endpoint = AUTH_ENDPOINTS[role];

  if (!endpoint) {
    throw new Error("Vai trò đăng nhập không hợp lệ");
  }

  return fetcher(endpoint, {
    method: CONST_METHODS.POST,
    body: {
      email: credentials.email?.trim(),
      password: credentials.password,
    },
  });
}

/**
 * Lưu phiên đăng nhập Sanctum vào cookie để các màn sau dùng Bearer token.
 *
 * @param {import("../interfaces/model/IAuth.interface").AuthRole} role
 * @param {import("../interfaces/model/IAuth.interface").AuthData} authData
 */
export function saveAuthSession(role, authData) {
  const session = {
    role,
    tokenType: authData.token_type,
    accessToken: authData.access_token,
    user: authData.user,
  };

  setCookie(AUTH_COOKIE_KEY, encodeURIComponent(JSON.stringify(session)), AUTH_COOKIE_MAX_AGE);
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

export async function loginWithGoogleAPI(credential, role = AUTH_ROLES.STUDENT) {
  const GOOGLE_LOGIN_ENDPOINTS = {
    [AUTH_ROLES.STUDENT]: '/api/auth/students/google-login',
    [AUTH_ROLES.TEACHER]: '/api/auth/teachers/google-login',
    [AUTH_ROLES.ADMIN]: '/api/auth/admin/google-login',
  };

  const endpoint = GOOGLE_LOGIN_ENDPOINTS[role];

  if (!endpoint) {
    throw new Error('Vai trò không hợp lệ cho Google Login');
  }

  return fetcher(endpoint, {
    method: CONST_METHODS.POST,
    body: { credential },
  });
}