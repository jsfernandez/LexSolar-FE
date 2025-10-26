"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Calendar, MapPin, Clock, CheckCircle, XCircle, AlertTriangle, Camera, Eye, User, Building2, Zap } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SessionHeader from "@/components/session-header"
import WhatsAppAgent from "@/components/whatsapp-agent"
// importación eliminada

export default function EngravingDashboard() {
  const [engravingRequests, setEngravingRequests] = useState(mockData.engravingRequests)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [componentAction, setComponentAction] = useState("")
  const [actionNotes, setActionNotes] = useState("")
  const [uploadedPhotos, setUploadedPhotos] = useState([])

  useEffect(() => {
    const loadEngravingData = async () => {
      try {
  // TODO: Reemplazar por llamada real a la API
        setEngravingRequests(requests)
      } catch (error) {
        console.error('Error loading engraving data:', error)
      }
    }
    
    loadEngravingData()
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            En Proceso
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Baja</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const filteredRequests = engravingRequests.filter((request) => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    const matchesSearch =
      request.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.installer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleComponentAction = (component, action) => {
    setSelectedComponent(component)
    setComponentAction(action)
    setActionNotes("")
    setUploadedPhotos([])
  }

  const submitComponentAction = () => {
    // Simular procesamiento de acción
    alert(`Acción "${componentAction}" procesada para ${selectedComponent.type}`)
    setSelectedComponent(null)
    setComponentAction("")
  }

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files)
    setUploadedPhotos((prev) => [...prev, ...files])
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Session Header */}
      <SessionHeader
        title="Dashboard Empresa Certificadora"
        subtitle="Gestión de solicitudes de grabado de números de serie"
        backUrl="/engraving-login"
        userType="engraving"
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Image src="/images/logo-apolla.png" alt="ApollA" width={32} height={32} className="h-6 w-auto" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Empresa Certificadora</h1>
                  <p className="text-sm text-gray-600">Grabado de Números de Serie</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <Image src="/images/logo-apolla.png" alt="ApollA" width={120} height={50} className="h-8 w-auto" />
              <Image
                src="/images/logo-acesol.png"
                alt="ACESOL"
                width={80}
                height={40}
                className="h-6 w-auto opacity-70"
              />
              <Image
                src="/images/logo-ministerio-energia.png"
                alt="Ministerio de Energía"
                width={80}
                height={40}
                className="h-6 w-auto opacity-70"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Solicitudes Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {engravingRequests.filter((r) => r.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Proceso</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {engravingRequests.filter((r) => r.status === "in_progress").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {engravingRequests.filter((r) => r.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Componentes</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {engravingRequests.reduce(
                      (sum, req) => sum + req.components.reduce((compSum, comp) => compSum + comp.quantity, 0),
                      0,
                    )}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar Solicitudes</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por sistema, cliente o instalador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="status-filter">Filtrar por Estado</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in_progress">En Proceso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="rejected">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Solicitudes */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{request.systemName}</CardTitle>
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                    </div>
                    <CardDescription>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Cliente: {request.client}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>Instalador: {request.installer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{request.address}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Programado: {new Date(request.scheduledDate).toLocaleDateString("es-CL")}</span>
                    </div>
                    <div>ID: {request.id}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="components" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="components">Componentes ({request.components.length})</TabsTrigger>
                    <TabsTrigger value="details">Detalles</TabsTrigger>
                    <TabsTrigger value="location">Ubicación</TabsTrigger>
                  </TabsList>

                  <TabsContent value="components" className="space-y-4">
                    {request.components.map((component) => (
                      <div key={component.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{component.type}</h4>
                              {getStatusBadge(component.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Marca:</span> {component.brand}
                              </div>
                              <div>
                                <span className="font-medium">Modelo:</span> {component.model}
                              </div>
                              <div>
                                <span className="font-medium">Cantidad:</span> {component.quantity} unidades
                              </div>
                            </div>
                            {component.serialNumbers.length > 0 && (
                              <div className="mt-2">
                                <span className="font-medium text-sm">Números de Serie Grabados:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {component.serialNumbers.map((serial, index) => (
                                    <Badge key={index} variant="outline" className="font-mono text-xs">
                                      {serial}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {component.status === "pending" && (
                              <Button size="sm" onClick={() => handleComponentAction(component, "start")}>
                                Iniciar Grabado
                              </Button>
                            )}
                            {component.status === "in_progress" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleComponentAction(component, "upload")}
                                >
                                  <Camera className="h-4 w-4 mr-2" />
                                  Subir Evidencia
                                </Button>
                                <Button size="sm" onClick={() => handleComponentAction(component, "complete")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Completar
                                </Button>
                              </>
                            )}
                            {component.status === "completed" && component.photos.length > 0 && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Evidencia
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Evidencia de Grabado</DialogTitle>
                                    <DialogDescription>
                                      {component.type} - {component.brand} {component.model}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid grid-cols-2 gap-4">
                                    {component.photos.map((photo, index) => (
                                      <img
                                        key={index}
                                        src={photo || "/placeholder.svg"}
                                        alt={`Evidencia ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg border"
                                      />
                                    ))}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Fecha de Solicitud</Label>
                          <p>{new Date(request.requestDate).toLocaleDateString("es-CL")}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Fecha Programada</Label>
                          <p>{new Date(request.scheduledDate).toLocaleDateString("es-CL")}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">ID Instalación</Label>
                          <p className="font-mono">{request.installationId}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Coordenadas</Label>
                          <p className="font-mono">{request.coordinates}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Notas Especiales</Label>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{request.notes}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="location">
                    <div className="space-y-4">
                      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <MapPin className="h-12 w-12 mx-auto mb-2" />
                          <p>Mapa de ubicación</p>
                          <p className="text-sm">Coordenadas: {request.coordinates}</p>
                          <Button className="mt-2" size="sm">
                            Abrir en Google Maps
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Dirección Completa</Label>
                        <p>{request.address}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de Acción de Componente */}
        {selectedComponent && (
          <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {componentAction === "start" && "Iniciar Grabado"}
                  {componentAction === "upload" && "Subir Evidencia"}
                  {componentAction === "complete" && "Completar Grabado"}
                </DialogTitle>
                <DialogDescription>
                  {selectedComponent.type} - {selectedComponent.brand} {selectedComponent.model}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {componentAction === "upload" && (
                  <div>
                    <Label htmlFor="photo-upload">Subir Fotos de Evidencia</Label>
                    <Input
                      id="photo-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="mt-1"
                    />
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{uploadedPhotos.length} foto(s) seleccionada(s)</p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="action-notes">Observaciones</Label>
                  <Textarea
                    id="action-notes"
                    placeholder="Ingrese observaciones sobre el proceso de grabado..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedComponent(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={submitComponentAction}>
                    {componentAction === "start" && "Iniciar"}
                    {componentAction === "upload" && "Subir Evidencia"}
                    {componentAction === "complete" && "Completar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* WhatsApp Agent */}
      <WhatsAppAgent userType="engraving" currentPage="engraving-dashboard" />
    </div>
  )
}
