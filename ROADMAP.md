# WorkBridge PH — Project Roadmap & Progress Tracking

**Web-Based Unified Employment Platform for Decent Work Access**
*Group 4 Capstone Project*

---

## Overview

This document tracks the full development roadmap of WorkBridge PH from prototype to production-ready platform. Progress is updated as each milestone is completed.

**Current Phase:** Phase 1.5 — Bug Fixes & Finalization
**Overall Progress:** Phase 1 Complete · Phase 1.5 In Progress · Phase 2 Not Started

### Real Deadlines

| Deadline | Requirement |
|----------|-------------|
| **April 22, 2026** | Fully functional system (frontend, all flows working) |
| **April 23, 2026** | **MIDTERM PRESENTATION** — live demo of system |
| **May 10, 2026** | Laravel + MySQL backend complete, deployed |
| **May 15, 2026** | 25 users tested, feedback collected, 2 faculty evaluations |
| **May 16+, 2026** | Lobby tarpaulin posting |

### Platform Scope

WorkBridge PH is **globally accessible** via the internet. While it originates from a Philippine context and uses it as the primary case study, it addresses worldwide problems aligned with **SDG 8 (Decent Work), SDG 1 (No Poverty), and SDG 10 (Reduced Inequalities)** — all of which are global in nature. The platform is open to job seekers and employers from any country.

**Architectural implications of global scope:**
- Location fields are free-text and not restricted to Philippine geography
- Currency must be flexible per job posting (default PHP ₱ for PH-origin listings)
- Phone numbers must support international format (+country code)
- All timestamps stored in UTC
- Employer verification accepts documents from any country

---

## Phase Summary

| Phase | Name | Status | Deadline | Description |
|-------|------|--------|----------|-------------|
| **1** | Frontend Prototype | ✅ Complete | Done | All UI pages built; localStorage mock backend |
| **1.5** | Bug Fixes & Finalization | 🚧 In Progress | April 22 | Fix all bugs, make fully functional for midterm |
| **2** | Backend Integration | 🔲 Not Started | May 10 | Laravel + MySQL API, replace localStorage |
| **3** | Deploy & User Testing | 🔲 Not Started | May 15 | Deploy, 25 users, feedback forms, faculty eval |
| **4** | Lobby Posting | 🔲 Not Started | May 16+ | Tarpaulin with system info, tech stack, QR code |

---

## Phase 1 — Frontend Prototype

**Goal:** Build a complete, navigable HTML/CSS/JS prototype covering all pages defined in the proposal.
**Status:** ✅ Complete

### Public Pages

| Task | Status | File |
|------|--------|------|
| Landing page — hero search, featured jobs, categories | ✅ Done | `index.html` |
| Browse Jobs — search, filters, sort, pagination | ✅ Done | `jobs.html` |
| Job Detail — tabs, apply/save, company info | ✅ Done | `job-detail.html` |
| Company Directory — search, verified filter | ✅ Done | `companies.html` |
| Company Detail — info, open jobs | ✅ Done | `company-detail.html` |
| Safety & Scam Awareness page | ✅ Done | `safety.html` |
| About page | ✅ Done | `about.html` |
| Help / FAQ page | ✅ Done | `help.html` |
| Terms of Service | ✅ Done | `terms.html` |
| Privacy Policy | ✅ Done | `privacy.html` |
| Dedicated public Job Categories page (white/blue-collar, household) | ⚠️ Partial | Homepage section only — no standalone page |

### Authentication

| Task | Status | File |
|------|--------|------|
| Login page with demo accounts | ✅ Done | `auth/login.html` |
| Registration with role selection (Seeker / Employer) | ✅ Done | `auth/register.html` |
| Forgot password flow | ✅ Done | `auth/forgot.html` |
| Password reset flow | ✅ Done | `auth/reset.html` |
| Role-based route guards | ✅ Done | `assets/js/router.js` |
| Mock authentication logic | ✅ Done | `assets/js/auth.mock.js` |

