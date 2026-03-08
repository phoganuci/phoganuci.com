# Plan: Infrastructure Provisioning & First Deploy

## Context

The site content and Pulumi code existed but nothing was deployed. Need to:
1. Provision a dedicated AWS account
2. Run Pulumi to create all infrastructure
3. Register the phoganuci.com domain
4. Deploy the site content to S3
5. Set up GitHub Actions secrets for automated deploys

## Decisions

**Dedicated AWS account vs shared**: Created a new `phoganuci-com` member account in the existing eat-yeet AWS Organization. Free (no account cost), provides clean isolation from yeet resources, same consolidated billing. Access via `OrganizationAccountAccessRole` assumed from the management account.

**Domain registration**: Route53 in the dedicated account. $15/year, auto-configures NS records to match the Pulumi-managed hosted zone.

**Pulumi state**: Stored in Pulumi Cloud under the existing `eat-yeet-food` organization. Stack name: `production`.

## What Will Change

- `~/.aws/config` — new `phoganuci-com` profile added
- `infra/Pulumi.production.yaml` — stack config created by `pulumi config set`
- `infra/index.ts` — fix race condition: bucket policy depends on public access block
- AWS resources created: S3 bucket, CloudFront, ACM cert, Route53 zone + records, OIDC provider, deploy role
- Domain `phoganuci.com` registered via Route53
- Site content synced to S3
