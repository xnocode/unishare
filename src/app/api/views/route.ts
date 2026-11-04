import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PAGES } from "@/data/pages";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { slug?: string };
    const page = PAGES.find((p) => p.slug === body.slug);
    if (!page) {
      return NextResponse.json({ error: "Unknown page slug" }, { status: 400 });
    }
    await db.pageView.create({
      data: { slug: page.slug, title: page.title },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("view track error", err);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const grouped = await db.pageView.groupBy({
      by: ["slug"],
      _count: { slug: true },
      orderBy: { _count: { slug: "desc" } },
      take: 6,
    });
    return NextResponse.json({
      popular: grouped.map((g) => ({
        slug: g.slug,
        views: g._count.slug,
      })),
    });
  } catch (err) {
    console.error("popular fetch error", err);
    return NextResponse.json({ popular: [] });
  }
}
