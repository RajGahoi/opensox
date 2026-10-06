# OpenSox technical SEO audit

- Audit date: 2 October 2026. Simplified on 4 October 2026.
- Website reviewed: `https://opensox.ai`.
- Scope: public pages, search visibility, page speed and the move from `.in` to `.ai`.
- Evidence: 209 public page/asset requests, six Lighthouse speed checks and a code review.
- These are findings from that date. The live site has not been checked again for this summary.

## Implementation status — 7 October 2026

- Preferred hostname: `https://opensox.ai`, without `www`. Existing canonicals and domain migration already use it.
- F01: implemented in this change. Public pages have their own canonical; hostname redirects use non-www. Deployment checks remain.
- F04: implemented in this change. Utility pages use noindex; unfinished lessons use the not-found route. Deployment checks remain.
- F07: done on this branch. Commits `c61c226`, `98df90e` and `048c3f2` contain the image fixes. Merge and deployment checks remain.
- F08: prepared first-render and image-priority fixes are done on this branch in `98df90e` and `1a12544`. Merge and deployment checks remain; pricing heading animations are a separate follow-up.
- F05: offscreen animation work is committed in `c2c0e45`; the oversized visible canvas is still open.
- F11: hostname redirects are implemented with F01. Full old-URL mapping and Search Console migration checks remain open.
- F12: secondary font preload is disabled in this change. Deployment checks remain; font-format changes are separate work.
- Done on this branch means the code is committed, not that the live site has been checked after deployment.

## Fix first

- Give each page its own correct canonical URL: the URL it tells Google is the main version.
- Make every published blog post reachable through normal links.
- Add a sitemap containing published pages only.
- Keep login, account and unfinished lesson pages out of search results.
- Put completed lesson text in the first HTML response, before browser JavaScript runs.
- Give programs, lessons and marketing pages their own titles and descriptions.

## Then improve speed

- Reduce the homepage animation's drawing work on mobile.
- Check and deploy the image and first-screen fixes already prepared in the repo.
- Let the server reuse public pages without mixing in private user data.
- Remove duplicate navigation and unnecessary shared browser code.

## What the measurements show

- Historical September PageSpeed report: mobile failed Google's Core Web Vitals check; desktop passed.
- Mobile main-content display time: 3.0 seconds; target: 2.5 seconds or less.
- Mobile response to user interaction: 238 milliseconds; target: 200 milliseconds or less.
- Page movement while loading was already within the good range.
- Fresh homepage mobile speed scores: 64, 57 and 75. Results varied substantially between runs.
- Fresh desktop homepage score: 90. Pricing mobile: 76. Testimonials mobile: 77.
- Pricing main content took 5.81 seconds to appear in one fresh mobile check.
- Testimonials main content took 5.73 seconds to appear in one fresh mobile check.
- These are recorded samples, not promised results for every visitor.
- The historical report used `www.opensox.ai`; its exact page-versus-whole-site data scope was unclear.

## All 20 findings

### F01 — Wrong main-page URLs: highest priority

- Problem: 77 of 108 checked pages tell Google the homepage is their main version. Only the homepage should do that.
- Evidence: 76 different pages, including pricing, program guides and lessons, use the homepage canonical.
- Fix: give each page its own canonical. Example: pricing should use `https://opensox.ai/pricing`.
- Benefit: removes a wrong signal that can make Google treat separate pages as duplicates.
- Done when: each page intended for search has one correct canonical, including URLs with tracking parameters.
- Limit: this does not prove Google has excluded all 76 pages.
- Estimated effort: half a day to one day.

### F02 — Most blog posts are missing from the default listing

- Problem: the blog starts with a category filter, hiding links to other posts.
- Evidence: the default listing links to 8 of the repo's 30 posts, plus one live post missing from the repo.
- Fix: show all published posts by default, or provide linked category pages and pagination.
- Benefit: makes the other 22 repo posts reachable without clicking filter buttons.
- Done when: every published post has a normal archive link and a sitemap entry.
- Limit: missing archive links do not prove those posts are absent from Google.
- Estimated effort: half a day to one day.

