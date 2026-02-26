/**
 * Analytics tracking module for SoapBox Jobs
 * Mock implementation that logs to console in development
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log analytics events to console in development mode
 */
function log(message: string): void {
  if (isDevelopment || typeof window !== 'undefined') {
    console.log(`[Analytics] ${message}`);
  }
}

/**
 * Track a page view
 * @param page - The page path (e.g., "/jobs", "/jobs/job-1")
 */
export function trackPageView(page: string): void {
  log(`Page View: ${page}`);
}

/**
 * Track a generic event
 * @param category - Event category (e.g., "Navigation", "User")
 * @param action - Event action (e.g., "Click", "Submit")
 * @param label - Optional event label for additional context
 * @param value - Optional numeric value associated with the event
 */
export function trackEvent(category: string, action: string, label?: string, value?: number): void {
  let message = `Event: ${category} - ${action}`;
  if (label) {
    message += ` - ${label}`;
  }
  if (value !== undefined) {
    message += ` (${value})`;
  }
  log(message);
}

/**
 * Track when a user views a job listing
 * @param jobId - The unique identifier of the job
 * @param jobTitle - The title of the job
 */
export function trackJobView(jobId: string, jobTitle: string): void {
  log(`Job View: ${jobTitle} (${jobId})`);
}

/**
 * Track when a user clicks on a job card to view details
 * @param jobId - The unique identifier of the job
 * @param jobTitle - The title of the job
 */
export function trackJobClick(jobId: string, jobTitle: string): void {
  log(`Job Click: ${jobTitle} (${jobId})`);
}

/**
 * Track when a user clicks the apply button
 * @param jobId - The unique identifier of the job
 * @param jobTitle - The title of the job
 */
export function trackApplyClick(jobId: string, jobTitle: string): void {
  log(`Apply Click: ${jobTitle} (${jobId})`);
}

/**
 * Track search queries
 * @param query - The search query string
 * @param resultsCount - The number of results returned
 */
export function trackSearch(query: string, resultsCount: number): void {
  log(`Search: "${query}" - ${resultsCount} results`);
}

/**
 * Track filter usage
 * @param filterType - The type of filter used (e.g., "location", "category", "employmentType")
 * @param filterValue - The value selected for the filter
 */
export function trackFilterUse(filterType: string, filterValue: string): void {
  log(`Filter: ${filterType} = ${filterValue}`);
}
