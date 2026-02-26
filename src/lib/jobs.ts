import { Job, JobCategory, EmploymentType, WorkArrangement, JobStatus } from "@/types/job";
import { mockJobs } from "./mock-data";

const CUSTOM_JOBS_KEY = "soapbox_custom_jobs";

export function getCustomJobs(): Job[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CUSTOM_JOBS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCustomJobs(jobs: Job[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_JOBS_KEY, JSON.stringify(jobs));
}

export function getAllJobs(): Job[] {
  const customJobs = getCustomJobs().filter((j) => j.status === "active" || !j.status);
  return [...mockJobs, ...customJobs];
}

export function getJobById(jobId: string): Job | undefined {
  // First check custom jobs
  const customJob = getCustomJobs().find((j) => j.id === jobId);
  if (customJob) return customJob;
  // Then check mock jobs
  return mockJobs.find((j) => j.id === jobId);
}

export function getChurchJobsWithStatus(churchId: string): Job[] {
  const mockChurchJobs = mockJobs
    .filter((j) => j.church.id === churchId)
    .map((j) => ({ ...j, status: "active" as JobStatus }));
  const customChurchJobs = getCustomJobs().filter((j) => j.church.id === churchId);
  return [...mockChurchJobs, ...customChurchJobs].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );
}

export interface CreateJobInput {
  title: string;
  description: string;
  category: JobCategory;
  employmentType: EmploymentType;
  workArrangement: WorkArrangement;
  location: string;
  churchId: string;
  churchName: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: "hourly" | "annual";
  qualifications?: string;
  responsibilities?: string;
  status?: JobStatus;
}

export function createJob(input: CreateJobInput): Job {
  const jobs = getCustomJobs();

  const newJob: Job = {
    id: `job-${Date.now()}`,
    title: input.title,
    description: input.description,
    category: input.category,
    employmentType: input.employmentType,
    workArrangement: input.workArrangement,
    location: input.location,
    church: {
      id: input.churchId,
      name: input.churchName,
    },
    salary:
      input.salaryMin || input.salaryMax
        ? {
            min: input.salaryMin,
            max: input.salaryMax,
            type: input.salaryType || "annual",
          }
        : undefined,
    postedAt: new Date().toISOString(),
    qualifications: input.qualifications,
    responsibilities: input.responsibilities,
    status: input.status || "active",
  };

  jobs.push(newJob);
  saveCustomJobs(jobs);

  return newJob;
}

export function updateJob(jobId: string, updates: Partial<Job>): Job | undefined {
  const jobs = getCustomJobs();
  const index = jobs.findIndex((j) => j.id === jobId);

  if (index === -1) return undefined;

  jobs[index] = { ...jobs[index], ...updates };
  saveCustomJobs(jobs);
  return jobs[index];
}

export function deleteJob(jobId: string): boolean {
  const jobs = getCustomJobs();
  const index = jobs.findIndex((j) => j.id === jobId);

  if (index === -1) return false;

  jobs.splice(index, 1);
  saveCustomJobs(jobs);
  return true;
}

export function updateJobStatus(jobId: string, status: JobStatus): Job | undefined {
  return updateJob(jobId, { status });
}
