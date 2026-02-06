import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../../hooks/useCurrentUser';
import LoginButton from '../auth/LoginButton';
import NavSection from './NavSection';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, ListTodo, Users, FileText, Settings, Briefcase } from 'lucide-react';
import { NAV_MATCH_RULES } from '../../utils/navMatch';

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const currentPath = routerState.location.pathname;

  const userNavItems = [
    { 
      label: 'My Tasks', 
      path: '/tasks', 
      icon: ListTodo,
      matchRule: NAV_MATCH_RULES.myTasks,
    },
    { 
      label: 'Department Pool', 
      path: '/department-pool', 
      icon: Users,
      matchRule: NAV_MATCH_RULES.departmentPool,
    },
    { 
      label: 'Create Task', 
      path: '/tasks/create', 
      icon: Briefcase,
      matchRule: NAV_MATCH_RULES.createTask,
    },
  ];

  const adminNavItems = [
    { 
      label: 'Master Data', 
      path: '/admin/masters', 
      icon: LayoutDashboard,
      matchRule: NAV_MATCH_RULES.adminMasters,
    },
    { 
      label: 'Form Builder', 
      path: '/admin/forms', 
      icon: FileText,
      matchRule: NAV_MATCH_RULES.adminForms,
    },
    { 
      label: 'Task Definitions', 
      path: '/admin/task-definitions', 
      icon: Settings,
      matchRule: NAV_MATCH_RULES.adminTaskDefinitions,
    },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Task Manager</span>
              <span className="text-xs text-muted-foreground">Low-code Platform</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavSection title="Tasks" items={userNavItems} currentPath={currentPath} onNavigate={navigate} />
          {!isAdminLoading && isAdmin && (
            <>
              <Separator className="my-2" />
              <NavSection title="Administration" items={adminNavItems} currentPath={currentPath} onNavigate={navigate} />
            </>
          )}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
          </div>
          <LoginButton />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
        <footer className="border-t bg-muted/30 px-6 py-4 text-center text-xs text-muted-foreground">
          © 2026. Built with love using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            caffeine.ai
          </a>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
