import { renderLayout } from './layout.js';
import { apiAdminUsers, apiAdminBanUser, apiAdminUnbanUser } from './api.js';
import { toastSuccess, toastError } from './ui.toast.js';
import { esc, skeletonTableRows } from './utils.js';

renderLayout('admin', 'Users');

let allUsers = [];
let roleFilter = '';

function render() {
  const q = (document.getElementById('search-user').value || '').toLowerCase();
  const list = allUsers.filter(u => {
    const matchQ = !q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    const matchR = !roleFilter || u.role === roleFilter;
    return matchQ && matchR;
  });

  document.getElementById('users-tbody').innerHTML = list.length
    ? list.map(u => {
        const isBanned = u.status === 'banned';
        const roleBadge = u.role === 'admin' ? 'badge-teal' : u.role === 'employer' ? 'badge-pending' : '';
        return `<tr>
          <td>${esc(u.name)}</td>
          <td>${esc(u.email)}</td>
          <td><span class="badge ${roleBadge}">${esc(u.role)}</span></td>
          <td><span class="badge badge-${isBanned ? 'rejected' : 'verified'}">${esc(u.status)}</span></td>
          <td style="white-space:nowrap">
            <a href="user-detail.html?id=${esc(String(u.id))}" class="btn btn-ghost btn-sm">View</a>
            ${u.role !== 'admin' ? `
              <button class="btn btn-ghost btn-sm ban-btn" data-id="${esc(String(u.id))}" data-banned="${isBanned}" style="color:var(--color-error)">
                ${isBanned ? 'Unban' : 'Ban'}
              </button>` : ''}
          </td>
        </tr>`;
      }).join('')
    : '<tr><td colspan="5" class="text-secondary text-center py-3">No users found.</td></tr>';

  document.querySelectorAll('.ban-btn').forEach(btn => {
    btn.onclick = async () => {
      const isBanned = btn.dataset.banned === 'true';
      btn.disabled = true;
      try {
        if (isBanned) {
          await apiAdminUnbanUser(btn.dataset.id);
          toastSuccess('User unbanned');
        } else {
          await apiAdminBanUser(btn.dataset.id);
          toastSuccess('User banned');
        }
        await loadUsers();
      } catch (err) { toastError(err.message); btn.disabled = false; }
    };
  });
}

async function loadUsers() {
  try {
    const res = await apiAdminUsers();
    allUsers = res.data || res;
    render();
  } catch (err) {
    document.getElementById('users-tbody').innerHTML =
      `<tr><td colspan="5" class="text-danger">${esc(err.message)}</td></tr>`;
  }
}

// Role filter chips — if they exist in the HTML
document.querySelectorAll('[data-role-filter]')?.forEach(btn => {
  btn.onclick = () => {
    roleFilter = btn.dataset.roleFilter;
    document.querySelectorAll('[data-role-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  };
});

document.getElementById('search-user').oninput = render;

// Initial load
document.getElementById('users-tbody').innerHTML = skeletonTableRows(5, 5);
loadUsers();
