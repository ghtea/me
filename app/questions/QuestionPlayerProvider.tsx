"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { createStore, useStore } from "zustand";

export type QuestionPlayerStore = {
  currentQuestionId: string | null;
  nextQuestionId: string | null;
  previousQuestionId: string | null;
  questionIds: string[];
  actions: {
    init: (questionIds: string[], startIndex?: number) => void;
    go: (questionId: string) => void;
    goNext: () => void;
    goPrevious: () => void;
    goRandom: () => void;
  };
};

const createQuestionPlayerStore = () =>
  createStore<QuestionPlayerStore>((set) => ({
    currentQuestionId: null,
    nextQuestionId: null,
    previousQuestionId: null,
    questionIds: [],
    actions: {
      init: (questionIds) => {
        set((state) => ({
          ...state,
          questionIds,
        }));
      },
      go: (questionId) => {
        set((state) => {
          const newQuestionIndex = state.questionIds.findIndex(
            (item) => item === questionId
          );

          return {
            ...state,
            currentQuestionId: questionId,
            previousQuestionId: state.questionIds[newQuestionIndex - 1] || null,
            nextQuestionId: state.questionIds[newQuestionIndex + 1] || null,
          };
        });
      },
      goNext: () => {
        set((state) => {
          console.log("<QuestionPlayerProvider.tsx> state: ", state); // DEBUG:
          const newQuestionIndex =
            (state.questionIds.findIndex(
              (item) => item === state.currentQuestionId
            ) || 0) + 1;

          return {
            ...state,
            currentQuestionId: state.questionIds[newQuestionIndex] || null,
            previousQuestionId: state.questionIds[newQuestionIndex - 1] || null,
            nextQuestionId: state.questionIds[newQuestionIndex + 1] || null,
          };
        });
      },
      goPrevious: () => {
        set((state) => {
          const newQuestionIndex =
            (state.questionIds.findIndex(
              (item) => item === state.currentQuestionId
            ) || 0) - 1;

          return {
            ...state,
            currentQuestionId: state.questionIds[newQuestionIndex] || null,
            previousQuestionId: state.questionIds[newQuestionIndex - 1] || null,
            nextQuestionId: state.questionIds[newQuestionIndex + 1] || null,
          };
        });
      },
      goRandom: () => {
        set((state) => {
          let newQuestionIndex = Math.floor(
            Math.random() * state.questionIds.length
          );

          if (state.currentQuestionId === state.questionIds[newQuestionIndex]) {
            if (newQuestionIndex < 1) {
              newQuestionIndex++;
            } else {
              newQuestionIndex--;
            }
          }

          return {
            ...state,
            currentQuestionId: state.questionIds[newQuestionIndex] || null,
            previousQuestionId: state.questionIds[newQuestionIndex - 1] || null,
            nextQuestionId: state.questionIds[newQuestionIndex + 1] || null,
          };
        });
      },
    },
  }));

export const QuestionPlayerStoreContext = createContext<ReturnType<
  typeof createQuestionPlayerStore
> | null>(null);

export const useQuestionPlayerStore = () => {
  const store = useContext(QuestionPlayerStoreContext);
  if (store === null) {
    throw new Error("no provider");
  }

  return useStore(store);
};

export const QuestionPlayerStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [store] = useState(createQuestionPlayerStore());
  return (
    <QuestionPlayerStoreContext.Provider value={store}>
      {children}
    </QuestionPlayerStoreContext.Provider>
  );
};
