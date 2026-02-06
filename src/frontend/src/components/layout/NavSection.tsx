import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react';
import { isNavItemActive, type NavMatchRule } from '../../utils/navMatch';

type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  matchRule?: NavMatchRule;
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
            const isActive = isNavItemActive(currentPath, item.path, item.matchRule);
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