### F03 — Missing sitemap and robots file

- Problem: `/robots.txt`, `/sitemap.xml` and `/sitemap_index.xml` return 404.
- Fix: publish a sitemap of approved public pages and a robots file pointing to it.
- Include: published blogs, program guides, completed public lessons and approved marketing pages.
- Exclude: login, admin, checkout, unfinished lessons, redirected URLs and tracking variants.
- Done when: files load successfully and every sitemap URL works and matches its canonical.
- Limit: a missing robots file does not block Google. A sitemap does not guarantee indexing.
- Estimated effort: half a day.

### F04 — Utility pages and unfinished lessons can appear in search

- Problem: login, checkout, account and admin shells can return pages that allow indexing.
- Evidence: 16 lessons are marked coming soon, but their direct routes still serve pages.
- Fix: add `noindex`, meaning keep this page out of search, to utility and unfinished pages.
- Done when: unfinished pages are excluded from listings and sitemaps; useful public guides remain eligible.
- Limit: do not block every dashboard route. Some contain public program guides.
- Limit: an admin shell loading does not prove private admin data is accessible. `noindex` is not security.
- Estimated effort: half a day to one day.

### F05 — Homepage animation draws too much on mobile

- Problem: the animated grid draws a 2,000-pixel-wide surface even on a 412-pixel-wide screen.
- Evidence: its script used about 3 to 7 seconds of processing across three mobile traces.
- Fix: match the drawing area to its container, reduce frame frequency and stop work while hidden or offscreen.
- Option: use a static pattern on mobile or when reduced motion is requested.
- Calculated saving: a 412 × 160 drawing area needs about 84% fewer cell draws per frame than the current area.
- Done when: equivalent traces show less grid work, with no drawing while hidden or offscreen.
- Limit: 84% fewer draws does not mean an 84% faster page. Offscreen pausing already exists.
- Estimated effort: half a day to one and a half days.

### F06 — Public pages are regenerated instead of served from cache

- Problem: the shared layout reads user-session information for public pages too.
- Evidence: home, pricing, a blog article and a program guide missed the page cache in all five samples each. Contact hit it.
- Fix: move session loading into protected layouts and let public content use cached pages.
- Benefit: can reduce repeated server work and waiting for the first response.
- Done when: intended public pages hit the cache and signed-in information stays private.
- Limit: the faster contact response does not prove how much caching will save on other pages.
- Estimated effort: one to three days.

### F07 — Image improvements: done on branch, deployment pending

- Problem: the live site still serves large images; checked replacement WebP URLs returned 404.
- Evidence: testimonials transferred about 2.07 MB of images in the fresh mobile check.
- Existing work: commits `c61c226`, `98df90e` and `048c3f2` improve testimonial, pricing and content images.
- Earlier local results: testimonial image transfer was about 408 KB on mobile versus 2,026 KB live; 538 KB on desktop versus 3,688 KB live.
- Fix: verify the prepared images in a deployment preview, then deploy them. Keep old image links working.
- Done when: images look correct, requested sizes fit the layout and all replacement URLs work.
- Limit: the earlier runs loaded different image counts. They do not prove equivalent live speed gains.
- Estimated effort: half a day to one day.

### F08 — Prepared loading fixes: done on branch, deployment pending

- Problem: pricing delays its main visible image by lazy-loading it. Some main content starts invisible for animation.
- Evidence: pricing's main image is a small SVG, about 874 transferred bytes; fetching it late matters more than compressing it.
- Existing work: commits `98df90e` and `1a12544` address image priority and homepage visibility.
- Fix: verify and deploy these changes. Keep important headings visible before browser JavaScript starts.
- Done when: main visible content appears promptly and below-screen images do not take early loading priority.
- Limit: previous local speed gains are not verified production gains.
- Estimated effort: half a day to one day.

### F09 — Lesson text appears only after JavaScript runs

