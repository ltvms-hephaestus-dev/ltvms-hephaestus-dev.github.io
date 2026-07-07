# Hephaestus Dev (LTVMS) — Company Website

Single-page site: HTML + Tailwind CSS (CDN) + vanilla JS. No build step.

## Files

- `index.html` — the page
- `app.js` — mobile menu, scroll reveal, badges, copy-email, live GitHub repos + language bars
- `assets/logo.png` — **add your logo here** (the site shows an SVG hammer fallback until you do)

## Deploy to GitHub Pages

1. Create a repo named `ltvms-hephaestus-dev.github.io` (or any repo, e.g. `website`).
2. Push these files to the `main` branch root.
3. Repo → Settings → Pages → Source: `main` / root → Save.
4. Site goes live at `https://ltvms-hephaestus-dev.github.io/` (or `/website/` for a project repo).

## Notes

- Repos are fetched live from `api.github.com/users/ltvms-hephaestus-dev/repos`. Unauthenticated rate limit is 60 req/hr per visitor IP; the site shows a friendly message if throttled.
- With 0 public repos, the Work section shows a "forge is warming up" state automatically.
