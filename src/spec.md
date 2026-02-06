# Specification

## Summary
**Goal:** Build a low-code, configuration-driven task and form management app with Admin-only configuration (masters, form builder, task definitions) and user-facing task execution (assignments, submissions, journey, SLA).

**Planned changes:**
- Implement Internet Identity authentication and backend-enforced role-based access control (Admin vs non-admin), with UI gating and clear “You do not have access” messaging.
- Add Admin Master Data Management for fixed masters (Users, Roles, Departments, Statuses, Categories, Priorities) plus user-defined master lists with CRUD, deactivation, and lookup endpoints.
- Create Admin dynamic Form Definition model with versioning and field definitions (Single Line, Multi Line, Number, Date, Date-Time, Dropdown, Multi-Select, File Upload), including validation metadata and publishable versions.
- Implement runtime lookup-backed dropdown/multi-select fields that load options dynamically from masters and reflect master changes without republishing form versions.
- Add reusable form linking to task definitions and store per-task submissions with references to form definition/version, submitter, and timestamps; provide read-only submission viewing.
- Implement Task Definitions and Task Instances with metadata (Task Type, Priority, Status, Owner, Created Date, Due Date, Completion Date), multiple attached forms, and per-form completion status derived from submissions.
- Implement assignment workflows: assign to department pool or user, department pickup, reassignment with permission checks, and task visibility rules (my tasks / my department pool / admin all).
- Add task journey (append-only event log) covering status changes, assignment/pickup/reassignment, and form submissions; render a human-readable timeline in the UI.
- Add SLA/TAT configuration on task definitions, SLA status computation (On track / At risk / Breached), escalation threshold detection, and escalation events recorded in the task journey; display SLA status on lists and detail pages.
- Apply a consistent enterprise UI theme and layout separating Admin configuration areas from user task work areas using Tailwind and existing UI components.

**User-visible outcome:** Admins can manage masters, build/version/publish dynamic reusable forms, define tasks with attached forms and SLA rules, and view all tasks; non-admin users can see tasks assigned to them or their department pool, pick up/reassign when allowed, fill and submit assigned forms, review read-only submissions, and view task journey and SLA status.
