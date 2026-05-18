/**
 * WorkBridge PH — Seeker module (API-backed)
 */

import { apiGetJobs, apiMyApplications, apiSeekerProfile } from './api.js';

function normalizeJob(j) {
    return {
        id: j.id,
        title: j.title,
        description: j.description,
        location: j.location,
        type: j.type,
        salaryMin: parseFloat(j.salary_min) || 0,
        salaryMax: parseFloat(j.salary_max) || 0,
        status: j.status === 'Open' ? 'Active' : j.status,
        tags: (j.tags || []).map(t => t.tag || t),
        companyId: j.company_id,
        company: j.company ? { id: j.company.id, name: j.company.name, logo: j.company.logo } : null,
        postedAt: j.created_at,
    };
}

export async function getRecommendedJobs(limit = 6) {
    const res = await apiGetJobs({});
    return (res.data || res).slice(0, limit).map(normalizeJob);
}

export async function getMyApplications() {
    const res = await apiMyApplications();
    return (res.data || res).map(a => ({
        id: a.id,
        jobId: a.job_listing_id,
        status: a.status,
        skillFit: a.skill_fit,
        appliedAt: a.created_at,
        job: a.job_listing ? normalizeJob(a.job_listing) : null,
        timeline: a.timelines || [],
    }));
}

export async function getSeekerStats() {
    const [apps, profile] = await Promise.allSettled([apiMyApplications(), apiSeekerProfile()]);
    const appList = apps.status === 'fulfilled' ? (apps.value.data || apps.value) : [];
    const byStatus = { Pending: 0, Reviewing: 0, Interview: 0, Hired: 0, Rejected: 0 };
    appList.forEach(a => { byStatus[a.status] = (byStatus[a.status] || 0) + 1; });
    return {
        totalApplications: appList.length,
        profileStrength: profile.status === 'fulfilled' ? (profile.value.profile_strength || 0) : 0,
        byStatus,
    };
}
