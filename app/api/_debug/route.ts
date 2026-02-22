import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    hasUrl: !!process.env.SUPABASE_URL,
    hasAnon: !!process.env.SUPABASE_ANON_KEY,
    hasService: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    adminUser: !!process.env.ADMIN_USER,
    adminPass: !!process.env.ADMIN_PASS,
    urlStartsWithHttps:
      (process.env.SUPABASE_URL || "").startsWith("https://"),
  });
}