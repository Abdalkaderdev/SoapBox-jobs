const SAVED_JOBS_KEY = "soapbox_saved_jobs";

export function getSavedJobs(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(SAVED_JOBS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveJob(jobId: string): string[] {
  const savedJobs = getSavedJobs();
  if (!savedJobs.includes(jobId)) {
    savedJobs.push(jobId);
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
  }
  return savedJobs;
}

export function unsaveJob(jobId: string): string[] {
  const savedJobs = getSavedJobs().filter((id) => id !== jobId);
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
  return savedJobs;
}

export function isJobSaved(jobId: string): boolean {
  return getSavedJobs().includes(jobId);
}

export function toggleSaveJob(jobId: string): { saved: boolean; savedJobs: string[] } {
  if (isJobSaved(jobId)) {
    return { saved: false, savedJobs: unsaveJob(jobId) };
  } else {
    return { saved: true, savedJobs: saveJob(jobId) };
  }
}
