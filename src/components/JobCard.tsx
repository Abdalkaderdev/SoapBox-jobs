import Link from "next/link";
import { Job } from "@/types/job";

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
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer h-full flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2">
                {job.title}
              </h3>
              <p className="text-primary-600 font-medium mt-1">{job.church.name}</p>
            </div>
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
            {formatDate(job.postedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
