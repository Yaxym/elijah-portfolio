import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const user = process.env.ADMIN_USER || "";
  const pass = process.env.ADMIN_PASS || "";

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const b64 = auth.replace("Basic ", "");
  const [u, p] = Buffer.from(b64, "base64").toString().split(":");

  if (u === user && p === pass) {
    return NextResponse.next();
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export const config = {
  matcher: ["/admin/:path*"],
};