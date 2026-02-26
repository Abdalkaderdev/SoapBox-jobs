"use client";

export default function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-5 sm:p-6 h-full flex flex-col">
      <div className="flex-1">
        {/* Header with title and save button */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-2 space-y-2">
            {/* Title placeholder */}
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-3/4 animate-pulse" />
            {/* Church name placeholder */}
            <div className="h-5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg w-1/2 animate-pulse" />
          </div>
          {/* Save button placeholder */}
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl animate-pulse" />
        </div>

        {/* Location and work arrangement */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded w-28 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-1 animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded w-20 animate-pulse" />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-7 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-full w-20 animate-pulse" />
          <div className="h-7 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full w-24 animate-pulse" />
        </div>
      </div>

      {/* Footer with salary and date */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <div className="h-5 bg-gradient-to-r from-gray-100 to-gray-50 rounded w-28 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded w-20 animate-pulse" />
      </div>
    </div>
  );
}

export function JobCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{ animationDelay: `${index * 100}ms` }}
          className="animate-fade-in"
        >
          <JobCardSkeleton />
        </div>
      ))}
    </div>
  );
}
