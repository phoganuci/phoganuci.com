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

# 2. Configure AWS access (requires eat-yeet org management account credentials)
#    The phoganuci-com profile assumes OrganizationAccountAccessRole in the dedicated account
aws configure  # set default profile with management account credentials

# 3. Preview the site locally
just preview
```

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

Automated via GitHub Actions on push to main (when `site/**` changes). Manual: `just deploy`.

## Infrastructure

Pulumi (TypeScript) manages all infrastructure in a dedicated AWS account (`phoganuci-com`) within the eat-yeet AWS Organization:
- S3 bucket (static website hosting)
- CloudFront distribution (CDN + HTTPS)
- ACM certificate (TLS for phoganuci.com + www)
- Route53 hosted zone + DNS records
- GitHub Actions OIDC provider + deploy role

See `infra/` for the full Pulumi program.

## Posts

- [Building a Production System in One Week](/blog/building-a-production-system-in-one-week)
- Enterprise Spin-Up Checklist (coming soon)
- How This Blog is Hosted (coming soon)
- Clickops is in Trouble (coming soon)
