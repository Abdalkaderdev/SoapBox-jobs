"use client";

export default function JobDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Back link skeleton */}
      <div className="h-5 bg-gray-200 rounded w-28 mb-6" />

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="h-7 bg-gray-200 rounded-full w-24" />
                <div className="h-7 bg-gray-200 rounded-full w-20" />
                <div className="h-7 bg-gray-200 rounded-full w-28" />
              </div>
              {/* Title */}
              <div className="h-9 bg-gray-200 rounded w-3/4 mb-2" />
              {/* Church name */}
              <div className="h-6 bg-gray-200 rounded w-48" />
            </div>

            {/* Key details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-t border-b border-gray-200 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg" />
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-1" />
                    <div className="h-5 bg-gray-200 rounded w-32" />
                  </div>
                </div>
              ))}
            </div>

            {/* Description section */}
            <div className="mb-8">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
              </div>
            </div>

            {/* Responsibilities section */}
            <div className="mb-8">
              <div className="h-6 bg-gray-200 rounded w-36 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-11/12" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>

            {/* Qualifications section */}
            <div className="mb-8">
              <div className="h-6 bg-gray-200 rounded w-56 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-10/12" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>

          {/* Similar Jobs skeleton */}
          <div className="mt-8">
            <div className="h-7 bg-gray-200 rounded w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded-full w-16" />
                    <div className="h-5 bg-gray-200 rounded-full w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
            {/* Apply button */}
            <div className="h-12 bg-gray-200 rounded-lg w-full mb-4" />

            {/* Save and share buttons */}
            <div className="flex gap-3 mb-6">
              <div className="h-10 bg-gray-200 rounded-lg flex-1" />
              <div className="h-10 bg-gray-200 rounded-lg flex-1" />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />

            {/* Church info */}
            <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div>
                <div className="h-5 bg-gray-200 rounded w-36 mb-1" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>

            {/* Church details */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>

            {/* View church link */}
            <div className="h-4 bg-gray-200 rounded w-28 mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
