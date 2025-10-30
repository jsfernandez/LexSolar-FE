"use client"

import * as React from "react"
import { ChevronUp, Home, Search, User2, Building2, CheckCircle, ClipboardList, LayoutDashboard, CreditCard, HomeIcon, LayoutDashboardIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { getLocalStorageJSON } from "@/lib/utils"

export function AppSidebar({ currentUser, ...props }: React.ComponentProps<typeof Sidebar> & { currentUser?: any }) {
  // Obtener información real del usuario desde localStorage
  const [userInfo, setUserInfo] = React.useState<any>(null)
  const { user: authUser, logout } = useAuth()

  React.useEffect(() => {
    const user = getLocalStorageJSON<any>("currentUser")
    if (user) setUserInfo(user)
  }, [])

  // Preferir el usuario autenticado desde el backend, con fallback a localStorage o prop
  const user = authUser || userInfo || currentUser

  // Datos de navegación que dependen del usuario actual
  const data = React.useMemo(
    () => ({
      navMain: [
        {
          title: "Principal",
          items: [
            {
              title: "Dashboard",
              url: "/dashboard",
              icon: LayoutDashboardIcon,
            },
            {
              title: "Buscar Componentes",
              url: "/search-components",
              icon: Search,
            },
            // Solo mostrar "Verificar Instalación" para inspectores y empresas de grabado
            ...(user?.role === "inspector" || user?.role === "engraving"
              ? [
                  {
                    title: "Verificar Instalación",
                    url: "/verify-installation",
                    icon: CheckCircle,
                  },
                ]
              : []),
          ],
        },
        {
          title: "Gestión",
          items: [
            {
              title: "Mis Instalaciones",
              url: "/installations",
              icon: Building2,
            },
            {
              title: "Registrar Instalación",
              url: "/register-installation",
              icon: ClipboardList,
            },
            /*{
              title: "Mi Suscripción",
              url: "/subscription",
              icon: CreditCard,
            },*/
          ],
        },
        {
          title: "Cuenta",
          items: [
            {
              title: "Mi Perfil",
              url: "/profile",
              icon: User2,
            },
          ],
        },
      ],
    }),
    [user],
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white-600 text-black">
                  <HomeIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Sistema Solar</span>
                  <span className="truncate text-xs">Trazabilidad</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "Usuario"} />
                    <AvatarFallback className="rounded-lg">
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n?.[0] ?? "")
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || "Usuario"}</span>
                    <span className="truncate text-xs">{user?.email || "usuario@email.com"}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => {
                    try {
                      logout?.()
                    } catch {}
                    // Fallback para compatibilidad con el flujo legacy del LoginModal
                    localStorage.removeItem("currentUser")
                    window.location.href = "/"
                  }}
                >
                  <span className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
