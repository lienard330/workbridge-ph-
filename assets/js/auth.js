/**
 * auth.js — API-backed authentication
 * Drop-in async replacement for auth.mock.js
 */

import { apiLogin, apiRegister, apiLogout } from './api.js';
import { getCurrentUser } from './store.js';

export async function login(email, password) {
    try {
        const user = await apiLogin(email, password);
        return { ok: true, user };
    } catch (err) {
        return { ok: false, error: err.message };
    }
}

export async function register(data) {
    try {
        const user = await apiRegister(
            data.name, data.email, data.password, data.role, data.companyName || null
        );
        return { ok: true, user };
    } catch (err) {
        return { ok: false, error: err.message };
    }
}

export async function logout() {
    await apiLogout();
    window.location.href = '/auth/login.html';
}

export function isAuthenticated() {
    return !!getCurrentUser();
}

export function requireRole(role) {
    const user = getCurrentUser();
    if (!user) return false;
    if (Array.isArray(role)) return role.includes(user.role);
    return user.role === role;
}

export function getRedirectAfterLogin(user) {
    switch (user.role) {
        case 'seeker':   return '../seeker/dashboard.html';
        case 'employer': return '../employer/dashboard.html';
        case 'admin':    return '../admin/dashboard.html';
        default:         return '../index.html';
    }
}
