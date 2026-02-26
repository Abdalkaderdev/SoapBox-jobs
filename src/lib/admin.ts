import { mockJobs } from "./mock-data";
import { getApplications } from "./applications";
import { Job } from "@/types/job";
import { Application } from "@/types/application";

export function getChurchJobs(churchId: string): Job[] {
  return mockJobs.filter((job) => job.church.id === churchId);
}

export function getChurchApplications(churchId: string): Application[] {
  const churchJobIds = getChurchJobs(churchId).map((job) => job.id);
  return getApplications().filter((app) => churchJobIds.includes(app.jobId));
}

export function getChurchStats(churchId: string) {
  const jobs = getChurchJobs(churchId);
  const applications = getChurchApplications(churchId);

  const activeJobs = jobs.length; // In a real app, we'd have job status
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (app) => app.status === "submitted" || app.status === "under_review"
  ).length;
  const interviewsRequested = applications.filter(
    (app) => app.status === "interview_requested"
  ).length;

  return {
    totalJobs: jobs.length,
    activeJobs,
    totalApplications,
    pendingApplications,
    interviewsRequested,
  };
}

export function getRecentApplications(churchId: string, limit: number = 5): Application[] {
  return getChurchApplications(churchId)
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, limit);
}

export function getChurchName(churchId: string): string {
  const job = mockJobs.find((j) => j.church.id === churchId);
  return job?.church.name || "Your Church";
}
