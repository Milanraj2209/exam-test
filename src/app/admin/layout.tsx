"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // You can change this to any email you want!
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "milanraj2209@gmail.com";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in at all -> redirect to login
        router.push("/login");
      } else if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        // Logged in, but NOT the admin -> redirect to home
        router.push("/");
      } else {
        // Logged in AND is the admin!
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router, ADMIN_EMAIL]);

  if (loading || (!isAuthorized && user)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <Lock className="h-12 w-12 text-muted-foreground animate-pulse mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">Verifying Security Credentials...</h2>
      </div>
    );
  }

  if (isAuthorized) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Admin Header Banner */}
        <div className="bg-destructive/10 border-b border-destructive/20 text-destructive px-6 py-2 flex items-center justify-center text-sm font-semibold">
          <AlertCircle className="h-4 w-4 mr-2" />
          ADMINISTRATOR ACCESS GRANTED
        </div>
        
        {/* Render the admin page */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  return null;
}
