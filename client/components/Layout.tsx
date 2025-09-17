import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun, ScanQrCode } from "lucide-react";
import { useTheme } from "next-themes";

export function Layout(props: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/60">
      <header className="sticky top-0 z-40 border-b backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-violet-500 text-primary-foreground shadow-sm">
              <ScanQrCode className="h-5 w-5" />
            </span>
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-base font-bold text-transparent sm:text-lg">
              Smart Curriculum
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/dashboard">Dashboard</NavItem>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{props.children}</main>
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm text-muted-foreground">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-3">
            <span>© {new Date().getFullYear()} Smart Curriculum Activity & Attendance</span>
            <span className="hidden sm:inline">•</span>
            <span>Mobile-first • Secure • Accessible</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground",
          isActive && "text-foreground bg-muted",
        )
      }
    >
      {children}
    </NavLink>
  );
}
