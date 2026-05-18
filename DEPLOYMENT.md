# WorkBridge PH — Deployment Guide

This project has two parts to deploy:
- **Frontend** (static HTML) → Vercel (free)
- **Backend** (Laravel API) → Railway (free $5 credit/month)

---

## Prerequisites

- GitHub account (your repo: `https://github.com/lienard330/workbridge-ph-`)
- Vercel account (sign up at vercel.com with GitHub)
- Railway account (sign up at railway.app with GitHub)

---

## Part 1 — Deploy Frontend on Vercel

### Step 1 — Sign up
1. Go to **https://vercel.com**
2. Click **Sign Up** → **Continue with GitHub**
3. Authorize Vercel to access your GitHub

### Step 2 — Import your project
1. Click **Add New Project**
2. Find `workbridge-ph-` in the list → click **Import**

### Step 3 — Configure
Set these settings:
- **Framework Preset:** Other
- **Root Directory:** `/` (leave as default)
- **Build Command:** (leave empty)
- **Output Directory:** (leave empty)

### Step 4 — Deploy
1. Click **Deploy**
2. Wait ~1 minute
3. Vercel gives you a URL like: `https://workbridge-ph.vercel.app`
4. **Copy this URL** — you'll need it later

---

## Part 2 — Deploy Backend on Railway

### Step 1 — Sign up
1. Go to **https://railway.app**
2. Click **Login** → **Login with GitHub**
3. Authorize Railway to access your GitHub

### Step 2 — Create a new project
1. Click **New Project**
2. Click **Deploy from GitHub repo**
3. Select `lienard330/workbridge-ph-`
4. Set **Root Directory** to `backend`
5. Click **Deploy**

### Step 3 — Add MySQL database
1. In your Railway project, click **+ Create**
2. Click **Database** → click **MySQL**
3. Wait ~30 seconds for it to provision
4. Click the **MySQL service** → go to **Variables** tab
5. You will see these — **copy them somewhere**:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

### Step 4 — Generate APP_KEY
Run this command on your computer:
```bash
cd workbridge-ph-main/backend
php artisan key:generate --show
```
Copy the output (starts with `base64:...`)

### Step 5 — Set environment variables on Laravel service
1. Click your **Laravel service** (named `workbridge-ph-` or `backend`)
2. Click **Variables** tab → click **RAW Editor**
3. Paste all of this — replacing values with your actual credentials:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://YOUR-RAILWAY-URL.up.railway.app
APP_KEY=PASTE_YOUR_BASE64_KEY_HERE
DB_CONNECTION=mysql
DB_HOST=PASTE_MYSQLHOST_HERE
DB_PORT=PASTE_MYSQLPORT_HERE
DB_DATABASE=PASTE_MYSQLDATABASE_HERE
DB_USERNAME=PASTE_MYSQLUSER_HERE
DB_PASSWORD=PASTE_MYSQLPASSWORD_HERE
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
MAIL_MAILER=log
```

4. Click **Update Variables** — Railway will auto-redeploy
5. Wait for deployment to finish (green checkmark)
6. Copy your Railway URL (e.g. `https://workbridge-backend.up.railway.app`)

---

## Part 3 — Connect Frontend to Backend

### Step 1 — Update the API URL
Open `assets/js/api.js` and replace `REPLACE-WITH-YOUR-RAILWAY-URL` with your actual Railway domain:

```js
const BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8080/api'
    : 'https://YOUR-ACTUAL-RAILWAY-URL.up.railway.app/api';
```

### Step 2 — Push to GitHub
```bash
cd workbridge-ph-main
git add .
git commit -m "set production API URL"
git push
```

Vercel automatically redeploys when you push — your live site updates in ~1 minute.

---

## Part 4 — Verify Everything Works

1. Open your Vercel URL in the browser
2. The homepage should load and show job listings
3. Try logging in with a demo account:
   - **Seeker:** `juan@example.com` / `password`
   - **Employer:** `hr@technova.ph` / `password`
   - **Admin:** `admin@workbridge.ph` / `password`

---

## Your Live URLs (fill in after deployment)

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://_________________.vercel.app` |
| Backend (Railway) | `https://_________________.up.railway.app` |

---

## Updating the App After Deployment

Every time you make changes, just push to GitHub:

```bash
cd workbridge-ph-main
git add .
git commit -m "describe your changes"
git push
```

- **Vercel** auto-redeploys the frontend in ~1 minute
- **Railway** auto-redeploys the backend in ~2 minutes

---

## Running Locally

### Backend
```bash
cd workbridge-ph-main/backend
composer run dev
```
Visit: http://127.0.0.1:8080

### Frontend
```bash
cd workbridge-ph-main
npm run serve
```
Visit: http://localhost:3000

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Frontend shows "Could not load jobs" | Check Railway is running. Check API URL in `assets/js/api.js` |
| Railway deploy fails | Check all environment variables are set correctly |
| Login doesn't work | Make sure `APP_KEY` is set in Railway variables |
| Images not showing | Run `php artisan storage:link` in Railway console |
| Database errors | Check all `DB_*` variables match the MySQL service credentials |
