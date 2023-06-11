import { NotionPageObjectResponse } from "../../../lib/notion/types";

export type QuestionNotionPageObjectResponse = NotionPageObjectResponse<{
  Skills: "relation";
  Title: "title";
  Ready: "checkbox";
}>;
