import { NextResponse } from "next/server";
import { makeCode } from "@/lib/auth";

/** Forgot password: create a reset code (kind "reset"). */
export async function POST(req: Request) {
  try {
    const { db } = await import("@/lib/db");
    const body = (await req.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Enter your university email." },
        { status: 400 }
      );
    }

    const account = await db.studentAccount.findUnique({ where: { email } });
    if (!account) {
      // do not reveal whether the account exists
      return NextResponse.json({ ok: true, email, devCode: null });
    }

    await db.emailCode.updateMany({
      where: { email, kind: "reset", consumed: false },
      data: { consumed: true },
    });
    const code = makeCode();
    await db.emailCode.create({
      data: {
        email,
        code,
        kind: "reset",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return NextResponse.json({ ok: true, email, devCode: code });
  } catch (err) {
    console.error("forgot error", err);
    return NextResponse.json({ error: "Could not start the reset." }, { status: 500 });
  }
}
