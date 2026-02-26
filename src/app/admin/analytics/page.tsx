"use client";

import { useState } from "react";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS, ApplicationStatus } from "@/types/application";

type DateRange = "7days" | "30days" | "90days" | "all";

interface AnalyticsData {
  totalViews: number;
  totalApplications: number;
  conversionRate: number;
  averageTimeToFill: string;
  applicationsByStatus: Record<ApplicationStatus, number>;
}

// Mock data generator based on date range
function getMockAnalytics(dateRange: DateRange): AnalyticsData {
  const multipliers: Record<DateRange, number> = {
    "7days": 0.15,
    "30days": 0.4,
    "90days": 0.75,
    "all": 1,
  };

  const multiplier = multipliers[dateRange];

  const totalViews = Math.round(2847 * multiplier);
  const totalApplications = Math.round(156 * multiplier);
  const conversionRate = totalViews > 0 ? (totalApplications / totalViews) * 100 : 0;

  return {
    totalViews,
    totalApplications,
    conversionRate,
    averageTimeToFill: "14 days",
    applicationsByStatus: {
      submitted: Math.round(42 * multiplier),
      under_review: Math.round(28 * multiplier),
      interview_requested: Math.round(35 * multiplier),
      offer_extended: Math.round(18 * multiplier),
      hired: Math.round(22 * multiplier),
      not_selected: Math.round(11 * multiplier),
      withdrawn: Math.round(0 * multiplier),
    },
  };
}

const DATE_RANGE_LABELS: Record<DateRange, string> = {
  "7days": "Last 7 days",
  "30days": "Last 30 days",
  "90days": "Last 90 days",
  "all": "All time",
};

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30days");
  const analytics = getMockAnalytics(dateRange);

  // Status colors for the bar chart (excluding withdrawn for display)
  const displayStatuses: ApplicationStatus[] = [
    "submitted",
    "under_review",
    "interview_requested",
    "offer_extended",
    "hired",
    "not_selected",
  ];

  const maxStatusCount = Math.max(
    ...displayStatuses.map((status) => analytics.applicationsByStatus[status])
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Track your job listing performance and application metrics.
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="dateRange" className="text-sm font-medium text-gray-700">
            Time Period:
          </label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white"
          >
            {(Object.keys(DATE_RANGE_LABELS) as DateRange[]).map((range) => (
              <option key={range} value={range}>
                {DATE_RANGE_LABELS[range]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Performance Metrics Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Listing Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Views */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Job Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Total Applications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalApplications}</p>
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.conversionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Average Time to Fill */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg
                  className="h-6 w-6 text-yellow-600"
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
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Time to Fill</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageTimeToFill}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications by Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Applications by Status</h2>
          <p className="text-sm text-gray-500 mt-1">
            Breakdown of all applications by their current status
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {displayStatuses.map((status) => {
              const count = analytics.applicationsByStatus[status];
              const percentage = maxStatusCount > 0 ? (count / maxStatusCount) * 100 : 0;

              return (
                <div key={status} className="flex items-center gap-4">
                  <div className="w-40 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${APPLICATION_STATUS_COLORS[status]}`}
                    >
                      {APPLICATION_STATUS_LABELS[status]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${getBarColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Applications</span>
              <span className="text-lg font-bold text-gray-900">
                {displayStatuses.reduce(
                  (sum, status) => sum + analytics.applicationsByStatus[status],
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Time to Fill Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time-to-Fill Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Average Time to Fill</span>
              <span className="font-semibold text-gray-900">14 days</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Fastest Time to Fill</span>
              <span className="font-semibold text-gray-900">3 days</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Longest Time to Fill</span>
              <span className="font-semibold text-gray-900">45 days</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Positions Filled</span>
              <span className="font-semibold text-gray-900">
                {analytics.applicationsByStatus.hired}
              </span>
            </div>
          </div>
        </div>

        {/* Conversion Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Views to Application</span>
              <span className="font-semibold text-gray-900">
                {analytics.conversionRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Application to Interview</span>
              <span className="font-semibold text-gray-900">
                {analytics.totalApplications > 0
                  ? (
                      (analytics.applicationsByStatus.interview_requested /
                        analytics.totalApplications) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Interview to Offer</span>
              <span className="font-semibold text-gray-900">
                {analytics.applicationsByStatus.interview_requested > 0
                  ? (
                      (analytics.applicationsByStatus.offer_extended /
                        analytics.applicationsByStatus.interview_requested) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Offer to Hire</span>
              <span className="font-semibold text-gray-900">
                {analytics.applicationsByStatus.offer_extended > 0
                  ? (
                      (analytics.applicationsByStatus.hired /
                        analytics.applicationsByStatus.offer_extended) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get bar colors based on status
function getBarColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    submitted: "bg-blue-500",
    under_review: "bg-yellow-500",
    interview_requested: "bg-purple-500",
    offer_extended: "bg-green-400",
    hired: "bg-green-600",
    not_selected: "bg-gray-400",
    withdrawn: "bg-red-400",
  };
  return colors[status];
}
