# Security and privacy

This repository is a prototype and has not received an independent security or
financial-compliance review. Do not use it with real client records.

Never commit credentials, .env files, local databases, transcripts, financial
documents, customer exports, or production logs. Report vulnerabilities
privately to the repository owner; do not attach customer information to a
public issue.

Before any real-world pilot, add tenant isolation tests, authorization tests for
every client route, CSRF and upload controls, encrypted storage, retention and
deletion procedures, incident response, dependency monitoring, and review by
qualified security and compliance professionals.

## Dependency review: October 2, 2026

Updated Next.js and eslint-config-next from 15.5.23 to 15.5.27 after CI flagged
a critical dependency advisory. The patch addresses the affected Next.js ranges
for [Windows-hosted RCE](https://github.com/advisories/GHSA-p293-qw3h-jr36) and
[AVIF image-optimization RCE](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4).

Local type checking and production build passed. The updated lockfile audit
reported 0 critical, 22 high, 5 moderate and 2 low findings. The critical-only
CI threshold does not mean all security findings are resolved. Additional
dependency remediation and application/access-control review remain required
before any deployment with real client information. Recheck current advisories
before relying on these dated counts.
