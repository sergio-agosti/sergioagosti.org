# Projects reference

Research notes behind `src/data/projects.json`. Everything here was read out of the
repositories under `/Volumes/Sites/` on 2 September 2026 — dependency manifests, config
files, route definitions, READMEs and ADRs — rather than recalled. Date ranges come from
`git log --reverse --format=%ad --date=format:%Y-%m` (first commit) and
`git log -1` (last commit) in each repo.

Keep this in sync when the page changes. The point of it is so the next rewrite doesn't
have to re-derive the stacks, and so the corrections below don't creep back in.

---

## Contents

- [Corrections this replaced](#corrections-this-replaced)
- [Repository to page-entry map](#repository-to-page-entry-map)
- [Featured](#featured)
- [Client work](#client-work)
- [Personal](#personal)
- [Live URL status](#live-url-status)
- [Editorial decisions](#editorial-decisions)
- [Unverified and open](#unverified-and-open)

---

## Corrections this replaced

The previous copy got these wrong. They are the things most likely to be reintroduced from
memory, so they are recorded explicitly.

| Claim previously on the page                                             | Actual                                                                                             |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| UST assessment ran "serverless APIs on AWS Lambda"                       | Firebase Cloud Functions v2 on Google Cloud, with Firestore and Firebase Hosting. No AWS anywhere. |
| "Enterprise marketing sites for two global insurers"                     | Ardonagh Group and Price Forbes are insurance **brokers**, and Price Forbes is part of Ardonagh.   |
| "A shared Pug and Tailwind component system reused across both insurers" | Ardonagh is Pug/Gulp/Tailwind static modules; Price Forbes is WordPress/Sage/Blade. Not shared.    |
| Champion stack listed MySQL and Lumen                                    | MongoDB via `jenssegers/mongodb`, and Laravel 5.1 with the Dingo API package, not Lumen.           |
| Champion described as a "dealer network" of sites                        | Brand sites; dealers/retailers are content **within** them. Count left generic on the page.        |
| G42 was "a gated portal" with "an authenticated area behind it"          | The public narrative is not gated. NextAuth protects the in-app CMS and API routes only.           |
| G42 stack listed "Headless CMS"                                          | A custom CMS in the same Next.js app over MongoDB, in a `(cms)` route group.                       |
| CMS: "each editor works in a workspace on its own Git branch"            | Workspaces are per **slug** (`cms/ws/<slug>`); editors share one branch and one agent (ADR-0006).  |
| CMS: "a shared asset library"                                            | Workspace-scoped. ADR-0004 explicitly rejects a shared object store; bytes live in Git.            |
| Hiscox: "single sign-on across products built on different stacks"       | Not found in the repos surveyed. Each product has its own auth. Claim dropped.                     |
| Hiscox stack listed Gatsby                                               | No trace of Gatsby in any of the seven Hiscox repos.                                               |
| Hiscox `hci-pro` called a "client portal"                                | Internal tool for Hiscox staff.                                                                    |
| Kids Coding Programme stack listed Vite                                  | Runs on **Bun**.                                                                                   |
| Frontflow: "a module system for composing marketing sites"               | An agency front-end **boilerplate**. Era was also wrong (see its entry).                           |
| IBM: "campaign landing pages"                                            | Three multi-page microsites across three eras, plus the email programme.                           |

---

## Repository to page-entry map

Several page entries cover more than one repository.

| Page entry                   | Repositories                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| The Frameworks website CMS   | `thef-cms-web`                                                                        |
| G42 Intelligence Grid        | `g42-intelligence-grid-web` (plus a `g42-intelligence-grid-cms` folder)               |
| Hiscox Cyber Maturity Model  | `hiscox-hmm-api`, `hiscox-hmm-web`, `hiscox-hmm-web-components`                       |
| Hiscox Cyber Insight PRO     | `hiscox-hci-pro`, absorbing `hiscox-cca-web` and `hiscox-cyber-dashboard-web`         |
| Hiscox Cyber Fusion Portal   | `hiscox-cyber-fusion-portal`                                                          |
| UST NavigatorAI              | `ust-ai-assessment-tool-api`, `-web`, plus the `-aws-api` / `-aws-web` variants       |
| Canton Tea                   | `canton-tea-shopify-theme` (plus three older Canton Tea repos)                        |
| Price Forbes RE              | `ardonagh-pfre-web`                                                                   |
| Estorick Collection          | `estorick-collection-website` (plus `estorick-collection`, `estorick-collection-web`) |
| Maersk Innovation Center     | `maersk-innovation-center-cms`, `maersk-innovation-center-website`                    |
| Price Forbes                 | `price-forbes-website`                                                                |
| Champion Homes brand network | `champion-hom-api`, `champion-hom-cms`, `champion-hom-web`, and ~25 siblings          |
| Ardonagh Community Trust     | `ardonagh-act-website-front-end`, `ardonagh-act-website-modules`                      |
| Ardonagh Group corporate     | `ardonagh-website-front-end`, `ardonagh-website-modules`                              |
| Frontflow                    | `frontflow`                                                                           |
| This is IBM                  | `ibm-of-things` (2018 build), `ibm-this-is-ibm` (2020 rebuild)                        |
| HTML email programme         | `ibm-newsletters`                                                                     |
| Dematic Micro Fulfilment     | `dematic-micro-fulfilment`                                                            |
| Kids Coding Programme        | `kids-coding-programme`                                                               |
| Family Menu Planner          | `family-menu-planner`                                                                 |
| Frontend experiments         | `monospace-compare`, `frontend-playground`, `geist-mono-opentype-features`            |
| _not on the page_            | `ibm-tealeaf` (2014–15 Middleman microsite, dropped as unrepresentative)              |

---

## Featured

### The Frameworks website CMS — `thef-cms-web`

**Git:** 2026-06 → 2026-09. The ADR set is mature relative to that span, so history was
probably re-initiated. The page says 2026–present on the basis of the git record.

A pnpm monorepo (Node ≥22, pnpm 11.8) containing the agency's own Astro marketing site plus
the editing plane that publishes it.

| App                            | What it is                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `apps/web`                     | Astro ^7.2.9 static site, `rawBlocks` content model, Tailwind ^4.3.3, Zod, Sharp, Vitest |
| `apps/cms`                     | Node WebSocket bridge + SolidJS ^1.9 chat UI (Vite ^8, Tailwind 4, TipTap)               |
| `apps/orchestrator`            | Workspace control plane — create, list, wake, reap — plus a dashboard                    |
| `apps/insights-engine`         | Separate grounded Q&A product, deployed independently                                    |
| `apps/dev`                     | CLI for design-token and Figma asset sync                                                |
| `apps/brand-temperature-check` | Domain docs only in this checkout; no `package.json`, not runnable                       |
| `packages/*`                   | `blocks`, `cms-preview`, `config`, `design-tokens`, `source-doc-oauth`, `ui`             |

The agent is Pi (`@earendil-works/pi-coding-agent` ^0.82.1) driven in RPC mode, editing
`apps/web/src/pages/**`. Provider is configurable via `CMS_PROVIDER` (OpenCode Go,
OpenRouter, others).

**Deployment is split:** the public site is a static build on DigitalOcean App Platform from
`master` (`.do/app.yaml`); the editing plane runs on an Ubuntu droplet behind Docker, Traefik
and oauth2-proxy. Auth is Google Workspace OIDC; `CMS_AUTH_DISABLED=true` locally.

Load-bearing ADRs:

| ADR             | Decision                                                                            |
| --------------- | ----------------------------------------------------------------------------------- |
| 0001            | CMS editing plane on a droplet; idle runtimes reaped, cold-start on reopen          |
| 0002            | Publish is a squash-merge onto the base branch with optimistic retry                |
| 0003            | SolidJS + Tailwind 4 shared UI                                                      |
| 0004            | **Assets are workspace-scoped in Git** — a shared object store was rejected         |
| 0005            | Assets referenced by id through a manifest (`apps/web/src/assets/manifest.json`)    |
| 0006            | **One shared agent per runtime with fan-out** — editors share a workspace           |
| 0007            | Durable transcript stored on a workspace Git ref                                    |
| 0009            | Direct inline editing as a second authoring path, alongside chat                    |
| 0011            | Semantic HTML content model for inline editing                                      |
| 0016            | Asset metadata generation side-channel — alt text and filenames from a vision model |
| 0021, 0027–0030 | GridSection cells: free layout, forms, video, Lottie, listing cards                 |

Live preview is `astro dev` on `:4321`, proxied at `/__preview` through the bridge on
`:3100`, with the Vite HMR socket passed through. Tests are Vitest across cms, web,
orchestrator and packages. CI is `.github/workflows/ci.yml` (lint + web build) and
`deploy-cms.yml` (SSH to droplet, path-filtered so content-only publishes don't redeploy).

Other things worth remembering: multi-user shared chat with queued turns, a
publish/conflict-review flow when rebases conflict, and source-doc OAuth for Google Docs
import.

### G42 Intelligence Grid — `g42-intelligence-grid-web`

**Git:** 2025-05 → 2026-06. **Live:** `intelligencegrid.g42.ai`.

Next.js ^16.2.6 App Router with route groups `(web)` and `(cms)`, React 19, TypeScript 5.9,
Tailwind v4, pnpm 11 / Node 24.

- **UI:** Radix UI, shadcn-style components, `motion` (Framer Motion successor),
  `lottie-react`, `nuqs` for URL state, SWR.
- **Data:** Mongoose ^8.24 over MongoDB. Models: Story, Company, Collaboration, Commitment,
  Impact, Focus, Layer, Global, File, User, plus video/image generation models.
- **Media and AI:** `@aws-sdk/client-s3`, OpenAI SDK, `@ts-ffmpeg/fluent-ffmpeg`, `sharp`,
  Resend for email. `/api/generate-videos` calls `api.aimlapi.com`.
- **Routing:** nested dynamic segments such as
  `/companies/[companySlug]/stories/[storySlug]` and
  `/collaborations/[collaborationSlug]/[focusSlug]`. Home page is `force-dynamic`.

**Auth, precisely:** NextAuth v5 beta with a Credentials provider, bcrypt against the Mongo
`User` model. `AuthWrapper` requires both `emailVerifiedAt` and an assigned role
(`admin` | `editor`); users without a role land on `/auth/awaiting-approval`. API routes are
guarded by a `withAuth()` higher-order function. **The public `(web)` routes are not gated.**

**Design tokens:** a Tailwind v4 `@theme` block defines `--color-g42-green`,
`--color-silicon-black`, `--color-warm-white`, a `--text-sm` through `--text-3xl` scale, and a
per-story `--color-accent` override. The G42 Sans typeface is self-hosted through
`next/font/local` (`assets/fonts/index.ts`, six woff2 weights, `--font-g42-sans`).

The CMS has an iframe preview (`AppWebsitePreview`) whose `PreviewTracker` posts navigation
back to the parent. CMS forms use react-hook-form with Zod resolvers. No i18n (`lang="en"`).
No tests. Husky, lint-staged, Prettier, ESLint; no CI workflows or `vercel.json` in-repo.

---

## Client work

Ordered as on the page: most recent last activity first.

### Hiscox Cyber Maturity Model

Three repos, one product. HMM = Hiscox Maturity Model.

| Repo                        | Role                         | Git               |
| --------------------------- | ---------------------------- | ----------------- |
| `hiscox-hmm-api`            | REST API for both variants   | 2021-01 → 2026-09 |
| `hiscox-hmm-web`            | 40-question public site      | 2021-02 → 2026-09 |
| `hiscox-hmm-web-components` | 10-question embeddable modal | 2021-01 → 2024-12 |

**API:** PHP 8.3+, Laravel 8.83, `astrotomic/laravel-translatable` across de, en_US, en_GB,
es, fr, nl. Content, questions, ratings and result copy are stored translated in the
database and seeded. Locale middleware on API routes. Email verification by throttled PIN
before responses are accepted (`enforce.verification` middleware). AWS S3 via flysystem,
`maatwebsite/excel` exports, reCAPTCHA v3. Requires the private Composer package
`theframeworks/hiscox-hci-laravel`. Gate routes are `/gate/*`; the full set is `/questions`
and `/responses/*`.

**Web:** Nuxt 2.18 with `target: "static"`, Vue 2, Tailwind, Pug, Stylus. Static routes are
generated per locale from the API's own `/locales` list, pages living under
`pages/_locale/`. Separate server (`API_TOKEN`) and browser (`API_BROWSER_TOKEN`) bearer
tokens. Custom CSP nonce injection for static generate, with nginx filling placeholders;
redirects implemented on Laravel Forge. Live at `mm.hiscoxcyberinsight.com`.

**Web components:** Vue 2.7 built with `--target wc --name hmm-modal`. A host page loads the
bundle and writes `<hmm-modal trigger="…" config="…">`; the `config` key resolves against
the API's `/settings/{uuid}` for per-integration locale and CTA copy. Calls
`/gate/questions`, `/gate/rating`, `/gate/responses`, `/pin/generate`.

### Hiscox Cyber Insight PRO — `hiscox-hci-pro`

**Git:** 2020-09 → 2026-06. **Live:** `pro.hiscoxcyberinsight.com` (login wall, unlinked).
HCI = Hiscox Cyber Insight.

Internal tool for Hiscox staff: domain search and risk reporting, company and platform
management, user approval, data exports, bulk domain reports.

PHP 8.4, Laravel 12, Jetstream 5 (Livewire stack), Fortify, Livewire 3, Sanctum, Horizon,
Laravel Nightwatch, Vite 7, Tailwind 3, Alpine CSP build, pnpm 10.

- **Intelligence sources:** BitSight, Clearbit, BuiltWith, Shodan, plus Azure company
  ratings over Microsoft Graph OAuth.
- **Reporting:** `spatie/laravel-pdf` with Puppeteer; Chart.js 4 from CDN for risk scores;
  `maatwebsite/excel` for exports.
- **Auth:** email/password with verification, then **mandatory 2FA** with a configurable
  grace period (`config/mfa.php`). `spatie/laravel-permission` roles include
  `export-maturity`, `export-cca-validations`, `admin-users`.
- **i18n:** six locales (de, en, es, fr, nl, pt) with UUID-keyed translation strings.
- **API:** Sanctum-authenticated `/api/companies`, `/api/domains`, `/api/searches`, webhooks.
  Swagger UI present.
- **Cross-product reads:** the HMM API for maturity exports
  (`HISCOX_HMM_API_BASE_URI` → `/gate/responses/export`, `/responses/export`), and the
  CyberClear Academy `validations` table over a PostgreSQL connection literally named
  `hiscox-cca`.
- Extensive PHPUnit. Deployment via `deploy/stg` and `deploy/prd` branches; docker-compose
  present; no GitHub Actions.

**Folded into this entry:**

- `hiscox-cca-web` — CyberClear Academy, 2022-09 → 2026-06. PHP 8.4, Laravel 12, Livewire 4
  beta, Tailwind 4, Vite 7. A country grid opens a per-country modal; a policy number and
  organisation name are validated against country-specific regexes in `config/hiscox.php`,
  then the user is redirected to a jurisdiction-specific training platform (CybSafe,
  `riskacademy.hiscox.co.uk`, `hiscox.meetpaladin.com`). Locales en, fr, es, nl, pt.
  `spatie/laravel-csp` with a `POST /csp-report` endpoint.
- `hiscox-cyber-dashboard-web` — 2020-01 → 2020-04. The earlier prototype of the same domain
  lookup: a single-route Vue 2.6 / Vue CLI 3 SPA calling `${VUE_APP_API_BASE_URI}/risks?domain=`
  with a static bearer token, rendering risk score, risk factors, infrastructure analysis,
  exposed credentials and compromised systems. Backend is not in any surveyed repo.

### UST NavigatorAI

**Git:** 2023-09 → 2026-05 (both api and web). Client is UST, a global digital-services firm.

A lead-generation assessment. Flow: Profile (LinkedIn sign-in and company selection) →
Challenges → Questions → Results → Contact, with session state in `sessionStorage`.

**API — `ust-ai-assessment-tool-api`:** Firebase Cloud Functions v2 (`firebase-functions`
^6.5, Node 22 runtime), Firestore, Storage rules. **Not AWS.** OpenAI `gpt-4o` via the
`openai` SDK in `functions/openai.js` generates challenges, questions and action
recommendations from prompt templates. Company data enriched via **CoreSignal**. HubSpot
notes written inline from `index.js`. Weekly scheduled PDF and email reports via `onSchedule`,
SendGrid and PDFKit. LinkedIn OAuth code exchange plus userinfo in `linkedin.js`, exported as
an HTTP function. Deployed with `firebase deploy --only functions`. No CI.

`functions/gemini.js` exists using `@google-cloud/vertexai` but is not imported by
`index.js` — a dead path.

**Web — `ust-ai-assessment-tool-web`:** React 19, Vite 5, React Router 6, Tailwind 3,
`react-linkedin-login-oauth2` with a `/linkedin` callback route, Firebase client SDK,
deployed to **Firebase Hosting**. Callables listed in `src/utils/firebase.jsx`.

**The AWS variant is not an infrastructure rewrite.** `ust-ai-assessment-tool-aws-api`
(2023-09 → 2026-06) and `-aws-web` (2023-09 → 2024-11) are the same Firebase architecture;
the difference is branding ("UST NavigatorAI for AWS", AWS logo) and
`prompts/actions.txt` aligning recommendations to AWS AI products rather than UST services.
The AWS web variant is on React 18 and looks less maintained.

### Hiscox Cyber Fusion Portal — `hiscox-cyber-fusion-portal`

**Git:** 2025-08 → 2026-05. CFP = Cyber Fusion Portal. No public URL; Entra-gated.

Next.js 15 with standalone Docker output, React 19, TypeScript. Payload CMS 3.85 on
`@payloadcms/db-postgres` with Lexical rich text, in the same app. next-auth 5 beta against
**Microsoft Entra ID**. Tailwind CSS 4, `@base-ui/react`, Azure Blob storage plugin, pnpm 11,
Node 22. `@ai-stack/payloadcms` AI plugin on the Pages collection. Video processing through
`@ts-ffmpeg/fluent-ffmpeg` and `sharp`.

Collections: Users, Media, Pages, Services, Parameters, Requests, Tags,
FormSubmissionAttempts, FrontendUserPreferences. Globals: Blog, Home, Footer, Settings.

Service request forms use reCAPTCHA v3, per-user rate limiting with lockout after repeated
attempts, file validation and server actions, then forward to an external
`REQUEST_ENDPOINT_URL`. Tests are Vitest integration (`tests/int/`) and Playwright e2e
(`tests/e2e/`). `pnpm ci` runs `payload migrate && pnpm build`.

### Canton Tea — `canton-tea-shopify-theme`

**Git:** 2025-02 → 2026-04. Page era is 2023–2026 with the note "rebuilt in 2025; theme since
replaced" — per Sergio, he rebuilt it in 2025 and that build has since been replaced too.
Older siblings: `_canton-tea-shopify-theme`, `canton-tea-2023-shopify`,
`canton-tea-retailer-shopify`.

Shopify theme: Liquid templates, sections and snippets covering product, collection, cart,
search and blog, with HubSpot form integration.

Build pipeline is **Vite 7** with `vite-plugin-shopify` and
`@by-association-only/vite-plugin-shopify-clean` rather than Shopify's default asset
handling. TypeScript 5.9 in strict mode, Alpine components under
`frontend/entrypoints/alpine/*.ts`. Tailwind CSS 4 via `@tailwindcss/vite`. Alpine.js 3.15
with `@alpinejs/intersect` and `@alpinejs/persist`. pnpm 10, Shopify CLI 3, mise pinning
Node 24. `dev` runs `shopify theme dev` and `vite` concurrently; `build` adds a HubSpot font
embed; `push` builds then `shopify theme push`.

**Accessibility evidence is real and in the Liquid:** `aria-label`, `aria-expanded`,
`aria-live`, `aria-current`, carousel `role` and `aria-roledescription`, `sr-only` text for
quantity, search and infusion labels, `role="alert"` on form errors, `has-focus-visible` on
the header. There is no a11y test suite. Note the `lint` script references eslint, but eslint
is not in the dependencies and no config exists — the lint setup is incomplete.

Domains referenced in-repo: `cantonteaco.com` (`scripts/update-blog-authors.js`),
`origintea.co.uk` (`static-landing/`), `canton-tea-retail.myshopify.com` (`vite.config.ts`).

### Price Forbes RE — `ardonagh-pfre-web`

**Git:** 2024-04 → 2026-04, 142 commits. Remote `theframeworks/ardonagh-pfre-web`. Price
Forbes RE (Real Estate) sits under Ardonagh Specialty Limited.

WordPress 6.9.4 via `roots/wordpress` in a **Bedrock** layout (`web/wp`, `web/app/`), PHP
^8.1. Theme `price-forbes-re-2024` is **Roots Sage 6** with **Acorn 4.3**, Laravel Blade,
**Bud 6.23.3** and Tailwind through `@roots/bud-tailwindcss`. Node 20 and pnpm 9 via
`.mise.toml`.

Gutenberg blocks are **individual `thef-*` must-use plugins** built with
`@wordpress/scripts` ^26.19, each with Blade render callbacks;
`composer thef-build-plugins` loops them. This is the pattern that lets blocks be shared
with the sibling Price Forbes site.

Notable Composer deps: Gravity Forms 2.10 (bundled zip), `log1x/poet` (a `person` custom post
type with country, expertise and job-role taxonomies), `log1x/sage-directives`, `sage-svg`,
`spatie/laravel-google-fonts`, `spatie/laravel-googletagmanager`, `roots/acorn-mail`.
wpackagist plugins: Yoast SEO, WP 2FA, EWWW Image Optimizer, nginx-cache, Sucuri, SVG
Support, Page Links To. Third-party overlay plugins `s17-tweaks` and
`s17-news-carousel-hero` come from Source 17 Ltd / Hut 3.

A custom `people_editor` role is defined in the theme's `setup.php`. Caching is nginx
full-page, with `refresh-cache.php` plus `thef_clear_cache` / `thef_generate_cache` doing
Guzzle sitemap warmup. `composer test` runs PHPCS (PSR-2) only; no PHPUnit, no CI. The root
README is stock Bedrock boilerplate.

### Estorick Collection — `estorick-collection-website`

**Git:** 2025-01 → 2026-02. Page era is 2024–present with the note "rebuilt on Statamic in
2025", because an earlier 2024 build preceded it (`estorick-collection`,
`estorick-collection-web`). **Live:** `estorickcollection.com`.

Statamic 5.69 on Laravel 12, PHP 8.5. Antlers templates
(`resources/views/*.antlers.html`), Vite 7 with `laravel-vite-plugin`, Tailwind CSS 4,
Alpine.js 3.15. Content is **flat files** in `content/collections/` — over 1250 entries.

Addons: SEO Pro, **`statamic/ssg` 3.1**, responsive images, reCAPTCHA, Mailchimp, Google
Maps, Blade Icons / Font Awesome. Static output goes to `storage/app/static`; static caching
is configured. A modular page builder (cards, split content, map, contact form, memberships)
is documented in `CMS_DATA_STRUCTURE.md`, which also documents the `alt` field on assets.
PHPUnit 11 and Laravel Pint; no CI.

### Maersk Innovation Center

**Two applications over one database, not one Laravel app.** **Live:**
`innovation.maersk.com`.

| Repo                               | Role                       | Git               |
| ---------------------------------- | -------------------------- | ----------------- |
| `maersk-innovation-center-cms`     | Directus 9 headless CMS    | 2022-04 → 2023-08 |
| `maersk-innovation-center-website` | Laravel 9 public front end | 2022-04 → 2025-02 |

**CMS:** Directus 9 via `@wbce-d9/directus9` 9.26.7 on Node 18, PostgreSQL (`pg` 8.11), with
`directus-extension-display-link` and `directus-extension-wpslug-interface`, plus
`patch-package` patching `@wbce-d9/api`. The schema lives in `snapshots.yaml`, roughly 9,000
lines of collections and fields. Scripts: `directus start`, `bootstrap`, schema
snapshot/apply. Contains no front-end code at all.

**Website:** Laravel 9 on PHP 8.2, Livewire 2.10, TALL preset (Tailwind 3.2, Alpine 3.10,
`@alpinejs/focus`), Laravel Mix 6, Blade, intl-tel-input, Spatie Response Cache, GTM,
Mailgun, Clockwork in dev, PHPUnit 9 scaffold only.

The connection between them is direct: the Laravel app **reads Directus's PostgreSQL tables
through Eloquent** (`content_copy`, `directus_files`; `DirectusFile` builds asset URLs from
`config('cms.url')`). Draft preview runs through `/_/*` routes behind a `VerifyCmsToken`
middleware using `CMS_URL` and `CMS_TOKEN` from `config/cms.php`. Directus webhooks hit
`/api/cache/pages` and `/api/user/approved/{user}`.

Gating: `Auth::routes(['verify' => true])`, an `is_approved` flag on users, a
`Gate::define('access', …)`, and `<x-atoms.gated>` / a Livewire `Gated` component keyed off a
`gated` flag on CMS content steps — so individual blocks within a page can be restricted.

### Price Forbes — `price-forbes-website`

**Git:** 2023-03 → 2024-11, 422 commits. Remote is `theframeworks/ardonagh-pf-web`.

Same Bedrock + Sage architecture as Price Forbes RE, which was built on this foundation
afterwards. WordPress 6.7.1, PHP ^8.1, theme `price-forbes-2023` on Sage 6, Acorn 4.3, Bud
6.23.3, Tailwind. Node 20, pnpm 9.

Differences from the RE site: a **subset** of the `thef-*` block plugins (no `thef-cards`,
`thef-people`, `thef-infographics-graph`); adds `easy-wp-smtp` and
`roots/wp-password-bcrypt`; has **no** Gravity Forms, `log1x/poet` or `roots/acorn-mail`, and
therefore no `person` custom post type. Same nginx-cache helpers. `development` and `staging`
config files but no `production.php`. PHPCS only, no CI.

### Champion Homes brand network

**Git:** api 2015-09 → 2024-09, cms 2015-10 → 2026-06, web 2015-10 → 2024-09. **Live:**
`championhomes.com`. In transition to another supplier, but some sites were still ours.

A three-tier headless architecture for a US manufactured-home builder.

| Layer | Repo               | Role                                             |
| ----- | ------------------ | ------------------------------------------------ |
| API   | `champion-hom-api` | MongoDB data store, REST CRUD and search         |
| CMS   | `champion-hom-cms` | AngularJS admin SPA writing to the API and to S3 |
| Web   | `champion-hom-web` | Public Laravel site reading the API              |

**API:** PHP ^7.3, **Laravel 5.1.\*** with **Dingo API 1.0** and Fractal transformers, over
**MongoDB** via `jenssegers/mongodb` ^3.0. HTTP Basic auth through Dingo
(`Dingo\Api\Auth\Provider\Basic`). Resources cover home models, series, families,
retailers/customers, communities, pages, galleries, media, navigations, locations and zip
search, web-to-lead submissions, public users, websites and website pages, commercial pages,
settings and CMS users. README documents `mongodump`/`mongorestore`. PHPUnit ~4, Phpspec,
Faker.

**CMS:** self-described "CMS 1.0". AngularJS ~1.4.8 with UI Router and Foundation Apps, Gulp
3, Node 8, Sass, Videogular for video preview. Uses the **AWS SDK to upload straight from
the browser to S3**. Features image cropping, galleries, hero images, contact-form field
builders, `wizmarkdown` and drag-and-drop. API URL configured in `env.js`; local dev proxies
CMS to API on port 2307.

**Web:** PHP ^7.4, Laravel 5.1.\*, Guzzle ^6.1, `jenssegers/mongodb` ^3.2, Node 8 + Gulp 3 +
Sass + jQuery 2. Consumes `API_BASE_URI` with HTTP basic auth (`config/api.php`). Routes:
homepage, CMS-driven catch-all, `home-plans-photos` catalogue, geo "find a home/retailer/
community", retailer and community detail, search, sitemaps, document downloads and a
`request-info` lead POST. Integrations: Cloudinary (`cloudder`), Redis (`predis`), Watson
sitemap, phone validation, honeypot, crawler detect, markdown, Google Maps/Places, GTM,
`ipinfo` IP geolocation. **Leads route to Eloqua, Salesforce, Cimacorp and Lasso** depending
on brand. **Public-user accounts** (login, register, password reset) authenticate against the
API's `publicusers` endpoints, separate from the Laravel `auth` scaffold. English only.

**The sibling pattern:** `*-web` for hom, sky, tfd, tse, ems, fwt, ims, com plus a generic
`champion-web`; `*-cms` for hom, sky, tfd, tse plus `champion-homes-cms`; APIs in
`champion-api`, `champion-api-laravel`, `champion-data-api`; shared infrastructure in
`champion-cms-components`, `champion-homes-bridge`, `champion-wsh`. The API carries deploy
branches like `deploy/dev-sky` and `deploy/prd-ims`. The brand codes are inferred from folder
names, not confirmed in code, and the count is **more than eight** — the page deliberately
says "a network of brand sites" rather than a number. `champion-hom-web` controllers
reference `skylinehomes.com`.

No CI in any Champion repo; deployment is Bitbucket branch-based (`deploy/dev|stg|prd`).

### Frontflow — `frontflow`

**Git:** 2022-04 → 2024-09. **Page era is 2018–2022**, per Sergio — the project predates this
repo's history.

The agency's in-house boilerplate for static marketing sites. README names Sergio as lead
developer. Gulp 5, Pug, Tailwind 3.4, Alpine.js 3.14, PostCSS, Sharp, pnpm, Node 20 via
`.mise.toml`, BrowserSync + nodemon. Not a monorepo. No CI, no tests, no backend.

The `gulpfile.js` is where the substance is:

- **Tailwind as single source of truth.** `resolveConfig(tailwind.config.js)` is passed into
  the Pug templates as `DATA.theme`, so breakpoints, spacing and container padding are read
  from config rather than restated in markup.
- **The `sizes` helper.** `DATA.image.sizes()` takes a per-breakpoint description of an
  image's layout — column span, total grid columns, gutter, container padding, container
  width — and resolves it against the Tailwind theme into
  `calc((container - 2*padding - (cols-1)*gap) / cols * span + (span-1)*gap)` expressions,
  joined as media queries in reverse order. This is the most interesting thing in the repo.
- **Responsive images.** Five widths (320, 640, 960, 1280, 1600) at `@1x` and `@2x`, in AVIF
  (quality 64) and WebP (quality 82), quality halved at `@2x`, plus an original-format
  fallback at the largest width. PNG sources are encoded lossless and photographs lossy,
  switched by `gulp-if`.
- **Incremental image cache.** Sources are mirrored into `cache/images` so `gulp-changed` can
  detect changes; a `purge` task globs each derivative back to its source name and removes
  orphans.
- **`svg2mixin`.** SVGs are parsed with `svgson` and rewritten as Pug mixins with
  `aria-hidden="true"`, `focusable="false"` and `&attributes(attributes)` pass-through, so
  icons inline at the call site without a sprite sheet.
- **`mixin2include`.** The `generate` task wraps each module partial in a standalone page and
  writes it to `DEST/modules`, producing a browsable catalogue for client handover and CMS
  integration. This is the mechanism behind the Ardonagh "modules" delivery repos.
- Pages compile to directory-index files for clean URLs; a `partials` task touches page files
  to force recompiles when included partials or `tailwind.config.js` change; styles are
  written to `DEST` **before** PostCSS runs so Tailwind can scan the built HTML, and the
  styles watcher includes `DEST/**/*.html`; `optimise` runs clean-css, uglify and svgo;
  BrowserSync proxies a local HTTPS vhost at `https://frontflow.test`; `image.size` exposes
  `image-size` to templates for intrinsic width/height.

### Ardonagh Community Trust

**Git:** front-end 2022-11 → 2023-08 (282 commits), modules 2023-03 (44 commits).
`ardonaghtrust.org` is live but was not linked — not confirmed as still ours.

`ardonagh-act-website-front-end` is a static marketing and CSR site for the Ardonagh
Community Trust, the group's charitable arm: community grants, volunteering, match funding,
charity partnerships, sustainability, news and legal pages. Gulp 4, Node 18.15.0 via Volta,
Yarn, Pug (pages / layouts / modules / components), Tailwind CSS 3.3.3 with preflight
disabled and Normalize.css, PostCSS, Alpine.js 3.12.3 concatenated to `dist/scripts.js`,
`gulp-sharp-responsive`, SVG-to-Pug mixins, `gulp-svgo`, BrowserSync, nodemon.

`yarn generate` builds a module catalogue at `dist/_modules/`. **`yarn modularise` rsyncs
`dist/` into `../ardonagh-act-website-modules/`** with `clean: true` — that sibling repo is
the compiled delivery artifact and contains no source. ARIA is present in templates
(pagination, nav, decorative icons). No CI, tests or i18n. The README describes overwriting
production CSS/JS; final hosting is not documented.

### Ardonagh Group corporate site

**Git:** front-end 2021-07 → 2023-03 (233 commits), modules 2021-07 → 2021-10 (8 commits).
`ardonagh.com` is live but was not linked.

`ardonagh-website-front-end` is a front-end module library for the Ardonagh Group corporate
site, **explicitly intended for the client to integrate into Umbraco** (stated in the
README). Pages cover business portfolio, financial results, leadership, announcements,
sustainability and a media library. The design reference is a Webflow prototype at
`ardonagh.webflow.io`. The README credits Nicholas Caruana as PM, Sergio Agosti as lead
developer and Scott Harrison as developer.

Gulp 4, Node 12.22.12 via Volta, Yarn, Pug, Tailwind CSS 2.2.7, **Stylus** for custom styles,
PostCSS, Normalize.css, Alpine.js 3.2.2 with `@alpinejs/intersect`, **lottie-web 5.7.12**,
`gulp-sharp-responsive`. BrowserSync runs over HTTPS from local `server.crt` / `server.key`,
with a `yarn trust-crt-macos` helper. `yarn generate` emits individual module HTML to
`dist/modules/`; `yarn distribute` zips `dist/` and `src/images/`.

`ardonagh-website-modules` holds the compiled delivery output — roughly 50 module HTML files
plus full pages, shared `styles.css` / `scripts.js`, Lottie JSON and images. Unlike the ACT
project there is **no automated publish task**, and its last commit (2021-10) long predates
the front-end's (2023-03), so it is probably stale. Handover was likely the zip.

### This is IBM

One campaign, two builds. Both statically generated into IBM.com's own path structure
(`ibm.com/marketing/uk-en/this-is-ibm/`) and delivered as a zip for IBM's deployment process,
wrapped in IBM's shared v18 header/footer shell. `ibm.com/marketing/uk-en/this-is-ibm/`
returns 200 but was not linked.

**`ibm-of-things`, 2018-03 → 2020-02** — the first build. A story grid with around **80**
stories, each with its own page under `dist/{slug}/` plus per-platform share landing pages at
`dist/{slug}/share/{platform}/`. Node ≥8, Gulp 4, **Nunjucks**, Sass, Vue 2.6 client-side,
`@ibm/plex`, Babel 7, BrowserSync, ngrok for preview URLs, optional IBM shell wrapper via
`IBM_SHELL` and `shell.html`. Content is driven from `src/data.json` (4 collections, 80
things). Accessibility: a `:focus-within` polyfill plus the `postcss-focus-within` plugin,
which predated broad browser support.

**`ibm-this-is-ibm`, 2020-07 → 2022-11** — the rebuild, with **33** story slugs. Node 14,
**Nuxt 2** with `target: 'static'`, Vue 2, **Pug**, **Tailwind CSS 3**, PostCSS 8, SCSS,
**`@carbon/ibmdotcom-web-components` 1.25**, `@aceforth/nuxt-optimized-images` (Sharp,
mozjpeg, pngquant, svgo), Lodash. `yarn dist` zips with `BASE_URL=https://www.ibm.com`.
Decorative images intentionally carry empty `alt`, documented in the README.

### HTML email programme — `ibm-newsletters`

**Not a git repository** — no commit dates available. Era on the page is **2012–2022**, per
Sergio. Mostly IBM, with occasional other clients.

A collection of individual campaign builds in job-number folders (`10057` through `50790`,
with variants like `10604-Migration-tool`, `10625-V1`…`V5`), alongside legacy hand-built HTML
(`ibm1035/`, `10142/`) and shared templates (`template/`,
`template-ibm-responsive (legacy)`, `template-responsive--1/2 (legacy)`). A `UST-51028`
folder confirms the programme was not IBM-exclusive; that one uses Pug rather than Swig.

Node 12, Gulp 4, Sass, **Swig** templates (`.swig.html`), `gulp-email-builder` 3.x,
`@ibm/plex`, BrowserSync, `gulp-s3-upload`.

Email-client compatibility is handled by `gulp-email-builder` against an explicit **Litmus**
client list (Outlook 2007–2019, Gmail, iOS, Android and others). Styles are split into
`style--inline.scss` and `style--embed.scss`, with CSS base64 inlining and
`encodeSpecialChars: true`. **Lotus Notes variants** exist as `*-lotus.html` /
`lotus.swig.html`, alongside plain-text versions. Each campaign carries its own `.env` for
Litmus, S3 and CTA URLs. Scripts: `serve`, `build`, `test` (Litmus), `dist` (zip). No CI.

### Dematic Micro Fulfilment — `dematic-micro-fulfilment`

**Git:** 2020-08 → 2021-10. Bitbucket `tfsparkadmin/dematic-micro-fulfilment`. README points
at `pages.dematic.com`, which no longer resolves; `dematic.com` is up. Not linked.

A lead-generation landing page with an interactive Micro Fulfillment **configurator** —
visitors answer questions about their operation and the outputs change accordingly
(`src/scripts/configurator.js`).

Vue 2.6, **Pug**, Sass, Gulp 4, **lottie-web ^5.7** for the hero, loader and result
animations. The distinctive part: **`gulp-cheerio` injects the built content into a captured
copy of Dematic.com's own page shell** (`src/public/shell/`), producing
`build/index.html` (full page with their header and footer) and `build/landing.html` (content
only) — so it matched the surrounding site without CMS access. `npm run dist` zips the
output. No auth, no CMS, no tests, no CI.

---

## Personal

### Kids Coding Programme — `kids-coding-programme`

**Git:** 2026-05 → 2026-06.

A local app for children learning HTML and CSS: create projects and pages, edit in
CodeMirror with live preview, optionally ask an AI tutor. SQLite storage, no accounts, no
cloud. Can be packaged as an unsigned macOS `.app`.

**Bun** 1.3+ runtime (not Vite), React 19, Tailwind CSS 4 via `bun-plugin-tailwind`,
`@uiw/react-codemirror`, DOMPurify, Zod. The tutor uses the **Vercel AI SDK** (`ai` ^6) with a
provider registry — OpenCode Go by default, plus Google Gemini, Ollama and an AI gateway —
and tool calls `updatePageContent`, `updateProjectCss` and optional Tavily web search. REST
API for projects and pages in `src/index.ts`. Tests via `bun test`
(e.g. `previewPageLinks.test.ts`). No CI.

### Family Menu Planner — `family-menu-planner`

**Git:** 2026-01 → 2026-06. Deployed to `planner.sergioagosti.org` but **deliberately
unlinked** on the page.

No README; behaviour derived from `src/App.tsx` and `src/lib/data.ts`. Recipes with a
difficulty field, ingredients with a Tesco URL field, and a drag-and-drop weekly plan across
breakfast/lunch/dinner by adults/kids, plus household invites.

React 19, Vite 8, Tailwind CSS 4, Radix UI / Base UI, `@dnd-kit/core`, and **Supabase**
(`@supabase/supabase-js`) for auth and Postgres. Auth is email/password plus Google OAuth
(`AuthContext.tsx`). A `pnpm-workspace.yaml` exists but there are no workspace packages, so
it is effectively single-package. Deployed by GitHub Actions to GitHub Pages
(`.github/workflows/deploy-pages.yml`). No tests.

### Frontend experiments & tools

Kept as a catch-all. Maps to `monospace-compare` (the side-by-side comparison used to choose
this site's typeface), `frontend-playground` and `geist-mono-opentype-features`. Not part of
the 31-repo list that was audited.

---

## Live URL status

Checked 2 September 2026 with a following-redirects HEAD request.

| URL                                    | HTTP | Linked on page | Note                               |
| -------------------------------------- | ---- | -------------- | ---------------------------------- |
| `theframeworks.com`                    | 200  | yes            |                                    |
| `intelligencegrid.g42.ai`              | 200  | yes            | supplied by Sergio                 |
| `mm.hiscoxcyberinsight.com`            | 200  | yes            |                                    |
| `estorickcollection.com`               | 200  | yes            |                                    |
| `innovation.maersk.com`                | 200  | yes            |                                    |
| `championhomes.com`                    | 200  | yes            | in transition to another supplier  |
| `pro.hiscoxcyberinsight.com`           | 200  | no             | login wall; policy is public-only  |
| `planner.sergioagosti.org`             | 200  | no             | unlinked by choice                 |
| `ardonaghtrust.org`                    | 200  | no             | not confirmed as still ours        |
| `ardonagh.com`                         | 200  | no             | not confirmed as still ours        |
| `priceforbes.com`                      | 200  | no             | not confirmed as still ours        |
| `priceforbesre.com`                    | 200  | no             | not confirmed as still ours        |
| `cantonteaco.com`                      | 200  | no             | theme since replaced               |
| `origintea.co.uk`                      | 200  | no             |                                    |
| `skylinehomes.com`                     | 200  | no             | a Champion brand                   |
| `ibm.com/marketing/uk-en/this-is-ibm/` | 200  | no             | may be a soft redirect; unverified |
| `hiscoxgroup.com`                      | 200  | no             | corporate site, not the build      |
| `dematic.com`                          | 200  | no             | corporate site, not the build      |
| `pages.dematic.com`                    | dead | no             | the original host                  |
| `ust.com`                              | 403  | no             | bot-blocked, not necessarily down  |

No public URL was found anywhere in the code for the Hiscox Cyber Fusion Portal, Hiscox
CyberClear Academy, or the UST NavigatorAI tool itself.

---

## Editorial decisions

Agreed with Sergio while rewriting, so the page stays consistent if it is extended.

- **Register:** neutral and presentational. What a thing is, what it is built with, what was
  technically notable. No outcome or value claims. Specifically dropped: "Most of the build
  was completed within weeks of kickoff… retained at senior level", and the "NDA: details
  available in person" line.
- **Clients are named.** G42, Hiscox, Ardonagh, Price Forbes, Champion Homes, IBM, UST,
  Dematic and The Frameworks were all cleared.
- **Dates are real year ranges** from first and last commit, not "multi-year engagement".
  Exceptions where Sergio overrode the git record: Frontflow (2018–2022), the email programme
  (2012–2022), Estorick's 2024 start, Canton Tea's 2023 start.
- **Ordering:** client work is reverse chronological by last activity.
- **One entry per coherent product.** Merged clusters were split — Ardonagh from Price
  Forbes, IBM from Dematic, and the Hiscox suite into three.
- **IBM is two entries**, not four: the "This is IBM" campaign covering both builds, and the
  email programme. `ibm-tealeaf` was dropped as unrepresentative.
- **Links only where the code is still ours** and a visitor can actually see the page. No
  login walls, no client corporate homepages standing in for the work.
- **Field template:** title, subtitle, summary, Role, Notes, era (+ optional note), stack
  tags, links. The bullet list is labelled "Notes", not "Engineering highlights".
- Backtick-delimited terms in notes render as inline `<code>` via the `prose` mixin in
  `src/pages/projects.pug`, styled by the `code` rule in `src/main.css`.

---

## Unverified and open

- **`thef-cms-web` history** starts 2026-06 despite a mature ADR set; likely re-initiated or
  rewritten. Era on the page follows git.
- **`champion-hom-cms` and `g42-intelligence-grid-web`** report last-commit months ahead of
  other repos in the same family; reported as git returned them.
- **Champion brand codes** (sky, tfd, tse, ems, fwt, ims, com) are inferred from folder names
  only.
- **`hiscox-hmm-api` auth:** clients send bearer tokens and `config/auth.php` defines an api
  token guard, but `routes/api.php` applies no `auth` middleware. Enforcement may be external.
- **`hiscox-cca-web` production database** is SQLite in `.env.example`, yet `hci-pro` expects
  PostgreSQL for the CCA validations connection.
- **`hiscox-cyber-dashboard-web` backend** (`/risks?domain=`) is not in any surveyed repo.
- **`theframeworks/hiscox-hci-laravel`** is required by `hiscox-hmm-api` but never referenced
  in its `app/` code — presumably service-provider auto-discovery.
- **`ust-ai-assessment-tool-api/functions/gemini.js`** is present but unreachable from
  `index.js`.
- **`ibm-newsletters`** has no git history and flattened file mtimes, so its span cannot be
  derived from the repo.
- **`ibm-tealeaf`** is 2014-12 → 2015-07: Middleman 3.3.5, Ruby, Sass/Compass with Bourbon,
  ERB, Redcarpet, Skrollr parallax, jQuery with enquire.js, IE8–9 conditional stylesheets, a
  `has-no-js` → `js` progressive-enhancement flip, and an `.htaccess` in `deploy/`. Recorded
  here in case it is ever wanted back on the page.
- **Hosting** for the Ardonagh static sites beyond "overwrite production assets" and
  "integrate into Umbraco" is not documented in-repo.
- **`canton-tea-shopify-theme` lint** references eslint with neither the dependency nor a
  config file present.
