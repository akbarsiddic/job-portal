"use client";

import { useState } from "react";
import Image from "next/image";

export default function AdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [jobs, setJobs] = useState(() => {
    if (typeof window !== "undefined") {
      const savedJobs = localStorage.getItem("jobPostings");
      if (savedJobs) {
        return JSON.parse(savedJobs);
      }
    }
    return [];
  });
  const [formData, setFormData] = useState({
    jobName: "",
    jobType: "",
    jobDescription: "",
    candidateNeeded: "",
    minSalary: "",
    maxSalary: "",
    profileRequirements: {
      fullName: "Mandatory",
      photoProfile: "Mandatory",
      gender: "Mandatory",
      domicile: "Mandatory",
      email: "Mandatory",
      phoneNumber: "Mandatory",
      linkedinLink: "Mandatory",
      dateOfBirth: "Mandatory",
    },
  });

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      jobName: "",
      jobType: "",
      jobDescription: "",
      candidateNeeded: "",
      minSalary: "",
      maxSalary: "",
      profileRequirements: {
        fullName: "Mandatory",
        photoProfile: "Mandatory",
        gender: "Mandatory",
        domicile: "Mandatory",
        email: "Mandatory",
        phoneNumber: "Mandatory",
        linkedinLink: "Mandatory",
        dateOfBirth: "Mandatory",
      },
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileRequirementChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      profileRequirements: {
        ...prev.profileRequirements,
        [field]: value,
      },
    }));
  };

  const handlePublish = () => {
    const newJob = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("jobPostings", JSON.stringify(updatedJobs));
    }
    
    closeDialog();
  };

  const handleDeleteJob = (jobId) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("jobPostings", JSON.stringify(updatedJobs));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by job details"
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* Job Listings or Empty State */}
            {jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 flex flex-col items-center justify-center">
                {/* Illustration */}
                <div className="mb-8 relative">
                  <Image
                    src="/artwork.svg"
                    alt="Artwork"
                    width={100}
                    height={100}
                  />
                </div>
                {/* Text Content */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  No job openings available
                </h2>
                <p className="text-gray-600 mb-8 text-center max-w-md">
                  Create a job opening now and start the candidate process.
                </p>
                {/* CTA Button */}
                <button
                  onClick={openDialog}
                  className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Create a new job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {job.jobName}
                          </h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                            {job.jobType}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {job.jobDescription}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          {job.candidateNeeded && (
                            <div className="flex items-center gap-1">
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
                              <span>{job.candidateNeeded} candidates needed</span>
                            </div>
                          )}
                          {(job.minSalary || job.maxSalary) && (
                            <div className="flex items-center gap-1">
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
                                {job.minSalary && job.maxSalary
                                  ? `${job.minSalary} - ${job.maxSalary}`
                                  : job.minSalary || job.maxSalary}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete job"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Sidebar Card */}
          <div className="lg:w-80">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 text-white shadow-lg">
              <h3 className="text-xl font-semibold mb-3">
                Recruit the best candidates
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                Create jobs, invite, and hire with ease
              </p>
              <button
                onClick={openDialog}
                className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
              >
                Create a new job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Job Opening
              </h2>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6 space-y-6">
              {/* Job Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex. Front End Engineer"
                  value={formData.jobName}
                  onChange={(e) => handleInputChange("jobName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type<span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select job type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Ex."
                  value={formData.jobDescription}
                  onChange={(e) =>
                    handleInputChange("jobDescription", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Number of Candidate Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Candidate Needed
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex. 2"
                  value={formData.candidateNeeded}
                  onChange={(e) =>
                    handleInputChange("candidateNeeded", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Job Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Job Salary
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Minimum Estimated Salary
                    </label>
                    <input
                      type="text"
                      placeholder="Rp 7.000.000"
                      value={formData.minSalary}
                      onChange={(e) =>
                        handleInputChange("minSalary", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Maximum Estimated Salary
                    </label>
                    <input
                      type="text"
                      placeholder="Rp 8.000.000"
                      value={formData.maxSalary}
                      onChange={(e) =>
                        handleInputChange("maxSalary", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Minimum Profile Information Required */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                  Minimum Profile Information Required
                </h3>
                <div className="space-y-3">
                  {Object.entries(formData.profileRequirements).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-3 border-b border-gray-200"
                      >
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleProfileRequirementChange(key, "Mandatory")
                            }
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                              value === "Mandatory"
                                ? "bg-teal-600 text-white"
                                : "bg-white text-teal-600 border border-teal-600 hover:bg-teal-50"
                            }`}
                          >
                            Mandatory
                          </button>
                          <button
                            onClick={() =>
                              handleProfileRequirementChange(key, "Optional")
                            }
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                              value === "Optional"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            Optional
                          </button>
                          <button
                            onClick={() =>
                              handleProfileRequirementChange(key, "Off")
                            }
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                              value === "Off"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            Off
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={handlePublish}
                className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Publish Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
