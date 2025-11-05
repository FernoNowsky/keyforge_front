"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  team,
  collapsed,
}: {
  team: {
    name: string
    logo: React.ReactNode;
    plan: string
  },
    collapsed: boolean;
}) {

   return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="w-fit px-1.5 h-[50px]">
          <div
            className={`-ml-0.5 bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square ${
              collapsed ? "size-5" : "size-8"
            } items-center justify-center rounded`}
          >
            <div>{team.logo}</div>
          </div>
          <span className={`truncate ml-2 ${collapsed ? "text-xl" : "text-2xl"} font-medium`}>
            {team.name}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}