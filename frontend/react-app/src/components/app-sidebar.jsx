import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame, GalleryThumbnailsIcon,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    FileDown
} from "lucide-react"

import { NavMain } from "@/components/custom/nav-main.jsx"
import { NavProjects } from "@/components/custom/nav-projects.jsx"
import { NavUser } from "@/components/custom/nav-user.jsx"
import { TeamSwitcher } from "@/components/custom/team-switcher.jsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "RAVIKIRAN",
    email: "ravikiran@example.com",
    avatar: "/avatars/ABC.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Ev Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Map View",
          url: "/map",
        },
        {
          title: "Live Dashboard",
          url: "/live",
        },
        {
          title: "Historical Dashboard",
          url: "/historical",
        },
      ],
    },
{
      title: "Reports",
      url: "#",
      icon: FileDown,
      isActive: true,
      items: [
        {
          title: "Standard Reports",
          url: "/reports-standard",
        },
        {
          title: "Custom Reports",
          url: "/reports-custom",
        }
      ],
    },
    {
      title: "Devices",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Inventory",
          url: "/inventory",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Organization",
          url: "/organization",
        },
        {
          title: "User Management",
          url: "user-management",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Product Info",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
        {
          title: "About",
          url: "/about",
        },
        {
          title: "Contact Us",
          url: "/contact",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}


export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
