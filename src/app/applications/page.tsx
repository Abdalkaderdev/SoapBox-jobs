"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getUserApplications, withdrawApplication } from "@/lib/applications";
import { mockJobs } from "@/lib/mock-data";
import { Application, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "@/types/application";

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setApplications(getUserApplications(user.id));
    }
  }, [user]);

  const handleWithdraw = (applicationId: string) => {
    if (confirm("Are you sure you want to withdraw this application?")) {
      withdrawApplication(applicationId);
      setApplications(getUserApplications(user!.id));
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    if (filter === "active") {
      return ["submitted", "under_review", "interview_requested"].includes(app.status);
    }
    if (filter === "closed") {
      return ["hired", "not_selected", "withdrawn", "offer_extended"].includes(app.status);
    }
    return app.status === filter;
  });

  const getJob = (jobId: string) => mockJobs.find((j) => j.id === jobId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-2 text-gray-600">
          Track the status of your job applications
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "closed", label: "Closed" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            {tab.value === "all" && ` (${applications.length})`}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const job = getJob(application.jobId);
            if (!job) return null;

            return (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {job.title}
                    </Link>
                    <p className="text-primary-600 font-medium">{job.church.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        APPLICATION_STATUS_COLORS[application.status]
                      }`}
                    >
                      {APPLICATION_STATUS_LABELS[application.status]}
                    </span>
                    <span className="text-sm text-gray-500">
                      Applied {formatDate(application.appliedAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                  <Link
                    href={`/applications/${application.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details
                  </Link>
                  {["submitted", "under_review"].includes(application.status) && (
                    <button
                      onClick={() => handleWithdraw(application.id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Withdraw Application
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="mt-2 text-gray-500">
            Start browsing jobs and apply to positions you&apos;re interested in.
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
