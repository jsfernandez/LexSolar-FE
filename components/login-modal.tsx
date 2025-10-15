"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, LogIn } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

type Role = "public" | "installer" | "inspector"

export default function LoginModalButton() {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<Role>("installer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const demoByRole = useMemo(
    () => ({
      public: { email: "public@demo.cl", password: "demo1234" },
      installer: { email: "installer@acme.cl", password: "demo1234" },
      inspector: { email: "inspector@energia.cl", password: "demo1234" },
    }),
    [],
  )

  useEffect(() => {
    // Opcional: precargar email cuando cambia el rol si los campos están vacíos
    if (!email && !password) {
      const d = demoByRole[role]
      setEmail(d.email)
      setPassword(d.password)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  function fillDemo() {
    const d = demoByRole[role]
    setEmail(d.email)
    setPassword(d.password)
    toast({
      title: "Credenciales de demo cargadas",
      description: `Rol: ${role}`,
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast({
        title: "Faltan datos",
        description: "Completa email y contraseña.",
        variant: "destructive",
      })
      return
    }
    try {
      setIsLoading(true)
      // Simulación de login local (mantiene compatibilidad con el resto del sistema)
      const nameFromEmail = email.split("@")[0]
      const user = {
        email,
        name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        role,
        token: "demo-token",
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(user))
      }
      toast({ title: "Acceso concedido", description: "Redirigiendo…" })
      setTimeout(() => {
        router.push("/dashboard")
        setOpen(false)
      }, 400)
    } catch (err) {
      toast({
        title: "No se pudo iniciar sesión",
        description: "Inténtalo nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <LogIn className="h-4 w-4" />
          Iniciar sesión
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Acceso al sistema</DialogTitle>
          <DialogDescription className="text-xs">
            Ingresa con tu cuenta de público, instalador o fiscalizador.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Tipo de usuario</Label>
            <Select value={role} onValueChange={(v: Role) => setRole(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Público</SelectItem>
                <SelectItem value="installer">Instalador</SelectItem>
                <SelectItem value="inspector">Fiscalizador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.cl"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={fillDemo}
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
            >
              Rellenar demo
            </Button>
            <Link href="/forgot-password" className="text-xs text-slate-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <DialogFooter className="pt-1">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Entrando…
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </DialogFooter>
        </form>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Al continuar aceptas que tus datos podrán ser verificados por un fiscalizador en conformidad a la normativa
          vigente.
        </p>
      </DialogContent>
    </Dialog>
  )
}
