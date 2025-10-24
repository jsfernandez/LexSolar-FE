"use client"

import { useParams } from "next/navigation"
import ComponentRegistryForm from "@/components/component-registry-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddComponentsPage() {
  const params = useParams()
  const installationId = params.id

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Agregar Componentes a Instalación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              ID de Instalación: {installationId}
            </p>
            <ComponentRegistryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}