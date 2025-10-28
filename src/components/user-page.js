"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();
  const supabase = createClient();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from("jobs").select("*");

      if (error) {
        console.error("Error fetching jobs:", error);
      } else {
        console.log("Fetched jobs:", data);
        setJobs(data);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);
  const [selectedJob, setSelectedJob] = useState(() => {
    if (typeof window !== "undefined") {
      const savedJobs = localStorage.getItem("jobPostings");
      if (savedJobs) {
        const parsedJobs = JSON.parse(savedJobs);
        if (parsedJobs.length > 0) {
          return parsedJobs[0];
        }
      }
    }
    return null;
  });

  if (jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-12 flex flex-col items-center justify-center">
            <div className="mb-8 relative">
              <Image
                src="/artwork.svg"
                alt="Artwork"
                width={100}
                height={100}
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              No job openings available
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              Check back later for new opportunities.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Job List */}
          <div className="lg:w-96 space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all ${
                  selectedJob?.id === job.id
                    ? "border-2 border-teal-600"
                    : "border-2 border-transparent hover:border-gray-300"
                }`}
              >
                {/* Job Card */}
                <div className="flex gap-4">
                  {/* Logo Placeholder */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M8 6L12 2L16 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 2V12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M16 18L12 22L8 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 22V12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {job.job_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{job.job_type}</p>

                    {/* Candidates Needed */}
                    {job.number_of_candidate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>{job.number_of_candidate} positions</span>
                      </div>
                    )}

                    {/* Salary */}
                    {(job.minimum_salary || job.maximum_salary) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {job.minimum_salary && job.maximum_salary
                            ? `${job.minimum_salary} - ${job.maximum_salary}`
                            : job.minimum_salary || job.maximum_salary}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content - Job Details */}
          {selectedJob && (
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    {/* Logo Placeholder */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M8 6L12 2L16 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 2V12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M16 18L12 22L8 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 22V12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                          {selectedJob.job_type}
                        </span>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-800 mb-1">
                        {selectedJob.job_name}
                      </h1>
                      {selectedJob.number_of_candidate && (
                        <p className="text-gray-600">
                          {selectedJob.number_of_candidate} positions available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg transition-colors shadow-sm"
                    onClick={() => router.push(`job-portal/${selectedJob.id}`)}
                  >
                    Apply
                  </button>
                </div>

                {/* Salary Info */}
                {(selectedJob.minimum_salary || selectedJob.maximum_salary) && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Salary Range
                    </h3>
                    <p className="text-lg font-semibold text-gray-800">
                      {selectedJob.minimum_salary && selectedJob.maximum_salary
                        ? `${selectedJob.minimum_salary} - ${selectedJob.maximum_salary}`
                        : selectedJob.minimum_salary ||
                          selectedJob.maximum_salary}
                    </p>
                  </div>
                )}

                {/* Job Description */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Job Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedJob.job_description}
                  </p>
                </div>

                {/* Profile Requirements */}
                {selectedJob.fields && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Profile Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(selectedJob.fields)
                        .filter(([, value]) => value !== "Off")
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                value === "Mandatory"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {value}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
