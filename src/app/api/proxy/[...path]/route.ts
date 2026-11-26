import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_BASE =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://keyra-backend-803170070973.asia-south1.run.app/api/v1";

async function forwardRequest(req: NextRequest, params: { path: string[] }) {
  const path = params.path.join("/");
  const searchParams = req.nextUrl.searchParams.toString();
  const targetUrl = `${BACKEND_BASE}/${path}${searchParams ? `?${searchParams}` : ""}`;

  // Read cookies for session token
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("keyra_session")?.value;

  // Clone headers
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    // Skip host header to let destination handle it
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  // Attach session token as Bearer if not already present
  if (sessionToken && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${sessionToken}`);
  }

  const method = req.method;
  const isBodyAllowed = !["GET", "HEAD", "OPTIONS"].includes(method);
  let body: BodyInit | null = null;

  if (isBodyAllowed) {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      body = await req.formData();
      // Remove content-type header so fetch calculates the proper multipart boundary
      headers.delete("content-type");
    } else {
      body = await req.text();
    }
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: "follow",
    });

    const responseHeaders = new Headers();
    backendRes.headers.forEach((val, key) => {
      // Skip chunked encoding transfer-encoding
      if (key.toLowerCase() !== "transfer-encoding") {
        responseHeaders.set(key, val);
      }
    });

    const data = await backendRes.arrayBuffer();
    return new NextResponse(data, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Proxy connection error", message: err.message },
      { status: 502 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return forwardRequest(req, params);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return forwardRequest(req, params);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return forwardRequest(req, params);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return forwardRequest(req, params);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return forwardRequest(req, params);
}
