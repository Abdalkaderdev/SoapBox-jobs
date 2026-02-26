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
- [x] `npm run build` succeeds without errors

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

### US-007: Implement save/bookmark jobs functionality

- [x] Add `types/user.ts` with User interface (id, email, name, savedJobs: string[])
- [x] Create `lib/storage.ts` with localStorage helpers for persisting saved jobs
- [x] Add heart/bookmark icon button to JobCard component
- [x] Implement toggle save/unsave functionality on click
- [x] Show filled heart icon when job is saved, outline when not
- [x] Add save button to job detail page sidebar
- [x] Create `/jobs/saved` page that lists all saved jobs
- [x] Add "Saved Jobs" link to header navigation
- [x] Show empty state on saved jobs page when no jobs saved
- [x] `npm run build` succeeds without errors

### US-008: Add employment type filter

- [x] Add employment type filter (checkboxes or pills) to jobs page
- [x] Options: Full-time, Part-time, Contract, Volunteer, Internship
- [x] Multiple employment types can be selected
- [x] Filter works in combination with existing filters
- [x] URL updates with employment type params
- [x] `npm run build` succeeds without errors

### US-009: Add work arrangement filter

- [x] Add work arrangement filter to jobs page
- [x] Options: On-site, Remote, Hybrid, Flexible
- [x] Multiple arrangements can be selected
- [x] Filter works in combination with existing filters
- [x] URL updates with work arrangement params
- [x] `npm run build` succeeds without errors

### US-010: Add salary range filter

- [x] Add salary range filter with min/max inputs
- [x] Include "Show jobs without salary" checkbox
- [x] Filter jobs by annual salary (convert hourly to annual for comparison)
- [x] Filter works in combination with existing filters
- [x] URL updates with salary params
- [x] `npm run build` succeeds without errors

### US-011: Add sort functionality

- [x] Add sort dropdown to jobs page
- [x] Sort options: Newest first, Oldest first, Salary (high to low), Salary (low to high)
- [x] Default sort is Newest first
- [x] Sort persists in URL params
- [x] `npm run build` succeeds without errors

### US-012: Set up authentication context and mock auth

- [x] Install and configure next-auth or create custom auth context
- [x] Create `contexts/AuthContext.tsx` with user state and login/logout functions
- [x] Create mock users in `lib/mock-users.ts` (job seekers and church admins)
- [x] Create `/auth/signin` page with email/password form
- [x] Create `/auth/signup` page with registration form
- [x] Update header to show user name when logged in
- [x] Add Sign Out button to header when logged in
- [x] Store auth state in localStorage for persistence
- [x] `npm run build` succeeds without errors

### US-013: Create user profile page

- [x] Create `/profile` page (protected route, redirect to signin if not logged in)
- [x] Display user info: name, email, profile photo placeholder
- [x] Add "Ministry Statement" textarea field (max 2000 chars)
- [x] Add form to update profile information
- [x] Save profile changes to localStorage
- [x] Show success message on save
- [x] `npm run build` succeeds without errors

### US-014: Implement job application flow

- [x] Add `types/application.ts` with Application interface (id, jobId, userId, status, coverLetter, resumeUrl, appliedAt)
- [x] Create `lib/applications.ts` for managing applications in localStorage
- [x] Update "Apply Now" button on job detail page to open application modal
- [x] Create application modal with cover letter textarea
- [x] Add file input for resume upload (store filename, mock upload)
- [x] Submit application saves to localStorage
- [x] Show success message after applying
- [x] Disable Apply button if already applied
- [x] `npm run build` succeeds without errors

### US-015: Create applications tracking page for job seekers

- [x] Create `/applications` page showing user's submitted applications
- [x] Display application cards with: job title, church name, status, applied date
- [x] Application statuses: Submitted, Under Review, Interview Requested, Offer Extended, Hired, Not Selected, Withdrawn
- [x] Add status badge with appropriate colors
- [x] Add "Withdraw Application" button for pending applications
- [x] Show empty state when no applications
- [x] Add "My Applications" link to header navigation (when logged in)
- [x] `npm run build` succeeds without errors

### US-016: Implement application messaging

