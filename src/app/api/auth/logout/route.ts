import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  try {
    const { db } = await import("@/lib/db");
    const { cookies } = await import("next/headers");
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (token) {
      await db.session.deleteMany({ where: { token } });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  } catch (err) {
    console.error("logout error", err);
    return NextResponse.json({ ok: true });
  }
}
