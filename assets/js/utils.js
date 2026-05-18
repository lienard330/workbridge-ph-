/**
 * WorkBridge PH — Shared Utilities
 */

const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Escape HTML special characters to prevent XSS when inserting into innerHTML.
 * @param {*} str - Value to escape (non-strings are converted)
 * @returns {string} Safe HTML string
 */
export function esc(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, c => ESC_MAP[c]);
}

const PESO_FMT = new Intl.NumberFormat('en-PH', { maximumFractionDigits: 0 });

/**
 * Format a peso amount with grouping separators. `formatPeso(18000)` → `₱18,000`.
 * @param {number|string} amount
 */
export function formatPeso(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '—';
  return '₱' + PESO_FMT.format(n);
}

/**
 * Format a salary range for job cards/details.
 * `formatSalaryRange(18000, 25000)` → `₱18,000 – ₱25,000/month`
 * Returns "Salary not specified" if both ends are missing or zero.
 *
 * @param {number|string} min
 * @param {number|string} max
 * @param {string} [period='month'] - 'month' | 'year' | 'hour'
 */
export function formatSalaryRange(min, max, period = 'month') {
  const lo = Number(min) || 0;
  const hi = Number(max) || 0;
  if (!lo && !hi) return 'Salary not specified';
  if (lo && !hi) return `${formatPeso(lo)}+/${period}`;
  if (!lo && hi) return `Up to ${formatPeso(hi)}/${period}`;
  if (lo === hi) return `${formatPeso(lo)}/${period}`;
  return `${formatPeso(lo)} – ${formatPeso(hi)}/${period}`;
}

/* ---------- Company avatar (initials in colored circle) -------------------
   Pattern used by Linear, GitHub, Slack: when a company hasn't uploaded a
   logo, show the first 1–2 letters of the name on a colored background.
   Color is derived deterministically from the name so the same company
   always gets the same color — visual consistency across pages.        */

