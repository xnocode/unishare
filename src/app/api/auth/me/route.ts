import { NextResponse } from "next/server";
import { SESSION_COOKIE, nameFromEmail } from "@/lib/auth";

export async function GET() {
  try {
    const { db } = await import("@/lib/db");
    const { cookies } = await import("next/headers");
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json({ authenticated: false });

    const session = await db.session.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ authenticated: false });
    }

    const account = await db.studentAccount.findUnique({
      where: { email: session.email },
    });

    const verification = await db.verificationRequest.findFirst({
      where: { email: session.email },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      authenticated: true,
      email: session.email,
      name: account?.displayName ?? nameFromEmail(session.email),
      verified: account?.verified ?? false,
      verificationStatus: verification?.status ?? null,
    });
  } catch (err) {
    console.error("me error", err);
    return NextResponse.json({ authenticated: false });
  }
}
