/**
 * WorkBridge PH — Jobs module (API-backed)
 */

import { apiGetJobs, apiGetJob, apiGetCompany, apiGetCompanies } from './api.js';
import { buildQueryString } from './router.js';

// Normalize API job object to match legacy field names used in templates
function normalizeJob(j) {
    return {
        id: j.id,
        title: j.title,
        description: j.description,
        requirements: j.requirements,
        location: j.location,
        type: j.type,
        setup: j.setup || 'On-site',
        experienceLevel: j.experience_level,
        salaryMin: parseFloat(j.salary_min) || 0,
        salaryMax: parseFloat(j.salary_max) || 0,
        slots: j.slots,
        deadline: j.deadline,
        status: j.status === 'Open' ? 'Active' : j.status,
        tags: (j.tags || []).map(t => t.tag || t),
        categoryId: j.category_id,
        companyId: j.company_id,
        company: j.company ? normalizeCompany(j.company) : null,
        postedAt: j.created_at,
    };
}

function normalizeCompany(c) {
    return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        industry: c.industry,
        size: c.size,
        location: c.city ? `${c.city}, ${c.province}` : (c.location || ''),
        city: c.city,
        province: c.province,
        website: c.website,
        about: c.description,
        description: c.description,
        logo: c.logo || null,
        verifiedStatus: c.verified_status,
        foundedYear: c.founded_year,
    };
}

export async function getJobsWithCompanies(filters = {}) {
    const params = {};
    if (filters.keyword)  params.search = filters.keyword;
    if (filters.location) params.location = filters.location;
    if (filters.type)     params.type = filters.type;
    if (filters.experience) params.experience_level = filters.experience;
    if (filters.category) params.category_id = filters.category;
    if (filters.page)     params.page = filters.page;

    const res = await apiGetJobs(params);
    let jobs = (res.data || res).map(normalizeJob);

    if (filters.sort === 'salary')  jobs.sort((a, b) => b.salaryMax - a.salaryMax);
    if (filters.sort === 'newest')  jobs.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

    return { jobs, total: res.total || jobs.length, lastPage: res.last_page || 1, currentPage: res.current_page || 1 };
}

export async function getJobById(id) {
    const j = await apiGetJob(id);
    return normalizeJob(j);
}

export async function getCompanyById(id) {
    const c = await apiGetCompany(id);
    const company = normalizeCompany(c);
    company.openJobs = (c.job_listings || []).map(normalizeJob);
    return company;
}

export async function getCompaniesForBrowse(params = {}) {
    const res = await apiGetCompanies(params);
    return { companies: (res.data || res).map(normalizeCompany), total: res.total || 0, lastPage: res.last_page || 1 };
}

export function jobsPageUrl(filters) {
    return '/jobs.html' + buildQueryString(filters);
}
