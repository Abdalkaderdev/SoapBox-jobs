"use client";

import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { Job } from "@/types/job";

interface JobDetailSidebarProps {
  job: Job;
}

export default function JobDetailSidebar({ job }: JobDetailSidebarProps) {
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const saved = isJobSaved(job.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
      {/* Church info */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl font-bold text-primary-600">
            {job.church.name.charAt(0)}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{job.church.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{job.location}</p>
      </div>

      {/* Apply button */}
      <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors mb-4">
        Apply Now
      </button>

      <button
        onClick={() => toggleSaveJob(job.id)}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          saved
            ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
            : "bg-white text-primary-600 border border-primary-600 hover:bg-primary-50"
        }`}
      >
        {saved ? (
          <>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Saved
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            Save Job
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By applying, you agree to share your profile with {job.church.name}
      </p>
    </div>
  );
}
