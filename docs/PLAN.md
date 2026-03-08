# PLAN.md — phoganuci.com

## Work Queue

| # | Item | Status |
|---|------|--------|
| 1 | Site foundation: CSS, home, about, blog index | In progress |
| 2 | Case study post: Building a Production System in One Week | In progress |
| 3 | Pulumi infrastructure: S3, CloudFront, ACM, Route53, OIDC | In progress |
| 4 | Domain registration + provisioning | Done |
| 5 | GitHub Actions deploy workflow | Planned |
| 6 | Blog post: Enterprise Spin-Up Checklist | Planned |
| 7 | Blog post: How This Blog is Hosted | Planned |
| 8 | Blog post: Clickops is in Trouble | Planned |

## Completed

| # | Item | Notes |
|---|------|-------|
| 4 | Domain registration | phoganuci.com registered via Route53 in dedicated AWS account |

## Post-MVP

- RSS feed (static XML)
- Social card images (og:image)
- Dark/light theme toggle
- Reading time calculation
- Analytics (privacy-respecting)

## Decoupling from eat-or-yeet

The phoganuci.com project currently has coupling to the eat-or-yeet project that should be cleaned up:

| Item | Current State | Target State |
|------|--------------|--------------|
| Pulumi org | Stack lives in `eat-yeet-food-org` on Pulumi Cloud | Create dedicated `phoganuci` Pulumi org, transfer stack |
| AWS Organization | Dedicated `phoganuci-com` account, but within eat-yeet AWS Org | Acceptable for now (billing consolidation), but document the dependency |
| AWS credentials | `~/.aws/config` profile assumes role from eat-yeet management account | Standalone IAM user or SSO in the dedicated account |
| Pulumi access token | Shared with eat-yeet Pulumi Cloud login | Separate token scoped to `phoganuci` org (after migration) |
