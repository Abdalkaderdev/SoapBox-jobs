import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { mockJobs } from "@/lib/mock-data";
import { Job } from "@/types/job";
import JobDetailSidebar from "@/components/JobDetailSidebar";
import SimilarJobs from "@/components/SimilarJobs";
import PageTracker from "@/components/PageTracker";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    return {
      title: "Job Not Found - SoapBox Jobs",
      description: "The requested job posting could not be found.",
    };
  }

  const title = `${job.title} at ${job.church.name} - SoapBox Jobs`;
  const description = `${job.employmentType} ${job.category} position at ${job.church.name} in ${job.location}. ${job.description.substring(0, 150)}...`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

function formatSalary(salary: Job["salary"]): string {
  if (!salary) return "Competitive salary";

  const { min, max, type } = salary;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  if (type === "hourly") {
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)} per hour`;
    if (min) return `${formatter.format(min)} per hour`;
    return "Hourly rate";
  }

  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)} per year`;
  if (min) return `${formatter.format(min)} per year`;
  return "Competitive salary";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getWorkArrangementIcon(arrangement: Job["workArrangement"]): string {
  switch (arrangement) {
    case "Remote":
      return "🏠";
    case "Hybrid":
      return "🔄";
    case "On-site":
      return "🏢";
    case "Flexible":
      return "✨";
    default:
      return "📍";
  }
}

export async function generateStaticParams() {
  return mockJobs.map((job) => ({
    id: job.id,
  }));
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageTracker page={`/jobs/${job.id}`} />
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

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {job.category}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {job.employmentType}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {getWorkArrangementIcon(job.workArrangement)} {job.workArrangement}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <Link
                href={`/churches/${job.church.id}`}
                className="text-lg text-primary-600 font-medium hover:text-primary-700 hover:underline transition-colors"
              >
                {job.church.name}
              </Link>
            </div>

            {/* Key details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-t border-b border-gray-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-primary-600"
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
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium text-gray-900">{formatSalary(job.salary)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-primary-600"
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
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employment Type</p>
                  <p className="font-medium text-gray-900">{job.employmentType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posted</p>
                  <p className="font-medium text-gray-900">{formatDate(job.postedAt)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this position</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.responsibilities}</p>
                </div>
              </div>
            )}

            {/* Qualifications */}
            {job.qualifications && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Qualifications & Requirements
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.qualifications}</p>
                </div>
              </div>
            )}
          </div>

          {/* Similar Jobs Section */}
          <SimilarJobs currentJob={job} />
        </div>

        {/* Sidebar */}
        <div className="mt-8 lg:mt-0">
          <JobDetailSidebar job={job} />
        </div>
      </div>
    </div>
  );
}
