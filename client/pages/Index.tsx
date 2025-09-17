import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  QrCode,
  Bluetooth,
  Wifi,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Clock,
  CheckCircle2,
  Users2,
  BarChart3,
  ScanQrCode,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Scene3D } from "@/components/Scene3D";

interface Student {
  id: number;
  name: string;
  status: "present" | "absent" | "late";
}

function useRealtimeRoster() {
  const initial: Student[] = useMemo(
    () => [
      { id: 1, name: "A. Singh", status: "present" },
      { id: 2, name: "B. Kumar", status: "absent" },
      { id: 3, name: "C. Iyer", status: "present" },
      { id: 4, name: "D. Sharma", status: "late" },
      { id: 5, name: "E. Patel", status: "absent" },
    ],
    [],
  );
  const [roster, setRoster] = useState<Student[]>(initial);

  useEffect(() => {
    const i = setInterval(() => {
      setRoster((prev) =>
        prev.map((s) =>
          Math.random() > 0.8
            ? {
                ...s,
                status: ["present", "absent", "late"][
                  Math.floor(Math.random() * 3)
                ] as Student["status"],
              }
            : s,
        ),
      );
    }, 1500);
    return () => clearInterval(i);
  }, []);

  const present = roster.filter((r) => r.status === "present").length;
  return { roster, present, total: roster.length };
}

