# Plan: Site Foundation

## Context

Bootstrap phoganuci.com — personal site and engineering blog. The primary deliverable is the case study post "Building a Production System in One Week," which transforms a sales pitch page into an engineer-to-engineer case study of building the Eat or Yeet recipe platform with AI-assisted development.

## Decisions

- **Static HTML over a framework** — zero build step, self-contained files, maximum control over markup and SEO. A blog with 4 posts doesn't need React, Astro, or Hugo.
- **Dark theme** — forked from the API infrastructure doc design system. Gold/teal accents, Inter + JetBrains Mono, Mermaid diagrams with dark theme variables.
- **S3 + CloudFront hosting** — ~$1/month, full control, same AWS ecosystem as the yeet project. Pulumi for IaC.
- **Separate repo** — clean separation from the recipe platform. Self-contained infrastructure.

## Files Modified

| File | Change |
|------|--------|
| `CLAUDE.md` | Project conventions and operating principles |
| `README.md` | Project overview |
| `justfile` | Development commands |
| `.gitignore` | Ignore patterns |
| `.github/workflows/deploy.yml` | GitHub Actions deploy on push to main |
| `docs/PLAN.md` | Work queue |
| `site/assets/style.css` | Shared design system (dark theme) |
| `site/assets/profile.jpeg` | Author photo |
| `site/index.html` | Home page |
| `site/about.html` | About page |
| `site/blog/index.html` | Blog index |
| `site/blog/building-a-production-system-in-one-week.html` | Main case study post |
| `infra/index.ts` | Pulumi program (S3, CloudFront, ACM, Route53, OIDC) |
| `infra/package.json` | Pulumi dependencies |
| `infra/tsconfig.json` | TypeScript config |
| `infra/Pulumi.yaml` | Pulumi project definition |

## Verification

1. Open each HTML file in browser — all render correctly
2. Mermaid diagrams render in case study post
3. Responsive at 375px, 768px, 1200px
4. All internal links resolve
5. Profile image loads
6. `pulumi preview` shows expected resources (after `npm install`)
