"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { createAlert } from "@/lib/alerts";
import { JobAlert } from "@/types/alert";
import { trackSearch, trackFilterUse, trackPageView } from "@/lib/analytics";

type SortOption = "newest" | "oldest" | "salary-high" | "salary-low";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "salary-high", label: "Salary (high to low)" },
  { value: "salary-low", label: "Salary (low to high)" },
];

const JOBS_PER_PAGE = 12;

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

// Generate page numbers to display
function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    // Always show last page
    pages.push(totalPages);
  }

  return pages;
}

export default function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  // Modal state for save search
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [alertName, setAlertName] = useState("");
  const [alertFrequency, setAlertFrequency] = useState<JobAlert["frequency"]>("daily");
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // Pagination state - read from URL
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    return page > 0 ? page : 1;
  });

  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedSalaryMin = useDebounce(salaryMin, 300);
  const debouncedSalaryMax = useDebounce(salaryMax, 300);

  // Track page view on mount
  const hasTrackedPageView = useRef(false);
  useEffect(() => {
    if (!hasTrackedPageView.current) {
      trackPageView("/jobs");
      hasTrackedPageView.current = true;
    }
  }, []);

  // Track search queries (debounced) - moved after filteredAndSortedJobs definition
  const lastTrackedSearch = useRef<string>("");

  // Reset to page 1 when filters change
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
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
    if (currentPage > 1) params.set("page", currentPage.toString());

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
    currentPage,
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

  // Pagination calculations
  const totalJobs = filteredAndSortedJobs.length;
  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = Math.min(startIndex + JOBS_PER_PAGE, totalJobs);
  const paginatedJobs = filteredAndSortedJobs.slice(startIndex, endIndex);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  // Ensure current page is valid when total pages changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Track search queries (debounced)
  useEffect(() => {
    if (debouncedSearch && debouncedSearch !== lastTrackedSearch.current) {
      trackSearch(debouncedSearch, filteredAndSortedJobs.length);
      lastTrackedSearch.current = debouncedSearch;
    }
  }, [debouncedSearch, filteredAndSortedJobs.length]);

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
      const value = e.target.value;
      setSelectedLocation(value);
      if (value) {
        trackFilterUse("location", value);
      }
    },
    []
  );

  const handleCategoryToggle = useCallback((category: JobCategory) => {
    setSelectedCategories((prev) => {
      const isRemoving = prev.includes(category);
      if (!isRemoving) {
        trackFilterUse("category", category);
      }
      return isRemoving
        ? prev.filter((c) => c !== category)
        : [...prev, category];
    });
  }, []);

  const handleEmploymentTypeToggle = useCallback((type: EmploymentType) => {
    setSelectedEmploymentTypes((prev) => {
      const isRemoving = prev.includes(type);
      if (!isRemoving) {
        trackFilterUse("employmentType", type);
      }
      return isRemoving ? prev.filter((t) => t !== type) : [...prev, type];
    });
  }, []);

  const handleWorkArrangementToggle = useCallback((arrangement: WorkArrangement) => {
    setSelectedWorkArrangements((prev) => {
      const isRemoving = prev.includes(arrangement);
      if (!isRemoving) {
        trackFilterUse("workArrangement", arrangement);
      }
      return isRemoving
        ? prev.filter((a) => a !== arrangement)
        : [...prev, arrangement];
    });
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
    setCurrentPage(1);
  }, []);

  const hasActiveFilters =
    debouncedSearch ||
    selectedLocation ||
    selectedCategories.length > 0 ||
    selectedEmploymentTypes.length > 0 ||
    selectedWorkArrangements.length > 0 ||
    salaryMin ||
    salaryMax;

  const handleOpenSaveModal = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
    // Generate default name based on filters
    const nameParts: string[] = [];
    if (debouncedSearch) nameParts.push(`"${debouncedSearch}"`);
    if (selectedLocation) nameParts.push(selectedLocation);
    if (selectedCategories.length > 0) nameParts.push(selectedCategories.join(", "));
    setAlertName(nameParts.length > 0 ? nameParts.join(" - ") : "My Job Alert");
    setShowSaveModal(true);
    setSaveSuccess(false);
  }, [isAuthenticated, router, debouncedSearch, selectedLocation, selectedCategories]);

  const handleSaveAlert = useCallback(() => {
    if (!user || !alertName.trim()) return;

    createAlert({
      userId: user.id,
      name: alertName.trim(),
      criteria: {
        search: debouncedSearch || undefined,
        location: selectedLocation || undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        employmentTypes: selectedEmploymentTypes.length > 0 ? selectedEmploymentTypes : undefined,
        workArrangements: selectedWorkArrangements.length > 0 ? selectedWorkArrangements : undefined,
      },
      frequency: alertFrequency,
      isActive: true,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setShowSaveModal(false);
      setAlertName("");
      setSaveSuccess(false);
    }, 1500);
  }, [
    user,
    alertName,
    alertFrequency,
    debouncedSearch,
    selectedLocation,
    selectedCategories,
    selectedEmploymentTypes,
    selectedWorkArrangements,
  ]);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

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
            <>
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
              <button
                onClick={handleOpenSaveModal}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 ml-2"
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Save this search
              </button>
            </>
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
          {totalJobs > 0 ? (
            <>
              Showing {startIndex + 1}-{endIndex} of {totalJobs} jobs
            </>
          ) : (
            <>Showing 0 of {mockJobs.length} jobs</>
          )}
        </p>
      </div>

      {/* Job listings grid */}
      {paginatedJobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-center"
              aria-label="Pagination"
            >
              <div className="flex items-center gap-1">
                {/* Previous button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="Previous page"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1">Previous</span>
                </button>

                {/* Page numbers */}
                <div className="hidden sm:flex items-center gap-1">
                  {pageNumbers.map((pageNum, index) =>
                    pageNum === "ellipsis" ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 text-sm text-gray-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                          currentPage === pageNum
                            ? "bg-primary-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                {/* Mobile page indicator */}
                <span className="sm:hidden px-3 py-2 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                {/* Next button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="Next page"
                >
                  <span className="mr-1">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </nav>
          )}
        </>
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

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowSaveModal(false)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              {saveSuccess ? (
                <div className="text-center py-4">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Alert Saved!</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    You&apos;ll be notified when new jobs match your search.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Save this search
                    </h2>
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="h-6 w-6"
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
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Get notified when new jobs match your current filters.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="alertName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Alert Name
                      </label>
                      <input
                        type="text"
                        id="alertName"
                        value={alertName}
                        onChange={(e) => setAlertName(e.target.value)}
                        placeholder="e.g., Worship Leader jobs in Austin"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="alertFrequency"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Notification Frequency
                      </label>
                      <select
                        id="alertFrequency"
                        value={alertFrequency}
                        onChange={(e) =>
                          setAlertFrequency(e.target.value as JobAlert["frequency"])
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                      >
                        <option value="immediate">Immediately</option>
                        <option value="daily">Daily digest</option>
                        <option value="weekly">Weekly digest</option>
                      </select>
                    </div>

                    {/* Current filters summary */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Current filters:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {debouncedSearch && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-100 text-primary-700">
                            &quot;{debouncedSearch}&quot;
                          </span>
                        )}
                        {selectedLocation && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-100 text-primary-700">
                            {selectedLocation}
                          </span>
                        )}
                        {selectedCategories.map((cat) => (
                          <span
                            key={cat}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-100 text-primary-700"
                          >
                            {cat}
                          </span>
                        ))}
                        {selectedEmploymentTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-100 text-primary-700"
                          >
                            {type}
                          </span>
                        ))}
                        {selectedWorkArrangements.map((arr) => (
                          <span
                            key={arr}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-100 text-primary-700"
                          >
                            {arr}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAlert}
                      disabled={!alertName.trim()}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Alert
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
