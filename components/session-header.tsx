"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar, User, MessageCircle } from "lucide-react"

interface SessionHeaderProps {
  title: string
  subtitle?: string
  backUrl?: string
  showWhatsApp?: boolean
  userType?: "public" | "installer" | "inspector" | "engraving"
}

export default function SessionHeader({
  title,
  subtitle,
  backUrl = "/dashboard",
  showWhatsApp = true,
  userType = "installer",
}: SessionHeaderProps) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sessionDuration, setSessionDuration] = useState(0)

  useEffect(() => {
    // Actualizar hora cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simular duración de sesión (en minutos)
    const sessionStart = Date.now() - sessionDuration * 60000
    const sessionInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart) / 60000)
      setSessionDuration(elapsed)
    }, 60000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(sessionInterval)
    }
  }, [sessionDuration])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "public":
        return "Público"
      case "installer":
        return "Instalador"
      case "inspector":
        return "Fiscalizador"
      case "engraving":
        return "Certificadora"
      default:
        return "Usuario"
    }
  }

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "public":
        return "bg-blue-100 text-blue-800"
      case "installer":
        return "bg-green-100 text-green-800"
      case "inspector":
        return "bg-purple-100 text-purple-800"
      case "engraving":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = "56950362875" // Número de WhatsApp del soporte
    const message = encodeURIComponent(
  `Hola, necesito ayuda con el Sistema de Trazabilidad Fotovoltaica LexSolar. Estoy en la sección: ${title}. Mi tipo de usuario es: ${getUserTypeLabel(userType)}.`,
    )
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Lado izquierdo - Navegación y título */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = backUrl)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>

          {/* Centro - Información de sesión */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(currentTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <Badge className={getUserTypeColor(userType)}>{getUserTypeLabel(userType)}</Badge>
            </div>
            <div className="text-sm text-gray-500">Sesión: {sessionDuration}min</div>
          </div>

          {/* Lado derecho - WhatsApp */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium"
              onClick={() => router.push("/register")}
            >
              Registrarse
            </Button>
            {showWhatsApp && (
              <Button onClick={handleWhatsAppClick} className="bg-green-500 hover:bg-green-600 text-white" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Agente Virtual
              </Button>
            )}
          </div>
        </div>

        {/* Información móvil */}
        <div className="md:hidden pb-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(currentTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <Badge className={getUserTypeColor(userType)}>{getUserTypeLabel(userType)}</Badge>
            </div>
            <div className="text-sm text-gray-500">Sesión: {sessionDuration}min</div>
          </div>
        </div>
      </div>
    </div>
  )
}
