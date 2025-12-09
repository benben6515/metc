<!--
Sync Impact Report - Constitution Update
=========================================
Version Change: Initial → 1.0.0
Ratification: 2025-12-09 (Initial constitution for METC project)

Modified Principles:
- NEW: I. Component-First Architecture
- NEW: II. Test-First Development (NON-NEGOTIABLE)
- NEW: III. Type Safety & Contract Validation
- NEW: IV. Observability & Debugging
- NEW: V. Simplicity & YAGNI

Added Sections:
- Core Principles (5 principles)
- Technology Constraints
- Quality Standards
- Governance

Removed Sections: None (initial version)

Templates Requiring Updates:
✅ .specify/templates/plan-template.md - UPDATED: Constitution Check section now includes all 5 principles + tech constraints
✅ .specify/templates/spec-template.md - VERIFIED: Technology-agnostic requirements enforced
✅ .specify/templates/tasks-template.md - UPDATED: Tests now MANDATORY (was optional), reflects TDD principle
✅ .claude/commands/speckit.specify.md - VERIFIED: No updates needed (agent-agnostic)
✅ .claude/commands/speckit.plan.md - VERIFIED: Constitution Check workflow intact
✅ .claude/commands/speckit.tasks.md - UPDATED: Test generation now mandatory for METC project

Follow-up TODOs: None - all placeholders filled
=========================================
-->

# METC Member Management System Constitution

## Core Principles

### I. Component-First Architecture

Every feature is built as a reusable Vue 3 component with clear contracts and boundaries.

**Rules:**
- Components MUST be self-contained with explicit props/emits contracts
- Components MUST be independently testable without parent dependencies
- Component purpose MUST be singular and well-defined - no multi-purpose components
- Components MUST expose a clear public API through props, emits, and slots
- Shared UI components MUST live in a centralized components library

**Rationale:** Component-first architecture enables independent development, testing, and reuse across the application. Clear contracts prevent coupling and enable team members to work in parallel without conflicts.

### II. Test-First Development (NON-NEGOTIABLE)

TDD is mandatory for all feature development. Tests must be written, approved, and failing before implementation begins.

**Rules:**
- Tests MUST be written and reviewed BEFORE writing implementation code
- Tests MUST fail initially (Red-Green-Refactor cycle strictly enforced)
- User approval of test scenarios REQUIRED before implementation proceeds
- Each component MUST have unit tests verifying its contract
- Integration tests REQUIRED for:
  - New API integrations
  - Contract changes with backend services
  - Authentication/authorization flows
  - Shared state management (Pinia stores)

**Rationale:** Test-first development ensures clear requirements understanding, prevents regression, and serves as living documentation. The Red-Green-Refactor cycle guarantees tests actually validate the implementation rather than being retrofitted to pass.

### III. Type Safety & Contract Validation

TypeScript strict mode and API contract validation ensure reliability and prevent runtime errors.

**Rules:**
- TypeScript strict mode MUST be enabled (`strict: true`)
- All API responses MUST be validated against defined schemas
- No `any` types allowed except when interfacing with untyped third-party libraries (document why)
- API contracts MUST be defined using TypeScript interfaces or Zod schemas
- Runtime validation REQUIRED at system boundaries (API responses, user input)

**Rationale:** Strict typing catches errors at compile time rather than runtime, reducing production bugs. Contract validation ensures the frontend gracefully handles unexpected backend responses and provides clear error messages.

### IV. Observability & Debugging

Comprehensive logging and debugging capabilities ensure rapid issue identification and resolution.

**Rules:**
- Structured logging REQUIRED for all API calls (request/response/errors)
- Console errors MUST include context (component name, action, state)
- Network request/response logging MUST be available in development mode
- Error boundaries MUST catch and log component errors with stack traces
- User actions SHOULD be logged for debugging session replay

**Rationale:** Modern web applications require observability to debug issues in production. Structured logging enables quick identification of problems, reducing mean time to resolution and improving user experience.

### V. Simplicity & YAGNI

Start simple and add complexity only when needed. Every abstraction must justify its existence.

**Rules:**
- Direct implementation is preferred over premature abstraction
- New patterns/libraries MUST be justified with concrete current need
- Three instances of similar code before creating abstraction (Rule of Three)
- Feature flags and complex configuration ONLY when multiple deployment scenarios exist
- No speculative features - build what users need now, not what they might need

