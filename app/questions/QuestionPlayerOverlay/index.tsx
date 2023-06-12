import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isNil } from "lodash-es";
import { ImSpinner11 } from "react-icons/im";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsShuffle } from "react-icons/bs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useQuestionPlayerStore } from "../QuestionPlayerProvider";
import { useSupabase } from "../../../lib/hooks/supabase";
import { useEffect, useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import { IconButton } from "../../../components/ui/IconButton";
import Link from "next/link";
import { MdModeEdit } from "react-icons/md";
import { IconLink } from "../../../components/ui/IconLink";

export type QuestionPlayerOverlayProps = {
  onClose: () => void;
};

export const QuestionPlayerOverlay = ({
  onClose,
}: QuestionPlayerOverlayProps) => {
  const { currentQuestionId, actions } = useQuestionPlayerStore();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const [isAnswerOpened, setIsAnswerOpened] = useState(false);

  const getQuestionQuery = useQuery({
    queryKey: ["questions", currentQuestionId],
    queryFn: async () =>
      supabase.from("questions").select().eq("id", currentQuestionId).single(),
    enabled: !isNil(currentQuestionId),
  });

  const syncQuestionMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/questions/${currentQuestionId}/sync`, {
        method: "POST",
      });
      const question = await res.json();
      return question;
    },
  });

  useEffect(() => {
    const question = getQuestionQuery.data?.data;
    if (!question) return;

    if (
      !question.synchronized_at ||
      new Date().getTime() - new Date(question.synchronized_at).getTime() >=
        1000 * 60 * 60 // NOTE: 1h
    ) {
      syncQuestionMutation.mutateAsync().then(() => {
        queryClient.invalidateQueries({
          queryKey: ["questions", currentQuestionId],
        });
      });
    }
  }, [getQuestionQuery.data]);

  const currentQuestion = getQuestionQuery.data?.data;

  return (
    <div className="fixed z-[10] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-slate-900/50 flex justify-center items-center">
      <div className="flex w-full h-full max-w-[540px] max-h-[800px]">
        <div className="relative flex flex-col w-full h-full bg-white border border-slate-200 p-4 rounded-md overflow-auto">
          <div className="absolute right-5 top-5">
            <button
              className="hover:bg-slate-50 rounded-md w-[48px] h-[48px] flex justify-center items-center"
              onClick={onClose}
            >
              <AiFillCloseCircle size={36} className="text-slate-300" />
            </button>
          </div>
          <div
            className={twMerge(
              "text-2xl pl-5 pr-8 pt-3 pb-2 text-slate-700",
              isNil(currentQuestion?.title) && "invisible"
            )}
          >
            {currentQuestion?.title || "-"}
          </div>
          <div className="mt-1 flex relative flex-row justify-center py-3">
            <button
              className="text-slate-500 py-1 px-3 border rounded-md border-slate-500"
              type="button"
              onClick={() => setIsAnswerOpened((prev) => !prev)}
            >
              {isAnswerOpened ? "Hide Answer" : "Show Answer"}
            </button>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-row items-center gap-2">
              <IconButton
                onClick={() => {
                  syncQuestionMutation.mutate();
                }}
              >
                <ImSpinner11
                  className={twJoin(
                    syncQuestionMutation.isLoading && "animate-spin"
                  )}
                  size={24}
                />
              </IconButton>
              <IconLink href={currentQuestion?.notion_url || ""}>
                <MdModeEdit size={28} />
              </IconLink>
            </div>
          </div>
          <div className="w-full flex-1 overflow-auto">
            {isAnswerOpened && (
              <div className="p-4 leading-[1.6] text-lg [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mt-4 text-slate-900">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({
                      node,
                      inline,
                      className,
                      children,
                      style,
                      ...props
                    }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={style as any}
                          {...props}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {currentQuestion?.answer || ""}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <div className="w-full flex py-2 border-t border-slate-200">
            <button
              className="text-slate-500 px-4 text-lg w-1/3 h-[40px] flex justify-center items-center"
              onClick={() => actions.goPrevious()}
            >
              <AiOutlineLeft size={32} />
            </button>
            <button
              className="text-slate-500 px-4 text-lg w-1/3  h-[40px] flex justify-center items-center"
              onClick={() => actions.goRandom()}
            >
              <BsShuffle size={32} />
            </button>
            <button
              className="text-slate-500 px-4 text-lg w-1/3  h-[40px] flex justify-center items-center"
              onClick={() => actions.goNext()}
            >
              <AiOutlineRight size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
