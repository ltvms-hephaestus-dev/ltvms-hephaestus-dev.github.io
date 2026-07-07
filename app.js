/* ============================================================
   Hephaestus Dev (LTVMS) — app.js
   Vanilla JS: nav, reveal animations, badges, GitHub live work
   ============================================================ */
'use strict';

const GITHUB_USER = 'ltvms-hephaestus-dev';
const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;
const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`;
const MAX_REPOS = 6;

/* ---------- SVG hammer fallback (used by onerror on logo imgs) ---------- */
window.hammerSvg = function (classes) {
  const wrap = document.createElement('span');
  wrap.innerHTML =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="1.6"
          class="${classes}" role="img" aria-label="Hephaestus Dev hammer emblem">
       <rect x="6" y="3" width="12" height="6" rx="1" fill="#1e293b" stroke="#94a3b8"/>
       <rect x="10.5" y="4.5" width="3" height="3" rx="0.5" fill="#22d3ee" stroke="#22d3ee"/>
       <path d="M11 9h2v11a1 1 0 0 1-2 0V9z" fill="#f97316" stroke="#f59e0b"/>
     </svg>`;
  return wrap.firstElementChild;
};

/* ---------- Language color map (GitHub-ish, with fallback) ---------- */
const LANG_COLORS = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Java: '#b07219', Python: '#3572A5',
  Go: '#00ADD8', HTML: '#e34c26', CSS: '#663399', SCSS: '#c6538c', Vue: '#41b883',
  Shell: '#89e051', Dockerfile: '#384d54', Kotlin: '#A97BFF', Dart: '#00B4AB',
  C: '#555555', 'C++': '#f34b7d', 'C#': '#178600', Ruby: '#701516', PHP: '#4F5D95',
  Rust: '#dea584', Swift: '#F05138',
};
const FALLBACK_COLORS = ['#f97316', '#f59e0b', '#22d3ee', '#a78bfa', '#34d399', '#f472b6'];
const langColor = (lang, i) => LANG_COLORS[lang] || FALLBACK_COLORS[i % FALLBACK_COLORS.length];

/* ---------- Utilities ---------- */
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return ''; }
};

/* ============================================================
   1. Mobile menu
   ============================================================ */
(function initMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    })
  );
})();

/* ============================================================
   2. Scroll reveal
   ============================================================ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
})();

/* ============================================================
   3. Tech stack badges
   ============================================================ */
(function initBadges() {
  document.querySelectorAll('[data-badges]').forEach((box) => {
    box.dataset.badges.split(',').forEach((label) => {
      const b = document.createElement('span');
      b.className =
        'rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-200 ' +
        'transition hover:border-forge-copper hover:text-forge-copper';
      b.textContent = label.trim();
      box.appendChild(b);
    });
  });
})();

/* ============================================================
   4. Copy email + footer year
   ============================================================ */
(function initContact() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const btn = document.getElementById('copy-email');
  const feedback = document.getElementById('copy-feedback');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const email = 'ltvms.hephaestus.dev@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      if (feedback) feedback.textContent = 'Email copied to clipboard!';
    } catch {
      if (feedback) feedback.textContent = email; // fallback: just show it
    }
    setTimeout(() => { if (feedback) feedback.textContent = ''; }, 2500);
  });
})();

/* ============================================================
   5. Live GitHub repositories + language metrics
   ============================================================ */
const grid = document.getElementById('repo-grid');

function renderSkeletons(n = 3) {
  grid.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const card = document.createElement('div');
    card.className = 'rounded-lg border border-slate-800 bg-forge-surface p-6';
    card.innerHTML = `
      <div class="skeleton mb-4 h-5 w-2/3 rounded"></div>
      <div class="skeleton mb-2 h-3 w-full rounded"></div>
      <div class="skeleton mb-6 h-3 w-5/6 rounded"></div>
      <div class="skeleton h-3 w-full rounded-full"></div>`;
    grid.appendChild(card);
  }
}

function renderMessage({ title, body, isError = false }) {
  grid.innerHTML = '';
  const el = document.createElement('div');
  el.className =
    'col-span-full rounded-lg border border-slate-800 bg-forge-surface p-10 text-center ' +
    (isError ? 'border-forge-copper/40' : '');
  el.innerHTML = `
    <p class="text-lg font-semibold text-slate-100">${esc(title)}</p>
    <p class="mt-2 text-sm text-slate-400">${esc(body)}</p>
    <a href="${GITHUB_PROFILE}" target="_blank" rel="noopener"
       class="mt-5 inline-block rounded-md border border-forge-copper px-5 py-2 text-sm font-semibold text-forge-copper transition hover:bg-forge-copper hover:text-slate-950">
      Visit our GitHub
    </a>`;
  grid.appendChild(el);
}

