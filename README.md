# CUHK-Shenzhen Programming Contest Team Website

Website source for the CUHK-Shenzhen Programming Contest Team. The first version turns the 2026 brochure into a wide-screen team portal and presentation-ready website.

## Local Development

```bash
npm install
npm run dev
```

The development server prints a local URL such as `http://localhost:5173/`.
For this Codex session, the preview is currently running at:

```text
http://127.0.0.1:5175/
```

The site uses Vite, React, TypeScript, Tailwind, `react-router-dom`, and `lucide-react`, matching the same general npm workflow as `chenjb1997.github.io` and `sds-theory`.

## Build

```bash
npm run build
npm run preview
```

## Content Updates

Most first-version content lives in:

- `src/data/site.ts`

Update this file for stats, competitions, teachers, captains, awardees, publications, events, alumni, and contact details.

Current pages:

- Home
- Present
- Contests
- Achievements
- People
- Research & Career
- Events
- Join
- Archive

Implemented site behavior:

- PPT-inspired wide-screen visual system with lavender backgrounds, orange section bars, purple track graphics, and reusable brochure imagery.
- Full-screen `/present` route with keyboard page navigation.
- Searchable/filterable awardee directory.
- Responsive desktop-first layouts that collapse to mobile cards.

## GitHub Pages

This project builds with Vite from `main`, then publishes the built `dist` files to the `gh-pages` branch through `.github/workflows/pages.yml`.

For a repository named `sds-xcpc.github.io`, the Vite base path is `/`.

After pushing to GitHub:

1. Open the repository settings.
2. Go to Pages.
3. Set the source to `Deploy from a branch`.
4. Set the branch to `gh-pages` and the folder to `/ (root)`.
5. The workflow will keep `gh-pages` updated from `main`.

## Project Notes

The first version keeps the original brochure content but avoids a vertical handbook feel. The site is designed as a wide-screen team portal with details preserved in data-driven pages and `/archive`.
