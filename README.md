# Fan Hub Plus — static frontend (no PHP / MySQL / Laravel)

Open `index.html`, or upload this whole folder to any static host (Netlify, GitHub Pages, cPanel, Vercel...).
Pages load Font Awesome, Google Fonts and Chart.js from CDNs, so an internet connection is needed.

## Structure
- `*.html` (root) — public site (home, 16 category/genre pages, articles, events, characters, merchandise, auth, dashboard, profile, bookmarks, submissions, bot...)
- `assets/` — site CSS, JS, videos. `assets/js/site-api.js` is a browser-only mock of the old `/frontend/*` Laravel API.
- `admin/` — admin panel (153 pages) with its own `admin/assets/`. Start at `admin/login.html` (any email/password works).

## Demo logins (stored in the browser's localStorage)
| Role | Email | Password |
|------|-------|----------|
| User | test@example.com | password |
| Admin (opens `admin/dashboard.html`) | admin@fanhubplus.com | password |

Any other email creates a temporary account. Registration, bookmarks, ratings, submissions and feedback are kept in localStorage only.

## Notes
- Public list pages (anime, movies, articles, events, characters, merchandise...) use the built-in sample data that ships inside the original page scripts.
  To show the seeded catalog instead, set `USE_SEED_CONTENT = true` at the top of `assets/js/site-api.js`.
- Admin add / edit / delete / approve actions are visual only (toast + redirect). Nothing is saved.
- Files the original project referenced but never shipped were added: `favicon.svg`, `page-users.css`, `page-error.css`; `character-single.css` points to the existing `charachter-single.css`; `forgot-password.html` now loads `auth.js`.
