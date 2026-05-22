import { NextResponse } from "next/server";

import { isUsernameAvailable } from "@/lib/data";
import { isValidUsername } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") ?? "";
  const valid = isValidUsername(username);
  const available = valid ? await isUsernameAvailable(username) : false;

  return NextResponse.json({ available, valid });
}
