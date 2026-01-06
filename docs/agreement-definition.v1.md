# Agreement Definition Contract (v1)

> **Makne Platform – Frontend → Backend Contract**
> This document defines the **only valid, backend-safe way** to create and fully define an agreement in Makne using the existing event-sourced architecture.

---

## 🔒 Global Rules (Non‑Negotiable)

1. Frontend **never emits events**
2. Frontend **only sends commands**
3. Backend generates all IDs:

   * `agreementId`
   * `deliverableId`
   * `milestoneId`
4. Frontend **must persist returned IDs** for later commands
5. Commands **must be executed in order**
6. Any violation results in **explicit backend rejection**

---

## 🧠 Conceptual Model

Agreement creation in Makne is **not a single request**.

It is a **multi‑step agreement definition flow**, enforced through independent command handlers and invariants.

```
CREATE → DEFINE → ASSIGN → STRUCTURE → POLICY → PAYMENT → ACCEPT
```

---

## 1️⃣ Create Agreement (Shell)

### Command

`CreateAgreementCommand`

### Payload

```ts
{
  brandId: string
}
```

### Backend Emits

* `AGREEMENT_CREATED`

### Notes

* Initializes the agreement aggregate
* No meta, creators, deliverables, or payments allowed here

---

## 2️⃣ Define Agreement Meta

### Command

`DefineMetaCommand`

### Payload

```ts
{
  agreementId: string
  title: string              // min length: 3
  description?: string
  category: string
}
```

### Backend Emits

* `AGREEMENT_META_DEFINED`

---

## 3️⃣ Assign Creator(s) (Repeatable)

### Command

`AssignCreatorCommand`

### Payload

```ts
{
  agreementId: string
  creatorId: string
}
```

### Backend Emits

* `AGREEMENT_PARTY_ASSIGNED`

  * `{ role: "CREATOR" }`

### Notes

* One creator per command
* Supports group collaborations via repetition

---

## 4️⃣ Add Deliverable(s) (Repeatable)

### Command

`AddDeliverableCommand`

### Payload

```ts
{
  agreementId: string
  name: string               // min length: 3
  platform: string
  format: string
  quantity: number           // > 0
  dueInDays: number          // > 0
  requiresApproval: boolean
}
```

### Backend Emits

* `DELIVERABLE_CREATED`

### Frontend Responsibility

* Store returned `deliverableId`

---

## 5️⃣ Add Milestone(s) (Repeatable)

### Command

`AddMilestoneCommand`

### Payload

```ts
{
  agreementId: string
  name: string
  deliverableIds: string[]   // must already exist
  unlockRule: "ALL_COMPLETED" | "ANY_COMPLETED"
}
```

### Backend Emits

* `MILESTONE_CREATED`

### Notes

* Milestones depend on existing deliverables
* Frontend must correctly map deliverable IDs

---

## 6️⃣ Define Agreement Policy

### Command

`DefinePolicyCommand`

### Payload

```ts
{
  agreementId: string
  cancellationAllowed: boolean
  cancellationWindowDays?: number
  revisionLimit: number      // >= 0
  disputeResolution: "PLATFORM" | "ARBITRATION"
}
```

### Backend Emits

* `POLICY_DEFINED`

---

## 7️⃣ Define Payment

### Command

`DefinePaymentCommand`

### Payload

```ts
{
  agreementId: string
  currency: "INR" | "USD"
  totalAmount: number        // > 0
  releaseMode: "MANUAL" | "AUTO"
  escrowRequired: boolean
}
```

### Backend Emits

* `PAYMENT_DEFINED`

---

## 8️⃣ Define Payment Split(s) (Repeatable)

### Command

`DefinePaymentSplitCommand`

### Payload

```ts
{
  agreementId: string
  milestoneId: string        // must exist
  amount: number             // > 0
}
```

### Constraints

* Payment must already be defined
* Sum of all splits ≤ `totalAmount`

### Backend Emits

* `PAYMENT_SPLIT_DEFINED`

---

## 9️⃣ Send Agreement for Acceptance

### Command

`SendForAcceptanceCommand`

### Payload

```ts
{
  agreementId: string
}
```

### Backend Emits

* `AGREEMENT_SENT_FOR_ACCEPTANCE`

---

## 🚦 Valid Execution Order (Strict)

| Step | Command                   |
| ---- | ------------------------- |
| 1    | CreateAgreement           |
| 2    | DefineMeta                |
| 3    | AssignCreator (1..n)      |
| 4    | AddDeliverable (1..n)     |
| 5    | AddMilestone (1..n)       |
| 6    | DefinePolicy              |
| 7    | DefinePayment             |
| 8    | DefinePaymentSplit (1..n) |
| 9    | SendForAcceptance         |

Any deviation will be rejected by backend invariants.

---

## ❌ Explicitly Out of Scope (v1)

* Creator acceptance / rejection
* Execution start
* Deliverable submission & review
* Auto‑agents
* Dispute handling
* UI concerns

These flows already exist but are **not part of agreement creation**.

---

## ✅ Status

* Backend‑aligned
* Event‑safe
* Invariant‑preserving
* UI‑agnostic
* Ready for frontend orchestration

---

**Contract Version:** v1
**Status:** LOCKED
