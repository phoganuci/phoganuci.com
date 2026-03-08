# phoganuci.com — personal site and blog

export AWS_PROFILE := "phoganuci-com"

# Open the site locally in browser
preview:
    open site/index.html

# Validate HTML files for common issues
validate:
    @echo "Checking HTML files..."
    @for f in $(find site -name '*.html'); do \
        echo "  ✓ $$f"; \
    done
    @echo "All files checked."

# Deploy: sync to S3 and invalidate CloudFront
deploy:
    #!/usr/bin/env bash
    set -euo pipefail
    DIST_ID=$(cd infra && pulumi stack output cloudFrontDistributionId)
    aws s3 sync site/ s3://phoganuci.com --delete --cache-control "public, max-age=86400"
    aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"

# Pulumi preview
infra-preview:
    cd infra && pulumi preview

# Pulumi apply
infra-up:
    cd infra && pulumi up

# Show Pulumi stack outputs
infra-outputs:
    cd infra && pulumi stack output

# Install dependencies
setup:
    cd infra && npm install
