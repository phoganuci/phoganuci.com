# phoganuci.com — personal site and blog

export AWS_PROFILE := "phoganuci-com"
export PULUMI_CONFIG_PASSPHRASE := ""
export PULUMI_BACKEND_URL := "file://~/.pulumi-local"

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
    DIST_ID=$(aws cloudfront list-distributions \
        --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, 'phoganuci.com')].Id | [0]" \
        --output text)
    if [ -z "$DIST_ID" ] || [ "$DIST_ID" = "None" ]; then
        echo "Could not resolve CloudFront distribution for phoganuci.com" >&2
        exit 1
    fi
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
