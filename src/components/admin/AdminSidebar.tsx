import { 
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, 
  Settings, Truck, CreditCard, Store 
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Produtos", url: "/admin/produtos", icon: Package },
  { title: "Pedidos", url: "/admin/pedidos", icon: ShoppingCart },
  { title: "Clientes", url: "/admin/clientes", icon: Users },
  { title: "Relatórios", url: "/admin/relatorios", icon: BarChart3 },
];

const operationItems = [
  { title: "Envios", url: "/admin/envios", icon: Truck },
  { title: "Pagamentos", url: "/admin/pagamentos", icon: CreditCard },
  { title: "Configurações", url: "/admin/configuracoes", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <NavLink to="/admin" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Store className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold text-sidebar-primary-foreground tracking-tight">
              MinhaLoja
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Operação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <NavLink to="/loja" className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-sm text-sidebar-accent-foreground transition-colors hover:bg-sidebar-accent/80">
            <Store className="h-4 w-4" />
            Ver minha loja
          </NavLink>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
