import { updateOnboardingProfile } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentProfile } from "@/lib/profile";

type OnboardingPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const [profile, params] = await Promise.all([getCurrentProfile(), searchParams]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your SCOS Profile</CardTitle>
          <CardDescription>
            This information appears in committee records and generated service reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {params.message ? (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {params.message}
            </div>
          ) : null}
          <form action={updateOnboardingProfile} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" defaultValue={profile?.full_name ?? ""} required />
            </div>
            <div>
              <Label htmlFor="joinedDate">Joined Date</Label>
              <Input
                id="joinedDate"
                name="joinedDate"
                type="date"
                defaultValue={profile?.joined_date ?? new Date().toISOString().slice(0, 10)}
                required
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile?.bio ?? ""}
                placeholder="Briefly describe your committee role or service interests."
              />
            </div>
            <div>
              <Label htmlFor="programType">Program Type</Label>
              <Input id="programType" name="programType" placeholder="Degree, IAP, Masters" />
            </div>
            <div>
              <Label htmlFor="targetHours">Target Hours</Label>
              <Input id="targetHours" name="targetHours" type="number" min={0} placeholder="216" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="Accra, Ghana" />
            </div>
            <div>
              <Label htmlFor="phone">Phone or WhatsApp</Label>
              <Input id="phone" name="phone" placeholder="+233..." />
            </div>
            <div>
              <Label htmlFor="preferredPositions">Preferred SC Positions</Label>
              <Input
                id="preferredPositions"
                name="preferredPositions"
                placeholder="Events, Student Outreach"
              />
              <p className="mt-1 text-xs text-slate-500">
                Add up to two areas, separated by commas.
              </p>
            </div>
            <Button type="submit">Save and Continue</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
