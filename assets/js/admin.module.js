/**
 * WorkBridge PH — Admin module (API-backed)
 */

import { apiAdminDashboard, apiAdminVerifications, apiAdminReports } from './api.js';

export async function getDashboardStats() {
    return apiAdminDashboard();
}

export async function getPendingVerifications() {
    const res = await apiAdminVerifications();
    return (res.data || res).map(c => ({
        id: c.id,
        name: c.name,
        industry: c.industry,
        verifiedStatus: c.verified_status,
        userId: c.user_id,
        docs: c.verification_documents || [],
        submittedAt: c.created_at,
    }));
}

export async function getOpenReports() {
    const res = await apiAdminReports({ status: 'Open' });
    return (res.data || res);
}
