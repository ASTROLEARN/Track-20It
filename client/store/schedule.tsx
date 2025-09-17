import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Schedule = {
  id: string;
  title: string;
  subject: string;
  room: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  createdAt: number;
};

export type Notice = {
  id: string;
  type: "schedule" | "update";
  message: string;
  createdAt: number;
  read: boolean;
};

interface Store {
  schedules: Schedule[];
  notices: Notice[];
  addSchedule: (s: Omit<Schedule, "id" | "createdAt">) => void;
  markAllRead: () => void;
  clearNotices: () => void;
}

const Ctx = createContext<Store | null>(null);

function useLocal<T>(key: string, init: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [schedules, setSchedules] = useLocal<Schedule[]>("trackit.schedules", []);
  const [notices, setNotices] = useLocal<Notice[]>("trackit.notices", []);

  const addSchedule: Store["addSchedule"] = (payload) => {
    const entry: Schedule = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...payload,
    };
    setSchedules([entry, ...schedules]);
    const n: Notice = {
      id: crypto.randomUUID(),
      type: "schedule",
      message: `New class scheduled: ${payload.title} (${payload.subject}) in ${payload.room} on ${payload.date} ${payload.start}–${payload.end}`,
      createdAt: Date.now(),
      read: false,
    };
    setNotices([n, ...notices]);
  };

  const markAllRead = () => setNotices(notices.map((n) => ({ ...n, read: true })));
  const clearNotices = () => setNotices([]);

  const value = useMemo<Store>(() => ({ schedules, notices, addSchedule, markAllRead, clearNotices }), [schedules, notices]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useScheduleStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useScheduleStore must be used within ScheduleProvider");
  return ctx;
}
