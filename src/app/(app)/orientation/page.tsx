import Link from "next/link";
import { completeOrientationChecklist } from "@/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
const positions = [
  "Chairperson or Head",
  "Vice-Chairperson or Vice-Head",
  "Secretary",
  "Assistant Secretary",
  "Finance or Treasurer",
  "Student Outreach",
  "Events",
  "IT Support",
];

const checklistItems = [
  "I understand the Student Committee supports IOU locally and does not replace IOU approval of service hours.",
  "I will log claimed activities and evidence in SCOS and export records when required.",
  "I will attend committee meetings and follow attendance and minutes published on SCOS.",
  "I know my chair and secretary can view committee operations and planning on the platform.",
];

type OrientationPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function OrientationPage({ searchParams }: OrientationPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-800">
          Official Student Committee Summary
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          How the Student Committee Works
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          SCOS is based on IOU Student Committee guidance. It helps local committees plan,
          meet, log work, collect evidence, and export records for IOU review.
        </p>
      </div>

      {params.message ? <Alert variant="success">{params.message}</Alert> : null}

      <Card>
        <CardHeader>
          <CardTitle>What Is an SC?</CardTitle>
          <CardDescription>A voluntary regional team supporting IOU and Islamic education.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <p>
            A Student Committee is a voluntary group of IOU students, former students,
            non-IOU students, and volunteers in a region or country.
          </p>
          <p>
            Its purpose is to promote IOU, create awareness about Islamic education, support
            students, answer local questions, and share local feedback with IOU.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Core Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p>Jummah booths, flyer drops, webinars, IOU info sessions, social media promotion, Awareness Month work, calling tasks, and committee operations.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Record Keeping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p>Members keep claimed activity records and evidence. SCOS exports Excel and PDF logbooks for IOU Student Committee Officer review.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SC Positions</CardTitle>
          <CardDescription>These are operational positions and contribution areas.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {positions.map((position) => (
            <div key={position} className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-800">
              {position}
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
            <ul className="space-y-3 text-sm text-slate-700">
              {checklistItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-blue-800">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <label className="flex items-start gap-2 text-sm text-slate-800">
              <input type="checkbox" name="acknowledged" className="mt-0.5 h-4 w-4 rounded border-slate-300" />
              <span>I have read and agree to these committee expectations.</span>
            </label>
            <div className="flex flex-wrap gap-3">
              <FormSubmitButton pendingLabel="Saving...">Complete orientation</FormSubmitButton>
              <Link
                href="/onboarding"
                className="inline-flex h-10 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Skip to profile setup
              </Link>
            </div>
            <p className="text-xs text-slate-500">
              You can review this page anytime from the Orientation link in the menu.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