### Job Seeker Dashboard

| Task | Status | File |
|------|--------|------|
| Seeker dashboard — stats, recommended jobs | ✅ Done | `seeker/dashboard.html` |
| Browse jobs with save/apply | ✅ Done | `seeker/jobs.html` |
| Saved jobs management | ✅ Done | `seeker/saved-jobs.html` |
| Applications list — filter by status | ✅ Done | `seeker/applications.html` |
| Application detail — timeline, notes | ✅ Done | `seeker/application-detail.html` |
| Profile page — editable sections, strength indicator | ✅ Done | `seeker/profile.html` |
| Resume management — upload simulation | ✅ Done | `seeker/resume.html` |
| Notifications | ✅ Done | `seeker/notifications.html` |
| Messages (simulated) | ✅ Done | `seeker/messages.html` |
| Settings | ✅ Done | `seeker/settings.html` |

### Employer Dashboard

| Task | Status | File |
|------|--------|------|
| Employer dashboard — KPIs, charts | ✅ Done | `employer/dashboard.html` |
| Post a job — form with validation and preview | ✅ Done | `employer/post-job.html` |
| Manage jobs — table, edit, close | ✅ Done | `employer/manage-jobs.html` |
| Edit job listing | ✅ Done | `employer/job-edit.html` |
| Applicants list per job | ✅ Done | `employer/applicants.html` |
| Applicant detail — resume, notes, actions | ✅ Done | `employer/applicant-detail.html` |
| Company profile management | ✅ Done | `employer/company-profile.html` |
| Employer verification submission | ✅ Done | `employer/verification.html` |
| Messages | ✅ Done | `employer/messages.html` |
| Settings | ✅ Done | `employer/settings.html` |

### Admin Dashboard

| Task | Status | File |
|------|--------|------|
| Admin dashboard — pending queue overview | ✅ Done | `admin/dashboard.html` |
| Employer verification list | ✅ Done | `admin/employer-verification.html` |
| Verification detail — verify/reject/suspend | ✅ Done | `admin/verification-detail.html` |
| Job moderation list | ✅ Done | `admin/job-moderation.html` |
| Job review — split view, approve/reject | ✅ Done | `admin/job-review.html` |
| Reports list | ✅ Done | `admin/reports.html` |
| Report detail — resolution workflow | ✅ Done | `admin/report-detail.html` |
| Users list — search, view, suspend | ✅ Done | `admin/users.html` |
| User detail | ✅ Done | `admin/user-detail.html` |
| Analytics — charts, top categories/locations | ✅ Done | `admin/analytics.html` |
| Job categories CRUD | ✅ Done | `admin/categories.html` |
| Audit logs — filter by action and date | ✅ Done | `admin/audit-logs.html` |
| Admin settings | ✅ Done | `admin/settings.html` |

### Core Infrastructure

| Task | Status | File |
|------|--------|------|
| Design token system (CSS variables) | ✅ Done | `assets/css/tokens.css` |
| Base and component styles | ✅ Done | `assets/css/base.css`, `components.css` |
| Dark mode support | ✅ Done | `tokens.css` — `data-theme` attribute |
| localStorage data store | ✅ Done | `assets/js/store.js` |
| Mock seed data (24 jobs, 10 companies, etc.) | ✅ Done | `assets/js/data.seed.js` |
| Client-side router with route guards | ✅ Done | `assets/js/router.js` |
| Reusable UI components (modal, toast, dropdown, table) | ✅ Done | `assets/js/ui.*.js` |
| Playwright e2e test setup | ✅ Done | `tests/` |

### Phase 1 Gaps (Carried to Phase 2 or 3)

| Gap | Reason | Target Phase |
|-----|--------|-------------|
| Dedicated public Job Categories page | Not prioritized in prototype | Phase 2 |
| Employment & livelihood guidance materials | Content not yet created | Phase 2 |
| Real geolocation-based filtering | Requires backend/API | Phase 3 |
| Actual file upload (resume, company docs) | Requires server storage | Phase 2 |

