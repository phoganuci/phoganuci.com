# Review: Site Foundation

## Deviations from Plan

| Planned | Implemented | Rationale |
|---------|------------|-----------|
| About page (`about.html`) | Removed entirely | Avatar and social links folded into the home page hero. Separate about page added no value for a single-page personal site. |
| 4 blog posts | 1 post (case study) | "Enterprise Spin-Up Checklist", "How This Blog is Hosted", and "Clickops is in Trouble" deferred to future changes. The case study is the primary deliverable. |
| Em dashes throughout prose | Replaced with periods, commas, colons | User preference: em dashes are not how humans write. All `&mdash;` entities removed from prose. Code comments inside `<pre>` blocks retain literal `—` characters. |
| "Staff Engineer" title | "Engineer" | User preference: "staff" sounds conceited. Removed from title, meta tags, subtitle, JSON-LD. |
| 9 sections in blog post | 8 sections | "How AI Was Used" merged into "The Documentation Strategy" to eliminate duplication. CLAUDE.md pattern content and change doc workflow now live in one section. |
| Black hole accretion disc canvas | Particle network + nebula (constellation style) | Matched to the blog index canvas for visual consistency across pages. Simpler, cleaner. |
| 51K LOC stat | 96K LOC (from git history) | Original stat only counted application code. Updated to total net LOC from `git log --numstat` (107K insertions, 11K deletions). Frontend TypeScript also corrected from 19K to 29K. |
| Tables for plan reassessments and CI/CD workflows | Prose | User preference: tables feel like marketing. Converted to narrative prose throughout. |
| Pulumi infrastructure provisioned | Deferred | Domain registration and S3/CloudFront/Route53 provisioning deferred to a separate change. Site content is the deliverable for this change. |

## Additional Changes

- **Home page redesign**: Canvas animation (particles + nebula), SVG icons for GitHub/LinkedIn/Blog with per-brand hover colors and motion, gradient shimmer on name.
- **Blog index redesign**: Full-width featured post card with rainbow top border, stat strip (153 commits, 96K lines, 134 change docs, $14/mo), canvas animation matching home page.
- **Post-card hover animation**: Lift effect (`translateY(-6px)`), gold border glow, gradient top border reveal, h3 color shift on hover.
- **Proof of concept caveats**: "What's Next" section reframed as proof of concept. Explicitly notes no HPA, no multi-node scheduling, no managed databases. Design decisions made so scaling takes less time than the initial build.
- **Plan/review sample**: Added real excerpts from yeet change 0000025 (Helm chart) showing plan decisions and implementation deviations. Illustrates the workflow's value.
- **Just commands section**: "The Command Interface" added to Testing Harness, showing the full `just` command surface organized by workflow (setup, testing, backend/frontend/infra, production).
- **File tree CSS**: Custom `.file-tree` class with `line-height: 1.25` for connected box-drawing characters. Color-coded spans for directories (gold), files (secondary), comments (tertiary).
- **Prism.js syntax highlighting**: Tomorrow Night theme via CDN for code blocks.

## Learnings

- Unicode box-drawing characters (`│├└`) need `line-height` close to 1.0 to connect perfectly, but font rendering at small sizes causes overlap below 1.2. 1.25 is the practical compromise.
- Base `a:hover` styles need lower specificity than component hover styles. `a.post-card:hover` beats `a:hover` where plain `.post-card:hover` does not.
- Canvas animations should be consistent across pages. Having different visual styles (black hole vs constellations) felt disjointed.
- Em dash removal is tedious but the prose reads better without them. Periods and colons force shorter, clearer sentences.
