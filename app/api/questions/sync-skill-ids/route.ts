import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";

// WIP:
export async function POST() {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const user = (await supabase.auth.getUser()).data.user;

  try {
    // WIP: get questions which has skill_ids_to_sync
    const res = await supabase.from("questions").select();

    await Promise.allSettled(
      (res.data || []).map((question) => {
        const skillIds = question.skill_ids_to_sync;
        if (!skillIds || skillIds.length === 0) return () => Promise.resolve();

        return supabase.from("skill_question_relation").upsert(
          skillIds.map((skillId) => ({
            id: `${skillId} ${question.id}`,
            skill_id: skillId,
            question_id: question.id,
          }))
        );
      })
    );

    // WIP: reset skill_ids_to_sync in skilss

    return NextResponse.json(res);
  } catch (error) {
    throw error;
  }
}
