"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sparkles,
  MessageCircle, 
  Image,
  Video,
  User,
  LogOut,
  CodeIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DashboardShellProps = {
  userEmail: string;
  children: ReactNode;
};

const nav = [
  {
    href: "/dashboard/chat",
    label: "Chat",
    icon: MessageCircle,
  },
  {
    href: "/dashboard/code",
    label: "Code",
    icon: CodeIcon,
  },
  {
    href: "/dashboard/image",
    label: "Image",
    icon: Image,
  },
  {
    href: "/dashboard/video",
    label: "Video",
    icon: Video,
  },
];

export function DashboardShell({
  userEmail,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-border bg-card/40 md:w-56 md:border-b-0 md:border-r md:min-h-screen">
        {/* Logo */}
        <div className="flex flex-col gap-3 p-3 md:p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-muted/80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>

            <span className="font-heading text-sm font-semibold tracking-tight">
              AI Tools
            </span>
          </Link>

          {/* Navigation */}
          <nav
            className="flex gap-0.5 overflow-x-auto pb-0.5 md:flex-col md:overflow-visible md:pb-0"
            aria-label="Workspace"
          >
            {nav.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />

                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col gap-3 border-t border-border p-3 md:p-4">
          {/* User */}
          <div>
            <span>
              Theme
            </span>
            {/*<ModeToggle/>*/}
          </div>
          <div className="flex min-w-0 items-center gap-2 rounded-md border border-border/60 bg-background/80 px-2.5 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <User className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Signed in
              </p>

              <p
                className="truncate text-xs text-foreground"
                title={userEmail}
              >
                {userEmail}
              </p>
            </div>
          </div>

          {/* Logout */}
          <form action="/api/auth/logout" method="POST">
            <Button
              type="submit"
              variant="outline"
              className="h-9 w-full gap-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}