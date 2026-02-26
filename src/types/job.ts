export type JobStatus = "draft" | "active" | "closed" | "filled";

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  employmentType: EmploymentType;
  workArrangement: WorkArrangement;
  location: string;
  church: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  salary?: {
    min?: number;
    max?: number;
    type: "hourly" | "annual";
  };
  postedAt: string;
  qualifications?: string;
  responsibilities?: string;
  status?: JobStatus;
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: "Draft",
  active: "Active",
  closed: "Closed",
  filled: "Filled",
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-700",
  filled: "bg-blue-100 text-blue-700",
};

export type JobCategory =
  | "Pastoral"
  | "Worship & Music"
  | "Youth & Children"
  | "Administrative"
  | "Technical & Media"
  | "Facilities"
  | "Outreach"
  | "Counseling"
  | "Education"
  | "Executive";

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Volunteer"
  | "Internship";

export type WorkArrangement =
  | "On-site"
  | "Remote"
  | "Hybrid"
  | "Flexible";

export const JOB_CATEGORIES: JobCategory[] = [
  "Pastoral",
  "Worship & Music",
  "Youth & Children",
  "Administrative",
  "Technical & Media",
  "Facilities",
  "Outreach",
  "Counseling",
  "Education",
  "Executive",
];

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Volunteer",
  "Internship",
];

export const WORK_ARRANGEMENTS: WorkArrangement[] = [
  "On-site",
  "Remote",
  "Hybrid",
  "Flexible",
];
