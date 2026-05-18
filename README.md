# WorkBridge PH

**Web-Based Unified Employment Platform for Decent Work Access**
*A Group 4 Capstone Project — Philippines*

---

## Project Overview

WorkBridge PH is a globally accessible, web-based employment platform that connects job seekers and employers across all sectors — white-collar, blue-collar, and household/service workers. While the project originates from the Philippine context and uses it as its primary case study, the platform is designed to be accessible worldwide and addresses employment inequality problems that exist across all nations.

The platform provides a centralized, safe, and inclusive job-matching ecosystem that bridges the gap between workers and employers regardless of geographic location.

### Geographic Scope

| Scope | Detail |
|-------|--------|
| **Accessibility** | Globally accessible via the internet |
| **Origin & Primary Context** | Philippines — used as the founding case study |
| **Target Users** | Job seekers and employers worldwide |
| **Platform Language** | English |

### SDG Alignment

The following Sustainable Development Goals are worldwide in scope. The problems this platform addresses are not unique to the Philippines — they are global challenges affecting workers in every country.

| SDG | Goal | Global Problem Addressed |
|-----|------|--------------------------|
| **SDG 8** | Decent Work and Economic Growth | Hundreds of millions of workers worldwide lack access to decent, stable, and fairly compensated employment. Online job portals largely serve professional and white-collar workers, leaving blue-collar and service workers without structured digital recruitment. |
| **SDG 1** | No Poverty | Unemployment and underemployment are leading drivers of poverty globally. Improving access to employment opportunities is one of the most direct mechanisms for poverty reduction across all nations. |
| **SDG 10** | Reduced Inequalities | Digital recruitment platforms worldwide disproportionately serve educated, urban, and professional populations. Workers in the informal, household, and service sectors face systemic exclusion from these platforms, deepening inequality. |

### Problem Being Solved

These problems exist globally and are the basis for this platform:

- Unequal access to digital recruitment platforms — blue-collar, household, and service workers worldwide are excluded
- Over-concentration of job portals on white-collar and professional careers
- Heavy reliance of informal-sector workers on unsafe, unverified recruitment channels
- Widespread exposure to job scams and fraudulent postings in all regions
- Workers in any country struggling to find verified, location-relevant opportunities
- Employers globally facing difficulty finding reliable and suitable workers efficiently
- Persistent job insecurity among informal and service workers across developing and developed economies

---

## Quick Start

1. **Run the Laravel API** (required for login and most dashboards):

   ```bash
   cd backend
   php artisan serve
   ```

   Default API URL is `http://localhost:8000` (matches `assets/js/api.js`).

2. **Serve the static HTML** on a different port (e.g. 3000). This repo includes `serve.json` with `"cleanUrls": false` so URLs like `job-detail.html?id=1` keep their query string (the default `serve` behavior otherwise drops `?id=` when rewriting to extensionless paths).

   ```bash
   npm run serve
   # or: npx serve . -l 3000
   ```

   Open `http://localhost:3000`. Do not use port 8000 for static files if the API is already on 8000.

3. **Demo accounts** — same as the login page and `DatabaseSeeder`; API must be running and the database migrated/seeded:

   | Role | Email | Password |
   |------|-------|----------|
   | Job Seeker | `juan@example.com` | `password` |
   | Employer | `hr@technova.ph` | `password` |
   | Admin | `admin@workbridge.ph` | `password` |

---

## Features

### Public Pages
| Page | Description |
|------|-------------|
| `index.html` | Hero search, featured jobs, browse by category, how it works |
| `jobs.html` | Search and filter by type, setup, salary, experience, location |
| `job-detail.html` | Overview, responsibilities, qualifications, benefits, apply/save |
| `companies.html` | Company directory, search, verified filter |
| `company-detail.html` | Company info, open job listings |
| `safety.html` | **Scam awareness and worker protection guidelines** |
| `about.html` | Platform purpose and objectives |
| `help.html` | FAQs and support |
| `terms.html` / `privacy.html` | Legal pages |

### Authentication (`/auth/`)
- `login.html` — Demo login with role-based redirect
- `register.html` — Role selection (Seeker / Employer)
- `forgot.html` / `reset.html` — Password reset flow (simulated)

### Job Seeker Dashboard (`/seeker/`)
- **Dashboard** — Stats: saved jobs, applications, profile strength, recommended jobs
- **Jobs** — Browse all listings with save and apply actions
- **Saved Jobs** — Manage saved listings
- **Applications** — Filter by status, view application timeline
- **Application Detail** — Timeline, notes, status tracking
- **Profile** — Editable profile sections with completion strength indicator
- **Resume** — Upload simulation with preview
- **Notifications** — Activity alerts
- **Messages** — Employer-seeker messaging (simulated)
- **Settings** — Account and preference management

