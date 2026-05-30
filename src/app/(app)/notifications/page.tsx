import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getNotifications } from "@/lib/data";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Notifications</h1>
        <p className="text-sm text-slate-600">Meeting reminders, activity assignments, and log reminders.</p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="No notifications" description="SCOS reminders and updates will appear here." />
      ) : (
        <div className="grid gap-3">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardHeader>
                <CardTitle>{notification.title}</CardTitle>
                <CardDescription>{new Date(notification.created_at).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>{notification.body}</p>
                {notification.href ? (
                  <Link className="font-semibold text-blue-800" href={notification.href}>
                    Open
                  </Link>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
