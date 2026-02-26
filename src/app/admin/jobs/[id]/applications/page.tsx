"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getJobApplications, updateApplicationStatus } from "@/lib/applications";
import { getJobById } from "@/lib/jobs";
import { mockUsers } from "@/lib/mock-users";
import {
  Application,
  ApplicationStatus,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from "@/types/application";
import { Job } from "@/types/job";

interface ApplicationsPageProps {
  params: Promise<{ id: string }>;
}

interface ApplicationReviewData {
  rating: number;
  notes: string;
}

const REVIEW_DATA_KEY = "soapbox_application_reviews";

function getReviewData(): Record<string, ApplicationReviewData> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(REVIEW_DATA_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveReviewData(data: Record<string, ApplicationReviewData>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REVIEW_DATA_KEY, JSON.stringify(data));
}

function getApplicationReviewData(applicationId: string): ApplicationReviewData {
  const allData = getReviewData();
  return allData[applicationId] || { rating: 0, notes: "" };
}

function updateApplicationReviewData(
  applicationId: string,
  updates: Partial<ApplicationReviewData>
): void {
  const allData = getReviewData();
  allData[applicationId] = {
    ...getApplicationReviewData(applicationId),
    ...updates,
  };
  saveReviewData(allData);
}

export default function JobApplicationsPage({ params }: ApplicationsPageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [reviewData, setReviewData] = useState<Record<string, ApplicationReviewData>>({});
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const jobData = getJobById(id);
      setJob(jobData || null);

      const jobApplications = getJobApplications(id);
      setApplications(jobApplications);

      // Load review data for all applications
      const allReviewData: Record<string, ApplicationReviewData> = {};
      jobApplications.forEach((app) => {
        allReviewData[app.id] = getApplicationReviewData(app.id);
      });
      setReviewData(allReviewData);

      setIsLoading(false);
    }
  }, [id]);

  const getApplicantName = (userId: string): string => {
    const applicant = mockUsers.find((u) => u.id === userId);
    return applicant?.name || "Unknown Applicant";
  };

  const getApplicantEmail = (userId: string): string => {
    const applicant = mockUsers.find((u) => u.id === userId);
    return applicant?.email || "";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(applicationId, newStatus);
    setApplications(getJobApplications(id));
  };

  const handleRatingChange = (applicationId: string, rating: number) => {
    updateApplicationReviewData(applicationId, { rating });
    setReviewData((prev) => ({
      ...prev,
      [applicationId]: { ...prev[applicationId], rating },
    }));
  };

  const handleNotesChange = (applicationId: string, notes: string) => {
    updateApplicationReviewData(applicationId, { notes });
    setReviewData((prev) => ({
      ...prev,
      [applicationId]: { ...prev[applicationId], notes },
    }));
  };

  const toggleExpanded = (applicationId: string) => {
    setExpandedApplication((prev) => (prev === applicationId ? null : applicationId));
  };

  const StarRating = ({
    rating,
    onRatingChange,
    applicationId,
  }: {
    rating: number;
    onRatingChange: (id: string, rating: number) => void;
    applicationId: string;
  }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(applicationId, star === rating ? 0 : star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <svg
              className={`h-5 w-5 transition-colors ${
                star <= (hoverRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-gray-500">{rating} of 5</span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900">Job Not Found</h2>
          <p className="mt-2 text-gray-600">
            The job you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/admin/jobs"
            className="mt-6 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/jobs"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Job Listings
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Applications for {job.title}</h1>
        <p className="mt-2 text-gray-600">
          {applications.length} application{applications.length !== 1 ? "s" : ""} received
        </p>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => {
            const applicantName = getApplicantName(application.userId);
            const applicantEmail = getApplicantEmail(application.userId);
            const appReviewData = reviewData[application.id] || { rating: 0, notes: "" };
            const isExpanded = expandedApplication === application.id;

            return (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                {/* Application Header */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Applicant Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary-600">
                            {applicantName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <Link
                            href={`/admin/applications/${application.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                          >
                            {applicantName}
                          </Link>
                          {applicantEmail && (
                            <p className="text-sm text-gray-500">{applicantEmail}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>Applied {formatDate(application.appliedAt)}</span>
                        {application.resumeFilename && (
                          <span className="flex items-center gap-1">
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
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            Resume attached
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col items-start lg:items-center gap-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Rating
                      </span>
                      <StarRating
                        rating={appReviewData.rating}
                        onRatingChange={handleRatingChange}
                        applicationId={application.id}
                      />
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex flex-col items-start lg:items-end gap-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Status
                      </span>
                      <select
                        value={application.status}
                        onChange={(e) =>
                          handleStatusChange(application.id, e.target.value as ApplicationStatus)
                        }
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          APPLICATION_STATUS_COLORS[application.status]
                        }`}
                      >
                        {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/applications/${application.id}`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View Full Application
                      </Link>
                    </div>
                    <button
                      onClick={() => toggleExpanded(application.id)}
                      className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
                    >
                      {isExpanded ? "Hide Details" : "Show Details"}
                      <svg
                        className={`h-4 w-4 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                      {/* Cover Letter Preview */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Cover Letter Preview
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-700 line-clamp-4">
                            {application.coverLetter}
                          </p>
                        </div>
                      </div>

                      {/* Private Notes */}
                      <div>
                        <label
                          htmlFor={`notes-${application.id}`}
                          className="text-sm font-medium text-gray-700 mb-2 block"
                        >
                          Private Notes
                          <span className="text-gray-400 font-normal ml-1">
                            (only visible to admins)
                          </span>
                        </label>
                        <textarea
                          id={`notes-${application.id}`}
                          value={appReviewData.notes}
                          onChange={(e) => handleNotesChange(application.id, e.target.value)}
                          placeholder="Add private notes about this applicant..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-900 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-16 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Applications Yet</h3>
          <p className="mt-2 text-gray-500">
            This job listing has not received any applications yet.
          </p>
          <Link
            href={`/jobs/${job.id}`}
            className="mt-6 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View Job Posting
          </Link>
        </div>
      )}
    </div>
  );
}
