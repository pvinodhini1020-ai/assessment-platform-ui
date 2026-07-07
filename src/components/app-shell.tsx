import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import {
  LayoutDashboard,
  FlaskConical,
  LineChart,
  Settings,
  RefreshCw,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearToken, getUser } from "@/lib/api";

const nav = [
  { to: "/",             label: "Dashboard",     icon: LayoutDashboard, exact: true },
  { to: "/tests/create", label: "Test Creation",  icon: FlaskConical },
  { to: "/tests/publish",label: "Test Tracking",  icon: LineChart },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-0.5">
      <span className="text-xl font-bold tracking-tight text-foreground">
        <span className="text-primary">P</span>rep
      </span>
      <span className="text-xl font-bold tracking-tight text-primary">route</span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const signOut = () => {
    clearToken();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 pt-4">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-5 py-2.5 text-sm transition-all border-l-2",
                active
                  ? "border-l-primary text-primary font-medium bg-primary/5"
                  : "border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 px-2 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const signOut = () => {
    clearToken();
    navigate({ to: "/login" });
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AW";
  const displayName = user?.name ?? "Alex Wando";
  const displayRole = user?.role ?? "Admin";

  return (
    <div className="min-h-screen w-full bg-background">

      {/* Full-width top header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center border-b border-border bg-white px-4 sm:px-6">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2 h-8 w-8"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Logo */}
        <Logo />

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-orange-400 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium leading-tight">{displayName}</p>
                  <p className="text-xs text-muted-foreground leading-tight capitalize">{displayRole}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Desktop sidebar — starts below header */}
      <aside className="fixed top-14 bottom-0 left-0 z-20 hidden w-48 border-r border-border bg-white lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute top-14 bottom-0 left-0 w-48 border-r border-border bg-white shadow-xl flex flex-col">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="pt-14 lg:pl-48">
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
