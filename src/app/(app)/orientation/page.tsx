import Link from "next/link";
import { completeOrientationChecklist } from "@/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { roles } from "@/content/academy/roles";

const checklistItems = [
  "I understand the Student Committee supports IOU locally and does not replace IOU approval of service hours.",
  "I will log claimed activities and evidence in SCOS and export records when required.",
  "I will attend committee meetings and follow attendance and minutes published on SCOS.",
  "I know my chair and secretary can view committee operations and planning on the platform.",
  "I will complete the role academy quiz so I know what each Accra SC position owns.",
];

type OrientationPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function OrientationPage({ searchParams }: OrientationPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-800">
          Official Student Committee Summary
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-950">
          How the Student Committee Works
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
          SCOS helps Accra SC plan, meet, log work, collect evidence, and export records for IOU
          review. Final hour approval stays with IOU outside this platform.
        </p>
      </div>

      {params.message ? <Alert variant="success">{params.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>What Is an SC?</CardTitle>
          <CardDescription>A voluntary regional team supporting IOU and Islamic education.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-ink-700">
          <p>
            A Student Committee is a voluntary group of IOU students, former students, non-IOU
            students, and volunteers in a region or country.
          </p>
          <p>
            Its purpose is to promote IOU, create awareness about Islamic education, support
            students, answer local questions, and share local feedback with IOU.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SC Positions</CardTitle>
          <CardDescription>
            Operational seats. Read more in the{" "}
            <Link href="/academy" className="text-brand-700 underline">
              role academy
            </Link>{" "}
            after orientation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {roles.map((role) => (
            <div
              key={role.slug}
              className="rounded-lg border border-ink-200 bg-white p-3 text-sm font-medium text-ink-800"
            >
              {role.title}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>First-week checklist</CardTitle>
          <CardDescription>Confirm these before accessing the rest of SCOS.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={completeOrientationChecklist} className="space-y-4">
            <ul className="space-y-3 text-sm text-ink-700">
              {checklistItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand-800">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <label className="flex items-start gap-2 text-sm text-ink-800">
              <input
                type="checkbox"
                name="acknowledged"
                className="mt-0.5 h-4 w-4 rounded border-ink-300"
              />
              <span>I have read and agree to these committee expectations.</span>
            </label>
            <div className="flex flex-wrap gap-3">
              <FormSubmitButton pendingLabel="Saving...">Complete orientation</FormSubmitButton>
              <Link
                href="/academy"
                className="inline-flex h-10 items-center rounded-md border border-ink-300 px-4 text-sm font-medium text-ink-800 hover:bg-ink-50"
              >
                Open role academy
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
