# Coding Conventions

**Analysis Date:** 2026-03-10

## Naming Patterns

**Files:**
- Components: kebab-case (`timer-view.tsx`, `settings-sheet.tsx`)
- Pages: kebab-case with `page.tsx` suffix
- Utilities: PascalCase or kebab-case

**Functions:**
- camelCase for functions and variables
- PascalCase for React components

**Types:**
- PascalCase for interfaces and types
- TypeScript throughout (no plain JS)

## Code Style

**Formatting:**
- Prettier integration (if configured)
- Tailwind CSS classes organized logically

**Linting:**
- ESLint configured
- TypeScript strict mode enabled

## Import Organization

**Order:**
1. React/Next imports
2. External libraries
3. Internal components
4. Utils/helpers

**Path Aliases:**
- `@/` maps to project root
- Example: `@/components/timer-view`

## Error Handling

**Patterns:**
- Try-catch for async operations
- User-friendly error messages in UI
- Toast notifications via `sonner`

## Comments

**When to Comment:**
- Complex business logic
- Non-obvious workarounds
- TODO comments for future work

**JSDoc/TSDoc:**
- Used for exported functions
- Props documented in components

## Function Design

**Size:** Keep functions focused and small

**Parameters:** Use interfaces for complex objects

**Return Values:** Always typed

## Module Design

**Exports:**
- Named exports preferred
- Components as default exports where appropriate

**Barrel Files:** Not heavily used

---

*Convention analysis: 2026-03-10*