---

## Phase 2 — Backend Integration (Laravel + MySQL)

**Goal:** Replace `localStorage` with a Laravel REST API backed by MySQL. The frontend HTML pages remain; `store.js` is replaced by `api.js` that calls Laravel endpoints via `fetch()`.
**Stack:** PHP 8.2+, Laravel 11.x, Laravel Sanctum, Eloquent ORM, MySQL 8.0+
**Status:** 🔲 Not Started

---

### 2.1 — Environment Setup

| Task | Status | Notes |
|------|--------|-------|
| Install XAMPP (Apache + MySQL 8.0 + PHP 8.2) | 🔲 Todo | Primary local dev environment on Windows |
| Install Composer (PHP dependency manager) | 🔲 Todo | Required to create Laravel project |
| Create Laravel 11 project inside repo | 🔲 Todo | `composer create-project laravel/laravel backend` |
| Install Laravel Sanctum | 🔲 Todo | `php artisan install:api` — API token authentication |
| Configure `.env` — database credentials, app URL | 🔲 Todo | Never commit `.env` to version control |
| Configure Apache virtual host for Laravel | 🔲 Todo | Point document root to `backend/public/` |
| Enable CORS for frontend origin | 🔲 Todo | Configure `config/cors.php` in Laravel |
| Verify `php artisan serve` runs without errors | 🔲 Todo | |

---

### 2.2 — Database Schema & Migrations

| Task | Status | Notes |
|------|--------|-------|
| Design final MySQL schema | 🔲 Todo | See schema below |
| Create migration: `users` | 🔲 Todo | id, name, email, password, role, email_verified_at, created_at |
| Create migration: `seekers` | 🔲 Todo | user_id (FK), location, country, phone, profile_strength |
| Create migration: `seeker_skills` | 🔲 Todo | seeker_id (FK), skill — pivot-style |
| Create migration: `companies` | 🔲 Todo | id, user_id (FK), name, industry, size, location, country, verified_status, website, about, logo_path, created_at |
| Create migration: `company_contacts` | 🔲 Todo | company_id (FK), email, phone |
| Create migration: `jobs` | 🔲 Todo | id, company_id (FK), title, location, country, job_type, setup, salary_min, salary_max, salary_currency, experience_level, description, requirements, benefits, status, posted_at, closed_at |
| Create migration: `job_tags` | 🔲 Todo | job_id (FK), tag |
| Create migration: `applications` | 🔲 Todo | id, job_id (FK), seeker_id (FK), status, notes, applied_at |
| Create migration: `application_timeline` | 🔲 Todo | id, application_id (FK), event, note, created_at |
| Create migration: `saved_jobs` | 🔲 Todo | seeker_id (FK), job_id (FK), saved_at — composite PK |
| Create migration: `categories` | 🔲 Todo | id, name, icon, created_at |
| Create migration: `reports` | 🔲 Todo | id, type, target_id, reason, severity, status, reporter_id (FK), resolution_note, created_at, resolved_at |
| Create migration: `audit_logs` | 🔲 Todo | id, actor_id (FK), action, target_id, created_at |
| Create migration: `notifications` | 🔲 Todo | id, user_id (FK), title, message, read_at, created_at |
| Create migration: `messages` | 🔲 Todo | id, sender_id (FK), recipient_id (FK), content, read_at, created_at |
| Create migration: `resumes` | 🔲 Todo | id, seeker_id (FK), file_path, original_name, uploaded_at |
| Create migration: `verification_documents` | 🔲 Todo | id, company_id (FK), file_path, uploaded_at |
| Add DB indexes on frequently filtered columns | 🔲 Todo | `status`, `location`, `job_type`, `company_id`, `seeker_id` |
| Run all migrations: `php artisan migrate` | 🔲 Todo | |

---

### 2.3 — Eloquent Models

