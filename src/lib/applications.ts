import { Application, ApplicationStatus } from "@/types/application";

const APPLICATIONS_KEY = "soapbox_applications";

export function getApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(APPLICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveApplications(applications: Application[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
}

export function getUserApplications(userId: string): Application[] {
  return getApplications().filter((app) => app.userId === userId);
}

export function getJobApplications(jobId: string): Application[] {
  return getApplications().filter((app) => app.jobId === jobId);
}

export function getApplication(applicationId: string): Application | undefined {
  return getApplications().find((app) => app.id === applicationId);
}

export function getUserApplicationForJob(userId: string, jobId: string): Application | undefined {
  return getApplications().find((app) => app.userId === userId && app.jobId === jobId);
}

export function hasUserApplied(userId: string, jobId: string): boolean {
  return !!getUserApplicationForJob(userId, jobId);
}

export function createApplication(
  userId: string,
  jobId: string,
  coverLetter: string,
  resumeFilename?: string
): Application {
  const applications = getApplications();

  const newApplication: Application = {
    id: `app-${Date.now()}`,
    userId,
    jobId,
    status: "submitted",
    coverLetter,
    resumeFilename,
    resumeUrl: resumeFilename ? `/uploads/${resumeFilename}` : undefined,
    appliedAt: new Date().toISOString(),
    lastStatusChangeAt: new Date().toISOString(),
  };

  applications.push(newApplication);
  saveApplications(applications);

  return newApplication;
}

export function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Application | undefined {
  const applications = getApplications();
  const index = applications.findIndex((app) => app.id === applicationId);

  if (index === -1) return undefined;

  applications[index] = {
    ...applications[index],
    status,
    lastStatusChangeAt: new Date().toISOString(),
    reviewedAt: status !== "submitted" ? new Date().toISOString() : applications[index].reviewedAt,
  };

  saveApplications(applications);
  return applications[index];
}

export function withdrawApplication(applicationId: string): Application | undefined {
  return updateApplicationStatus(applicationId, "withdrawn");
}
