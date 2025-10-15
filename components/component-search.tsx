"use client"

import { useState } from "react"
import { Search, AlertTriangle, Shield, CheckCircle, XCircle, Flag, Phone, Mail, Building2, Calendar, MapPin, Eye, Download } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import mockData, { mockApi } from "@/lib/mock-data"

// Reemplazar la constante componentsDatabase con:
const getComponentsDatabase = () => {
  const database: { [key: string]: any } = {}
  
  mockData.components.forEach(component => {
    database[component.serialNumber] = component
  })
  
  return database
}

// Base de datos simulada de componentes
// const componentsDatabase = {
//   "PV2024-SOL-334890S706693W-123456-47": {
//     serialNumber: "PV2024-SOL-334890S706693W-123456-47",
//     status: "valid",
//     type: "Panel Solar",
//     brand: "Jinko Solar",
//     model: "Tiger Pro 540W",
//     installationDate: "2024-03-15",
//     systemName: "Sistema Residencial Maipú",
//     installer: {
//       name: "SolarTech Chile SpA",
//       rut: "76.123.456-7",
//       phone: "+56 2 2345 6789",
//       email: "contacto@solartech.cl",
//     },
//     client: {
//       name: "Carlos Mendoza",
//       rut: "15.678.901-2",
//     },
//     location: {
//       address: "Av. Pajaritos 1234, Maipú",
//       coordinates: "-33.4890, -70.6693",
//     },
//   },
//   "INV2024-HUA-335115S707624W-789012-23": {
//     serialNumber: "INV2024-HUA-335115S707624W-789012-23",
//     status: "stolen",
//     type: "Inversor",
//     brand: "Huawei",
//     model: "SUN2000-15KTL",
//     installationDate: "2024-02-20",
//     systemName: "Proyecto Comercial Las Condes",
//     installer: {
//       name: "Energía Verde Ltda.",
//       rut: "77.987.654-3",
//       phone: "+56 2 3456 7890",
//       email: "info@energiaverde.cl",
//     },
//     client: {
//       name: "Empresa ABC S.A.",
//       rut: "96.123.456-7",
//     },
//     location: {
//       address: "Los Dominicos 8765, Las Condes",
//       coordinates: "-33.5115, -70.7624",
//     },
//     stolenDate: "2024-11-15",
//     reportNumber: "ROB-2024-001234",
//   },
//   "BAT2024-BYD-332025S705469W-345678-89": {
//     serialNumber: "BAT2024-BYD-332025S705469W-345678-89",
//     status: "stolen",
//     type: "Batería",
//     brand: "BYD",
//     model: "Battery-Box Premium HVS 10.24kWh",
//     installationDate: "2024-01-10",
//     systemName: "Sistema Residencial Providencia",
//     installer: {
//       name: "PowerSolar Chile Ltda.",
//       rut: "78.456.789-0",
//       phone: "+56 2 4567 8901",
//       email: "soporte@powersolar.cl",
//     },
//     client: {
//       name: "María González",
//       rut: "12.345.678-9",
//     },
//     location: {
//       address: "Av. Providencia 2025, Providencia",
//       coordinates: "-33.2025, -70.5469",
//     },
//     stolenDate: "2024-12-01",
//     reportNumber: "ROB-2024-001567",
//   },
//   "PV2024-CAN-334489S706693W-901234-56": {
//     serialNumber: "PV2024-CAN-334489S706693W-901234-56",
//     status: "valid",
//     type: "Panel Solar",
//     brand: "Canadian Solar",
//     model: "HiKu6 Mono 450W",
//     installationDate: "2024-04-05",
//     systemName: "Sistema Industrial Quilicura",
//     installer: {
//       name: "SolarTech Chile SpA",
//       rut: "76.123.456-7",
//       phone: "+56 2 2345 6789",
//       email: "contacto@solartech.cl",
//     },
//     client: {
//       name: "Industrias XYZ Ltda.",
//       rut: "89.012.345-6",
//     },
//     location: {
//       address: "Camino a Lampa 4489, Quilicura",
//       coordinates: "-33.4489, -70.6693",
//     },
//   },
// }

