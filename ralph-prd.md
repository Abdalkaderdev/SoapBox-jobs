# PRD

Branch: `feature/mvp`

## Stories

### US-001: Set up project foundation with Next.js and basic structure

- [x] Initialize Next.js 14+ project with TypeScript and App Router
- [x] Configure Tailwind CSS with SoapBox-inspired color palette (primary: purple/indigo)
- [x] Create basic layout with header containing logo and navigation placeholders
- [x] Create a jobs listing page at `/jobs` with placeholder content
- [x] Set up basic folder structure: `app/`, `components/`, `lib/`, `types/`
- [x] Add `types/job.ts` with TypeScript interface for Job (id, title, description, category, employmentType, workArrangement, location, church, salary, postedAt)
- [x] `npm test` passes (or `npm run build` if no tests yet)

### US-002: Create mock job data and basic job listing display

- [x] Create `lib/mock-data.ts` with at least 10 sample job listings covering different categories (Pastoral, Worship, Youth, Administrative, Technical)
- [x] Create `components/JobCard.tsx` that displays: title, church name, location, employment type, work arrangement, and posted date
- [x] Style JobCard with Tailwind - card layout with subtle shadow, hover effect
- [x] Display all mock jobs on `/jobs` page in a responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- [x] `npm run build` succeeds without errors

### US-003: Implement keyword search functionality

- [x] Add search input field at top of `/jobs` page with search icon
- [x] Implement client-side filtering that searches job title, description, and church name
- [x] Search should be case-insensitive
- [x] Results update as user types (debounced, 300ms delay)
- [x] Display "No jobs found" message when search has no results
- [x] Display result count (e.g., "Showing 5 of 10 jobs")
- [x] `npm run build` succeeds without errors

### US-004: Implement location filter

- [x] Add location filter dropdown/select below search bar
- [x] Extract unique locations from mock data for filter options
- [x] Include "All Locations" option that shows all jobs
- [x] Include "Remote" as a filterable option
- [x] Location filter works in combination with keyword search
- [x] URL updates with filter params (e.g., `/jobs?location=Austin%2C%20TX`)
- [x] Filters persist on page refresh via URL params
- [x] `npm run build` succeeds without errors

### US-005: Implement category filter

- [x] Add category filter (multi-select checkboxes or pills)
- [x] Categories: Pastoral, Worship & Music, Youth & Children, Administrative, Technical & Media, Facilities, Outreach, Counseling, Education, Executive
- [x] Multiple categories can be selected simultaneously
- [x] Category filter works in combination with search and location filters
- [x] Show job count per category in filter UI
- [x] URL updates with category params
- [x] Clear filters button to reset all filters
- [x] `npm run build` succeeds without errors

### US-006: Create job detail page

- [x] Create dynamic route `/jobs/[id]` for job detail page
- [x] Display full job information: title, church name with logo placeholder, location, salary range, employment type, work arrangement
- [x] Display full job description with proper formatting
- [x] Display qualifications/requirements section
- [x] Add "Apply Now" button (placeholder, no functionality yet)
- [x] Add "Back to Jobs" link
- [x] Responsive layout - sidebar with church info on desktop, stacked on mobile
- [x] Handle 404 for non-existent job IDs
- [x] `npm run build` succeeds without errors
