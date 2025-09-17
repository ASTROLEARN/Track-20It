import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const schema = z.object({
  course: z.string().min(2, "Course is required"),
  room: z.string().min(1, "Room is required"),
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
  method: z.enum(["qr", "bt", "wifi", "face"], {
    required_error: "Select a method",
  }),
});

type FormValues = z.infer<typeof schema>;

export default function Setup() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { method: "qr" },
  });

  const onSubmit = (values: FormValues) => {
    alert(`Session configured: ${JSON.stringify(values, null, 2)}`);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Setup Attendance Session</CardTitle>
        <CardDescription>
          Validated form with sensible defaults.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Course" error={form.formState.errors.course?.message}>
            <input
              className="w-full rounded-md border bg-background px-3 py-2"
              {...form.register("course")}
              placeholder="ENG-101"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Room" error={form.formState.errors.room?.message}>
              <input
                className="w-full rounded-md border bg-background px-3 py-2"
                {...form.register("room")}
                placeholder="A2"
              />
            </Field>
            <Field label="Method" error={form.formState.errors.method?.message}>
              <select
                className="w-full rounded-md border bg-background px-3 py-2"
                {...form.register("method")}
              >
                <option value="qr">QR</option>
                <option value="bt">Bluetooth</option>
                <option value="wifi">Wi‑Fi</option>
                <option value="face">Face ID</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start" error={form.formState.errors.start?.message}>
              <input
                type="time"
                className="w-full rounded-md border bg-background px-3 py-2"
                {...form.register("start")}
              />
            </Field>
            <Field label="End" error={form.formState.errors.end?.message}>
              <input
                type="time"
                className="w-full rounded-md border bg-background px-3 py-2"
                {...form.register("end")}
              />
            </Field>
          </div>
          <Button type="submit">Save Session</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <div className="mb-1 font-medium">{label}</div>
      {children}
      {error && <div className="mt-1 text-xs text-rose-600">{error}</div>}
    </label>
  );
}
