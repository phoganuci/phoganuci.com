# phoganuci.com

Personal site and engineering blog. Static HTML/CSS hosted on S3 + CloudFront.

## Prerequisites

**Install manually:**
- [Homebrew](https://brew.sh)
- [just](https://github.com/casey/just) — `brew install just`

**Infra tools (install via Homebrew):**
- [AWS CLI](https://aws.amazon.com/cli/) — `brew install awscli`
- [Pulumi](https://www.pulumi.com/) — `brew install pulumi`
- [Node.js](https://nodejs.org/) — `brew install node`

## Getting Started

```bash
# 1. Install dependencies
just setup

# 2. Configure AWS access for local deploys
#    just deploy always uses the phoganuci-com profile from justfile
#    that profile is expected to assume the site account from a working default profile
aws configure  # or other AWS auth for the default/source profile

# 3. Preview the site locally
just preview
```

## AWS Auth Model

Local manual deploys use a two-step AWS profile chain:

- `default` is the source credential.
- `phoganuci-com` is the role profile used by `just deploy`.

The important detail is that `just deploy` does **not** use an arbitrary profile from your shell. The repo's `justfile` exports `AWS_PROFILE=phoganuci-com`, so the expected local setup is:

```ini
[default]
# working source credentials

[profile phoganuci-com]
role_arn = <site-account-role>
source_profile = default
region = us-east-1
```

That means:

- If `default` is broken, `just deploy` is broken.
- Creating a separate profile like `console` does nothing unless `phoganuci-com` is explicitly re-pointed to use it.
- If you authenticate with a login-based profile, wire it into the source profile that `phoganuci-com` assumes from. Do not expect `just deploy` to pick it up automatically.

For this repo, the simplest mental model is: **fix `default`, then use `phoganuci-com`.**

## Commands

```bash
just preview          # Open site/index.html in browser
just validate         # Check all HTML files for common issues
just deploy           # Manual deploy: sync to S3 + invalidate CloudFront
just infra-preview    # Pulumi preview
just infra-up         # Pulumi apply
just setup            # Install infra dependencies
```

## Deploy

Preferred publish path: push `site/**` changes to `main` and let GitHub Actions deploy via OIDC.

Manual fallback: `just deploy`.

The manual path depends on the local AWS profile chain described above. The GitHub Actions path does not depend on your local AWS login state.

## Infrastructure

Pulumi (TypeScript) manages all infrastructure in a dedicated AWS account (`phoganuci-com`) within the eat-yeet AWS Organization:
- S3 bucket (static website hosting)
- CloudFront distribution (CDN + HTTPS)
- ACM certificate (TLS for phoganuci.com + www)
- Route53 hosted zone + DNS records
- GitHub Actions OIDC provider + deploy role

See `infra/` for the full Pulumi program.

## Posts

- [Agent Governance for Claude Code](/blog/agent-governance-for-claude-code)
- Enterprise Spin-Up Checklist (coming soon)
- How This Blog is Hosted (coming soon)
- Clickops is in Trouble (coming soon)
