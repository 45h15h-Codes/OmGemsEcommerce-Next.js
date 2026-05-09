# Go-Live Release Checklist

This document operationalizes the launch-readiness process, ensuring smooth deployment, rollback safety, and system observability.

## Phase 1: Pre-Release (Staging)

- [ ] **Infrastructure Provisioning**: Confirm production database, Redis cache, and object storage (S3/GCS) are fully provisioned and isolated from staging.
- [ ] **Data Migration Dry Run**: Test full data seeding/migration from legacy systems to production schema; verify 0% data loss.
- [ ] **Environment Variables**: Verify all production secrets (payment gateways, mailers, OAuth) are populated securely in AWS Secret Manager / Vercel Env / Laravel `.env`.
- [ ] **SSL & Domains**: Ensure primary domain and subdomains (API, CDN) have valid SSL certificates with auto-renewal enabled.

## Phase 2: Quality & Security Gates

- [x] **CI Pipeline Green**: All frontend linting and backend tests (54/54) pass in `.github/workflows/ci.yml`.
- [x] **RBAC Audit**: Role-based access control and tenant scoping confirmed via automated `RoleAccessTest` and `PermissionScopingTest`.
- [ ] **Penetration Testing**: Execute automated vulnerability scan (OWASP Top 10) against public API endpoints.
- [ ] **Load Testing**: Benchmark storefront PLP/PDP and admin data table rendering up to 200% expected peak load using k6 or Locust.

## Phase 3: Observability & Telemetry

- [x] **Frontend Error Tracking**: Next.js `ErrorBoundary` configured (`error.tsx`) and Sentry integration prepared.
- [x] **Backend Exception Reporting**: Laravel exceptions configured in `bootstrap/app.php` to push to Sentry/DataDog.
- [ ] **Log Retention**: Application and access logs configured to pipe to centralized logging (e.g., CloudWatch/ELK) with a 30-day retention policy.
- [ ] **Alerting Thresholds**: Set PagerDuty/Slack alerts for:
  - 5xx Error Rate > 1% over 5 minutes.
  - API Latency p95 > 1000ms.
  - Checkout failure or Payment Gateway timeout.

## Phase 4: Rollback Strategy

- [ ] **Database Snapshots**: Take an automated RDS/database snapshot exactly 5 minutes before the zero-downtime deployment.
- [ ] **Blue/Green Deployment**: Verify Vercel (Frontend) and load balancer (Backend) are capable of immediate instant-rollback to the previous hash.
- [ ] **Runbook Finalized**: Incident response runbook is published, and on-call engineers are designated.

## Phase 5: Go-Live & Post-Launch

- [ ] **DNS Cutover**: Switch DNS routing to point to the new production load balancer / CDN.
- [ ] **Cache Warmup**: Prime Next.js ISR cache and Laravel Redis caches for high-traffic PDPs.
- [ ] **Sanity Check**: Execute manual purchase flow (from search to checkout) with a live test credit card (and refund).
- [ ] **Monitor Dashboards**: Dedicated team monitors Sentry, DataDog, and Vercel Analytics for the first 2 hours post-launch.
