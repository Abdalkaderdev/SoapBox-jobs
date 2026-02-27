import { Job, JobCategory, EmploymentType, WorkArrangement, JobStatus } from "@/types/job";
import { mockJobs } from "./mock-data";

const CUSTOM_JOBS_KEY = "soapbox_custom_jobs";

// Church ownership verification types
export interface ChurchVerificationResult {
  success: boolean;
  error?: string;
}

// Allowed roles that can manage church jobs
const ALLOWED_CHURCH_ROLES = ["church_admin", "pastor", "staff_admin"] as const;
export type ChurchRole = (typeof ALLOWED_CHURCH_ROLES)[number];

/**
 * Verifies that a user has proper role and church affiliation to manage jobs for a church.
 * This is a client-side verification - in production, this should be done server-side.
 */
export function verifyChurchOwnership(
  userChurchId: string | undefined,
  userRole: string | undefined,
  targetChurchId: string
): ChurchVerificationResult {
  // Verify user has a church affiliation
  if (!userChurchId) {
    return {
      success: false,
      error: "User is not affiliated with any church",
    };
  }

  // Verify user has an allowed role
  if (!userRole || !ALLOWED_CHURCH_ROLES.includes(userRole as ChurchRole)) {
    return {
      success: false,
      error: "User does not have permission to manage church jobs",
    };
  }

  // Verify user's church matches the target church
  if (userChurchId !== targetChurchId) {
    return {
      success: false,
      error: "User is not authorized to manage jobs for this church",
    };
  }

  return { success: true };
}

/**
 * Verifies that a user can manage a specific job (owns the church the job belongs to).
 */
export function verifyJobOwnership(
  userChurchId: string | undefined,
  userRole: string | undefined,
  jobId: string
): ChurchVerificationResult {
  const job = getJobById(jobId);

  if (!job) {
    return {
      success: false,
      error: "Job not found",
    };
  }

  return verifyChurchOwnership(userChurchId, userRole, job.church.id);
}

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

export function createJob(
  input: CreateJobInput,
  userChurchId?: string,
  userRole?: string
): Job | null {
  // Verify ownership if user context is provided
  if (userChurchId !== undefined || userRole !== undefined) {
    const verification = verifyChurchOwnership(userChurchId, userRole, input.churchId);
    if (!verification.success) {
      console.error("Job creation verification failed:", verification.error);
      return null;
    }
  }

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

export function updateJob(
  jobId: string,
  updates: Partial<Job>,
  userChurchId?: string,
  userRole?: string
): Job | undefined {
  // Verify ownership if user context is provided
  if (userChurchId !== undefined || userRole !== undefined) {
    const verification = verifyJobOwnership(userChurchId, userRole, jobId);
    if (!verification.success) {
      console.error("Job update verification failed:", verification.error);
      return undefined;
    }
  }

  const jobs = getCustomJobs();
  const index = jobs.findIndex((j) => j.id === jobId);

  if (index === -1) return undefined;

  // Prevent changing the church association
  if (updates.church && updates.church.id !== jobs[index].church.id) {
    console.error("Cannot change job church association");
    return undefined;
  }

  jobs[index] = { ...jobs[index], ...updates };
  saveCustomJobs(jobs);
  return jobs[index];
}

export function deleteJob(
  jobId: string,
  userChurchId?: string,
  userRole?: string
): boolean {
  // Verify ownership if user context is provided
  if (userChurchId !== undefined || userRole !== undefined) {
    const verification = verifyJobOwnership(userChurchId, userRole, jobId);
    if (!verification.success) {
      console.error("Job deletion verification failed:", verification.error);
      return false;
    }
  }

  const jobs = getCustomJobs();
  const index = jobs.findIndex((j) => j.id === jobId);

  if (index === -1) return false;

  jobs.splice(index, 1);
  saveCustomJobs(jobs);
  return true;
}

export function updateJobStatus(
  jobId: string,
  status: JobStatus,
  userChurchId?: string,
  userRole?: string
): Job | undefined {
  return updateJob(jobId, { status }, userChurchId, userRole);
}
