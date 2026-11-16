<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/hero-dark.svg" />
    <img src="./assets/hero-light.svg" width="100%" alt="Panutthon Chanachon — Full Stack Developer, ERP &amp; E-commerce Integration, Bangkok, Thailand" />
  </picture>
</div>

<p align="center">
  <a href="mailto:panutthon.cc@hotmail.com"><img src="https://img.shields.io/badge/Email-panutthon.cc%40hotmail.com-0d1117?style=for-the-badge&logo=microsoftoutlook&logoColor=white&labelColor=30363d" alt="Email panutthon.cc@hotmail.com" /></a>
  <a href="https://github.com/panutthon"><img src="https://img.shields.io/badge/GitHub-panutthon-0d1117?style=for-the-badge&logo=github&logoColor=white&labelColor=30363d" alt="GitHub panutthon" /></a>
</p>

## Featured work

<sub>Production systems built for client companies. Code is private; numbers are from the real projects.</sub>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/projects/case-platform-dark.svg" />
  <img src="./assets/projects/case-platform-light.svg" width="100%" alt="Case Management Platform — solo full-stack rebuild of a legacy PHP support-case system; case-list API from 6+ minutes to 145 ms; 69,681 cases migrated with 0 errors" />
</picture>

<details>
<summary><b>Problem &amp; what I built</b></summary>

**Problem.** A 2019-era PHP/MySQL case system could not page its case lists, had hard-coded permissions and no SLA tracking. With real data, loading all cases took more than 6 minutes and timed out.

**What I built — solo, design to deploy:**
- NestJS 11 + Prisma REST API on SQL Server (176 endpoints) and a React 19 + TypeScript front end with Kanban, list, calendar and report views; per-screen permissions for 4 roles.
- Incremental ETL (MySQL → SQL Server) using watermarks and staging-table `MERGE`, re-syncing while the old system stayed live, with a final reconcile on cutover day.
- Server-to-server integration with an internal project-management platform, SLA/status email alerts, and an AI copilot over case data with switchable LLM providers.

**Results:** 69,681 cases, 338,298 case events and 962 users migrated — 22 tables reconciled with 0 errors · case-list API 6+ min → 145 ms · Kanban first render ~5 s → ~0.4 s · 1,959 automated tests.
</details>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/projects/warehouse-dark.svg" />
  <img src="./assets/projects/warehouse-light.svg" width="100%" alt="Handheld Warehouse System for ERP — barcode-scanning handheld app posting stock moves into Business Central; 20+ flows; live for multiple client companies; 2,650 automated tests" />
</picture>

<details>
<summary><b>Problem &amp; what I built</b></summary>

**Problem.** Warehouse and shop-floor staff keyed receipts, shipments, transfers, counts and production output into the ERP by hand at a desk — slow and error-prone, with no mobile way to check stock or bins.

**What I built — top contributor in a team of 4–5:**
- Next.js handheld web app with camera barcode/QR scanning covering 20+ warehouse and production flows, from goods receipt to cycle counts and shop-floor output.
- Express + Sequelize API that syncs master data and open documents from Business Central on schedules (including delta sync of changed lines) and posts scanned lines back, logging every post attempt for audit.
- One codebase for several client companies: per-site settings and feature flags, page-level Save/Post/Delete permissions, location-scoped access, login lockout, versioned migrations with a schema audit.

**Results:** live in production for multiple client companies · 2,650 automated tests.
</details>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/projects/marketplace-erp-dark.svg" />
  <img src="./assets/projects/marketplace-erp-light.svg" width="100%" alt="Marketplace to ERP Integration — syncs orders, returns and payouts from Shopee, Lazada and TikTok Shop into Business Central; lead backend developer" />
</picture>

<details>
<summary><b>Problem &amp; what I built</b></summary>

**Problem.** Orders, returns and payouts from each marketplace were keyed into the ERP by hand, shop by shop — slow, error-prone and hard to reconcile.

**What I built — lead backend developer (~84% of commits):**
- Multi-tenant Node.js/Express backend connecting Shopee, Lazada and TikTok Shop via OAuth with automatic token refresh, turning their data into Business Central Sales Orders, Return Orders and Cash Receipts.
- Per-shop schedulers with independent sync intervals and checkpoints stored in the database, so a sync resumes where it stopped; an export queue posts to Business Central (NTLM) and logs every call.
- Pre-deploy guard scripts that verify tenant data isolation, the payload shape sent to Business Central, and shop on/off feature wiring.

**Results:** 3 marketplaces → 1 ERP, with automatic and on-demand sync.
</details>

## Tech stack

**Frontend** &nbsp;
<img src="./assets/skills/typescript.svg" width="36" alt="TypeScript" title="TypeScript" />
<img src="./assets/skills/javascript.svg" width="36" alt="JavaScript" title="JavaScript" />
<img src="./assets/skills/react.svg" width="36" alt="React" title="React" />
<img src="./assets/skills/nextjs.svg" width="36" alt="Next.js" title="Next.js" />
<img src="./assets/skills/vite.svg" width="36" alt="Vite" title="Vite" />
<img src="./assets/skills/tailwindcss.svg" width="36" alt="Tailwind CSS" title="Tailwind CSS" />
<img src="./assets/skills/html.svg" width="36" alt="HTML5" title="HTML5" />
<img src="./assets/skills/css.svg" width="36" alt="CSS3" title="CSS3" />

**Backend &amp; data** &nbsp;
<img src="./assets/skills/nodejs.svg" width="36" alt="Node.js" title="Node.js" />
<img src="./assets/skills/nestjs.svg" width="36" alt="NestJS" title="NestJS" />
<img src="./assets/skills/express.svg" width="36" alt="Express" title="Express" />
<img src="./assets/skills/fastify.svg" width="36" alt="Fastify" title="Fastify" />
<img src="./assets/skills/mssql.svg" width="36" alt="MS SQL Server" title="MS SQL Server" />
<img src="./assets/skills/postgresql.svg" width="36" alt="PostgreSQL" title="PostgreSQL" />
<img src="./assets/skills/dotnet.svg" width="36" alt=".NET" title=".NET" />
<img src="./assets/skills/csharp.svg" width="36" alt="C#" title="C#" />
<img src="./assets/skills/python.svg" width="36" alt="Python" title="Python" />
<img src="./assets/skills/php.svg" width="36" alt="PHP" title="PHP" />

**Tools &amp; mobile** &nbsp;
<img src="./assets/skills/docker.svg" width="36" alt="Docker" title="Docker" />
<img src="./assets/skills/git.svg" width="36" alt="Git" title="Git" />
<img src="./assets/skills/postman.svg" width="36" alt="Postman" title="Postman" />
<img src="./assets/skills/figma.svg" width="36" alt="Figma" title="Figma" />
<img src="./assets/skills/flutter.svg" width="36" alt="Flutter" title="Flutter" />
<img src="./assets/skills/dart.svg" width="36" alt="Dart" title="Dart" />

## GitHub stats

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./profile-summary-card-output/github_dark/3-stats.svg" />
    <img src="./profile-summary-card-output/github/3-stats.svg" height="165" alt="GitHub stats" />
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./profile-summary-card-output/github_dark/2-most-commit-language.svg" />
    <img src="./profile-summary-card-output/github/2-most-commit-language.svg" height="165" alt="Most committed languages" />
  </picture>
</p>
