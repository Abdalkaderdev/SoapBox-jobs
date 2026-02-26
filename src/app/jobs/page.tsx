import { Suspense } from "react";
import JobsContent from "@/components/JobsContent";

function JobsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-64" />
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ))}
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
