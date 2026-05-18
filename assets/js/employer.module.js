/**
 * WorkBridge PH — Employer module (API-backed)
 */

import { apiMyJobs, apiJobApplications } from './api.js';

export async function getEmployerJobs() {
    const res = await apiMyJobs();
    return (res.data || res).map(j => ({
        id: j.id,
        title: j.title,
        location: j.location,
        type: j.type,
        status: j.status,
        salaryMin: parseFloat(j.salary_min) || 0,
        salaryMax: parseFloat(j.salary_max) || 0,
        applicationsCount: j.applications_count || 0,
        postedAt: j.created_at,
        deadline: j.deadline,
        tags: (j.tags || []).map(t => t.tag || t),
    }));
}

export async function getApplicantCounts() {
    const jobs = await getEmployerJobs();
    const total = jobs.reduce((sum, j) => sum + j.applicationsCount, 0);
    return { total, jobCount: jobs.length };
}
