"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { BsFillPlayFill } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { Header } from "../../components/others/Header";
import { useSupabase } from "../../lib/hooks/supabase";
import { dayjs } from "../../lib/dayjs";
import { useAuth } from "../../lib/hooks/auth";
import {
  QuestionPlayerStoreProvider,
  useQuestionPlayerStore,
} from "./QuestionPlayerProvider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QuestionPlayerOverlay } from "./QuestionPlayerOverlay";
import { twMerge } from "tailwind-merge";
import { IconLink } from "../../components/ui/IconLink";
import { IconButton } from "../../components/ui/IconButton";

const PageWithoutWrapper = () => {
  const { isMe } = useAuth();
  const supabase = useSupabase();
  const { actions } = useQuestionPlayerStore();

  const [isPlayerOpened, setIsPlayerOpened] = useState(false);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["questions"],
    queryFn: async () =>
      supabase.from("questions").select().eq("status", "ready"),
  });
  const questions = data?.data;

  const { mutate: syncMutate, isLoading: isSyncLoading } = useMutation({
    mutationFn: () =>
      fetch("/api/questions/sync", {
        method: "POST",
      }),
  });

  useEffect(() => {
    if (questions) {
      actions.init(questions.map((item) => item.id));
    }
  }, [questions]);

  useEffect(() => {
    if (isPlayerOpened) {
      document.body.classList.add("is-scroll-disabled");
    } else {
      document.body.classList.remove("is-scroll-disabled");
    }
  }, [isPlayerOpened]);

  return (
    <>
      <Header />
      <div
        className={twMerge(
          "pt-[56px] w-screen h-screen flex flex-col items-center bg-slate-50"
        )}
      >
        <div className="p-8 w-[720px] max-w-full flex flex-col items-center">
          <div className="w-full p-2">
            <div className="text-gray-700 text-4xl">Quetions</div>
          </div>
          {isMe && (
            <div className="w-full px-4 py-2 mt-2 flex flex-row gap-2">
              <button
                className="px-4 min-w-[120px] py-2 rounded-full bg-white border border-gray-200 shadow-slate-100 shadow-md hover:shadow-slate-200 disabled:text-slate-300"
                type="button"
                onClick={() => {
                  setIsPlayerOpened(true);
                  actions.goRandom();
                }}
                disabled={isSyncLoading}
              >
                Play Random
              </button>
              <button
                className="px-4 min-w-[120px] py-2 rounded-full bg-white border border-gray-200 shadow-slate-100 shadow-md hover:shadow-slate-200 disabled:text-slate-300"
                type="button"
                onClick={() => {
                  syncMutate();
                }}
                disabled={isSyncLoading}
              >
                {isSyncLoading ? "synchronizing..." : "Sync"}
              </button>
            </div>
          )}
          <div className="flex flex-col w-full items-center gap-3 p-2">
            {questions?.map((item) => (
              <div
                key={item.id}
                className="flex flex-col w-full bg-white px-4 py-2 rounded-md shadow-md shadow-slate-100 border-slate-200 max-w-[400px]"
              >
                <div className="text-lg text-slate-600">{item.title}</div>
                <div className="mt-4 flex flex-row items-center justify-between">
                  {isMe && (
                    <>
                      <IconButton
                        onClick={() => {
                          setIsPlayerOpened(true);
                          actions.go(item.id);
                        }}
                      >
                        <BsFillPlayFill size={30} className="text-slate-500" />
                      </IconButton>
                      <IconLink href={item.notion_url || ""}>
                        <MdModeEdit size={24} className="text-slate-500" />
                      </IconLink>
                    </>
                  )}
                  <div className="flex-1"></div>
                  <div className="w-auto text-slate-400">
                    {dayjs().from(dayjs(item.updated_at))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isPlayerOpened && (
        <QuestionPlayerOverlay onClose={() => setIsPlayerOpened(false)} />
      )}
    </>
  );
};

export default function Page() {
  return (
    <QuestionPlayerStoreProvider>
      <PageWithoutWrapper></PageWithoutWrapper>
    </QuestionPlayerStoreProvider>
  );
}
