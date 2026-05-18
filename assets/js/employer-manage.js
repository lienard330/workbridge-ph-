import { renderLayout } from './layout.js';
import { apiMyJobs, apiDeleteJob } from './api.js';
import { toastSuccess, toastError } from './ui.toast.js';
import { esc, skeletonTableRows } from './utils.js';

renderLayout('employer', 'Manage Jobs');

let allJobs     = [];
let statusFilter = '';

function render() {
  const jobs = statusFilter
    ? allJobs.filter(j => j.status === statusFilter)
    : allJobs;

  document.querySelectorAll('.chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.status === statusFilter);
    chip.onclick = () => { statusFilter = chip.dataset.status; render(); };
  });

  const tbody = document.getElementById('jobs-tbody');

  if (!jobs.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-secondary text-center py-3">' +
      (statusFilter ? 'No jobs with this status.' : 'No jobs posted yet.') + '</td></tr>';
    return;
  }

  tbody.innerHTML = jobs.map(j => {
    const badgeCls = j.status === 'Open'   ? 'verified'
                   : j.status === 'Draft'  ? 'pending'
                   : 'rejected';
    const posted = j.created_at ? new Date(j.created_at).toLocaleDateString() : '—';
    return `<tr>
      <td><a href="../job-detail.html?id=${esc(String(j.id))}" class="text-dark">${esc(j.title)}</a></td>
      <td>${esc(j.location)}</td>
      <td><span class="badge badge-${badgeCls}">${esc(j.status)}</span></td>
      <td>${posted}</td>
      <td style="white-space:nowrap">
        <a href="job-edit.html?id=${esc(String(j.id))}" class="btn btn-ghost btn-sm">Edit</a>
        <a href="../job-detail.html?id=${esc(String(j.id))}" class="btn btn-ghost btn-sm">View</a>
        <button class="btn btn-ghost btn-sm delete-job" data-id="${esc(String(j.id))}"
          style="color:var(--color-error)">Delete</button>
      </td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('.delete-job').forEach(btn => {
    btn.onclick = async () => {
      if (!confirm('Delete this job posting? This cannot be undone.')) return;
      btn.disabled = true;
      try {
        await apiDeleteJob(btn.dataset.id);
        toastSuccess('Job deleted');
        allJobs = allJobs.filter(j => String(j.id) !== btn.dataset.id);
        render();
      } catch (err) { toastError(err.message); btn.disabled = false; }
    };
  });
}

async function loadJobs() {
  try {
    const jobs = await apiMyJobs();
    allJobs = jobs.data || jobs;
    render();
  } catch (err) {
    document.getElementById('jobs-tbody').innerHTML =
      `<tr><td colspan="5" class="text-danger">${esc(err.message)}</td></tr>`;
  }
}

// Initial loading state
document.getElementById('jobs-tbody').innerHTML =
  skeletonTableRows(5, 5);
loadJobs();