- [x] Add `types/message.ts` with Message interface (id, applicationId, senderId, content, createdAt, isRead)
- [x] Create messages section on application detail page
- [x] Display message thread with sender name and timestamp
- [x] Add message input form at bottom of thread
- [x] New messages saved to localStorage
- [x] Show unread message indicator on applications list
- [x] `npm run build` succeeds without errors

### US-017: Create church admin dashboard

- [x] Create `/admin` route group for church admin pages
- [x] Create `/admin/dashboard` page with overview stats
- [x] Display: total jobs posted, active listings, total applications, recent applications
- [x] Create mock data for church admin user with churchId
- [x] Protect admin routes - redirect non-admins to home
- [x] Add "Church Admin" link to header for admin users
- [x] `npm run build` succeeds without errors

### US-018: Implement job posting form for church admins

- [x] Create `/admin/jobs/new` page with job posting form
- [x] Form fields: title, category (dropdown), employment type, work arrangement, location, salary min/max, description, qualifications, responsibilities
- [x] Add rich text editor or textarea for description fields
- [x] Form validation for required fields
- [x] Preview button to see how job will look
- [x] Submit saves job to mock data (localStorage)
- [x] Redirect to job listings after successful post
- [x] `npm run build` succeeds without errors

### US-019: Create church admin job listings management

- [x] Create `/admin/jobs` page listing church's jobs
- [x] Display job cards with: title, status, applications count, posted date
- [x] Job statuses: Draft, Active, Closed, Filled
- [x] Add "Edit" button linking to edit page
- [x] Add "Close Position" / "Mark as Filled" actions
- [x] Add "Create New Job" button
- [x] Filter by status
- [x] `npm run build` succeeds without errors

### US-020: Implement job editing for church admins

- [x] Create `/admin/jobs/[id]/edit` page
- [x] Pre-populate form with existing job data
- [x] Allow editing all fields except id
- [x] Save updates to localStorage
- [x] Show success message on save
- [x] Add "Delete Job" button with confirmation
- [x] `npm run build` succeeds without errors

### US-021: Create applications review page for church admins

- [x] Create `/admin/jobs/[id]/applications` page
- [x] List all applications for the job
- [x] Display: applicant name, applied date, status, rating
- [x] Add status dropdown to update application status
- [x] Add 1-5 star rating system
- [x] Add private notes textarea for each application
- [x] Click applicant to view full application details
- [x] `npm run build` succeeds without errors

### US-022: Implement applicant detail view for church admins

- [x] Create `/admin/applications/[id]` page
- [x] Display applicant profile info
- [x] Show cover letter and resume link
- [x] Display status history with timestamps
- [x] Add messaging section (same as job seeker view)
- [x] Add quick actions: Update status, Add note, Send message
- [x] `npm run build` succeeds without errors

### US-023: Create church profile management

- [x] Create `/admin/church` page for church profile
- [x] Display and edit: church name, denomination, size, location, description
- [x] Add logo upload (mock, store URL)
- [x] Add "About our team" section
- [x] Add "What we offer" benefits section
- [x] Preview how profile appears to job seekers
- [x] Save changes to localStorage
- [x] `npm run build` succeeds without errors

### US-024: Add job alerts for job seekers

- [x] Add `types/alert.ts` with JobAlert interface (id, userId, name, criteria, frequency, isActive)
- [x] Create "Save this search" button on jobs page when filters are active
- [x] Create `/alerts` page listing saved job alerts
- [x] Display alert name, criteria summary, frequency
- [x] Add toggle to enable/disable alerts
- [x] Add delete alert button
- [x] Show empty state when no alerts
- [x] `npm run build` succeeds without errors

### US-025: Implement share job functionality

- [x] Add share button to job detail page
- [x] Create share modal with options: Copy link, Email, LinkedIn, Facebook, Twitter
- [x] Copy link button copies job URL to clipboard
- [x] Show "Link copied!" confirmation
- [x] Social share buttons open share dialogs with pre-filled content
- [x] `npm run build` succeeds without errors

### US-026: Add report job functionality

- [x] Add "Report this listing" link to job detail page
- [x] Create report modal with reason dropdown and details textarea
- [x] Reasons: Spam, Inappropriate content, Scam/fraud, Incorrect information, Other
- [x] Submit saves report to localStorage
- [x] Show confirmation message after reporting
- [x] Prevent duplicate reports from same user
- [x] `npm run build` succeeds without errors

### US-027: Implement similar jobs feature

