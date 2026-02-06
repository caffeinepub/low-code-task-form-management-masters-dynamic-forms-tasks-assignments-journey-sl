/**
 * Determines if a navigation item should be highlighted as active based on the current path.
 * Handles special cases like nested routes and exclusions.
 */

export type NavMatchRule = {
  path: string;
  exact?: boolean;
  excludePaths?: string[];
};

export function isNavItemActive(currentPath: string, itemPath: string, rule?: NavMatchRule): boolean {
  // Use rule if provided, otherwise create default rule
  const matchRule = rule || { path: itemPath };
  
  // Exact match
  if (matchRule.exact) {
    return currentPath === matchRule.path;
  }
  
  // Check exclusions first
  if (matchRule.excludePaths) {
    for (const excludePath of matchRule.excludePaths) {
      if (currentPath === excludePath || currentPath.startsWith(excludePath + '/')) {
        return false;
      }
    }
  }
  
  // Check if current path matches or is a child of the item path
  return currentPath === matchRule.path || currentPath.startsWith(matchRule.path + '/');
}

/**
 * Predefined navigation match rules for the application
 */
export const NAV_MATCH_RULES: Record<string, NavMatchRule> = {
  // My Tasks: matches /tasks and /tasks/:taskId and nested submission routes, but NOT /tasks/create
  myTasks: {
    path: '/tasks',
    excludePaths: ['/tasks/create'],
  },
  // Create Task: exact match only
  createTask: {
    path: '/tasks/create',
    exact: true,
  },
  // Department Pool: matches /department-pool and any nested routes
  departmentPool: {
    path: '/department-pool',
  },
  // Admin routes: match themselves and any nested routes
  adminMasters: {
    path: '/admin/masters',
  },
  adminForms: {
    path: '/admin/forms',
  },
  adminTaskDefinitions: {
    path: '/admin/task-definitions',
  },
};
