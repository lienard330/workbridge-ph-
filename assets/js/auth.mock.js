/**
 * WorkBridge PH — Mock Auth
 */

import { setCurrentUser, getCurrentUser, get, set, getSeekers, setSeekers, getCompanies, setCompanies } from './store.js';

const DEMO_ACCOUNTS = {
  // Aligned with backend DatabaseSeeder (use when wiring pages to auth.mock instead of API)
  'juan@example.com': { role: 'seeker', password: 'password', userId: 's1', name: 'Juan dela Cruz' },
  'hr@technova.ph': { role: 'employer', password: 'password', userId: 'c1', name: 'TechNova Solutions HR' },
  'admin@workbridge.ph': { role: 'admin', password: 'password', userId: 'admin1', name: 'Admin WorkBridge' },
};

const REGISTERED_KEY = 'workbridge_registered_users';

function getRegisteredUsers() {
  return get(REGISTERED_KEY, {});
}

function setRegisteredUsers(users) {
  set(REGISTERED_KEY, users);
}

export function mockLogin(email, password) {
  const key = email?.toLowerCase();

  // Check demo accounts first
  const demo = DEMO_ACCOUNTS[key];
  if (demo && demo.password === password) {
    const user = { id: demo.userId, email: key, name: demo.name, role: demo.role };
    setCurrentUser(user);
    return { ok: true, user };
  }

  // Check registered accounts
  const registered = getRegisteredUsers();
  const reg = registered[key];
  if (reg && reg.password === password) {
    const user = { id: reg.userId, email: key, name: reg.name, role: reg.role };
    setCurrentUser(user);
    return { ok: true, user };
  }

  return { ok: false, error: 'Invalid email or password' };
}

export function mockLogout() {
  setCurrentUser(null);
}

export function mockRegister(data) {
  const key = data.email?.toLowerCase();

  // Check against demo accounts
  if (DEMO_ACCOUNTS[key]) return { ok: false, error: 'Email already registered' };

  // Check against registered accounts
  const registered = getRegisteredUsers();
  if (registered[key]) return { ok: false, error: 'Email already registered' };

  const userId = 'u' + Date.now();
  const role = data.role || 'seeker';

  // Save to registered users store (for login)
  registered[key] = { userId, name: data.name, role, password: data.password };
  setRegisteredUsers(registered);

  // Persist to seekers or companies store (for profile data)
  if (role === 'seeker') {
    const seekers = getSeekers();
    seekers.push({
      id: userId,
      name: data.name,
      email: key,
      location: '',
      skills: [],
      profileStrength: 30,
      resumeFiles: [],
    });
    setSeekers(seekers);
  } else if (role === 'employer') {
    const companies = getCompanies();
    companies.push({
      id: userId,
      name: data.name,
      industry: '',
      size: '',
      location: '',
      verifiedStatus: 'Pending',
      website: '',
      about: '',
      logo: null,
      proofUrl: null,
      contacts: { email: key, phone: '' },
      registrationDate: new Date().toISOString(),
    });
    setCompanies(companies);
  }

  const user = { id: userId, email: key, name: data.name, role };
  setCurrentUser(user);
  return { ok: true, user };
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
    case 'seeker': return '/seeker/dashboard.html';
    case 'employer': return '/employer/dashboard.html';
    case 'admin': return '/admin/dashboard.html';
    default: return '/index.html';
  }
}
