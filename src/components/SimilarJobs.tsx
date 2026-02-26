"use client";

import { Job } from "@/types/job";
import { mockJobs } from "@/lib/mock-data";
import JobCard from "@/components/JobCard";

interface SimilarJobsProps {
  currentJob: Job;
}

function findSimilarJobs(currentJob: Job, maxJobs: number = 4): Job[] {
  // First, find jobs with the same category (excluding current job)
  const sameCategoryJobs = mockJobs.filter(
    (job) => job.id !== currentJob.id && job.category === currentJob.category
  );

  // If we have enough jobs from the same category, return them
  if (sameCategoryJobs.length >= maxJobs) {
    return sameCategoryJobs.slice(0, maxJobs);
  }

  // Otherwise, find jobs with the same location as fallback
  const sameLocationJobs = mockJobs.filter(
    (job) =>
      job.id !== currentJob.id &&
      job.category !== currentJob.category && // Exclude already matched category jobs
      job.location === currentJob.location
  );

  // Combine category matches first, then location matches
  const combinedJobs = [...sameCategoryJobs, ...sameLocationJobs];

  return combinedJobs.slice(0, maxJobs);
}

export default function SimilarJobs({ currentJob }: SimilarJobsProps) {
  const similarJobs = findSimilarJobs(currentJob);

  if (similarJobs.length === 0) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          You might also like
        </h2>
        <p className="text-gray-500">No similar jobs found at this time.</p>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        You might also like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {similarJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
