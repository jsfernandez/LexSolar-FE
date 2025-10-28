"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ArrowLeft, Shield, AlertTriangle, CheckCircle, Clock, Eye, Home, UserPlus } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import mockData from "@/lib/mock-data"

export default function PublicSearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<any>(null)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    
    // Simular búsqueda en componentes mock
    setTimeout(() => {
      const results = mockData.components.filter(component =>
        component.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activo
          </Badge>
        )
      case "stolen":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Robado
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Clock className="h-3 w-3 mr-1" />
            Inactivo
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header Público */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Inicio
              </Button>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-xl font-bold text-gray-900">Consulta Pública de Componentes</h1>
                <p className="text-sm text-gray-600">Verificación gratuita sin registro</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Image src="/images/logo-apolla.png" alt="LexSolar" width={120} height={50} className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Información de Acceso Público */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="font-semibold mb-1">Consulta Pública Gratuita</div>
            <p className="text-sm">
              Verifique la autenticidad y estado de componentes fotovoltaicos sin necesidad de registro. 
              Para funcionalidades completas, <Link href="/" className="underline font-medium">regístrese aquí</Link>.
            </p>
          </AlertDescription>
        </Alert>

        {/* Formulario de Búsqueda */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Componentes
            </CardTitle>
            <CardDescription>
              Ingrese el número de serie, marca o modelo del componente que desea verificar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                  Buscar componente
                </Label>
                <Input
                  id="search"
                  placeholder="Ej: ABC123456, SunPower, SPR-X22-370"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching || !searchTerm.trim()}>
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados de Búsqueda */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados de Búsqueda</CardTitle>
              <CardDescription>
                Se encontraron {searchResults.length} componente(s) que coinciden con su búsqueda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((component) => (
                  <div key={component.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{component.brand} {component.model}</h3>
                          {getStatusBadge(component.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-500">Número de Serie</Label>
                            <p className="font-mono font-medium">{component.serialNumber}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Tipo</Label>
                            <p className="font-medium">{component.type}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Potencia</Label>
                            <p className="font-medium">{component.power}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Certificación</Label>
                            <p className="font-medium">{component.certification}</p>
                          </div>
                        </div>

                        {component.status === "stolen" && (
                          <Alert className="mt-3 border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                              <div className="font-semibold">⚠️ COMPONENTE REPORTADO COMO ROBADO</div>
                              <p className="text-sm mt-1">
                                Este componente ha sido reportado como robado. Si lo encuentra en venta o instalación, 
                                contacte inmediatamente a las autoridades.
                              </p>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedComponent(component)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{component.brand} {component.model}</DialogTitle>
                            <DialogDescription>Información detallada del componente</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Número de Serie</Label>
                                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                                  {component.serialNumber}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Estado</Label>
                                <div className="mt-1">{getStatusBadge(component.status)}</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Marca</Label>
                                <p className="font-medium">{component.brand}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Modelo</Label>
                                <p className="font-medium">{component.model}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Tipo</Label>
                                <p className="font-medium">{component.type}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Potencia</Label>
                                <p className="font-medium">{component.power}</p>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600">Certificación</Label>
                              <p className="font-medium">{component.certification}</p>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600">Garantía</Label>
                              <p className="font-medium">{component.warranty}</p>
                            </div>

                            {component.status === "stolen" && (
                              <Alert className="border-red-200 bg-red-50">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                  <div className="font-semibold">COMPONENTE ROBADO</div>
                                  <p className="text-sm mt-1">
                                    Este componente ha sido reportado como robado. Si tiene información sobre su ubicación, 
                                    contacte a las autoridades competentes.
                                  </p>
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensaje cuando no hay resultados */}
        {searchResults.length === 0 && searchTerm && !isSearching && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron componentes</h3>
              <p className="text-gray-600 mb-4">
                No se encontraron componentes que coincidan con "{searchTerm}". 
                Verifique el número de serie, marca o modelo e intente nuevamente.
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Limpiar Búsqueda
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Información Adicional */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                ¿Qué puede hacer aquí?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Verificar autenticidad de componentes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Consultar estado actual (activo/robado/inactivo)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Ver especificaciones técnicas básicas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Recibir alertas de componentes robados
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-600" />
                ¿Necesita más funcionalidades?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Regístrese para acceder a funcionalidades completas del sistema:
              </p>
              <ul className="space-y-2 text-sm mb-4">
                <li>• Registrar instalaciones completas</li>
                <li>• Gestionar inventario de componentes</li>
                <li>• Generar reportes detallados</li>
                <li>• Acceso al dashboard completo</li>
              </ul>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Ir al Sistema Principal
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-8 mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              Sistema oficial respaldado por las principales instituciones del sector energético chileno
            </p>
            <div className="flex items-center justify-center gap-12">
              <div className="text-center">
                <Image
                  src="/images/logo-apolla.png"
                  alt="LexSolar"
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
