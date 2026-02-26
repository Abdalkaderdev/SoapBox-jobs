import { Suspense } from "react";
import JobsContent from "@/components/JobsContent";
import { JobCardSkeletonGrid } from "@/components/JobCardSkeleton";

function JobsLoading() {
  return (
    <div className="space-y-4">
      {/* Search input skeleton */}
      <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />

      {/* Filter row skeleton */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-64" />
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-48" />
      </div>

      {/* Employment type filter skeleton */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-full animate-pulse w-24" />
        ))}
      </div>

      {/* Category filter skeleton */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-full animate-pulse w-28" />
        ))}
      </div>

      {/* Results count skeleton */}
      <div className="h-5 bg-gray-200 rounded animate-pulse w-40 mt-4" />

      {/* Job cards grid skeleton */}
      <div className="mt-4">
        <JobCardSkeletonGrid count={6} />
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="mt-2 text-gray-600">Find your next ministry opportunity</p>
      </div>

      <Suspense fallback={<JobsLoading />}>
        <JobsContent />
      </Suspense>
    </div>
  );
}
