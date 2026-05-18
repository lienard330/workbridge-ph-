/**
 * WorkBridge PH — Client-side Router & Guards
 */

import { getCurrentUser } from './store.js';
import { toastError } from './ui.toast.js';

const ROLE_PATHS = {
  admin: /^\/admin\//,
  employer: /^\/employer\//,
  seeker: /^\/seeker\//,
};

export function getQueryParams() {
  // `serve` with clean URLs can redirect `page.html?id=x` → `/page` and drop `?id=` (see serve.json).
  // Fallback: fragment `#id=x` is preserved in the browser.
  const search = window.location.search;
  const fromHash =
    !search && window.location.hash && window.location.hash.length > 1
      ? window.location.hash.slice(1)
      : '';
  const p = new URLSearchParams(search || fromHash || '');
  const obj = {};
  p.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
}

export function setQueryParams(params) {
  const u = new URL(window.location);
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === '') u.searchParams.delete(k);
    else u.searchParams.set(k, v);
  });
  window.history.replaceState({}, '', u);
}

export function buildQueryString(params) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') p.set(k, v);
  });
  const s = p.toString();
  return s ? '?' + s : '';
}

export function checkRouteGuard() {
  const path = (window.location.pathname || window.location.href || '').replace(/\\/g, '/');
  const user = getCurrentUser();

  const isAdmin = path.includes('/admin/') || path.includes('admin\\');
  const isEmployer = path.includes('/employer/') || path.includes('employer\\');
  const isSeeker = path.includes('/seeker/') || path.includes('seeker\\');

  if (isAdmin || isEmployer || isSeeker) {
    const role = isAdmin ? 'admin' : isEmployer ? 'employer' : 'seeker';
    if (!user) {
      toastError('Please log in to access this page.');
      const authPath = path.startsWith('/') ? '/auth/login.html' : '../auth/login.html';
      window.location.href = authPath + '?redirect=' + encodeURIComponent(window.location.href);
      return false;
    }
    if (user.role !== role) {
      toastError('You do not have permission to access this page.');
      const authPath = path.startsWith('/') ? '/auth/login.html' : '../auth/login.html';
      window.location.href = authPath;
      return false;
    }
  }
  return true;
}

export function getActiveNav(path) {
  const p = path || window.location.pathname;
  if (p.includes('/employer-verification') || p.includes('/verification-detail')) return 'employer-verification';
  if (p.includes('/job-moderation') || p.includes('/job-review')) return 'job-moderation';
  if (p.includes('/reports') || p.includes('/report-detail')) return 'reports';
  if (p.includes('/users') || p.includes('/user-detail')) return 'users';
  if (p.includes('/analytics')) return 'analytics';
  if (p.includes('/categories')) return 'categories';
  if (p.includes('/audit-logs')) return 'audit-logs';
  const m = p.match(/\/(seeker|employer|admin)\/([^/]+)/);
  return m ? m[2].replace('.html', '') : '';
}
