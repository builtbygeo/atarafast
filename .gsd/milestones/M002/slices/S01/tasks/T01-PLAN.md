# T01: Implement Quota and Fast Count Logic

## Why
`lib/storage.ts` needs a way to count fasts and a way to check if an AI request is permitted under the new rules.

## Files
- `lib/storage.ts`
- `lib/quota.ts` (new)

## Steps
1. Create `lib/quota.ts` with `getFastCount` and `checkAiQuota` functions.
2. Implement `checkAiQuota` logic to enforce:
    - `fastCount >= 5` required.
    - `usageToday < 1` required (unless premium).
3. Create `scripts/verify-quota-logic.ts` to verify these rules.
4. Run `ts-node scripts/verify-quota-logic.ts` to confirm.


## Must-Haves
- `checkAiQuota` accurately returns false if `fastCount < 5`.
- `checkAiQuota` accurately returns false if `usageToday >= 1` (unless user is premium).

## Verification
- `ts-node scripts/verify-quota-logic.ts`

## Expected Output
- A passing script output confirming the logic.
