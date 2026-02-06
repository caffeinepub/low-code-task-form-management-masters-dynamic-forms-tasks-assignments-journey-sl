import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import RequireAuth from './components/auth/RequireAuth';
import AppShell from './components/layout/AppShell';
import MastersPage from './pages/admin/MastersPage';
import FormBuilderPage from './pages/admin/FormBuilderPage';
import TaskDefinitionsPage from './pages/admin/TaskDefinitionsPage';
import MyTasksPage from './pages/tasks/MyTasksPage';
import DepartmentPoolPage from './pages/tasks/DepartmentPoolPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import CreateTaskPage from './pages/tasks/CreateTaskPage';
import FormSubmissionViewPage from './pages/tasks/FormSubmissionViewPage';

const rootRoute = createRootRoute({
  component: () => (
    <RequireAuth>
      <AppShell>
        <Outlet />
      </AppShell>
    </RequireAuth>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MyTasksPage,
});

const myTasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  component: MyTasksPage,
});

const departmentPoolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/department-pool',
  component: DepartmentPoolPage,
});

const createTaskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/create',
  component: CreateTaskPage,
});

const taskDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/$taskId',
  component: TaskDetailPage,
});

const formSubmissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/$taskId/submissions/$submissionId',
  component: FormSubmissionViewPage,
});

const mastersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/masters',
  component: MastersPage,
});

const formBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/forms',
  component: FormBuilderPage,
});

const taskDefinitionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/task-definitions',
  component: TaskDefinitionsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  myTasksRoute,
  departmentPoolRoute,
  createTaskRoute,
  taskDetailRoute,
  formSubmissionRoute,
  mastersRoute,
  formBuilderRoute,
  taskDefinitionsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
