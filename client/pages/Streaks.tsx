import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Todo = { id: string; text: string; done: boolean };

function useLocal<T>(key: string, init: T) {
  const [state, setState] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : init;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState] as const;
}

export default function Streaks() {
  const [todos, setTodos] = useLocal<Todo[]>("streaks.todos", []);
  const [subjects, setSubjects] = useLocal<string[]>("streaks.subjects", [
    "Math",
    "Physics",
    "English",
  ]);
  const [timetable, setTimetable] = useLocal<Record<string, string[]>>(
    "streaks.timetable",
    { Mon: ["Math", "English"], Tue: ["Physics"], Wed: [], Thu: [], Fri: [] },
  );
  const [input, setInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");

  const streak = useMemo(() => {
    const key = "streaks.streak";
    const today = new Date().toDateString();
    const last = localStorage.getItem(key);
    if (last === today)
      return Number(localStorage.getItem("streaks.count") || 1);
    localStorage.setItem(key, today);
    const c = Number(localStorage.getItem("streaks.count") || 0) + 1;
    localStorage.setItem("streaks.count", String(c));
    return c;
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Streaks & Planner</h1>
        <p className="text-muted-foreground">
          Build daily habits with streaks. Plan timetable, subjects, and tasks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Today's Streak</CardTitle>
            <CardDescription>Keep it going!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-extrabold">{streak}🔥</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Timetable</CardTitle>
            <CardDescription>Add subjects per day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2"
                placeholder="Add subject"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (subjectInput.trim()) {
                    setSubjects([...subjects, subjectInput.trim()]);
                    setSubjectInput("");
                  }
                }}
              >
                Add
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(timetable).map(([day, list]) => (
                <div key={day} className="rounded-md border p-3">
                  <div className="mb-2 text-sm font-medium">{day}</div>
                  <select
                    className="w-full rounded-md border bg-background px-2 py-1"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      setTimetable({ ...timetable, [day]: [...list, val] });
                    }}
                  >
                    <option value="">Add…</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ul className="mt-2 space-y-1 text-sm">
                    {list.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded bg-muted px-2 py-1"
                      >
                        <span>{s}</span>
                        <button
                          className="text-xs text-muted-foreground hover:underline"
                          onClick={() => {
                            const copy = [...list];
                            copy.splice(i, 1);
                            setTimetable({ ...timetable, [day]: copy });
                          }}
                        >
                          remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
            <CardDescription>Manage your subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-1 text-sm">
              {subjects.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-md border px-2 py-1"
                >
                  <span>{s}</span>
                  <button
                    className="text-xs text-rose-600 hover:underline"
                    onClick={() =>
                      setSubjects(subjects.filter((_, idx) => idx !== i))
                    }
                  >
                    delete
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Daily to‑do list</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="mb-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!input.trim()) return;
                setTodos([
                  { id: crypto.randomUUID(), text: input.trim(), done: false },
                  ...todos,
                ]);
                setInput("");
              }}
            >
              <input
                className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2"
                placeholder="Add task…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit">Add</Button>
            </form>
            <ul className="space-y-2 text-sm">
              {todos.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={(e) =>
                        setTodos(
                          todos.map((x) =>
                            x.id === t.id
                              ? { ...x, done: e.target.checked }
                              : x,
                          ),
                        )
                      }
                    />
                    <span
                      className={
                        t.done ? "line-through text-muted-foreground" : ""
                      }
                    >
                      {t.text}
                    </span>
                  </label>
                  <button
                    className="text-xs text-rose-600 hover:underline"
                    onClick={() => setTodos(todos.filter((x) => x.id !== t.id))}
                  >
                    delete
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
