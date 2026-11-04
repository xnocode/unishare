import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { db } = await import("@/lib/db");
    const body = (await req.json()) as { email?: string; code?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const code = (body.code ?? "").replace(/\D/g, "");

    if (!email || code.length !== 6) {
      return NextResponse.json(
        { error: "Enter the 6-digit code from your email." },
        { status: 400 }
      );
    }

    const latest = await db.emailCode.findFirst({
      where: { email, kind: "register", consumed: false },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json(
        { error: "No pending code. Go back and register again." },
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
    await db.studentAccount.update({
      where: { email },
      data: { verified: true },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("verify error", err);
    return NextResponse.json({ error: "Verification failed. Try again." }, { status: 500 });
  }
}
