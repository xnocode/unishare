import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const count = await db.siteVisit.count();
    return NextResponse.json({ visits: count });
  } catch (err) {
    console.error("visits fetch error", err);
    return NextResponse.json({ visits: 0 });
  }
}

export async function POST() {
  try {
    await db.siteVisit.create({ data: {} });
    const count = await db.siteVisit.count();
    return NextResponse.json({ visits: count });
  } catch (err) {
    console.error("visit record error", err);
    return NextResponse.json({ visits: 0 }, { status: 500 });
  }
}
