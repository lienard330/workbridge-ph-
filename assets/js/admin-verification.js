import { renderLayout } from './layout.js';
import { apiAdminVerifications } from './api.js';
import { esc, skeletonTableRows } from './utils.js';

renderLayout('admin', 'Employer Verification');

let allCompanies = [];

function render() {
  const q      = (document.getElementById('search-company').value || '').toLowerCase();
  const status = document.getElementById('filter-status').value;

  const list = allCompanies.filter(c => {
    const matchQ = !q || (c.name || '').toLowerCase().includes(q);
    const matchS = !status || c.verified_status === status;
    return matchQ && matchS;
  });

  const tbody = document.getElementById('verify-tbody');

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-secondary text-center py-3">No companies found.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(c => {
    const vs = c.verified_status || 'Unverified';
    const badgeCls = vs === 'Verified' ? 'verified'
                   : vs === 'Rejected' ? 'rejected'
                   : vs === 'Suspended' ? 'rejected'
                   : 'pending';
    const location = [c.city, c.province].filter(Boolean).join(', ') || c.location || '—';
    return `<tr role="button" style="cursor:pointer"
              onclick="location.href='verification-detail.html?id=${esc(String(c.id))}'">
      <td>${esc(c.name)}</td>
      <td>${esc(c.industry || '—')}</td>
      <td>${esc(location)}</td>
      <td><span class="badge badge-${badgeCls}">${esc(vs)}</span></td>
    </tr>`;
  }).join('');
}

document.getElementById('search-company').oninput  = render;
document.getElementById('filter-status').onchange  = render;

// Initial load
document.getElementById('verify-tbody').innerHTML =
  skeletonTableRows(5, 4);

apiAdminVerifications()
  .then(res => { allCompanies = res.data || res; render(); })
  .catch(err => {
    document.getElementById('verify-tbody').innerHTML =
      `<tr><td colspan="4" class="text-danger">${esc(err.message)}</td></tr>`;
  });
