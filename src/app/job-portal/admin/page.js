import Image from "next/image";

export default function AdminPage() {
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

            {/* Empty State */}
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
              <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg transition-colors shadow-sm">
                Create a new job
              </button>
            </div>
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
              <button className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors">
                Create a new job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
