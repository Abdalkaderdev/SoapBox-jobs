import Link from "next/link";

export default function JobNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Not Found</h2>
        <p className="text-gray-600 mb-8">
          The job you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
        >
          Browse All Jobs
        </Link>
      </div>
    </div>
  );
}
