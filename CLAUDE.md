# CLAUDE.md

## Project Overview

Personal site and engineering blog at phoganuci.com. Static HTML/CSS, hosted on S3 + CloudFront, deployed via GitHub Actions. Infrastructure managed with Pulumi (TypeScript).

Author: Patrick Hogan — staff engineer, builds production systems with AI.

## Operating Principles

**Document every decision, not just the outcome.** Blog posts are arguments, not announcements. When choosing a technology, write down *why* — not just what was chosen. The reasoning is the value.

**Technology choices require explicit rationale.** Every technology in this project exists for a stated reason. When adding a dependency, tool, or service: document what problem it solves, what alternatives were considered, and why this one won.

**Blog content is a product — treat it like one.** Posts have an audience (senior engineers), a voice (engineer-to-engineer, not marketing), and quality standards (accurate stats, working code examples, tested claims). Every factual claim should be verifiable.

**The plan is not scripture.** The plan (`docs/PLAN.md`) is a guide, not a mandate. Before starting any change, question whether the direction still makes sense.

**Main is evergreen.** Every page on main should render correctly in a browser. Broken links, missing assets, malformed HTML — if you see it, fix it in the same commit.

**Proactively flag improvements.** If a post could be better — a claim that's vague, a diagram that's misleading, a code example that's outdated — raise it.

**Ask, don't assume.** If you're about to write something and realize there's a meaningfully better approach — stop and ask.

**Verify before committing.** Open every HTML file in a browser before committing. Check: mermaid diagrams render, links work, images load, responsive layout at 375px/768px/1200px, no console errors.

**Fix holistically, not locally.** If you find a broken pattern in one page, check all pages. Fix at the source.

## Documentation Workflow

**Documentation is part of every change, not an afterthought.** Every commit that changes behavior must also update the relevant docs. This is not optional — stale docs are worse than no docs.

**Two document categories:**

**Immutable**: `docs/changes/` — change plans and reviews. Once committed, never edited.

**Evergreen**: `CLAUDE.md`, `docs/PLAN.md`, `README.md` — living documents. Updated as the project evolves.

**The commit process for every significant change:**

1. **Plan**: Write `docs/changes/NNNNNNN-short-name/plan.md` — context, decisions, what will change
2. **Implement**: Do the work
3. **Review**: Write `docs/changes/NNNNNNN-short-name/review.md` — deviations, additional changes, learnings
4. **Update evergreen docs**: Update `CLAUDE.md`, `docs/PLAN.md`, `README.md` to reflect the new state
5. **Commit**: All of the above in the same commit

`plan.md` is immutable once written. Deviations go in `review.md`.

**Always update evergreen docs when:**
- A technology decision changes or a new one is made → update CLAUDE.md tech decisions table
- A work queue item is completed or status changes → update PLAN.md
- A new command, prerequisite, or workflow is added → update README.md and CLAUDE.md
- Infrastructure changes → update CLAUDE.md infrastructure section

## Technology Decisions

| Component | Choice | Why | Alternatives Considered |
|-----------|--------|-----|------------------------|
| Hosting | S3 + CloudFront | ~$1/month, full control, same AWS ecosystem | Netlify, GitHub Pages, Vercel |
| IaC | Pulumi (TypeScript) | Same language as blog tooling, AI can reason about it | Terraform, CloudFormation, CDK |
| Content format | Static HTML | Zero build step, self-contained, maximum control | Hugo, Astro, MDX |
| Design | Custom CSS (dark theme) | Full control, design tokens in CSS custom properties | Tailwind, Bootstrap |
| Diagrams | Mermaid (CDN) | Renders in-browser, version-controlled as text | Excalidraw, draw.io |
| Deploy | GHA + S3 sync | Simple, OIDC federation (no stored creds) | Manual upload, Pulumi S3 objects |
| Domain | Route53 | Already in AWS ecosystem, programmatic via Pulumi | CloudFlare, Namecheap |
| Task runner | just | Same as yeet, simple, no runtime dependency | make, npm scripts |

## Content Standards

**Blog posts must include:**
- Verifiable facts — stats from real projects, not hand-waved estimates
- Working code examples — if showing Pulumi code, it should match the actual infra
- Honest trade-offs — every technology choice has downsides; state them
- Engineer-to-engineer voice — no marketing language
- Practical takeaways — the reader should leave knowing how to do something

**Every post must pass:**
- HTML validation (no unclosed tags, valid structure)
- All mermaid diagrams render
- All links resolve (internal and external)
- Responsive at 375px, 768px, 1200px+
- SEO checklist (see below)

## Content Security (Public Repo)

This repo is **public**. Blog posts reference the yeet project. All content must be scrubbed of identifiers that could aid targeted attacks.

**Must redact:** AWS account IDs, IP addresses, S3 bucket names, Auth0 tenant domains/client IDs, ECR URIs, security group/VPC IDs, GitHub secret names, SSH key references

**Safe to include:** Architecture patterns, cost figures, technology names, eat-or-yeet.com domain, generic code patterns, quantitative stats, Pulumi resource types

**Rule:** Share patterns and decisions, not identifiers. Code examples use placeholder values.

## Design System

Dark theme:
- Background: `#0F1117`, surface: `#1a1d2e`
- Accent gold: `#E8A849`, accent teal: `#4ECDC4`
- Fonts: Inter (body), JetBrains Mono (code)
- Mermaid: dark base theme with gold/teal node colors
- All tokens in CSS custom properties in `site/assets/style.css`

## SEO Checklist (Every Page)

- `<title>` — descriptive, keyword-rich
- `<meta name="description">` — 150-160 chars
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Canonical URL: `<link rel="canonical">`
- JSON-LD: `schema.org/Article` (posts) or `schema.org/WebSite` (home)
- Semantic HTML: `<article>`, `<header>`, `<section>`, `<nav>`, `<footer>`
- Heading hierarchy: single `<h1>`, logical `<h2>`/`<h3>` nesting
- `<html lang="en">`

## Infrastructure

- **AWS account**: Dedicated `phoganuci-com` account in the eat-yeet AWS Organization. Accessed via `OrganizationAccountAccessRole` from management account (profile: `phoganuci-com`)
- **Pulumi stack** (`infra/`, stack: `production`): S3 bucket, CloudFront, ACM cert, Route53 hosted zone + records, OIDC provider + deploy role
- **Domain**: `phoganuci.com` registered via Route53 in the dedicated account
- **Deploy** (`.github/workflows/deploy.yml`): On push to main → `aws s3 sync site/ s3://... --delete` → `aws cloudfront create-invalidation`
- **OIDC federation**: GitHub Actions → AWS role, zero stored credentials
- **Cost**: ~$1/month (S3 + CloudFront + Route53) + $15/year domain

## Development Commands

```bash
just preview          # Open site/index.html in browser
just deploy           # Manual deploy: sync to S3 + invalidate CloudFront
just infra preview    # Pulumi preview
just infra up         # Pulumi apply
just validate         # Check all HTML files for common issues
```

## Commit Convention

Conventional Commits: `type(scope): description`

Types: `feat`, `fix`, `chore`, `docs`, `style`, `infra`
Scopes: `post`, `site`, `infra`, `ci`

## PLAN.md

`docs/PLAN.md` is the project plan. Work queue, completed items, post-MVP ideas. Edit in place as work progresses.
