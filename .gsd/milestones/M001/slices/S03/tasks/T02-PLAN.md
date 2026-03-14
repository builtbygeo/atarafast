---
why: "Switch to sustainable AI models and ensure sensitive credentials aren't leaked."
files:
  - "app/api/ai/analyze/route.ts"
  - ".env.example"

## Steps
1. Update `app/api/ai/analyze/route.ts` to use `nvidia/nemotron-3-super-120b-a12b:free` and `openrouter/free`.
2. Clean `.env.example` to ensure no real API keys are present.
3. Verify AI route configuration via code inspection.
4. Verify `.env.example` via file inspection.
5. Verify endpoint behavior using a dummy request or mock.

## Observability Impact
- New AI model configuration will be logged at startup (if logging is enabled).
- Future debugging will involve checking the model name in the `app/api/ai/analyze/route.ts` constants.
- API failure states for AI will be visible in the `/api/ai/analyze` network response logs.

## Slice-Level Verification
- Implement a dummy 403 test for premium-only AI features (if applicable).
- Verify `NEXT_PUBLIC_ENABLE_PREMIUM=false` logic in `app/api/ai/analyze/route.ts`.

verify:
  - "Check that AI route uses the new model names."
  - "Check that `.env.example` contains no real API keys."
done_when: "AI analysis runs on free models and the environment template is sanitized."
---

# T02: Free AI Integration & Security
