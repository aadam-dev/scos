"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth";
import { isActiveMember, type ActiveProfile } from "@/lib/profile-client";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  CalendarDays,
  ClipboardList,
  FileBarChart,
  Settings,
  Users,
  LogOut,
  Hexagon,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const memberLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planning", label: "Planning", icon: Target },
  { href: "/meetings", label: "Meetings", icon: CalendarDays },
  { href: "/activities", label: "Activities", icon: ClipboardList },
  { href: "/reports", label: "Reports", icon: FileBarChart },
];

const adminLinks = [
  { href: "/admin", label: "Admin", icon: Settings },
  { href: "/admin/planning", label: "Planning", icon: Target },
  { href: "/admin/activities", label: "SC Logs", icon: ClipboardList },
  { href: "/admin/members", label: "Members", icon: Users },
];

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  if (pathname === "/dashboard") return [{ label: "Dashboard" }];

  const crumbs: { label: string; href?: string }[] = [{ label: "Dashboard", href: "/dashboard" }];

  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "admin") {
    crumbs.push({ label: "Admin" });
    if (segments[1]) {
      const sectionMap: Record<string, string> = {
        activities: "SC Logs",
        members: "Members",
        planning: "Planning",
        meetings: "Meetings",
        attendance: "Attendance",
        committee: "Settings",
        reports: "Reports",
      };
      crumbs.push({ label: sectionMap[segments[1]] || segments[1] });
    }
  } else {
    const sectionMap: Record<string, string> = {
      planning: "Planning",
      meetings: "Meetings",
      activities: "Activities",
      reports: "Reports",
      notifications: "Notifications",
      membership: "Membership",
      onboarding: "Onboarding",
      orientation: "Orientation",
    };
    if (segments[0] && sectionMap[segments[0]]) {
      crumbs.push({ label: sectionMap[segments[0]] });
    }
  }

  return crumbs;
}

type AppShellProps = {
  profile: Profile | null;
};

export function AppShell({ profile }: AppShellProps) {
  const pathname = usePathname();
  const active = isActiveMember(profile);
  const isAdmin = active && (profile?.role === "chair" || profile?.role === "secretary");
  const links = active ? memberLinks : [];
  const breadcrumbs = getBreadcrumbs(pathname);

  const userInitials = profile?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b border-ink-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-clay-700 to-clay-600 text-white shadow-sm">
              <Hexagon className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-500">
                International Open University
              </span>
              <span className="text-sm font-semibold tracking-tight text-ink-900">
                SCOS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-clay-700"
                      : "text-ink-600 hover:text-ink-900"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-clay-600" />
                  )}
                </Link>
              );
            })}
            {isAdmin &&
              adminLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-clay-700"
                        : "text-ink-600 hover:text-ink-900"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <Settings className="h-3.5 w-3.5" />
                      {link.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-clay-600" />
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0"
                  >
                    <Avatar className="h-9 w-9 border border-ink-200">
                      <AvatarFallback className="bg-gradient-to-br from-clay-100 to-clay-50 text-clay-700 text-sm font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-clay-100 to-clay-50 text-clay-700 text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{profile.full_name || "User"}</span>
                      <span className="text-xs text-ink-500 capitalize">{profile.role || "Member"}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/notifications" className="w-full">
                    <DropdownMenuItem className="cursor-pointer">
                      Notifications
                    </DropdownMenuItem>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="w-full">
                      <DropdownMenuItem className="cursor-pointer">
                        Admin Panel
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <form action={signOut} className="w-full">
                    <DropdownMenuItem className="text-ink-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-clay-300 text-clay-700 hover:bg-clay-50"
                >
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Breadcrumbs */}
        {active && breadcrumbs.length > 1 && (
          <div className="border-t border-ink-100 bg-ink-50/50">
            <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-2 text-sm md:px-6">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.label} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="mx-1 h-4 w-4 text-ink-400" />
                  )}
                  {crumb.href && index < breadcrumbs.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className="text-ink-500 transition-colors hover:text-clay-700"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-ink-900">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation */}
      {profile && active && (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-md justify-around">
            {memberLinks.slice(0, 5).map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center px-3 py-2.5 transition-colors",
                    isActive
                      ? "text-clay-700"
                      : "text-ink-500 hover:text-ink-700"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive && "fill-current opacity-20"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="mt-0.5 text-[10px] font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
