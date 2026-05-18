/**
 * WorkBridge PH — Local Storage Store
 * Simulates backend with localStorage
 */

const STORAGE_KEYS = {
  JOBS: 'workbridge_jobs',
  COMPANIES: 'workbridge_companies',
  SEEKERS: 'workbridge_seekers',
  APPLICATIONS: 'workbridge_applications',
  REPORTS: 'workbridge_reports',
  AUDIT_LOGS: 'workbridge_audit_logs',
  CATEGORIES: 'workbridge_categories',
  SAVED_JOBS: 'workbridge_saved_jobs',
  USER: 'workbridge_user',
  NOTIFICATIONS: 'workbridge_notifications',
  MESSAGES: 'workbridge_messages',
  NOTES: 'workbridge_notes',
  RESUMES: 'workbridge_resumes',
  THEME: 'workbridge_theme',
  SEEDED: 'workbridge_seeded',
};

export function get(key, def = null) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getJobs() {
  return get(STORAGE_KEYS.JOBS, []);
}

export function setJobs(jobs) {
  set(STORAGE_KEYS.JOBS, jobs);
}

export function getCompanies() {
  return get(STORAGE_KEYS.COMPANIES, []);
}

export function setCompanies(companies) {
  set(STORAGE_KEYS.COMPANIES, companies);
}

export function getSeekers() {
  return get(STORAGE_KEYS.SEEKERS, []);
}

export function getApplications() {
  return get(STORAGE_KEYS.APPLICATIONS, []);
}

export function setApplications(apps) {
  set(STORAGE_KEYS.APPLICATIONS, apps);
}

export function getReports() {
  return get(STORAGE_KEYS.REPORTS, []);
}

export function setReports(reports) {
  set(STORAGE_KEYS.REPORTS, reports);
}

export function getAuditLogs() {
  return get(STORAGE_KEYS.AUDIT_LOGS, []);
}

export function addAuditLog(entry) {
  const logs = getAuditLogs();
  logs.unshift({
    id: 'al' + Date.now(),
    actor: entry.actor,
    action: entry.action,
    target: entry.target,
    timestamp: new Date().toISOString(),
  });
  set(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 500));
}

export function getCategories() {
  return get(STORAGE_KEYS.CATEGORIES, []);
}

export function setCategories(cats) {
  set(STORAGE_KEYS.CATEGORIES, cats);
}

export function getSavedJobs(userId) {
  const all = get(STORAGE_KEYS.SAVED_JOBS, {});
  return all[userId] || [];
}

export function setSavedJobs(userId, jobIds) {
  const all = get(STORAGE_KEYS.SAVED_JOBS, {});
  all[userId] = jobIds;
  set(STORAGE_KEYS.SAVED_JOBS, all);
}

export function getCurrentUser() {
  return get(STORAGE_KEYS.USER, null);
}

export function setCurrentUser(user) {
  set(STORAGE_KEYS.USER, user);
}

export function getNotifications(userId) {
  const all = get(STORAGE_KEYS.NOTIFICATIONS, {});
  return all[userId] || [];
}

export function setNotifications(userId, notifs) {
  const all = get(STORAGE_KEYS.NOTIFICATIONS, {});
  all[userId] = notifs;
  set(STORAGE_KEYS.NOTIFICATIONS, all);
}

export function getNotes() {
  return get(STORAGE_KEYS.NOTES, {});
}

export function setNotes(notes) {
  set(STORAGE_KEYS.NOTES, notes);
}

export function getResumes(userId) {
  const all = get(STORAGE_KEYS.RESUMES, {});
  return all[userId] || [];
}

export function setResumes(userId, resumes) {
  const all = get(STORAGE_KEYS.RESUMES, {});
  all[userId] = resumes;
  set(STORAGE_KEYS.RESUMES, all);
}

export function getMessages(userId) {
  const all = get(STORAGE_KEYS.MESSAGES, {});
  return all[userId] || {};
}

export function setMessages(userId, msgs) {
  const all = get(STORAGE_KEYS.MESSAGES, {});
  all[userId] = msgs;
  set(STORAGE_KEYS.MESSAGES, all);
}

export function setSeekers(seekers) {
  set(STORAGE_KEYS.SEEKERS, seekers);
}

export function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}

export function setTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export { STORAGE_KEYS };
