import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const res = await supabase.from("questions").select("*");

    return NextResponse.json(res);
  } catch (error) {
    throw error;
  }
}
