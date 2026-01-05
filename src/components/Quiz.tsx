"use client";

import type { FC, FormEvent } from "react";
import { useState } from "react";

export type QuizChoice = { id: string; text: string };
export type QuizQuestion = {
  id: string;
  text: string;
  choices: QuizChoice[];
  correctChoiceId: string;
};

export interface QuizResult {
  score: number;
  total: number;
  correctAnswers: Record<string, string>;
}

interface QuizProps {
  questions: QuizQuestion[];
  onResult: (result: QuizResult) => void;
}

const Quiz: FC<QuizProps> = ({ questions, onResult }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    let score = 0;
    const correctAnswers: Record<string, string> = {};

    for (const q of questions) {
      if (answers[q.id] === q.correctChoiceId) {
        score += 1;
      }
      correctAnswers[q.id] = q.correctChoiceId;
    }

    onResult({ score, total: questions.length, correctAnswers });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto pb-10">
      <div className="space-y-6">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 md:p-6 shadow-xl"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">
                {index + 1}
              </span>
              <h3 className="text-base md:text-lg font-semibold text-slate-100">
                {q.text}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {q.choices.map((choice) => {
                const isSelected = answers[q.id] === choice.id;
                return (
                  <label
                    key={choice.id}
                    className={`
                      relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all active:scale-[0.98]
                      ${isSelected 
                        ? "border-indigo-500 bg-indigo-500/10 text-white" 
                        : "border-slate-800 bg-slate-800/30 text-slate-400 hover:border-slate-700"}
                    `}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={choice.id}
                      checked={isSelected}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      className="sr-only" // Ẩn cái radio tròn xấu xí mặc định đi
                      required
                    />
                    <div className="flex items-center gap-3 w-full">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                        ${isSelected ? "border-indigo-500" : "border-slate-600"}
                      `}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                      </div>
                      <span className="text-sm md:text-base font-medium">{choice.text}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          className="w-full md:w-auto min-w-[200px] inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-sm md:text-base font-bold text-emerald-950 hover:bg-emerald-400 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95"
        >
          Xác nhận câu trả lời
        </button>
      </div>
    </form>
  );
};

export default Quiz;