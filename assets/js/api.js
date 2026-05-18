/**
 * api.js — HTTP adapter for WorkBridge PH backend
 * Replaces store.js localStorage calls with real API calls.
 * BASE_URL points to the Laravel dev server.
 */

const BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8080/api'
    : 'https://YOUR-APP-NAME.up.railway.app/api';

function getToken() {
    const user = JSON.parse(localStorage.getItem('workbridge_user') || 'null');
    return user?.api_token || null;
}

async function request(method, path, body = null, isFormData = false) {
    const token = getToken();
    const headers = { Accept: 'application/json' };

    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body && !isFormData) headers['Content-Type'] = 'application/json';

    const opts = { method, headers };
    if (body) opts.body = isFormData ? body : JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${path}`, opts);
    const json = await res.json().catch(() => null);

    if (!res.ok) {
        const fromErrors = json?.errors
            ? Object.values(json.errors).flat().join(' ').trim()
            : '';
        const msg =
            (json?.message && String(json.message).trim()) ||
            fromErrors ||
            `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return json;
}

// ── Auth ────────────────────────────────────────────────────────────────────

export async function apiLogin(email, password) {
    const data = await request('POST', '/auth/login', { email, password });
    _saveSession(data);
    return data.user;
}

export async function apiRegister(name, email, password, role, companyName = null) {
    const body = { name, email, password, password_confirmation: password, role };
    if (companyName) body.company_name = companyName;
    const data = await request('POST', '/auth/register', body);
    _saveSession(data);
    return data.user;
}

export async function apiLogout() {
    await request('POST', '/auth/logout').catch(() => {});
    localStorage.removeItem('workbridge_user');
}

export async function apiMe() {
    return request('GET', '/auth/me');
}

function _saveSession({ user, token }) {
    localStorage.setItem('workbridge_user', JSON.stringify({ ...user, api_token: token }));
}

// ── Jobs ────────────────────────────────────────────────────────────────────

export async function apiGetJobs(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/jobs${q ? '?' + q : ''}`);
}

export async function apiGetJob(id) {
    return request('GET', `/jobs/${id}`);
}

export async function apiCreateJob(data) {
    return request('POST', '/employer/jobs', data);
}

export async function apiUpdateJob(id, data) {
    return request('PUT', `/employer/jobs/${id}`, data);
}

export async function apiDeleteJob(id) {
    return request('DELETE', `/employer/jobs/${id}`);
}

export async function apiMyJobs() {
    return request('GET', '/employer/jobs');
}

export async function apiEmployerDashboard() {
    return request('GET', '/employer/dashboard');
}

// ── Applications ────────────────────────────────────────────────────────────

export async function apiApply(jobId, data = {}) {
    return request('POST', `/jobs/${jobId}/apply`, data);
}

export async function apiMyApplications() {
    return request('GET', '/seeker/applications');
}

export async function apiJobApplications(jobId) {
    return request('GET', `/employer/jobs/${jobId}/applications`);
}

export async function apiUpdateApplicationStatus(appId, status, note = null) {
    return request('PATCH', `/applications/${appId}/status`, { status, note });
}

export async function apiWithdraw(appId) {
    return request('DELETE', `/applications/${appId}/withdraw`);
}

// ── Seeker ──────────────────────────────────────────────────────────────────

export async function apiSeekerProfile() {
    return request('GET', '/seeker/profile');
}

export async function apiUpdateSeekerProfile(data) {
    return request('PUT', '/seeker/profile', data);
}

export async function apiUploadResume(file) {
    const fd = new FormData();
    fd.append('resume', file);
    return request('POST', '/seeker/resumes', fd, true);
}

export async function apiUploadPhoto(file) {
    const fd = new FormData();
    fd.append('photo', file);
    return request('POST', '/seeker/photo', fd, true);
}

/** Convert a backend storage path ("avatars/x.jpg") to a full URL. */
export function storageUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path; // already absolute
    return BASE_URL.replace('/api', '/storage/') + path.replace(/^\/+/, '');
}

export async function apiDeleteResume(id) {
    return request('DELETE', `/seeker/resumes/${id}`);
}

export async function apiDownloadResume(id, filename) {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/seeker/resumes/${id}/download`, {
        headers: { Authorization: `Bearer ${token}`, Accept: '*/*' },
    });
    if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || `HTTP ${res.status}`);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'resume';
    a.click();
    URL.revokeObjectURL(url);
}

