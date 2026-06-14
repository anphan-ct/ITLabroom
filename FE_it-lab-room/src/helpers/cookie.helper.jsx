export function getCookieValue(name) {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return cookie.substring(name.length + 1);
}

export function setCookie(name, value, maxAge) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function deleteCookie(name) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}
