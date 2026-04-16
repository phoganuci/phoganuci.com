# Plan: Blog Refactor — New Post 1 + Series Roadmap

## Context

The current 18-min case study post tries to cover everything. Replace it as the featured post with a focused ~6-min essay on exploiting complexity tax loopholes with AI — enterprise tooling that used to require teams is now accessible to solo engineers, and IaC is the place to start. Archive the case study at its current URL as a secondary listing. Populate PLAN.md with the blog series roadmap.

## Decisions

1. **New post URL**: `/blog/complexity-tax-loopholes` — descriptive, matches thesis
2. **Case study stays at current URL**: No redirect infra exists. Archiving is a presentation concern, not a filesystem concern.
3. **No stat strip on new featured card**: The new post is an essay, not a quantitative case study. The stat strip doesn't fit.
4. **Reuse existing `.post-card` CSS**: The secondary listing for the case study uses the same card component from `style.css`. No new CSS needed.
5. **One Mermaid diagram**: k3s architecture with EKS scaling path. Fresh code, not copied from the case study.
6. **Fresh code snippets**: Short (3-8 lines), illustrative, not copied from case study. Proto, decorator pattern, test tiers.

## File Changes

### New Files
- `site/blog/complexity-tax-loopholes.html` — New Post 1
- `docs/changes/0000004-blog-refactor/plan.md` — This file
- `docs/changes/0000004-blog-refactor/review.md` — Post-implementation review

### Modified Files
- `site/blog/index.html` — New post as featured card, case study as secondary listing, updated JSON-LD
- `site/index.html` — Update "Latest" post card to point to new post
- `docs/PLAN.md` — Complete rewrite with updated work queue and blog series roadmap

### Unchanged Files
- `site/blog/building-a-production-system-in-one-week.html` — Stays at current URL, no content changes
- `site/assets/style.css` — Reuse existing `.post-card` for secondary listing

## Verification

```bash
just validate    # Check all HTML files for common issues
just preview     # Open in browser — verify both posts render, links work, responsive at 375/768/1200px
```
