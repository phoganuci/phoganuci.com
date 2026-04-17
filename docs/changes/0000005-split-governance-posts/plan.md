# Plan: Split agent-governance post into three, fix namespacing and personal-layer gaps, reshape change docs around ADRs

## Context

The published RFC at `site/blog/agent-governance-for-claude-code.html` (+ appendix) has two structural flaws and bundles three separable topics into one long read. This change fixes the flaws and splits the content into a three-post series. It also introduces the workflow shift that retires committed `plan.md` + `review.md` in favor of ephemeral scratch plans outside the repo plus ADRs as the only durable artifact. This is the final change to use the legacy `docs/changes/` workflow; `CLAUDE.md` is updated in the same commit to take effect immediately for all subsequent work.

## Flaws being fixed

1. **Framework squats on `~/.claude/` top-level.** The published design plants framework-owned files at `~/.claude/CLAUDE.md` and `~/.claude/docs/agents/`. Those paths belong to the user and to Claude Code itself; the framework must live in a namespaced subdirectory.
2. **No user-level extension.** The published design has only two layers (global + repo), leaving no place for a user's personal preferences that should apply across all their repos.

Both flaws share one root cause: the framework conflates user scope with framework scope. Namespacing the framework fixes both.

## Decisions

1. **Framework namespace:** `~/.claude/agent-governance/` (sibling of the user's personal files and of `~/.claude/agent-governance-plans/`).
2. **Personal docs location:** `~/.claude/personal/docs/agents/`.
3. **Scratch plan storage:** `~/.claude/agent-governance-plans/` — framework-namespaced, outside the repo, sibling to the install dir. Deliberately separate so a framework reinstall never touches in-flight plans.
4. **Durable artifact model:** ADRs only. `plan.md` and `review.md` are eliminated from committed history. Commit messages and ADRs carry the full durable record.
5. **Three posts**, not two. Review & verify gets its own post because deployment is first-class there.
6. **URL strategy:** routing post keeps `/blog/agent-governance-for-claude-code.html`. The other two get new URLs.
7. **`$CLAUDE_HOME`** is redefined to mean the framework install dir (default `~/.claude/agent-governance/`), not `~/.claude` itself. All existing `$CLAUDE_HOME/docs/agents/...` references resolve correctly under the new definition.
8. **Auto-triggered self-review on PR events** is a first-class mechanism in Post 3, invoking `agent-review-change` on PR `opened` / `synchronize` / `reopened` / `ready_for_review`.

## Three-layer hierarchy

Authority order (top beats bottom):
1. Direct user task instructions
2. Repo `./CLAUDE.md` + repo `docs/agents/*`
3. Personal `~/.claude/CLAUDE.md` + `~/.claude/personal/docs/agents/*`
4. Framework `$CLAUDE_HOME/CLAUDE.md` + framework `$CLAUDE_HOME/docs/agents/*`
5. Code & tests
6. External memory / prior-session context

## File Changes

### New Files

- `site/blog/change-rhythm-for-claude-code.html` — Post 2 (change rhythm)
- `site/blog/change-rhythm-appendix.html` — Post 2 appendix
- `site/blog/review-and-verify-for-claude-code.html` — Post 3 (review & verify)
- `site/blog/review-and-verify-appendix.html` — Post 3 appendix
- `docs/changes/0000005-split-governance-posts/plan.md` — this file
- `docs/changes/0000005-split-governance-posts/review.md` — post-implementation review (last use of this pattern)

### Modified Files

- `site/blog/agent-governance-for-claude-code.html` — rewrite as routing-only; apply three-layer hierarchy fix; update meta/hero/JSON-LD; remove change-bundle and review sections; add series-navigation callout to Posts 2 & 3
- `site/blog/agent-governance-appendix.html` — slim to routing sections only; redefine `$CLAUDE_HOME`; update authority order and composition rules to include personal layer
- `site/blog/index.html` — add featured/secondary entries for all three posts; update JSON-LD blogPost list
- `site/index.html` — update "Latest" section if needed
- `CLAUDE.md` — replace "Documentation Workflow" section to reflect the new rhythm: scratch plans in `~/.claude/agent-governance-plans/`, ADRs as durable artifact, no more `docs/changes/*/plan.md` + `review.md` for future work

### Unchanged

- `infra/`, `Justfile`, `.github/workflows/`, `site/assets/`, `site/404.html`, `README.md` (unless it references the old change workflow)

## Commands surface (final mapping)

| Command | Post | Purpose |
|---|---|---|
| `agent-adopt` | Routing | first-time repo onboarding |
| `agent-add-capability` | Routing | extend the capability map |
| `agent-improve` | Routing | improve framework docs |
| `agent-plan-change` | Change rhythm | write scratch plan in `~/.claude/agent-governance-plans/` |
| `agent-open-change` | Change rhythm | branch + draft PR |
| `agent-implement-change` | Change rhythm | execute the plan |
| `agent-close-change` | Change rhythm | merge, discard scratch plan, write ADR if warranted |
| `agent-record-decision` | Change rhythm | write an ADR (callable standalone) |
| `agent-review-change` | Review & verify | auto-triggered by CI on PR events; produces structured review against the review-dimensions table |

## Verification

```bash
just validate    # HTML sanity check on all six affected files
just preview     # Open each in a browser; inspect dark theme rendering
```

Manual checks:
- Three-layer tree renders in routing post's `.file-tree` block.
- `$CLAUDE_HOME` definition consistent across all three appendixes.
- No lingering `~/.claude/CLAUDE.md` or `~/.claude/docs/agents/` used in a framework-ownership context.
- No committed `plan.md`/`review.md` prescribed anywhere in Post 2; historical/contrast context only.
- Auto-triggered self-review section in Post 3 includes sanitized GHA workflow snippet.
- Series navigation works in both directions across all three posts.
- Responsive checks at 375 / 768 / 1200 px.
- Grep for em dashes (forbidden per style rules): should return zero matches in modified files.
- Each post has its own `<title>`, description, OG/Twitter tags, canonical URL, JSON-LD Article schema.
