import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BACKEND_URL = "http://triggerflow.railway.internal";

function getBackendBaseUrl() {
  const configuredUrl = (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    DEFAULT_BACKEND_URL
  ).replace(/\/+$/, "");

  if (/^https?:\/\//i.test(configuredUrl)) {
    return configuredUrl;
  }

  return `http://${configuredUrl}`;
}

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const requestUrl = new URL(request.url);
  const backendPath = path.map(encodeURIComponent).join("/");
  const backendUrl = new URL(
    `/api/${backendPath}${requestUrl.search}`,
    getBackendBaseUrl()
  );

  const headers = new Headers(request.headers);
  const host = request.headers.get("host");

  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");
  headers.delete("keep-alive");
  headers.delete("proxy-authenticate");
  headers.delete("proxy-authorization");
  headers.delete("te");
  headers.delete("trailer");
  headers.delete("transfer-encoding");
  headers.delete("upgrade");

  if (host) {
    headers.set("x-forwarded-host", host);
  }
  headers.set("x-forwarded-proto", requestUrl.protocol.replace(":", ""));

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(backendUrl, init);
    const responseHeaders = new Headers(response.headers);

    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[backend proxy]", error);
    return NextResponse.json(
      { error: "Backend service unavailable" },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const HEAD = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
