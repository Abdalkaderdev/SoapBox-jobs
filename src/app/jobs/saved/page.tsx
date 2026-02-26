"use client";

import Link from "next/link";
import JobCard from "@/components/JobCard";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { mockJobs } from "@/lib/mock-data";

export default function SavedJobsPage() {
  const { savedJobs } = useSavedJobs();

  const savedJobsList = mockJobs.filter((job) => savedJobs.includes(job.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="mt-2 text-gray-600">
          {savedJobsList.length > 0
            ? `You have ${savedJobsList.length} saved job${savedJobsList.length === 1 ? "" : "s"}`
            : "Jobs you save will appear here"}
        </p>
      </div>

      {savedJobsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobsList.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg
            className="mx-auto h-16 w-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No saved jobs yet</h3>
          <p className="mt-2 text-gray-500 max-w-sm mx-auto">
            Start browsing jobs and click the heart icon to save positions you&apos;re interested in.
          </p>
          <Link
            href="/jobs"
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}
