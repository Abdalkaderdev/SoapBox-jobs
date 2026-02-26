"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getChurchStats, getRecentApplications, getChurchName, getChurchJobs } from "@/lib/admin";
import { mockJobs } from "@/lib/mock-data";
import { Application, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "@/types/application";

interface ChurchStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  interviewsRequested: number;
}

const statsConfig = [
  {
    key: "totalJobs",
    label: "Total Jobs Posted",
    color: "primary",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: "activeJobs",
    label: "Active Listings",
    color: "success",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "totalApplications",
    label: "Total Applications",
    color: "secondary",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    key: "pendingApplications",
    label: "Pending Review",
    color: "warning",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary-50",
    iconBg: "bg-primary-100",
    icon: "text-primary-600",
    border: "border-primary-100",
    accent: "from-primary-500 to-primary-600",
  },
  secondary: {
    bg: "bg-secondary-50",
    iconBg: "bg-secondary-100",
    icon: "text-secondary-600",
    border: "border-secondary-100",
    accent: "from-secondary-500 to-secondary-600",
  },
  success: {
    bg: "bg-success-50",
    iconBg: "bg-success-100",
    icon: "text-success-600",
    border: "border-success-100",
    accent: "from-success-500 to-success-600",
  },
  warning: {
    bg: "bg-warning-50",
    iconBg: "bg-warning-100",
    icon: "text-warning-600",
    border: "border-warning-100",
    accent: "from-warning-500 to-warning-600",
  },
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ChurchStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [churchName, setChurchName] = useState("");

  useEffect(() => {
    if (user?.churchId) {
      setStats(getChurchStats(user.churchId));
      setRecentApplications(getRecentApplications(user.churchId, 5));
      setChurchName(getChurchName(user.churchId));
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getJobTitle = (jobId: string) => {
    const job = mockJobs.find((j) => j.id === jobId);
    return job?.title || "Unknown Position";
  };

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="h-5 bg-gray-100 rounded w-1/2"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 bg-white rounded-2xl border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="mt-1 text-gray-500">
              Here&apos;s what&apos;s happening at <span className="font-medium text-gray-700">{churchName}</span> today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/jobs/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post New Job
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat) => {
          const colors = colorClasses[stat.color as keyof typeof colorClasses];
          const value = stats[stat.key as keyof ChurchStats];
          return (
            <div
              key={stat.key}
              className={`relative overflow-hidden bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-gray-100 p-6 transition-all duration-300 group`}
            >
              {/* Accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.accent}`}></div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${colors.iconBg} ${colors.icon} group-hover:scale-110 transition-transform duration-200`}>
                  {stat.icon}
                </div>
              </div>

              {/* Subtle background decoration */}
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${colors.bg} rounded-full opacity-50 group-hover:opacity-70 transition-opacity`}></div>
            </div>
          );
        })}
      </div>

      {/* Interview Requests Banner */}
      {stats.interviewsRequested > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-r from-secondary-50 to-primary-50 border border-secondary-200 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary-100 rounded-xl">
                <svg className="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {stats.interviewsRequested} interview request{stats.interviewsRequested !== 1 ? 's' : ''} pending
                </p>
                <p className="text-sm text-gray-600">Review and schedule interviews with candidates</p>
              </div>
            </div>
            <Link
              href="/admin/applications?status=interview_requested"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-800 bg-white hover:bg-secondary-50 rounded-xl border border-secondary-200 transition-colors"
            >
              View Requests
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <p className="text-sm text-gray-500">Latest candidates for your positions</p>
            </div>
            <Link
              href="/admin/applications"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 group"
            >
              View All
              <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentApplications.length > 0 ? (
              recentApplications.map((application, index) => (
                <div
                  key={application.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {application.userId.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{getJobTitle(application.jobId)}</p>
                        <p className="text-sm text-gray-500 truncate">Applied {formatDate(application.appliedAt)}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                        APPLICATION_STATUS_COLORS[application.status]
                      }`}
                    >
                      {APPLICATION_STATUS_LABELS[application.status]}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No applications received yet</p>
                <p className="text-sm text-gray-400 mt-1">Applications will appear here once candidates apply</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
          </div>
          <div className="p-4 space-y-3">
            <Link
              href="/admin/jobs/new"
              className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-primary-50 hover:border-primary-200 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors">
                  <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Post a New Job</p>
                  <p className="text-sm text-gray-500">Create a new job listing for your church</p>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/admin/jobs"
              className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-secondary-50 hover:border-secondary-200 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary-100 rounded-xl group-hover:bg-secondary-200 transition-colors">
                  <svg className="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Manage Job Listings</p>
                  <p className="text-sm text-gray-500">Edit, pause, or close existing listings</p>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400 group-hover:text-secondary-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/admin/applications"
              className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-success-50 hover:border-success-100 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success-100 rounded-xl group-hover:bg-success-100 transition-colors">
                  <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Review Applications</p>
                  <p className="text-sm text-gray-500">View and respond to candidates</p>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400 group-hover:text-success-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/admin/church"
              className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-warning-50 hover:border-warning-100 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-warning-100 rounded-xl group-hover:bg-warning-100 transition-colors">
                  <svg className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Church Profile</p>
                  <p className="text-sm text-gray-500">Update your church information and branding</p>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400 group-hover:text-warning-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Tips */}
      <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 via-white to-secondary-50 rounded-2xl border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Pro Tip: Complete Your Church Profile</h3>
            <p className="text-sm text-gray-600 mt-1">
              Churches with complete profiles receive 40% more applications. Add photos, mission statement, and benefits to attract top candidates.
            </p>
            <Link
              href="/admin/church"
              className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Update Profile
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
