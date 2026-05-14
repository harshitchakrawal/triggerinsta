const BACKEND_API_PREFIX =
  process.env.NODE_ENV === "production" ? "/api/backend" : "/api";

export function backendUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_API_PREFIX}${normalizedPath}`;
}