| Task | Status | Notes |
|------|--------|-------|
| `User` model — roles, relationships to Seeker/Company | 🔲 Todo | |
| `Seeker` model — belongs to User, has many skills, applications | 🔲 Todo | |
| `Company` model — belongs to User, has many jobs | 🔲 Todo | |
| `Job` model — belongs to Company, has many applications, tags | 🔲 Todo | |
| `Application` model — belongs to Job and Seeker, has many timeline events | 🔲 Todo | |
| `Category` model | 🔲 Todo | |
| `Report` model | 🔲 Todo | |
| `AuditLog` model | 🔲 Todo | |
| `Notification` model | 🔲 Todo | |
| `Message` model | 🔲 Todo | |
| `Resume` model | 🔲 Todo | |

---

### 2.4 — Seeders

| Task | Status | Notes |
|------|--------|-------|
| Convert `data.seed.js` categories to `CategorySeeder` | 🔲 Todo | 7 categories |
| Convert `data.seed.js` companies to `CompanySeeder` | 🔲 Todo | 10 companies |
| Convert `data.seed.js` users/seekers to `UserSeeder` | 🔲 Todo | 8 seekers + demo accounts |
| Convert `data.seed.js` jobs to `JobSeeder` | 🔲 Todo | 24 jobs with tags and experience levels |
| Convert `data.seed.js` applications to `ApplicationSeeder` | 🔲 Todo | 12 applications with timelines |
| Convert `data.seed.js` reports to `ReportSeeder` | 🔲 Todo | 8 reports |
| Convert `data.seed.js` audit logs to `AuditLogSeeder` | 🔲 Todo | 20 logs |
| Hash all seeded passwords with `bcrypt` | 🔲 Todo | `Hash::make('demo123')` |
| Run: `php artisan db:seed` | 🔲 Todo | |

---

### 2.5 — Authentication (Laravel Sanctum)

| Task | Status | Notes |
|------|--------|-------|
| `POST /api/auth/register` — create user, issue token | 🔲 Todo | Hash password; create Seeker or Company record by role |
| `POST /api/auth/login` — validate credentials, issue token | 🔲 Todo | Return token + user object |
| `POST /api/auth/logout` — revoke current token | 🔲 Todo | `$request->user()->currentAccessToken()->delete()` |
| `GET /api/auth/me` — return authenticated user | 🔲 Todo | Used by frontend to restore session |
| `POST /api/auth/forgot-password` — send reset link | 🔲 Todo | Laravel built-in password broker |
| `POST /api/auth/reset-password` — apply new password | 🔲 Todo | |
| `POST /api/auth/verify-email` — confirm email address | 🔲 Todo | |
| Sanctum middleware on all protected routes | 🔲 Todo | `auth:sanctum` middleware group |
| Role middleware — `EnsureRole` — blocks wrong-role access | 🔲 Todo | Custom middleware: checks `user->role` |

---

### 2.6 — API Endpoints (Controllers)

#### Auth
| Endpoint | Method | Middleware | Status |
|----------|--------|-----------|--------|
| `/api/auth/register` | POST | — | 🔲 Todo |
| `/api/auth/login` | POST | — | 🔲 Todo |
| `/api/auth/logout` | POST | `auth:sanctum` | 🔲 Todo |
| `/api/auth/me` | GET | `auth:sanctum` | 🔲 Todo |
| `/api/auth/forgot-password` | POST | — | 🔲 Todo |
| `/api/auth/reset-password` | POST | — | 🔲 Todo |

#### Jobs
| Endpoint | Method | Middleware | Status |
|----------|--------|-----------|--------|
| `/api/jobs` | GET | — | 🔲 Todo |
| `/api/jobs/{id}` | GET | — | 🔲 Todo |
| `/api/jobs` | POST | `auth:sanctum`, `role:employer` | 🔲 Todo |
| `/api/jobs/{id}` | PATCH | `auth:sanctum`, `role:employer`, owns job | 🔲 Todo |
| `/api/jobs/{id}` | DELETE | `auth:sanctum`, `role:employer`, owns job | 🔲 Todo |
| `/api/jobs/{id}/apply` | POST | `auth:sanctum`, `role:seeker` | 🔲 Todo |

