"use client";

import Link from "next/link";
import { Job } from "@/types/job";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { trackJobClick } from "@/lib/analytics";

interface JobCardProps {
  job: Job;
}

function formatSalary(salary: Job["salary"]): string {
  if (!salary) return "Salary not specified";

  const { min, max, type } = salary;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  if (type === "hourly") {
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}/hr`;
    if (min) return `${formatter.format(min)}/hr`;
    return "Hourly";
  }

  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}/yr`;
  if (min) return `${formatter.format(min)}/yr`;
  return "Competitive salary";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getWorkArrangementIcon(arrangement: Job["workArrangement"]): string {
  switch (arrangement) {
    case "Remote": return "🏠";
    case "Hybrid": return "🔄";
    case "On-site": return "🏢";
    case "Flexible": return "✨";
    default: return "📍";
  }
}

export default function JobCard({ job }: JobCardProps) {
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const saved = isJobSaved(job.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(job.id);
  };

  const handleSaveKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      toggleSaveJob(job.id);
    }
  };

  const handleCardClick = () => {
    trackJobClick(job.id, job.title);
  };

  return (
    <article aria-labelledby={`job-title-${job.id}`} className="h-full">
      <Link
        href={`/jobs/${job.id}`}
        onClick={handleCardClick}
        className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        aria-label={`View details for ${job.title} at ${job.church.name}`}
      >
        <div className="group bg-white rounded-2xl shadow-card border border-gray-100 p-5 sm:p-6 hover:shadow-card-hover hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-full flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 pr-3">
                <h3
                  id={`job-title-${job.id}`}
                  className="text-lg font-bold text-gray-900 group-hover:text-primary-600 line-clamp-2 transition-colors"
                >
                  {job.title}
                </h3>
                <p className="text-primary-600 font-semibold mt-1.5 text-sm">{job.church.name}</p>
              </div>
              <button
                onClick={handleSaveClick}
                onKeyDown={handleSaveKeyDown}
                className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                  saved
                    ? "bg-red-50 hover:bg-red-100"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title} to your saved jobs`}
                aria-pressed={saved}
              >
                {saved ? (
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-primary-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{job.location}</span>
              </span>
              <span className="text-gray-300">|</span>
              <span className="inline-flex items-center gap-1">
                <span className="text-base">{getWorkArrangementIcon(job.workArrangement)}</span>
                <span className="font-medium">{job.workArrangement}</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                {job.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100">
                {job.employmentType}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <span className="text-sm font-bold text-gray-900">
              {formatSalary(job.salary)}
            </span>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
              <time dateTime={job.postedAt}>{formatDate(job.postedAt)}</time>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
