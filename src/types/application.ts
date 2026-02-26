export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  coverLetter: string;
  resumeUrl?: string;
  resumeFilename?: string;
  appliedAt: string;
  reviewedAt?: string;
  lastStatusChangeAt?: string;
}

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "interview_requested"
  | "offer_extended"
  | "hired"
  | "not_selected"
  | "withdrawn";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  interview_requested: "Interview Requested",
  offer_extended: "Offer Extended",
  hired: "Hired",
  not_selected: "Not Selected",
  withdrawn: "Withdrawn",
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  interview_requested: "bg-purple-100 text-purple-800",
  offer_extended: "bg-green-100 text-green-800",
  hired: "bg-green-200 text-green-900",
  not_selected: "bg-gray-100 text-gray-800",
  withdrawn: "bg-red-100 text-red-800",
};
