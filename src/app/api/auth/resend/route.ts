import { NextResponse } from "next/server";
import { makeCode } from "@/lib/auth";

/**
 * Resend a 6-digit code.
 * kind: "register" (email confirmation) | "login" (2FA login code)
 */
export async function POST(req: Request) {
  try {
    const { db } = await import("@/lib/db");
    const body = (await req.json()) as { email?: string; kind?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const kind = body.kind === "login" ? "login" : "register";

    if (!email) {
      return NextResponse.json({ error: "Missing email." }, { status: 400 });
    }

    const account = await db.studentAccount.findUnique({ where: { email } });
    if (!account) {
      return NextResponse.json(
        { error: "No account found for this email." },
        { status: 404 }
      );
    }
    if (kind === "register" && account.verified) {
      return NextResponse.json(
        { error: "This email is already verified. Please log in." },
        { status: 409 }
      );
    }
    if (kind === "login" && !account.verified) {
      return NextResponse.json(
        { error: "Confirm your email first — finish registration." },
        { status: 403 }
      );
    }

    // invalidate previous unconsumed codes of this kind
    await db.emailCode.updateMany({
      where: { email, kind, consumed: false },
      data: { consumed: true },
    });

    const code = makeCode();
    await db.emailCode.create({
      data: {
        email,
        code,
        kind,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return NextResponse.json({ ok: true, devCode: code });
  } catch (err) {
    console.error("resend error", err);
    return NextResponse.json({ error: "Could not resend the code." }, { status: 500 });
  }
}
