"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getSavedJobs, toggleSaveJob as toggleSaveJobStorage } from "@/lib/storage";

interface SavedJobsContextType {
  savedJobs: string[];
  isJobSaved: (jobId: string) => boolean;
  toggleSaveJob: (jobId: string) => void;
  savedJobsCount: number;
}

const SavedJobsContext = createContext<SavedJobsContextType>({
  savedJobs: [],
  isJobSaved: () => false,
  toggleSaveJob: () => {},
  savedJobsCount: 0,
});

export function SavedJobsProvider({ children }: { children: ReactNode }) {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSavedJobs(getSavedJobs());
    setIsLoaded(true);
  }, []);

  const isJobSaved = useCallback(
    (jobId: string) => savedJobs.includes(jobId),
    [savedJobs]
  );

  const toggleSaveJob = useCallback((jobId: string) => {
    const result = toggleSaveJobStorage(jobId);
    setSavedJobs(result.savedJobs);
  }, []);

  return (
    <SavedJobsContext.Provider
      value={{
        savedJobs,
        isJobSaved,
        toggleSaveJob,
        savedJobsCount: savedJobs.length,
      }}
    >
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  return useContext(SavedJobsContext);
}
