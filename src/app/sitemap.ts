import { MetadataRoute } from "next";
import { mockJobs } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://soapboxjobs.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Dynamic job pages
  const jobPages: MetadataRoute.Sitemap = mockJobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: new Date(job.postedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Get unique churches from jobs
  const uniqueChurches = Array.from(
    new Map(mockJobs.map((job) => [job.church.id, job.church])).values()
  );

  // Dynamic church pages
  const churchPages: MetadataRoute.Sitemap = uniqueChurches.map((church) => ({
    url: `${baseUrl}/churches/${church.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...jobPages, ...churchPages];
}
