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
    <article aria-labelledby={`job-title-${job.id}`}>
      <Link
        href={`/jobs/${job.id}`}
        onClick={handleCardClick}
        className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        aria-label={`View details for ${job.title} at ${job.church.name}`}
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer h-full flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 pr-2">
                <h3
                  id={`job-title-${job.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
                >
                  {job.title}
                </h3>
                <p className="text-primary-600 font-medium mt-1">{job.church.name}</p>
              </div>
              <button
                onClick={handleSaveClick}
                onKeyDown={handleSaveKeyDown}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
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
                    className="h-5 w-5 text-gray-400 hover:text-red-500"
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

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <span>📍</span>
              {job.location}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              {getWorkArrangementIcon(job.workArrangement)}
              {job.workArrangement}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {job.category}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {job.employmentType}
            </span>
          </div>
        </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <span className="text-sm font-medium text-gray-900">
              {formatSalary(job.salary)}
            </span>
            <span className="text-xs text-gray-500">
              <time dateTime={job.postedAt}>{formatDate(job.postedAt)}</time>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
