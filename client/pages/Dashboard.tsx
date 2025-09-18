import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, LayoutDashboard, QrCode } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function useAttendanceTrend() {
  return useQuery({
    queryKey: ["attendanceTrend"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return days.map((d, i) => ({
        day: d,
        present: 22 + Math.round(Math.sin(i) * 3),
        total: 30,
      }));
    },
  });
}

export default function Dashboard() {
  const { data } = useAttendanceTrend();
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Unified Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground max-w-prose">
            Role-aware overview for students, teachers, and admins. Configure
            attendance methods, monitor real-time presence, and review suggested
            tasks.
          </p>
        </div>
        <Link to="/" className="hidden sm:block">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" /> Attendance
            </CardTitle>
            <CardDescription>
              Automated via QR, Bluetooth/Wi‑Fi, or Face ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-3 text-sm">
              Session: ENG-101 • Room A2 • 10:00–10:50
            </div>
            <Link to="/attendance-screen">
              <Button className="w-full">Open Attendance Screen</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" /> Suggested
              Tasks
            </CardTitle>
            <CardDescription>
              Personalized micro‑tasks for free periods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-3 py-1">
                10m: Spaced Repetition
              </span>
              <span className="rounded-full bg-muted px-3 py-1">
                20m: Lab Notebook
              </span>
              <span className="rounded-full bg-muted px-3 py-1">
                15m: Career Quiz
              </span>
            </div>
            <Button variant="secondary" className="w-full">
              Shuffle Suggestions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" /> Routine
            </CardTitle>
            <CardDescription>Integrated daily plan with breaks</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li>10:50–11:10 • Break + 10m reading</li>
              <li>11:10–12:00 • Math • Topic: Integrals</li>
              <li>12:00–12:20 • Free • Quiz review</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Trend</CardTitle>
          <CardDescription>Interactive area chart (weekly)</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data || []} margin={{ left: 8, right: 8 }}>
              <defs>
                <linearGradient id="present" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="present"
                stroke="hsl(var(--primary))"
                fill="url(#present)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
