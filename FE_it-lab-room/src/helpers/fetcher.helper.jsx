import { API_BASE_URL } from "../constants/apis.constant";
import { getAuthToken } from "../services/auth.service";

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

export async function fetcher(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== "string"
      ? JSON.stringify(options.body)
      : options.body,
  });

  if (!response.ok) {
    throw await buildApiError(response);
  }

  return response.json();
}
