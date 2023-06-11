import { Database } from "../../../types/supabase";
import { QuestionNotionPageObjectResponse } from "./types";

export const parseQuestionNotion = (
  questionPage: QuestionNotionPageObjectResponse,
  authorId: string
): Database["public"]["Tables"]["questions"]["Insert"] => ({
  id: questionPage.id,
  title: questionPage.properties.Title.title[0]?.plain_text || "",
  status: questionPage.properties.Ready.checkbox ? "ready" : "in_progress",
  privacy: "public",
  author_id: authorId,
  skill_ids_to_sync: questionPage.properties.Skills.relation.map(
    (item) => item.id
  ),
  notion_url: questionPage.url,
});
