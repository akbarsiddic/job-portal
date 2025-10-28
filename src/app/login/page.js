"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        router.push("/job-portal");
      }
    }
  }, [router]);

  const handleEmailLogin = () => {
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    if (email === "admin" && password === "admin123") {
      localStorage.setItem("user", "admin");
      document.cookie = "user=admin; path=/; max-age=86400";
      router.push("/job-portal");
    } else if (email === "user" && password === "user") {
      localStorage.setItem("user", "user");
      document.cookie = "user=user; path=/; max-age=86400";
      router.push("/job-portal");
    } else {
      setError("Email atau password salah");
    }
  };

  const handleGoogleLogin = () => {
    alert("Fitur login dengan Google belum tersedia");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEmailLogin();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Image src="/Logo.png" alt="Rakamin Logo" width={145} height={50} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Masuk ke Rakamin</CardTitle>
            <CardDescription>
              Belum punya akun?{" "}
              <Link href="/register" className="text-teal-600 hover:underline">
                Daftar
              </Link>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Alamat email</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan email atau username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan password"
              />
            </div>

            <Button
              onClick={handleEmailLogin}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800"
            >
              Masuk dengan email
            </Button>

            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">Masuk dengan Google</span>
            </Button>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 font-semibold mb-2">
                Test Credentials:
              </p>
              <p className="text-xs text-blue-700">Admin: admin / admin123</p>
              <p className="text-xs text-blue-700">User: user / user</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
