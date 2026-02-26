# PRD

Branch: `feature/mvp`

## Stories

### US-001: Set up project foundation with Next.js and basic structure

- [ ] Initialize Next.js 14+ project with TypeScript and App Router
- [ ] Configure Tailwind CSS with SoapBox-inspired color palette (primary: purple/indigo)
- [ ] Create basic layout with header containing logo and navigation placeholders
- [ ] Create a jobs listing page at `/jobs` with placeholder content
- [ ] Set up basic folder structure: `app/`, `components/`, `lib/`, `types/`
- [ ] Add `types/job.ts` with TypeScript interface for Job (id, title, description, category, employmentType, workArrangement, location, church, salary, postedAt)
- [ ] `npm test` passes (or `npm run build` if no tests yet)

### US-002: Create mock job data and basic job listing display

- [ ] Create `lib/mock-data.ts` with at least 10 sample job listings covering different categories (Pastoral, Worship, Youth, Administrative, Technical)
- [ ] Create `components/JobCard.tsx` that displays: title, church name, location, employment type, work arrangement, and posted date
- [ ] Style JobCard with Tailwind - card layout with subtle shadow, hover effect
- [ ] Display all mock jobs on `/jobs` page in a responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- [ ] `npm run build` succeeds without errors

### US-003: Implement keyword search functionality

- [ ] Add search input field at top of `/jobs` page with search icon
- [ ] Implement client-side filtering that searches job title, description, and church name
- [ ] Search should be case-insensitive
- [ ] Results update as user types (debounced, 300ms delay)
- [ ] Display "No jobs found" message when search has no results
- [ ] Display result count (e.g., "Showing 5 of 10 jobs")
- [ ] `npm run build` succeeds without errors

### US-004: Implement location filter

- [ ] Add location filter dropdown/select below search bar
- [ ] Extract unique locations from mock data for filter options
- [ ] Include "All Locations" option that shows all jobs
- [ ] Include "Remote" as a filterable option
- [ ] Location filter works in combination with keyword search
- [ ] URL updates with filter params (e.g., `/jobs?location=Austin%2C%20TX`)
- [ ] Filters persist on page refresh via URL params
- [ ] `npm run build` succeeds without errors

### US-005: Implement category filter

- [ ] Add category filter (multi-select checkboxes or pills)
- [ ] Categories: Pastoral, Worship & Music, Youth & Children, Administrative, Technical & Media, Facilities, Outreach, Counseling, Education, Executive
- [ ] Multiple categories can be selected simultaneously
- [ ] Category filter works in combination with search and location filters
- [ ] Show job count per category in filter UI
- [ ] URL updates with category params
- [ ] Clear filters button to reset all filters
- [ ] `npm run build` succeeds without errors

### US-006: Create job detail page

- [ ] Create dynamic route `/jobs/[id]` for job detail page
- [ ] Display full job information: title, church name with logo placeholder, location, salary range, employment type, work arrangement
- [ ] Display full job description with proper formatting
- [ ] Display qualifications/requirements section
- [ ] Add "Apply Now" button (placeholder, no functionality yet)
- [ ] Add "Back to Jobs" link
- [ ] Responsive layout - sidebar with church info on desktop, stacked on mobile
- [ ] Handle 404 for non-existent job IDs
- [ ] `npm run build` succeeds without errors
