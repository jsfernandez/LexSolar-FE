"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react"

interface LoginValues {
  email: string
  password: string
  role_id?: number
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ mode: "onTouched" })

  const onSubmit = async (values: LoginValues) => {
    setErrorMessage(null) // Limpiar error anterior
    
    try {
      // 1. Autenticar usando el AuthProvider (maneja token y perfil internamente)
      //await login({ email: values.email, password: values.password })
      // 2. Redirección la hace el provider; dejamos un fallback por si cambia la implementación
      router.push("/dashboard")
    } catch (err: any) {
      // Manejar diferentes tipos de errores
      let message = "Intente nuevamente."
      
      if (err?.response?.status === 401) {
        message = "Credenciales incorrectas. Verifique su correo y contraseña."
      } else if (err?.response?.status === 404) {
        message = "La cuenta no existe. Por favor regístrese."
      } else if (err?.response?.status === 403) {
        message = "Cuenta inactiva o sin permisos."
      } else if (err?.message) {
        message = err.message
      }

      setErrorMessage(message)
      
      
    }
  }

  return (
    <main className="flex justify-center items-center min-h-[80vh] w-full p-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Use sus credenciales para acceder al sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Alert de error */}
            {errorMessage && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  disabled={isSubmitting}
                  className="pl-10"
                  {...register("email", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">Correo inválido</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="pl-10 pr-10"
                  {...register("password", { required: true, minLength: 6 })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">La contraseña es obligatoria (mínimo 6 caracteres)</p>
              )}
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
                  {/* Implementador (único rol habilitado actualmente) */}
                  <SelectItem value="1">Implementador</SelectItem>
                  {/* Otros roles futuros: descomentar cuando el backend los habilite */}
                  {/* <SelectItem value="2">Empresa Instaladora</SelectItem> */}
                  {/* <SelectItem value="3">Fiscalizador</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>

            <Separator className="my-4" />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
 

