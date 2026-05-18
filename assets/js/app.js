/**
 * WorkBridge PH — Main App
 */

import { getCurrentUser, getTheme, setTheme } from './store.js';
import { checkRouteGuard } from './router.js';
import { initDropdowns } from './ui.dropdown.js';
import { apiLogout } from './api.js';

// Apply theme
const theme = getTheme();
if (theme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Route guard for protected pages
if (!checkRouteGuard()) {
  // Redirect happened
} else {
  document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    syncPublicNavWithLoginState();
    initPublicNavToggle();
  });
}

/**
 * On phones the public nav has too many links to fit horizontally (Jobs,
 * Categories, Companies, About, Help, Log in). Inject a hamburger button
 * that toggles the nav links into a dropdown panel.
 *
 * No-ops on dashboard pages (no `.public-nav`).
 */
function initPublicNavToggle() {
  const inner = document.querySelector('.public-nav-inner');
  const links = document.querySelector('.public-nav-links');
  if (!inner || !links || inner.querySelector('.public-nav-toggle')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'public-nav-toggle';
  btn.setAttribute('aria-label', 'Toggle navigation menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<i class="bi bi-list"></i>';
  inner.insertBefore(btn, links);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = links.classList.toggle('show');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close menu when clicking outside or on a nav link (after navigation)
  document.addEventListener('click', () => {
    if (links.classList.contains('show')) {
      links.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  links.addEventListener('click', () => {
    links.classList.remove('show');
    btn.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Public pages (index, jobs, companies, etc.) have a static "Log in" button.
 * If the user is actually logged in (token in localStorage), that button is
 * misleading — they think they're a guest. Replace it with their name + a
 * link to their role dashboard, plus a Log out option.
 *
 * Runs only on pages with `.public-nav` markup; no-ops on dashboard pages.
 */
function syncPublicNavWithLoginState() {
  const navLinks = document.querySelector('.public-nav-links');
  if (!navLinks) return;
  const user = getCurrentUser();
  if (!user) return;

  const dashUrl = user.role === 'seeker'   ? 'seeker/dashboard.html'
                : user.role === 'employer' ? 'employer/dashboard.html'
                : 'admin/dashboard.html';
  // Resolve relative to current page depth — works from /index.html and from /auth/login.html
  const depth = location.pathname.replace(/^\/workbridge\/?/, '').replace(/^\//, '').split('/').length - 1;
  const prefix = '../'.repeat(depth);
  const safeName = (user.name || user.email || 'Account').replace(/[<>"']/g, '');

  const loginItem = navLinks.querySelector('.btn-primary')?.parentElement;
  if (!loginItem) return;
  loginItem.outerHTML = `
    <li><a href="${prefix}${dashUrl}" class="btn btn-primary"><i class="bi bi-grid"></i> Dashboard</a></li>
    <li>
      <a href="#" id="public-nav-logout" title="Logged in as ${safeName}">
        <i class="bi bi-box-arrow-right"></i> Log out
      </a>
    </li>`;

  document.getElementById('public-nav-logout')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await apiLogout().catch(() => {});
    window.location.reload();
  });
}

export function switchRole(role) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'auth/login.html';
    return;
  }
  const path = role === 'seeker' ? 'seeker/dashboard.html' : role === 'employer' ? 'employer/dashboard.html' : 'admin/dashboard.html';
  const prefix = location.pathname.includes('/seeker/') || location.pathname.includes('seeker') ? '../' :
    location.pathname.includes('/employer/') || location.pathname.includes('employer') ? '../' :
    location.pathname.includes('/admin/') || location.pathname.includes('admin') ? '../' : '';
  window.location.href = prefix + path;
}

export function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  setTheme(isDark ? 'light' : 'dark');
}
