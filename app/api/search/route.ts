import { NextResponse } from "next/server";

import { searchCreators } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const results = await searchCreators(query);

  return NextResponse.json({ results });
}