const AVATAR_COLORS = [
  '#4F46E5', '#0D9488', '#F59E0B', '#E11D48',
  '#10B981', '#0EA5E9', '#8B5CF6', '#EC4899',
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** "MediCare Samar Hospital" → "MS"  ·  "TechNova Solutions" → "TS" */
export function companyInitials(name) {
  if (!name) return '?';
  return String(name)
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/* ---------- Loading skeletons --------------------------------------------
   Use BEFORE async data lands. Mimics the shape of the real content so the
   layout doesn't shift (CLS). Replace innerHTML with the skeleton, then
   replace again with real content when data arrives. */

/** A skeleton placeholder for a single job card. Matches the card layout used
 *  on jobs.html, dashboard, etc. — avatar, title, company line, salary. */
export function skeletonJobCard() {
  return `<div class="card">
    <div class="card-body">
      <div class="d-flex gap-3 align-items-start mb-3">
        <span class="skeleton skeleton-circle" style="width:48px;height:48px;flex-shrink:0"></span>
        <div style="flex:1">
          <span class="skeleton skeleton-title" style="width:70%"></span>
          <span class="skeleton skeleton-text" style="width:45%"></span>
        </div>
      </div>
      <span class="skeleton skeleton-text" style="width:60%;margin-bottom:0"></span>
    </div>
  </div>`;
}

/** Render N skeleton job cards (e.g. while jobs.html loads). */
export function skeletonJobCards(count = 6) {
  return Array.from({ length: count }, () => skeletonJobCard()).join('');
}

/** Skeleton row for tables. `cols` is the number of <td>s. */
export function skeletonTableRow(cols = 4) {
  const cells = Array.from({ length: cols }, () =>
    `<td><span class="skeleton skeleton-text" style="width:80%;margin-bottom:0"></span></td>`
  ).join('');
  return `<tr>${cells}</tr>`;
}

/** Render N skeleton table rows. */
export function skeletonTableRows(count = 5, cols = 4) {
  return Array.from({ length: count }, () => skeletonTableRow(cols)).join('');
}

/** Skeleton for the dashboard stat card pattern (big number + label). */
export function skeletonStat() {
  return `<div class="stat-card card">
    <span class="skeleton" style="width:50%;height:2rem;margin-bottom:0.5rem"></span>
    <span class="skeleton skeleton-text" style="width:70%;margin-bottom:0"></span>
  </div>`;
}

/**
 * Renders a polished empty state with icon, title, subtitle, and optional action.
 * Used everywhere we'd otherwise show "No data yet" text. Encourages the user
 * forward instead of leaving them at a dead end.
 *
 * @param {Object} opts
 * @param {string} [opts.icon='inbox']  - Bootstrap Icon name without `bi-` prefix
 * @param {string} opts.title           - Headline ("No saved jobs yet")
 * @param {string} [opts.subtitle]      - Helpful explanation
 * @param {string} [opts.actionLabel]   - CTA button text
 * @param {string} [opts.actionHref]    - CTA button link
 * @returns {string} HTML
 */
export function emptyState({ icon = 'inbox', title, subtitle = '', actionLabel = '', actionHref = '' } = {}) {
  const action = actionLabel && actionHref
    ? `<a href="${esc(actionHref)}" class="btn btn-primary">${esc(actionLabel)}</a>`
    : '';
  return `<div class="empty-state">
    <div class="empty-state-icon"><i class="bi bi-${esc(icon)}"></i></div>
    <div class="empty-state-title">${esc(title)}</div>
    ${subtitle ? `<p class="empty-state-subtitle">${esc(subtitle)}</p>` : ''}
    ${action}
  </div>`;
}

/**
 * Twitter/X-style verified badge. Returns a small blue circle with a white
 * check next to the company name. Returns empty string if not verified, so
 * it's safe to interpolate unconditionally:
 *   `${esc(name)}${verifiedBadge(company)}`
 *
 * Accepts both normalized (`verifiedStatus`) and raw API (`verified_status`)
 * field names so callers don't need to remember which.
 *
 * @param {{verifiedStatus?:string, verified_status?:string}|null} company
 * @param {number} [size=14] - Diameter in pixels.
 */
export function verifiedBadge(company, size = 14) {
  if (!company) return '';
  const status = company.verifiedStatus || company.verified_status;
  if (status !== 'Verified') return '';
  return `<span title="Verified company" aria-label="Verified"
    style="display:inline-flex;align-items:center;justify-content:center;
    width:${size}px;height:${size}px;border-radius:50%;background:#0EA5E9;
    color:#fff;margin-left:4px;font-size:${Math.round(size * 0.7)}px;
    vertical-align:0.1em;flex-shrink:0;line-height:1"
    ><i class="bi bi-check-lg"></i></span>`;
}

/**
 * Returns an HTML string: an <img> if a logo URL is provided, otherwise a
 * colored initials block. Safe to interpolate into innerHTML.
 *
 * @param {{name?:string, logo?:string|null}|null} company
 * @param {number} [size=40] - Width/height in pixels.
 */
export function companyAvatar(company, size = 40) {
  const name = company?.name || 'Company';
  const logo = company?.logo;
  const px   = `${size}px`;
  const radius = `${Math.round(size / 5)}px`;

  if (logo) {
    return `<img src="${esc(logo)}" alt="${esc(name)} logo"
      style="width:${px};height:${px};border-radius:${radius};object-fit:cover;flex-shrink:0">`;
  }

  const initials = companyInitials(name);
  const color    = AVATAR_COLORS[hashString(name) % AVATAR_COLORS.length];
  const fontSize = `${Math.round(size * 0.42)}px`;

  return `<div aria-label="${esc(name)} logo"
    style="width:${px};height:${px};border-radius:${radius};background:${color};
    color:#fff;display:inline-flex;align-items:center;justify-content:center;
    font-weight:600;font-size:${fontSize};flex-shrink:0;letter-spacing:0.5px"
    >${esc(initials)}</div>`;
}
