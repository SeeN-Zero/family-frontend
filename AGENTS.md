# AGENTS.md

## Family Transaction Management — Frontend Engineering Guidelines

This repository is a Next.js frontend for the Family Transaction Management application.

The codebase has an established architecture and library stack. When implementing new functionality, modifying existing functionality, or integrating new APIs, **follow the existing architecture first**.

Do not introduce new libraries or architectural patterns when the existing stack already provides the required functionality.

---

# 1. CRITICAL: NEXT.JS VERSION

This project uses:

* Next.js `16.3.0`
* React `19.2.8`
* React DOM `19.2.8`

## IMPORTANT

This is **not necessarily the Next.js you know from training data**.

Next.js 16 contains breaking changes and may differ from older Next.js versions in:

* APIs
* conventions
* file structure
* routing
* configuration
* caching
* server/client behavior
* build behavior
* framework APIs

Before implementing Next.js-specific functionality, consult the documentation shipped with the installed version.

Read the relevant documentation under:

```text
node_modules/next/dist/docs/
```

The documentation path must be resolved relative to the repository/package where Next.js is installed.

Do not assume APIs or conventions from Next.js 13, 14, or 15 are still correct.

Follow deprecation warnings from the installed Next.js version.

---

# 2. EXISTING TECHNOLOGY STACK

The project currently uses:

```text
Next.js 16.3.0
React 19.2.8
TypeScript
Tailwind CSS
TanStack Query
TanStack Query Devtools
Zod
React Hook Form
@hookform/resolvers
Zustand
Lucide React
```

Current package dependencies include:

```text
@tanstack/react-query
@tanstack/react-query-devtools
lucide-react
next
react
react-dom
zod
react-hook-form
@hookform/resolvers
zustand
```

## Rule

**Prefer the existing libraries before considering a new dependency.**

Before adding a package, determine whether the functionality can already be implemented using:

* React
* Next.js
* TypeScript
* Tailwind CSS
* TanStack Query
* Zod
* React Hook Form
* Zustand
* Lucide React
* existing project utilities

Do not add a dependency simply because it is popular.

---

# 3. STATE OWNERSHIP — VERY IMPORTANT

The application has explicit state ownership boundaries.

Do not mix these responsibilities.

```text
                    STATE
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   SERVER STATE   FORM STATE   CLIENT/UI STATE
        │             │             │
 TanStack Query   React Hook Form  Zustand/useState
        │             │             │
        ▼             ▼             ▼
       API           Zod          UI behavior
```

## Server state → TanStack Query

Use TanStack Query for data originating from the backend.

Examples:

* accounts
* transactions
* categories
* contacts
* loans
* loan payments
* paginated API data
* server-backed user/family data

Do NOT copy query data into:

```text
useState
Zustand
React Context
```

unless there is a specific architectural reason.

Avoid:

```tsx
const { data } = useQuery(...);

const [items, setItems] = useState(data);

useEffect(() => {
  setItems(data);
}, [data]);
```

Prefer using the TanStack Query result directly.

---

# 4. FORM STATE → REACT HOOK FORM

All substantial forms must use React Hook Form.

Use:

```ts
useForm()
```

with:

```ts
zodResolver()
```

for validation.

Prefer:

```text
React Hook Form
       ↓
Zod
       ↓
TanStack Query mutation
       ↓
API
```

Do not introduce manual form state using multiple `useState` calls.

Avoid:

```tsx
const [name, setName] = useState("");
const [amount, setAmount] = useState("");
const [description, setDescription] = useState("");
```

when these represent form fields.

Use:

```tsx
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
});
```

Use `register()` for normal inputs.

Use `Controller` for custom controlled components when necessary.

Use `useWatch()` for dependent fields where appropriate.

---

# 5. VALIDATION → ZOD

Zod is the application's client-side validation and input-schema library.

Create feature-local schemas.

Preferred structure:

```text
src/
└── features/
    ├── accounts/
    │   └── schemas.ts
    ├── categories/
    │   └── schemas.ts
    ├── contacts/
    │   └── schemas.ts
    ├── transactions/
    │   └── schemas.ts
    ├── loans/
    │   └── schemas.ts
    └── auth/
        └── schemas.ts
```

When a new feature requires input validation, add or extend the schema belonging to that feature.

Do not create a giant global schema file.

---

# 6. ZOD IS THE SOURCE OF TRUTH FOR REQUEST TYPES

When a request type directly represents a Zod schema, infer the TypeScript type from the schema.

Prefer:

```ts
const createAccountSchema = z.object({
  name: z.string().min(1),
});

export type CreateAccountRequest =
  z.infer<typeof createAccountSchema>;
```

Avoid maintaining duplicate definitions such as:

