# Review: Blog Refactor — New Post 1 + Series Roadmap

## Deviations from Plan

1. **Tax metaphor throughout**: Extended the "complexity tax" metaphor consistently — loopholes, write-offs, audits, amortization, deductions, filing, surcharges, tax brackets. Section headers use "Loophole #N" pattern. Closing is "File Your Returns."
2. **No stat strip on featured card**: Removed as planned. The essay doesn't have the quantitative data that justified the stat strip on the case study.
3. **Updated commit count**: Bumped from 153 to 266 in the foreword (current count per plan stats).

## Additional Changes

- Blog index JSON-LD now includes both posts (new post first)
- Home page "Latest" section points to new post

## Learnings

- The `.post-card` CSS from `style.css` works perfectly for the secondary listing — no new CSS was needed.
- The existing featured card CSS (`.featured-card`) accommodates removing the stat strip cleanly — the "Read" arrow positions correctly without it.
