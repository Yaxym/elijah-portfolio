import { NextRequest } from "next/server";

export function isAdmin(req: NextRequest) {
  const user = process.env.ADMIN_USER || "";
  const pass = process.env.ADMIN_PASS || "";

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;

  const b64 = auth.replace("Basic ", "");
  const decoded = Buffer.from(b64, "base64").toString();
  const [u, p] = decoded.split(":");

  return u === user && p === pass;
}