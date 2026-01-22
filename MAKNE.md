# MAKNE – MVP Specification (Corrected & Simplified)

## Overview

MAKNE is an all-in-one collaboration and agreement execution platform for **Creators, Brands, and Agencies**. It formalizes collaborations into structured agreements, tracks execution through milestones and deliverables, and orchestrates payments based on acceptance — with a complete, auditable event history.

MAKNE focuses on **trust, transparency, and enforcement of commitments**, while keeping the MVP achievable and production-realistic.

In short, MAKNE is:

* A trust & agreement platform
* A collaboration execution engine
* An acceptance-gated payment orchestrator
* A system of record for digital commitments

---

## 1. User Roles (All Covered in MVP)

Each user has **one primary role** during onboarding. Role-specific data is stored in separate profiles.

### Creator

* Creates a complete profile (niche, platforms, portfolio)
* Can receive agreements from brands or agencies
* Can accept or reject agreements
* Delivers content based on assigned deliverables
* Receives milestone-based payouts
* Pays platform commission per deal

### Agency

* Onboards and manages creators
* Can approach brands on behalf of creators
* Can view and supervise agreements involving their creators
* Can comment and suggest changes during negotiation
* **Cannot accept or reject agreements**
* Receives platform-managed revenue share
* Pays subscription fee (monthly / quarterly)

### Brand

* Creates agreements with structured terms
* Can invite creators directly or via agencies
* Releases payments based on milestone acceptance
* Pays annual platform subscription

---

## 2. Collaboration Modes

### Individual Collaboration

* Brand ↔ Creator
* Brand ↔ Agency ↔ Creator

### Group Collaboration (MVP-safe)

* One agreement with multiple creators
* Individual deliverables per creator
* Shared milestones per agreement
* Agreement completion requires all deliverables to be accepted

(Advanced per-creator milestones are deferred post-MVP.)

---

## 3. Payments & Milestones

* Milestone-based payments
* Deliverable-linked acceptance rules
* Group payout splits (creator / agency)
* Acceptance-gated payment release

### Payment Model (MVP)

* Payments handled via **payment gateway (Stripe / Razorpay)**
* Platform tracks payment intents and payout status
* Funds are released only after milestone acceptance
* This is **not legal escrow**, but a controlled payout orchestration system

---

## 4. AI Assistance Layer (Bounded & Practical)

AI is used as an **assistive layer**, not autonomous agents.

* Agreement Summary Generator
* Deadline & Milestone Reminder Assistant
* Dispute / Conflict Summary Generator

AI actions are read-only or advisory and operate within strict guardrails.

---

## 5. Audit & Digital Record

* Append-only event timeline
* Every state change and action is logged
* Dispute-ready execution history
* Human-readable and machine-verifiable logs

---

## 6. Agreement Lifecycle (State Machine)

Every agreement follows a strict state flow:

```
DRAFT
 → SHARED
 → NEGOTIATION
 → ACCEPTED
 → ACTIVE
 → COMPLETED
 → CANCELLED / REJECTED
```

* State transitions are role-restricted
* All transitions are logged as immutable events
* Agreement terms are locked after acceptance

---

## 7. Application Workflow

### Brand Perspective

* Creates agreement in **DRAFT** state
* Adds meta, milestones, deliverables, payments, and policies
* Can add creators later, moving agreement to **SHARED / NEGOTIATION**
* Cannot edit agreement after creator acceptance

### Agency Perspective

* Can view agreements involving their creators
* Can comment and suggest changes during negotiation
* Cannot accept or reject agreements
* Acts as supervisory intermediary

### Creator Perspective

* Receives agreements
* Reviews terms, milestones, and payment details
* Accepts (locks terms → ACTIVE) or rejects with reason
* Uploads deliverables per milestone
* Receives payments upon milestone acceptance

---

## 8. Application Pages (MVP Scope)

### Core Pages

* Landing Page
* Authentication (email + password)
* Role Selection & Onboarding
* Role-based Dashboard
* Agreement List
* Agreement Creation (multi-step)
* Agreement Workspace (details, deliverables, milestones, payments)
* Activity & Audit Timeline
* Profile / Settings

(Advanced boards and separated views are deferred.)

---

## 9. Authorization

* Role-Based Access Control (RBAC)
* Permissions enforced at API and UI level
* Users can only perform actions allowed by their role

---

## 10. Tech Stack (Corrected)

* **Frontend:** Next.js (App Router)
* **Backend:** Next.js API Routes / Server Actions
* **Database:** MongoDB (with transactions for payments)
* **Authentication:** JWT + Refresh Tokens
* **Emails:** Nodemailer (verification, password reset, invites)
* **Payments:** Stripe / Razorpay (gateway-based payouts)
* **Deployment:** Vercel
* **Styling:** TailwindCSS
* **Animations:** Framer Motion
* Fully responsive design

---

## MVP Goal

Deliver a **production-realistic, role-complete platform** that:

* Handles real collaborations
* Enforces agreement execution
* Integrates real payments
* Maintains a verifiable audit trail

This MVP is intentionally scoped to be **buildable, testable, and extensible**.
