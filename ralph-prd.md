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

- [ ] Add `types/application.ts` with Application interface (id, jobId, userId, status, coverLetter, resumeUrl, appliedAt)
- [ ] Create `lib/applications.ts` for managing applications in localStorage
- [ ] Update "Apply Now" button on job detail page to open application modal
- [ ] Create application modal with cover letter textarea
- [ ] Add file input for resume upload (store filename, mock upload)
- [ ] Submit application saves to localStorage
- [ ] Show success message after applying
- [ ] Disable Apply button if already applied
- [ ] `npm run build` succeeds without errors

### US-015: Create applications tracking page for job seekers

- [ ] Create `/applications` page showing user's submitted applications
- [ ] Display application cards with: job title, church name, status, applied date
- [ ] Application statuses: Submitted, Under Review, Interview Requested, Offer Extended, Hired, Not Selected, Withdrawn
- [ ] Add status badge with appropriate colors
- [ ] Add "Withdraw Application" button for pending applications
- [ ] Show empty state when no applications
- [ ] Add "My Applications" link to header navigation (when logged in)
- [ ] `npm run build` succeeds without errors

### US-016: Implement application messaging

- [ ] Add `types/message.ts` with Message interface (id, applicationId, senderId, content, createdAt, isRead)
- [ ] Create messages section on application detail page
- [ ] Display message thread with sender name and timestamp
- [ ] Add message input form at bottom of thread
- [ ] New messages saved to localStorage
- [ ] Show unread message indicator on applications list
- [ ] `npm run build` succeeds without errors

### US-017: Create church admin dashboard

- [ ] Create `/admin` route group for church admin pages
- [ ] Create `/admin/dashboard` page with overview stats
- [ ] Display: total jobs posted, active listings, total applications, recent applications
- [ ] Create mock data for church admin user with churchId
- [ ] Protect admin routes - redirect non-admins to home
- [ ] Add "Church Admin" link to header for admin users
- [ ] `npm run build` succeeds without errors

### US-018: Implement job posting form for church admins

- [ ] Create `/admin/jobs/new` page with job posting form
- [ ] Form fields: title, category (dropdown), employment type, work arrangement, location, salary min/max, description, qualifications, responsibilities
- [ ] Add rich text editor or textarea for description fields
- [ ] Form validation for required fields
- [ ] Preview button to see how job will look
- [ ] Submit saves job to mock data (localStorage)
- [ ] Redirect to job listings after successful post
- [ ] `npm run build` succeeds without errors

### US-019: Create church admin job listings management

- [ ] Create `/admin/jobs` page listing church's jobs
- [ ] Display job cards with: title, status, applications count, posted date
- [ ] Job statuses: Draft, Active, Closed, Filled
- [ ] Add "Edit" button linking to edit page
- [ ] Add "Close Position" / "Mark as Filled" actions
- [ ] Add "Create New Job" button
- [ ] Filter by status
- [ ] `npm run build` succeeds without errors

### US-020: Implement job editing for church admins

- [ ] Create `/admin/jobs/[id]/edit` page
- [ ] Pre-populate form with existing job data
- [ ] Allow editing all fields except id
- [ ] Save updates to localStorage
- [ ] Show success message on save
- [ ] Add "Delete Job" button with confirmation
- [ ] `npm run build` succeeds without errors

### US-021: Create applications review page for church admins

- [ ] Create `/admin/jobs/[id]/applications` page
- [ ] List all applications for the job
- [ ] Display: applicant name, applied date, status, rating
- [ ] Add status dropdown to update application status
- [ ] Add 1-5 star rating system
- [ ] Add private notes textarea for each application
- [ ] Click applicant to view full application details
- [ ] `npm run build` succeeds without errors

### US-022: Implement applicant detail view for church admins

- [ ] Create `/admin/applications/[id]` page
- [ ] Display applicant profile info
- [ ] Show cover letter and resume link
- [ ] Display status history with timestamps
- [ ] Add messaging section (same as job seeker view)
- [ ] Add quick actions: Update status, Add note, Send message
- [ ] `npm run build` succeeds without errors

### US-023: Create church profile management

- [ ] Create `/admin/church` page for church profile
- [ ] Display and edit: church name, denomination, size, location, description
- [ ] Add logo upload (mock, store URL)
- [ ] Add "About our team" section
- [ ] Add "What we offer" benefits section
- [ ] Preview how profile appears to job seekers
- [ ] Save changes to localStorage
- [ ] `npm run build` succeeds without errors

### US-024: Add job alerts for job seekers

- [ ] Add `types/alert.ts` with JobAlert interface (id, userId, name, criteria, frequency, isActive)
- [ ] Create "Save this search" button on jobs page when filters are active
- [ ] Create `/alerts` page listing saved job alerts
- [ ] Display alert name, criteria summary, frequency
- [ ] Add toggle to enable/disable alerts
- [ ] Add delete alert button
- [ ] Show empty state when no alerts
- [ ] `npm run build` succeeds without errors

### US-025: Implement share job functionality

