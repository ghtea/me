import { NextResponse } from "next/server";
import { notionClient } from "../../../../lib/notion/client";
import { DEV_QUESTIONS_DB_ID } from "../../../../lib/notion/constants";
import { QuestionNotionPageObjectResponse } from "../types";
import { parseQuestionNotion } from "../utils";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";

export async function POST() {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw Error('not authenticated')

  const questionNotionPages: QuestionNotionPageObjectResponse[] = [];
  let nextCursor;
  let hasMore = true;

  while (hasMore) {
    try {
      const data = await notionClient.databases.query({
        database_id: DEV_QUESTIONS_DB_ID,
        start_cursor: nextCursor || undefined,
      }) as any; // TODO: fix strange build type error
      const results = data.results as QuestionNotionPageObjectResponse[];

      questionNotionPages.push(...results);
      nextCursor = data.next_cursor;
      hasMore = data.has_more;
    } catch (error) {
      nextCursor = undefined;
      hasMore = false;

      throw error;
    }
  }
  
  try {
    const res = await supabase
      .from("questions")
      .upsert(
        questionNotionPages.map((item) => parseQuestionNotion(item, user.id))
      );
    return NextResponse.json(res);
  } catch (error) {
    throw error;
  }
}