```ts
const createAccountSchema = z.object({
  name: z.string().min(1),
});

interface CreateAccountRequest {
  name: string;
}
```

unless the two types intentionally represent different concepts.

---

# 7. DO NOT FORCE EVERYTHING THROUGH ZOD

Not every TypeScript type should become a Zod schema.

Keep separate types when they represent different concepts.

For example:

```text
Request/input schema
Response type
Domain model
UI-specific type
API pagination type
```

These may legitimately differ.

Do not merge them simply to reduce the number of files.

---

# 8. CLIENT/UI STATE → ZUSTAND OR useState

Zustand is for **shared client/UI state**.

Examples:

* sidebar state
* shared UI preferences
* global UI state
* state genuinely needed by distant components

Current Zustand usage:

```text
src/stores/sidebar-store.ts
```

Do not put server/API data into Zustand.

Do not put form fields into Zustand.

Do not create a Zustand store merely because a component has state.

Prefer local `useState` when the state belongs to one component.

Example:

```text
Modal open/close
Dropdown open/close
Selected row
Confirmation dialog
Temporary UI state
```

should generally remain local unless multiple unrelated components genuinely need the state.

---

# 9. TANSTACK QUERY

TanStack Query is the application's server-state manager.

Use it for:

* queries
* mutations
* caching
* invalidation
* refetching
* loading states
* server synchronization

Existing query hooks include patterns such as:

```text
useAccounts
useCategories
useContacts
useTransactions
useLoans
useLoanPayments
```

Follow the existing pattern when adding a new resource.

---

# 10. QUERY KEYS

Query keys are centralized in:

```text
src/hooks/queryKeys.ts
```

Existing key factories include:

```text
accountKeys
categoryKeys
contactKeys
transactionKeys
loanKeys
loanPaymentKeys
```

When adding a new resource, follow the same query-key factory pattern.

Do not scatter arbitrary string arrays throughout the application.

Prefer:

```ts
export const accountKeys = {
  all: ["accounts"] as const,
  list: (filters) => ["accounts", "list", filters] as const,
  detail: (id) => ["accounts", "detail", id] as const,
};
```

Use the same keys for:

* `useQuery`
* `invalidateQueries`
* `setQueryData`
* related cache operations

Avoid inconsistent keys such as:

```text
["accounts"]
["account"]
["userAccounts"]
```

for the same resource.

---

# 11. TANSTACK QUERY MUTATIONS

Keep mutations in the existing mutation-hook architecture.

Examples include:

```text
useAccountMutations
useCategoryMutations
useContactMutations
useTransactionMutations
useTransferMutations
useLoanMutations
```

When creating a new API mutation:

1. Add the API operation to the appropriate resource hook/module.
2. Use the appropriate request type/schema.
3. Keep mutation ownership in TanStack Query.
4. Invalidate affected queries after successful mutations.
5. Consider related resources affected by the backend operation.

For example, a transaction mutation may affect:

```text
transactions
accounts
```

A category mutation may affect:

```text
categories
transactions
```

A loan/payment mutation may affect:

```text
loans
loanPayments
accounts
transactions
```

Follow existing invalidation behavior.

Do not blindly invalidate the entire query cache.

---

# 12. API ACCESS

The application already has a centralized API client:

```text
src/lib/auth.ts
```

including:

```text
apiFetch<T>()
```

Use the existing API client for authenticated API requests.

Do not implement authentication headers manually in every component.

Avoid:

```tsx
fetch(...)
```

directly inside presentation components.

Prefer:

```text
Component
    ↓
TanStack Query hook
    ↓
API client
    ↓
Backend
```

---

# 13. DO NOT ADD AXIOS

Do not introduce Axios unless there is a concrete technical requirement that the existing API client cannot reasonably satisfy.

The existing `apiFetch()` abstraction already handles:

* authentication headers
* JSON requests
* response parsing
* 401/session handling
* backend error messages

Adding Axios solely because it is popular is not justified.

---

# 14. FEATURE ORGANIZATION

When adding significant functionality, prefer feature-oriented organization.

However, do not move existing code merely for cosmetic reasons.

Follow the current structure when extending existing functionality.

Use feature-local modules when they provide clear separation and reduce duplication.

---

# 15. API/FEATURE ADDITION WORKFLOW

When adding a new backend API or feature, follow this order:

## Step 1 — Understand the backend contract

Determine:

* endpoint
* HTTP method
* request body
* query parameters
* path parameters
* response structure
* error behavior
* authentication requirements

Do not invent API contracts.

---

## Step 2 — Create/reuse the Zod schema

If the endpoint accepts user input:

```text
features/<feature>/schemas.ts
```

Define or extend the appropriate schema.

Infer request types from Zod when appropriate.

---

## Step 3 — Add response types

