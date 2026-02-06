import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react';

type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

type NavSectionProps = {
  title: string;
  items: NavItem[];
  currentPath: string;
  onNavigate: (options: { to: string }) => void;
};

export default function NavSection({ title, items, currentPath, onNavigate }: NavSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton onClick={() => onNavigate({ to: item.path })} isActive={isActive}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
