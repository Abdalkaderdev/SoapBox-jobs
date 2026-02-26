export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  criteria: {
    search?: string;
    location?: string;
    categories?: string[];
    employmentTypes?: string[];
    workArrangements?: string[];
  };
  frequency: "immediate" | "daily" | "weekly";
  isActive: boolean;
  createdAt: string;
}

export const FREQUENCY_LABELS: Record<JobAlert["frequency"], string> = {
  immediate: "Immediately",
  daily: "Daily digest",
  weekly: "Weekly digest",
};
