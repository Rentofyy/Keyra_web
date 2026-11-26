import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set("keyra_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days matching JWT validity
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to establish session" }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("keyra_session")?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, token: null });
  }

  return NextResponse.json({ isAuthenticated: true, token });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("keyra_session");
  return NextResponse.json({ success: true });
}
