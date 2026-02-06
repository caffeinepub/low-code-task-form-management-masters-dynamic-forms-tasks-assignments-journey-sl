# Specification

## Summary
**Goal:** Add Task Definitions that require one or more attached forms, enable creating tasks from those definitions, and support per-form submissions and completion tracking inside tasks.

**Planned changes:**
- Add backend TaskDefinition data model with an ordered list of attached Form Definition references (at least one required), plus admin-only create/update and query APIs to list/get task definitions.
- Add backend APIs to create Task instances from a selected Task Definition, copying attached forms onto the task and initializing per-form completion status to incomplete.
- Add backend task-scoped form submission APIs (submit, list by task, get by submissionId) that update per-form completion status on successful submission.
- Replace placeholder React Query hooks for task definitions/tasks/submissions to call real backend actor methods and handle cache invalidation and English errors.
- Build Admin UI at `/admin/task-definitions` to list/create/edit Task Definitions with multi-select Form Definitions and enforce “at least one form” validation.
- Build Create Task UI at `/tasks/create` to select a Task Definition, create a task, and navigate to the new task detail page (with English error handling on failure).
- Update Task Detail to support “Fill Form” (open existing DynamicFormRenderer and submit for the task) and “View Submission” (navigate to existing submission view page), reflecting per-form submitted state.

**User-visible outcome:** Admins can define tasks that include one or more forms and create tasks from those definitions; users can open each attached form within a task, submit it individually, see per-form completion status update, and view saved submissions.
