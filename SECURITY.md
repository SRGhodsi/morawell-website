# Security information

**This repository is for the public, static Morawell website only.** It has no authenticated users, API credentials, backend, server-side logic or storage of customer data.

Report a security issue privately at **info@morawell.com**. Please do not publish security vulnerabilities in public issues.

## Maintainer checklist
- Require MFA for all administrators of the GitHub and DNS accounts.
- Limit write access to repository maintainers; review commits before publishing.
- Keep source free of credentials, internal documents, real interviews, and proprietary algorithms.
- Configure GitHub Pages on `main` / `/ (root)`, with custom domain `morawell.com`.
- Verify the domain ownership in GitHub Pages settings and enforce HTTPS after certificate provisioning.
- If using Cloudflare as an HTTP reverse proxy (not merely DNS), set `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and `Permissions-Policy` response headers. A meta CSP cannot provide `frame-ancestors`.
- Review and test CSP and any new integrations every time third-party scripts, network requests, forms, or authentication are added.

### Existing browser restrictions
The HTML files include a meta Content Security Policy allowing only same-origin scripts and assets and disallowing network connections to APIs. It also disables object/frame embedding and suppresses referrer transmission. These are defenses-in-depth, not a substitute for HTTPS or web-server response headers.
