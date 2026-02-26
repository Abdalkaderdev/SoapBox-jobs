# SoapBox Jobs - Product Requirements Document (PRD)

**Version:** 1.0
**Last Updated:** February 26, 2026
**Status:** Draft
**Product Owner:** [TBD]
**Document Author:** [TBD]

---

## Table of Contents

1. [Overview & Vision](#1-overview--vision)
2. [Target Users](#2-target-users)
3. [Core Features](#3-core-features)
4. [User Stories](#4-user-stories)
5. [Technical Requirements](#5-technical-requirements)
6. [Database Schema](#6-database-schema)
7. [API Endpoints](#7-api-endpoints)
8. [UI/UX Considerations](#8-uiux-considerations)
9. [Success Metrics](#9-success-metrics)
10. [Future Enhancements](#10-future-enhancements)
11. [Timeline & Phases](#11-timeline--phases)

---

## 1. Overview & Vision

### 1.1 Executive Summary

SoapBox Jobs is a dedicated job platform designed to serve the faith-based employment market, operating as a subdomain (jobs.soapbox.com) within the SoapBox Super App ecosystem. The platform connects churches and faith-based organizations with job seekers looking for meaningful ministry and church-related employment opportunities.

### 1.2 Vision Statement

To become the premier destination for faith-based employment, seamlessly connecting passionate individuals with churches and ministries that need their talents, while leveraging the trust and community already established within the SoapBox ecosystem.

### 1.3 Problem Statement

Churches and faith-based organizations face unique challenges when hiring:

- **For Churches:** Difficulty finding candidates who align with their mission, values, and doctrinal positions. General job boards don't cater to ministry-specific roles or understand the nuances of church hiring.

- **For Job Seekers:** Limited visibility into church employment opportunities, fragmented job postings across multiple platforms, and difficulty showcasing faith-relevant experience and calling.

### 1.4 Solution

SoapBox Jobs provides a unified, purpose-built platform that:

- Integrates with existing SoapBox user accounts and church profiles
- Offers ministry-specific job categories and filters
- Enables churches to post both paid positions and volunteer opportunities
- Allows job seekers to leverage their SoapBox profile as a professional resume
- Facilitates communication between churches and candidates within a trusted ecosystem

### 1.5 Strategic Alignment

SoapBox Jobs extends the SoapBox Super App's mission of fostering spiritual engagement and community by:

- Creating economic opportunities within faith communities
- Strengthening church operations by connecting them with qualified staff
- Deepening user engagement with the SoapBox ecosystem
- Providing an additional value proposition for church administrators

---

## 2. Target Users

### 2.1 Primary User Personas

#### 2.1.1 Job Seekers (Super App Users)

**Persona: Ministry-Minded Professional**
- **Demographics:** Ages 22-55, college-educated, active church member
- **Goals:** Find meaningful employment that aligns with their calling
- **Pain Points:** Limited visibility into church job opportunities, difficulty conveying spiritual qualifications
- **Behaviors:** Active on SoapBox Super App, engaged in church community, willing to relocate for the right opportunity

**Persona: Volunteer Seeking Deeper Involvement**
- **Demographics:** Ages 18-70, varied education levels, committed church attendee
- **Goals:** Contribute skills to ministry in a structured capacity
- **Pain Points:** Unaware of volunteer needs, unsure how to offer skills
- **Behaviors:** Already volunteering occasionally, looking for more consistent roles

**Persona: Career Transitioner**
- **Demographics:** Ages 30-50, experienced professional, feeling called to ministry
- **Goals:** Transition from secular career to church/ministry role
- **Pain Points:** Uncertain how to position secular experience for ministry, lacks seminary credentials
- **Behaviors:** Exploring options, networking within church community

#### 2.1.2 Employers (Church Administrators)

**Persona: Senior Pastor/Lead Minister**
- **Demographics:** Ages 35-65, seminary-educated, 10+ years ministry experience
- **Goals:** Build a strong ministry team, find candidates aligned with church vision
- **Pain Points:** Time-consuming hiring process, difficulty reaching qualified candidates
- **Behaviors:** Final decision-maker, delegates screening to staff

**Persona: Church Administrator/Executive Pastor**
- **Demographics:** Ages 30-55, business or ministry background
- **Goals:** Efficiently manage hiring process, maintain compliance, find cost-effective solutions
- **Pain Points:** Limited budget, competing priorities, administrative burden
- **Behaviors:** Manages day-to-day operations, often handles initial candidate screening

**Persona: Ministry Director**
- **Demographics:** Ages 25-45, specialized in specific ministry area
- **Goals:** Find team members passionate about their ministry focus
- **Pain Points:** Limited hiring authority, difficulty articulating specialized needs
- **Behaviors:** Identifies staffing needs, participates in interviews

### 2.2 Secondary Users

- **Denominational Leaders:** May post positions for multiple churches or denominational roles
- **Christian Non-Profits:** Organizations adjacent to church ministry
- **Christian Schools:** Educational institutions seeking staff
- **Camp/Conference Centers:** Seasonal and year-round positions

---

## 3. Core Features

### 3.1 Job Listings

#### 3.1.1 Listing Types

| Type | Description | Use Cases |
|------|-------------|-----------|
| **Paid - Full-Time** | 35+ hours/week, benefits eligible | Senior Pastor, Worship Director |
| **Paid - Part-Time** | Under 35 hours/week | Youth Intern, Bookkeeper |
| **Paid - Contract** | Fixed-term engagement | Interim Pastor, Project-based |
| **Volunteer** | Unpaid service opportunities | Greeter Coordinator, Small Group Leader |
| **Internship** | Educational/training focused | Seminary Intern, Summer Ministry Intern |

#### 3.1.2 Work Arrangements

- **On-site:** Physical presence required
- **Remote:** Fully remote position
- **Hybrid:** Combination of on-site and remote
- **Flexible:** Schedule/location flexibility offered

#### 3.1.3 Job Categories

| Category | Example Roles |
|----------|---------------|
| **Pastoral** | Senior Pastor, Associate Pastor, Campus Pastor, Teaching Pastor |
| **Worship & Music** | Worship Leader, Music Director, Choir Director, Audio Engineer |
| **Youth & Children's Ministry** | Youth Pastor, Children's Director, Family Ministry Coordinator |
| **Administrative** | Executive Assistant, Office Manager, Receptionist, Bookkeeper |
| **Technical & Media** | A/V Technician, Graphics Designer, Social Media Manager, IT Director |
| **Facilities & Maintenance** | Custodian, Grounds Keeper, Facilities Manager, Security |
| **Outreach & Missions** | Missions Pastor, Community Outreach Director, Evangelism Coordinator |
| **Counseling & Care** | Pastoral Counselor, Care Pastor, Visitation Minister |
| **Education** | Christian Education Director, Small Groups Pastor, Discipleship Director |
| **Executive Leadership** | Executive Pastor, Chief Operations Officer, Chief Financial Officer |

#### 3.1.4 Listing Content Requirements

**Required Fields:**
- Job title
- Category (from predefined list)
- Employment type (Full-time, Part-time, etc.)
- Work arrangement (On-site, Remote, Hybrid)
- Location (city, state, or "Remote")
- Job description
- Qualifications/requirements
- How to apply
- Application deadline (optional)
- Salary range or "Commensurate with experience"

**Optional Fields:**
- Benefits summary
- Church/organization description
- Video introduction
- Document attachments (job description PDF, etc.)
- Doctrinal requirements
- Preferred denominations
- Experience requirements
- Education requirements

### 3.2 Job Seeker Features

#### 3.2.1 Browse & Search

- **Search Bar:** Keyword search across titles, descriptions, and organizations
- **Filters:**
  - Category
  - Employment type
  - Work arrangement
  - Location (radius search)
  - Salary range
  - Date posted
  - Church size
  - Denomination
- **Sort Options:**
  - Relevance
  - Date posted (newest first)
  - Distance
  - Alphabetical (organization name)

#### 3.2.2 Job Interaction

- **View Job Details:** Full job posting with church information
- **Save/Bookmark:** Save jobs for later review
- **Share:** Share job links via social media or direct link
- **Report:** Flag inappropriate or suspicious listings

#### 3.2.3 Application Management

- **Apply with SoapBox Profile:** One-click application using Super App profile data
- **Custom Application:** Upload resume, cover letter, and additional documents
- **Application Tracking:** View status of all submitted applications
  - Submitted
  - Under Review
  - Interview Requested
  - Offer Extended
  - Hired
  - Not Selected
  - Withdrawn

#### 3.2.4 Job Alerts & Notifications

- **Email Alerts:** Customizable alerts based on saved searches
- **Push Notifications:** In-app notifications for:
  - New jobs matching criteria
  - Application status changes
  - Messages from employers
- **Frequency Options:** Immediate, daily digest, weekly digest

#### 3.2.5 Profile Management

- **Import from Super App:** Pull profile data, spiritual gifts, ministry experience
- **Resume Builder:** Create ministry-focused resume
- **Skills & Qualifications:** Tag relevant skills and certifications
- **Ministry Statement:** Personal statement of faith and calling
- **References:** Add professional and pastoral references
- **Visibility Settings:** Control what employers can see

### 3.3 Church Admin/Employer Features

#### 3.3.1 Job Posting

- **Create Listing:** Step-by-step job posting wizard
- **Templates:** Save and reuse job posting templates
- **Preview:** Preview listing before publishing
- **Schedule:** Set publish and expiration dates
- **Duplicate:** Copy existing listings for similar positions

#### 3.3.2 Application Management

- **Application Dashboard:** View all applications organized by job
- **Candidate Profiles:** View applicant information and application materials
- **Status Management:** Update application status with optional notifications
- **Notes:** Add private notes to candidate profiles
- **Rating System:** Internal rating/scoring for candidate comparison
- **Bulk Actions:** Move multiple candidates to next stage

#### 3.3.3 Communication

- **In-Platform Messaging:** Secure messaging with applicants
- **Email Templates:** Pre-written responses for common communications
- **Interview Scheduling:** (Future enhancement) Calendar integration
- **Message History:** Complete communication history per candidate

#### 3.3.4 Organization Profile

- **Church Profile:** Linked from SoapBox Super App
- **Enhanced Employer Profile:** Additional employer-specific information
  - About our team
  - What we offer (benefits, culture)
  - Photos/videos
  - Testimonials from staff

#### 3.3.5 Analytics & Reporting

- **Listing Performance:** Views, applications, conversion rates
- **Source Tracking:** Where applicants found the listing
- **Time-to-Fill:** Average time to fill positions
- **Diversity Metrics:** (Optional, anonymized) Application demographics

### 3.4 SoapBox Ecosystem Integration

#### 3.4.1 Single Sign-On (SSO)

- Users authenticate with existing SoapBox Super App credentials
- Seamless transition between Super App and Jobs platform
- Shared authentication tokens
- Role-based access (job seeker, church admin, platform admin)

#### 3.4.2 Profile Integration

**For Job Seekers:**
- Pull user profile data (name, contact, photo)
- Import spiritual gifts assessment results
- Import ministry experience and involvement history
- Import small group participation
- Import volunteer history

**For Churches:**
- Pull church profile from Super App
- Display church size, denomination, location
- Show church branding (logo, colors)
- Link to church's Super App presence

#### 3.4.3 Notification Integration

- Push notifications appear in Super App notification center
- Email notifications use SoapBox email infrastructure
- In-app badges for unread messages/alerts
- Deep links from notifications to specific content

#### 3.4.4 Data Sharing

- User data shared with explicit consent
- Churches see only what users make visible
- Privacy controls accessible in Super App settings
- Data deletion requests cascade across platforms

---

## 4. User Stories

### 4.1 Job Seeker User Stories

#### Epic: Job Discovery

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| JS-001 | As a job seeker, I want to search for jobs by keyword so that I can find relevant opportunities | Search returns results matching title, description, or organization name; Results update in real-time; Search history is saved |
| JS-002 | As a job seeker, I want to filter jobs by location so that I can find opportunities near me or in my desired area | Location filter accepts city, state, or zip code; Radius filter (10, 25, 50, 100+ miles); "Remote" filter option |
| JS-003 | As a job seeker, I want to filter jobs by category so that I can focus on my area of ministry calling | All categories from Section 3.1.3 available; Multi-select capability; Clear filter option |
| JS-004 | As a job seeker, I want to save jobs to review later so that I can compare opportunities | Save button on job cards and detail pages; Saved jobs accessible from profile; Unsave functionality |
| JS-005 | As a job seeker, I want to receive alerts for new jobs matching my criteria so that I don't miss opportunities | Create alert from saved search; Choose frequency (immediate, daily, weekly); Manage alerts in settings |

#### Epic: Application Process

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| JS-006 | As a job seeker, I want to apply using my SoapBox profile so that I can apply quickly | One-click apply option; Profile data pre-populated; Option to customize before submitting |
| JS-007 | As a job seeker, I want to upload additional documents so that I can provide a complete application | Support PDF, DOC, DOCX formats; Maximum file size 10MB; Multiple file upload |
| JS-008 | As a job seeker, I want to track my application status so that I know where I stand | Application status visible in dashboard; Status history with dates; Notification on status change |
| JS-009 | As a job seeker, I want to withdraw my application so that I can remove myself from consideration | Withdraw button in application details; Confirmation prompt; Optional withdrawal reason |
| JS-010 | As a job seeker, I want to message the employer so that I can ask questions about the position | Message thread within application; Notification on new messages; Message history preserved |

#### Epic: Profile Management

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| JS-011 | As a job seeker, I want to import my Super App profile so that I don't have to re-enter information | One-click import; Preview imported data; Select which fields to import |
| JS-012 | As a job seeker, I want to add a personal ministry statement so that employers understand my calling | Free-text field with 2000 character limit; Rich text formatting; Preview option |
| JS-013 | As a job seeker, I want to control profile visibility so that I can manage my privacy | Toggle visibility for each profile section; Public/private profile option; Control visibility to specific churches |

### 4.2 Church Admin User Stories

#### Epic: Job Posting

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| CA-001 | As a church admin, I want to create a job posting so that I can advertise open positions | Step-by-step posting wizard; Required field validation; Preview before publish |
| CA-002 | As a church admin, I want to save posting templates so that I can reuse common job descriptions | Save as template option; Template management page; Edit/delete templates |
| CA-003 | As a church admin, I want to schedule job postings so that I can prepare listings in advance | Set publish date/time; Set expiration date; Auto-expire listings |
| CA-004 | As a church admin, I want to edit active listings so that I can update information | Edit all fields except title (create new for title change); Change log maintained; Option to notify applicants of changes |
| CA-005 | As a church admin, I want to close a position as filled so that I stop receiving applications | Mark as filled button; Auto-notification to pending applicants (optional); Archive listing |

#### Epic: Candidate Management

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| CA-006 | As a church admin, I want to view all applications for a position so that I can review candidates | Applications dashboard grouped by job; Sort by date, rating, status; Pagination/infinite scroll |
| CA-007 | As a church admin, I want to update application status so that candidates know their standing | Status dropdown with defined options; Optional notification to candidate; Bulk status update |
| CA-008 | As a church admin, I want to rate candidates so that I can compare them objectively | 1-5 star rating; Optional rating criteria; Sort/filter by rating |
| CA-009 | As a church admin, I want to add notes to candidates so that I can track my impressions | Private notes field; Notes not visible to candidate; Note history with timestamps |
| CA-010 | As a church admin, I want to message candidates so that I can communicate throughout the process | In-platform messaging; Message templates; Notification on new messages |

#### Epic: Organization Profile

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| CA-011 | As a church admin, I want to customize our employer profile so that we attract the right candidates | Edit organization description; Upload photos/videos; Highlight benefits/culture |
| CA-012 | As a church admin, I want to link to our Super App profile so that candidates can learn more about us | Automatic linking based on SSO; Display Super App activity (optional); Link to church's Super App page |

### 4.3 Platform Admin User Stories

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| PA-001 | As a platform admin, I want to moderate job listings so that inappropriate content is removed | Review flagged listings; Approve/reject pending listings (if moderation enabled); Edit or remove listings |
| PA-002 | As a platform admin, I want to manage user accounts so that I can handle support requests | Search users; View account details; Reset passwords; Suspend/reactivate accounts |
| PA-003 | As a platform admin, I want to view platform analytics so that I can understand usage patterns | Dashboard with key metrics; Export reports; Date range filtering |

---

## 5. Technical Requirements

### 5.1 Architecture Overview

```
                                    +------------------+
                                    |   CDN (Assets)   |
                                    +--------+---------+
                                             |
+-------------------+               +--------v---------+
|                   |               |                  |
|  SoapBox Super    +<------------->+   SoapBox Jobs   |
|  App (Backend)    |   SSO/API     |   (Subdomain)    |
|                   |               |                  |
+-------------------+               +--------+---------+
                                             |
                                    +--------v---------+
                                    |                  |
                                    |   Jobs Backend   |
                                    |   (API Server)   |
                                    |                  |
                                    +--------+---------+
                                             |
                    +------------------------+------------------------+
                    |                        |                        |
           +--------v---------+    +---------v--------+    +----------v-------+
           |                  |    |                  |    |                  |
           |   PostgreSQL     |    |   Elasticsearch  |    |  Redis Cache     |
           |   (Primary DB)   |    |   (Search Index) |    |  (Sessions)      |
           |                  |    |                  |    |                  |
           +------------------+    +------------------+    +------------------+
```

### 5.2 Technology Stack

#### Frontend
- **Framework:** React 18+ with TypeScript
- **State Management:** React Query (TanStack Query) + Zustand
- **Styling:** Tailwind CSS with SoapBox design system
- **Build Tool:** Vite
- **Testing:** Vitest, React Testing Library, Playwright (E2E)

#### Backend
- **Runtime:** Node.js 20 LTS
- **Framework:** NestJS with TypeScript
- **API Style:** RESTful with OpenAPI/Swagger documentation
- **Authentication:** JWT with refresh tokens, SSO integration
- **Testing:** Jest, Supertest

#### Database & Storage
- **Primary Database:** PostgreSQL 15+
- **Search Engine:** Elasticsearch 8.x (for job search)
- **Caching:** Redis 7.x
- **File Storage:** AWS S3 or compatible object storage
- **CDN:** CloudFront or Cloudflare

#### Infrastructure
- **Containerization:** Docker
- **Orchestration:** Kubernetes or AWS ECS
- **CI/CD:** GitHub Actions
- **Monitoring:** DataDog or similar APM
- **Logging:** ELK Stack or CloudWatch

### 5.3 Integration Requirements

#### 5.3.1 SoapBox Super App Integration

| Integration Point | Method | Description |
|-------------------|--------|-------------|
| User Authentication | OAuth 2.0 / OIDC | SSO with Super App identity provider |
| User Profile | REST API | Fetch user profile, spiritual gifts, ministry history |
| Church Profile | REST API | Fetch church details, branding, leadership info |
| Notifications | Event Bus / Webhook | Push notifications to Super App |
| Shared Components | NPM Package | Shared UI components and design tokens |

#### 5.3.2 Third-Party Integrations (Future)

- **Email Service:** SendGrid or AWS SES
- **Analytics:** Mixpanel or Amplitude
- **Payment Processing:** Stripe (for premium listings, future)
- **Background Checks:** Checkr or similar (future)
- **Calendar:** Google Calendar / Microsoft Calendar (for interviews)

### 5.4 Non-Functional Requirements

#### 5.4.1 Performance

| Metric | Requirement |
|--------|-------------|
| Page Load Time | < 2 seconds (First Contentful Paint) |
| API Response Time | < 200ms (95th percentile) |
| Search Response Time | < 500ms |
| Uptime | 99.9% availability |
| Concurrent Users | Support 10,000+ concurrent users |

#### 5.4.2 Security

- HTTPS/TLS 1.3 for all communications
- Data encryption at rest (AES-256)
- SQL injection prevention (parameterized queries)
- XSS prevention (Content Security Policy, sanitization)
- CSRF protection
- Rate limiting on API endpoints
- Regular security audits and penetration testing
- GDPR and CCPA compliance for data handling
- PCI compliance considerations for future payment features

#### 5.4.3 Accessibility

- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- Color contrast requirements
- Alt text for images
- ARIA labels where appropriate

#### 5.4.4 Scalability

- Horizontal scaling for API servers
- Database read replicas for performance
- Elasticsearch cluster for search scalability
- CDN for static asset delivery
- Microservices architecture for independent scaling

### 5.5 Browser & Device Support

| Platform | Supported Versions |
|----------|-------------------|
| Chrome | Last 2 major versions |
| Firefox | Last 2 major versions |
| Safari | Last 2 major versions |
| Edge | Last 2 major versions |
| iOS Safari | Last 2 major versions |
| Android Chrome | Last 2 major versions |
| Screen Size | Responsive: 320px to 2560px+ |

---

## 6. Database Schema

### 6.1 Entity Relationship Overview

```
+---------------+       +------------------+       +---------------+
|    users      |       |   applications   |       |     jobs      |
|---------------|       |------------------|       |---------------|
| id (PK)       |<------| user_id (FK)     |------>| id (PK)       |
| soapbox_id    |       | job_id (FK)      |       | church_id     |
| email         |       | status           |       | title         |
| profile_data  |       | cover_letter     |       | description   |
| created_at    |       | resume_url       |       | category      |
+---------------+       | created_at       |       | type          |
        |               +------------------+       | location      |
        |                       |                  | status        |
        v                       v                  +---------------+
+---------------+       +------------------+               |
| saved_jobs    |       |    messages      |               |
|---------------|       |------------------|               |
| user_id (FK)  |       | application_id   |               |
| job_id (FK)   |       | sender_id        |               v
| created_at    |       | content          |       +---------------+
+---------------+       | created_at       |       |   churches    |
                        +------------------+       |---------------|
                                                   | id (PK)       |
                                                   | soapbox_id    |
                                                   | name          |
                                                   | profile_data  |
                                                   +---------------+
```

### 6.2 Core Tables

#### 6.2.1 Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    soapbox_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    profile_photo_url TEXT,
    ministry_statement TEXT,
    resume_url TEXT,
    profile_visibility VARCHAR(20) DEFAULT 'public',
    notification_preferences JSONB DEFAULT '{}',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.2 Churches Table

```sql
CREATE TABLE churches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    soapbox_church_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    denomination VARCHAR(100),
    size_category VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    website_url TEXT,
    logo_url TEXT,
    description TEXT,
    employer_profile JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.3 Jobs Table

```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL REFERENCES churches(id),
    created_by_user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    qualifications TEXT,
    responsibilities TEXT,
    benefits TEXT,
    category VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50) NOT NULL,
    work_arrangement VARCHAR(50) NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_type VARCHAR(20),
    show_salary BOOLEAN DEFAULT TRUE,
    location_city VARCHAR(100),
    location_state VARCHAR(50),
    location_country VARCHAR(50) DEFAULT 'USA',
    is_remote BOOLEAN DEFAULT FALSE,
    experience_level VARCHAR(50),
    education_requirement VARCHAR(100),
    doctrinal_requirements TEXT,
    application_deadline DATE,
    external_apply_url TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.4 Applications Table

```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'submitted',
    cover_letter TEXT,
    resume_url TEXT,
    additional_documents JSONB DEFAULT '[]',
    answers JSONB DEFAULT '{}',
    internal_notes TEXT,
    internal_rating INTEGER CHECK (internal_rating BETWEEN 1 AND 5),
    source VARCHAR(100),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    last_status_change_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, user_id)
);
```

#### 6.2.5 Saved Jobs Table

```sql
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    job_id UUID NOT NULL REFERENCES jobs(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);
```

#### 6.2.6 Messages Table

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    sender_type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.7 Job Alerts Table

```sql
CREATE TABLE job_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255),
    search_criteria JSONB NOT NULL,
    frequency VARCHAR(20) DEFAULT 'daily',
    is_active BOOLEAN DEFAULT TRUE,
    last_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.2.8 Church Admins Table

```sql
CREATE TABLE church_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL REFERENCES churches(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(church_id, user_id)
);
```

### 6.3 Indexes

```sql
-- Jobs indexes for search and filtering
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX idx_jobs_location ON jobs(location_city, location_state);
CREATE INDEX idx_jobs_church_id ON jobs(church_id);
CREATE INDEX idx_jobs_published_at ON jobs(published_at DESC);
CREATE INDEX idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || description));

-- Applications indexes
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Messages indexes
CREATE INDEX idx_messages_application_id ON messages(application_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Saved jobs indexes
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
```

---

## 7. API Endpoints

### 7.1 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/sso` | Initiate SSO with SoapBox Super App |
| POST | `/api/v1/auth/callback` | SSO callback handler |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | End user session |
| GET | `/api/v1/auth/me` | Get current user info |

### 7.2 Jobs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/jobs` | List jobs with filtering and pagination |
| GET | `/api/v1/jobs/:id` | Get job details |
| GET | `/api/v1/jobs/:id/similar` | Get similar jobs |
| POST | `/api/v1/jobs` | Create new job (church admin) |
| PUT | `/api/v1/jobs/:id` | Update job (church admin) |
| DELETE | `/api/v1/jobs/:id` | Delete job (church admin) |
| POST | `/api/v1/jobs/:id/publish` | Publish job (church admin) |
| POST | `/api/v1/jobs/:id/close` | Close/fill job (church admin) |

### 7.3 Applications Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/applications` | List user's applications |
| GET | `/api/v1/applications/:id` | Get application details |
| POST | `/api/v1/jobs/:jobId/apply` | Submit application |
| PUT | `/api/v1/applications/:id` | Update application |
| DELETE | `/api/v1/applications/:id` | Withdraw application |
| GET | `/api/v1/jobs/:jobId/applications` | List applications for job (church admin) |
| PUT | `/api/v1/applications/:id/status` | Update application status (church admin) |
| PUT | `/api/v1/applications/:id/notes` | Update internal notes (church admin) |
| PUT | `/api/v1/applications/:id/rating` | Update rating (church admin) |

### 7.4 Saved Jobs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/saved-jobs` | List saved jobs |
| POST | `/api/v1/saved-jobs/:jobId` | Save a job |
| DELETE | `/api/v1/saved-jobs/:jobId` | Remove saved job |

### 7.5 Messages Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/applications/:appId/messages` | List messages for application |
| POST | `/api/v1/applications/:appId/messages` | Send message |
| PUT | `/api/v1/messages/:id/read` | Mark message as read |

### 7.6 Job Alerts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/alerts` | List user's job alerts |
| POST | `/api/v1/alerts` | Create job alert |
| PUT | `/api/v1/alerts/:id` | Update job alert |
| DELETE | `/api/v1/alerts/:id` | Delete job alert |

### 7.7 Church/Organization Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/churches/:id` | Get church profile |
| GET | `/api/v1/churches/:id/jobs` | Get church's job listings |
| PUT | `/api/v1/churches/:id` | Update church employer profile (church admin) |

### 7.8 User Profile Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/profile` | Get user profile |
| PUT | `/api/v1/profile` | Update user profile |
| POST | `/api/v1/profile/import` | Import data from Super App |
| POST | `/api/v1/profile/resume` | Upload resume |
| PUT | `/api/v1/profile/visibility` | Update visibility settings |

### 7.9 Search Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/search/jobs` | Advanced job search with Elasticsearch |
| GET | `/api/v1/search/suggestions` | Search autocomplete suggestions |
| GET | `/api/v1/categories` | List job categories |
| GET | `/api/v1/locations` | List locations with job counts |

### 7.10 Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/jobs` | List all jobs (platform admin) |
| PUT | `/api/v1/admin/jobs/:id/approve` | Approve job listing |
| PUT | `/api/v1/admin/jobs/:id/reject` | Reject job listing |
| GET | `/api/v1/admin/users` | List users (platform admin) |
| GET | `/api/v1/admin/analytics` | Platform analytics |

---

## 8. UI/UX Considerations

### 8.1 Design Principles

1. **Consistency with SoapBox Ecosystem**
   - Use SoapBox design system (colors, typography, components)
   - Maintain visual continuity with Super App
   - Shared navigation patterns and iconography

2. **Ministry-Focused Experience**
   - Language and imagery appropriate for faith-based context
   - Categories and filters relevant to ministry roles
   - Support for expressing spiritual calling and gifts

3. **Simplicity and Clarity**
   - Clean, uncluttered layouts
   - Clear calls-to-action
   - Progressive disclosure of information

4. **Mobile-First Responsive Design**
   - Optimized for mobile job searching
   - Touch-friendly interface elements
   - Consistent experience across devices

### 8.2 Key Pages and Components

#### 8.2.1 Job Seeker Pages

| Page | Description | Key Components |
|------|-------------|----------------|
| **Home/Landing** | Discovery page with featured jobs and search | Hero search bar, featured jobs carousel, category quick links, recent jobs |
| **Job Search Results** | Filtered job listings | Search bar, filter sidebar/modal, job cards, pagination, save search |
| **Job Detail** | Full job information | Job header, description tabs, church info sidebar, apply CTA, similar jobs |
| **Application Form** | Submit application | Profile preview, cover letter input, file upload, submit button |
| **My Applications** | Track applications | Application cards with status, filter by status, message indicators |
| **Saved Jobs** | Bookmarked jobs | Job cards with unsave action, application status indicator |
| **Profile** | Manage job seeker profile | Section tabs, edit inline, import from Super App |
| **Job Alerts** | Manage notifications | Alert cards, edit/delete actions, frequency settings |

#### 8.2.2 Church Admin Pages

| Page | Description | Key Components |
|------|-------------|----------------|
| **Dashboard** | Overview of recruiting activity | Stats summary, recent applications, action items |
| **Job Listings** | Manage church's jobs | Job cards with status, quick actions, create new button |
| **Create/Edit Job** | Job posting form | Multi-step wizard, preview, templates |
| **Applications** | Review candidates | Candidate table/cards, bulk actions, status filters |
| **Candidate Detail** | Review single applicant | Profile view, application materials, notes, messages, status |
| **Messages** | Communication center | Conversation threads, templates, unread indicators |
| **Church Profile** | Manage employer brand | Edit profile sections, preview, branding |
| **Analytics** | Recruiting metrics | Charts, KPIs, date range selector |

### 8.3 Component Library

Extend SoapBox design system with job-specific components:

- **JobCard:** Compact job listing display
- **ApplicationStatusBadge:** Visual status indicator
- **SalaryDisplay:** Formatted salary range
- **LocationDisplay:** Location with work arrangement icon
- **CategoryTag:** Clickable category badge
- **ChurchLogo:** Church branding display
- **ProfileCompleteness:** Profile completion indicator
- **MessageThread:** Chat-style message display
- **FilterPanel:** Search filter controls

### 8.4 User Flows

#### 8.4.1 Job Seeker: Find and Apply

```
Home Page
    |
    v
Search/Browse Jobs
    |
    v
View Job Details
    |
    +----> Save for Later
    |
    v
Click Apply
    |
    v
Review/Edit Application
    |
    v
Submit Application
    |
    v
Confirmation + Track in Dashboard
```

#### 8.4.2 Church Admin: Post and Manage

```
Dashboard
    |
    v
Create New Job
    |
    v
Fill Job Details (Multi-step)
    |
    v
Preview Listing
    |
    v
Publish Job
    |
    v
Receive Applications
    |
    v
Review Candidates
    |
    v
Update Status / Message
    |
    v
Mark Position Filled
```

### 8.5 Accessibility Guidelines

- Minimum color contrast ratio of 4.5:1 for text
- Focus indicators for keyboard navigation
- ARIA labels for interactive elements
- Skip navigation links
- Error messages associated with form fields
- Meaningful alt text for images
- Captioning for video content
- Support for browser zoom up to 200%

### 8.6 Responsive Breakpoints

| Breakpoint | Width | Target Devices |
|------------|-------|----------------|
| xs | < 640px | Mobile phones |
| sm | 640px - 767px | Large phones |
| md | 768px - 1023px | Tablets |
| lg | 1024px - 1279px | Small laptops |
| xl | 1280px+ | Desktops |

---

## 9. Success Metrics

### 9.1 Key Performance Indicators (KPIs)

#### 9.1.1 User Acquisition & Engagement

| Metric | Description | Target (Year 1) |
|--------|-------------|-----------------|
| **Registered Job Seekers** | Total users with job seeker profiles | 10,000 |
| **Active Job Seekers** | Users who logged in within 30 days | 3,000/month |
| **Registered Churches** | Churches with employer accounts | 500 |
| **Active Posting Churches** | Churches with active job listings | 200/month |
| **Profile Completion Rate** | Users with 80%+ profile completion | 40% |

#### 9.1.2 Job Listings

| Metric | Description | Target (Year 1) |
|--------|-------------|-----------------|
| **Total Jobs Posted** | Cumulative job listings created | 2,000 |
| **Active Job Listings** | Currently open positions | 400/month |
| **Jobs per Category** | Distribution across categories | Balanced distribution |
| **Average Time to Fill** | Days from posting to filled | < 45 days |
| **Listing Completion Rate** | Listings with all recommended fields | 70% |

#### 9.1.3 Applications & Hiring

| Metric | Description | Target (Year 1) |
|--------|-------------|-----------------|
| **Total Applications** | Cumulative applications submitted | 15,000 |
| **Applications per Job** | Average applications per listing | 8-15 |
| **Application Completion Rate** | Started applications that are submitted | 75% |
| **Offer Rate** | Applications resulting in offers | 5% |
| **Successful Hires** | Positions filled through platform | 300 |

#### 9.1.4 Platform Health

| Metric | Description | Target |
|--------|-------------|--------|
| **Page Load Time** | Average FCP | < 2 seconds |
| **Uptime** | Platform availability | 99.9% |
| **Error Rate** | API error percentage | < 0.1% |
| **Search Relevance** | User satisfaction with search | > 80% |
| **Support Ticket Volume** | Tickets per 1000 users | < 5 |

### 9.2 User Satisfaction Metrics

| Metric | Measurement Method | Target |
|--------|-------------------|--------|
| **NPS (Net Promoter Score)** | Quarterly survey | > 40 |
| **User Satisfaction (CSAT)** | Post-interaction survey | > 4.0/5.0 |
| **Feature Usage** | Analytics tracking | Key features used by 60%+ |
| **Churn Rate** | Monthly account deactivations | < 5% |

### 9.3 Monitoring & Reporting

- **Real-time Dashboard:** Key metrics visible to product team
- **Weekly Reports:** Automated reports to stakeholders
- **Monthly Business Review:** Deep-dive analysis of trends
- **Quarterly User Research:** Surveys and interviews

---

## 10. Future Enhancements

### 10.1 Phase 2 Features (Post-Launch)

#### 10.1.1 Enhanced Matching

- **AI-Powered Job Recommendations:** Machine learning-based job suggestions
- **Skill Matching Score:** Automatic compatibility scoring
- **Smart Search:** Natural language search queries
- **Similar Candidate Suggestions:** Recommend candidates from talent pool

#### 10.1.2 Advanced Communication

- **Interview Scheduling:** Calendar integration for scheduling
- **Video Interview:** Built-in video interviewing capability
- **Reference Requests:** Automated reference collection
- **Offer Letters:** Generate and track offer letters

#### 10.1.3 Premium Features (Monetization)

- **Featured Listings:** Promoted job visibility
- **Talent Search:** Proactive candidate sourcing for churches
- **Analytics Pro:** Advanced recruiting analytics
- **Multi-Church Posting:** Post to multiple locations

### 10.2 Phase 3 Features (Year 2+)

#### 10.2.1 Background & Verification

- **Background Checks:** Integration with background check services
- **Reference Verification:** Automated reference checking
- **Credential Verification:** Verify education and certifications
- **Ministry Assessment:** Optional ministry fit assessments

#### 10.2.2 Community Features

- **Ministry Resume Endorsements:** Peer endorsements from SoapBox community
- **Church Reviews:** Anonymous reviews from former employees
- **Salary Insights:** Anonymized salary benchmarking data
- **Career Resources:** Articles, webinars, career coaching

#### 10.2.3 Enterprise Features

- **Denominational Dashboards:** Multi-church management for denominations
- **Applicant Tracking System (ATS):** Full ATS capabilities
- **HRIS Integration:** Integration with church management systems
- **API Access:** Public API for integration partners

### 10.3 Technical Debt & Improvements

- **GraphQL API:** Add GraphQL alongside REST
- **Real-time Updates:** WebSocket for live notifications
- **Offline Support:** PWA capabilities for mobile
- **Performance Optimization:** Continued performance improvements
- **International Expansion:** Multi-language, multi-currency support

---

## 11. Timeline & Phases

### 11.1 Project Phases Overview

```
Phase 0: Discovery & Planning      [4 weeks]
Phase 1: MVP Development           [12 weeks]
Phase 2: Beta Launch               [4 weeks]
Phase 3: Public Launch             [4 weeks]
Phase 4: Post-Launch Iteration     [Ongoing]
```

### 11.2 Phase 0: Discovery & Planning (Weeks 1-4)

**Duration:** 4 weeks

| Week | Activities | Deliverables |
|------|------------|--------------|
| 1 | Stakeholder interviews, competitive analysis | Research findings document |
| 2 | User research, persona validation | User research report |
| 3 | Technical discovery, architecture planning | Technical architecture document |
| 4 | Design exploration, wireframes | Low-fidelity wireframes, design direction |

**Exit Criteria:**
- Approved PRD
- Technical architecture approved
- Design direction approved
- Development team assembled

### 11.3 Phase 1: MVP Development (Weeks 5-16)

**Duration:** 12 weeks

#### Sprint 1-2 (Weeks 5-8): Foundation

| Component | Tasks |
|-----------|-------|
| **Infrastructure** | Set up CI/CD, environments, monitoring |
| **Backend** | Database setup, authentication, SSO integration |
| **Frontend** | Project setup, design system integration, routing |
| **Design** | High-fidelity designs for core flows |

#### Sprint 3-4 (Weeks 9-12): Core Features - Job Seekers

| Component | Tasks |
|-----------|-------|
| **Backend** | Jobs API, search infrastructure, user profiles |
| **Frontend** | Job search, job detail, profile management |
| **Integration** | Super App profile import, notifications |

#### Sprint 5-6 (Weeks 13-16): Core Features - Church Admins

| Component | Tasks |
|-----------|-------|
| **Backend** | Applications API, messaging, church profiles |
| **Frontend** | Job posting wizard, applications dashboard, messaging |
| **Testing** | End-to-end testing, performance testing |

**MVP Features:**
- SSO authentication
- Job search and filtering
- Job detail pages
- Basic profile management
- Apply for jobs
- Post job listings
- View and manage applications
- Basic messaging

**Exit Criteria:**
- All MVP features functional
- Performance targets met
- Security review passed
- Internal QA completed

### 11.4 Phase 2: Beta Launch (Weeks 17-20)

**Duration:** 4 weeks

| Week | Activities | Deliverables |
|------|------------|--------------|
| 17 | Private beta with select churches and users | Beta access granted to 20 churches, 200 users |
| 18-19 | Bug fixes, feedback collection, iteration | Bug fix releases, feedback summary |
| 20 | Public beta preparation, marketing prep | Public beta readiness checklist |

**Exit Criteria:**
- Critical bugs resolved
- Beta NPS > 30
- Performance stable under load
- Documentation complete

### 11.5 Phase 3: Public Launch (Weeks 21-24)

**Duration:** 4 weeks

| Week | Activities | Deliverables |
|------|------------|--------------|
| 21 | Soft launch to broader audience | Public access enabled |
| 22 | Marketing campaign, church outreach | Marketing materials, outreach plan executed |
| 23 | Monitor and respond to issues | Incident response, hot fixes |
| 24 | Launch celebration, retrospective | Launch announcement, retrospective document |

**Launch Checklist:**
- All critical bugs resolved
- Monitoring and alerting configured
- Support team trained
- Documentation and help center live
- Marketing materials ready
- Press/announcement prepared

### 11.6 Phase 4: Post-Launch Iteration (Ongoing)

**Duration:** Ongoing (2-week sprints)

| Sprint | Focus Area |
|--------|------------|
| Sprint 1-2 | Bug fixes, performance optimization, quick wins |
| Sprint 3-4 | Job alerts, enhanced search, analytics |
| Sprint 5-6 | Profile enhancements, church profile upgrades |
| Sprint 7+ | Phase 2 features based on user feedback |

### 11.7 Resource Requirements

| Role | Count | Phase Involvement |
|------|-------|-------------------|
| Product Manager | 1 | All phases |
| UX Designer | 1 | Phases 0-3 |
| Frontend Engineer | 2 | Phases 1-4 |
| Backend Engineer | 2 | Phases 1-4 |
| QA Engineer | 1 | Phases 1-4 |
| DevOps Engineer | 0.5 | Phases 1-4 |

### 11.8 Key Milestones

| Milestone | Target Date | Description |
|-----------|-------------|-------------|
| **Kickoff** | Week 1 | Project officially begins |
| **Design Complete** | Week 8 | All MVP designs approved |
| **Backend API Complete** | Week 14 | All MVP APIs functional |
| **Feature Complete** | Week 16 | All MVP features implemented |
| **Beta Launch** | Week 17 | Private beta begins |
| **Public Launch** | Week 21 | Platform publicly available |
| **Post-Launch Review** | Week 26 | Review metrics and plan Phase 2 |

### 11.9 Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SSO integration complexity | Medium | High | Early spike, dedicated resources |
| Search performance issues | Medium | Medium | Elasticsearch expertise, load testing |
| Low initial church adoption | Medium | High | Early outreach, beta incentives |
| Scope creep | High | Medium | Strict MVP definition, change control |
| Super App dependency delays | Medium | High | Parallel development, mock APIs |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **SoapBox Super App** | The main spiritual engagement and community platform for churches |
| **Church Admin** | Administrator of a church within the SoapBox ecosystem |
| **SSO** | Single Sign-On; authentication system allowing one login across multiple applications |
| **MVP** | Minimum Viable Product; initial release with core features |
| **ATS** | Applicant Tracking System; software for managing job applications |

## Appendix B: Related Documents

- SoapBox Super App Technical Documentation
- SoapBox Design System Guidelines
- SoapBox Authentication Service Specification
- Church Admin Portal User Guide

## Appendix C: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-26 | [TBD] | Initial draft |

---

*This document is a living specification and will be updated as the product evolves. For questions or clarifications, contact the Product Owner.*