function renderLanguageBar(container, languages) {
  const entries = Object.entries(languages || {});
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (!entries.length || total === 0) {
    container.innerHTML = '<p class="text-xs text-slate-500">No language data available.</p>';
    return;
  }
  const parts = entries
    .map(([lang, bytes], i) => ({ lang, pct: (bytes / total) * 100, color: langColor(lang, i) }))
    .sort((a, b) => b.pct - a.pct);

  const bar = document.createElement('div');
  bar.className = 'flex h-2.5 w-full overflow-hidden rounded-full bg-slate-800';
  bar.setAttribute('role', 'img');
  bar.setAttribute('aria-label', 'Language breakdown: ' + parts.map((p) => `${p.lang} ${p.pct.toFixed(1)}%`).join(', '));
  parts.forEach((p) => {
    const seg = document.createElement('div');
    seg.style.width = `${p.pct}%`;
    seg.style.backgroundColor = p.color;
    seg.title = `${p.lang} ${p.pct.toFixed(1)}%`;
    bar.appendChild(seg);
  });

  const legend = document.createElement('div');
  legend.className = 'mt-2 flex flex-wrap gap-x-4 gap-y-1';
  parts.forEach((p) => {
    const item = document.createElement('span');
    item.className = 'inline-flex items-center gap-1.5 text-xs text-slate-400';
    item.innerHTML =
      `<span class="inline-block h-2 w-2 rounded-full" style="background-color:${p.color}"></span>` +
      `${esc(p.lang)} <span class="text-slate-500">${p.pct.toFixed(1)}%</span>`;
    legend.appendChild(item);
  });

  container.innerHTML = '';
  container.appendChild(bar);
  container.appendChild(legend);
}

function renderRepoCard(repo) {
  const card = document.createElement('article');
  card.className =
    'forge-card flex flex-col rounded-lg border border-slate-800 bg-forge-surface p-6 transition hover:border-forge-copper/50';
  card.innerHTML = `
    <div class="mb-2 flex items-start justify-between gap-3">
      <a href="${esc(repo.html_url)}" target="_blank" rel="noopener"
         class="break-all text-base font-bold text-slate-100 transition hover:text-forge-copper">${esc(repo.name)}</a>
      <span class="inline-flex shrink-0 items-center gap-1 text-xs text-slate-400" title="Stars">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-forge-amber" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.4 4.3a1 1 0 00.95.7h4.52c.97 0 1.37 1.24.59 1.81l-3.66 2.66a1 1 0 00-.36 1.12l1.4 4.3c.3.92-.76 1.69-1.54 1.12l-3.66-2.66a1 1 0 00-1.18 0l-3.66 2.66c-.78.57-1.84-.2-1.54-1.12l1.4-4.3a1 1 0 00-.36-1.12L1.59 9.74c-.78-.57-.38-1.81.59-1.81h4.52a1 1 0 00.95-.7l1.4-4.3z"/>
        </svg>
        ${Number(repo.stargazers_count) || 0}
      </span>
    </div>
    <p class="mb-4 flex-1 text-sm leading-relaxed text-slate-400">${esc(repo.description || 'No description provided.')}</p>
    <div class="lang-container mb-3"><div class="skeleton h-2.5 w-full rounded-full"></div></div>
    <p class="text-xs text-slate-500">Updated ${esc(fmtDate(repo.updated_at))}</p>`;
  return card;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) {
    const err = new Error(`GitHub API responded ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function loadRepositories() {
  if (!grid) return;
  renderSkeletons();

  let repos;
  try {
    repos = await fetchJson(REPOS_URL);
  } catch (err) {
    const rateLimited = err.status === 403 || err.status === 429;
    renderMessage({
      title: rateLimited ? 'GitHub rate limit reached' : 'Could not load repositories',
      body: rateLimited
        ? 'The GitHub API is temporarily throttling requests. Please try again in a few minutes, or browse our profile directly.'
        : 'Something went wrong while contacting GitHub. You can still browse our work directly on our profile.',
      isError: true,
    });
    return;
  }

  if (!Array.isArray(repos) || repos.length === 0) {
    renderMessage({
      title: 'The forge is warming up',
      body: 'Public repositories are coming soon. Follow our GitHub profile to see new work the moment it ships.',
    });
    return;
  }

  const top = repos.slice(0, MAX_REPOS);
  grid.innerHTML = '';
  const cards = top.map((repo) => {
    const card = renderRepoCard(repo);
    grid.appendChild(card);
    return card;
  });

  // Fetch language breakdowns in parallel; one failure must not break others.
  const results = await Promise.allSettled(top.map((repo) => fetchJson(repo.languages_url)));
  results.forEach((result, i) => {
    const container = cards[i].querySelector('.lang-container');
    if (result.status === 'fulfilled') {
      renderLanguageBar(container, result.value);
    } else {
      container.innerHTML = '<p class="text-xs text-slate-500">Language data unavailable.</p>';
    }
  });
}

loadRepositories();
