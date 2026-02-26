"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getUserAlerts, deleteAlert, toggleAlert } from "@/lib/alerts";
import { JobAlert, FREQUENCY_LABELS } from "@/types/alert";

export default function AlertsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [alerts, setAlerts] = useState<JobAlert[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setAlerts(getUserAlerts(user.id));
    }
  }, [user]);

  const handleToggle = (alertId: string) => {
    const updated = toggleAlert(alertId);
    if (updated) {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? updated : a))
      );
    }
  };

  const handleDelete = (alertId: string) => {
    if (confirm("Are you sure you want to delete this job alert?")) {
      deleteAlert(alertId);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    }
  };

  const formatCriteria = (alert: JobAlert): string => {
    const parts: string[] = [];

    if (alert.criteria.search) {
      parts.push(`"${alert.criteria.search}"`);
    }
    if (alert.criteria.location) {
      parts.push(alert.criteria.location);
    }
    if (alert.criteria.categories && alert.criteria.categories.length > 0) {
      parts.push(alert.criteria.categories.join(", "));
    }
    if (alert.criteria.employmentTypes && alert.criteria.employmentTypes.length > 0) {
      parts.push(alert.criteria.employmentTypes.join(", "));
    }
    if (alert.criteria.workArrangements && alert.criteria.workArrangements.length > 0) {
      parts.push(alert.criteria.workArrangements.join(", "));
    }

    return parts.length > 0 ? parts.join(" | ") : "All jobs";
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Job Alerts</h1>
        <p className="mt-2 text-gray-600">
          Get notified when new jobs match your search criteria
        </p>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                alert.isActive ? "border-gray-200" : "border-gray-200 opacity-60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {alert.name}
                    </h3>
                    {!alert.isActive && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        Paused
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCriteria(alert)}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {FREQUENCY_LABELS[alert.frequency]}
                    </span>
                    <span>Created {formatDate(alert.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Toggle switch */}
                  <button
                    onClick={() => handleToggle(alert.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      alert.isActive ? "bg-primary-600" : "bg-gray-200"
                    }`}
                    role="switch"
                    aria-checked={alert.isActive}
                    aria-label={alert.isActive ? "Disable alert" : "Enable alert"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        alert.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Delete alert"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
            </div>
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No job alerts yet
          </h3>
          <p className="mt-2 text-gray-500 max-w-sm mx-auto">
            Save your job searches to get notified when new positions match your criteria.
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
