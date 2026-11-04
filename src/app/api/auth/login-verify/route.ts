import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_DAYS, randomBytes, nameFromEmail } from "@/lib/auth";

/** Step 2 of login: verify the 6-digit code → create a session cookie. */
export async function POST(req: Request) {
  try {
    const { db } = await import("@/lib/db");
    const body = (await req.json()) as { email?: string; code?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const code = (body.code ?? "").replace(/\D/g, "");

    if (!email || code.length !== 6) {
      return NextResponse.json(
        { error: "Enter the 6-digit code from your login email." },
        { status: 400 }
      );
    }

    const account = await db.studentAccount.findUnique({ where: { email } });
    if (!account || !account.verified) {
      return NextResponse.json(
        { error: "Account not found or not confirmed yet." },
        { status: 404 }
      );
    }

    const latest = await db.emailCode.findFirst({
      where: { email, kind: "login", consumed: false },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json(
        { error: "No login code pending. Go back and log in again." },
        { status: 404 }
      );
    }
    if (latest.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This code expired. Request a new one." },
        { status: 410 }
      );
    }
    if (latest.code !== code) {
      return NextResponse.json(
        { error: "That code does not match. Check each digit." },
        { status: 400 }
      );
    }

    await db.emailCode.update({
      where: { id: latest.id },
      data: { consumed: true },
    });

    const token = randomBytes(32).toString("hex");
    await db.session.create({
      data: {
        token,
        email,
        expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    const res = NextResponse.json({
      ok: true,
      email,
      name: account.displayName ?? nameFromEmail(email),
    });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
    return res;
  } catch (err) {
    console.error("login-verify error", err);
    return NextResponse.json({ error: "Could not verify the code." }, { status: 500 });
  }
}
