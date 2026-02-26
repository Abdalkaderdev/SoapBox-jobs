"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Job } from "@/types/job";
import { hasUserApplied } from "@/lib/applications";
import { hasUserReported } from "@/lib/reports";
import ApplicationModal from "./ApplicationModal";
import ShareJobModal from "./ShareJobModal";
import ReportJobModal from "./ReportJobModal";
import { trackApplyClick, trackJobView } from "@/lib/analytics";

interface JobDetailSidebarProps {
  job: Job;
}

export default function JobDetailSidebar({ job }: JobDetailSidebarProps) {
  const router = useRouter();
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const { user, isAuthenticated } = useAuth();
  const saved = isJobSaved(job.id);

  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setHasApplied(hasUserApplied(user.id, job.id));
      setHasReported(hasUserReported(user.id, job.id));
    }
  }, [user, job.id]);

  // Track job view when the sidebar loads
  useEffect(() => {
    trackJobView(job.id, job.title);
  }, [job.id, job.title]);

  const handleApplyClick = () => {
    trackApplyClick(job.id, job.title);
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    setShowModal(true);
  };

  const handleApplicationSuccess = () => {
    setHasApplied(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleReportClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    setShowReportModal(true);
  };

  const handleReportSuccess = () => {
    setHasReported(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
        {/* Success message */}
        {showSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Application submitted successfully!
          </div>
        )}

        {/* Church info */}
        <div className="text-center mb-6">
          <Link href={`/churches/${job.church.id}`} className="block group">
            <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <span className="text-3xl font-bold text-primary-600">
                {job.church.name.charAt(0)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {job.church.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">{job.location}</p>
        </div>

        {/* Apply button */}
        {hasApplied ? (
          <div className="w-full bg-green-50 text-green-700 py-3 px-4 rounded-lg font-medium text-center mb-4 border border-green-200">
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Applied
            </span>
          </div>
        ) : (
          <button
            onClick={handleApplyClick}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors mb-4"
          >
            Apply Now
          </button>
        )}

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

        {/* Share button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 mt-3"
        >
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share Job
        </button>

        {!isAuthenticated && (
          <p className="text-xs text-gray-500 text-center mt-4">
            <button
              onClick={() => router.push("/auth/signin")}
              className="text-primary-600 hover:underline"
            >
              Sign in
            </button>{" "}
            to apply for this position
          </p>
        )}

        {isAuthenticated && !hasApplied && (
          <p className="text-xs text-gray-500 text-center mt-4">
            By applying, you agree to share your profile with {job.church.name}
          </p>
        )}

        {hasApplied && (
          <p className="text-xs text-gray-500 text-center mt-4">
            <button
              onClick={() => router.push("/applications")}
              className="text-primary-600 hover:underline"
            >
              View your applications
            </button>
          </p>
        )}

        {/* Report link */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          {hasReported ? (
            <span className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Report submitted
            </span>
          ) : (
            <button
              onClick={handleReportClick}
              className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              Report this listing
            </button>
          )}
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        job={job}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleApplicationSuccess}
      />

      {/* Share Modal */}
      <ShareJobModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        jobTitle={job.title}
        jobUrl={`/jobs/${job.id}`}
      />

      {/* Report Modal */}
      {user && (
        <ReportJobModal
          jobId={job.id}
          jobTitle={job.title}
          userId={user.id}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSuccess={handleReportSuccess}
        />
      )}
    </>
  );
}
