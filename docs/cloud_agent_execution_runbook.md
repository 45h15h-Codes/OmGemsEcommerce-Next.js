# Cloud Agent Execution Runbook

This runbook operationalizes the e-commerce evaluation program for cloud agents across storefront, admin, backend, and production-readiness tracks.

## Goal

Evaluate and harden the platform end-to-end so launches are predictable, secure, observable, and measurable.

## Execution Model

- One **Orchestrator Agent** controls phases, assignments, and reporting.
- Four **Domain Agents** work in parallel:
  - Storefront Journey Agent
  - Admin + Backoffice Agent
  - Backend Integrity Agent
  - Reliability + Launch Agent
- One **QA Gate Agent** validates acceptance criteria before phase closure.
- One **Babysit Agent Loop** keeps PRs merge-ready (conflicts, CI, review comments).

## Phase Plan

## Phase 0 - Scope Lock (Completed)

- Confirmed scope: storefront, auth, role portals, admin catalog, backend RBAC/scoping, reporting and launch readiness.
- Confirmed outputs: risk-ranked backlog, release checklist, KPI-based tracking.

Exit criteria:
- Scope and scoring model are fixed for this execution cycle.

## Phase 1 - Baseline Discovery (Completed)

Performed baseline evidence collection:
- API route map and role/permission middleware in backend.
- Auth flow and role redirect handling.
- Frontend role route coverage (`admin`, `partner`, `wholesale`, `account`).
- Backend tests execution baseline.
- Frontend lint health baseline.

Exit criteria:
- Baseline report exists with strengths, risks, and blockers.

## Phase 2 - Parallel Deep Audit (In Progress)

Run these cloud-agent tasks in parallel:

1. Storefront Journey Deep Audit  
   Focus: browse/search/PDP/cart/checkout/account journey, UX and conversion blockers.

2. Admin + Catalog Operations Audit  
   Focus: admin login, user access, product/category/diamond CRUD, operator friction.

3. Backend Data Integrity + Security Audit  
   Focus: RBAC, permission leaks, IDOR, validation, data consistency.

4. Reliability + Launch Readiness Audit  
   Focus: observability, release controls, rollback safety, incident readiness.

Exit criteria:
- Each audit provides P0/P1/P2 findings, proof, and fix proposals.

## Phase 3 - Consolidated Prioritization

- Merge all findings into a single prioritized backlog:
  - P0: security, data loss, revenue outage, production blockers
  - P1: conversion/performance/reliability degradation
  - P2: UX and operational quality improvements
- Score each item with: impact, likelihood, effort, owner, due date.

Exit criteria:
- Signed-off remediation backlog with acceptance criteria.

## Phase 4 - Remediation Sprint via Cloud Agents

- Assign backlog slices to cloud agents.
- Enforce PR quality loop using babysit-style operation:
  - Resolve clear comments
  - Keep branch conflict-free
  - Keep CI green
  - Re-run checks until merge-ready

Exit criteria:
- P0 resolved, P1 underway with measurable KPI movement.

## Phase 5 - Launch Hardening + Reporting

- Execute release checklist per feature.
- Verify monitoring and runbook readiness.
- Publish daily and weekly reports.

Exit criteria:
- Go-live decision supported by hard metrics and checks.

## Agent Prompt Template

Use this template for every delegated task:

```text
Objective:
[exact objective]

Scope:
[services/files/routes/pages in scope]

Required Deliverables:
1) Findings with severity (P0/P1/P2)
2) Reproduction steps and proof
3) Root-cause hypothesis
4) Proposed fix and effort estimate
5) Test additions or updates
6) Launch/monitoring implications

Constraints:
- Keep changes merge-ready
- No breaking behavior without migration path
- Include rollback notes for risky change

Success Criteria:
[measurable target: error rate, latency, conversion, CI, etc.]
```

## Governance Cadence

- Daily:
  - Completed / in-progress / blocked
  - New risks
  - CI and release health
- Weekly:
  - KPI trend review
  - Backlog reprioritization
  - Launch-readiness score update

## KPI Dashboard Minimums

- Storefront: conversion rate, checkout drop-off, LCP/INP/CLS.
- Admin Ops: median time to publish/update product, failed publish count.
- Backend: 4xx/5xx rate, auth failures, permission denials, p95 latency.
- Delivery: lead time to merge, CI pass rate, rollback frequency, MTTR.