- Problem: lesson bodies start empty and are added by browser code.
- Evidence: the same rendering method affects 32 lesson routes; the checked lesson initially exposed about 22 visible words.
- Fix: safely clean and render completed lesson HTML on the server. Keep interactive controls in browser code.
- Done when: the first HTML response contains each published lesson's meaningful text and links.
- Limit: Google can run JavaScript; this is not proof that lessons cannot be indexed.
- Estimated effort: half a day to one day.

### F10 — Different pages share the homepage title

- Problem: 73 of 108 checked pages use the homepage title.
- Evidence: 29 program pages and 32 lesson pages lack their own metadata generator.
- Fix: add relevant titles, descriptions and social-preview URLs to each approved page.
- Example: `Google Summer of Code guide | OpenSox`.
- Done when: page metadata describes that page rather than the homepage.
- Limit: Google can rewrite titles and descriptions. Better click-through rates have not been measured.
- Estimated effort: half a day to one day.

### F11 — Finish the domain move and choose one hostname

- Working already: sampled `.in` URLs redirect to matching `.ai` pages and keep tracking parameters.
- Remaining problem: `www.opensox.ai` still serves pages separately from `opensox.ai`.
- Fix: confirm the preferred hostname and redirect the other versions to it, keeping paths and query strings.
- Keep `.in` registration, DNS, HTTPS and redirects working for at least a year; longer protects old links.
- Done when: known old URLs reach the correct final pages and ownership/migration settings are checked in Search Console.
- Limit: the sampled redirects do not prove every old URL is covered.
- Estimated effort: a quarter to half a day.

### F12 — Secondary fonts load too early

- Problem: two DM Mono font files are preloaded on public pages.
- Evidence: they transferred 52,853 bytes combined, about 53 KB.
- Existing work: disabling their preload is staged in `apps/web/src/app/layout.tsx` at audit time.
- Fix: verify that change. Consider smaller font formats separately if useful.
- Done when: secondary fonts do not compete unnecessarily with main content, and text still looks correct.
- Limit: the browser may still download them when used. Removing preload does not guarantee 53 KB less total transfer.
- Estimated effort: a quarter to half a day.

### F13 — Blog images lack size and loading instructions

- Problem: 17 checked blog images lack HTML width, height and loading settings.
- Evidence: four remote images total about 723 KB; the largest is about 389 KB.
- Fix: reserve each image's space and lazy-load images below the first screen.
- Done when: image sizes are known, alternative text is meaningful and important first-screen images stay eager.
- Limit: this reduces layout-shift risk; the audit did not establish a blog-specific real-user layout-shift failure.
- Estimated effort: half a day to one day.

### F14 — FAQ answers and testimonial text are missing from initial HTML

- Problem: FAQ answers appear after interaction; public testimonial text waits for a browser API request.
- Fix: include FAQ answers and a useful set of public testimonials in server HTML.
- Fix: do not make static testimonial screenshots wait for the text API.
- Done when: useful text is present immediately and API failure cannot hide the whole screenshot section.
- Limit: this does not guarantee special FAQ search results. Keep private records excluded.
- Estimated effort: half a day to one and a half days.

### F15 — Public pages carry unnecessary shared browser work

- Problem: public pages share authentication, query and tracking code with application pages.
- Evidence: the homepage renders two navbar instances. Pricing footer links are not server-rendered.
- Fix: separate public and protected layouts, remove the duplicate navbar and render ordinary footer links on the server.
- Done when: public-page browser work is reduced and sign-in, payment and intended analytics still work.
- Limit: the saving is unmeasured. Fix the measured animation cost first.
- Limit: session recording and automatic event capture are already disabled; do not count disabling them as new work.
- Estimated effort: one to two days.

### F16 — Check metadata handling before changing it

- Problem: Lighthouse reports a missing homepage description, but the description exists later in the HTML response.
- Evidence: tested HTML-limited bot requests receive it in the page head; ordinary requests receive streamed metadata.
- Fix: check actual Search Console rendering and social previews before changing framework settings.
- Done when: required search/social consumers receive correct metadata and one correct canonical.
- Limit: no evidence proves Google cannot read the description. Do not disable streaming just to improve a checklist score.
- Estimated effort: a quarter of a day to investigate.

