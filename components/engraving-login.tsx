"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Wrench, Shield, Lock, Mail } from 'lucide-react'

export default function EngravingLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simular autenticación
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Validar credenciales específicas
    if (loginData.username === "certificadora" && loginData.password === "grabado2024") {
      window.location.href = "/engraving-dashboard"
    } else {
      setError("Credenciales incorrectas. Verifique su usuario y contraseña.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 w-full">
      {/* Header Institucional */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Wrench className="h-10 w-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Empresa Certificadora</h1>
                <p className="text-sm text-gray-600">Grabado de Números de Serie</p>
              </div>
            </div>

            {/* Logos Institucionales */}
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
      <div className="w-full px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
          {/* Columna Izquierda - Información */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Banner de Bienvenida */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg border border-gray-100">
                <Wrench className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Acceso Certificadora</h2>
              <p className="text-xl text-gray-600 mb-8">Sistema especializado para grabado de números de serie</p>
              
              {/* Información de Seguridad */}
              <Alert className="border-orange-200 bg-orange-50 text-left">
                <Shield className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <div className="font-semibold mb-1">Acceso Restringido</div>
                  <p className="text-sm">
                    Este sistema está destinado exclusivamente para la empresa certificadora autorizada para el grabado de
                    números de serie en componentes fotovoltaicos.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Columna Derecha - Formulario de Login */}
          <div className="flex flex-col justify-center">
            {/* Tarjeta de Login */}
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm w-full max-w-md mx-auto lg:mx-0">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
                <CardDescription className="text-center">
                  Acceso exclusivo para empresa certificadora autorizada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuario</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="certificadora"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
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

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <Shield className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verificando acceso...
                      </>
                    ) : (
                      <>
                        <Wrench className="h-4 w-4 mr-2" />
                        Acceder al Sistema
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => (window.location.href = "/")}
                    >
                      Volver al Login Principal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Credenciales de Prueba */}
            <Alert className="mt-6 border-blue-200 bg-blue-50 w-full max-w-md mx-auto lg:mx-0">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="font-semibold mb-1">Credenciales de Acceso</div>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Usuario:</strong> certificadora
                  </p>
                  <p>
                    <strong>Contraseña:</strong> grabado2024
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200 py-8 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              Sistema oficial de certificación respaldado por las principales instituciones del sector energético
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
    </div>
  )
}
