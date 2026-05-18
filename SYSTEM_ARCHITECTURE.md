# WorkBridge PH — System Architecture & Design

**Web-Based Unified Employment Platform for Decent Work Access**
*IT305 — Web Systems and Technologies | Major Course Output*
*Group 4 — Northwest Samar State University*

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Pattern](#architecture-pattern)
3. [Technology Stack (Final)](#technology-stack-final)
4. [System Design](#system-design)
5. [Database Schema](#database-schema)
6. [Feature Matrix (Final)](#feature-matrix-final)
7. [User Roles & Permissions](#user-roles--permissions)
8. [Page Map](#page-map)
9. [Data Flow](#data-flow)
10. [Security Design](#security-design)
11. [UI/UX Design System](#uiux-design-system)
12. [Phased Roadmap (Deadline-Aligned)](#phased-roadmap-deadline-aligned)
13. [Deployment Architecture](#deployment-architecture)

---

## 1. System Overview

WorkBridge PH is a globally accessible employment platform that connects job seekers with employers across all sectors — white-collar, blue-collar, and household/service workers. It addresses SDG 8 (Decent Work), SDG 1 (No Poverty), and SDG 10 (Reduced Inequalities).

### Core Value Proposition

| For | Value |
|-----|-------|
| **Job Seekers** | One unified platform to find verified, safe employment across all job sectors |
| **Employers** | Efficient recruitment with applicant tracking, verification, and quality candidates |
| **Administrators** | Complete oversight — employer verification, job moderation, abuse reporting, audit trails |

### Scope Boundaries

| In Scope | Out of Scope |
|----------|-------------|
| Job posting, search, filtering | Payment processing / payroll |
| Application tracking with status timeline | Video interviews |
| Employer verification workflow | AI resume scoring |
| Admin moderation & audit logs | Third-party job board integration |
| Scam awareness & safety guidelines | Mobile native app (web-responsive only) |
| Resume upload & management | Real-time chat (polling-based messaging only) |
| Role-based dashboards (3 roles) | Multi-language support |

---

## 2. Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Public   │  │  Seeker  │  │ Employer │  │   Admin   │  │
│  │  Pages    │  │Dashboard │  │Dashboard │  │  Panel    │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
│       │              │              │               │        │
│  ┌────┴──────────────┴──────────────┴───────────────┴────┐  │
│  │              Bootstrap 5.3.2 + tokens.css             │  │
│  │              (Responsive UI Framework)                 │  │
│  └────┬──────────────────────────────────────────────────┘  │
│       │                                                      │
│  ┌────┴──────────────────────────────────────────────────┐  │
│  │  Phase 1: store.js (localStorage)                     │  │
│  │  Phase 2: api.js (fetch → Laravel REST API)           │  │
│  └───────────────────────────┬───────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │ HTTP/HTTPS
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    SERVER (Phase 2)                           │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Laravel 11.x  (PHP 8.2+)                              ││
│  │                                                         ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  ││
│  │  │ Sanctum  │  │Middleware│  │     Controllers       │  ││
│  │  │  Auth    │──│(Role,    │──│ Auth, Job, Company,   │  ││
│  │  │  Tokens  │  │ CORS)    │  │ Application, Admin    │  ││
│  │  └──────────┘  └──────────┘  └──────────┬───────────┘  ││
│  │                                          │              ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┴───────────┐  ││
│  │  │  Form    │  │ Policies │  │   Eloquent Models     │  ││
│  │  │ Requests │  │ (RBAC)   │  │ (ORM + Relationships) │  ││
│  │  └──────────┘  └──────────┘  └──────────┬───────────┘  ││
│  └─────────────────────────────────────────┼───────────────┘│
│                                            │                 │
│  ┌─────────────────────────────────────────┴──────────────┐ │
│  │              MySQL 8.0+                                │ │
│  │  users, seekers, companies, jobs, applications,        │ │
│  │  categories, reports, audit_logs, notifications        │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Pattern Summary

| Pattern | Description |
|---------|-------------|
| **MPA (Multi-Page Application)** | Each page is a standalone `.html` file. No SPA framework (React, Vue). Simple, fast, easy to maintain. |
| **REST API** | Laravel serves JSON responses. Frontend calls via `fetch()`. Clean separation of frontend and backend. |
| **MVC** | Laravel enforces Model-View-Controller. Models = Eloquent, Controllers = API logic, Views = HTML pages. |
| **RBAC** | Three roles — `seeker`, `employer`, `admin`. Enforced at route, middleware, and policy levels. |
| **Token Auth** | Laravel Sanctum issues API tokens. Stored in `localStorage`. Sent as `Authorization: Bearer` header. |
| **Token Design System** | All UI styling via CSS custom properties (`tokens.css`). Consistent look, easy theming. |

### Why MPA (Not SPA)?

| Reason | Detail |
|--------|--------|
| **Simplicity** | No build tools (Webpack, Vite). Just HTML + JS files served directly. |
| **Course-appropriate** | IT305 focuses on web fundamentals — HTML, CSS, JS, PHP, MySQL. No framework overhead. |
| **Fast to develop** | No component tree, no state management library, no routing library. Direct DOM manipulation. |
| **Easy to present** | Each page is independently viewable. Instructor can open any `.html` file. |
| **Bootstrap native** | Bootstrap 5 is designed for MPA — its grid, utilities, and components work without JS bundling. |

---

## 3. Technology Stack (Final)

### Phase 1 — Frontend Prototype (Current Build)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Markup | HTML5 | — | Semantic page structure |
| Styling | CSS3 Custom Properties | — | Design tokens, dark mode, theming |
| UI Framework | **Bootstrap 5** | **5.3.2** | Responsive grid, components, utilities |
| Icons | Bootstrap Icons | 1.11.1 | Consistent iconography |
| Scripting | Vanilla JavaScript | ES2020+ (ES Modules) | Application logic, DOM manipulation |
| Data Layer | `localStorage` | — | Mock backend (simulates database) |
| Routing | Custom router (`router.js`) | — | Role-based guards, query params |
| Testing | Playwright | ^1.58.2 | E2E browser tests |

### Phase 2 — Full-Stack (Backend Integration)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Language | **PHP** | **8.2+** | Server-side scripting |
| Framework | **Laravel** | **11.x** | MVC framework, routing, middleware |
| Auth | **Laravel Sanctum** | bundled | API token authentication |
| ORM | **Eloquent** | bundled | Database models, relationships, queries |
| Validation | **Form Requests** | bundled | Server-side input validation |
| Authorization | **Gates & Policies** | bundled | Per-resource ownership checks |
| File Storage | **Laravel Storage** | bundled | Resume/document uploads |
| Mail | **Laravel Mail** | bundled | Email verification, password reset |
| Queue | **Laravel Queue** | bundled | Background jobs |
| Database | **MySQL** | **8.0+** | Primary relational data store |
| Migrations | **Laravel Migrations** | bundled | Version-controlled schema |
| Dev Server | **XAMPP** | latest | Apache + MySQL + PHP (Windows) |
| PHP Packages | **Composer** | 2.x | Dependency management |
| Testing | **PHPUnit** | bundled | Backend unit + feature tests |

### Tools Summary (For Tarpaulin / Lobby Posting)

```
Frontend:   HTML5 · CSS3 · JavaScript (ES Modules) · Bootstrap 5.3.2
Backend:    PHP 8.2 · Laravel 11 · Laravel Sanctum
Database:   MySQL 8.0
Testing:    Playwright (E2E) · PHPUnit (Backend)
Dev Tools:  XAMPP · Composer · Git · VS Code
```

---

## 4. System Design

### 4.1 Module Architecture

The system is organized into 4 distinct modules, each with its own pages, logic, and permissions:

```
WorkBridge PH
├── PUBLIC MODULE (No auth required)
│   ├── Homepage — hero search, categories, featured jobs
│   ├── Job Search — filter, sort, paginate
│   ├── Job Detail — overview, apply, save
│   ├── Company Directory — search, verified filter
│   ├── Company Detail — info, open positions
│   ├── Safety & Awareness — scam prevention
│   ├── About — platform purpose
│   └── Help / FAQ — guidance
│
├── AUTH MODULE (No auth required)
│   ├── Login — email/password, role-based redirect
│   ├── Register — role selection (seeker/employer)
│   ├── Forgot Password — email reset link
│   └── Reset Password — set new password
│
├── SEEKER MODULE (Auth: role=seeker)
│   ├── Dashboard — stats, recommended jobs
│   ├── Job Browse — save, apply from dashboard
│   ├── Saved Jobs — manage bookmarks
│   ├── Applications — filter by status, view timeline
│   ├── Application Detail — status timeline, notes
│   ├── Profile — edit name, location, skills
│   ├── Resume — upload/manage documents
│   ├── Notifications — activity alerts
│   ├── Messages — employer communication
│   └── Settings — account preferences
│
├── EMPLOYER MODULE (Auth: role=employer)
│   ├── Dashboard — KPIs, applicant charts
│   ├── Post Job — form with preview
│   ├── Manage Jobs — table, edit, delete
│   ├── Edit Job — update existing listing
│   ├── Applicants — per-job list, status actions
│   ├── Applicant Detail — resume, notes, shortlist/reject
│   ├── Company Profile — brand management
│   ├── Verification — submit documents for review
│   ├── Messages — seeker communication
│   └── Settings — account preferences
│
└── ADMIN MODULE (Auth: role=admin)
    ├── Dashboard — pending queues overview
    ├── Employer Verification — verify/reject employers
    ├── Verification Detail — review documents
    ├── Job Moderation — approve/reject postings
    ├── Job Review — split-view detailed review
    ├── Reports — scam/abuse management
    ├── Report Detail — resolution workflow
    ├── Users — search, view, edit, delete, suspend
    ├── User Detail — full user profile view
    ├── Analytics — platform-wide statistics
    ├── Categories — CRUD management
    ├── Audit Logs — action history
    └── Settings — system configuration
```

### 4.2 Data Layer Design

**Phase 1 (localStorage):**
```
Browser localStorage
├── workbridge_jobs         → Array of job objects
├── workbridge_companies    → Array of company objects
├── workbridge_seekers      → Array of seeker profiles
├── workbridge_applications → Array of application objects
├── workbridge_reports      → Array of report objects
├── workbridge_audit_logs   → Array of audit log entries
├── workbridge_categories   → Array of categories
├── workbridge_saved_jobs   → { userId: [jobId, ...] }
├── workbridge_notifications→ { userId: [notif, ...] }
├── workbridge_messages     → { userId: { threadId: [...] } }
├── workbridge_notes        → { key: "note text" }
├── workbridge_resumes      → { userId: [resume, ...] }
├── workbridge_user         → Current logged-in user object
├── workbridge_theme        → "light" or "dark"
└── workbridge_seeded       → boolean (seed data loaded?)
```

**Phase 2 (MySQL):** See Database Schema section below.

**Transition Strategy:**
1. Create `assets/js/api.js` with identical function signatures as `store.js`
2. Each function calls `fetch()` to Laravel API instead of `localStorage`
3. Replace imports page-by-page: `import { getJobs } from './store.js'` → `import { getJobs } from './api.js'`
4. No HTML changes needed — only JS import paths change

---

## 5. Database Schema

### Entity Relationship Diagram (Text)

```
users ──────────┬──── seekers (1:1) ──── seeker_skills (1:N)
                │
                ├──── companies (1:1) ──── verification_documents (1:N)
                │                    └──── jobs (1:N) ──── job_tags (1:N)
                │                                    └──── applications (1:N)
                │                                              └──── application_timeline (1:N)
                │
                ├──── saved_jobs (N:M between seekers and jobs)
                ├──── notifications (1:N)
                ├──── messages (sender/recipient)
                ├──── reports (reporter)
                └──── audit_logs (actor)

categories (standalone)
```

### Table Definitions

#### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (bcrypt) |
| role | ENUM('seeker','employer','admin') | NOT NULL |
| email_verified_at | TIMESTAMP | NULLABLE |
| status | ENUM('active','suspended') | DEFAULT 'active' |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### `seekers`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | FK → users.id, UNIQUE |
| location | VARCHAR(255) | NULLABLE |
| country | VARCHAR(100) | NULLABLE |
| phone | VARCHAR(50) | NULLABLE |
| profile_strength | TINYINT | DEFAULT 0 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### `seeker_skills`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK |
| seeker_id | BIGINT UNSIGNED | FK → seekers.id |
| skill | VARCHAR(100) | NOT NULL |

#### `companies`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | FK → users.id, UNIQUE |
| name | VARCHAR(255) | NOT NULL |
| industry | VARCHAR(100) | NULLABLE |
| size | VARCHAR(50) | NULLABLE |
| location | VARCHAR(255) | NULLABLE |
| country | VARCHAR(100) | NULLABLE |
| verified_status | ENUM('Pending','Verified','Rejected') | DEFAULT 'Pending' |
| website | VARCHAR(255) | NULLABLE |
| about | TEXT | NULLABLE |
| logo_path | VARCHAR(255) | NULLABLE |
| contact_email | VARCHAR(255) | NULLABLE |
| contact_phone | VARCHAR(50) | NULLABLE |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### `jobs`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| company_id | BIGINT UNSIGNED | FK → companies.id |
| title | VARCHAR(255) | NOT NULL |
| location | VARCHAR(255) | NOT NULL |
| country | VARCHAR(100) | NULLABLE |
| job_type | ENUM('Full-time','Part-time','Contract','Freelance','Internship') | NOT NULL |
| setup | ENUM('Remote','Hybrid','On-site') | NOT NULL |
| salary_min | INT UNSIGNED | NULLABLE |
| salary_max | INT UNSIGNED | NULLABLE |
| salary_currency | VARCHAR(10) | DEFAULT 'PHP' |
| experience_level | VARCHAR(50) | NULLABLE |
| description | TEXT | NOT NULL |
| requirements | TEXT | NULLABLE |
| benefits | TEXT | NULLABLE |
| status | ENUM('Pending','Active','Rejected','Closed') | DEFAULT 'Pending' |
| posted_at | TIMESTAMP | |
| closed_at | TIMESTAMP | NULLABLE |

**Indexes:** `company_id`, `status`, `location`, `job_type`, `posted_at`

#### `job_tags`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK |
| job_id | BIGINT UNSIGNED | FK → jobs.id |
| tag | VARCHAR(100) | NOT NULL |

#### `applications`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| job_id | BIGINT UNSIGNED | FK → jobs.id |
| seeker_id | BIGINT UNSIGNED | FK → seekers.id |
| status | ENUM('Submitted','Reviewed','Interview','Hired','Rejected') | DEFAULT 'Submitted' |
| notes | TEXT | NULLABLE |
| applied_at | TIMESTAMP | |

**Unique:** (`job_id`, `seeker_id`) — one application per job per seeker

#### `application_timeline`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK |
| application_id | BIGINT UNSIGNED | FK → applications.id |
| event | VARCHAR(100) | NOT NULL |
| note | TEXT | NULLABLE |
| created_at | TIMESTAMP | |

#### `saved_jobs`
| Column | Type | Constraints |
|--------|------|-------------|
| seeker_id | BIGINT UNSIGNED | FK → seekers.id |
| job_id | BIGINT UNSIGNED | FK → jobs.id |
| saved_at | TIMESTAMP | |

**Primary Key:** (`seeker_id`, `job_id`)

#### `categories`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK |
| name | VARCHAR(100) | NOT NULL, UNIQUE |
| slug | VARCHAR(100) | NOT NULL, UNIQUE |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### `reports`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK |
| type | ENUM('Job','User','Company') | NOT NULL |
| target_id | VARCHAR(50) | NOT NULL |
| reason | VARCHAR(255) | NOT NULL |
| severity | ENUM('Low','Medium','High') | NOT NULL |
| status | ENUM('Open','Under Review','Resolved') | DEFAULT 'Open' |
| reporter_id | BIGINT UNSIGNED | FK → users.id |
| resolution_note | TEXT | NULLABLE |
| created_at | TIMESTAMP | |
| resolved_at | TIMESTAMP | NULLABLE |

#### `audit_logs`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK |
| actor_id | BIGINT UNSIGNED | FK → users.id |
| action | VARCHAR(255) | NOT NULL |
| target | VARCHAR(255) | NULLABLE |
| created_at | TIMESTAMP | |

#### `notifications`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK |
| user_id | BIGINT UNSIGNED | FK → users.id |
| title | VARCHAR(255) | NOT NULL |
| message | TEXT | NULLABLE |
| read_at | TIMESTAMP | NULLABLE |
| created_at | TIMESTAMP | |

#### `messages`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK |
| sender_id | BIGINT UNSIGNED | FK → users.id |
| recipient_id | BIGINT UNSIGNED | FK → users.id |
| content | TEXT | NOT NULL |
| read_at | TIMESTAMP | NULLABLE |
| created_at | TIMESTAMP | |

#### `resumes`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK |
| seeker_id | BIGINT UNSIGNED | FK → seekers.id |
| file_path | VARCHAR(255) | NOT NULL |
| original_name | VARCHAR(255) | NOT NULL |
| uploaded_at | TIMESTAMP | |

#### `verification_documents`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK |
| company_id | BIGINT UNSIGNED | FK → companies.id |
| file_path | VARCHAR(255) | NOT NULL |
| uploaded_at | TIMESTAMP | |

---

## 6. Feature Matrix (Final)

These are the **final confirmed features** for WorkBridge PH. Nothing else will be added.

### Core Features (Must Have — All Phases)

| # | Feature | Module | Phase 1 (localStorage) | Phase 2 (Laravel + MySQL) |
|---|---------|--------|----------------------|--------------------------|
| 1 | User registration (seeker/employer) | Auth | Mock — sets current user + adds to store | Real — bcrypt password, creates DB records |
| 2 | User login/logout | Auth | Mock — checks hardcoded + registered accounts | Real — Sanctum token |
| 3 | Role-based access control | All | Client-side route guards | Server middleware + policies |
| 4 | Job posting with preview | Employer | Saves to localStorage | POST /api/jobs |
| 5 | Job editing | Employer | Updates localStorage | PATCH /api/jobs/{id} |
| 6 | Job deletion | Employer | Removes from localStorage | DELETE /api/jobs/{id} |
| 7 | Job search & filter | Public | Client-side filtering | Server-side Eloquent queries |
| 8 | Job detail (tabs: overview, requirements, benefits) | Public | Reads from localStorage | GET /api/jobs/{id} |
| 9 | Apply to job | Seeker | Adds application to localStorage | POST /api/jobs/{id}/apply |
| 10 | Save/unsave jobs | Seeker | localStorage saved_jobs | saved_jobs pivot table |
| 11 | Application tracking with timeline | Seeker | localStorage | application_timeline table |
| 12 | Applicant review (shortlist/interview/reject) | Employer | Updates localStorage | PATCH /api/applications/{id}/status |
| 13 | Seeker profile (name, location, skills) | Seeker | localStorage with persistence | PATCH /api/seeker/profile |
| 14 | Resume upload | Seeker | Simulated (file name only) | Real file upload via Laravel Storage |
| 15 | Company profile management | Employer | localStorage | PATCH /api/companies/{id} |
| 16 | Employer verification submission | Employer | Status display | Document upload + admin review |
| 17 | Admin: employer verification (verify/reject) | Admin | Updates company status | PATCH /api/admin/verifications/{id} |
| 18 | Admin: job moderation (approve/reject) | Admin | Updates job status | PATCH /api/admin/jobs/{id}/status |
| 19 | Admin: user management (view/edit/delete/suspend) | Admin | Updates localStorage | PATCH /api/admin/users/{id} |
| 20 | Admin: reports & resolution | Admin | localStorage | reports table workflow |
| 21 | Admin: analytics dashboard | Admin | Counts from localStorage | Aggregate queries |
| 22 | Admin: category CRUD | Admin | localStorage | categories table |
| 23 | Admin: audit logs | Admin | localStorage | audit_logs table |
| 24 | Notifications | All | localStorage per-user | notifications table |
| 25 | Messages (basic) | Seeker/Employer | localStorage | messages table |
| 26 | Dark mode toggle | All | CSS data-theme attribute | Same (frontend only) |
| 27 | Scam awareness / safety page | Public | Static HTML | Same |
| 28 | Password reset flow | Auth | Simulated | Real email link |
| 29 | Employer applicant notes | Employer | localStorage (notes) | notes column on applications |
| 30 | Seeker application notes | Seeker | localStorage (notes) | notes column on applications |

### Not In Scope

| Feature | Reason |
|---------|--------|
| Payment / payroll integration | Not relevant to job matching platform |
| Video interviews | Complexity beyond course scope |
| AI-powered job matching | Out of scope |
| Native mobile apps | Responsive web is sufficient |
| Multi-language (i18n) | English only |
| Social login (Google, Facebook) | Sanctum email/password is sufficient |
| Real-time WebSocket chat | Polling/refresh messaging is sufficient |

---

## 7. User Roles & Permissions

### Role Matrix

| Action | Guest | Seeker | Employer | Admin |
|--------|-------|--------|----------|-------|
| View jobs / companies | Yes | Yes | Yes | Yes |
| Register / Login | Yes | — | — | — |
| Apply to job | — | Yes | — | — |
| Save / unsave jobs | — | Yes | — | — |
| View own applications | — | Yes | — | — |
| Edit own profile | — | Yes | Yes | — |
| Upload resume | — | Yes | — | — |
| Post job | — | — | Yes | — |
| Edit / delete own jobs | — | — | Yes | — |
| View applicants for own jobs | — | — | Yes | — |
| Update application status | — | — | Yes | — |
| Submit verification documents | — | — | Yes | — |
| Verify / reject employers | — | — | — | Yes |
| Approve / reject jobs | — | — | — | Yes |
| View / suspend users | — | — | — | Yes |
| Manage categories | — | — | — | Yes |
| Resolve reports | — | — | — | Yes |
| View audit logs | — | — | — | Yes |
| View analytics | — | — | — | Yes |

### Authentication Flow

```
Guest visits login.html
  ├── Enters email + password
  ├── Phase 1: mockLogin() checks DEMO_ACCOUNTS + registered users
  │   Phase 2: POST /api/auth/login → Sanctum token
  ├── On success: store user/token → redirect by role
  │   ├── seeker  → /seeker/dashboard.html
  │   ├── employer → /employer/dashboard.html
  │   └── admin   → /admin/dashboard.html
  └── On failure: show error toast
```

### Route Guard Flow

```
User navigates to /seeker/profile.html
  ├── app.js loads → runs checkRouteGuard()
  ├── Path contains "/seeker/" → requires role = "seeker"
  ├── Check: is user logged in?
  │   ├── No → redirect to /auth/login.html?redirect=...
  │   └── Yes → check user.role === "seeker"
  │       ├── No → redirect to /auth/login.html (wrong role)
  │       └── Yes → allow page to load
  └── Page renders layout + content
```

---

## 8. Page Map

### Total Pages: 40

| Module | Count | Pages |
|--------|-------|-------|
| **Public** | 10 | index, jobs, job-detail, companies, company-detail, safety, about, help, terms, privacy |
| **Auth** | 4 | login, register, forgot, reset |
| **Seeker** | 10 | dashboard, jobs, saved-jobs, applications, application-detail, profile, resume, notifications, messages, settings |
| **Employer** | 10 | dashboard, post-job, manage-jobs, job-edit, applicants, applicant-detail, company-profile, verification, messages, settings |
| **Admin** | 13 | dashboard, employer-verification, verification-detail, job-moderation, job-review, reports, report-detail, users, user-detail, analytics, categories, audit-logs, settings |

---

## 9. Data Flow

### Job Posting Flow (Employer → Admin → Public)

```
Employer fills Post Job form
  → Saves job with status = "Pending"
  → Job appears in Admin Job Moderation queue
  → Admin reviews job
    ├── Approve → status = "Active" → appears in public job search
    └── Reject → status = "Rejected" → employer sees rejection
  → Audit log entry created
```

### Application Flow (Seeker → Employer)

```
Seeker views Job Detail
  → Clicks "Apply Now"
  → Application created (status = "Submitted")
  → Timeline entry: "Applied"
  → Employer sees applicant in Applicants list
  → Employer actions:
    ├── Shortlist → status = "Reviewed", timeline: "Shortlisted"
    ├── Interview → status = "Interview", timeline: "Interview Scheduled"
    ├── Reject → status = "Rejected", timeline: "Rejected"
    └── Hire → status = "Hired", timeline: "Offer Accepted"
  → Seeker sees status changes in Applications page
```

### Employer Verification Flow

```
Employer registers
  → Company record created (verified_status = "Pending")
  → Employer uploads verification documents
  → Admin sees in Employer Verification queue
  → Admin reviews:
    ├── Verify → verified_status = "Verified" → badge shown on company
    ├── Reject → verified_status = "Rejected" → reason shown to employer
    └── Suspend → user status = "suspended" → cannot login
  → Audit log entry created
```

---

## 10. Security Design

### Phase 1 (Frontend Only — Demo)

| Concern | Approach |
|---------|----------|
| Auth | Mock login — no real security; demo-grade only |
| Route protection | Client-side guards (can be bypassed — acceptable for demo) |
| Data integrity | localStorage — no multi-user sharing |
| XSS | Must sanitize all `innerHTML` with text escaping utility |
| CSRF | Not applicable (no server) |

### Phase 2 (Laravel Backend — Production)

| Concern | Approach |
|---------|----------|
| Auth | Laravel Sanctum API tokens, bcrypt password hashing |
| Route protection | `auth:sanctum` middleware + custom `EnsureRole` middleware |
| Authorization | Laravel Policies — ownership checks (employer can only edit own jobs) |
| Input validation | Laravel Form Requests — server-side, per-endpoint |
| XSS | Laravel `{{ }}` auto-escaping in Blade; frontend uses `textContent` |
| SQL injection | Eloquent ORM parameterized queries |
| CSRF | Not needed for API token auth (Sanctum handles this) |
| File upload | Validate type + size in Form Request; store outside web root |
| Rate limiting | Laravel `throttle` middleware on auth endpoints |
| CORS | Configured in `config/cors.php` for frontend origin only |
| HTTPS | Required in production |
| Password reset | Laravel signed URL with expiry |

---

## 11. UI/UX Design System

### Framework: Bootstrap 5.3.2 Only

All UI components use Bootstrap 5 classes and utilities. No additional CSS frameworks.

| Component | Implementation |
|-----------|---------------|
| Grid system | Bootstrap `.row`, `.col-*` responsive grid |
| Cards | Bootstrap `.card`, `.card-body`, `.card-header` |
| Forms | Bootstrap `.form-control`, `.form-select`, `.form-label` + custom `.form-input` |
| Buttons | Bootstrap `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-sm` + custom `.btn-ghost` |
| Tables | Bootstrap `.table` with custom dark mode overrides |
| Badges | Custom `.badge-*` classes mapped to status colors |
| Navigation | Custom sidebar + topbar for dashboards; Bootstrap nav for public pages |
| Modals | Custom modal component (`ui.modal.js`) using Bootstrap patterns |
| Toasts | Custom toast component (`ui.toast.js`) |
| Dropdowns | Custom dropdown component (`ui.dropdown.js`) |
| Icons | Bootstrap Icons (`bi-*` classes) |

### Design Tokens (tokens.css)

| Token Category | Examples |
|---------------|----------|
| **Colors** | `--color-accent: #4F46E5` (Indigo), `--color-accent-teal: #0D9488`, `--color-accent-violet: #7C3AED` |
| **Status** | `--color-success: #059669`, `--color-warning: #D97706`, `--color-error: #DC2626` |
| **Spacing** | `--space-xs: 4px` through `--space-2xl: 48px` |
| **Radius** | `--radius-sm: 8px` through `--radius-xl: 16px` |
| **Shadows** | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-card` |
| **Typography** | `--font-sans: system-ui, ...`, sizes from `--text-xs` to `--text-2xl` |
| **Layout** | `--sidebar-width: 260px`, `--topbar-height: 64px` |

### Dark Mode

- Toggled via `data-theme="dark"` attribute on `<html>`
- All tokens override in `[data-theme="dark"]` block
- Persisted in `localStorage` key `workbridge_theme`

### Responsive Breakpoints (Bootstrap default)

| Breakpoint | Size | Usage |
|-----------|------|-------|
| `xs` | <576px | Mobile phones |
| `sm` | ≥576px | Large phones |
| `md` | ≥768px | Tablets |
| `lg` | ≥992px | Desktops — sidebar visible |
| `xl` | ≥1200px | Large desktops |

### Dashboard Layout

```
┌──────────────────────────────────────────┐
│  Topbar (hamburger, title, user menu)    │
├─────────┬────────────────────────────────┤
│         │                                │
│ Sidebar │       Main Content Area        │
│ (260px) │       (.app-content)           │
│         │                                │
│  - Nav  │                                │
│  - Links│                                │
│         │                                │
└─────────┴────────────────────────────────┘

Mobile: Sidebar hidden, opens as drawer overlay
```

---

## 12. Phased Roadmap (Deadline-Aligned)

### Timeline Overview

```
April 16-22 (THIS WEEK)     → Phase 1.5: Fix all bugs, fully functional frontend
April 23 (NEXT WEEK)        → MIDTERM PRESENTATION (demo the system live)
April 24 - May 10           → Phase 2: Laravel backend + MySQL
May 11-15                   → Phase 3: Deploy, get 25 users, feedback forms
May 16+                     → Lobby tarpaulin posting
```

---

### Phase 1.5 — Bug Fixes & Finalization (April 16-22)

**Goal:** Make the frontend prototype fully functional from input to output. Every button, form, and action must work correctly with localStorage.

| # | Bug / Task | File(s) | Priority |
|---|-----------|---------|----------|
| 1 | Registration must persist new users to seekers/companies store | `auth.mock.js`, `register.html` | CRITICAL |
| 2 | Seeker profile edits must save back to localStorage | `seeker/profile.html` | CRITICAL |
| 3 | Employer company profile edits must persist | `employer/company-profile.html` | CRITICAL |
| 4 | Admin user edit/delete must persist to store | `admin-users.js` | CRITICAL |
| 5 | Post Job form: add experience level and tags fields | `employer/post-job.html` | HIGH |
| 6 | XSS sanitization: escape all innerHTML with utility function | All pages with innerHTML | HIGH |
| 7 | Admin verification actions must persist | `admin-verification.js` | HIGH |
| 8 | Newly registered users must be able to login | `auth.mock.js` | CRITICAL |
| 9 | End-to-end flow testing: register → login → use dashboard | All | CRITICAL |

---

### Phase 2 — Backend Integration (April 24 - May 10)

**Goal:** Replace localStorage with Laravel REST API + MySQL. Multi-user support for 25 real users.

#### Week 1 (April 24-30): Foundation
| Task | Details |
|------|---------|
| Install XAMPP + Composer | Local dev environment |
| Create Laravel 11 project | `composer create-project laravel/laravel backend` |
| Configure .env | Database credentials, app URL |
| Create all migrations | 15 tables (see schema above) |
| Create Eloquent models | With relationships |
| Create seeders | Convert data.seed.js to SQL |
| Install Sanctum | `php artisan install:api` |
| Build auth endpoints | register, login, logout, me |

#### Week 2 (May 1-7): API + Frontend Integration
| Task | Details |
|------|---------|
| Build all API endpoints | Jobs, applications, companies, admin, seeker |
| Create Form Requests | Validation for all endpoints |
| Create Policies | Ownership checks |
| Create `api.js` | Replace `store.js` imports |
| Wire all pages to API | Page-by-page migration |
| File upload for resumes | Laravel Storage |
| Test all flows | Register → login → apply → review → hire |

#### Week 3 (May 8-10): Polish
| Task | Details |
|------|---------|
| Fix bugs from testing | |
| Loading states (skeletons) | While API requests load |
| Error handling | 401, 403, 422, 500 responses |
| Final testing | All 3 roles, all flows |

---

### Phase 3 — Deploy & User Testing (May 11-15)

**Goal:** Deploy to hosting, get 25 users, collect feedback.

| Task | Details |
|------|---------|
| Deploy to shared hosting (cPanel) or free tier | Upload Laravel, configure production .env |
| Set up MySQL production database | Run migrations + seed |
| SSL/HTTPS | Let's Encrypt |
| Create user accounts OR open registration | For 25 testers |
| Create Feedback Form / Evaluation Sheet | Google Forms or built-in |
| Distribute to 25 users (IT + other departments) | Collect at least 2 faculty evaluations |
| Collect feedback | Compile results |
| Prepare lobby tarpaulin content | System name, tech stack, screenshots, QR code |

---

### Phase 4 — Lobby Posting (May 16+)

**Tarpaulin Content:**
- System name: **WorkBridge PH**
- Subtitle: Web-Based Unified Employment Platform for Decent Work Access
- Screenshots of key pages
- Tech stack: HTML5, CSS3, JavaScript, Bootstrap 5, PHP 8.2, Laravel 11, MySQL 8.0
- SDG alignment: SDG 8, SDG 1, SDG 10
- QR code to live system URL
- Group 4 members

---

## 13. Deployment Architecture

### Development (Local)

```
XAMPP (Windows)
├── Apache → serves Laravel from backend/public/
├── MySQL 8.0 → local database
├── PHP 8.2 → Laravel runtime
└── Frontend HTML files → served from Employment/ directory
```

### Production

```
Shared Hosting (cPanel) or VPS
├── Apache/Nginx → serves Laravel from public/
├── MySQL 8.0 → production database
├── PHP 8.2+ → Laravel runtime
├── SSL/HTTPS → Let's Encrypt
├── Frontend files → deployed alongside Laravel in public/
└── Laravel Storage → resumes, documents in storage/app/public/
```

### Deployment Checklist

```
□ APP_ENV=production
□ APP_DEBUG=false
□ APP_URL=https://yourdomain.com
□ DB credentials set
□ php artisan migrate --force
□ php artisan db:seed
□ php artisan storage:link
□ php artisan config:cache
□ php artisan route:cache
□ HTTPS enabled
□ Daily MySQL backups configured
```

---

## Document History

| Date | Change |
|------|--------|
| 2026-04-16 | Initial system architecture document created |

---

*This is the definitive architecture document for WorkBridge PH. All development decisions should align with this document.*