### F17 — Add accurate article and breadcrumb data

- Working already: basic website structured data exists.
- Missing: checked articles lack article-specific and breadcrumb structured data.
- Fix: add machine-readable article details using real titles, authors, dates, images and page URLs.
- Done when: the data passes validation and matches the visible page and navigation.
- Limit: this does not guarantee better rankings or special search results. Do not invent ratings or update dates.
- Estimated effort: half a day.

### F18 — Improve image caching for repeat visits

- Problem: many image files expire from cache after four hours.
- Fix: use filenames that change when the content changes, then allow long caching for those files.
- Done when: changed content gets a new URL and cache settings match that approach.
- Limit: do not give every existing fixed filename a one-year cache. First-visit gains are limited.
- Estimated effort: a quarter to half a day.

### F19 — Clean up headings and internal links

- Problem: navigation labels use page-heading tags; some section headings use the wrong levels.
- Evidence: the checked GSoC guide contains 15 main-heading tags, mostly from navigation.
- Fix: use normal text for navigation, clear page/section headings and descriptive link labels.
- Fix: link directly to `/pricing` instead of `/pro`, which redirects there.
- Done when: heading structure is clear and internal links use final preferred URLs.
- Limit: multiple main headings alone do not prove a Google penalty.
- Estimated effort: half a day.

### F20 — Repair lint setup and add release checks when implementing

- Problem: Next.js and its lint configuration use mismatched major versions.
- Evidence: earlier lint failed with a circular configuration error; the earlier build passed with lint skipped.
- Fix: align compatible versions and restore reliable lint/build commands.
- Later checks: page status, canonical, sitemap inclusion, noindex rules and referenced image existence.
- Done when: supported commands pass and release checks catch the intended SEO failures.
- Limit: this audit did not rerun those commands or repair the setup. No security vulnerability was established.
- Estimated effort: half a day to one day.

## Suggested release order

- First: F01, F10, F02, F03, F04 and F09 — page identity, discovery, search policy and lesson text.
- Confirm the preferred hostname, then complete F11.
- Second: F05 — reduce the measured homepage animation cost.
- Verify and deploy prepared F07, F08 and F12 changes.
- Then: F06 and F15 — public caching and shared browser code.
- Follow with F13 and F14 — image behavior and initial public content.
- Later: F16 through F20 — compatibility checks, structured data, repeat visits and maintenance.
- Effort estimates overlap. Do not add every estimate to predict total project time.

## What is already working

- Blog article text is already rendered on the server.
- Blog articles already have page-specific canonicals and metadata.
- Public program guides already contain useful text in initial HTML.
- Sampled `.in` redirects already preserve destination paths and tracking parameters.
- The homepage animation already pauses offscreen; its visible drawing area still needs work.
- Deliberately nonexistent checked routes return real 404 responses.
- No controlled benefit was found for replacing the CTA SVG with WebP or removing navbar blur and stripe backgrounds.

## How to check results after changes

- Crawl the same pages and compare canonical URLs, titles, search-exclusion rules and sitemap coverage.
- Use Search Console to check which URLs Google chooses and whether approved pages are indexed.
- Compare speed using the same deployment conditions, browser settings and device sizes; run at least five samples before and after.
- Compare image bytes with the same images, viewport, cache and scroll position.
- Check authentication and payments when changing session handling or caching.
- Compare real-user metrics after enough traffic accumulates; Google's public data uses a rolling 28-day window.
- Do not promise a ranking, traffic or speed-score increase before measuring it.

## Important limits

- No Search Console access, verified Googlebot rendering, full old-domain URL list or server logs were available.
- Signed-in, admin and payment behavior were outside this audit.
- The live blog has at least one post missing from this repo: `pre-requisites-to-join-opensox-pro`.
- Reconcile that content before deploying this repo.
- Existing performance commits were not live at audit time. Their branch status is listed above; deployment status still needs checking.
- This is a simplified review copy. The original detailed report and raw evidence remain in the local research folder.
- The original findings are historical evidence; the status section records subsequent implementation work.
