"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminPage from "@/components/admin-page";
import UserPage from "@/components/user-page";

export default function JobPortalPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    setUser(null);
    router.push("/"); // or window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 shadow-sm bg-white border-b">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-800">Job Portal</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">
            Welcome, {user || "Guest"}
          </span>

          {/* Avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/avatar.png" alt="user" />
                <AvatarFallback>
                  {user ? user.charAt(0).toUpperCase() : "G"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1">
        {user === "user" ? <UserPage user={user} /> : <AdminPage />}
      </main>
    </div>
  );
}
