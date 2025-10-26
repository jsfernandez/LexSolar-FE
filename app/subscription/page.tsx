"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, CreditCardIcon, ArrowLeft } from "lucide-react"
// importación eliminada
import { useRouter } from "next/navigation"
import { getLocalStorageJSON } from "@/lib/utils"
import { mockApi } from "@/lib/mock-data"

const PLAN_LIMITS: Record<string, number> = {
  Free: 1,
  Basica: 5,
  Pro: 25,
  Experto: 100,
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [installations, setInstallations] = useState<any[]>([])
  const [plan, setPlan] = useState<string>("Free")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const u = getLocalStorageJSON<any>("currentUser")
    if (u) {
      setCurrentUser(u)
      setPlan(u?.subscription?.plan ?? "Free")
    }
    // Cargar instalaciones (para calcular uso)
    mockApi
      .getInstallations()
      .then(setInstallations)
      .catch(() => setInstallations([]))
  }, [])

  const usedByInstaller = useMemo(() => {
    if (!currentUser?.company) return 0
    return installations.filter((i) => i.installer?.company === currentUser.company).length
  }, [installations, currentUser?.company])

  const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS["Free"]
  const remaining = Math.max(0, limit - usedByInstaller)

  function saveUser(nextPlan: string) {
    if (!currentUser) return
    const updated = {
      ...currentUser,
      subscription: { ...(currentUser.subscription || {}), plan: nextPlan },
    }
    localStorage.setItem("currentUser", JSON.stringify(updated))
    setCurrentUser(updated)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => router.back()} aria-label="Volver" className="px-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Volver</span>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mi Suscripción</h1>
          <p className="text-sm text-muted-foreground">Administra tu plan y tus pagos</p>
        </div>
        <Badge variant="secondary" className="text-base">
          Plan actual: {currentUser?.subscription?.plan ?? "Free"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de la Suscripción</CardTitle>
          <CardDescription>Resumen del uso y cupos disponibles</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="rounded border p-4">
            <p className="text-xs text-muted-foreground">Plan</p>
            <p className="text-lg font-semibold">{currentUser?.subscription?.plan ?? "Free"}</p>
          </div>
          <div className="rounded border p-4">
            <p className="text-xs text-muted-foreground">Instalaciones usadas</p>
            <p className="text-lg font-semibold">{usedByInstaller}</p>
          </div>
          <div className="rounded border p-4">
            <p className="text-xs text-muted-foreground">Restantes</p>
            <p className="text-lg font-semibold">
              {Math.max(0, (PLAN_LIMITS[currentUser?.subscription?.plan ?? "Free"] ?? 1) - usedByInstaller)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar de Plan</CardTitle>
          <CardDescription>Selecciona un plan y confirma para actualizar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Plan</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona un plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free (1)</SelectItem>
                  <SelectItem value="Basica">Básica (5)</SelectItem>
                  <SelectItem value="Pro">Pro (25)</SelectItem>
                  <SelectItem value="Experto">Experto (100)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded border p-4">
              <p className="text-xs text-muted-foreground">Cupo del plan seleccionado</p>
              <p className="text-lg font-semibold">
                {limit} instalaciones • Restantes con tu uso actual: {remaining}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={async () => {
                setIsProcessing(true)
                setTimeout(() => {
                  saveUser(plan)
                  setIsProcessing(false)
                  alert("Tu suscripción ha sido actualizada.")
                }, 800)
              }}
              disabled={isProcessing}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Actualizar Suscripción
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsProcessing(true)
                setTimeout(() => {
                  setIsProcessing(false)
                  alert("Pago procesado correctamente.")
                }, 800)
              }}
              disabled={isProcessing}
            >
              <CreditCardIcon className="w-4 h-4 mr-2" />
              Pagar Suscripción
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("¿Deseas darte de baja? Se establecerá el plan Free.")) {
                  saveUser("Free")
                  alert("Te has dado de baja. Ahora estás en el plan Free.")
                }
              }}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Darse de baja
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="text-xs text-muted-foreground">
            Nota: Estas acciones son de demostración. En un entorno productivo se conectan a un procesador de pagos y
            gestión de suscripciones.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