Add API response types to the appropriate type module.

Do not reuse request types as response types unless they genuinely represent the same structure.

---

## Step 4 — Add API access

Use the existing:

```text
apiFetch()
```

pattern.

If API operations become numerous, consider a feature-local:

```text
features/<feature>/api.ts
```

Do not introduce a new HTTP client unnecessarily.

---

## Step 5 — Add TanStack Query hooks

For reads:

```text
useQuery
```

For writes:

```text
useMutation
```

Use centralized query keys.

---

## Step 6 — Connect forms

If user input is involved:

```text
React Hook Form
+
Zod resolver
```

Do not create manual form state.

---

## Step 7 — Handle cache invalidation

Identify every server resource affected by the mutation.

Invalidate/update only the relevant query keys.

---

## Step 8 — Integrate into UI

Keep API/business logic out of purely presentational components when practical.

Preserve existing UI conventions.

---

# 16. FORMS WITH DEPENDENT FIELDS

Use React Hook Form as the source of form values.

For dependent fields, prefer:

```ts
useWatch()
```

over duplicating form values in `useState`.

Example:

```ts
const accountId = useWatch({
  control: form.control,
  name: "accountId",
});
```

Use:

```text
setValue()
getValues()
useWatch()
```

when appropriate.

Do not maintain:

```text
form.accountId
+
local accountId state
```

for the same value.

---

# 17. MANUAL VALIDATION

Do not add manual form validation such as:

```ts
if (!name) ...
if (!amount) ...
if (!accountId) ...
```

when the rule belongs to input validation.

Put those rules in Zod.

However, do not move backend business rules into frontend validation simply to eliminate an `if`.

Examples of rules that may remain backend-owned:

* ownership
* authorization
* transaction constraints
* loan payment limits
* account balance rules
* family membership rules
* uniqueness constraints
* concurrency rules

The backend remains authoritative.

---

# 18. ERROR HANDLING

Use the existing API error handling.

Do not silently swallow errors.

Distinguish:

```text
Zod/RHF validation
        ↓
client input error
```

from:

```text
API/TanStack Query error
        ↓
backend/server error
```

and:

```text
401
        ↓
authentication/session handling
```

Do not duplicate authentication/error parsing in every component.

---

# 19. COMPONENT DESIGN

Components should primarily handle:

* rendering
* user interaction
* form presentation
* invoking hooks
* displaying loading/error states

Avoid putting large amounts of:

* API implementation
* business logic
* validation
* cache management

directly inside UI components.

However, do not over-fragment components.

A component that owns a self-contained feature/query workflow is acceptable.

Refactor only when complexity becomes a real maintenance problem.

---

# 20. USESTATE IS NOT FORBIDDEN

Do not mechanically remove `useState`.

Legitimate examples:

```text
isModalOpen
activeTab
selectedRecord
dropdownOpen
confirmation state
temporary UI state
```

are valid.

The rule is:

> Use the simplest state mechanism appropriate for the ownership scope.

Use:

```text
useState
```

for local UI state.

Use:

```text
Zustand
```

for shared client/UI state.

Use:

```text
React Hook Form
```

for form state.

Use:

```text
TanStack Query
```

for server state.

---

# 21. AVOID DUPLICATED DATA

Before creating a new state variable, ask:

> Does this data already have an owner?

Examples:

### API data

Already owned by TanStack Query.

Do not create another copy.

### Form value

Already owned by React Hook Form.

Do not create another copy.

### Shared UI state

May belong to Zustand.

### Local UI state

May belong to `useState`.

Avoid:

```text
TanStack Query
     ↓
useState
     ↓
Zustand
     ↓
Component
```

for the same data.

Prefer:

```text
TanStack Query
     ↓
Component
```

---

# 22. ICONS

Use `lucide-react` for icons.

Do not add another icon library unless there is a specific requirement that Lucide cannot satisfy.

Follow existing icon usage and naming conventions.

---

# 23. STYLING

Use the existing Tailwind CSS architecture.

Do not introduce another styling framework.

Do not rewrite existing styling merely for personal preference.

Preserve the established visual language of the application.

---

# 24. NO UNNECESSARY DEPENDENCIES

Do not add:

```text
Redux
Redux Toolkit
SWR
MobX
Jotai
Axios
Formik
another validation library
another icon library
another CSS framework
```

unless a concrete requirement exists that cannot reasonably be fulfilled with the existing stack.

Before adding any dependency, explain:

1. Why existing libraries cannot solve the problem.
2. What concrete capability the dependency provides.
3. Why the added maintenance cost is justified.

Prefer no new dependency.

---

# 25. DO NOT OVER-REFACTOR

When implementing a feature:

**Do not refactor unrelated code merely because it could be cleaner.**

Keep changes scoped to:

