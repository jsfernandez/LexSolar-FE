"use client"

import * as React from "react"
import { getLocalStorageJSON } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import InstallationsPage from "@/app/installations/page"

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = React.useState<any>(null)

  React.useEffect(() => {
    // Cargar usuario actual de forma segura
    const user = getLocalStorageJSON<any>('currentUser')
    if (user) setCurrentUser(user)
  }, [])

  // Permitir acceso sin usuario autenticado: renderizar siempre el dashboard.

  return (
    <div className="flex min-h-screen w-full bg-transparent">
      <AppSidebar currentUser={currentUser ?? undefined} />
      <SidebarInset className="flex-1 w-full">        

        {/* Contenedor principal con padding y ancho máximo centrado.
            Evita que el contenido parezca un iframe al ocupar todo el ancho
            y eliminar bordes fuertes alrededor del contenido. */}
        <main className="flex-1 w-full overflow-auto p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <InstallationsPage />
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}
