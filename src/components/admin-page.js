"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  }, [supabase]);
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

  const resetFormData = () => {
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

  const handleDialogOpenChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      resetFormData();
    }
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

  const handlePublish = async () => {
    const newJob = {
      job_name: formData.jobName,
      job_type: formData.jobType,
      job_description: formData.jobDescription,
      number_of_candidate: Number(formData.candidateNeeded),
      minimum_salary: formData.minSalary,
      maximum_salary: formData.maxSalary,
      fields: formData.profileRequirements,
    };

    const { data, error } = await supabase.from("jobs").insert(newJob).select();

    if (error) {
      console.error(error);
      return;
    }

    toast.success("Job published successfully!");

    setJobs([...jobs, data[0]]);
    setIsDialogOpen(false);
    resetFormData();
  };

  const handleDeleteJob = async (jobId) => {
    const { error } = await supabase.from("jobs").delete().eq("id", jobId);

    if (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
      return;
    }

    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);
    toast.success("Job deleted successfully!");
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
                <Input
                  type="text"
                  placeholder="Search by job details"
                  className="pr-12"
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
                  onClick={() => setIsDialogOpen(true)}
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
                            {job.job_name}
                          </h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                            {job.job_type}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {job.job_description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          {job.number_of_candidate && (
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
                              <span>
                                {job.number_of_candidate} candidates needed
                              </span>
                            </div>
                          )}
                          {(job.minimum_salary || job.maximum_salary) && (
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
                                {job.minimum_salary && job.maximum_salary
                                  ? `${job.minimum_salary} - ${job.maximum_salary}`
                                  : job.minimum_salary || job.maximum_salary}
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
                onClick={() => setIsDialogOpen(true)}
                className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
              >
                Create a new job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Opening</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Job Name */}
            <div className="space-y-2">
              <Label htmlFor="jobName">
                Job Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobName"
                type="text"
                placeholder="Ex. Front End Engineer"
                value={formData.jobName}
                onChange={(e) => handleInputChange("jobName", e.target.value)}
              />
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <Label htmlFor="jobType">
                Job Type<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.jobType}
                onValueChange={(value) => handleInputChange("jobType", value)}
              >
                <SelectTrigger id="jobType" className="w-full">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription">
                Job Description<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Ex."
                value={formData.jobDescription}
                onChange={(e) =>
                  handleInputChange("jobDescription", e.target.value)
                }
                rows={4}
              />
            </div>

            {/* Number of Candidate Needed */}
            <div className="space-y-2">
              <Label htmlFor="candidateNeeded">
                Number of Candidate Needed
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="candidateNeeded"
                type="text"
                placeholder="Ex. 2"
                value={formData.candidateNeeded}
                onChange={(e) =>
                  handleInputChange("candidateNeeded", e.target.value)
                }
              />
            </div>

            {/* Job Salary */}
            <div className="space-y-4">
              <Label>Job Salary</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minSalary" className="text-sm text-gray-600">
                    Minimum Estimated Salary
                  </Label>
                  <Input
                    id="minSalary"
                    type="text"
                    placeholder="Rp 7.000.000"
                    value={formData.minSalary}
                    onChange={(e) =>
                      handleInputChange("minSalary", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSalary" className="text-sm text-gray-600">
                    Maximum Estimated Salary
                  </Label>
                  <Input
                    id="maxSalary"
                    type="text"
                    placeholder="Rp 8.000.000"
                    value={formData.maxSalary}
                    onChange={(e) =>
                      handleInputChange("maxSalary", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Minimum Profile Information Required */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-800">
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

          <DialogFooter>
            <Button
              onClick={handlePublish}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              Publish Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