#### Companies
| Endpoint | Method | Middleware | Status |
|----------|--------|-----------|--------|
| `/api/companies` | GET | — | 🔲 Todo |
| `/api/companies/{id}` | GET | — | 🔲 Todo |
| `/api/companies/{id}` | PATCH | `auth:sanctum`, `role:employer`, owns company | 🔲 Todo |

#### Applications
| Endpoint | Method | Middleware | Status |
|----------|--------|-----------|--------|
| `/api/applications` | GET | `auth:sanctum` | 🔲 Todo |
| `/api/applications/{id}` | GET | `auth:sanctum`, owns application | 🔲 Todo |
| `/api/applications/{id}/status` | PATCH | `auth:sanctum`, `role:employer` | 🔲 Todo |

#### Seeker
| Endpoint | Method | Middleware | Status |
|----------|--------|-----------|--------|
| `/api/seeker/profile` | GET | `auth:sanctum`, `role:seeker` | 🔲 Todo |
| `/api/seeker/profile` | PATCH | `auth:sanctum`, `role:seeker` | 🔲 Todo |
| `/api/seeker/saved-jobs` | GET | `auth:sanctum`, `role:seeker` | 🔲 Todo |
| `/api/seeker/saved-jobs/{jobId}` | POST | `auth:sanctum`, `role:seeker` | 🔲 Todo |
| `/api/seeker/saved-jobs/{jobId}` | DELETE | `auth:sanctum`, `role:seeker` | 🔲 Todo |
| `/api/seeker/resumes` | GET | `auth:sanctum`, `role:seeker` | 🔲 Todo |
| `/api/seeker/resumes` | POST | `auth:sanctum`, `role:seeker` | 🔲 Todo |

#### Admin
| Endpoint | Method | Middleware | Status |
|----------|--------|-----------|--------|
| `/api/admin/users` | GET | `auth:sanctum`, `role:admin` | 🔲 Todo |
| `/api/admin/users/{id}` | PATCH | `auth:sanctum`, `role:admin` | 🔲 Todo |
| `/api/admin/verifications` | GET | `auth:sanctum`, `role:admin` | 🔲 Todo |
| `/api/admin/verifications/{id}` | PATCH | `auth:sanctum`, `role:admin` | 🔲 Todo |
| `/api/admin/jobs` | GET | `auth:sanctum`, `role:admin` | 🔲 Todo |
| `/api/admin/jobs/{id}/status` | PATCH | `auth:sanctum`, `role:admin` | 🔲 Todo |
| `/api/admin/reports` | GET | `auth:sanctum`, `role:admin` | 🔲 Todo |
| `/api/admin/reports/{id}` | PATCH | `auth:sanctum`, `role:admin` | 🔲 Todo |
| `/api/admin/analytics` | GET | `auth:sanctum`, `role:admin` | 🔲 Todo |
| `/api/admin/audit-logs` | GET | `auth:sanctum`, `role:admin` | 🔲 Todo |
| `/api/admin/categories` | GET/POST/PATCH/DELETE | `auth:sanctum`, `role:admin` | 🔲 Todo |

#### Shared
| Endpoint | Method | Middleware | Status |
|----------|--------|-----------|--------|
| `/api/notifications` | GET | `auth:sanctum` | 🔲 Todo |
| `/api/notifications/{id}/read` | PATCH | `auth:sanctum` | 🔲 Todo |
| `/api/messages` | GET | `auth:sanctum` | 🔲 Todo |
| `/api/messages` | POST | `auth:sanctum` | 🔲 Todo |
| `/api/reports` | POST | `auth:sanctum` | 🔲 Todo |

---

### 2.7 — Validation (Laravel Form Requests)

