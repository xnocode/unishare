import { NextResponse } from "next/server";
import { PAGES, CATEGORY_ORDER } from "@/data/pages";

export async function GET() {
  return NextResponse.json({
    total: PAGES.length,
    categories: CATEGORY_ORDER,
    pages: PAGES,
  });
}
