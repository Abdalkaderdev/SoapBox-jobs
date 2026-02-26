export interface JobReport {
  id: string;
  jobId: string;
  userId: string;
  reason: string;
  details?: string;
  createdAt: string;
}

export type ReportReason =
  | "Spam"
  | "Inappropriate content"
  | "Scam/fraud"
  | "Incorrect information"
  | "Other";

export const REPORT_REASONS: ReportReason[] = [
  "Spam",
  "Inappropriate content",
  "Scam/fraud",
  "Incorrect information",
  "Other",
];

const REPORTS_KEY = "soapbox_reports";

export function getReports(): JobReport[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(REPORTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveReports(reports: JobReport[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function saveReport(
  userId: string,
  jobId: string,
  reason: string,
  details?: string
): JobReport {
  const reports = getReports();

  const newReport: JobReport = {
    id: `report-${Date.now()}`,
    jobId,
    userId,
    reason,
    details,
    createdAt: new Date().toISOString(),
  };

  reports.push(newReport);
  saveReports(reports);

  return newReport;
}

export function hasUserReported(userId: string, jobId: string): boolean {
  const reports = getReports();
  return reports.some((report) => report.userId === userId && report.jobId === jobId);
}

export function getJobReports(jobId: string): JobReport[] {
  return getReports().filter((report) => report.jobId === jobId);
}

export function getUserReports(userId: string): JobReport[] {
  return getReports().filter((report) => report.userId === userId);
}
