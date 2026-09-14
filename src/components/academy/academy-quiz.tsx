"use client";

import { useMemo, useState } from "react";
import { academyQuiz, QUIZ_PASS_PERCENT } from "@/content/academy/quiz";
import { submitAcademyQuiz } from "@/actions/public-tools";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

type Props = {
  alreadyPassed: boolean;
  lastScore: number | null;
};

export function AcademyQuiz({ alreadyPassed, lastScore }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [preview, setPreview] = useState<null | { score: number; wrong: string[] }>(null);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  function previewScore() {
    let correct = 0;
    const wrong: string[] = [];
    for (const q of academyQuiz) {
      if (answers[q.id] === q.correctIndex) correct += 1;
      else wrong.push(q.id);
    }
    const score = Math.round((correct / academyQuiz.length) * 100);
    setPreview({ score, wrong });
  }

  return (
    <Card className="border-ink-200">
      <CardHeader>
        <CardTitle>Role academy quiz</CardTitle>
        <CardDescription>
          {alreadyPassed
            ? `You passed${lastScore != null ? ` with ${lastScore}%` : ""}. You can still review.`
            : `Pass at ${QUIZ_PASS_PERCENT}% to complete orientation knowledge of the eight positions.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={submitAcademyQuiz} className="space-y-8">
          {academyQuiz.map((q, index) => {
            const selected = answers[q.id];
            const showExplain = preview?.wrong.includes(q.id);
            return (
              <fieldset key={q.id} className="space-y-3">
                <legend className="text-sm font-semibold text-ink-900">
                  {index + 1}. {q.prompt}
                </legend>
                <div className="space-y-2">
                  {q.options.map((option, optionIndex) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-start gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 hover:border-brand-300"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={optionIndex}
                        required
                        className="mt-1"
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: optionIndex }))
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {showExplain ? (
                  <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    {selected !== q.correctIndex ? q.explain : null}
                    {selected === q.correctIndex ? "Correct." : null}
                  </p>
                ) : null}
              </fieldset>
            );
          })}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={previewScore}>
              Check answers ({answeredCount}/{academyQuiz.length})
            </Button>
            <FormSubmitButton pendingLabel="Saving...">Submit quiz</FormSubmitButton>
            {preview ? (
              <p className="text-sm text-ink-600">
                Preview score: <span className="font-mono font-semibold">{preview.score}%</span>
              </p>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
