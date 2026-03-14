import { checkAiQuota } from '../lib/quota.ts';

function verify() {
  console.log("Running quota logic verification...");

  // Rule 1: fastCount < 5 should return false
  const result1 = checkAiQuota(false, 4, 0);
  if (result1.canUse) {
    console.error("FAIL: Should not allow AI with < 5 fasts");
    process.exit(1);
  }
  console.log("PASS: Fast count requirement checked");

  // Rule 2: Free user, 5 fasts, 1 usage today -> should be false
  const result2 = checkAiQuota(false, 5, 1);
  if (result2.canUse) {
    console.error("FAIL: Free user should be limited to 1 usage per day");
    process.exit(1);
  }
  console.log("PASS: Free user daily limit checked");

  // Rule 3: Premium user, 5 fasts, 1 usage today -> should be true
  const result3 = checkAiQuota(true, 5, 1);
  if (!result3.canUse) {
    console.error("FAIL: Premium user should be allowed > 1 usage per day");
    process.exit(1);
  }
  console.log("PASS: Premium user daily limit checked");

  console.log("ALL QUOTA LOGIC VERIFIED.");
}

verify();
