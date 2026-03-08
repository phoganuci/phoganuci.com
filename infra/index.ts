import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const domain = "phoganuci.com";
const wwwDomain = `www.${domain}`;

// ACM requires us-east-1 for CloudFront certificates
const awsConfig = new pulumi.Config("aws");
const usEast1 = new aws.Provider("us-east-1", {
  region: "us-east-1",
  profile: awsConfig.get("profile"),
});

// --- S3 Bucket (static website hosting) ---

const bucket = new aws.s3.BucketV2("site-bucket", {
  bucket: domain,
});

const bucketWebsite = new aws.s3.BucketWebsiteConfigurationV2("site-bucket-website", {
  bucket: bucket.id,
  indexDocument: { suffix: "index.html" },
  errorDocument: { key: "404.html" },
});

const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("site-bucket-public-access", {
  bucket: bucket.id,
  blockPublicAcls: false,
  blockPublicPolicy: false,
  ignorePublicAcls: false,
  restrictPublicBuckets: false,
});

new aws.s3.BucketPolicy("site-bucket-policy", {
  bucket: bucket.id,
  policy: bucket.arn.apply((arn) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: `${arn}/*`,
        },
      ],
    }),
  ),
}, { dependsOn: [publicAccessBlock] });

// --- Route53 Hosted Zone ---

const zone = new aws.route53.Zone("zone", {
  name: domain,
});

// --- ACM Certificate (us-east-1 for CloudFront) ---

const cert = new aws.acm.Certificate(
  "cert",
  {
    domainName: domain,
    subjectAlternativeNames: [wwwDomain],
    validationMethod: "DNS",
  },
  { provider: usEast1 },
);

// DNS validation records
const certValidationRecords = cert.domainValidationOptions.apply((opts) =>
  opts.map(
    (opt, i) =>
      new aws.route53.Record(`cert-validation-${i}`, {
        name: opt.resourceRecordName,
        zoneId: zone.zoneId,
        type: opt.resourceRecordType,
        records: [opt.resourceRecordValue],
        ttl: 60,
      }),
  ),
);

const certValidation = new aws.acm.CertificateValidation(
  "cert-validation",
  {
    certificateArn: cert.arn,
    validationRecordFqdns: certValidationRecords.apply((records) =>
      records.map((r) => r.fqdn),
    ),
  },
  { provider: usEast1 },
);

// --- CloudFront Distribution ---

const cdn = new aws.cloudfront.Distribution("cdn", {
  enabled: true,
  aliases: [domain, wwwDomain],
  defaultRootObject: "index.html",
  priceClass: "PriceClass_100",

  // Use S3 website endpoint as custom origin (supports S3 redirects/index docs)
  origins: [
    {
      originId: "s3-website",
      domainName: bucketWebsite.websiteEndpoint,
      customOriginConfig: {
        httpPort: 80,
        httpsPort: 443,
        originProtocolPolicy: "http-only",
        originSslProtocols: ["TLSv1.2"],
      },
    },
  ],

  defaultCacheBehavior: {
    targetOriginId: "s3-website",
    viewerProtocolPolicy: "redirect-to-https",
    allowedMethods: ["GET", "HEAD"],
    cachedMethods: ["GET", "HEAD"],
    compress: true,
    forwardedValues: {
      queryString: false,
      cookies: { forward: "none" },
    },
  },

  customErrorResponses: [
    {
      errorCode: 404,
      responseCode: 404,
      responsePagePath: "/404.html",
    },
  ],

  viewerCertificate: {
    acmCertificateArn: certValidation.certificateArn,
    sslSupportMethod: "sni-only",
    minimumProtocolVersion: "TLSv1.2_2021",
  },

  restrictions: {
    geoRestriction: { restrictionType: "none" },
  },
});

// --- Route53 DNS Records (A + AAAA for apex and www) ---

const aliasTargets = [
  { name: domain, recordType: "A" as const },
  { name: domain, recordType: "AAAA" as const },
  { name: wwwDomain, recordType: "A" as const },
  { name: wwwDomain, recordType: "AAAA" as const },
];

for (const { name, recordType } of aliasTargets) {
  const prefix = name === wwwDomain ? "www-" : "";
  new aws.route53.Record(`${prefix}${recordType.toLowerCase()}`, {
    name,
    zoneId: zone.zoneId,
    type: recordType,
    aliases: [
      {
        name: cdn.domainName,
        zoneId: cdn.hostedZoneId,
        evaluateTargetHealth: false,
      },
    ],
  });
}

// --- GitHub Actions OIDC + Deploy Role ---

const ghOidc = new aws.iam.OpenIdConnectProvider("github-oidc", {
  url: "https://token.actions.githubusercontent.com",
  clientIdLists: ["sts.amazonaws.com"],
  thumbprintLists: ["6938fd4d98bab03faadb97b34396831e3780aea1"],
});

const deployRole = new aws.iam.Role("deploy-role", {
  assumeRolePolicy: ghOidc.arn.apply((oidcArn) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { Federated: oidcArn },
          Action: "sts:AssumeRoleWithWebIdentity",
          Condition: {
            StringEquals: {
              "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            },
            StringLike: {
              "token.actions.githubusercontent.com:sub":
                "repo:phoganuci/phoganuci.com:*",
            },
          },
        },
      ],
    }),
  ),
});

new aws.iam.RolePolicy("deploy-policy", {
  role: deployRole.id,
  policy: pulumi
    .all([bucket.arn, cdn.arn])
    .apply(([bucketArn, cdnArn]) =>
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "S3Sync",
            Effect: "Allow",
            Action: ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
            Resource: [bucketArn, `${bucketArn}/*`],
          },
          {
            Sid: "CloudFrontInvalidation",
            Effect: "Allow",
            Action: "cloudfront:CreateInvalidation",
            Resource: cdnArn,
          },
        ],
      }),
    ),
});

// --- Exports ---

export const bucketName = bucket.id;
export const cloudFrontDomainName = cdn.domainName;
export const cloudFrontDistributionId = cdn.id;
export const deployRoleArn = deployRole.arn;
export const nameServers = zone.nameServers;
