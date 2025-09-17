import * as React from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Home, LayoutDashboard, SlidersHorizontal } from "lucide-react";
import { useTheme } from "next-themes";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        aria-label="Open command palette"
        className="rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
        onClick={() => setOpen(true)}
      >
        ⌘K
      </button>
      {open && (
        <div role="dialog" aria-modal className="fixed inset-0 z-[100] grid place-items-start bg-black/20 p-4 pt-24 backdrop-blur-sm">
          <Command className="mx-auto w-full max-w-lg overflow-hidden rounded-xl border bg-background shadow-xl">
            <div className="border-b px-3 py-2 text-sm text-muted-foreground">Search…</div>
            <Command.Input autoFocus className="w-full px-3 py-3 outline-none" placeholder="Type a command or search" />
            <Command.List className="max-h-[50vh] overflow-y-auto">
              <Command.Empty className="p-4 text-sm text-muted-foreground">No results</Command.Empty>
              <Command.Group heading="Navigation">
                <Command.Item onSelect={() => { navigate("/"); setOpen(false); }} className="flex cursor-pointer items-center gap-2 px-3 py-2"><Home className="h-4 w-4"/> Home</Command.Item>
                <Command.Item onSelect={() => { navigate("/dashboard"); setOpen(false); }} className="flex cursor-pointer items-center gap-2 px-3 py-2"><LayoutDashboard className="h-4 w-4"/> Dashboard</Command.Item>
                <Command.Item onSelect={() => { navigate("/setup"); setOpen(false); }} className="flex cursor-pointer items-center gap-2 px-3 py-2"><SlidersHorizontal className="h-4 w-4"/> Setup Session</Command.Item>
              </Command.Group>
              <Command.Group heading="Theme">
                <Command.Item onSelect={() => { setTheme("light"); setOpen(false); }} className="flex cursor-pointer items-center gap-2 px-3 py-2"><Sun className="h-4 w-4"/> Light</Command.Item>
                <Command.Item onSelect={() => { setTheme("dark"); setOpen(false); }} className="flex cursor-pointer items-center gap-2 px-3 py-2"><Moon className="h-4 w-4"/> Dark</Command.Item>
                <Command.Item onSelect={() => { setTheme("system"); setOpen(false); }} className="flex cursor-pointer items-center gap-2 px-3 py-2">System</Command.Item>
              </Command.Group>
            </Command.List>
            <div className="border-t px-3 py-2 text-right text-xs text-muted-foreground">Close with Esc</div>
          </Command>
        </div>
      )}
    </>
  );
}
