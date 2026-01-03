# 📘 Makne – Agreement Lifecycle Verification (MVP Lock)

This document verifies the **complete agreement lifecycle** in Makne’s event-sourced backend, from creation to auto-completion.

It acts as:
- a regression checklist
- a contract for system behavior
- a reference before UI, escrow, or revisions are added

---

## 🧱 Preconditions

- MongoDB connected
- Event store enabled (`events` collection)
- Agents wired:
  - Auto-complete milestones agent
  - Auto-complete agreement agent
  - Payment auto-release agent
- Read APIs working:
  - `GET /api/agreements/:id/state`
  - `GET /api/agreements/:id/timeline`

---

## 🔹 Phase 0 — Agreement Creation

### API
## POST /api/agreements/create

### Body
```json
{
  "brandId": "brand_1",
  "collaborationType": "GROUP",
  "acceptanceRule": "ALL_CREATORS"
}
```

Expected Event
AGREEMENT_CREATED

Expected State
```json
{
  "status": "DRAFT",
  "collaborationType": "GROUP",
  "creatorIds": [],
  "acceptedByCreators": []
}
```

## 🔹 Phase 1 — Assign Creators
API
```
POST /api/agreements/assign-creator
```

Body (run once per creator)
```json
{
  "agreementId": "AGREEMENT_ID",
  "creatorId": "creator_1"
}

{
  "agreementId": "AGREEMENT_ID",
  "creatorId": "creator_2"
}
```

Expected Events
AGREEMENT_PARTY_ASSIGNED (x2)

Expected State
```json
{
  "creatorIds": ["creator_1", "creator_2"]
}
```

## 🔹 Phase 2 — Define Agreement Meta
API
```
POST /api/agreements/define-meta
```

Body
```json
{
  "agreementId": "AGREEMENT_ID",
  "title": "Instagram Campaign",
  "description": "Launch campaign",
  "category": "Marketing"
}
```

Expected Event
AGREEMENT_META_DEFINED

Expected State
status = DEFINED

## 🔹 Phase 3 — Create Deliverables
API
```
POST /api/agreements/add-deliverable
```

Body
```json
{
  "agreementId": "AGREEMENT_ID",
  "deliverableId": "deliverable_1",
  "name": "Instagram Reel",
  "description": "One Instagram reel promoting the campaign",
  "quantity": 1
}
```

Expected Event
DELIVERABLE_CREATED

## 🔹 Phase 4 — Create Milestone
API
```
POST /api/agreements/add-milestone
```

Body
```json
{
  "agreementId": "AGREEMENT_ID",
  "milestoneId": "milestone_1",
  "name": "abc",
  "deliverableIds": ["deliverable_1"],
  "unlockRule": "ALL_COMPLETED"
}
```

Expected Event
MILESTONE_CREATED

## 🔹 Phase 5 — Define Payment
API
```
POST /api/agreements/define-payment
```

Body
```json
{
  {
  "agreementId": "AGREEMENT_ID",
  "currency": "INR",
  "totalAmount": 15000,
  "releaseMode": "MANUAL",
  "escrowRequired": false
}
}
```

Expected Event
PAYMENT_DEFINED

## 🔹 Phase 6 — Define Payment Split
API
POST /api/agreements/define-payment-split

Body
```json
{
  "agreementId": "AGREEMENT_ID",
  "milestoneId": "milestone_1",
  "amount": 15000
}
```

Expected Event
PAYMENT_SPLIT_DEFINED

### ❌ Negative Test

Total split exceeds total amount → PAYMENT_SPLIT_EXCEEDS_TOTAL

## 🔹 Phase 7 — Define Policy
API
```
POST /api/agreements/define-policy
```

Body
```json
{
  "agreementId": "AGREEMENT_ID",
  "cancellationAllowed": true,
  "cancellationWindowDays": 3,
  "revisionLimit": 2,
  "disputeResolution": "PLATFORM"
}
```

Expected Event
POLICY_DEFINED

## 🔹 Phase 8 — Send for Acceptance
API
```
POST /api/agreements/send
```

Expected Event
AGREEMENT_SENT_FOR_ACCEPTANCE

### ❌ Negative Tests

Missing deliverables → AGREEMENT_INCOMPLETE
Missing payment split → AGREEMENT_INCOMPLETE

## 🔹 Phase 9 — Accept Agreement (Group)
API
```
POST /api/agreements/accept
```

Body
```json
{
  "agreementId": "AGREEMENT_ID"
}
```


(run again for creator_2)

Expected Events
AGREEMENT_ACCEPTED_BY_CREATOR (x2)

Expected State
status = ACTIVE

### ❌ Negative Tests

Brand tries to accept → ONLY_CREATOR_CAN_ACCEPT
Accept twice → no state change

### start execution 
POST /api/agreements/start-execution

```json
{
  "agreementId": "AGREEMENT_ID",
"deliverableId": "deliverable_1",
"actorId": "creator_1"
}
```

## 🔹 Phase 10 — Submit Deliverable
API
POST /api/deliverables/submit

Body
```json
{
  "agreementId": "AGREEMENT_ID",
  "deliverableId": "deliverable_1",
  "submissionUrl": "https://link-to-content",
  "actorId": "creator_1"
}
```

Expected Event
DELIVERABLE_SUBMITTED

## 🔹 Phase 11 — Accept Deliverable (Critical Chain)
API
```
POST /api/deliverables/accept
```

Body
```json
{
  "agreementId": "AGREEMENT_ID",
  "deliverableId": "deliverable_1",
  "actorId": "brand_1"
}
```

### 🔗 Expected Automatic Event Chain
DELIVERABLE_ACCEPTED
→ MILESTONE_COMPLETED
→ PAYMENT_AUTO_RELEASED
→ AGREEMENT_AUTO_COMPLETED

### ❌ Invalid Sequence (Must Never Happen)
DELIVERABLE_ACCEPTED
→ AGREEMENT_AUTO_COMPLETED

## 🔹 Phase 12 — Verify Final State
API
```
GET /api/agreements/AGREEMENT_ID/state
```

Expected
```json
{
  "status": "AGREEMENT_AUTO_COMPLETED",
  "milestones": {
    "milestone_1": {
      "status": "COMPLETED"
    }
  },
  "releasedPayments": {
    "milestone_1": 15000
  }
}
```

## 🔹 Phase 13 — Verify Timeline
API
```
GET /api/agreements/AGREEMENT_ID/timeline
```

### Expected Order
AGREEMENT_CREATED
AGREEMENT_PARTY_ASSIGNED
AGREEMENT_META_DEFINED
DELIVERABLE_CREATED
MILESTONE_CREATED
PAYMENT_DEFINED
PAYMENT_SPLIT_DEFINED
POLICY_DEFINED
AGREEMENT_SENT_FOR_ACCEPTANCE
AGREEMENT_ACCEPTED_BY_CREATOR
EXECUTION_STARTED
DELIVERABLE_SUBMITTED
DELIVERABLE_ACCEPTED
MILESTONE_COMPLETED
PAYMENT_AUTO_RELEASED
AGREEMENT_AUTO_COMPLETED

# 🧠 System Guarantees
- Events are immutable
- State is always derived
- Payments are milestone-authoritative
- No implicit completion
- Agents are idempotent
- Timeline is the audit log