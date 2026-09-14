import Link from "next/link";
import { requireProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { roles } from "@/content/academy/roles";
import { AcademyQuiz } from "@/components/academy/academy-quiz";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { searchParams: Promise<{ message?: string }> };

export default async function AcademyPage({ searchParams }: Props) {
  const profile = await requireProfile();
  const { message } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("academy_quiz_passed_at, academy_quiz_score")
    .eq("id", profile.id)
    .single();

  const passed = Boolean(data?.academy_quiz_passed_at);
  const lastScore = data?.academy_quiz_score ?? null;

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="heading-3 text-ink-900">Role academy</h1>
        <p className="body-small mt-1 text-ink-600">
          Learn the eight Accra SC positions, then pass the quiz. Public explainers also live on{" "}
          <Link href="/roles" className="text-brand-700 underline">
            /roles
          </Link>
          .
        </p>
      </div>

      {message ? <Alert variant="success">{message}</Alert> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.slug} className="border-ink-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{role.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-ink-700">
              <p>{role.purpose}</p>
              <p className="text-xs text-ink-500">
                Weekly: {role.weeklyWork.slice(0, 2).join(" · ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AcademyQuiz alreadyPassed={passed} lastScore={lastScore} />
    </div>
  );
}
