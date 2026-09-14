import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitInternshipApplication } from "@/actions/public-tools";

export const metadata: Metadata = {
  title: "Internships - Ghana Accra Student Committee",
  description: "Express interest in local internship or volunteer opportunities with Accra SC.",
};

type Props = { searchParams: Promise<{ message?: string }> };

export default async function InternshipsPage({ searchParams }: Props) {
  const { message } = await searchParams;

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">Internships</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink-950 md:text-5xl">
          Local internship interest
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-600">
          Accra SC reviews interest forms for local internship and volunteer tracks. Submitting does
          not place you on the roster. Hours begin only after membership and logged activities.
        </p>

        {message ? (
          <Alert className="mt-6" variant="success">
            {message}
          </Alert>
        ) : null}

        <Card className="mt-10 border-ink-200">
          <CardHeader>
            <CardTitle>Interest form</CardTitle>
            <CardDescription>Chair or secretary will follow up from the Accra inbox.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitInternshipApplication} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" name="fullName" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
              <div>
                <Label htmlFor="schoolProgram">School or program</Label>
                <Input id="schoolProgram" name="schoolProgram" />
              </div>
              <div>
                <Label htmlFor="track">Track</Label>
                <Select id="track" name="track" defaultValue="local_internship">
                  <option value="local_internship">Local internship</option>
                  <option value="volunteer">Volunteer</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="availability">Availability</Label>
                <Input id="availability" name="availability" placeholder="Weekday evenings, weekends" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="motivation">Why Accra SC?</Label>
                <Textarea id="motivation" name="motivation" required rows={5} />
              </div>
              <div className="hidden" aria-hidden="true">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="md:col-span-2">
                <FormSubmitButton pendingLabel="Sending...">Submit interest</FormSubmitButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
