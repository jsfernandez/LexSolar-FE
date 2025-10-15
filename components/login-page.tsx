"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Shield, User, Building2, UserCheck, Lock, Mail, Search, Wrench } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SessionHeader from "@/components/session-header"
import WhatsAppAgent from "@/components/whatsapp-agent"
import { mockApi } from "@/lib/mock-data"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    userType: "public",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log('Login attempt:', loginData)
      
      // Usar la API mock para autenticación
      const user = await mockApi.authenticate(loginData.email, loginData.password, loginData.userType)
      
      if (user) {
        console.log('Login successful:', user)
        // Guardar usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(user))
        // Redirigir al dashboard
        window.location.href = "/dashboard"
      } else {
        console.log('Login failed')
        setError("Credenciales incorrectas. Verifique su email, contraseña y tipo de usuario.")
      }
    } catch (error) {
      console.error('Error during authentication:', error)
      setError("Error de conexión. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const userTypes = [
    {
      id: "public",
      title: "Acceso Público",
      description: "Consulta y verificación de componentes",
      icon: User,
      color: "blue",
    },
    {
      id: "installer",
      title: "Empresa Instaladora",
      description: "Registro de instalaciones y gestión",
      icon: Building2,
      color: "green",
    },
    {
      id: "inspector",
      title: "Fiscalizador",
      description: "Supervisión y control oficial",
      icon: UserCheck,
      color: "purple",
    },
  ]

  // Credenciales de ejemplo para mostrar al usuario
  const exampleCredentials = {
    public: { email: "maria.gonzalez@email.com", password: "public123" },
    installer: { email: "carlos.mendoza@solartech.cl", password: "installer123" },
    inspector: { email: "ana.torres@sec.gob.cl", password: "inspector123" }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Session Header */}
      <SessionHeader
        title="Sistema de Trazabilidad Fotovoltaica"
        subtitle="Acceso al sistema oficial"
        backUrl="#"
        showWhatsApp={false}
        userType="public"
      />

      {/* Header Institucional */}
      <header className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Shield className="h-10 w-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Trazabilidad</h1>
                <p className="text-sm text-gray-600">Componentes Fotovoltaicos</p>
              </div>
            </div>

            {/* Logos Institucionales Proporcionales */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo-apolla.png"
                  alt="ApollA - Unidos, protegemos tu energía"
                  width={200}
                  height={80}
                  className="h-16 w-auto"
                  priority
                />
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo-acesol.png"
                  alt="ACESOL - Asociación Chilena de Energía Solar"
                  width={140}
                  height={60}
                  className="h-12 w-auto"
                  priority
                />
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo-ministerio-energia.png"
                  alt="Ministerio de Energía - Gobierno de Chile"
                  width={160}
                  height={60}
                  className="h-12 w-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Columna Izquierda - Información y Accesos Rápidos */}
          <div className="space-y-8">
            {/* Banner de Bienvenida */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg border border-gray-100">
                <Image
                  src="/images/logo-apolla.png"
                  alt="ApollA"
                  width={80}
                  height={40}
                  className="h-12 w-auto"
                  priority
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a ApollA</h2>
              <p className="text-gray-600">Acceda al Sistema Oficial de Trazabilidad de Componentes Fotovoltaicos</p>
            </div>

            {/* Accesos Rápidos */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Accesos Rápidos</h3>
                  <p className="text-sm text-gray-600 mb-4">Acceda directamente a funciones específicas del sistema</p>
                </div>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/public-search">
                      <Search className="h-4 w-4 mr-2" />
                      Consulta Pública de Componentes
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/engraving-login">
                      <Wrench className="h-4 w-4 mr-2" />
                      Acceso Empresa Certificadora
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Información de Seguridad */}
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="font-semibold mb-1">Sistema Seguro y Certificado</div>
                <p className="text-sm">
                  Plataforma oficial respaldada por el Ministerio de Energía, ACESOL y ApollA. Todos los datos están
                  protegidos con encriptación de nivel bancario.
                </p>
              </AlertDescription>
            </Alert>
          </div>

          {/* Columna Derecha - Formulario de Login */}
          <div className="w-full">
            {/* Tarjeta de Login */}
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
                <CardDescription className="text-center">
                  Seleccione su tipo de usuario e ingrese sus credenciales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="public" className="space-y-6">
                  {/* Selector de Tipo de Usuario */}
                  <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                    {userTypes.map((type) => (
                      <TabsTrigger
                        key={type.id}
                        value={type.id}
                        className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        onClick={() => setLoginData({ ...loginData, userType: type.id })}
                      >
                        <type.icon className={`h-5 w-5 text-${type.color}-600`} />
                        <div className="text-center">
                          <div className="font-medium text-xs">{type.title}</div>
                        </div>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Formularios de Login */}
                  {userTypes.map((type) => (
                    <TabsContent key={type.id} value={type.id} className="space-y-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <type.icon className={`h-8 w-8 text-${type.color}-600 mx-auto mb-2`} />
                        <h3 className="font-semibold text-gray-900">{type.title}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>

                      {/* Credenciales de ejemplo */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-800 font-medium mb-1">Credenciales de prueba:</p>
                        <p className="text-xs text-yellow-700">
                          Email: {exampleCredentials[type.id as keyof typeof exampleCredentials].email}
                        </p>
                        <p className="text-xs text-yellow-700">
                          Contraseña: {exampleCredentials[type.id as keyof typeof exampleCredentials].password}
                        </p>
                      </div>

                      {error && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertDescription className="text-red-800">
                            {error}
                          </AlertDescription>
                        </Alert>
                      )}

                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo Electrónico</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="usuario@email.com"
                              value={loginData.email}
                              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Contraseña</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              className="pl-10 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Verificando credenciales...
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Acceder al Sistema
                            </>
                          )}
                        </Button>
                      </form>

                      <div className="space-y-3">
                        <Separator />
                        <div className="flex items-center justify-between text-sm">
                          <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 hover:underline">
                            ¿Olvidó su contraseña?
                          </Link>
                          {type.id === "installer" && (
                            <Link
                              href="/register-company"
                              className="text-green-600 hover:text-green-700 hover:underline"
                            >
                              Registrar empresa
                            </Link>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer con Logos */}
      <footer className="w-full bg-white/95 backdrop-blur-sm border-t border-gray-200 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              Sistema oficial respaldado por las principales instituciones del sector energético chileno
            </p>
            <div className="flex items-center justify-center gap-12">
              <div className="text-center">
                <Image
                  src="/images/logo-apolla.png"
                  alt="ApollA"
                  width={160}
                  height={60}
                  className="h-14 w-auto mx-auto mb-2"
                />
                <p className="text-xs text-gray-500">Protección Energética</p>
              </div>
              <div className="text-center">
                <Image
                  src="/images/logo-acesol.png"
                  alt="ACESOL"
                  width={120}
                  height={50}
                  className="h-10 w-auto mx-auto mb-2"
                />
                <p className="text-xs text-gray-500">Asociación Chilena de Energía Solar</p>
              </div>
              <div className="text-center">
                <Image
                  src="/images/logo-ministerio-energia.png"
                  alt="Ministerio de Energía"
                  width={140}
                  height={50}
                  className="h-12 w-auto mx-auto mb-2"
                />
                <p className="text-xs text-gray-500">Gobierno de Chile</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Agent */}
      <WhatsAppAgent userType="public" currentPage="login" />
    </div>
  )
}
