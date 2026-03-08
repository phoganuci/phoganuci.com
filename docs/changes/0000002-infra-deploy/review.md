# Review: Infrastructure Provisioning & First Deploy

## Deviations from Plan

### Race condition fix
The S3 bucket policy creation raced with the public access block disable. Fixed by adding `dependsOn: [publicAccessBlock]` in Pulumi.

### ACM cert created in wrong account
The explicit `us-east-1` AWS provider didn't inherit the `aws:profile` from stack config, so the ACM certificate was created in the management account instead of the dedicated account. Fixed by reading the profile from Pulumi config:
```ts
const awsConfig = new pulumi.Config("aws");
const usEast1 = new aws.Provider("us-east-1", {
  region: "us-east-1",
  profile: awsConfig.get("profile"),
});
```

### Duplicate Route53 hosted zones
Route53 domain registration automatically creates a hosted zone. Pulumi also creates one. The domain's NS records pointed to the registrar zone, not the Pulumi zone, so cert validation couldn't complete. Fix: deleted the registrar zone, updated domain NS to match Pulumi's zone.

After the destroy/recreate cycle, the zone got new NS records, requiring a second NS update.

### Missing 404.html
The S3 website config and CloudFront error response both reference `404.html`, but it didn't exist. Created a simple 404 page.

## Additional Changes

- `~/.aws/config` — added `phoganuci-com` profile (assumes `OrganizationAccountAccessRole` from management account)
- `justfile` — added `AWS_PROFILE` export, `infra-outputs` command, deploy now reads CloudFront distribution ID from Pulumi outputs instead of env var
- `README.md` — expanded with prerequisites, getting started, full command reference
- `CLAUDE.md` — added documentation workflow principles (docs updated as part of every commit)
- `docs/PLAN.md` — updated statuses, added decoupling section for eat-or-yeet dependencies

## Learnings

1. Explicit Pulumi providers don't inherit stack config — always pass config values explicitly
2. Route53 domain registration creates a hosted zone automatically — must account for this when Pulumi manages its own zone
3. New domain NS propagation takes 5-15 minutes, which blocks ACM DNS validation
4. New AWS org accounts have no account-level S3 public access block by default (unlike the console default)
