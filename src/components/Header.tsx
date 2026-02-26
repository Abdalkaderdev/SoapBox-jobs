"use client";

import Link from "next/link";
import { useSavedJobs } from "@/contexts/SavedJobsContext";

export default function Header() {
  const { savedJobsCount } = useSavedJobs();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">SoapBox</span>
              <span className="text-2xl font-light text-gray-600 ml-1">Jobs</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
            >
              Browse Jobs
            </Link>
            <Link
              href="/jobs/saved"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center gap-1"
            >
              Saved Jobs
              {savedJobsCount > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {savedJobsCount}
                </span>
              )}
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
            >
              For Churches
            </Link>
            <Link
              href="#"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
