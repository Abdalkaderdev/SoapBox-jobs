"use client";

import Link from "next/link";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { savedJobsCount } = useSavedJobs();
  const { user, isAuthenticated, logout } = useAuth();

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
            {isAuthenticated && user?.role === "church_admin" && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Church Admin
              </Link>
            )}
            {isAuthenticated && (
              <Link
                href="/applications"
                className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                My Applications
              </Link>
            )}
            <Link
              href="#"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
            >
              For Churches
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