export default function ComponentSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportData, setReportData] = useState({
    reporterName: "",
    reporterEmail: "",
    reporterPhone: "",
    description: "",
    location: "",
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      // Usar la API mock en lugar de la simulación local
      const results = await mockApi.searchComponents(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching components:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleReport = async () => {
    // Simular envío de reporte
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert(`Reporte enviado exitosamente. 
    
Se ha notificado a:
• Empresa instaladora: ${selectedComponent.installer.name}
• Autoridades competentes (PDI - Brigada de Delitos Económicos)
• Sistema Nacional de Trazabilidad

Número de reporte: REP-${Date.now().toString().slice(-6)}`)

    setShowReportDialog(false)
    setReportData({
      reporterName: "",
      reporterEmail: "",
      reporterPhone: "",
      description: "",
      location: "",
    })
  }

  const StatusBadge = ({ status }) => {
    if (status === "valid") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          VÁLIDO
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          ROBADO
        </Badge>
      )
    }
  }

  const stolenComponents = searchResults.filter((component) => component.status === "stolen")

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Búsqueda de Componentes</h1>
        <p className="text-gray-600">
          Verifique el estado de componentes fotovoltaicos antes de realizar cualquier transacción
        </p>
      </div>

      {/* Buscador */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Componentes
          </CardTitle>
          <CardDescription>Ingrese número de serie, marca, modelo o nombre del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Ej: PV2024-SOL-334890S706693W-123456-47, Jinko Solar, Tiger Pro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
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

      {/* Advertencia de Componentes Robados */}
      {stolenComponents.length > 0 && (
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-bold text-lg mb-2">⚠️ ADVERTENCIA CRÍTICA ⚠️</div>
            <p className="mb-2">
              Se encontraron <strong>{stolenComponents.length} componente(s) reportado(s) como ROBADO(S)</strong> en su
              búsqueda.
            </p>
            <div className="bg-red-100 p-3 rounded-lg mt-3">
              <p className="font-semibold mb-2">INSTRUCCIONES IMPORTANTES:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  <strong>NO COMPRE</strong> estos componentes bajo ninguna circunstancia
                </li>
                <li>
                  <strong>NO INSTALE</strong> estos componentes en ningún sistema
                </li>
                <li>
                  <strong>REPORTE INMEDIATAMENTE</strong> si encuentra estos componentes en venta
                </li>
                <li>
                  La compra de productos robados constituye <strong>delito penal</strong> según la ley chilena
                </li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Resultados de Búsqueda */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Resultados de Búsqueda ({searchResults.length})</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {searchResults.map((component) => (
              <Card
                key={component.serialNumber}
                className={`${component.status === "stolen" ? "border-red-200 bg-red-50" : "border-gray-200"}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{component.type}</CardTitle>
                      <CardDescription>
                        {component.brand} - {component.model}
                      </CardDescription>
                    </div>
                    <StatusBadge status={component.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Número de Serie</Label>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">{component.serialNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs font-medium text-gray-500">Sistema</Label>
                      <p>{component.systemName}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-500">Instalación</Label>
                      <p>{new Date(component.installationDate).toLocaleDateString("es-CL")}</p>
                    </div>
                  </div>

                  {component.status === "stolen" && (
                    <Alert className="border-red-300 bg-red-100">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 text-sm">
                        <div className="font-semibold mb-1">COMPONENTE ROBADO</div>
                        <p>Reportado el: {new Date(component.stolenDate).toLocaleDateString("es-CL")}</p>
                        <p>N° Reporte: {component.reportNumber}</p>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedComponent(component)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                    {component.status === "stolen" && (
                      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setSelectedComponent(component)}
                            className="flex-1"
                          >
                            <Flag className="h-4 w-4 mr-2" />
                            Reportar Hallazgo
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-700">
                              <AlertTriangle className="h-5 w-5" />
                              Reportar Componente Robado Encontrado
                            </DialogTitle>
                            <DialogDescription>
                              Complete la información para reportar el hallazgo de este componente robado a las
                              autoridades y empresa instaladora.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <Alert className="border-red-200 bg-red-50">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-800">
                                <strong>Componente:</strong> {selectedComponent?.type} - {selectedComponent?.brand}{" "}
                                {selectedComponent?.model}
                                <br />
                                <strong>Serie:</strong> {selectedComponent?.serialNumber}
                              </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="reporterName">Su Nombre Completo *</Label>
                                <Input
                                  id="reporterName"
                                  value={reportData.reporterName}
                                  onChange={(e) => setReportData({ ...reportData, reporterName: e.target.value })}
                                  placeholder="Ej: Juan Pérez González"
                                />
                              </div>
                              <div>
                                <Label htmlFor="reporterEmail">Su Email *</Label>
                                <Input
                                  id="reporterEmail"
                                  type="email"
                                  value={reportData.reporterEmail}
                                  onChange={(e) => setReportData({ ...reportData, reporterEmail: e.target.value })}
                                  placeholder="juan@email.com"
                                />
                              </div>
                              <div>
                                <Label htmlFor="reporterPhone">Su Teléfono</Label>
                                <Input
                                  id="reporterPhone"
                                  value={reportData.reporterPhone}
                                  onChange={(e) => setReportData({ ...reportData, reporterPhone: e.target.value })}
                                  placeholder="+56 9 1234 5678"
                                />
                              </div>
                              <div>
                                <Label htmlFor="location">Ubicación del Hallazgo</Label>
                                <Input
                                  id="location"
                                  value={reportData.location}
                                  onChange={(e) => setReportData({ ...reportData, location: e.target.value })}
                                  placeholder="Dirección donde encontró el componente"
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="description">Descripción del Hallazgo *</Label>
                              <Textarea
                                id="description"
                                value={reportData.description}
                                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                                placeholder="Describa dónde y cómo encontró este componente (tienda, persona, sitio web, etc.)"
                                rows={3}
                              />
                            </div>

                            <Alert>
                              <Shield className="h-4 w-4" />
                              <AlertDescription>
                                Su reporte será enviado automáticamente a:
                                <ul className="list-disc list-inside mt-2 text-sm">
                                  <li>Empresa instaladora original: {selectedComponent?.installer.name}</li>
                                  <li>PDI - Brigada de Delitos Económicos</li>
                                  <li>Sistema Nacional de Trazabilidad</li>
                                </ul>
                              </AlertDescription>
                            </Alert>

                            <div className="flex gap-4">
                              <Button onClick={handleReport} className="flex-1">
                                <Flag className="h-4 w-4 mr-2" />
                                Enviar Reporte
                              </Button>
                              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Detalles del Componente */}
      {selectedComponent && (
        <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Detalles del Componente</span>
                <StatusBadge status={selectedComponent.status} />
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {selectedComponent.status === "stolen" && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="font-bold text-lg mb-2">⚠️ COMPONENTE ROBADO ⚠️</div>
                    <p className="mb-2">
                      Este componente ha sido reportado como robado y NO debe ser adquirido, instalado o comercializado.
                    </p>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <p>
                        <strong>Fecha del robo:</strong>{" "}
                        {new Date(selectedComponent.stolenDate).toLocaleDateString("es-CL")}
                      </p>
                      <p>
                        <strong>Número de reporte:</strong> {selectedComponent.reportNumber}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información del Componente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Número de Serie</Label>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedComponent.serialNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Tipo</Label>
                      <p>{selectedComponent.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Marca y Modelo</Label>
                      <p>
                        {selectedComponent.brand} - {selectedComponent.model}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Sistema</Label>
                      <p>{selectedComponent.systemName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Fecha de Instalación</Label>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {new Date(selectedComponent.installationDate).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Empresa Instaladora</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Empresa</Label>
                      <p className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        {selectedComponent.installer.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">RUT</Label>
                      <p>{selectedComponent.installer.rut}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contacto</Label>
                      <div className="space-y-1">
                        <p className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-500" />
                          {selectedComponent.installer.phone}
                        </p>
                        <p className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-500" />
                          {selectedComponent.installer.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cliente/Propietario</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Nombre</Label>
                      <p>{selectedComponent.client.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">RUT</Label>
                      <p>{selectedComponent.client.rut}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ubicación</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Dirección</Label>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {selectedComponent.location.address}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Coordenadas</Label>
                      <p className="font-mono text-sm">{selectedComponent.location.coordinates}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Certificado
                </Button>
                {selectedComponent.status === "stolen" && (
                  <Button variant="destructive" className="flex-1" onClick={() => setShowReportDialog(true)}>
                    <Flag className="h-4 w-4 mr-2" />
                    Reportar Hallazgo
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Estado inicial */}
      {searchResults.length === 0 && !isSearching && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Busque componentes para verificar su estado</h3>
            <p className="text-gray-600 mb-4">
              Ingrese el número de serie, marca o modelo del componente que desea verificar
            </p>
            <Alert className="max-w-md mx-auto">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Recomendación:</strong> Siempre verifique el estado de los componentes antes de realizar
                cualquier compra o instalación.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
