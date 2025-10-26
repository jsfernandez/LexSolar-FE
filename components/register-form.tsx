"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { registerUser, loginUser } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type RegisterValues = {
  name: string
  email: string
  password: string
  phone: string
  role_id: number
}

export default function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterValues>({ mode: "onTouched" })

  // Registrar el campo de rol para validación aunque se maneje con Select
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _roleReg = ((): void => {
    // Registrar una sola vez por render
    // react-hook-form permite registrar campos sin asignarlos a un input directamente
    // para poder validar valores seteados via setValue
    // Al estar en render, se asegura el registro antes del submit
    // Nota: no interfiere con otros registros
    try {
      // @ts-ignore - register acepta este uso
      register("role_id", { required: true })
    } catch {}
  })()

  const onSubmit = async (values: RegisterValues) => {
    try {
      await registerUser(values)
      // Intento de login automático con las mismas credenciales
      try {
        const auth = await loginUser(values.email, values.password)
        const token = auth?.access_token || auth?.token
        if (token) {
          await login(token)
          toast({ title: "Bienvenido", description: "Registro y acceso exitoso." })
          router.push("/dashboard")
          return
        }
        // Si no hay token, caer al flujo normal
        toast({ title: "Registro exitoso", description: "Inicia sesión para continuar." })
        reset()
        router.push("/login")
      } catch (e) {
        // Si falla el login automático pero el registro fue exitoso
        toast({ title: "Registro exitoso", description: "Inicia sesión para continuar." })
        reset()
        router.push("/login")
      }
    } catch (err: any) {
      const message = err?.message || "Error al registrarse. Intente nuevamente."
      toast({ title: "Error de registro", description: message, variant: "destructive" })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Complete los campos para registrarse.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Tu nombre"
              disabled={isSubmitting}
              {...register("name", { required: true, minLength: 2 })}
            />
            {errors.name && <p className="text-red-500 text-sm">El nombre es obligatorio (mínimo 2 caracteres)</p>}
          </div>

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
            {errors.password && <p className="text-red-500 text-sm">La contraseña es obligatoria (mínimo 6 caracteres)</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+56 9 1234 5678"
              disabled={isSubmitting}
              {...register("phone", { required: true, pattern: /^[+]?[\d\s()-]{7,}$/ })}
            />
            {errors.phone && <p className="text-red-500 text-sm">Teléfono inválido u obligatorio</p>}
          </div>

          {/* Selección de Rol */}
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
              </SelectContent>
            </Select>
            {errors.role_id && <p className="text-red-500 text-sm">Debe seleccionar un tipo de usuario</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
