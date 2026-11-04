import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";

/** Reset password: verify reset code + set the new password. */
export async function POST(req: Request) {
  try {
    const { db } = await import("@/lib/db");
    const body = (await req.json()) as {
      email?: string;
      code?: string;
      password?: string;
    };
    const email = (body.email ?? "").trim().toLowerCase();
    const code = (body.code ?? "").replace(/\D/g, "");
    const password = body.password ?? "";

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password needs 8+ characters with a letter and a number." },
        { status: 400 }
      );
    }

    const latest = await db.emailCode.findFirst({
      where: { email, kind: "reset", consumed: false },
      orderBy: { createdAt: "desc" },
    });
    if (!latest) {
      return NextResponse.json(
        { error: "No reset pending. Start again from Forgot password." },
        { status: 404 }
      );
    }
    if (latest.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This reset expired. Start again from Forgot password." },
        { status: 410 }
      );
    }
    if (latest.code !== code) {
      return NextResponse.json(
        { error: "Reset link is not valid anymore." },
        { status: 400 }
      );
    }

    const { salt, hash } = hashPassword(password);
    const updated = await db.studentAccount.update({
      where: { email },
      data: { passwordHash: `${salt}$${hash}` },
    });
    if (!updated) {
      return NextResponse.json(
        { error: "No account for this email." },
        { status: 404 }
      );
    }

    await db.emailCode.update({
      where: { id: latest.id },
      data: { consumed: true },
    });
    // security: end all sessions of this account after a password change
    await db.session.deleteMany({ where: { email } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reset error", err);
    return NextResponse.json({ error: "Could not reset the password." }, { status: 500 });
  }
}
