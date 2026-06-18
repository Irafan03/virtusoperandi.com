# CLAUDE.md — Virtus Operandi website

Project-level guidance for Claude Code working on virtusoperandi.com.

## Project

Building **virtusoperandi.com** — company website presenting Virtus Operandi and its catalogue of software products and industry solutions.

- **Stack:** Astro (static site, some dynamic elements). Headless CMS and other services to be wired in later via API.
- **Hosting:** Cloudflare Pages with CI/CD rebuild on changes.
- **Phase 1 (current):** design guidelines + sitemap. Content will be supplied by user.

## Hard rules — non-negotiable

### 1. ALWAYS check reference sites the user gives you. No assumptions.
When the user shares a URL as a reference (font inspiration, color palette, layout, design vibe, etc.), you MUST actually fetch and inspect that site — never guess based on the URL or your memory of similar sites.

- Use WebFetch first; if the site is behind bot protection (Cloudflare 403, CAPTCHA, etc.), say so explicitly and ask the user for an alternative (screenshot, paste of CSS, different reference).
- If a fetcher returns markdown-stripped content (e.g. WebFetch removes `<style>` and `<link>` tags), switch to raw HTML via `curl` / Bash and grep the CSS.
- Verify exact values (font names, hex codes, weights, sizes) before applying them — not vibes.

### 2. NEVER claim something is checked without actually doing it.
If you say "I verified X" or "I confirmed Y" or "this matches Z", you must have run the tool call that produced that evidence in this session. No phantom verifications.

- If a check failed or was blocked, report the failure plainly and what you'd need to proceed.
- Phrases like "I checked", "I confirmed", "I verified", "this matches the reference" are claims of fact — only use them when backed by a real tool result.

### 3. Visual verification with Playwright — on user request only.
The Playwright visual test exists (`npm run test:visual`, screenshots at `tests/screenshots/home-{desktop,mobile}.png`) but **do not run it after every change**. Run it only when the user explicitly asks ("test it", "show me", "verify", "run playwright", etc.).

- When you do run it, Read the PNG and only then make claims like "I verified the grain is lighter".
- A green "passed" line alone does not back a visual claim — passing only means the page loaded.
- If the user hasn't asked for a check, just make the code change and describe what it does; let them refresh Live Server themselves.

### 4. Skip nothing. When a spec gives N items, implement N.
If a reference, hex list, layer stack, or list of properties is provided, implement **every** entry. Do not omit pieces because they seem minor (noise textures, micro-animations, secondary shadows, hover states, focus rings, etc.) or because they're inconvenient to source.

- If an asset is unavailable (e.g. a 3rd-party noise image), regenerate the same effect locally (inline SVG `<feTurbulence>`, base64, etc.) rather than dropping the layer.
- If something genuinely cannot be reproduced, surface it explicitly: "I couldn't reproduce X because Y — proposing Z as a stand-in, OK?" Don't silently skip.
- Never write "skipping for now" without flagging it back to the user and getting a yes/no.

### 5. Preserve structural delimiters in edits.
`</style>`, `</script>`, `</head>`, `</body>`, `</html>`, `</svg>` and other container-closing tags are not "just another line" — they're structural boundaries. Edits that touch them must restore them.

- After any non-trivial Edit inside `<style>` or `<script>` (especially edits that replace the closing line), grep the file for balanced open/close counts. Example:
  - `grep -cE '^<style|^</style' file.html` → both numbers must match
  - `grep -cE '<body|</body' file.html` → both must match
- An unbalanced count means the structure broke. Fix immediately before continuing — a missing `</style>` will consume the entire `<body>` as CSS and silently produce a blank page.

### 6. Visual tests must assert content, not just page-load.
A passing Playwright test on a **blank page** is worse than a failing one: it lulls you into false confidence. `npm run test:visual` is only meaningful if the test verifies key elements actually rendered.

- Every visual spec must include element-existence assertions in addition to taking the screenshot. At minimum, check that the hero headline is visible and a representative count of section elements is correct.
  ```js
  await expect(page.locator('.hero h1')).toBeVisible();
  await expect(page.locator('.show-row')).toHaveCount(6);
  ```
- Only after these assertions pass AND you've Read the resulting PNG may you claim "verified".
- If the screenshot file is suspiciously small (under ~50 KB for a full page), treat it as a failure even if Playwright reported PASS — the page probably rendered blank.

## Working directory layout

```
docs/             review artifacts (HTML — design system, sitemap, page previews)
src/              Astro source (to be scaffolded later)
public/           static assets (to be scaffolded later)
CLAUDE.md         this file
```

## Design system snapshot (v0.1)

- **Typography:** Open Sans (weights 300, 400, 600, 700) — sourced from Harbor (Salient theme) at user's request, verified via raw CSS inspection of the Salient main stylesheet.
- **Color palette:** sourced from cleveroad.com (user supplied computed CSS values since the site is Cloudflare-blocked). Tight 3-color system:
  - `--ink: #202020` (body bg / primary text on light)
  - `--paper: #FFFFFF` (light bg / text on dark)
  - `--blue: #0066FF` (primary CTA, all accents) · `--blue-hover: #0044A4` · `--blue-deep: #002060`
- **Layout:** 12-col grid, 1280px max, generous whitespace.
- Full details in `docs/design.html`.

## Sitemap snapshot

6 products (Virtus Lever, Fleet, AI Factory, Agents, GED, ERP) · 4 industries · Solutions · Company · Insights (CMS) · Contact · legal. Full IA in `docs/sitemap.html`; page-by-page content plan in `docs/pages.html`.
