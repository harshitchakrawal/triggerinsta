const BACKEND_API_PREFIX = "/api";

export function backendUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_API_PREFIX}${normalizedPath}`;
}