| Task | Status | Notes |
|------|--------|-------|
| `RegisterRequest` — email unique, password min 8, role enum | 🔲 Todo | |
| `LoginRequest` — email format, password required | 🔲 Todo | |
| `PostJobRequest` — title, type, setup, location, salary range, description required | 🔲 Todo | |
| `UpdateProfileRequest` — name, location, skills array | 🔲 Todo | |
| `UpdateApplicationStatusRequest` — status enum validation | 🔲 Todo | |
| `ReportRequest` — type, target_id, reason, severity required | 🔲 Todo | |
| `UploadResumeRequest` — file type (pdf/doc/docx), max 5MB | 🔲 Todo | |
| Consistent JSON error response format for all 422 errors | 🔲 Todo | `{ ok: false, errors: { field: [msg] } }` |

---

### 2.8 — Authorization (Laravel Policies)

| Task | Status | Notes |
|------|--------|-------|
| `JobPolicy` — employer can only edit/delete their own jobs | 🔲 Todo | |
| `ApplicationPolicy` — seeker views own; employer views apps for their jobs | 🔲 Todo | |
| `CompanyPolicy` — employer can only update their own company | 🔲 Todo | |
| `UserPolicy` — admin can suspend; user can edit own profile | 🔲 Todo | |
| Register all policies in `AuthServiceProvider` | 🔲 Todo | |

---

### 2.9 — File Uploads (Laravel Storage)

| Task | Status | Notes |
|------|--------|-------|
| Configure `storage/app/public` disk | 🔲 Todo | `php artisan storage:link` |
| Resume upload — validate PDF/DOC/DOCX, max 5MB, store in `resumes/{userId}/` | 🔲 Todo | |
| Company verification document upload — store in `verification/{companyId}/` | 🔲 Todo | |
| Company logo upload — validate image types, max 2MB | 🔲 Todo | |
| Return public URL in API response for frontend display | 🔲 Todo | |

---

### 2.10 — Audit Logging (Laravel Events)

| Task | Status | Notes |
|------|--------|-------|
| Create `AuditableAction` event | 🔲 Todo | Dispatched by admin controllers on every action |
| Create `LogAuditAction` listener | 🔲 Todo | Writes to `audit_logs` table |
| Register event/listener in `EventServiceProvider` | 🔲 Todo | |
| Dispatch event on: verify employer, reject employer, approve job, reject job, suspend user, resolve report | 🔲 Todo | |

---

### 2.11 — Frontend Integration (api.js)

| Task | Status | Notes |
|------|--------|-------|
| Create `assets/js/api.js` — thin `fetch()` wrapper | 🔲 Todo | Replaces `store.js`; handles token headers and errors |
| Store Sanctum token in `localStorage` on login | 🔲 Todo | Key: `workbridge_token` |
| Attach `Authorization: Bearer {token}` to all protected requests | 🔲 Todo | |
| Handle 401 Unauthorized — redirect to login | 🔲 Todo | |
| Handle 403 Forbidden — show permission error toast | 🔲 Todo | |
| Handle 422 Validation errors — display field errors | 🔲 Todo | |
| Handle 500 Server errors — show generic error toast | 🔲 Todo | |
| Replace all `getJobs()` → `api.get('/jobs')` calls page by page | 🔲 Todo | |
| Replace all `setJobs()` → `api.post('/jobs', data)` calls | 🔲 Todo | |
| Add loading skeleton states while API requests are in-flight | 🔲 Todo | |
| Fix XSS — replace all unsafe `innerHTML` with escaped rendering | ✅ Done | Completed in Phase 1.5 — `esc()` utility applied to all 13+ files |

---

### 2.12 — Proposal Gap Fixes (Phase 2)