export async function apiSavedJobs() {
    return request('GET', '/seeker/saved-jobs');
}

export async function apiSaveJob(jobId) {
    return request('POST', `/seeker/saved-jobs/${jobId}`);
}

export async function apiUnsaveJob(jobId) {
    return request('DELETE', `/seeker/saved-jobs/${jobId}`);
}

// ── Company ─────────────────────────────────────────────────────────────────

export async function apiGetCompanies(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/companies${q ? '?' + q : ''}`);
}

export async function apiGetCompany(id) {
    return request('GET', `/companies/${id}`);
}

export async function apiMyCompany() {
    return request('GET', '/employer/company');
}

export async function apiUpdateCompany(data) {
    return request('PUT', '/employer/company', data);
}

export async function apiUploadLogo(file) {
    const fd = new FormData();
    fd.append('logo', file);
    return request('POST', '/employer/company/logo', fd, true);
}

export async function apiUploadVerificationDoc(file, docType) {
    const fd = new FormData();
    fd.append('document', file);
    fd.append('doc_type', docType);
    return request('POST', '/employer/company/docs', fd, true);
}

// ── Messages ────────────────────────────────────────────────────────────────

export async function apiGetContacts() {
    return request('GET', '/messages/contacts');
}

export async function apiGetThread(userId) {
    return request('GET', `/messages/${userId}`);
}

export async function apiSendMessage(recipientId, body) {
    return request('POST', '/messages', { recipient_id: recipientId, body });
}

export async function apiUnreadMessages() {
    return request('GET', '/messages/unread');
}

// ── Notifications ───────────────────────────────────────────────────────────

export async function apiGetNotifications() {
    return request('GET', '/notifications');
}

export async function apiMarkNotificationRead(id) {
    return request('PATCH', `/notifications/${id}/read`);
}

export async function apiMarkAllNotificationsRead() {
    return request('PATCH', '/notifications/read-all');
}

export async function apiUnreadNotifications() {
    return request('GET', '/notifications/unread');
}

// ── Admin ────────────────────────────────────────────────────────────────────

export async function apiAdminDashboard() {
    return request('GET', '/admin/dashboard');
}

export async function apiAdminUsers(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/admin/users${q ? '?' + q : ''}`);
}

export async function apiAdminBanUser(id) {
    return request('PATCH', `/admin/users/${id}/ban`);
}

export async function apiAdminUnbanUser(id) {
    return request('PATCH', `/admin/users/${id}/unban`);
}

export async function apiAdminVerifications() {
    return request('GET', '/admin/verifications');
}

export async function apiAdminVerifyCompany(id, status, note = null) {
    return request('PATCH', `/admin/companies/${id}/verify`, { status, note });
}

export async function apiAdminReports(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/admin/reports${q ? '?' + q : ''}`);
}

export async function apiAdminResolveReport(id, status, note = null) {
    return request('PATCH', `/admin/reports/${id}/resolve`, { status, note });
}

export async function apiAdminAllJobs(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/admin/jobs${q ? '?' + q : ''}`);
}

export async function apiAdminTakedownJob(id) {
    return request('PATCH', `/admin/jobs/${id}/takedown`);
}

export async function apiAdminAuditLogs() {
    return request('GET', '/admin/audit-logs');
}

export async function apiChangePassword(currentPassword, newPassword) {
    return request('POST', '/auth/change-password', { current_password: currentPassword, new_password: newPassword });
}

export async function apiForgotPassword(email) {
    return request('POST', '/auth/forgot-password', { email });
}

export async function apiResetPassword(email, token, password, passwordConfirmation) {
    return request('POST', '/auth/reset-password', {
        email, token, password, password_confirmation: passwordConfirmation,
    });
}

export async function apiGetApplication(id) {
    return request('GET', `/applications/${id}`);
}

export async function apiGetCategories() {
    return request('GET', '/categories');
}

export async function apiAdminApproveJob(id) {
    return request('PATCH', `/admin/jobs/${id}/approve`);
}

export async function apiAdminAddCategory(name) {
    return request('POST', '/admin/categories', { name });
}

export async function apiAdminDeleteCategory(id) {
    return request('DELETE', `/admin/categories/${id}`);
}
