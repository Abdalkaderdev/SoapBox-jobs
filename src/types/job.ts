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
}

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