### Employer Dashboard (`/employer/`)
- **Dashboard** — KPI cards, applicant activity charts
- **Post Job** — Full job posting form with validation and preview
- **Manage Jobs** — Table view with edit/close actions
- **Applicants** — Per-job applicant list with status actions
- **Applicant Detail** — Resume preview, notes, shortlist/interview/reject actions
- **Company Profile** — Employer brand and info management
- **Verification** — Employer verification status and submission
- **Messages** — Communicate with applicants
- **Settings** — Account management

### Admin Dashboard (`/admin/`)
- **Dashboard** — Pending queues: verifications, job reviews, reports
- **Employer Verification** — Review and verify/reject/suspend employer accounts
- **Job Moderation** — Approve or reject job postings, split-view review
- **Reports** — Scam/abuse report list and resolution workflow
- **Users** — Search, view, and suspend user accounts
- **Analytics** — Platform-wide stats, charts, top categories and locations
- **Categories** — CRUD management for job categories
- **Audit Logs** — Action history filtered by type and date
- **Settings** — Admin system configuration

---

## Project Structure

```
Employment/
├── index.html                    # Public landing page
├── jobs.html                     # Public job search
├── job-detail.html               # Job detail view
├── companies.html                # Company directory
├── company-detail.html           # Company detail view
├── about.html / help.html        # Informational pages
├── safety.html                   # Scam awareness module
├── terms.html / privacy.html     # Legal pages
│
├── auth/                         # Authentication pages
│   ├── login.html
│   ├── register.html
│   ├── forgot.html
│   └── reset.html
│
├── seeker/                       # Job seeker dashboard
│   ├── dashboard.html
│   ├── jobs.html
│   ├── saved-jobs.html
│   ├── applications.html
│   ├── application-detail.html
│   ├── profile.html
│   ├── resume.html
│   ├── notifications.html
│   ├── messages.html
│   └── settings.html
│
├── employer/                     # Employer dashboard
│   ├── dashboard.html
│   ├── post-job.html
│   ├── manage-jobs.html
│   ├── job-edit.html
│   ├── applicants.html
│   ├── applicant-detail.html
│   ├── company-profile.html
│   ├── verification.html
│   ├── messages.html
│   └── settings.html
│
├── admin/                        # Admin panel
│   ├── dashboard.html
│   ├── employer-verification.html
│   ├── verification-detail.html
│   ├── job-moderation.html
│   ├── job-review.html
│   ├── reports.html
│   ├── report-detail.html
│   ├── users.html
│   ├── user-detail.html
│   ├── analytics.html
│   ├── categories.html
│   ├── audit-logs.html
│   └── settings.html
│
├── assets/
│   ├── css/
│   │   ├── tokens.css            # Design tokens (colors, spacing, typography)
│   │   ├── base.css              # Global reset and base styles
│   │   ├── components.css        # Reusable UI components
│   │   ├── public.css            # Public page styles
│   │   ├── auth.css              # Auth page styles
│   │   ├── seeker.css            # Seeker dashboard styles
│   │   ├── employer.css          # Employer dashboard styles
│   │   └── admin.css             # Admin panel styles
│   │
│   ├── js/
│   │   ├── app.js                # Main app entry point
│   │   ├── store.js              # localStorage data layer
│   │   ├── router.js             # Client-side routing and route guards
│   │   ├── data.seed.js          # Mock data seeder
│   │   ├── auth.mock.js          # Mock authentication logic
│   │   ├── layout.js             # Shared layout and navigation
│   │   ├── jobs.module.js        # Jobs browsing logic
│   │   ├── seeker.module.js      # Seeker dashboard logic
│   │   ├── seeker-jobs.js        # Seeker job browsing
│   │   ├── employer.module.js    # Employer dashboard logic
│   │   ├── employer-manage.js    # Employer job management
│   │   ├── admin.module.js       # Admin panel logic
│   │   ├── admin-users.js        # Admin user management
│   │   ├── admin-verification.js # Admin verification workflow
│   │   ├── ui.modal.js           # Modal component
│   │   ├── ui.toast.js           # Toast notification component
│   │   ├── ui.dropdown.js        # Dropdown component
│   │   ├── ui.table.js           # Table component
│   │   └── ui.animations.js      # Page transition animations
│   │
│   └── img/                      # Static images and assets
│
├── tests/                        # Playwright end-to-end tests
│   ├── workbridge.spec.js
│   └── router.spec.js
│
├── Documentation/                # Project documentation
│   ├── Group-4_Project_Concept_Proposal.docx
│   └── Group-4_Project_Concept_Proposal.pptx
│
├── package.json
└── README.md
```

