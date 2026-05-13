const BACKEND_API_PREFIX = "/api/backend";

export function backendUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_API_PREFIX}${normalizedPath}`;
}
