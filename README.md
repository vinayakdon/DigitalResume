# Vinayak Donawad — Portfolio

Personal portfolio for an AI & Data Engineer. Built with **Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4**. Fully static apart from the live GitHub panel, so it is fast and free to host on Vercel.

## What's inside

| Section | Notes |
| --- | --- |
| Hero | Name, headline, resume and project buttons, social links, plus an **"Ask my portfolio"** console: a BM25 keyword retriever over the site's own content that runs in the browser (`src/lib/search.ts`). |
| About / Experience | From `src/content/site.ts`. Timeline includes the M.Sc. and the HCLTech role. |
| Projects | 12 projects from your GitHub with category filters, search and an empty state. Each has a detail page at `/projects/<slug>` (problem, features, method, results, lessons). |
| Research | IEEE Access thesis. Add the DOI link when published. |
| Skills / Education | Grouped skill lists (no percentage bars) and certifications with optional credential links. |
| GitHub activity | Live from the public GitHub API (cached per session). If the API is rate-limited it falls back to curated repos. The contribution calendar hides itself if its image fails. |
| Resume | Shows **Download PDF** if the file exists at build time, otherwise **Request my resume** (email). |
| Contact | Validated form. Sends via Web3Forms when a key is set; otherwise it opens the visitor's email app with the message filled in. It never shows "sent" unless the service confirms. |
| SEO | Metadata, Open Graph image (generated), JSON-LD Person schema, `sitemap.xml`, `robots.txt`, favicon. |
| UX | Light/dark mode (follows system, toggle in header), responsive to 360 px, skip link, visible focus, reduced-motion support. |

## Run locally

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
npm run build && npm start   # production check
npm run lint
```

Requires Node.js 20.9+.

## Customise

Almost everything lives in two files:

- **`src/content/site.ts`** — name, headline, intro, email, links, about text, experience, education, publication, certifications, skills.
- **`src/content/projects.ts`** — projects. Copy an entry to add one. `featured: true` sorts it first. Use `kind: "coursework"` or `"learning"` to label it honestly. Only add `metrics` you can point to in the repo.

### Replace the resume
Save your PDF as `public/resume/Vinayak_Donawad_Resume.pdf` and rebuild. To use another file name, change `resumePath` in `site.ts`.

### Add a profile photo
Save a square image (at least 600×600) as `public/profile.jpg`, then set `photo: "/profile.jpg"` in `site.ts`. Until then a monogram is shown.

### Project screenshots
Put images in `public/projects/` and add them to the project's `images` array (`{ src, alt }`). The first image is the card cover; the rest appear on the detail page. Each project also has a data visual in `src/components/project-visuals.tsx`, drawn from real numbers in its repo; it is used as the card cover, and screenshots appear in the "From the repository" gallery on the detail page.

### Certificates
Add `url` (e.g. Credly link), `year` and optionally `image: "/certificates/aws.png"` to each item in `certifications`.

### Publication link
When the IEEE Access paper is live, set `publication.url` to the DOI / IEEE Xplore URL — a "Read the paper" link appears.

### Contact form
1. Go to <https://web3forms.com>, enter `vinayakdon25@gmail.com`, and copy the access key from the email.
2. Set `NEXT_PUBLIC_WEB3FORMS_KEY` in `.env.local` and in Vercel (see below).
3. Rebuild. The button changes from "Open in my email app" to "Send message".

### Colours and fonts
Tokens are at the top of `src/app/globals.css` (light and dark). Fonts (Instrument Sans, JetBrains Mono) are self-hosted in `src/app/fonts/`.

## Deploy to Vercel

1. Push this folder to a new GitHub repository, e.g. `vinayakdon/portfolio`:
   ```bash
   git remote add origin https://github.com/vinayakdon/portfolio.git
   git push -u origin main
   ```
2. On <https://vercel.com/new>, import the repository. Vercel detects Next.js — keep the defaults.
3. Under **Environment Variables** add:
   - `NEXT_PUBLIC_SITE_URL` — your final URL, e.g. `https://vinayak-donawad.vercel.app`
   - `NEXT_PUBLIC_WEB3FORMS_KEY` — optional, see above
4. Click **Deploy**. Every push to `main` redeploys automatically.
5. Optional: add a custom domain under **Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL` and redeploy.

After deploying, paste the URL into <https://www.opengraph.xyz> to check the social preview, and add it to your LinkedIn and GitHub profile.

## Testing checklist (already run on the build)

- Category filters, search, empty state and "Clear filters"
- Retrieval console results and empty state
- Theme toggle, mobile menu (opens, closes on Escape)
- Contact form validation
- All 12 project pages, sitemap, robots, OG image return 200; unknown project returns 404
- No horizontal scroll at 360 px; skip link is the first focusable element
- `npm run lint` and `next build` pass with no errors
