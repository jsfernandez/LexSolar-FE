"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, CheckCircle, MapPin, User, Zap } from "lucide-react"
// importación eliminada
import { useToast } from "@/hooks/use-toast"

type VerificationState = {
  inspector: string
  date: string
  status: "approved" | "rejected" | "pending"
  comments: string
}

type UserSession = {
  id: string
  name: string
  email: string
  role: string
  company?: string
} | null

export default function VerifyInstallationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [installations, setInstallations] = useState<Installation[]>([])
  const [selected, setSelected] = useState<Installation | null>(null)
  const [currentUser, setCurrentUser] = useState<UserSession>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState<VerificationState>({
    inspector: "",
    date: new Date().toISOString().split("T")[0],
    status: "approved",
    comments: "",
  })

  // Buscar installationId de la URL
  const installationId = useMemo(() => searchParams.get("installationId") || "", [searchParams])

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        // usuario actual
        const userRaw = localStorage.getItem("currentUser")
        if (userRaw) {
          const u = JSON.parse(userRaw)
          setCurrentUser(u)
          setForm((prev) => ({
            ...prev,
            inspector: prev.inspector || u?.name || "",
          }))
        }
        // instalaciones
  // TODO: Reemplazar por llamada real a la API
        setInstallations(data)

        if (installationId) {
          const found = data.find((i) => i.id === installationId)
          if (found) {
            setSelected(found)
          }
        }
      } catch (e) {
        console.error("Error loading verify-installation:", e)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [installationId])

  const handleSelectInstallation = (id: string) => {
    const found = installations.find((i) => i.id === id) || null
    setSelected(found)
    if (found) {
      // Actualiza la URL con el id seleccionado
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      params.set("installationId", found.id)
      router.replace(`/verify-installation?${params.toString()}`)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) {
      toast({ title: "Seleccione una instalación", description: "Debe elegir una instalación para verificar." })
      return
    }
    try {
      setIsSubmitting(true)
      // Proceso simulado de verificación (se podría persistir en backend)
      await new Promise((r) => setTimeout(r, 900))

      // Nota: evitamos mutar otros estados del sistema; solo simulamos éxito
      toast({
        title: "Verificación enviada",
        description: `La instalación "${selected.systemName}" fue procesada con estado: ${form.status}.`,
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Error al verificar",
        description: "Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Verificar Instalación</h1>
          <p className="text-muted-foreground">
            Complete los datos para registrar la verificación de una instalación fotovoltaica.
          </p>
        </div>
        {currentUser?.role && (
          <Badge variant="outline" className="text-xs">
            Rol: {currentUser.role}
          </Badge>
        )}
      </div>

      {/* Selección de instalación si no viene en la URL */}
      {!selected && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Seleccionar instalación</CardTitle>
            <CardDescription>Elija una instalación para continuar con la verificación.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Instalación</Label>
                <Select onValueChange={handleSelectInstallation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una instalación" />
                  </SelectTrigger>
                  <SelectContent>
                    {installations.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.systemName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detalle de instalación seleccionada + formulario */}
      {selected && (
        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selected.systemName}
                <Badge variant="outline" className="ml-2">
                  ID: {selected.id}
                </Badge>
              </CardTitle>
              <CardDescription>Revise los datos y complete la verificación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumen instalación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Cliente:</span>
                  <span>{selected.client.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">Instalador:</span>
                  <span>{selected.installer.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Ubicación:</span>
                  <span>{selected.location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="font-medium">Potencia:</span>
                  <span>{selected.totalPower}</span>
                </div>
                {selected.inspectionDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Última inspección:</span>
                    <span>{new Date(selected.inspectionDate).toLocaleDateString("es-CL")}</span>
                  </div>
                )}
              </div>

              {/* Formulario verificación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inspector">Inspector</Label>
                  <Input
                    id="inspector"
                    value={form.inspector}
                    onChange={(e) => setForm((p) => ({ ...p, inspector: e.target.value }))}
                    placeholder="Nombre del inspector"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Fecha de inspección</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v: "approved" | "pending" | "rejected") => setForm((p) => ({ ...p, status: v }))}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Aprobado</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="rejected">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="comments">Comentarios</Label>
                  <Textarea
                    id="comments"
                    rows={4}
                    placeholder="Ingrese observaciones de la inspección..."
                    value={form.comments}
                    onChange={(e) => setForm((p) => ({ ...p, comments: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // limpiar selección y volver al selector
                    setSelected(null)
                    const params = new URLSearchParams(Array.from(searchParams.entries()))
                    params.delete("installationId")
                    router.replace(`/verify-installation${params.size ? `?${params.toString()}` : ""}`)
                  }}
                >
                  Cambiar instalación
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enviar verificación
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </main>
  )
}
