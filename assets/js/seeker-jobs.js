import { renderLayout } from './layout.js';
import { getJobsWithCompanies } from './jobs.module.js';
import { getQueryParams, buildQueryString } from './router.js';
import { apiSavedJobs, apiSaveJob, apiUnsaveJob, apiMyApplications } from './api.js';
import { toastSuccess, toastError } from './ui.toast.js';
import { esc, formatSalaryRange, companyAvatar, verifiedBadge, emptyState, skeletonJobCards } from './utils.js';

renderLayout('seeker', 'Jobs');

let savedIds    = new Set();
let appliedIds  = new Set();
let lastPage    = 1;
let currentPage = 1;

async function init() {
  try {
    const [savedRes, appsRes] = await Promise.allSettled([apiSavedJobs(), apiMyApplications()]);
    if (savedRes.status === 'fulfilled') {
      (savedRes.value.data || savedRes.value).forEach(j => savedIds.add(String(j.job_listing_id ?? j.id)));
    }
    if (appsRes.status === 'fulfilled') {
      (appsRes.value.data || appsRes.value).forEach(a => appliedIds.add(String(a.job_listing_id)));
    }
  } catch (_) { /* non-critical */ }
  render();
}

async function render() {
  const params = getQueryParams();
  const page   = parseInt(params.page) || 1;

  const grid = document.getElementById('jobs-list');
  grid.innerHTML = skeletonJobCards(6);

  try {
    const { jobs, lastPage: lp } = await getJobsWithCompanies({ ...params, page });
    lastPage    = lp;
    currentPage = page;

    if (!jobs.length) {
      grid.innerHTML = emptyState({
        icon: 'search',
        title: 'No jobs match your filters',
        subtitle: 'Try removing some filters or searching for different keywords.',
      });
      document.getElementById('pagination').innerHTML = '';
      return;
    }

    const ids = ['keyword', 'location', 'type', 'setup', 'sort'];
    ids.forEach(k => { const e = document.getElementById('f-' + k); if (e) e.value = params[k] || ''; });

    grid.innerHTML = jobs.map(j => {
      const applied     = appliedIds.has(String(j.id));
      const isSaved     = savedIds.has(String(j.id));
      const savedIcon   = isSaved ? 'bookmark-fill' : 'bookmark';
      return `<div class="card card-lift">
        <div class="card-body">
          <div class="d-flex justify-content-between gap-2 mb-2">
            <div class="d-flex gap-2 align-items-start" style="min-width:0;flex:1">
              ${companyAvatar(j.company, 40)}
              <div style="min-width:0">
                <a href="../job-detail.html?id=${esc(String(j.id))}" class="text-dark text-decoration-none">
                  <h4 class="card-title mb-0">${esc(j.title)}</h4>
                </a>
                <p class="text-secondary small mb-0">${esc(j.company?.name || '—')}${verifiedBadge(j.company)} · ${esc(j.location || '—')}</p>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm save-job flex-shrink-0" data-id="${esc(String(j.id))}" data-saved="${isSaved}">
              <i class="bi bi-${savedIcon}"></i>
            </button>
          </div>
          <p class="text-primary fw-bold mb-2">${formatSalaryRange(j.salaryMin, j.salaryMax)}</p>
          <a href="../job-detail.html?id=${esc(String(j.id))}" class="btn btn-primary btn-sm${applied ? ' disabled' : ''}">
            ${applied ? 'Applied' : 'Apply'}
          </a>
        </div>
      </div>`;
    }).join('');

    grid.querySelectorAll('.save-job').forEach(btn => {
      btn.onclick = async () => {
        const id      = btn.dataset.id;
        const isSaved = btn.dataset.saved === 'true';
        btn.disabled  = true;
        try {
          if (isSaved) {
            await apiUnsaveJob(id);
            savedIds.delete(id);
            toastSuccess('Removed from saved');
          } else {
            await apiSaveJob(id);
            savedIds.add(id);
            toastSuccess('Job saved');
          }
          render();
        } catch (err) {
          toastError(err.message);
          btn.disabled = false;
        }
      };
    });

    renderPagination(params);
  } catch (err) {
    grid.innerHTML = `<p class="text-danger">${esc(err.message)}</p>`;
  }
}

function renderPagination(params) {
  const pag = document.getElementById('pagination');
  if (lastPage <= 1) { pag.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= lastPage; i++) {
    html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  pag.innerHTML = html;
  pag.querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      window.location.search = buildQueryString({ ...params, page: b.dataset.page });
    };
  });
}

document.getElementById('filter-form').onsubmit = e => {
  e.preventDefault();
  const p = {
    keyword:  document.getElementById('f-keyword').value,
    location: document.getElementById('f-location').value,
    type:     document.getElementById('f-type').value,
    setup:    document.getElementById('f-setup').value,
    sort:     document.getElementById('f-sort').value,
  };
  window.location.href = 'jobs.html' + buildQueryString(p);
};

init();
