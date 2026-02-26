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
      {/* Search and filters card */}
      <div className="mb-6 sm:mb-8 bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        {/* Search header section */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6 border-b border-gray-100">
          {/* Search input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors"
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
              className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-primary-500 text-gray-900 text-base transition-colors shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter row - dropdowns and actions */}
          <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Location filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label htmlFor="location" className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                Location
              </label>
              <div className="relative">
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="block w-full sm:w-52 pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-gray-900 text-sm font-medium appearance-none cursor-pointer transition-colors"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label htmlFor="sort" className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                Sort by
              </label>
              <div className="relative">
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="block w-full sm:w-48 pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-gray-900 text-sm font-medium appearance-none cursor-pointer transition-colors"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden sm:block flex-1" />

            {/* Action buttons */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 sm:pt-0">
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear filters
                </button>
                <button
                  onClick={handleOpenSaveModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="hidden sm:inline">Save search</span>
                  <span className="sm:hidden">Save</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter chips section */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Employment type filter */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Employment Type
            </label>
            <div className="flex flex-wrap gap-2">
              {EMPLOYMENT_TYPES.map((type) => {
                const isSelected = selectedEmploymentTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => handleEmploymentTypeToggle(type)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                    }`}
                  >
                    {isSelected && (
                      <svg className="h-3.5 w-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Work arrangement filter */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Work Arrangement
            </label>
            <div className="flex flex-wrap gap-2">
              {WORK_ARRANGEMENTS.map((arrangement) => {
                const isSelected = selectedWorkArrangements.includes(arrangement);
                return (
                  <button
                    key={arrangement}
                    onClick={() => handleWorkArrangementToggle(arrangement)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                    }`}
                  >
                    {isSelected && (
                      <svg className="h-3.5 w-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {arrangement}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Salary range filter */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Salary Range (Annual)
            </label>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border-2 border-gray-200 focus-within:border-primary-500 transition-colors">
                <span className="text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full sm:w-24 bg-transparent focus:outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
              <span className="text-gray-400 font-medium hidden sm:inline">to</span>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border-2 border-gray-200 focus-within:border-primary-500 transition-colors">
                <span className="text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full sm:w-24 bg-transparent focus:outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none bg-gray-50 rounded-xl px-3 py-2 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <input
                  type="checkbox"
                  checked={showNoSalary}
                  onChange={(e) => setShowNoSalary(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span>Include unlisted salaries</span>
              </label>
            </div>
          </div>

          {/* Category filter */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {JOB_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                const count = categoryJobCounts[category];
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                    }`}
                  >
                    {isSelected && (
                      <svg className="h-3.5 w-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {category}
                    <span
                      className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                        isSelected ? "bg-primary-500 text-primary-100" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results count with separator */}
      <div className="mb-6 flex items-center gap-4">
        <p className="text-sm font-medium text-gray-600 whitespace-nowrap">
          {totalJobs > 0 ? (
            <>
              Showing <span className="text-gray-900 font-semibold">{startIndex + 1}-{endIndex}</span> of <span className="text-gray-900 font-semibold">{totalJobs}</span> jobs
            </>
          ) : (
            <>Showing <span className="text-gray-900 font-semibold">0</span> of <span className="text-gray-900 font-semibold">{mockJobs.length}</span> jobs</>
          )}
        </p>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      {/* Job listings grid */}
      {paginatedJobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedJobs.map((job, index) => (
              <div
                key={job.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-8 sm:mt-10 flex items-center justify-center"
              aria-label="Pagination"
            >
              <div className="inline-flex items-center gap-1 bg-white rounded-xl shadow-soft border border-gray-100 p-1.5">
                {/* Previous button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
                  <span className="ml-1 hidden sm:inline">Previous</span>
                </button>

                {/* Page numbers */}
                <div className="hidden sm:flex items-center gap-1">
                  {pageNumbers.map((pageNum, index) =>
                    pageNum === "ellipsis" ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 text-sm text-gray-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center justify-center min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          currentPage === pageNum
                            ? "bg-primary-600 text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                {/* Mobile page indicator */}
                <span className="sm:hidden px-4 py-2 text-sm font-medium text-gray-700">
                  {currentPage} / {totalPages}
                </span>

                {/* Next button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  aria-label="Next page"
                >
                  <span className="mr-1 hidden sm:inline">Next</span>
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
        <div className="text-center py-12 sm:py-16 bg-white rounded-2xl shadow-soft border border-gray-100">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
          <p className="mt-2 text-gray-500 max-w-sm mx-auto">
            We could not find any jobs matching your criteria. Try adjusting your filters or search terms.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition-colors shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset all filters
          </button>
        </div>
      )}

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setShowSaveModal(false)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
              {saveSuccess ? (
                <div className="text-center py-10 px-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
                    <svg
                      className="w-8 h-8 text-green-600"
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
                  <h3 className="text-xl font-bold text-gray-900">Alert Saved!</h3>
                  <p className="text-gray-600 mt-2">
                    You&apos;ll be notified when new jobs match your search.
                  </p>
                </div>
              ) : (
                <>
                  {/* Modal header */}
                  <div className="bg-gradient-to-r from-primary-50 to-white px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            Save this search
                          </h2>
                          <p className="text-sm text-gray-500">
                            Get notified when new jobs match
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSaveModal(false)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Modal body */}
                  <div className="p-6 space-y-5">
                    <div>
                      <label
                        htmlFor="alertName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Alert Name
                      </label>
                      <input
                        type="text"
                        id="alertName"
                        value={alertName}
                        onChange={(e) => setAlertName(e.target.value)}
                        placeholder="e.g., Worship Leader jobs in Austin"
                        className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-gray-900 placeholder-gray-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="alertFrequency"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Notification Frequency
                      </label>
                      <div className="relative">
                        <select
                          id="alertFrequency"
                          value={alertFrequency}
                          onChange={(e) =>
                            setAlertFrequency(e.target.value as JobAlert["frequency"])
                          }
                          className="block w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-gray-900 appearance-none cursor-pointer transition-colors"
                        >
                          <option value="immediate">Immediately</option>
                          <option value="daily">Daily digest</option>
                          <option value="weekly">Weekly digest</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Current filters summary */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Active filters
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {debouncedSearch && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary-700">
                            &quot;{debouncedSearch}&quot;
                          </span>
                        )}
                        {selectedLocation && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary-700">
                            {selectedLocation}
                          </span>
                        )}
                        {selectedCategories.map((cat) => (
                          <span
                            key={cat}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary-700"
                          >
                            {cat}
                          </span>
                        ))}
                        {selectedEmploymentTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary-700"
                          >
                            {type}
                          </span>
                        ))}
                        {selectedWorkArrangements.map((arr) => (
                          <span
                            key={arr}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary-700"
                          >
                            {arr}
                          </span>
                        ))}
                        {!debouncedSearch && !selectedLocation && selectedCategories.length === 0 && selectedEmploymentTypes.length === 0 && selectedWorkArrangements.length === 0 && (
                          <span className="text-sm text-gray-500">All jobs</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Modal footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAlert}
                      disabled={!alertName.trim()}
                      className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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
