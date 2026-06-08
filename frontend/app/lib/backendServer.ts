// Server-side helper for calling the Django backend with the internal shared
// secret. Use this from server contexts (NextAuth callbacks, OAuth handshake)
// that need backend data but have no incoming request to proxy.

const BASE = (process.env.BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

export async function callBackend(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  if (process.env.INTERNAL_API_SECRET) {
    headers.set("x-internal-secret", process.env.INTERNAL_API_SECRET);
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${BASE}/api${normalized}`, { ...init, headers, cache: "no-store" });
}
