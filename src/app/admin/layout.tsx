"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/signin");
      } else if (user?.role !== "church_admin") {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "church_admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 h-12">
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/jobs"
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Job Listings
            </Link>
            <Link
              href="/admin/applications"
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Applications
            </Link>
            <Link
              href="/admin/church"
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Church Profile
            </Link>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