- [ ] Add share button to job detail page
- [ ] Create share modal with options: Copy link, Email, LinkedIn, Facebook, Twitter
- [ ] Copy link button copies job URL to clipboard
- [ ] Show "Link copied!" confirmation
- [ ] Social share buttons open share dialogs with pre-filled content
- [ ] `npm run build` succeeds without errors

### US-026: Add report job functionality

- [ ] Add "Report this listing" link to job detail page
- [ ] Create report modal with reason dropdown and details textarea
- [ ] Reasons: Spam, Inappropriate content, Scam/fraud, Incorrect information, Other
- [ ] Submit saves report to localStorage
- [ ] Show confirmation message after reporting
- [ ] Prevent duplicate reports from same user
- [ ] `npm run build` succeeds without errors

### US-027: Implement similar jobs feature

- [ ] Add "Similar Jobs" section to job detail page
- [ ] Find jobs with same category or location
- [ ] Display 3-4 similar job cards
- [ ] Exclude current job from results
- [ ] Link to job detail pages
- [ ] `npm run build` succeeds without errors

### US-028: Add church profile page for job seekers

- [ ] Create `/churches/[id]` page showing church profile
- [ ] Display: name, logo, denomination, size, location, description
- [ ] Show "About our team" and benefits sections
- [ ] List all active jobs from this church
- [ ] Add link from job detail page to church profile
- [ ] `npm run build` succeeds without errors

### US-029: Implement responsive mobile navigation

- [ ] Add hamburger menu button for mobile screens
- [ ] Create mobile navigation drawer/menu
- [ ] Include all navigation links
- [ ] Show user info when logged in
- [ ] Close menu on link click or outside click
- [ ] Animate menu open/close
- [ ] `npm run build` succeeds without errors

### US-030: Add loading states and error handling

- [ ] Add loading skeleton for job cards
- [ ] Add loading state for job detail page
- [ ] Add error boundary component
- [ ] Show user-friendly error messages
- [ ] Add retry button on error states
- [ ] Handle network errors gracefully
- [ ] `npm run build` succeeds without errors

### US-031: Implement accessibility improvements

- [ ] Add proper ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works throughout
- [ ] Add skip to main content link
- [ ] Verify color contrast meets WCAG AA standards
- [ ] Add focus indicators to all focusable elements
- [ ] Test with screen reader and fix issues
- [ ] `npm run build` succeeds without errors

### US-032: Add analytics tracking setup

- [ ] Create `lib/analytics.ts` with tracking functions
- [ ] Track page views on route changes
- [ ] Track job card clicks
- [ ] Track apply button clicks
- [ ] Track search queries
- [ ] Track filter usage
- [ ] Log events to console (mock analytics)
- [ ] `npm run build` succeeds without errors

### US-033: Create admin analytics dashboard

- [ ] Create `/admin/analytics` page
- [ ] Display job listing performance: views, applications, conversion rate
- [ ] Show applications by status chart
- [ ] Display time-to-fill metrics
- [ ] Add date range filter
- [ ] Use mock data for charts
- [ ] `npm run build` succeeds without errors

### US-034: Implement job templates for church admins

- [ ] Add "Save as Template" button on job form
- [ ] Create `/admin/templates` page listing saved templates
- [ ] "Use Template" button pre-fills job form
- [ ] Edit and delete templates
- [ ] Store templates in localStorage
- [ ] `npm run build` succeeds without errors

### US-035: Add bulk actions for applications

- [ ] Add checkbox to select multiple applications on admin view
- [ ] Add "Select All" checkbox in header
- [ ] Add bulk action dropdown: Update status, Send message
- [ ] Apply action to all selected applications
- [ ] Show confirmation before bulk action
- [ ] `npm run build` succeeds without errors

### US-036: Implement email notification preferences

- [ ] Add notification preferences section to user profile
- [ ] Options: Email on application status change, Email on new message, Job alert emails
- [ ] Frequency options: Immediate, Daily digest, Weekly digest, Never
- [ ] Save preferences to localStorage
- [ ] Mock email sending with console.log
- [ ] `npm run build` succeeds without errors

### US-037: Create home page featured jobs section

- [ ] Add featured jobs section to home page
- [ ] Display 6 most recent jobs
- [ ] Use JobCard component
- [ ] Add "View All Jobs" button
- [ ] Style section with heading and description
- [ ] `npm run build` succeeds without errors

### US-038: Add category browse on home page

- [ ] Add job categories section to home page
- [ ] Display category cards with icons
- [ ] Show job count per category
- [ ] Click category navigates to jobs page with filter applied
- [ ] Style in responsive grid
- [ ] `npm run build` succeeds without errors

### US-039: Implement infinite scroll or pagination

- [ ] Add pagination or infinite scroll to jobs listing
- [ ] Show 12 jobs per page
- [ ] Display page numbers or "Load More" button
- [ ] Maintain filters when changing pages
- [ ] Update URL with page param
- [ ] `npm run build` succeeds without errors

### US-040: Add SEO metadata

- [ ] Add metadata to home page (title, description, og tags)
- [ ] Add dynamic metadata to job detail pages
- [ ] Add metadata to church profile pages
- [ ] Create sitemap.xml
- [ ] Create robots.txt
- [ ] `npm run build` succeeds without errors
