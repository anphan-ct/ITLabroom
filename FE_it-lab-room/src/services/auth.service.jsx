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
