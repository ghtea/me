import { NextResponse } from "next/server";
import { n2m } from "../../../../../lib/notion/client";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../../types/supabase";

export async function POST(
  request: Request,
  { params }: { params: { questionId: string } }
) {
  const questionId = params.questionId;
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const mdblocks = await n2m.pageToMarkdown(questionId);
    const mdString = n2m.toMarkdownString(mdblocks).parent;

    const res = await supabase
      .from("questions")
      .update({
        answer: mdString,
        synchronized_at: new Date().toISOString(),
      })
      .eq("id", questionId);
    return NextResponse.json(res);
  } catch (error) {
    throw error;
  }
}
