"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
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
  const [searchQuery, setSearchQuery] = useState("");

  const resetForm = () => {
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
    if (!formData.jobName || !formData.jobType || !formData.jobDescription) {
      alert("Please fill in all required fields");
      return;
    }

    const newJob = {
      id: Date.now(),
      title: formData.jobName,
      type: formData.jobType,
      salary: `${formData.minSalary} - ${formData.maxSalary}`,
      status: "Draft",
      startedDate: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      description: formData.jobDescription,
      candidatesNeeded: formData.candidateNeeded,
      profileRequirements: formData.profileRequirements,
    };

    setJobs((prev) => [newJob, ...prev]);
    setIsDialogOpen(false);
    resetForm();
    toast.success("Job published successfully!");
  };

  const updateJobStatus = (jobId, newStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job,
      ),
    );
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-300";
      case "Inactive":
        return "bg-red-100 text-red-700 border-red-300";
      case "Draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            {filteredJobs.length === 0 ? (
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
                <p className="text-gray-600 mb-8 text-center max-w-md">
                  Create a job opening now and start the candidate process.
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg transition-colors shadow-sm">
                      Create a new job
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Job Opening</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ex. Front End Engineer"
                          value={formData.jobName}
                          onChange={(e) =>
                            handleInputChange("jobName", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Type<span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.jobType}
                          onChange={(e) =>
                            handleInputChange("jobType", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                        >
                          <option value="">Select job type</option>
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>

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
                                  {["Mandatory", "Optional", "Off"].map(
                                    (option) => (
                                      <button
                                        key={option}
                                        onClick={() =>
                                          handleProfileRequirementChange(
                                            key,
                                            option,
                                          )
                                        }
                                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                          value === option
                                            ? option === "Mandatory"
                                              ? "bg-teal-600 text-white"
                                              : "bg-gray-200 text-gray-700"
                                            : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                                        }`}
                                      >
                                        {option}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <button
                        onClick={handlePublish}
                        className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                      >
                        Publish Job
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded border ${getStatusColor(job.status)}`}
                        >
                          {job.status}
                        </span>
                        <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded border border-gray-200">
                          started on {job.startedDate}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={job.status}
                          onChange={(e) =>
                            updateJobStatus(job.id, e.target.value)
                          }
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                          Manage Job
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600">{job.salary}</p>
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors">
                    Create a new job
                  </button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
