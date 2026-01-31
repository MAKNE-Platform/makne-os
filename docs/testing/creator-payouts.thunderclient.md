# Creator Payout Testing Guide (Thunder Client)

This document explains **how to fully test the payout flow for a creator** using **Thunder Client**, step by step.

This covers the **manual-first payout mechanism** exactly as MAKNE is designed.

---

## Prerequisites

Before testing payouts, make sure all of the following are true:

* You have a **creator account** logged in at least once
* At least one **payment is in `RELEASED` state** for this creator
* The creator has a **non-zero available balance**
* The dev server has been restarted after `.env` changes

---

## Payout State Lifecycle (Reference)

```
RELEASED payment
   ↓
Creator balance increases
   ↓
Creator requests payout
   ↓
Payout: REQUESTED
   ↓
System processes payout
   ↓
Payout: PROCESSING → COMPLETED / FAILED
```

---

## Step 1: Verify Creator Balance (Optional but Recommended)

This ensures the creator has money available to withdraw.

### Check via UI

* Login as **CREATOR**
* Open `/creator/earnings`
* Note the **available balance**

Or:

* Open `/creator/payouts`
* Check **Balance overview** section

---

## Step 2: Request a Payout (Creator Action)

### Endpoint

```
POST /api/creator/payouts/request
```

### Thunder Client Setup

**Method**: `POST`

**URL**:

```
http://localhost:3000/api/creator/payouts/request
```

### Headers

| Key          | Value                                        |
| ------------ | -------------------------------------------- |
| Content-Type | application/json                             |
| Cookie       | auth_session=<CREATOR_ID>; user_role=CREATOR |

> Replace `<CREATOR_ID>` with the actual creator user ID stored in cookies.

### Body

```json
{
  "amount": 3000
}
```

### Expected Success Response

```json
{
  "success": true,
  "message": "Payout request submitted",
  "requestedAmount": 3000,
  "remainingBalance": 2000
}
```

### Database Check

In `payouts` collection:

```
status: "REQUESTED"
```

---

## Step 3: Verify Payout Appears in Creator UI

* Open `/creator/payouts`
* You should see a new entry:

  * Amount
  * Status: **Requested**
  * Requested date

Balance should now reflect:

* Reduced available balance
* Increased locked amount

---

## Step 4: Process Payout (System Action)

This simulates **admin / system processing**.

### Endpoint

```
POST /api/system/payouts/{payoutId}/process
```

Replace `{payoutId}` with the real payout `_id` from MongoDB.

---

### Action 1: Move to PROCESSING

**Headers**:

| Key                | Value            |
| ------------------ | ---------------- |
| Content-Type       | application/json |
| x-makne-system-key | super-secret-key |

**Body**:

```json
{
  "action": "PROCESS"
}
```

**Expected Response**:

```json
{
  "success": true,
  "status": "PROCESSING"
}
```

---

### Action 2: Complete the Payout

**Body**:

```json
{
  "action": "COMPLETE"
}
```

**Expected Response**:

```json
{
  "success": true,
  "status": "COMPLETED"
}
```

### Database Check

```
status: "COMPLETED"
processedAt: <date>
```

---

## Step 5: Verify Final State in UI

* Refresh `/creator/payouts`
* Payout should show **Completed**
* Balance overview should show:

  * Reduced available balance
  * Increased total withdrawn
  * Locked amount = 0 (if no other pending payouts)

---

## Failure Scenario (Optional)

To simulate a failed payout:

```json
{
  "action": "FAIL"
}
```

Expected:

* Payout status → `FAILED`
* Amount unlocked back to available balance

---

## Common Issues & Fixes

### 404 Route Not Found

* Check folder structure under `app/api`
* Ensure file name is `route.ts`
* Restart dev server

### Unauthorized System Access

* Ensure `x-makne-system-key` matches `.env`
* Restart server after env changes

### Insufficient Balance Error

* Ensure creator has `RELEASED` payments
* Ensure funds are not already locked in payouts

---

## Final Notes

* Creators **never** directly receive money on request
* System controls payout completion
* Balance is always **computed, never stored**
* This flow is **gateway-ready** and production-aligned

---

✅ If all steps pass, the payout system is working correctly.
