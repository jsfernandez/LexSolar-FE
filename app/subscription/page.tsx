"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, CreditCardIcon, ArrowLeft, Sun, Shield, Handshake } from "lucide-react"
// importación eliminada
import { useRouter } from "next/navigation"
import { getLocalStorageJSON } from "@/lib/utils"
import { mockApi } from "@/lib/mock-data"

const PLAN_LIMITS: Record<string, number> = {
  Free: 2,
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

  // Animations similar to dashboard
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Top bar with prominent back/exit to avoid feeling locked-in */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
  
          <Button
            onClick={() => router.push("/dashboard")}
            aria-label="Salir a Dashboard"
            className="h-11 px-6 text-base rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
          ><ArrowLeft className="w-5 h-5 mr-2" />
            Volver a Dashboard
          </Button>
        </div>
        <Badge variant="secondary" className="text-sm md:text-base">
          Plan actual: {currentUser?.subscription?.plan ?? "Free"}
        </Badge>
      </motion.div>

      {/* Warm header matching dashboard palette */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm"
      >
        <div className="flex items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Handshake className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">Mi Suscripción</h1>
              <p className="text-slate-600">Gestiona tu plan cuando quieras.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status overview */}
      <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Plan</p>
              <p className="text-lg font-semibold">{currentUser?.subscription?.plan ?? "Free"}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Instalaciones usadas</p>
              <p className="text-lg font-semibold">{usedByInstaller}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Restantes</p>
              <p className="text-lg font-semibold">
                {Math.max(0, (PLAN_LIMITS[currentUser?.subscription?.plan ?? "Free"] ?? 1) - usedByInstaller)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Change plan section */}
      <motion.div variants={itemVariants}>
        <Card className="transition-transform duration-200 hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle>Elige o ajusta tu plan</CardTitle>
            <CardDescription>Cuando te acomode. Puedes seguir con tu plan actual sin problemas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
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
              <div className="rounded-xl border p-4 bg-slate-50">
                <p className="text-xs text-muted-foreground">Cupo del plan seleccionado</p>
                <p className="text-lg font-semibold">
                  {limit} instalaciones • Restantes con tu uso actual: {remaining}
                </p>
              </div>
            </div>

            {/* Light, reassuring benefits */}
            <div className="grid md:grid-cols-2 gap-2">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <Shield className="w-4 h-4 text-amber-700 mt-0.5" />
                <span className="text-sm text-slate-700">Seguridad y trazabilidad para tus instalaciones</span>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <CheckCircle className="w-4 h-4 text-amber-700 mt-0.5" />
                <span className="text-sm text-slate-700">Puedes cambiar de plan cuando quieras</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-amber-600 hover:bg-amber-700"
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
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
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

            <Separator className="my-2" />

            <div className="text-xs text-muted-foreground">
              Nota: Estas acciones son de demostración. En producción se conectan a un procesador de pagos y gestión de
              suscripciones.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
