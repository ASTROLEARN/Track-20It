import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScheduleStore } from "@/store/schedule";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(2, "Title required"),
  subject: z.string().min(2, "Subject required"),
  room: z.string().min(1, "Room required"),
  date: z.string().min(1, "Pick date"),
  start: z.string().min(1, "Start time"),
  end: z.string().min(1, "End time"),
});

type Values = z.infer<typeof schema>;

export default function Teacher() {
  const { schedules, addSchedule } = useScheduleStore();
  const form = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = (v: Values) => {
    addSchedule(v);
    form.reset();
  };

  const upcoming = [...schedules].sort((a,b)=> a.date.localeCompare(b.date) || a.start.localeCompare(b.start));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Teacher • Schedule Classes</h1>
        <p className="text-muted-foreground">Create class sessions; new entries appear in Notifications.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Schedule a Class</CardTitle>
            <CardDescription>Validated form, updates Notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <Field label="Title" error={form.formState.errors.title?.message}>
                <input className="w-full rounded-md border bg-background px-3 py-2" {...form.register("title")} placeholder="ENG‑101 Lecture" />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Subject" error={form.formState.errors.subject?.message}>
                  <input className="w-full rounded-md border bg-background px-3 py-2" {...form.register("subject")} placeholder="English" />
                </Field>
                <Field label="Room" error={form.formState.errors.room?.message}>
                  <input className="w-full rounded-md border bg-background px-3 py-2" {...form.register("room")} placeholder="A2" />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Date" error={form.formState.errors.date?.message}>
                  <input type="date" className="w-full rounded-md border bg-background px-3 py-2" {...form.register("date")} />
                </Field>
                <Field label="Start" error={form.formState.errors.start?.message}>
                  <input type="time" className="w-full rounded-md border bg-background px-3 py-2" {...form.register("start")} />
                </Field>
                <Field label="End" error={form.formState.errors.end?.message}>
                  <input type="time" className="w-full rounded-md border bg-background px-3 py-2" {...form.register("end")} />
                </Field>
              </div>
              <Button type="submit">Add to Schedule</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Chronological list</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {upcoming.length === 0 && (
                <li className="text-muted-foreground">No classes scheduled yet.</li>
              )}
              {upcoming.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">{c.title} • {c.subject}</div>
                    <div className="text-muted-foreground">{c.date} • {c.start}–{c.end} • Room {c.room}</div>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">scheduled</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <div className="mb-1 font-medium">{label}</div>
      {children}
      {error && <div className="mt-1 text-xs text-rose-600">{error}</div>}
    </label>
  );
}
