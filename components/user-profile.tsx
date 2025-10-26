"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { User, Building2, Edit, Save, History, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { useAuth } from "@/contexts/auth-context"
import { userService } from "@/services/api"

export default function UserProfile() {
  interface EditedData {
    id?: number;
    name: string;
    rut?: string;
    email: string;
    phone?: string;
    address?: string;
    company?: string;
    companyRut?: string;
    role: string;
    permissions?: string[];
  }

  const { user: authUser, logout } = useAuth()
  const [userData, setUserData] = useState<EditedData | null>(null)
  const [userInstallations, setUserInstallations] = useState<any[]>([])
  const [userReports, setUserReports] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<EditedData | null>(null)
  const [selectedInstallation, setSelectedInstallation] = useState(null)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const profile = await userService.getUser(authUser?.id || 0)
        setUserData(profile)
        setEditedData(profile)
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    if (authUser) {
      loadUserData()
    }
  }, [authUser])

  interface EditedData {
    name: string;
    rut?: string;
    email: string;
    phone?: string;
    address?: string;
    company?: string;
    companyRut?: string;
    role: string;
  }

  const handleSave = async () => {
    try {
      await userService.updateUser(userData?.id || 0, editedData)
      setIsEditing(false)
      setUserData({ ...userData, ...editedData })
    } catch (error) {
      console.error('Error updating profile:', error)
      alert("Error al actualizar el perfil")
    }
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
      case "stolen_components":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Componentes Robados
          </Badge>
        )
      case "investigating":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Investigando
          </Badge>
        )
      case "resolved":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resuelto
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simplificar header y eliminar redundancia */}
      <SessionHeader
        title="Mi Perfil"
        subtitle="Gestión de cuenta y actividad"
        backUrl="/dashboard"
        userType="installer"
      />

      {/* Contenido principal */}
      <main className="container mx-auto py-8 px-4 max-w-7xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="installations" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Mis Instalaciones
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Mis Denuncias
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Actividad
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Perfil */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Gestione su información de perfil</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={editedData.name}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rut">RUT</Label>
                      <Input id="rut" value={editedData.rut} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedData.email}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={editedData.phone}
                        onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Textarea
                      id="address"
                      value={editedData.address}
                      onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                      disabled={!isEditing}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={editedData.company || ''}
                        onChange={(e) => setEditedData({ ...editedData, company: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyRut">RUT Empresa</Label>
                      <Input id="companyRut" value={editedData.companyRut || ''} disabled className="bg-gray-50" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userInstallations.length}</div>
                    <div className="text-sm text-blue-700">Instalaciones Registradas</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userReports.length}</div>
                    <div className="text-sm text-green-700">Denuncias Realizadas</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {userInstallations.reduce((sum, inst) => sum + (inst.components || 0), 0)}
                    </div>
                    <div className="text-sm text-purple-700">Componentes Registrados</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pestaña de Instalaciones */}
          <TabsContent value="installations">
            <Card>
              <CardHeader>
                <CardTitle>Mis Instalaciones Registradas</CardTitle>
                <CardDescription>Historial completo de todas las instalaciones que ha registrado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userInstallations.map((installation) => (
                    <div key={installation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{installation.systemName}</h3>
                            {getStatusBadge(installation.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <Label className="text-gray-500">Cliente</Label>
                              <p className="font-medium">{installation.client}</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Dirección</Label>
                              <p className="font-medium">{installation.address}</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Componentes</Label>
                              <p className="font-medium">{installation.components} unidades</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Potencia</Label>
                              <p className="font-medium">{installation.power}</p>
                            </div>
                          </div>

                          <div className="mt-3 text-xs text-gray-500">
                            <span>
                              Registrado el {new Date(installation.registrationDate).toLocaleDateString("es-CL")}
                            </span>
                            <span className="mx-2">•</span>
                            <span>Serie: {installation.serialNumber}</span>
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{installation.systemName}</DialogTitle>
                              <DialogDescription>Información detallada de la instalación</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Número de Serie</Label>
                                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                                    {installation.serialNumber}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Estado</Label>
                                  <div className="mt-1">{getStatusBadge(installation.status)}</div>
                                </div>
                              </div>
                              {installation.status === "stolen_components" && (
                                <Alert className="border-red-200 bg-red-50">
                                  <AlertTriangle className="h-4 w-4 text-red-600" />
                                  <AlertDescription className="text-red-800">
                                    Esta instalación tiene componentes reportados como robados. Se ha notificado a las
                                    autoridades competentes.
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
          </TabsContent>

          {/* Pestaña de Denuncias */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Mis Denuncias</CardTitle>
                <CardDescription>Historial de denuncias de componentes robados que ha reportado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{report.systemName}</h3>
                          <p className="text-sm text-gray-600">Reporte #{report.reportNumber}</p>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <Label className="text-gray-500">Fecha de Reporte</Label>
                          <p className="font-medium">{new Date(report.reportDate).toLocaleDateString("es-CL")}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Ubicación del Hallazgo</Label>
                          <p className="font-medium">{report.location}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Label className="text-gray-500">Componentes Reportados</Label>
                        <ul className="list-disc list-inside text-sm">
                          {report.components.map((component: string, index: number) => (
                            <li key={index} className="font-medium">
                              {component}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <Label className="text-gray-500">Descripción</Label>
                        <p className="text-sm">{report.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Actividad */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Historial de acciones realizadas en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">Instalación registrada</p>
                      <p className="text-sm text-gray-600">Sistema Industrial Quilicura - hace 2 meses</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div className="flex-1">
                      <p className="font-medium">Denuncia realizada</p>
                      <p className="text-sm text-gray-600">Batería BYD encontrada en venta - hace 2 semanas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium">Perfil actualizado</p>
                      <p className="text-sm text-gray-600">Información de contacto modificada - hace 1 semana</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* WhatsApp Agent */}
      <WhatsAppAgent userType="installer" currentPage="profile" />
    </div>
  )
}
