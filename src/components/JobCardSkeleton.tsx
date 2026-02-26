"use client";

export default function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col animate-pulse">
      <div className="flex-1">
        {/* Header with title and save button */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-2">
            {/* Title placeholder */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            {/* Church name placeholder */}
            <div className="h-5 bg-gray-200 rounded w-1/2" />
          </div>
          {/* Save button placeholder */}
          <div className="flex-shrink-0 w-9 h-9 bg-gray-200 rounded-full" />
        </div>

        {/* Location and work arrangement */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-4" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>
      </div>

      {/* Footer with salary and date */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

export function JobCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  );
}
