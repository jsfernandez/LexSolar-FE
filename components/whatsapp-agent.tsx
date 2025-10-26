"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, X, Send, Phone, Mail, ExternalLink, Clock, User, Building2, Shield, FileText, Search, Zap, AlertTriangle } from 'lucide-react'

interface WhatsAppAgentProps {
  userType?: "public" | "installer" | "inspector" | "engraving"
  currentPage?: string
}

interface QuickResponse {
  id: string
  text: string
  category: string
}

export default function WhatsAppAgent({ 
  userType = "public", 
  currentPage = "dashboard" 
}: WhatsAppAgentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Actualizar tiempo cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "public":
        return "Usuario Público"
      case "installer":
        return "Empresa Instaladora"
      case "inspector":
        return "Fiscalizador"
      case "engraving":
        return "Empresa Certificadora"
      default:
        return "Usuario"
    }
  }

  const getPageContext = (page: string) => {
    switch (page) {
      case "dashboard":
        return "Panel de Control"
      case "installations":
        return "Mis Instalaciones"
      case "search-components":
        return "Búsqueda de Componentes"
      case "security-alerts":
        return "Alertas de Seguridad"
      case "reports":
        return "Reportes y Denuncias"
      case "profile":
        return "Mi Perfil"
      default:
        return "Sistema de Trazabilidad"
    }
  }

  const quickResponses: QuickResponse[] = [
    // Respuestas generales
    { id: "help", text: "¿Cómo puedo obtener ayuda?", category: "general" },
    { id: "contact", text: "Información de contacto", category: "general" },
    { id: "hours", text: "Horarios de atención", category: "general" },
    
    // Respuestas específicas por tipo de usuario
    ...(userType === "installer" ? [
      { id: "register", text: "¿Cómo registrar una instalación?", category: "installer" },
      { id: "engraving", text: "Proceso de grabado de componentes", category: "installer" },
      { id: "verification", text: "Verificación de instalaciones", category: "installer" },
    ] : []),
    
    ...(userType === "public" ? [
      { id: "search", text: "¿Cómo buscar componentes?", category: "public" },
      { id: "verify", text: "Verificar autenticidad", category: "public" },
      { id: "report", text: "Reportar componente robado", category: "public" },
    ] : []),
    
    ...(userType === "inspector" ? [
      { id: "inspect", text: "Proceso de inspección", category: "inspector" },
      { id: "alerts", text: "Gestión de alertas", category: "inspector" },
      { id: "reports-review", text: "Revisión de reportes", category: "inspector" },
    ] : []),
    
    // Respuestas específicas por página
    ...(currentPage === "dashboard" ? [
      { id: "dashboard-help", text: "Ayuda con el dashboard", category: "page" },
      { id: "stats", text: "Explicar estadísticas", category: "page" },
    ] : []),
    
    ...(currentPage === "installations" ? [
      { id: "installation-help", text: "Gestión de instalaciones", category: "page" },
      { id: "status", text: "Estados de instalación", category: "page" },
    ] : []),
  ]

  const getResponsesByCategory = (category: string) => {
    return quickResponses.filter(response => response.category === category)
  }

  const handleQuickResponse = (responseId: string) => {
    let message = ""
    const context = `Soy ${getUserTypeLabel(userType)} y estoy en la sección: ${getPageContext(currentPage)}.`
    
    switch (responseId) {
      case "help":
        message = `Hola, necesito ayuda general con el Sistema de Trazabilidad ApollA. ${context}`
        break
      case "contact":
        message = `Hola, necesito información de contacto y soporte. ${context}`
        break
      case "hours":
        message = `Hola, quisiera conocer los horarios de atención al cliente. ${context}`
        break
      case "register":
        message = `Hola, necesito ayuda para registrar una nueva instalación fotovoltaica. ${context}`
        break
      case "engraving":
        message = `Hola, tengo dudas sobre el proceso de grabado de componentes. ${context}`
        break
      case "verification":
        message = `Hola, necesito ayuda con la verificación de instalaciones. ${context}`
        break
      case "search":
        message = `Hola, ¿cómo puedo buscar y verificar componentes fotovoltaicos? ${context}`
        break
      case "verify":
        message = `Hola, quiero verificar la autenticidad de un componente. ${context}`
        break
      case "report":
        message = `Hola, necesito reportar un componente robado o sospechoso. ${context}`
        break
      case "inspect":
        message = `Hola, necesito información sobre el proceso de inspección. ${context}`
        break
      case "alerts":
        message = `Hola, tengo dudas sobre la gestión de alertas de seguridad. ${context}`
        break
      case "reports-review":
        message = `Hola, necesito ayuda con la revisión de reportes. ${context}`
        break
      case "dashboard-help":
        message = `Hola, necesito ayuda para entender el dashboard del sistema. ${context}`
        break
      case "stats":
        message = `Hola, ¿podrían explicarme las estadísticas del dashboard? ${context}`
        break
      case "installation-help":
        message = `Hola, necesito ayuda con la gestión de mis instalaciones. ${context}`
        break
      case "status":
        message = `Hola, ¿qué significan los diferentes estados de las instalaciones? ${context}`
        break
      default:
        message = `Hola, necesito ayuda con el Sistema de Trazabilidad ApollA. ${context}`
    }

    const phoneNumber = "56950362875"
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank")
    setIsOpen(false)
  }

  const handleDirectContact = () => {
    const phoneNumber = "56950362875"
    const message = encodeURIComponent(
      `Hola, soy ${getUserTypeLabel(userType)} y necesito asistencia con el Sistema de Trazabilidad ApollA. Estoy en la sección: ${getPageContext(currentPage)}.`
    )
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
    setIsOpen(false)
  }

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Panel del agente */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Agente Virtual ApollA</CardTitle>
                    <CardDescription className="text-green-100">
                      Asistencia 24/7 - {formatTime(currentTime)}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {/* Información del usuario */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{getUserTypeLabel(userType)}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-gray-600">{getPageContext(currentPage)}</span>
                </div>
              </div>

              {/* Mensaje de bienvenida */}
              <div className="p-4 border-b">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              </div>

              {/* Categorías de respuestas rápidas */}
              <div className="p-4 space-y-4">
                {!selectedCategory ? (
                  <>
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Ayuda General</h4>
                      <div className="space-y-2">
                        {getResponsesByCategory("general").map((response) => (
                          <Button
                            key={response.id}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left h-auto py-2 px-3"
                            onClick={() => handleQuickResponse(response.id)}
                          >
                            <span className="text-sm">{response.text}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {getResponsesByCategory(userType).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          Para {getUserTypeLabel(userType)}
                        </h4>
                        <div className="space-y-2">
                          {getResponsesByCategory(userType).map((response) => (
                            <Button
                              key={response.id}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-left h-auto py-2 px-3"
                              onClick={() => handleQuickResponse(response.id)}
                            >
                              <span className="text-sm">{response.text}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {getResponsesByCategory("page").length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          Ayuda de esta sección
                        </h4>
                        <div className="space-y-2">
                          {getResponsesByCategory("page").map((response) => (
                            <Button
                              key={response.id}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-left h-auto py-2 px-3"
                              onClick={() => handleQuickResponse(response.id)}
                            >
                              <span className="text-sm">{response.text}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              {/* Información de contacto */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>+56 9 1234 5678</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>soporte@apolla.cl</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Lun-Vie 8:00-18:00</span>
                  </div>
                </div>
              </div>

              {/* Botón de contacto directo */}
              <div className="p-4 border-t">
                <Button
                  onClick={handleDirectContact}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chatear por WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
