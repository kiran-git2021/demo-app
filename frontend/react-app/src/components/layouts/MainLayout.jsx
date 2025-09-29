import {useState} from "react"
import {Outlet, useLocation, Link} from "react-router-dom"
import {Bell} from "lucide-react"
import { ThemeControlButton,ThemeControlDropDown } from "@/components/ui/mode-toggle-theme"
import {AppSidebar} from "@/components/app-sidebar"
import {SidebarProvider, SidebarInset, SidebarTrigger} from "@/components/ui/sidebar"
import {Separator} from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import FooterCentered from './footer'

export default function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    // Example: unread notifications count (replace with API later)
    const [unreadCount, setUnreadCount] = useState(3)

    // Get current route
    const location = useLocation()
    const pathnames = location.pathname.split("/").filter((x) => x)

    return (
        <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <AppSidebar/>
            <SidebarInset>
                {/* Header */}
                <header
                    className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        {/* Toggle sidebar */}
                        <SidebarTrigger
                            className="-ml-1"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />

                        {/* Dynamic Breadcrumb */}
                        <Breadcrumb>
                            <BreadcrumbList>
                                {/* Always show Dashboard root */}
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/home">Dashboard</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                {pathnames.length > 0 && <BreadcrumbSeparator/>}

                                {pathnames.map((name, index) => {
                                    const routeTo = "/" + pathnames.slice(0, index + 1).join("/")
                                    const isLast = index === pathnames.length - 1

                                    return (
                                        <BreadcrumbItem key={name}>
                                            {isLast ? (
                                                <BreadcrumbPage>
                                                    {name.charAt(0).toUpperCase() + name.slice(1)}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link to={routeTo}>
                                                        {name.charAt(0).toUpperCase() + name.slice(1)}
                                                    </Link>
                                                </BreadcrumbLink>
                                            )}
                                            {!isLast && <BreadcrumbSeparator/>}
                                        </BreadcrumbItem>
                                    )
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {/* Right side - Notification */}
                    <div className="flex items-center pr-4">
                        <ThemeControlButton/>
                        <ThemeControlDropDown/>
                       <Link to="/notifications">
      <button className="relative p-2 rounded-full hover:bg-muted">
        {/* Bell icon with chat color */}
        <Bell className="h-5 w-5" style={{ color: "var(--chat1)" }} />

        {/* Red dot for unread count */}
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 block h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--chat1)" }}
          />
        )}
      </button>
    </Link>

                    </div>
                </header>
                {/* Page Content */}
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

                    <Outlet/>
                </div>
                <FooterCentered/>
            </SidebarInset>
        </SidebarProvider>
    )
}
