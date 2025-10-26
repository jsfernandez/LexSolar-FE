"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { loginUser } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LoginValues {
  email: string
  password: string
  role_id?: number
}

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ mode: "onTouched" })

  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await loginUser(values.email, values.password)
      const token = res?.access_token || res?.token
      if (!token) throw new Error("Token no recibido")
      await login(token)
      router.push("/dashboard")
    } catch (err: any) {
      toast({ title: "Error de inicio de sesión", description: err?.message || "Intente nuevamente.", variant: "destructive" })
    }
  }

  return (
    <main className="flex justify-center items-center min-h-[80vh] w-full p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Use sus credenciales para acceder al sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                disabled={isSubmitting}
                {...register("email", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
              />
              {errors.email && <p className="text-red-500 text-sm">Correo inválido</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isSubmitting}
                {...register("password", { required: true, minLength: 6 })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">La contraseña es obligatoria (mínimo 6 caracteres)</p>
              )}
            </div>

            {/* Selección de Rol (alineada con RegisterForm). Guardaremos esta selección para futuras validaciones backend */}
            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuario</Label>
              <Select
                disabled={isSubmitting}
                onValueChange={(value) => setValue("role_id", Number(value), { shouldValidate: true })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Seleccionar tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  {/* Fiscalizador (actualmente disponible) */}
                  <SelectItem value="3">Fiscalizador</SelectItem>
                  {/* Implementador: placeholder para activar cuando esté disponible */}
                  {/* <SelectItem value="1">Implementador</SelectItem> */}
                  {/* Otros roles futuros: descomentar cuando el backend los habilite */}
                  {/* <SelectItem value="2">Empresa Instaladora</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