---

## Framework & Technology Stack

WorkBridge PH is built in two distinct phases. The current state is a complete frontend prototype. The target state is a full-stack application powered by Laravel and MySQL.

---

### Phase 1 — Frontend Prototype (Current)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Markup | HTML5 | — | Page structure and content |
| Styling | CSS3 Custom Properties | — | Design tokens, layout, theming |
| Scripting | Vanilla JavaScript (ES Modules) | ES2020+ | Application logic, data handling |
| UI Framework | Bootstrap | 5.3.2 | Responsive grid, utility classes |
| Icon Library | Bootstrap Icons | 1.11.1 | UI iconography |
| Data / State | Browser `localStorage` | — | Mock backend; simulates database |
| Routing | Custom client-side router | — | Role-based guards, query params |
| End-to-End Testing | Playwright | `@playwright/test ^1.58.2` | Browser automation tests |

---

### Phase 2 — Full-Stack Target (Backend Integration)

#### Backend

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Language | PHP | 8.2+ | Server-side scripting |
| Framework | Laravel | 11.x | MVC application framework |
| Authentication | Laravel Sanctum | (bundled) | API token authentication for SPA/MPA |
| ORM | Laravel Eloquent | (bundled) | Database models and relationships |
| Validation | Laravel Form Requests | (bundled) | Server-side input validation |
| Authorization | Laravel Gates & Policies | (bundled) | Per-resource role and ownership checks |
| File Storage | Laravel Storage (local / S3) | (bundled) | Resume and document uploads |
| Events & Listeners | Laravel Events | (bundled) | Audit logging, notification triggers |
| Mail | Laravel Mail + SMTP | (bundled) | Email verification, password reset, job alerts |
| Queue | Laravel Queue | (bundled) | Background jobs (email, notifications) |
| Dependency Manager | Composer | 2.x | PHP package management |

#### Database

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Database Engine | MySQL | 8.0+ | Primary relational data store |
| Migrations | Laravel Migrations | (bundled) | Version-controlled schema management |
| Seeders | Laravel Seeders | (bundled) | Converts `data.seed.js` mock data to SQL |
| Query Builder | Laravel Eloquent / Query Builder | (bundled) | Server-side filtering, search, pagination |

#### Development Environment

| Tool | Technology | Purpose |
|------|-----------|---------|
| Local Server | XAMPP (Apache + MySQL + PHP) | Local development stack for Windows |
| Alternative | Laravel Herd or Laravel Sail (Docker) | Cross-platform alternative |
| Package Manager | Composer | PHP dependencies |
| Package Manager | npm | Frontend test tooling |
| Version Control | Git | Source control |

#### Testing (Full-Stack)

| Tool | Technology | Purpose |
|------|-----------|---------|
| Backend Unit Tests | PHPUnit (via Laravel) | Test individual classes and methods |
| Feature / Integration Tests | Laravel HTTP Tests | Test API endpoints end-to-end |
| Frontend E2E Tests | Playwright | Browser-level user flow testing |

---

### Architecture Pattern

| Pattern | Description |
|---------|-------------|
| **Multi-Page Application (MPA)** | Each page is a standalone `.html` file; no frontend SPA framework |
| **REST API** | Laravel exposes JSON API endpoints; frontend consumes via `fetch()` |
| **MVC (Model-View-Controller)** | Laravel separates data (Eloquent models), logic (controllers/services), and output (JSON responses) |
| **Role-Based Access Control (RBAC)** | Three roles — `seeker`, `employer`, `admin` — enforced by Laravel middleware and Policies |
| **Token Authentication** | Laravel Sanctum issues API tokens stored in `localStorage`; sent as `Authorization: Bearer` headers |
| **Token-based Design System** | All colors, spacing, and typography managed via CSS custom properties in `tokens.css` |
| **Module-based JS** | ES module imports with role-specific logic split into separate `.js` modules |

---

### Why Laravel?

