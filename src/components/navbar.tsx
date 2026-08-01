"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">CTET Master</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/practice" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Practice
            </Link>
            <Link href="/daily" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center">
              <span className="mr-1">🔥</span> Daily Challenge
            </Link>
            <Link href="/mock-tests" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Mock Tests
            </Link>
            <Link href="/analytics" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Analytics
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {!loading && user ? (
              <>
                <span className="text-sm font-medium mr-2 hidden sm:inline-block">
                  {user.displayName || user.email}
                </span>
                <Button variant="outline" onClick={logout}>
                  Log Out
                </Button>
              </>
            ) : !loading && !user ? (
              <>
                <Link href="/login" tabIndex={-1}>
                  <Button variant="outline" className="hidden sm:inline-flex">
                    Log In
                  </Button>
                </Link>
                <Link href="/register" tabIndex={-1}>
                  <Button>
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
