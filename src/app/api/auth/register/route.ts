import { NextResponse } from "next/server";
import { hashPassword, makeCode } from "@/lib/auth";

const UNIVERSITY_EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export async function POST(req: Request) {
  try {
    const { db } = await import("@/lib/db");
    const body = (await req.json()) as { email?: string; password?: string; name?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!UNIVERSITY_EMAIL.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid university email address." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existing = await db.studentAccount.findUnique({ where: { email } });
    if (existing?.verified) {
      return NextResponse.json(
        { error: "This email already has a verified account. Try logging in." },
        { status: 409 }
      );
    }

    const { salt, hash } = hashPassword(password);
    await db.studentAccount.upsert({
      where: { email },
      update: {
        passwordHash: `${salt}$${hash}`,
        ...(body.name ? { displayName: body.name } : {}),
      },
      create: {
        email,
        passwordHash: `${salt}$${hash}`,
        ...(body.name ? { displayName: body.name } : {}),
      },
    });

    const code = makeCode();
    await db.emailCode.create({
      data: {
        email,
        code,
        kind: "register",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // No mail server exists in this sandbox, so the code is returned for
    // on-screen display (dev delivery mode).
    return NextResponse.json({ ok: true, email, devCode: code });
  } catch (err) {
    console.error("register error", err);
    const message = err instanceof Error ? err.message : "Registration failed. Try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
