"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function JobApplicationPage() {
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [user, setUser] = useState(null);
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser);
    }
    fetchJobAndApplications();
  }, []);

  async function fetchJobAndApplications() {
    try {
      setLoading(true);
      
      const [applicationsResult, jobResult] = await Promise.all([
        supabase
          .from("job_applications")
          .select("*")
          .eq("job_id", params.id),
        supabase
          .from("jobs")
          .select("*")
          .eq("id", params.id)
          .single()
      ]);

      if (applicationsResult.error) throw applicationsResult.error;
      if (jobResult.error) throw jobResult.error;

      setApplications(applicationsResult.data || []);
      setJob(jobResult.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === applications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(applications.map((app) => app.id)));
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    document.cookie = "user=; path=/; max-age=0";
    setUser(null);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <nav className="w-full flex items-center justify-between px-8 py-4 shadow-sm bg-white border-b">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-800">Job Portal</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">
              Welcome, {user || "Guest"}
            </span>

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

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-gray-600">Loading applications...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="w-full flex items-center justify-between px-8 py-4 shadow-sm bg-white border-b">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-800">Job Portal</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">
            Welcome, {user || "Guest"}
          </span>

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

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <button 
              onClick={() => router.push("/job-portal")}
              className="hover:text-gray-900"
            >
              Job list
            </button>
            <span>&gt;</span>
            <span className="text-gray-900">Manage Candidate</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold mb-6">{job?.job_name || "Job"}</h1>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        applications.length > 0 &&
                        selectedIds.size === applications.length
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-teal-600 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Phone Numbers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Domicile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Link LinkedIn
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No applications found
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(app.id)}
                          onChange={() => toggleSelect(app.id)}
                          className="w-4 h-4 text-teal-600 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {app.full_name || app.nama_lengkap || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.phone || app.phone_number || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.dob
                          ? new Date(app.dob).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.domicile || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.gender || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {app.linkedin ? (
                          <a
                            href={app.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-700 truncate block max-w-xs"
                          >
                            {app.linkedin}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
