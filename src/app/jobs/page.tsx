import { Suspense } from "react";
import JobsContent from "@/components/JobsContent";
import { JobCardSkeletonGrid } from "@/components/JobCardSkeleton";

function JobsLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and filters card skeleton */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Search input skeleton */}
        <div className="h-14 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl animate-pulse" />

        {/* Filter dropdowns skeleton */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
          <div className="h-11 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl animate-pulse w-full sm:w-48" />
          <div className="h-11 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl animate-pulse w-full sm:w-44" />
        </div>

        {/* Employment type chips skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-28" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full animate-pulse w-20 sm:w-24" />
            ))}
          </div>
        </div>

        {/* Category chips skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full animate-pulse w-24 sm:w-28" />
            ))}
          </div>
        </div>
      </div>

      {/* Results count skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-44" />
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Job cards grid skeleton */}
      <JobCardSkeletonGrid count={6} />
    </div>
  );
}

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/30 via-white to-gray-50/50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full" />
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4 sm:mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-200"></span>
              </span>
              <span className="text-sm font-medium text-white/90">New opportunities added daily</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Find Your Calling
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Discover meaningful ministry opportunities at churches across the country
            </p>

            {/* Quick stats */}
            <div className="mt-6 sm:mt-8 inline-flex flex-wrap justify-center gap-4 sm:gap-8 lg:gap-12 bg-white/10 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-4 border border-white/10">
              <div className="text-center px-2">
                <div className="text-2xl sm:text-3xl font-bold text-white">500+</div>
                <div className="text-xs sm:text-sm text-primary-200 font-medium">Active Jobs</div>
              </div>
              <div className="hidden sm:block w-px bg-white/20 self-stretch" />
              <div className="text-center px-2">
                <div className="text-2xl sm:text-3xl font-bold text-white">200+</div>
                <div className="text-xs sm:text-sm text-primary-200 font-medium">Churches</div>
              </div>
              <div className="hidden sm:block w-px bg-white/20 self-stretch" />
              <div className="text-center px-2">
                <div className="text-2xl sm:text-3xl font-bold text-white">50+</div>
                <div className="text-xs sm:text-sm text-primary-200 font-medium">Cities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" className="fill-primary-50/30" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 -mt-2">
        <Suspense fallback={<JobsLoading />}>
          <JobsContent />
        </Suspense>
      </div>
    </div>
  );
}
