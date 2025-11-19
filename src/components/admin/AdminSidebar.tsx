import { useState } from "react";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Settings,
} from "lucide-react";
import { SidebarUser } from "./SidebarUser";
import { TeamSwitcher } from "./SidebarCompany";
import Logo from "@/assets/logo_keyforge.png";
import { useAuth } from "@/hooks/useAuthToken";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
}: AppSidebarProps) {
  // Track if the sidebar is collapsed
  const [collapsed, setCollapsed] = useState(false);
  const {username, email} = useAuth()
  const user = {
    name: username,
    email: email,
    avatar: "/avatars/shadcn.jpg",
  };

  const team = {
    name: "KeyForge",
    logo: <img src={Logo} alt="Logo" />,
    plan: "Enterprise",
  };

  const menuItems = [
    {
      title: "Przegląd",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          value: "dashboard",
        },
      ],
    },
    {
      title: "Zarządzanie",
      items: [
        {
          title: "Produkty",
          icon: Package,
          value: "products",
        },
        {
          title: "Opinie użytkowników",
          icon: MessageSquare,
          value: "reviews",
        },
      ],
    },
    {
      title: "Konfiguracja",
      items: [
        {
          title: "Ustawienia",
          icon: Settings,
          value: "settings",
        },
      ],
    },
  ];

  const handleSidebarToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-r border-[#3A3A3A] bg-[#2A2A2A]"
      >
        <SidebarHeader>
          <TeamSwitcher team={team} collapsed={collapsed} />
        </SidebarHeader>
        <SidebarContent>
          {menuItems.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-[#A0A0A0] text-xs uppercase tracking-wider px-6">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        asChild
                        isActive={activeTab === item.value}
                        className={`w-full ${
                          activeTab === item.value
                            ? "bg-[#D4A44A] text-black hover:bg-[#D4A44A]"
                            : "text-[#F8F8F8] hover:bg-[#3A3A3A]"
                        }`}
                      >
                        <button
                          onClick={() => setActiveTab(item.value)}
                          className="flex w-full items-center gap-3"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarUser user={user} collapsed={collapsed}/>
        </SidebarFooter>
      </Sidebar>
      <SidebarTrigger className="ml-2 -translate-y-1.75 h-[32px] w-[32px]" onClick={handleSidebarToggle} />
    </SidebarProvider>
  );
}