- [x] Add "Similar Jobs" section to job detail page
- [x] Find jobs with same category or location
- [x] Display 3-4 similar job cards
- [x] Exclude current job from results
- [x] Link to job detail pages
- [x] `npm run build` succeeds without errors

### US-028: Add church profile page for job seekers

- [x] Create `/churches/[id]` page showing church profile
- [x] Display: name, logo, denomination, size, location, description
- [x] Show "About our team" and benefits sections
- [x] List all active jobs from this church
- [x] Add link from job detail page to church profile
- [x] `npm run build` succeeds without errors

### US-029: Implement responsive mobile navigation

- [x] Add hamburger menu button for mobile screens
- [x] Create mobile navigation drawer/menu
- [x] Include all navigation links
- [x] Show user info when logged in
- [x] Close menu on link click or outside click
- [x] Animate menu open/close
- [x] `npm run build` succeeds without errors

### US-030: Add loading states and error handling

- [x] Add loading skeleton for job cards
- [x] Add loading state for job detail page
- [x] Add error boundary component
- [x] Show user-friendly error messages
- [x] Add retry button on error states
- [x] Handle network errors gracefully
- [x] `npm run build` succeeds without errors

### US-031: Implement accessibility improvements

- [x] Add proper ARIA labels to all interactive elements
- [x] Ensure keyboard navigation works throughout
- [x] Add skip to main content link
- [x] Verify color contrast meets WCAG AA standards
- [x] Add focus indicators to all focusable elements
- [x] Test with screen reader and fix issues
- [x] `npm run build` succeeds without errors

### US-032: Add analytics tracking setup

- [x] Create `lib/analytics.ts` with tracking functions
- [x] Track page views on route changes
- [x] Track job card clicks
- [x] Track apply button clicks
- [x] Track search queries
- [x] Track filter usage
- [x] Log events to console (mock analytics)
- [x] `npm run build` succeeds without errors

### US-033: Create admin analytics dashboard

- [x] Create `/admin/analytics` page
- [x] Display job listing performance: views, applications, conversion rate
- [x] Show applications by status chart
- [x] Display time-to-fill metrics
- [x] Add date range filter
- [x] Use mock data for charts
- [x] `npm run build` succeeds without errors

### US-034: Implement job templates for church admins

- [x] Add "Save as Template" button on job form
- [x] Create `/admin/templates` page listing saved templates
- [x] "Use Template" button pre-fills job form
- [x] Edit and delete templates
- [x] Store templates in localStorage
- [x] `npm run build` succeeds without errors

### US-035: Add bulk actions for applications

- [x] Add checkbox to select multiple applications on admin view
- [x] Add "Select All" checkbox in header
- [x] Add bulk action dropdown: Update status, Send message
- [x] Apply action to all selected applications
- [x] Show confirmation before bulk action
- [x] `npm run build` succeeds without errors

### US-036: Implement email notification preferences

- [x] Add notification preferences section to user profile
- [x] Options: Email on application status change, Email on new message, Job alert emails
- [x] Frequency options: Immediate, Daily digest, Weekly digest, Never
- [x] Save preferences to localStorage
- [x] Mock email sending with console.log
- [x] `npm run build` succeeds without errors

### US-037: Create home page featured jobs section

- [x] Add featured jobs section to home page
- [x] Display 6 most recent jobs
- [x] Use JobCard component
- [x] Add "View All Jobs" button
- [x] Style section with heading and description
- [x] `npm run build` succeeds without errors

### US-038: Add category browse on home page

- [x] Add job categories section to home page
- [x] Display category cards with icons
- [x] Show job count per category
- [x] Click category navigates to jobs page with filter applied
- [x] Style in responsive grid
- [x] `npm run build` succeeds without errors

### US-039: Implement infinite scroll or pagination

- [x] Add pagination or infinite scroll to jobs listing
- [x] Show 12 jobs per page
- [x] Display page numbers or "Load More" button
- [x] Maintain filters when changing pages
- [x] Update URL with page param
- [x] `npm run build` succeeds without errors

### US-040: Add SEO metadata

- [x] Add metadata to home page (title, description, og tags)
- [x] Add dynamic metadata to job detail pages
- [x] Add metadata to church profile pages
- [x] Create sitemap.xml
- [x] Create robots.txt
- [x] `npm run build` succeeds without errors
