# Tasks: Member Management System (Account Management)

**Input**: Design documents from `/specs/001-member-management/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per the METC constitution, Test-First Development is MANDATORY. All user stories MUST include test tasks that are written and failing before implementation begins (Red-Green-Refactor cycle).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**API Note**: Working with `/accounts` endpoints, `Account` entity with `roleLevel` (ADMIN/EDITOR/USER/CLIENT) and `status` (ON/OFF) fields.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single-page web application structure:
- **Frontend**: `src/`, `tests/` at repository root
- Paths shown below use this structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Vite + Vue 3 + TypeScript project with strict mode
- [ ] T002 [P] Install core dependencies (vue, vue-router, pinia, axios, quasar, zod)
- [ ] T003 [P] Install dev dependencies (vitest, @vue/test-utils, eslint, prettier)
- [ ] T004 [P] Create vite.config.ts with Quasar plugin and path aliases
- [ ] T005 [P] Create tsconfig.json with strict mode enabled
- [ ] T006 [P] Create vitest.config.ts for test configuration
- [ ] T007 [P] Create .eslintrc.cjs with Vue 3 and TypeScript rules
- [ ] T008 [P] Create src/ directory structure (components, pages, services, stores, router, types, utils)
- [ ] T009 [P] Create tests/ directory structure (unit, integration, e2e)
- [ ] T010 [P] Create src/main.ts with Quasar, Pinia, and Router setup
- [ ] T011 [P] Create index.html entry point
- [ ] T012 [P] Create src/App.vue root component with Quasar layout

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T013 Create TypeScript interfaces in src/types/account.ts (Account, RoleLevel, AccountStatus, AccountFormDto)
- [ ] T014 [P] Create TypeScript interfaces in src/types/auth.ts (AuthToken, User, LoginCredentials)
- [ ] T015 [P] Create TypeScript interfaces in src/types/api.ts (ApiError, AccountListResponse)
- [ ] T016 Create Zod schemas in src/services/validation/schemas.ts (AccountSchema, RoleLevelSchema, AccountStatusSchema, AccountFormDtoSchema)
- [ ] T017 [P] Create Axios client in src/services/api/client.ts with interceptors for auth and logging, add custom header interviewerName: "Benben"
- [ ] T018 [P] Create logger utility in src/utils/logger.ts for structured console logging
- [ ] T019 Create Pinia auth store in src/stores/auth.ts (state: token, user, isAuthenticated, isLoading, error)
- [ ] T020 [P] Create Pinia accounts store in src/stores/accounts.ts (state: accounts, currentAccount, isLoading, error, filters)
- [ ] T021 Create Vue Router in src/router/index.ts with route definitions and auth guards
- [ ] T022 [P] Create common components: src/components/common/LoadingSpinner.vue
- [ ] T023 [P] Create common components: src/components/common/ErrorMessage.vue
- [ ] T024 [P] Create common components: src/components/common/ConfirmDialog.vue

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication and Login (Priority: P1) 🎯 MVP

**Goal**: Implement secure login with token-based authentication

**Independent Test**: Login form accepts credentials, calls API, stores token, redirects to account list on success

### Tests for User Story 1 (MANDATORY) ⚠️

> **CONSTITUTION REQUIREMENT**: Write these tests FIRST, get approval, ensure they FAIL before implementation (Red-Green-Refactor)

- [ ] T025 [P] [US1] Component test for LoginForm in tests/unit/components/auth/LoginForm.spec.ts (test props, emits, validation)
- [ ] T026 [P] [US1] Integration test for auth service in tests/integration/auth.spec.ts (test login API call, token storage)
- [ ] T027 [P] [US1] Integration test for auth store in tests/integration/auth-store.spec.ts (test login action, state updates)
- [ ] T028 [P] [US1] E2E test for login flow in tests/e2e/login.spec.ts (test full login journey from form to redirect)

### Implementation for User Story 1

- [ ] T029 [P] [US1] Create LoginForm component in src/components/auth/LoginForm.vue (form with username/password inputs, submit handler, error display)
- [ ] T030 [P] [US1] Create LoginPage component in src/pages/LoginPage.vue (page wrapper for LoginForm)
- [ ] T031 [US1] Implement auth service in src/services/api/auth.ts (login, logout functions with Zod validation)
- [ ] T032 [US1] Implement auth store actions in src/stores/auth.ts (login action: call API, store token, update state)
- [ ] T033 [US1] Implement auth store getters in src/stores/auth.ts (isAuthenticated computed, token expiration check)
- [ ] T034 [US1] Add Axios request interceptor in src/services/api/client.ts (inject token from auth store)
- [ ] T035 [US1] Add Axios response interceptor in src/services/api/client.ts (handle 401, redirect to login, clear token)
- [ ] T036 [US1] Add router auth guard in src/router/index.ts (check auth state, redirect to login if not authenticated)
- [ ] T037 [US1] Add error handling and user feedback in src/components/auth/LoginForm.vue (display API errors, validation errors)
- [ ] T038 [US1] Add loading states in src/components/auth/LoginForm.vue (disable submit during API call, show spinner)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (Login → Token → Redirect)

---

## Phase 4: User Story 2 - View Account List (Priority: P2)

**Goal**: Display paginated account list with search and filter capabilities

**Independent Test**: After login, account list page displays accounts from API, supports search/filter, shows account details on row click

### Tests for User Story 2 (MANDATORY) ⚠️

- [ ] T039 [P] [US2] Component test for AccountTable in tests/unit/components/accounts/AccountTable.spec.ts (test props, emits, row click)
- [ ] T040 [P] [US2] Component test for SearchFilter in tests/unit/components/accounts/SearchFilter.spec.ts (test search input, filter dropdowns, emit events)
- [ ] T041 [P] [US2] Integration test for accounts service in tests/integration/accounts.spec.ts (test GET /accounts, data parsing)
- [ ] T042 [P] [US2] Integration test for accounts store in tests/integration/accounts-store.spec.ts (test fetchAccounts action, state updates, filters)
- [ ] T043 [P] [US2] E2E test for account list flow in tests/e2e/account-list.spec.ts (test viewing list, search, filter, pagination)

### Implementation for User Story 2

- [ ] T044 [P] [US2] Create AccountTable component in src/components/accounts/AccountTable.vue (Quasar QTable with columns: name, email, roleLevel, status, actions)
- [ ] T045 [P] [US2] Create SearchFilter component in src/components/accounts/SearchFilter.vue (search input + status filter + role filter)
- [ ] T046 [P] [US2] Create AccountListPage component in src/pages/AccountListPage.vue (layout with table, search/filter, add button)
- [ ] T047 [US2] Implement accounts service in src/services/api/accounts.ts (getAccounts function with Zod validation)
- [ ] T048 [US2] Implement accounts store actions in src/stores/accounts.ts (fetchAccounts action: call API, store accounts, handle errors)
- [ ] T049 [US2] Implement accounts store getters in src/stores/accounts.ts (filteredAccounts computed based on search/filter state)
- [ ] T050 [US2] Add search functionality in src/components/accounts/SearchFilter.vue (emit search query, debounce input)
- [ ] T051 [US2] Add filter functionality in src/components/accounts/SearchFilter.vue (status filter dropdown, role filter dropdown, emit changes)
- [ ] T052 [US2] Add client-side filtering in src/stores/accounts.ts (filter accounts array based on search query and filters)
- [ ] T053 [US2] Add loading states in src/pages/AccountListPage.vue (show spinner while fetching, disable interactions)
- [ ] T054 [US2] Add error handling in src/pages/AccountListPage.vue (display error message if API fails)
- [ ] T055 [US2] Add row click handler in src/components/accounts/AccountTable.vue (navigate to account detail page)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (Login + View List)

---

## Phase 5: User Story 3 - Create New Account (Priority: P3)

**Goal**: Allow administrators to create new accounts with validation

**Independent Test**: After login, clicking "Add Account" button shows form, submitting valid data creates account, validation errors shown for invalid data

### Tests for User Story 3 (MANDATORY) ⚠️

- [ ] T056 [P] [US3] Component test for AccountForm in tests/unit/components/accounts/AccountForm.spec.ts (test form inputs, validation, submit)
- [ ] T057 [P] [US3] Integration test for create account in tests/integration/accounts.spec.ts (test POST /create-account, validation)
- [ ] T058 [P] [US3] Integration test for accounts store create in tests/integration/accounts-store.spec.ts (test createAccount action)
- [ ] T059 [P] [US3] E2E test for create account flow in tests/e2e/account-create.spec.ts (test form submission, success/error handling)

### Implementation for User Story 3

- [ ] T060 [P] [US3] Create AccountForm component in src/components/accounts/AccountForm.vue (form with name, email, roleLevel, status inputs)
- [ ] T061 [P] [US3] Create AccountCreatePage component in src/pages/AccountCreatePage.vue (page wrapper with form and cancel/submit buttons)
- [ ] T062 [US3] Implement createAccount in src/services/api/accounts.ts (POST /create-account with Zod request/response validation)
- [ ] T063 [US3] Implement createAccount action in src/stores/accounts.ts (call API, add to accounts array, handle errors)
- [ ] T064 [US3] Add client-side validation in src/components/accounts/AccountForm.vue (Quasar validation rules: required, email format)
- [ ] T065 [US3] Add form submission in src/components/accounts/AccountForm.vue (emit submit event with form data)
- [ ] T066 [US3] Add success handling in src/pages/AccountCreatePage.vue (show success notification, redirect to list)
- [ ] T067 [US3] Add error handling in src/pages/AccountCreatePage.vue (display API validation errors, field-level errors)
- [ ] T068 [US3] Add loading state in src/pages/AccountCreatePage.vue (disable form during submission)
- [ ] T069 [US3] Add cancel button in src/pages/AccountCreatePage.vue (navigate back to list without saving)

**Checkpoint**: Can create new accounts with validation

---

## Phase 6: User Story 4 - Update Account Information (Priority: P3)

**Goal**: Allow editing existing account information with validation

**Independent Test**: Selecting account and clicking "Edit" shows pre-filled form, submitting updates account, validation enforced

### Tests for User Story 4 (MANDATORY) ⚠️

- [ ] T070 [P] [US4] Component test for AccountForm edit mode in tests/unit/components/accounts/AccountForm.spec.ts (test pre-filled data, update submission)
- [ ] T071 [P] [US4] Integration test for update account in tests/integration/accounts.spec.ts (test PATCH /update-account/{id})
- [ ] T072 [P] [US4] Integration test for accounts store update in tests/integration/accounts-store.spec.ts (test updateAccount action)
- [ ] T073 [P] [US4] E2E test for update account flow in tests/e2e/account-update.spec.ts (test edit form, submission, validation)

### Implementation for User Story 4

- [ ] T074 [P] [US4] Create AccountEditPage component in src/pages/AccountEditPage.vue (page wrapper with AccountForm in edit mode)
- [ ] T075 [P] [US4] Create AccountDetailPage component in src/pages/AccountDetailPage.vue (display account info with edit button)
- [ ] T076 [US4] Implement updateAccount in src/services/api/accounts.ts (PATCH /update-account/{id} with Zod validation)
- [ ] T077 [US4] Implement updateAccount action in src/stores/accounts.ts (call API, update accounts array, handle errors)
- [ ] T078 [US4] Implement getAccountById in src/services/api/accounts.ts (GET /account/{id} with Zod validation)
- [ ] T079 [US4] Implement fetchAccountById action in src/stores/accounts.ts (call API, set currentAccount state)
- [ ] T080 [US4] Add edit mode support in src/components/accounts/AccountForm.vue (accept initialData prop, pre-fill form)
- [ ] T081 [US4] Add form submission for update in src/components/accounts/AccountForm.vue (emit update event with account id and data)
- [ ] T082 [US4] Add success handling in src/pages/AccountEditPage.vue (show success notification, redirect to detail or list)
- [ ] T083 [US4] Add error handling in src/pages/AccountEditPage.vue (display API validation errors)
- [ ] T084 [US4] Add edit button in src/pages/AccountDetailPage.vue (navigate to edit page with account id)

**Checkpoint**: Can update existing accounts with validation

---

## Phase 7: User Story 5 - Delete Account (Priority: P3)

**Goal**: Allow safe deletion of accounts with confirmation

**Independent Test**: Clicking delete shows confirmation dialog, confirming deletes account, canceling preserves account

### Tests for User Story 5 (MANDATORY) ⚠️

- [ ] T085 [P] [US5] Component test for ConfirmDialog in tests/unit/components/common/ConfirmDialog.spec.ts (test show/hide, confirm/cancel events)
- [ ] T086 [P] [US5] Integration test for delete account in tests/integration/accounts.spec.ts (test DELETE /delete-account/{id})
- [ ] T087 [P] [US5] Integration test for accounts store delete in tests/integration/accounts-store.spec.ts (test deleteAccount action)
- [ ] T088 [P] [US5] E2E test for delete account flow in tests/e2e/account-delete.spec.ts (test delete confirmation, account removal)

### Implementation for User Story 5

- [ ] T089 [US5] Implement deleteAccount in src/services/api/accounts.ts (DELETE /delete-account/{id})
- [ ] T090 [US5] Implement deleteAccount action in src/stores/accounts.ts (call API, remove from accounts array, handle errors)
- [ ] T091 [US5] Add delete button in src/components/accounts/AccountTable.vue (action column with delete icon)
- [ ] T092 [US5] Add delete button in src/pages/AccountDetailPage.vue (delete button with confirmation)
- [ ] T093 [US5] Add confirmation dialog in src/pages/AccountListPage.vue (use ConfirmDialog component, show on delete click)
- [ ] T094 [US5] Add confirmation dialog in src/pages/AccountDetailPage.vue (use ConfirmDialog component)
- [ ] T095 [US5] Add delete handler in src/pages/AccountListPage.vue (call deleteAccount action on confirm)
- [ ] T096 [US5] Add delete handler in src/pages/AccountDetailPage.vue (call deleteAccount action, redirect to list on success)
- [ ] T097 [US5] Add success notification in src/pages/AccountListPage.vue (show success message after deletion)
- [ ] T098 [US5] Add error handling in src/pages/AccountListPage.vue (display error if deletion fails)

**Checkpoint**: All user stories should now be independently functional (Login, View, Create, Update, Delete)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T099 [P] Add Figma design styles in src/styles/design-tokens.scss (colors, typography, spacing from Figma)
- [ ] T100 [P] Apply Figma design to LoginPage component (match layout, colors, fonts)
- [ ] T101 [P] Apply Figma design to AccountListPage component (match table design, buttons, spacing)
- [ ] T102 [P] Apply Figma design to AccountForm component (match input styles, labels, error states)
- [ ] T103 [P] Add responsive breakpoints in src/components (mobile: 320px-768px, tablet: 768px-1024px, desktop: 1024px+)
- [ ] T104 [P] Add loading states to all async operations (login, fetch accounts, create, update, delete)
- [ ] T105 [P] Add error boundaries in src/App.vue (catch and log component errors)
- [ ] T106 [P] Add accessibility attributes (ARIA labels, roles, keyboard navigation)
- [ ] T107 [P] Add page transitions in src/router/index.ts (smooth navigation between pages)
- [ ] T108 [P] Optimize bundle size (check vite build output, lazy load routes)
- [ ] T109 [P] Add ESLint fixes and Prettier formatting across all files
- [ ] T110 [P] Create README.md with setup instructions (reference quickstart.md)
- [ ] T111 [P] Add environment variables in .env.development and .env.production (API base URL)
- [ ] T112 [P] Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] T113 [P] Test mobile responsiveness (320px, 375px, 768px, 1024px, 1920px)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P3 → P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independently testable (uses accounts list from US2 for display)
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Independently testable (requires account detail view)
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Independently testable (works with account list/detail)

### Within Each User Story

- Tests (MANDATORY) MUST be written and FAIL before implementation
- Type definitions before validation schemas
- Services before store actions
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002-T012)
- All Foundational tasks marked [P] can run in parallel within their groups (T014-T015, T017-T018, T022-T024)
- Once Foundational phase completes, all user story test tasks marked [P] can run in parallel
- Within each story, all tests marked [P] can be written in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (MANDATORY - write first):
Task: "[US1] Component test for LoginForm in tests/unit/components/auth/LoginForm.spec.ts"
Task: "[US1] Integration test for auth service in tests/integration/auth.spec.ts"
Task: "[US1] Integration test for auth store in tests/integration/auth-store.spec.ts"
Task: "[US1] E2E test for login flow in tests/e2e/login.spec.ts"

# After tests written and failing, launch parallel implementation tasks:
Task: "[US1] Create LoginForm component in src/components/auth/LoginForm.vue"
Task: "[US1] Create LoginPage component in src/pages/LoginPage.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2 Only)

1. Complete Phase 1: Setup (T001-T012)
2. Complete Phase 2: Foundational (T013-T024) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 - Authentication (T025-T038)
4. Complete Phase 4: User Story 2 - View Account List (T039-T055)
5. **STOP and VALIDATE**: Test login + view list independently
6. Deploy/demo if ready (Working MVP!)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Auth) → Test independently → Deploy/Demo (Can login!)
3. Add User Story 2 (View) → Test independently → Deploy/Demo (MVP: Login + View!)
4. Add User Story 3 (Create) → Test independently → Deploy/Demo (Can add accounts!)
5. Add User Story 4 (Update) → Test independently → Deploy/Demo (Can edit accounts!)
6. Add User Story 5 (Delete) → Test independently → Deploy/Demo (Full CRUD complete!)
7. Add Phase 8 (Polish) → Final QA → Production deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T024)
2. Once Foundational is done:
   - Developer A: User Story 1 (T025-T038)
   - Developer B: User Story 2 (T039-T055)
   - Developer C: User Story 3 (T056-T069)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD MANDATORY**: Verify tests fail before implementing (Red-Green-Refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- API uses Account entity (not Member) with roleLevel and status fields
- Actual endpoints: GET /accounts, GET /account/{id}, POST /create-account, PATCH /update-account/{id}, DELETE /delete-account/{id}
- Figma design at: https://server-door-49461275.figma.site/ (apply styles in Phase 8)
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Count Summary

- **Phase 1 (Setup)**: 12 tasks
- **Phase 2 (Foundational)**: 12 tasks
- **Phase 3 (US1 - Auth)**: 14 tasks (4 tests + 10 implementation)
- **Phase 4 (US2 - View)**: 17 tasks (5 tests + 12 implementation)
- **Phase 5 (US3 - Create)**: 14 tasks (4 tests + 10 implementation)
- **Phase 6 (US4 - Update)**: 15 tasks (4 tests + 11 implementation)
- **Phase 7 (US5 - Delete)**: 14 tasks (4 tests + 10 implementation)
- **Phase 8 (Polish)**: 15 tasks

**Total**: 113 tasks
**MVP (US1 + US2)**: 55 tasks (Setup + Foundational + US1 + US2)
**Full CRUD**: 98 tasks (All user stories, no polish)