export default function Index() {
  const { roster, present, total } = useRealtimeRoster();

  const taskChips = [
    "10m spaced repetition",
    "15m coding kata",
    "Career quiz",
    "20m reading",
    "Lab journal",
    "Resume bullet",
  ];

  return (
    <div className="space-y-16">
      <Hero />

      <section id="features" className="grid gap-6 lg:grid-cols-2">
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ScanQrCode className="h-5 w-5 text-primary" /> Automated
              Attendance
            </CardTitle>
            <CardDescription>
              Choose the method that fits your infrastructure: QR,
              Bluetooth/Wi‑Fi proximity, or Face Recognition. Hybrid models
              prevent proxy attendance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="qr" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="qr" className="gap-2">
                  <QrCode className="h-4 w-4" /> QR
                </TabsTrigger>
                <TabsTrigger value="bt" className="gap-2">
                  <Bluetooth className="h-4 w-4" /> Bluetooth
                </TabsTrigger>
                <TabsTrigger value="wifi" className="gap-2">
                  <Wifi className="h-4 w-4" /> Wi‑Fi
                </TabsTrigger>
                <TabsTrigger value="face" className="gap-2">
                  <ScanFace className="h-4 w-4" /> Face ID
                </TabsTrigger>
              </TabsList>
              <TabsContent value="qr">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border p-4">
                    <p className="text-sm text-muted-foreground">
                      Time‑bound session QR
                    </p>
                    <div className="mt-3 flex items-center justify-center rounded-md bg-muted p-6">
                      <QrCode className="h-24 w-24" aria-hidden />
                    </div>
                    <Button className="mt-4 w-full">Generate QR</Button>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <FeatureLine>Low cost • rapid deployment</FeatureLine>
                    <FeatureLine>Unique per session to deter proxy</FeatureLine>
                    <FeatureLine>Works offline and syncs later</FeatureLine>
                    <FeatureLine>No biometrics or PII stored</FeatureLine>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="bt">
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  <FeatureLine>
                    Passive detection via signal proximity
                  </FeatureLine>
                  <FeatureLine>Seamless student experience</FeatureLine>
                  <FeatureLine>Beacon/AP calibration support</FeatureLine>
                  <FeatureLine>
                    Privacy‑first: device identifiers only
                  </FeatureLine>
                </ul>
                <Button className="mt-4">Configure Beacons</Button>
              </TabsContent>
              <TabsContent value="wifi">
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  <FeatureLine>Integrates with campus Wi‑Fi</FeatureLine>
                  <FeatureLine>Low overhead—no new hardware</FeatureLine>
                  <FeatureLine>Signal‑strength thresholds</FeatureLine>
                  <FeatureLine>Secure MAC hashing</FeatureLine>
                </ul>
                <Button className="mt-4">Link Wi‑Fi Controller</Button>
              </TabsContent>
              <TabsContent value="face">
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  <FeatureLine>High accuracy with liveness checks</FeatureLine>
                  <FeatureLine>On‑device templates with consent</FeatureLine>
                  <FeatureLine>Edge or cloud model hosting</FeatureLine>
                  <FeatureLine>Best for exam halls and labs</FeatureLine>
                </ul>
                <Button className="mt-4">Open Enrollment</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users2 className="h-5 w-5 text-primary" /> Real‑time Attendance
            </CardTitle>
            <CardDescription>
              Display live presence on classroom screens, kiosks, or TVs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-md border p-3 text-sm">
              <div className="font-medium">ENG‑101 • Room A2</div>
              <div className="text-muted-foreground">
                Present {present}/{total}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {roster.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center justify-between rounded-md border p-3 text-sm",
                    s.status === "present" &&
                      "bg-emerald-500/10 border-emerald-500/30",
                    s.status === "late" &&
                      "bg-amber-500/10 border-amber-500/30",
                    s.status === "absent" &&
                      "bg-rose-500/10 border-rose-500/30",
                  )}
                >
                  <span>{s.name}</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
                      s.status === "present" &&
                        "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                      s.status === "late" &&
                        "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                      s.status === "absent" &&
                        "bg-rose-500/15 text-rose-600 dark:text-rose-400",
                    )}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" /> Personalized
              Free‑Period Tasks
            </CardTitle>
            <CardDescription>
              Recommendation engine suggests micro‑tasks aligned with goals and
              NEP 2020.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {taskChips.map((t, i) => (
                <span
                  key={i}
                  className="rounded-full bg-muted px-3 py-1 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary">Shuffle</Button>
              <Button>Start 10‑minute Focus</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="h-5 w-5 text-primary" /> Integrated Daily
              Routine
            </CardTitle>
            <CardDescription>
              Auto‑plan sessions, breaks, and tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li>09:00–09:50 • Physics • Attendance auto‑tracked</li>
              <li>09:50–10:10 • Free • 10m spaced repetition</li>
              <li>10:10–11:00 • English • Reading focus</li>
              <li>11:00–11:20 • Free • Career quiz</li>
            </ol>
            <Button className="mt-4 w-full" variant="outline">
              Export as PDF
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <RoleCard
          title="Students"
          desc="See routine, tasks, and attendance history."
        />
        <RoleCard
          title="Teachers"
          desc="Start sessions and view live rosters."
        />
        <RoleCard
          title="Administrators"
          desc="Analytics, compliance & reports."
        />
        <RoleCard title="Counselors" desc="Interests, goals, and guidance." />
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-5 w-5 text-primary" /> Privacy‑first and
              Accessible
            </CardTitle>
            <CardDescription>
              Zero‑trust security, consent‑driven biometrics, WCAG 2.1 AA, and
              offline‑first sync.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              Minimal infrastructure • Basic training • API‑ready for LMS/SIS
            </p>
            <Link to="/dashboard">
              <Button>Open Demo Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function FeatureLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <div className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 via-background to-background p-6 sm:p-10">
      <div className="relative z-10 max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <ShieldCheck className="h-3.5 w-3.5" /> Mobile‑first • Secure •
          Accessible
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Smart Curriculum Activity & Attendance
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Automates attendance via QR, Bluetooth/Wi‑Fi, or Face ID; displays
          real‑time presence; suggests personalized tasks; and generates
          integrated daily routines.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/dashboard">
            <Button className="shadow-sm">Start Demo</Button>
          </Link>
          <a href="#features">
            <Button variant="outline">Explore Features</Button>
          </a>
        </div>
      </div>
      <BackgroundOrbs />
      <div className="absolute right-6 top-6 hidden md:block w-[420px] max-w-[45vw]">
        <Scene3D height={300} className="w-full" />
      </div>
    </section>
  );
}

function BackgroundOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -right-24 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute right-16 bottom-10 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
    </div>
  );
}

function RoleCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Role‑based access</span>
          <BarChart3 className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
