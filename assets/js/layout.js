/**
 * WorkBridge PH — Shared layout (sidebar + topbar)
 */

import { getCurrentUser } from './store.js';
import { apiLogout } from './api.js';
import { getActiveNav } from './router.js';

const SEEKER_NAV = [
  { path: 'dashboard.html', label: 'Dashboard', icon: 'bi-grid' },
  { path: 'jobs.html', label: 'Jobs', icon: 'bi-briefcase' },
  { path: 'saved-jobs.html', label: 'Saved Jobs', icon: 'bi-bookmark' },
  { path: 'applications.html', label: 'Applications', icon: 'bi-file-earmark-text' },
  { path: 'profile.html', label: 'Profile', icon: 'bi-person' },
  { path: 'resume.html', label: 'Resume', icon: 'bi-file-text' },
  { path: 'notifications.html', label: 'Notifications', icon: 'bi-bell' },
  { path: 'messages.html', label: 'Messages', icon: 'bi-chat' },
  { path: 'settings.html', label: 'Settings', icon: 'bi-gear' },
];

const EMPLOYER_NAV = [
  { path: 'dashboard.html', label: 'Dashboard', icon: 'bi-grid' },
  { path: 'post-job.html', label: 'Post Job', icon: 'bi-plus-circle' },
  { path: 'manage-jobs.html', label: 'Manage Jobs', icon: 'bi-briefcase' },
  { path: 'applicants.html', label: 'Applicants', icon: 'bi-people' },
  { path: 'company-profile.html', label: 'Company', icon: 'bi-building' },
  { path: 'verification.html', label: 'Verification', icon: 'bi-patch-check' },
  { path: 'messages.html', label: 'Messages', icon: 'bi-chat' },
  { path: 'settings.html', label: 'Settings', icon: 'bi-gear' },
];

const ADMIN_NAV = [
  { path: 'dashboard.html', label: 'Dashboard', icon: 'bi-grid' },
  { path: 'employer-verification.html', label: 'Employer Verification', icon: 'bi-patch-check' },
  { path: 'job-moderation.html', label: 'Job Moderation', icon: 'bi-shield-check' },
  { path: 'reports.html', label: 'Reports', icon: 'bi-flag' },
  { path: 'users.html', label: 'Users', icon: 'bi-people' },
  { path: 'analytics.html', label: 'Analytics', icon: 'bi-graph-up' },
  { path: 'categories.html', label: 'Categories', icon: 'bi-tags' },
  { path: 'audit-logs.html', label: 'Audit Logs', icon: 'bi-journal-text' },
];

export function renderLayout(role, title) {
  const user = getCurrentUser();
  if (!user) return;

  const nav = role === 'seeker' ? SEEKER_NAV : role === 'employer' ? EMPLOYER_NAV : ADMIN_NAV;
  const active = getActiveNav();

  // Path resolution: if we're inside /seeker/, /employer/, or /admin/, links are relative.
  // Otherwise (root-level pages like job-detail.html), prefix with role folder.
  const path = window.location.pathname.replace(/\\/g, '/');
  const insideRoleFolder = /\/(seeker|employer|admin)\//.test(path);
  const navPrefix    = insideRoleFolder ? '' : `${role}/`;
  const loginPrefix  = insideRoleFolder ? '../auth/' : 'auth/';
  // Logo lives at assets/img/logo.png — same depth logic as the auth path
  const logoSrc      = insideRoleFolder ? '../assets/img/logo.png' : 'assets/img/logo.png';

  const sidebarHtml = `
    <div class="drawer-overlay" id="drawer-overlay"></div>
    <aside class="sidebar" id="sidebar-drawer">
      <div class="sidebar-logo"><a href="${navPrefix}dashboard.html" class="text-white text-decoration-none"><img src="${logoSrc}" alt="" class="sidebar-logo-img"><span>WorkBridge PH</span></a></div>
      <button type="button" class="sidebar-close btn btn-ghost btn-sm" id="drawer-close" aria-label="Close drawer"><i class="bi bi-x-lg"></i></button>
      <ul class="sidebar-nav">
        ${nav.map(n => `
          <li><a href="${navPrefix}${n.path}" class="${(n.path.replace('.html','') === active || (active === 'dashboard' && n.path === 'dashboard.html')) ? 'active' : ''}">
            <i class="bi ${n.icon}"></i> ${n.label}
          </a></li>
        `).join('')}
      </ul>
    </aside>
    <div class="topbar">
      <button type="button" class="btn btn-ghost btn-sm drawer-toggle" id="drawer-toggle" aria-label="Open navigation menu"><i class="bi bi-list"></i></button>
      <span class="topbar-title">${title || 'Dashboard'}</span>
      <div class="topbar-actions">
        <div class="dropdown">
          <button class="btn btn-ghost btn-sm" data-dropdown="user-menu">
            <i class="bi bi-person-circle"></i> ${user.name || user.email}
          </button>
          <div id="user-menu" class="dropdown-menu">
            <a href="${navPrefix}settings.html" class="dropdown-item">Settings</a>
            <a href="${loginPrefix}login.html" class="dropdown-item" id="logout-btn">Log out</a>
          </div>
        </div>
      </div>
    </div>
  `;

  let container = document.getElementById('app-layout');
  if (!container) {
    container = document.createElement('div');
    container.id = 'app-layout';
    container.className = 'app-layout';
    const main = document.querySelector('main');
    const content = document.querySelector('.app-content, [data-main]');
    if (main) {
      main.classList.add('app-main');
      if (!content) {
        const div = document.createElement('div');
        div.className = 'app-content';
        while (main.firstChild) div.appendChild(main.firstChild);
        main.appendChild(div);
      }
      container.appendChild(main);
    }
    document.body.insertBefore(container, document.body.firstChild);
  }

  const existingSidebar = container.querySelector('.sidebar');
  if (!existingSidebar) {
    const wrap = document.createElement('div');
    wrap.innerHTML = sidebarHtml;
    while (wrap.firstChild) container.insertBefore(wrap.firstChild, container.firstChild);
  }

  document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await apiLogout().catch(() => {});
    window.location.href = `${loginPrefix}login.html`;
  });

  document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
  container.querySelectorAll('[data-dropdown]').forEach(btn => {
    const menuId = btn.dataset.dropdown;
    const menu = document.getElementById(menuId);
    if (!menu || btn.dataset.dropdownInit) return;
    btn.dataset.dropdownInit = '1';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.dropdown-menu.show').forEach(x => x.classList.remove('show'));
      menu.classList.toggle('show');
    });
  });
  document.addEventListener('click', () => container.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show')));

  /* Drawer toggle */
  const sidebar = container.querySelector('.sidebar');
  const overlay = container.querySelector('#drawer-overlay');
  const toggle = container.querySelector('#drawer-toggle');
  const closeBtn = container.querySelector('#drawer-close');

  function openDrawer() {
    sidebar?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  sidebar?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  /* Remove loading state - show page only after layout is ready */
  document.body.classList.remove('wb-loading');
}