| Task | Status | Notes |
|------|--------|-------|
| Create dedicated public Job Categories page (`categories.html`) | 🔲 Todo | White-collar, blue-collar, household/service — from proposal |
| Add Employment & Livelihood Guidance section | 🔲 Todo | Expand `help.html` or new `guidance.html` page |
| Fix seeker profile persistence (data not saved bug) | ✅ Done | Fixed in Phase 1.5 — profile writes back to localStorage |
| Fix registration — create Seeker/Company record in DB | ✅ Done | Fixed in Phase 1.5 — auth.mock.js creates seeker/company on register |
| Fix admin actions — persist verify/reject/suspend to DB | ✅ Done | Fixed in Phase 1.5 — all admin actions write to store + audit log |
| Fix job experience level and tags — add fields to Post Job form | ✅ Done | Fixed in Phase 1.5 — experience dropdown + tags input added |

---

## Phase 3 — Advanced Features

**Goal:** Enhance the platform with real-time capabilities and smart matching.
**Status:** 🔲 Not Started

| Feature | Status | Notes |
|---------|--------|-------|
| Real-time messaging (WebSockets or polling) | 🔲 Todo | Replace simulated messages |
| Email notifications (job matches, application updates) | 🔲 Todo | SMTP integration |
| Geolocation-based job search | 🔲 Todo | Browser Geolocation API + server-side distance filtering |
| Skill-based job matching algorithm | 🔲 Todo | Match seeker skills to job requirements |
| Job alert subscriptions | 🔲 Todo | Notify seekers of new matching jobs |
| Advanced resume builder | 🔲 Todo | Replace upload-only simulation |
| Employer analytics dashboard (real data) | 🔲 Todo | Charts driven by actual application data |
| Social sharing for job listings | 🔲 Todo | |
| Mobile responsive improvements | 🔲 Todo | Test and refine on actual mobile devices |

---

## Phase 4 — Testing & Quality Assurance

**Goal:** Ensure the platform is reliable, accessible, and secure.
**Stack:** PHPUnit (via Laravel), Laravel HTTP Tests, Playwright
**Status:** 🔲 Not Started

### Backend Tests (PHPUnit / Laravel)

| Task | Status | Notes |
|------|--------|-------|
| Unit tests for Eloquent models — relationships, scopes | 🔲 Todo | `php artisan make:test --unit` |
| Feature test: `POST /api/auth/register` | 🔲 Todo | Valid and invalid inputs |
| Feature test: `POST /api/auth/login` | 🔲 Todo | Correct credentials, wrong credentials |
| Feature test: `GET /api/jobs` — pagination, filters | 🔲 Todo | |
| Feature test: `POST /api/jobs` — employer only | 🔲 Todo | Auth, role enforcement |
| Feature test: job ownership — employer can't edit another's job | 🔲 Todo | Policy test |
| Feature test: `POST /api/jobs/{id}/apply` — seeker only | 🔲 Todo | |
| Feature test: admin endpoints — non-admin gets 403 | 🔲 Todo | |
| Feature test: file upload validation | 🔲 Todo | Wrong type, over size limit |
| Run all backend tests: `php artisan test` | 🔲 Todo | |

### Frontend E2E Tests (Playwright)

| Task | Status | Notes |
|------|--------|-------|
| Expand existing test: landing page, jobs, companies | 🔲 Todo | Existing tests cover this |
| Test: register as seeker → login → apply to job | 🔲 Todo | Full seeker flow |
| Test: register as employer → post job → view applicant | 🔲 Todo | Full employer flow |
| Test: admin login → verify employer → check audit log | 🔲 Todo | Full admin flow |
| Test: save job → view saved jobs → unsave | 🔲 Todo | |
| Test: search jobs by keyword and location | 🔲 Todo | |
| Test: profile edit persists after page refresh | 🔲 Todo | |
| Test: unauthorized access redirects to login | 🔲 Todo | Existing test covers this |
| Test: wrong role redirects correctly | 🔲 Todo | |

### Quality Checks

