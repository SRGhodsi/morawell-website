# Morawell — Official Site and Decision DNA

This is a standalone **static** website. It is intentionally separate from `pilot-webapp` and contains no application server or customer data.

## Live pages
- `index.html`: homepage + five-step Decision DNA interactive demo
- `services.html`: services overview
- `contact.html`: contact details, including [LinkedIn](https://www.linkedin.com/company/morawell), email and WhatsApp

## Publication (GitHub Pages)
1. Create a new **public**, empty GitHub repository named `morawell-website` under `SRGhodsi` (do not initialize it with sample files).
2. Upload the **contents of this folder to the repository root** (`index.html` must appear at top level), preserving `.nojekyll` and `CNAME`.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, `main`, `/ (root)` and save.
4. Under **Custom domain**, set `morawell.com`. The `CNAME` file is already included.
5. Verify domain ownership in GitHub account's Pages settings before changing DNS. Use the TXT record GitHub provides; do not guess it.
6. At the authoritative DNS provider, point `@` to the GitHub Pages `A` records and `www` to `srghodsi.github.io` (DNS only first), leaving MX, SPF, DKIM, DMARC and other email records in place.
7. After HTTPS certificate is ready, enable **Enforce HTTPS** in Pages settings and test `https://morawell.com` and `https://www.morawell.com`.

GitHub Pages apex `A` targets (verify with current GitHub documentation before editing DNS):
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

## Local viewing
Open `index.html` in a modern browser or run `python3 -m http.server 8000` from this folder and visit `http://localhost:8000/`. No npm, backend, or token is required.

## Editorial and mathematical accuracy
All values and perspectives in Decision DNA are fictional examples. Neither the relative frequency of scenario outcomes nor the Decision DNA pattern match score should be interpreted as validated probabilities, clinical/psychometric assessments, or performance rankings.

## Visual architecture
The desktop opening scene is intentionally a **rasterized, approved hero** with interactive positioned click targets. Its copy is part of the image; the hit areas and their selection behavior are live HTML. All visual content except the tiny unregistered trademark symbol remains as approved. Changing text or responsive design significantly will eventually require separate, accessible HTML layers.

## Security
See [SECURITY.md](SECURITY.md). The site currently uses no third-party scripts, trackers, login, forms or remote data fetching. No secrets should ever be committed to a public GitHub Pages repository.


## V17 brand update
- The official, user-approved transparent image `Morawell_Logo_Small.png` is shown in the header on all three pages.
- The same exact logo artwork replaces the embedded old wordmark in the homepage's approved hero illustration.
- Existing scenario choices, illustration layout, client-side logic, and security policy are unchanged.
