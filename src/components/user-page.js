"use client";

import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();
  const jobData = {
    title: "UX Designer",
    company: "Rakamin",
    type: "Full-Time",
    location: "Jakarta Selatan",
    salary: "Rp7.000.000 - Rp15.000.000",
    responsibilities: [
      "Develop, test, and maintain responsive, high-performance web applications using modern front-end technologies.",
      "Collaborate with UI/UX designers to translate wireframes and prototypes into functional code.",
      "Integrate front-end components with APIs and backend services.",
      "Ensure cross-browser compatibility and optimize applications for maximum speed and scalability.",
      "Write clean, reusable, and maintainable code following best practices and coding standards.",
      "Participate in code reviews, contributing to continuous improvement and knowledge sharing.",
      "Troubleshoot and debug issues to improve usability and overall application quality.",
      "Stay updated with emerging front-end technologies and propose innovative solutions.",
      "Collaborate in Agile/Scrum ceremonies, contributing to sprint planning, estimation, and retrospectives.",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Job List */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg border-2 border-teal-600 p-6 shadow-sm">
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
                    {jobData.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {jobData.company}
                  </p>

                  {/* Location */}
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{jobData.location}</span>
                  </div>

                  {/* Salary */}
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
                    <span>{jobData.salary}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Job Details */}
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
                        {jobData.type}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                      {jobData.title}
                    </h1>
                    <p className="text-gray-600">{jobData.company}</p>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg transition-colors shadow-sm"
                  onClick={() => router.push("/apply")}
                >
                  Apply
                </button>
              </div>

              {/* Job Description */}
              <div className="mt-8">
                <ul className="space-y-4">
                  {jobData.responsibilities.map((item, index) => (
                    <li key={index} className="flex gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-gray-800 rounded-full mt-2"></span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
