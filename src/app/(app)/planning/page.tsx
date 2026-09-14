import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPlanningItems } from "@/lib/data";
import { Target, Calendar, MapPin, FileText, ChevronRight, Tag } from "lucide-react";

const statusColors: Record<string, string> = {
  backlog: "bg-ink-100 text-ink-700 border-ink-200",
  todo: "bg-blue-50 text-blue-800 border-blue-200",
  "in-progress": "bg-amber-50 text-amber-800 border-amber-200",
  done: "bg-green-50 text-green-800 border-green-200",
};

export default async function PlanningPage() {
  const items = await getPlanningItems();

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="heading-3 text-ink-900">Planning Board</h1>
        <p className="body-small text-ink-600 mt-1">
          Upcoming committee work: campaigns, outreach, meetings, and action items
        </p>
      </div>

      {/* Planning Items */}
      {items.length === 0 ? (
        <Card className="border-ink-200">
          <CardContent className="py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 mb-4">
              <Target className="h-8 w-8 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900 mb-2">No planned work yet</h3>
            <p className="text-sm text-ink-600 max-w-sm mx-auto">
              Your committee has not published planning items yet. These will appear when chairs or secretaries add them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card
              key={item.id}
              className="border-ink-200 hover:border-brand-300 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={statusColors[item.status] || statusColors.backlog}
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {item.status.replace("-", " ")}
                      </Badge>
                      {item.synced_from_minutes_at && (
                        <Badge variant="outline" className="bg-brand-50 text-brand-800 border-brand-200">
                          <FileText className="mr-1 h-3 w-3" />
                          From minutes
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="capitalize">{item.category}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ink-700 mb-4">{item.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-500">
                  {item.target_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(item.target_date).toLocaleDateString()}
                    </span>
                  )}
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                  )}
                </div>
                {item.source_meeting_id && (
                  <div className="mt-4 pt-4 border-t border-ink-200">
                    <Link href={`/meetings/${item.source_meeting_id}`}>
                      <Button variant="ghost" size="sm" className="text-brand-700 hover:text-brand-800 hover:bg-brand-50 -ml-2">
                        View source meeting
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
