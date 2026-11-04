import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

/** Student verification: store the submission for admin review. */
export async function POST(req: Request) {
  try {
    const { db } = await import("@/lib/db");
    const { cookies } = await import("next/headers");
    const body = (await req.json()) as {
      email?: string;
      fullName?: string;
      studentId?: string;
      department?: string;
      programme?: string;
      academicSession?: string;
    };

    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    let email = (body.email ?? "").trim().toLowerCase();
    if (token) {
      const session = await db.session.findUnique({ where: { token } });
      if (session && session.expiresAt > new Date()) email = session.email;
    }

    if (!email) {
      return NextResponse.json(
        { error: "No account found. Register or log in first." },
        { status: 401 }
      );
    }

    const fullName = (body.fullName ?? "").trim();
    const studentId = (body.studentId ?? "").trim();
    if (!fullName || !studentId) {
      return NextResponse.json(
        { error: "Add your full name and student ID number." },
        { status: 400 }
      );
    }

    const existing = await db.verificationRequest.findFirst({
      where: { email, status: "pending" },
    });
    if (existing) {
      return NextResponse.json(
        { ok: true, alreadyPending: true },
        { status: 200 }
      );
    }

    await db.verificationRequest.create({
      data: {
        email,
        fullName,
        studentId,
        department: (body.department ?? "").trim() || "—",
        programme: (body.programme ?? "").trim() || "—",
        academicSession: (body.academicSession ?? "").trim() || "—",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("verification submit error", err);
    return NextResponse.json({ error: "Could not submit for review." }, { status: 500 });
  }
}
