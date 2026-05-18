/**
 * WorkBridge PH — Sample Data Seed
 */

import { set, get, STORAGE_KEYS } from './store.js';

const CITIES = ['Manila', 'Cebu City', 'Davao', 'Iloilo', 'Baguio', 'Cagayan de Oro', 'Bacolod', 'General Santos', 'Makati', 'Quezon City', 'Pasig', 'Taguig'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
const SETUPS = ['Remote', 'Hybrid', 'On-site'];
const INDUSTRIES = ['Technology', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Finance', 'Hospitality', 'Construction', 'Household'];
const EXPERIENCE = ['Entry level', '1-2 years', '3-5 years', '5+ years'];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function id() {
  return 'id' + Math.random().toString(36).slice(2, 11);
}

function daysAgo(d) {
  const d2 = new Date();
  d2.setDate(d2.getDate() - d);
  return d2.toISOString();
}

export function seedCompanies() {
  const names = [
    'XYZ Enterprises', 'Home Helper Services', 'ABC Corp', 'TechFlow Solutions',
    'Manila Care Inc', 'Cebu Digital Labs', 'Davao Build Co', 'Iloilo Education Hub',
    'Baguio Health Center', 'Sunrise Retail PH'
  ];
  return names.map((name, i) => ({
    id: 'c' + (i + 1),
    name,
    industry: rand(INDUSTRIES),
    size: rand(['1-10', '11-50', '51-200', '201-500']),
    location: rand(CITIES),
    verifiedStatus: i < 6 ? 'Verified' : i < 8 ? 'Pending' : 'Rejected',
    website: `https://${name.toLowerCase().replace(/\s/g, '')}.ph`,
    about: `${name} is a leading company in ${rand(INDUSTRIES)} serving the Philippines. We are committed to providing quality employment opportunities.`,
    logo: null,
    proofUrl: i < 3 ? '/assets/img/placeholders/proof.pdf' : null,
    contacts: { email: `contact@${name.toLowerCase().replace(/\s/g, '')}.ph`, phone: '+63 2 1234 5678' },
    registrationDate: daysAgo(30 + i * 5),
  }));
}

export function seedJobs(companies) {
  const titles = [
    'Software Developer', 'Customer Service Representative', 'Marketing Specialist', 'Data Analyst',
    'Sales Associate', 'Admin Assistant', 'Graphic Designer', 'HR Officer', 'Accountant',
    'Nurse', 'Teacher', 'Driver', 'Cleaner', 'Cashier', 'Roofer', 'Electrician',
    'Content Writer', 'SEO Specialist', 'Project Manager', 'Quality Assurance Tester'
  ];
  const jobs = [];
  for (let i = 0; i < 24; i++) {
    const co = companies[i % companies.length];
    jobs.push({
      id: 'j' + (i + 1),
      title: titles[i % titles.length],
      companyId: co.id,
      location: rand(CITIES),
      type: rand(JOB_TYPES),
      setup: rand(SETUPS),
      salaryMin: 15000 + Math.floor(Math.random() * 30000),
      salaryMax: 25000 + Math.floor(Math.random() * 50000),
      experience: rand(EXPERIENCE),
      postedAt: daysAgo(Math.floor(Math.random() * 30)),
      tags: ['PHP', 'JavaScript', 'Communication', 'Teamwork'].slice(0, 2 + Math.floor(Math.random() * 2)),
      description: 'We are looking for a motivated professional to join our team. You will be responsible for key deliverables and collaborating with stakeholders.',
      requirements: 'Bachelor\'s degree or equivalent experience. Strong communication skills. Willing to work in ' + rand(CITIES) + '.',
      benefits: 'HMO, 13th month pay, Performance bonus',
      status: i < 18 ? 'Active' : i < 21 ? 'Pending' : 'Closed',
      flaggedReasons: i === 5 ? ['Suspicious salary'] : [],
    });
  }
  return jobs;
}

export function seedSeekers() {
  const names = ['Juan Dela Cruz', 'Maria Santos', 'Pedro Reyes', 'Ana Garcia', 'Jose Martinez', 'Liza Fernandez', 'Carlos Lopez', 'Rosa Tan'];
  return names.map((n, i) => ({
    id: 's' + (i + 1),
    name: n,
    email: `seeker${i + 1}@demo.com`,
    location: rand(CITIES),
    skills: ['Communication', 'Microsoft Office', 'Problem Solving'].slice(0, 2),
    profileStrength: 60 + Math.floor(Math.random() * 35),
    resumeFiles: [],
  }));
}

export function seedApplications(jobs, seekers) {
  const statuses = ['Submitted', 'Reviewed', 'Interview', 'Rejected', 'Hired'];
  const apps = [];
  for (let i = 0; i < 12; i++) {
    const job = jobs[i % jobs.length];
    const seeker = seekers[i % seekers.length];
    const status = statuses[i % statuses.length];
    const appliedAt = daysAgo(15 - i);
    const timeline = [
      { at: appliedAt, event: 'Applied', note: 'Application submitted' },
    ];
    if (['Reviewed', 'Interview', 'Hired'].includes(status)) {
      timeline.push({ at: daysAgo(14 - i), event: 'Reviewed', note: 'Profile under review' });
    }
    if (['Interview', 'Hired'].includes(status)) {
      timeline.push({ at: daysAgo(10 - i), event: 'Interview', note: 'Scheduled for interview' });
    }
    if (status === 'Hired') {
      timeline.push({ at: daysAgo(7 - i), event: 'Hired', note: 'Offer accepted' });
    }
    if (status === 'Rejected') {
      timeline.push({ at: daysAgo(12 - i), event: 'Rejected', note: 'Position filled' });
    }
    apps.push({
      id: 'a' + (i + 1),
      jobId: job.id,
      seekerId: seeker.id,
      appliedAt,
      status,
      timeline,
      notes: '',
    });
  }
  return apps;
}

export function seedReports() {
  const types = ['Job', 'User', 'Company'];
  const reasons = ['Scam', 'Inappropriate content', 'Fake listing', 'Harassment', 'Spam'];
  const severities = ['Low', 'Medium', 'High'];
  const statuses = ['Open', 'Under Review', 'Resolved'];
  const reports = [];
  for (let i = 0; i < 8; i++) {
    reports.push({
      id: 'r' + (i + 1),
      type: types[i % types.length],
      targetId: 'j' + (i + 1),
      reason: reasons[i % reasons.length],
      severity: severities[i % severities.length],
      status: statuses[i % statuses.length],
      createdAt: daysAgo(10 - i),
      reporterId: 's' + (i % 4 + 1),
      resolutionNote: i >= 5 ? 'Resolved after investigation' : null,
    });
  }
  return reports;
}

export function seedAuditLogs() {
  const actions = ['Approved job', 'Rejected job', 'Verified employer', 'Rejected employer', 'Suspended user', 'Updated category'];
  const logs = [];
  for (let i = 0; i < 20; i++) {
    logs.push({
      id: 'al' + (i + 1),
      actor: 'admin@workbridge.ph',
      action: actions[i % actions.length],
      target: 'j' + (i % 5 + 1),
      timestamp: daysAgo(20 - i),
    });
  }
  return logs;
}

export function seedCategories() {
  return [
    { id: 'cat1', name: 'Technology', slug: 'technology', count: 8 },
    { id: 'cat2', name: 'Healthcare', slug: 'healthcare', count: 4 },
    { id: 'cat3', name: 'Education', slug: 'education', count: 3 },
    { id: 'cat4', name: 'Retail', slug: 'retail', count: 5 },
    { id: 'cat5', name: 'Finance', slug: 'finance', count: 2 },
    { id: 'cat6', name: 'Hospitality', slug: 'hospitality', count: 4 },
    { id: 'cat7', name: 'Construction', slug: 'construction', count: 3 },
  ];
}

export function runSeed() {
  if (get(STORAGE_KEYS.SEEDED)) return;
  const companies = seedCompanies();
  const jobs = seedJobs(companies);
  const seekers = seedSeekers();
  const applications = seedApplications(jobs, seekers);
  const reports = seedReports();
  const auditLogs = seedAuditLogs();
  const categories = seedCategories();

  set(STORAGE_KEYS.COMPANIES, companies);
  set(STORAGE_KEYS.JOBS, jobs);
  set(STORAGE_KEYS.SEEKERS, seekers);
  set(STORAGE_KEYS.APPLICATIONS, applications);
  set(STORAGE_KEYS.REPORTS, reports);
  set(STORAGE_KEYS.AUDIT_LOGS, auditLogs);
  set(STORAGE_KEYS.CATEGORIES, categories);

  // Seed resumes for demo seekers so they can apply for jobs
  const resumes = {};
  seekers.forEach(s => {
    resumes[s.id] = [{ name: s.name.replace(/\s/g, '_') + '_Resume.pdf', date: daysAgo(10) }];
  });
  set(STORAGE_KEYS.RESUMES, resumes);

  set(STORAGE_KEYS.SEEDED, true);
}
