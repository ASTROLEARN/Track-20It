import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScheduleStore } from "@/store/schedule";

export default function Notifications() {
  const { notices, markAllRead, clearNotices } = useScheduleStore();
  const items = [...notices].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            New class schedules and updates appear here.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={markAllRead}>
            Mark all read
          </Button>
          <Button variant="outline" onClick={clearNotices}>
            Clear
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Latest first</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {items.length === 0 && (
              <li className="text-muted-foreground">You're all caught up.</li>
            )}
            {items.map((n) => (
              <li
                key={n.id}
                className="flex items-start justify-between rounded-md border p-3"
              >
                <div>
                  <div className="font-medium">
                    {n.type === "schedule" ? "Schedule" : "Update"}
                  </div>
                  <div className="text-muted-foreground">{n.message}</div>
                </div>
                {!n.read && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    new
                  </span>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
