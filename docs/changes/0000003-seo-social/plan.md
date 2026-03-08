# Plan: SEO & Social Sharing Tags

## Context

Social shares of phoganuci.com look bare — missing `og:image`, Twitter Card tags, and stale descriptions. Need to bring all pages up to the SEO checklist in CLAUDE.md.

## Changes

### All 3 HTML pages need:
- `og:image` — use `https://phoganuci.com/assets/profile.jpeg` for now (proper OG images are post-MVP)
- Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- Consistent, accurate descriptions

### Per-page fixes:

**`site/index.html`** (already partially done):
- ✅ Title updated to "Patrick Hogan — Software Engineer"
- ✅ og:image added
- ✅ Twitter Card tags added
- Fix: description says "Engineer building production systems with AI" — update to match new subtitle

**`site/blog/index.html`**:
- Add `og:image`
- Add Twitter Card tags (`summary` card type)

**`site/blog/building-a-production-system-in-one-week.html`**:
- Add `og:image`
- Add `twitter:image` (has other twitter tags already)

## Files
- `site/index.html`
- `site/blog/index.html`
- `site/blog/building-a-production-system-in-one-week.html`
- `docs/changes/0000003-seo-social/`

## Verification
- `curl -s https://phoganuci.com/ | grep -E 'og:|twitter:'` after deploy
- Test share preview with https://opengraph.xyz