| Reason | Detail |
|--------|--------|
| PHP ecosystem fit | Runs on standard shared hosting (Apache + PHP) available globally, including affordable options in developing countries |
| Built-in auth scaffolding | Sanctum handles API token auth with minimal boilerplate |
| Eloquent ORM | Clean, expressive database access; maps directly to the existing data models |
| Form Requests | Centralized, reusable validation — replaces fragile HTML5-only validation |
| Policies & Gates | Enforces ownership (employer edits only their own jobs; seeker views own applications) |
| Laravel Storage | Handles resume/document uploads to local disk or cloud (S3) without extra libraries |
| Active ecosystem | Large community, long-term LTS support, extensive documentation |
| Artisan CLI | Scaffolding, migrations, seeders, and testing all managed from one command interface |

---

### Why MySQL?

| Reason | Detail |
|--------|--------|
| Relational data model | Jobs, companies, seekers, applications, and reports all have well-defined relationships |
| Laravel Eloquent compatibility | First-class MySQL support; migrations and seeders work out of the box |
| Industry standard | Widely available on hosting providers globally |
| Performance | Indexing on `job_id`, `seeker_id`, `status`, `location` for efficient filtered queries |
| XAMPP bundled | Available immediately in local dev environment without extra setup |

### Global Accessibility Considerations

Because the platform is accessible worldwide, the following must be accounted for in design and backend integration:

| Consideration | Approach |
|--------------|----------|
| **Currency** | Display salary in the currency relevant to the job posting location; default to PHP (₱) for Philippine-origin listings |
| **Location** | Free-text location field supporting any city, region, or country — not restricted to Philippine geography |
| **Phone Numbers** | Support international format (+country code) |
| **Employer Verification** | Accept business registration documents from any country |
| **Language** | English as the platform language; content submitted by users may vary |
| **Time Zones** | Store all timestamps in UTC; display in user's local time |

---

## Seed Data

Managed in `assets/js/data.seed.js`, auto-loaded on first visit:

| Entity | Count |
|--------|-------|
| Jobs | 24 |
| Companies | 10 |
| Applications | 12 |
| Reports | 8 |
| Audit Logs | 20 |

---

## Proposal Alignment

| Proposal Requirement | Status | Notes |
|---------------------|--------|-------|
| Bootstrap-based responsive template | ✅ Complete | Bootstrap 5.3.2 |
| Home page — platform overview & featured jobs | ✅ Complete | `index.html` |
| Browse Jobs — search and filter listings | ✅ Complete | `jobs.html` |
| Job Categories — white/blue-collar, household | ⚠️ Partial | Homepage has category section; no dedicated public `/categories.html` page yet |
| Safety & Awareness — scam prevention | ✅ Complete | `safety.html` |
| About Page | ✅ Complete | `about.html` |
| Job Seeker — Profile Management | ✅ Complete | `seeker/profile.html` |
| Job Seeker — Saved Jobs | ✅ Complete | `seeker/saved-jobs.html` |
| Job Seeker — Applications & Status Tracking | ✅ Complete | `seeker/applications.html` + detail |
| Employer — Employer Profile | ✅ Complete | `employer/company-profile.html` |
| Employer — Job Posting and Management | ✅ Complete | `employer/post-job.html` + `manage-jobs.html` |
| Employer — Applicant Review | ✅ Complete | `employer/applicants.html` + detail |
| Admin — Employer Verification | ✅ Complete | `admin/employer-verification.html` |
| Admin — Job Post Monitoring | ✅ Complete | `admin/job-moderation.html` |
| Admin — Report and Scam Management | ✅ Complete | `admin/reports.html` |
| Admin — System Analytics | ✅ Complete | `admin/analytics.html` |
| Employment & livelihood guidance materials | ⚠️ Partial | `help.html` covers guidance; no dedicated livelihood resources page |
| Location-based job opportunities | ⚠️ Partial | Location filter exists in UI; no real geolocation integration |
| Employer profiles and verification status | ✅ Complete | Verification badge system implemented |
| Job application records and status | ✅ Complete | Full application lifecycle with status tracking |

---

## Running Tests

```bash
# Install dependencies
npm install

# Start local server first
npx serve . &

# Run Playwright tests
npx playwright test
```

---

## Next Phase: Backend Integration

The current prototype is Phase 1 (Frontend). See [ROADMAP.md](ROADMAP.md) for the full development plan.

To convert to a full-stack application:
1. Replace `localStorage` store with **MySQL** via **Laravel Eloquent**
2. Build REST API endpoints using **Laravel** controllers
3. Implement real authentication using **Laravel Sanctum** (API token-based)
4. Convert `data.seed.js` into **Laravel Seeders** with SQL migrations
5. Replace client-side filtering with server-side **Eloquent** queries
6. Implement real file upload using **Laravel Storage**

---

## Team

**Group 4** — Web-Based Unified Employment Platform for Decent Work Access

---

## License

MIT
