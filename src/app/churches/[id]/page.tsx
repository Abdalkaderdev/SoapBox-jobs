"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockJobs } from "@/lib/mock-data";
import { Job } from "@/types/job";
import JobCard from "@/components/JobCard";

interface ChurchProfile {
  id: string;
  name: string;
  denomination?: string;
  size?: string;
  location?: string;
  description?: string;
  logoUrl?: string;
  aboutTeam?: string;
  benefits?: string;
}

interface ChurchPageProps {
  params: Promise<{ id: string }>;
}

const STORAGE_KEY = "soapbox_church_profiles";

function getStoredProfiles(): Record<string, ChurchProfile> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function getChurchProfile(churchId: string): ChurchProfile | null {
  const profiles = getStoredProfiles();
  return profiles[churchId] || null;
}

function getBasicChurchInfo(churchId: string): { id: string; name: string; location?: string } | null {
  // Find any job from this church to get basic info
  const churchJob = mockJobs.find((job) => job.church.id === churchId);
  if (!churchJob) return null;
  return {
    id: churchId,
    name: churchJob.church.name,
    location: churchJob.location,
  };
}

function getChurchJobs(churchId: string): Job[] {
  return mockJobs.filter((job) => job.church.id === churchId);
}

export default function ChurchProfilePage({ params }: ChurchPageProps) {
  const { id } = use(params);
  const [church, setChurch] = useState<ChurchProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    // Try to get full profile from localStorage first
    const storedProfile = getChurchProfile(id);

    if (storedProfile) {
      setChurch(storedProfile);
    } else {
      // Fall back to basic info from mock jobs
      const basicInfo = getBasicChurchInfo(id);
      if (basicInfo) {
        setChurch({
          id: basicInfo.id,
          name: basicInfo.name,
          location: basicInfo.location,
        });
      } else {
        // Church not found
        setNotFoundState(true);
      }
    }

    // Get all active jobs for this church
    const churchJobs = getChurchJobs(id);
    setJobs(churchJobs);
    setIsLoading(false);
  }, [id]);

  if (notFoundState) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!church) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/jobs"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <svg
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Jobs
      </Link>

      {/* Church Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 sm:px-8 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Logo or Initial */}
            {church.logoUrl ? (
              <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <svg
                  className="h-12 w-12 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-4xl font-bold text-white">
                  {church.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Church Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {church.name}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 mt-3 text-white/80 text-sm">
                {church.denomination && (
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    {church.denomination}
                  </span>
                )}
                {church.size && (
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {church.size} members
                  </span>
                )}
                {church.location && (
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {church.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* About Our Church */}
          {church.description && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About Our Church
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {church.description}
              </p>
            </div>
          )}

          {/* About Our Team */}
          {church.aboutTeam && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About Our Team
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {church.aboutTeam}
              </p>
            </div>
          )}

          {/* What We Offer */}
          {church.benefits && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                What We Offer
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {church.benefits}
              </p>
            </div>
          )}

          {/* Show placeholder if no extra content */}
          {!church.description && !church.aboutTeam && !church.benefits && (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="h-12 w-12 mx-auto mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p>More information about this church coming soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Open Positions at {church.name}
          {jobs.length > 0 && (
            <span className="ml-2 text-lg font-normal text-gray-500">
              ({jobs.length} {jobs.length === 1 ? "position" : "positions"})
            </span>
          )}
        </h2>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <svg
              className="h-12 w-12 mx-auto mb-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500">
              No open positions at this time. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
