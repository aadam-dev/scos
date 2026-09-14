import { requestCommitteeMembership } from "@/actions/membership";
import { signOut } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getActiveCommittees, getMyMembershipRequest } from "@/lib/data";
import { getAuthProfileState } from "@/lib/profile";
import { redirect } from "next/navigation";
import { CheckCircle, Users, Mail, ArrowRight, Clock } from "lucide-react";

type MembershipPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function MembershipPage({ searchParams }: MembershipPageProps) {
  const [{ profile, user }, committees, existingRequest, params] = await Promise.all([
    getAuthProfileState(),
    getActiveCommittees(),
    getMyMembershipRequest(),
    searchParams,
  ]);

  if (!user) redirect("/login");

  if (profile?.membership_status === "active" && profile.committee_id) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="heading-3 text-ink-900">Committee Membership</h1>
        <p className="body-small text-ink-600 mt-2">
          Signed in as {profile?.email ?? user.email}
        </p>
      </div>

      {/* Message */}
      {params.message ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{params.message}</AlertDescription>
        </Alert>
      ) : null}

      {/* How it Works */}
      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-600" />
            How access works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-ink-900">Roster Invitation</p>
              <p className="text-sm text-ink-600">
                Ask your chair or secretary to add your Gmail to the committee roster,
                then sign in again with Google for immediate access.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-ink-900">Join Request</p>
              <p className="text-sm text-ink-600">
                Alternatively, request to join your committee below. Leadership will
                review and approve or reject your request.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Request or Form */}
      {existingRequest ? (
        <Card className="border-ink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Your Join Request
            </CardTitle>
            <CardDescription>
              Status: <span className="font-medium capitalize">{existingRequest.status}</span>
              {existingRequest.committee_name ? ` / ${existingRequest.committee_name}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-ink-50 p-4">
              <p className="text-sm text-ink-700 whitespace-pre-wrap">
                {existingRequest.message}
              </p>
            </div>
            {existingRequest.status === "pending" ? (
              <p className="text-sm text-ink-600">
                Waiting for chair or secretary review. You will be notified when approved.
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-ink-200">
          <CardHeader>
            <CardTitle>Request to Join a Committee</CardTitle>
            <CardDescription>
              Select your Student Committee and introduce yourself
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={requestCommitteeMembership} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="committeeId">Student Committee</Label>
                <Select name="committeeId" required>
                  <SelectTrigger className="border-ink-300 focus:ring-brand-600">
                    <SelectValue placeholder="Select a committee" />
                  </SelectTrigger>
                  <SelectContent>
                    {committees.map((committee) => (
                      <SelectItem key={committee.id} value={committee.id}>
                        {committee.name}
                        {committee.location ? ` (${committee.location})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Introduction</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="I am an IOU student on the Accra SC. Chair [name] can confirm my membership."
                  className="border-ink-300 focus-visible:ring-brand-600"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-brand-700 text-white hover:bg-brand-800"
              >
                Submit Request
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sign Out Option */}
      <form action={signOut}>
        <Button
          type="submit"
          variant="outline"
          className="w-full border-ink-300 text-ink-700 hover:bg-ink-50"
        >
          <Mail className="mr-2 h-4 w-4" />
          Sign out and use a different Google account
        </Button>
      </form>
    </div>
  );
}
