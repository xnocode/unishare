import { NextResponse } from "next/server";
import { makeCode } from "@/lib/auth";

/** Step 1 of login: email + password → issue a 6-digit login (2FA) code. */
export async function POST(req: Request) {
  try {
    const { db } = await import("@/lib/db");
    const body = (await req.json()) as { email?: string; password?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Enter your university email and password." },
        { status: 400 }
      );
    }

    const account = await db.studentAccount.findUnique({ where: { email } });
    if (!account) {
      return NextResponse.json(
        { error: "No account for this email yet. Create one first." },
        { status: 404 }
      );
    }

    const { verifyPassword } = await import("@/lib/auth");
    if (!verifyPassword(password, account.passwordHash)) {
      return NextResponse.json(
        { error: "Wrong password. Try again or reset it below." },
        { status: 401 }
      );
    }

    if (!account.verified) {
      return NextResponse.json(
        { error: "Confirm your email first — we sent a 6-digit code when you registered." },
        { status: 403 }
      );
    }

    // invalidate old login codes, then issue a fresh one
    await db.emailCode.updateMany({
      where: { email, kind: "login", consumed: false },
      data: { consumed: true },
    });
    const code = makeCode();
    await db.emailCode.create({
      data: {
        email,
        code,
        kind: "login",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return NextResponse.json({ ok: true, email, devCode: code });
  } catch (err) {
    console.error("login error", err);
    const message = err instanceof Error ? err.message : "Login failed. Try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
