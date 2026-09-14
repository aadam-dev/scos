import {
  addRosterInvite,
  revokeRosterInvite,
  reviewMembershipRequest,
} from "@/actions/membership";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  getCommitteeMembers,
  getCommitteeRoster,
  getLowActivityMembers,
  getPendingMembershipRequests,
} from "@/lib/data";
import {
  CheckCircle,
  Mail,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";

type AdminMembersPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function AdminMembersPage({ searchParams }: AdminMembersPageProps) {
  const [members, roster, requests, lowActivity, params] = await Promise.all([
    getCommitteeMembers(),
    getCommitteeRoster(),
    getPendingMembershipRequests(),
    getLowActivityMembers(),
    searchParams,
  ]);

  const lowActivityIds = new Set(lowActivity.map((member) => member.member_id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "invited":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            <Mail className="mr-1 h-3 w-3" />
            Invited
          </Badge>
        );
      case "claimed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
            <UserCheck className="mr-1 h-3 w-3" />
            Claimed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-ink-50 text-ink-800 border-ink-200">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="heading-3 text-ink-900">Members</h1>
          <p className="body-small text-ink-600 mt-1">
            Manage roster invites, approve join requests, and monitor member activity
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <Users className="h-4 w-4" />
          {members.length} active member{members.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Message */}
      {params.message ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{params.message}</AlertDescription>
        </Alert>
      ) : null}

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-ink-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-500">Active Members</p>
                <p className="mt-1 text-2xl font-bold text-ink-900">{members.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-ink-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-500">Pending Requests</p>
                <p className="mt-1 text-2xl font-bold text-ink-900">{requests.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-ink-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-500">Low Activity</p>
                <p className="mt-1 text-2xl font-bold text-ink-900">{lowActivity.length}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Roster & Requests */}
        <div className="space-y-6 lg:col-span-2">
          {/* Roster Invite Form */}
          <Card className="border-ink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-brand-600" />
                Roster Invite
              </CardTitle>
              <CardDescription>
                Add a member Gmail before they sign in. Google sign-in auto-claims invited emails.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={addRosterInvite} className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Gmail address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="member@gmail.com"
                    className="border-ink-300 focus-visible:ring-brand-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name (optional)</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Member name"
                    className="border-ink-300 focus-visible:ring-brand-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suggestedRole">Role on join</Label>
                  <Select name="suggestedRole" defaultValue="member">
                    <SelectTrigger className="border-ink-300 focus:ring-brand-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="secretary">Secretary</SelectItem>
                      <SelectItem value="chair">Chair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input
                    id="notes"
                    name="notes"
                    placeholder="Semester, outreach lead, etc."
                    className="border-ink-300 focus-visible:ring-brand-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    className="bg-brand-700 text-white hover:bg-brand-800"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Save roster invite
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Pending Join Requests */}
          {requests.length > 0 && (
            <Card className="border-ink-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Pending Join Requests
                </CardTitle>
                <CardDescription>
                  Review members who signed in but were not on the roster
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-ink-200 bg-ink-50/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-ink-200">
                          <AvatarFallback className="bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700 text-sm">
                            {request.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-ink-900">{request.full_name}</p>
                          <p className="text-sm text-ink-500">{request.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 rounded-lg bg-white p-3 border border-ink-200">
                      <p className="text-sm text-ink-700 whitespace-pre-wrap">
                        {request.message}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <form action={reviewMembershipRequest}>
                        <input type="hidden" name="requestId" value={request.id} />
                        <input type="hidden" name="decision" value="approved" />
                        <Button
                          type="submit"
                          className="bg-green-700 text-white hover:bg-green-800"
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </form>
                      <form action={reviewMembershipRequest}>
                        <input type="hidden" name="requestId" value={request.id} />
                        <input type="hidden" name="decision" value="rejected" />
                        <Button
                          type="submit"
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Roster List */}
          <Card className="border-ink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-brand-600" />
                Roster ({roster.length})
              </CardTitle>
              <CardDescription>Invited emails and claim status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {roster.length === 0 ? (
                <p className="text-sm text-ink-600">No roster invites yet.</p>
              ) : (
                roster.map((row) => (
                  <div
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-200 p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-ink-900">{row.email}</p>
                        {getStatusBadge(row.status)}
                      </div>
                      <p className="text-xs text-ink-500 mt-1">
                        {row.full_name ?? "No name"} • {row.suggested_role}
                      </p>
                    </div>
                    {row.status === "invited" ? (
                      <form action={revokeRosterInvite}>
                        <input type="hidden" name="rosterId" value={row.id} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="border-ink-300 text-ink-700 hover:bg-ink-50"
                        >
                          Revoke
                        </Button>
                      </form>
                    ) : null}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Active Members */}
        <div>
          <Card className="border-ink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-600" />
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-lg border border-ink-200 p-3 hover:bg-ink-50/50 transition-colors"
                >
                  <Avatar className="h-10 w-10 border border-ink-200">
                    <AvatarFallback className="bg-gradient-to-br from-ink-200 to-ink-100 text-ink-700 text-sm font-medium">
                      {member.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ink-900 truncate">{member.full_name}</p>
                      {lowActivityIds.has(member.id) && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-ink-500 truncate">{member.email}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      lowActivityIds.has(member.id)
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-green-50 text-green-800 border-green-200"
                    }
                  >
                    {lowActivityIds.has(member.id) ? "Low Activity" : member.role}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
