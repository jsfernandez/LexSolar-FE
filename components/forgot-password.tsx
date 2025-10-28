"use client"

import { useState } from "react"
import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mail, Shield, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular envío de email
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsEmailSent(true)
    setIsLoading(false)
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <Shield className="h-10 w-10 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Sistema de Trazabilidad</h1>
                  <p className="text-sm text-gray-600">Componentes Fotovoltaicos</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <Image src="/images/logo-apolla.png" alt="LexSolar" width={120} height={60} className="h-12 w-auto" />
                <Image src="/images/logo-acesol.png" alt="ACESOL" width={140} height={60} className="h-12 w-auto" />
                <Image
                  src="/images/logo-ministerio-energia.png"
                  alt="Ministerio de Energía"
                  width={160}
                  height={60}
                  className="h-12 w-auto"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-12">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Enviado</h2>
                  <p className="text-gray-600 mb-6">
                    Hemos enviado las instrucciones para restablecer su contraseña a:
                  </p>
                  <p className="font-semibold text-blue-600 mb-6">{email}</p>
                  <p className="text-sm text-gray-500 mb-8">
                    Revise su bandeja de entrada y carpeta de spam. El enlace expirará en 24 horas.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/login">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver al Login
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 w-full">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Shield className="h-10 w-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Trazabilidad</h1>
                <p className="text-sm text-gray-600">Componentes Fotovoltaicos</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <Image src="/images/logo-apolla.png" alt="LexSolar" width={120} height={60} className="h-12 w-auto" />
              <Image src="/images/logo-acesol.png" alt="ACESOL" width={140} height={60} className="h-12 w-auto" />
              <Image
                src="/images/logo-ministerio-energia.png"
                alt="Ministerio de Energía"
                width={160}
                height={60}
                className="h-12 w-auto"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h2>
            <p className="text-gray-600">
              Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-center">Restablecer Contraseña</CardTitle>
              <CardDescription className="text-center">Ingrese el email asociado a su cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando instrucciones...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Instrucciones
                    </>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                    <ArrowLeft className="h-4 w-4 inline mr-1" />
                    Volver al login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <Alert className="mt-6 border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="font-semibold mb-1">Seguridad Garantizada</div>
              <p className="text-sm">El enlace de restablecimiento expirará en 24 horas por su seguridad.</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
