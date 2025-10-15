"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Camera, MapPin, User, Building2, Zap, AlertCircle, CheckCircle } from "lucide-react"
import SessionHeader from "@/components/session-header"
import WhatsAppAgent from "@/components/whatsapp-agent"

export default function InstallationForm() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientRut: "",
    clientEmail: "",
    clientPhone: "",
    address: "",
    coordinates: "",
    systemType: "",
    totalPower: "",
    installationDate: "",
    components: [],
    photos: [],
    notes: "",
  })

  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files)
    setUploadedPhotos((prev) => [...prev, ...files])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validar que se hayan subido fotos
    if (uploadedPhotos.length === 0) {
      alert("Debe subir al menos una foto de la instalación")
      setIsSubmitting(false)
      return
    }

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert(
      "Instalación registrada exitosamente. Se ha generado una solicitud automática para el grabado de números de serie.",
    )
    window.location.href = "/dashboard"

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Session Header */}
      <SessionHeader
        title="Registro de Instalación"
        subtitle="Registre una nueva instalación fotovoltaica"
        backUrl="/dashboard"
        userType="installer"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
              <CardDescription>Datos del propietario de la instalación</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="clientName">Nombre Completo *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientRut">RUT *</Label>
                <Input
                  id="clientRut"
                  placeholder="12.345.678-9"
                  value={formData.clientRut}
                  onChange={(e) => setFormData({ ...formData, clientRut: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Teléfono</Label>
                <Input
                  id="clientPhone"
                  placeholder="+56 9 1234 5678"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ubicación de la Instalación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación de la Instalación
              </CardTitle>
              <CardDescription>Dirección y coordenadas del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Dirección Completa *</Label>
                <Textarea
                  id="address"
                  placeholder="Calle, número, comuna, región"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="coordinates">Coordenadas GPS</Label>
                <Input
                  id="coordinates"
                  placeholder="-33.4489, -70.6693"
                  value={formData.coordinates}
                  onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: latitud, longitud (opcional, se puede obtener automáticamente)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Información del Sistema
              </CardTitle>
              <CardDescription>Características técnicas de la instalación</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="systemType">Tipo de Sistema *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, systemType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residencial</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="utility">Utilidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="totalPower">Potencia Total (kW) *</Label>
                <Input
                  id="totalPower"
                  type="number"
                  step="0.1"
                  placeholder="5.5"
                  value={formData.totalPower}
                  onChange={(e) => setFormData({ ...formData, totalPower: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="installationDate">Fecha de Instalación *</Label>
                <Input
                  id="installationDate"
                  type="date"
                  value={formData.installationDate}
                  onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Fotografías Obligatorias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Fotografías de la Instalación
              </CardTitle>
              <CardDescription>
                Suba fotografías de los componentes y la instalación completa (OBLIGATORIO)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="font-semibold mb-1">Fotografías Requeridas:</div>
                  <ul className="text-sm space-y-1">
                    <li>• Paneles solares instalados (vista general)</li>
                    <li>• Inversores y equipos eléctricos</li>
                    <li>• Instalación completa desde diferentes ángulos</li>
                    <li>• Etiquetas y placas de identificación visibles</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="photos">Subir Fotografías *</Label>
                <Input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="mt-1"
                  required
                />
                {uploadedPhotos.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {uploadedPhotos.length} foto(s) cargada(s)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {uploadedPhotos.slice(0, 4).map((photo, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                          <Badge className="absolute -top-2 -right-2 bg-green-500">{index + 1}</Badge>
                        </div>
                      ))}
                      {uploadedPhotos.length > 4 && (
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm text-gray-600">+{uploadedPhotos.length - 4} más</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notas Adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
              <CardDescription>Información adicional sobre la instalación</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ingrese cualquier información adicional relevante sobre la instalación..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Información Importante */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="font-semibold mb-1">Proceso de Grabado de Números de Serie</div>
              <p className="text-sm">
                Una vez registrada la instalación, se generará automáticamente una solicitud para la empresa
                certificadora autorizada, quien se encargará del grabado de números de serie en cada componente. Este
                proceso es obligatorio y será coordinado directamente con usted.
              </p>
            </AlertDescription>
          </Alert>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => (window.location.href = "/dashboard")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || uploadedPhotos.length === 0}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
                  Registrar Instalación
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* WhatsApp Agent */}
      <WhatsAppAgent userType="installer" currentPage="register-installation" />
    </div>
  )
}
