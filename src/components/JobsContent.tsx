"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";
import { mockJobs } from "@/lib/mock-data";
import {
  JOB_CATEGORIES,
  JobCategory,
  EMPLOYMENT_TYPES,
  EmploymentType,
  WORK_ARRANGEMENTS,
  WorkArrangement,
  Job,
} from "@/types/job";

type SortOption = "newest" | "oldest" | "salary-high" | "salary-low";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "salary-high", label: "Salary (high to low)" },
  { value: "salary-low", label: "Salary (low to high)" },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Extract unique locations from mock data
const locations = Array.from(
  new Set(mockJobs.map((job) => job.location))
).sort();

// Helper to get annual salary for comparison
function getAnnualSalary(job: Job): number | null {
  if (!job.salary) return null;
  const { min, max, type } = job.salary;
  const baseSalary = max || min || 0;
  if (type === "hourly") {
    return baseSalary * 2080; // 40 hours * 52 weeks
  }
  return baseSalary;
}

export default function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [selectedCategories, setSelectedCategories] = useState<JobCategory[]>(() => {
    const categoriesParam = searchParams.get("categories");
    if (categoriesParam) {
      return categoriesParam.split(",").filter((c): c is JobCategory =>
        JOB_CATEGORIES.includes(c as JobCategory)
      );
    }
    return [];
  });
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<EmploymentType[]>(() => {
    const param = searchParams.get("employmentTypes");
    if (param) {
      return param.split(",").filter((t): t is EmploymentType =>
        EMPLOYMENT_TYPES.includes(t as EmploymentType)
      );
    }
    return [];
  });
  const [selectedWorkArrangements, setSelectedWorkArrangements] = useState<WorkArrangement[]>(() => {
    const param = searchParams.get("workArrangements");
    if (param) {
      return param.split(",").filter((t): t is WorkArrangement =>
        WORK_ARRANGEMENTS.includes(t as WorkArrangement)
      );
    }
    return [];
  });
  const [salaryMin, setSalaryMin] = useState(searchParams.get("salaryMin") || "");
  const [salaryMax, setSalaryMax] = useState(searchParams.get("salaryMax") || "");
  const [showNoSalary, setShowNoSalary] = useState(searchParams.get("showNoSalary") === "true");
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "newest"
  );

  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedSalaryMin = useDebounce(salaryMin, 300);
  const debouncedSalaryMax = useDebounce(salaryMax, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    if (selectedEmploymentTypes.length > 0) params.set("employmentTypes", selectedEmploymentTypes.join(","));
    if (selectedWorkArrangements.length > 0) params.set("workArrangements", selectedWorkArrangements.join(","));
    if (debouncedSalaryMin) params.set("salaryMin", debouncedSalaryMin);
    if (debouncedSalaryMax) params.set("salaryMax", debouncedSalaryMax);
    if (showNoSalary) params.set("showNoSalary", "true");
    if (sortBy !== "newest") params.set("sort", sortBy);

    const queryString = params.toString();
    router.replace(queryString ? `/jobs?${queryString}` : "/jobs", { scroll: false });
  }, [
    debouncedSearch,
    selectedLocation,
    selectedCategories,
    selectedEmploymentTypes,
    selectedWorkArrangements,
    debouncedSalaryMin,
    debouncedSalaryMax,
    showNoSalary,
    sortBy,
    router,
  ]);

  const filteredAndSortedJobs = useMemo(() => {
    let result = mockJobs.filter((job) => {
      // Text search filter
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase();
        const searchableText = [job.title, job.description, job.church.name]
          .join(" ")
          .toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Location filter
      if (selectedLocation && job.location !== selectedLocation) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(job.category)) {
        return false;
      }

      // Employment type filter
      if (selectedEmploymentTypes.length > 0 && !selectedEmploymentTypes.includes(job.employmentType)) {
        return false;
      }

      // Work arrangement filter
      if (selectedWorkArrangements.length > 0 && !selectedWorkArrangements.includes(job.workArrangement)) {
        return false;
      }

      // Salary filter
      const minSalary = debouncedSalaryMin ? parseInt(debouncedSalaryMin) : null;
      const maxSalary = debouncedSalaryMax ? parseInt(debouncedSalaryMax) : null;

      if (minSalary || maxSalary) {
        const annualSalary = getAnnualSalary(job);

        if (annualSalary === null) {
          // Job has no salary - only show if showNoSalary is checked
          if (!showNoSalary) return false;
        } else {
          if (minSalary && annualSalary < minSalary) return false;
          if (maxSalary && annualSalary > maxSalary) return false;
        }
      }

      return true;
    });

    // Sort results
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        case "oldest":
          return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
        case "salary-high": {
          const salaryA = getAnnualSalary(a) || 0;
          const salaryB = getAnnualSalary(b) || 0;
          return salaryB - salaryA;
        }
        case "salary-low": {
          const salaryA = getAnnualSalary(a) || Infinity;
          const salaryB = getAnnualSalary(b) || Infinity;
          return salaryA - salaryB;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [
    debouncedSearch,
    selectedLocation,
    selectedCategories,
    selectedEmploymentTypes,
    selectedWorkArrangements,
    debouncedSalaryMin,
    debouncedSalaryMax,
    showNoSalary,
    sortBy,
  ]);

  // Count jobs per category
  const categoryJobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    JOB_CATEGORIES.forEach((cat) => {
      counts[cat] = mockJobs.filter((job) => {
        if (debouncedSearch.trim()) {
          const query = debouncedSearch.toLowerCase();
          const searchableText = [job.title, job.description, job.church.name]
            .join(" ")
            .toLowerCase();
          if (!searchableText.includes(query)) return false;
        }
        if (selectedLocation && job.location !== selectedLocation) return false;
        return job.category === cat;
      }).length;
    });
    return counts;
  }, [debouncedSearch, selectedLocation]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedLocation(e.target.value);
    },
    []
  );

  const handleCategoryToggle = useCallback((category: JobCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }, []);

  const handleEmploymentTypeToggle = useCallback((type: EmploymentType) => {
    setSelectedEmploymentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const handleWorkArrangementToggle = useCallback((arrangement: WorkArrangement) => {
    setSelectedWorkArrangements((prev) =>
      prev.includes(arrangement)
        ? prev.filter((a) => a !== arrangement)
        : [...prev, arrangement]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedCategories([]);
    setSelectedEmploymentTypes([]);
    setSelectedWorkArrangements([]);
    setSalaryMin("");
    setSalaryMax("");
    setShowNoSalary(false);
    setSortBy("newest");
  }, []);

  const hasActiveFilters =
    debouncedSearch ||
    selectedLocation ||
    selectedCategories.length > 0 ||
    selectedEmploymentTypes.length > 0 ||
    selectedWorkArrangements.length > 0 ||
    salaryMin ||
    salaryMax;

  return (
    <>
      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search jobs by title, description, or church name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Location filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location:
            </label>
            <select
              id="location"
              value={selectedLocation}
              onChange={handleLocationChange}
              className="block w-48 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="block w-44 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear all filters
            </button>
          )}
        </div>

        {/* Employment type filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Employment Type:
          </label>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((type) => {
              const isSelected = selectedEmploymentTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => handleEmploymentTypeToggle(type)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Work arrangement filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Work Arrangement:
          </label>
          <div className="flex flex-wrap gap-2">
            {WORK_ARRANGEMENTS.map((arrangement) => {
              const isSelected = selectedWorkArrangements.includes(arrangement);
              return (
                <button
                  key={arrangement}
                  onClick={() => handleWorkArrangementToggle(arrangement)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {arrangement}
                </button>
              );
            })}
          </div>
        </div>

        {/* Salary range filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Salary Range (Annual):
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                placeholder="Min"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              />
            </div>
            <span className="text-gray-500">to</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                placeholder="Max"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showNoSalary}
                onChange={(e) => setShowNoSalary(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Show jobs without salary
            </label>
          </div>
        </div>

        {/* Category filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Categories:
          </label>
          <div className="flex flex-wrap gap-2">
            {JOB_CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category);
              const count = categoryJobCounts[category];
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                  <span
                    className={`ml-1.5 ${
                      isSelected ? "text-primary-200" : "text-gray-500"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredAndSortedJobs.length} of {mockJobs.length} jobs
        </p>
      </div>

      {/* Job listings grid */}
      {filteredAndSortedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search terms or filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