| Task | Status | Notes |
|------|--------|-------|
| Accessibility audit (WCAG 2.1 AA) | 🔲 Todo | Screen reader and keyboard navigation |
| Cross-browser testing | 🔲 Todo | Chrome, Firefox, Edge, Safari |
| Mobile device testing | 🔲 Todo | iOS Safari, Android Chrome |
| Performance audit (Lighthouse) | 🔲 Todo | Target 90+ score |
| Security audit — SQL injection, XSS, CSRF | 🔲 Todo | Laravel CSRF tokens on all forms |
| Load testing — concurrent users | 🔲 Todo | |

---

## Phase 5 — Deployment & Launch

**Goal:** Deploy WorkBridge PH to a production environment running PHP 8.2+, Laravel 11, and MySQL 8.0.
**Status:** 🔲 Not Started

| Task | Status | Notes |
|------|--------|-------|
| Choose hosting — shared hosting (cPanel) or VPS | 🔲 Todo | cPanel hosts with PHP 8.2 + MySQL are affordable and globally available |
| Register domain (e.g., `workbridgeph.com`) | 🔲 Todo | |
| Upload Laravel project — point document root to `public/` | 🔲 Todo | |
| Create production MySQL database and user | 🔲 Todo | |
| Set production `.env` — `APP_ENV=production`, `APP_DEBUG=false` | 🔲 Todo | Never commit `.env` to version control |
| Run `php artisan migrate --force` on production | 🔲 Todo | |
| Run `php artisan db:seed` with demo/initial data | 🔲 Todo | |
| Run `php artisan storage:link` for file storage | 🔲 Todo | |
| Run `php artisan config:cache && php artisan route:cache` | 🔲 Todo | Performance optimization |
| Set up SSL/HTTPS | 🔲 Todo | Let's Encrypt via hosting panel or Certbot |
| Configure daily MySQL backups | 🔲 Todo | Automated via cPanel or cron |
| Set up error logging | 🔲 Todo | Laravel Log channel; optionally Sentry |
| Soft launch — test all flows with real accounts | 🔲 Todo | |
| Public launch | 🔲 Todo | |

---

## Known Gaps vs. Proposal

The following items from the project proposal are not yet fully implemented:

| Proposal Item | Current State | Plan |
|--------------|---------------|------|
| Dedicated public Job Categories page (white/blue-collar, household/service) | Homepage has category section only | Add standalone `/categories.html` in Phase 2 |
| Employment and livelihood guidance materials | Covered partially in `help.html` | Expand in Phase 2 |
| Real location-based job opportunities | UI filter exists, no real geolocation | Implement in Phase 3 |
| Actual file storage (resumes, company docs) | Simulated only | Phase 2 file upload with server storage |
| Real email notifications | Not implemented | Phase 3 |
| Real-time messaging | Simulated in localStorage | Phase 3 WebSocket or polling |

---

## Progress Log

| Date | Milestone | Notes |
|------|-----------|-------|
| 2026-04-04 | Phase 1 Complete | All UI pages built and functional with localStorage mock backend |
| 2026-04-16 | Phase 1.5 QA Round 1 | Fixed: employer profile edit, apply confirmation + skill/resume check, navigation context for logged-in users, dark mode readability |
| 2026-04-16 | Phase 1.5 QA Round 2 | Fixed: resume toast error, verification suspend status, saved-jobs re-render, settings validation, dark mode toggle lag, seeded demo resumes, upgraded messages to functional chat UI |
| 2026-04-16 | Phase 1.5 XSS Hardening | Applied `esc()` utility across all 13+ files with dynamic innerHTML |
| 2026-04-17 | Phase 2 Start | Backend integration — Laravel 11 + MySQL 8.0 |

---

## How to Update This Document

When a task is completed:
1. Change `🔲 Todo` → `✅ Done`
2. Add an entry to the **Progress Log** with the date and milestone
3. Update the **Phase Summary** table at the top if a full phase is complete

Status key:
- ✅ Done — Completed and verified
- ⚠️ Partial — Started but not complete or has known gaps
- 🔲 Todo — Not yet started
- 🚧 In Progress — Currently being worked on
- ❌ Blocked — Cannot proceed; waiting on dependency