**Rationale:** Premature abstraction increases maintenance cost and cognitive load without providing value. Simple, direct code is easier to understand, debug, and modify. YAGNI prevents over-engineering and keeps the codebase maintainable.

## Technology Constraints

### Stack Requirements

**Mandatory Stack:**
- Vue 3 (Composition API preferred)
- Vite (build tool)
- TypeScript (strict mode enabled)
- Quasar (UI framework)
- Pinia (state management)
- Axios (HTTP client with interceptors)

**Rationale:** This stack is defined by the METC project requirements and provides a modern, type-safe foundation for component-based development.

### API Integration

**Backend Contract:**
- Base URL: `https://api-frontend-interview-server.metcfire.com.tw/`
- API Documentation: `https://api-frontend-interview-server.metcfire.com.tw/api-docs`
- Authentication: Token-based (implementation details in plan.md)

**Requirements:**
- All API calls MUST use Axios interceptors for token injection
- API responses MUST be validated against TypeScript interfaces
- Network errors MUST be handled with user-friendly messages
- Loading states MUST be shown for async operations

### Design Compliance

**Figma Source:** `https://server-door-49461275.figma.site/`

**Requirements:**
- UI implementation MUST match Figma specifications
- Deviations from design REQUIRE documentation and justification
- Responsive behavior MUST be tested across breakpoints
- Accessibility standards (WCAG 2.1 AA) MUST be met

## Quality Standards

### Code Quality Gates

Before any merge/deployment:
- TypeScript compilation MUST succeed with zero errors
- All tests MUST pass (unit + integration)
- Linting MUST pass with zero warnings
- Component props/emits MUST have TypeScript types
- API contract validation MUST be implemented

### Development Workflow

**Feature Development:**
1. Write test scenarios (component tests + integration tests if needed)
2. Get test approval from reviewer
3. Verify tests fail (Red)
4. Implement feature (Green)
5. Refactor for clarity (Refactor)
6. Verify all quality gates pass

**Code Review:**
- All PRs MUST be reviewed against constitution principles
- Complexity MUST be justified (reference Principle V - Simplicity)
- Test coverage MUST verify actual functionality (no empty/mock-only tests)

## Governance

### Constitution Authority

This constitution supersedes all other development practices, guidelines, and conventions for the METC project. When conflicts arise between this constitution and other documentation, the constitution takes precedence.

### Amendment Process

1. Proposed amendments MUST document:
   - Specific principle/section being changed
   - Rationale for change (what problem does it solve?)
   - Impact assessment on existing code and templates
   - Migration plan for existing violations

2. Amendments REQUIRE:
   - Review by project stakeholders
   - Semantic version bump following these rules:
     - MAJOR: Backward incompatible changes (principle removal/redefinition)
     - MINOR: New principles or sections added
     - PATCH: Clarifications, wording fixes, non-semantic changes
   - Update to `.specify/templates/*` files to maintain consistency
   - Update to `.claude/commands/*.md` files if workflow affected

3. Amendment propagation:
   - Constitution changes MUST be reflected in plan-template.md (Constitution Check section)
   - Task categorization in tasks-template.md MUST align with principles
   - Spec template requirements MUST align with quality standards

### Compliance Review

**All development artifacts MUST verify compliance:**
- Feature specs (`spec.md`) MUST align with quality standards
- Implementation plans (`plan.md`) MUST include Constitution Check section
- Task lists (`tasks.md`) MUST organize work to support principles (e.g., test-first workflow)
- Code reviews MUST verify adherence to all five core principles

**Violation Handling:**
- Minor violations: Document in code comments with justification
- Major violations: Require formal exception request with:
  - Specific principle violated
  - Why adherence is not feasible
  - Simpler alternative considered and rejected because...
  - Plan to resolve violation in future

### Runtime Development Guidance

For agent-specific development guidance and context, refer to the generated agent files in `.specify/memory/`:
- Claude-specific: `claude-file.md` (if using Claude Code)
- Other agents: Respective agent-specific files generated during planning

These files contain technology decisions and patterns for the current implementation phase.

**Version**: 1.0.0 | **Ratified**: 2025-12-09 | **Last Amended**: 2025-12-09
