"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  const handleEmailLogin = () => {
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    if (email === "admin" && password === "admin123") {
      localStorage.setItem("user", "admin");
      router.push("/job-portal/admin");
    } else if (email === "user" && password === "user") {
      localStorage.setItem("user", "user");
      router.push("/job-portal/user");
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

  if (isLogin) {
    const userRole = localStorage.getItem("user");
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Selamat Datang!</h1>
          <p className="text-gray-600 mb-4">
            Anda login sebagai:{" "}
            <span className="font-semibold capitalize">{userRole}</span>
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              setIsLogin(false);
              setEmail("");
              setPassword("");
            }}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Image src="/Logo.png" alt="Rakamin Logo" width={145} height={50} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Bergabung dengan Rakamin
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Sudah punya akun?{" "}
            <a href="#" className="text-teal-600 hover:underline">
              Masuk
            </a>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Masukkan email atau username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Masukkan password"
            />
          </div>

          <button
            onClick={handleEmailLogin}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            Daftar dengan email
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
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
            <span className="text-gray-700 font-medium">
              Daftar dengan Google
            </span>
          </button>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-semibold mb-2">
              Test Credentials:
            </p>
            <p className="text-xs text-blue-700">Admin: admin / admin123</p>
            <p className="text-xs text-blue-700">User: user / user</p>
          </div>
        </div>
      </div>
    </div>
  );
}
