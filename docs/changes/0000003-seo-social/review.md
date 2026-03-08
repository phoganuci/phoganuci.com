# Review: SEO & Social Sharing Tags

## Summary

All three HTML pages now have complete OG and Twitter Card meta tags per the SEO checklist in CLAUDE.md.

## Changes made

### `site/index.html`
- Updated `meta description`, `og:description`, `twitter:description` to match subtitle: "Patrick Hogan — Software Engineer."
- Updated JSON-LD description to match
- `og:image` and Twitter Card tags were already present from prior work

### `site/blog/index.html`
- Added `og:image` pointing to `https://phoganuci.com/assets/profile.jpeg`
- Added full Twitter Card block: `twitter:card` (summary), `twitter:title`, `twitter:description`, `twitter:image`

### `site/blog/building-a-production-system-in-one-week.html`
- Added `og:image` pointing to `https://phoganuci.com/assets/profile.jpeg`
- Added `twitter:image` — other Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`) were already present

## Deviations from plan

None.

## Notes
- Using `profile.jpeg` as OG image across all pages. Dedicated OG images per post are a post-MVP item.
- The blog post uses `summary_large_image` card type (pre-existing); the homepage and blog index use `summary`.
