"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BookOpen, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block">CTET Master</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="shrink-0"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <div className="hidden md:flex items-center space-x-2">
            {!loading && user ? (
              <>
                <span className="text-sm font-medium mr-2 max-w-[150px] truncate">
                  {user.displayName || user.email}
                </span>
                <Button variant="outline" onClick={logout}>
                  Log Out
                </Button>
              </>
            ) : !loading && !user ? (
              <>
                <Link href="/login" tabIndex={-1}>
                  <Button variant="outline">
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
          </div>

          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation links for the site</SheetDescription>
                <div className="flex flex-col space-y-6 mt-6">
                  <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">CTET Master</span>
                  </Link>
                  <nav className="flex flex-col space-y-4 text-base font-medium">
                    <Link href="/practice" onClick={closeMobileMenu} className="hover:text-primary transition-colors">
                      Practice
                    </Link>
                    <Link href="/daily" onClick={closeMobileMenu} className="hover:text-primary transition-colors flex items-center">
                      <span className="mr-2">🔥</span> Daily Challenge
                    </Link>
                    <Link href="/mock-tests" onClick={closeMobileMenu} className="hover:text-primary transition-colors">
                      Mock Tests
                    </Link>
                    <Link href="/analytics" onClick={closeMobileMenu} className="hover:text-primary transition-colors">
                      Analytics
                    </Link>
                  </nav>
                  <div className="pt-6 border-t flex flex-col space-y-3">
                    {!loading && user ? (
                      <>
                        <span className="text-sm font-medium text-muted-foreground truncate">
                          Signed in as: {user.displayName || user.email}
                        </span>
                        <Button variant="outline" className="w-full" onClick={() => { logout(); closeMobileMenu(); }}>
                          Log Out
                        </Button>
                      </>
                    ) : !loading && !user ? (
                      <>
                        <Link href="/login" tabIndex={-1} onClick={closeMobileMenu}>
                          <Button variant="outline" className="w-full">
                            Log In
                          </Button>
                        </Link>
                        <Link href="/register" tabIndex={-1} onClick={closeMobileMenu}>
                          <Button className="w-full">
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
