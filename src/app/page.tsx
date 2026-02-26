import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Find Your Calling in
            <span className="text-primary-600"> Ministry</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Connect with churches and faith-based organizations seeking passionate individuals for meaningful ministry opportunities.
          </p>
          <div className="mt-10">
            <Link
              href="/jobs"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 md:text-lg"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
