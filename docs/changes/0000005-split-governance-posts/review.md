# Review: Split agent-governance post into three

## What shipped

The single agent-governance RFC was split into a three-post series. All three posts and their appendixes ship on 2026-04-16.

- `site/blog/agent-governance-for-claude-code.html` (rewritten): Part 1, routing. Three-layer hierarchy, namespaced install, authority order with personal layer, composition contract.
- `site/blog/agent-governance-appendix.html` (slimmed): routing-only file skeletons. `$CLAUDE_HOME` redefined to the framework install dir.
- `site/blog/change-rhythm-for-claude-code.html` (new): Part 2, change rhythm. Scratch plans outside the repo, commit messages as narrative, Decision Records as the only durable artifact.
- `site/blog/change-rhythm-appendix.html` (new): Part 2 appendix. Five `agent-*` command skeletons, change-rhythm policy, playbooks, Decision Record template.
- `site/blog/review-and-verify-for-claude-code.html` (new): Part 3, review and verify. Auto-triggered self-review on PR events, seven review dimensions, four default gates, verify discipline, deployment.
- `site/blog/review-and-verify-appendix.html` (new): Part 3 appendix. `agent-review-change` command, review-gates policy, review-dimensions reference, review/verify/deploy playbooks, sanitized GitHub Actions workflow.
- `site/blog/index.html`: featured card points to Part 1; added a two-card "Continue the series" section for Parts 2 and 3; JSON-LD lists all three posts.
- `site/index.html`: Latest section lists all three posts.
- `CLAUDE.md`: Documentation Workflow section rewritten. Scratch plans outside the repo, ADRs as the only durable artifact, no more committed `plan.md` / `review.md`.

## Deviations from plan

**None substantive.** The plan specified the architecture, the content scope per post, and the file lists. All were implemented as designed.

**Small additions:**

- The blog index got a new `.series-card` / `.series-grid` CSS pattern for the secondary series entries. The plan only said "add entries for Posts 2 and 3"; the specific visual design (compact cards below the featured hero) was chosen during implementation. The pattern is small and confined to `site/blog/index.html`.
- Post 3's mermaid gate diagram uses a `decision` class color (rose) not previously used in the design system. This is a diagram-local addition, not a design-token change, and lives only in the inline mermaid block.

## Verification performed

- Grepped every new/modified HTML file under `site/` for em dashes (`—` / `–`): zero matches. Pre-existing em dashes in `site/assets/style.css` comments were left alone; those are in CSS comments, not content, and were out of scope.
- Grepped every post and appendix for `forthcoming` after the Part 1 updates: zero matches. All cross-references now link directly to Parts 2 and 3.
- Structural spot-checks: each of the six HTML files has the full `<!DOCTYPE html>` ... `</html>` scaffold, Open Graph tags, Twitter Card, canonical URL, JSON-LD Article schema, and the series callout where applicable.
- Series navigation is bidirectional: every post and every appendix links to the other two posts and the other two appendixes in the series callout or the closing `rfc-callout`.
- `$CLAUDE_HOME` definition is consistent across all three appendixes: framework install dir `~/.claude/agent-governance/`.
- No mention of `docs/changes/` as a prescribed pattern in any of the three posts. It only appears in Part 2 as historical contrast, and in the `CLAUDE.md` historical note.

## Open items and follow-ups

- Browser rendering verification at 375 / 768 / 1200 px has not been done in this session (no browser available). The CSS follows Part 1's established patterns and adds only one new compact card style; regression risk is low but nonzero. Recommend opening each file locally before the deploy PR merges.
- `docs/PLAN.md` referenced in `CLAUDE.md` does not exist in this repo. No action taken. If a plan file is ever added, it should reference the new change rhythm.

## Notes for future work

This is the last change to use the `docs/changes/NNNNNNN-*/plan.md` + `review.md` pattern. Starting with the next change, the rhythm documented in `CLAUDE.md` applies: scratch plan outside the repo, ADR only if the change produces durable rationale. The `docs/changes/` tree is preserved for history but is no longer part of the active workflow.