* requested functionality
* required supporting architecture
* obvious bugs introduced by the change

Avoid large unrelated rewrites.

---

# 26. PRESERVE BUSINESS LOGIC

This application contains important financial/business behavior.

Do not casually change:

* account balance calculations
* transaction behavior
* transfer behavior
* category behavior
* contact behavior
* loan behavior
* loan payment behavior
* ownership rules
* family rules
* authentication behavior

If a change affects business semantics, inspect the existing implementation first.

Prefer preserving backend authority.

---

# 27. API CHANGES

When an existing backend API changes:

1. Inspect the current frontend usage.
2. Update the response/request types.
3. Update Zod schemas if request validation changes.
4. Update the API/hook layer.
5. Update affected forms/components.
6. Update query invalidation if necessary.
7. Search for all consumers of the changed contract.
8. Run validation/build.

Do not patch only the first TypeScript error.

---

# 28. NEW FEATURES

For a new feature, first identify:

```text
Does it have server data?
    → TanStack Query

Does it have a form?
    → React Hook Form

Does it need validation?
    → Zod

Does it have shared UI state?
    → Zustand

Does it only need local UI state?
    → useState

Does it need an icon?
    → lucide-react

Does it need an API request?
    → existing apiFetch
```

This decision process should be followed before introducing another abstraction.

---

# 29. TYPESCRIPT

Maintain strict TypeScript quality.

Avoid:

```ts
any
```

unless there is a documented and unavoidable reason.

Prefer:

```ts
unknown
```

with proper narrowing when the type is genuinely unknown.

Do not suppress errors with:

```ts
@ts-ignore
```

or:

```ts
@ts-expect-error
```

unless there is a concrete documented reason.

Do not weaken TypeScript configuration to make a change compile.

---

# 30. VALIDATION BEFORE COMPLETION

After meaningful changes, run:

```bash
npx tsc --noEmit --pretty false
```

Then:

```bash
npm run lint -- --max-warnings=0
```

Then, for changes that may affect production/build behavior:

```bash
npm run build
```

Fix errors introduced by the change.

Do not declare the implementation complete while known TypeScript or lint errors remain.

---

# 31. NEXT.JS-SPECIFIC VERIFICATION

For Next.js-specific changes:

1. Check the installed Next.js version.
2. Read the relevant documentation under:

```text
node_modules/next/dist/docs/
```

3. Follow the current API/convention.
4. Check deprecation warnings.
5. Do not rely on memory of older Next.js versions.

This is especially important for:

* App Router
* Server Components
* Client Components
* caching
* route handlers
* middleware/proxy behavior
* metadata
* async APIs
* configuration
* build behavior

---

# 32. BEFORE WRITING CODE

For every non-trivial task:

1. Inspect existing implementation.
2. Search for similar functionality.
3. Identify the existing library/pattern used for that functionality.
4. Reuse existing abstractions where appropriate.
5. Check whether the data is server state, form state, or client state.
6. Check existing query keys.
7. Check existing schemas/types.
8. Check existing API hooks.
9. Only then implement the change.

Do not create a new pattern when an established pattern already exists.

---

# 33. AFTER WRITING CODE

Before finishing:

1. Search for duplicated logic.
2. Check for unnecessary `useState`.
3. Check for unnecessary `useEffect`.
4. Check for duplicated API data.
5. Check query-key consistency.
6. Check mutation invalidation.
7. Check Zod/RHF integration.
8. Check TypeScript.
9. Run lint.
10. Run build when appropriate.

---

# 34. DEFINITION OF DONE

A feature/change is considered complete when:

* Existing architecture is respected.
* Existing libraries are reused.
* No unnecessary dependency was introduced.
* Server state uses TanStack Query.
* Forms use React Hook Form.
* Input validation uses Zod.
* Shared UI state uses Zustand only when justified.
* Local UI state remains local.
* API access uses the existing API client.
* Query keys follow the established factory pattern.
* Mutation invalidation is correct.
* No unnecessary duplicated state exists.
* No obvious dead code was introduced.
* TypeScript passes.
* ESLint passes.
* Build passes when relevant.
* Existing behavior is preserved unless the task explicitly requires changing it.

---

# 35. CORE PRINCIPLE

When in doubt, follow this rule:

```text
REUSE BEFORE REINVENTING.
```

Use the existing:

```text
Next.js
React
TypeScript
Tailwind
TanStack Query
React Hook Form
Zod
Zustand
Lucide React
apiFetch
query key factories
feature schemas
existing hooks
```

before introducing anything new.

The goal is not to maximize the number of libraries or abstractions.

The goal is to keep the codebase:

* consistent
* predictable
* type-safe
* maintainable
* minimally duplicated
* easy to extend
* aligned with the existing architecture
