"use client"

import { useState } from "react"
import { MapPin, Building2, User, Zap, Sun, Battery, CheckCircle, Copy, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// Función para validar RUT chileno
const validateRUT = (rut: string): boolean => {
  if (!rut) return false

  const cleanRUT = rut.replace(/[^0-9kK]/g, "")
  if (cleanRUT.length < 8 || cleanRUT.length > 9) return false

  const body = cleanRUT.slice(0, -1)
  const dv = cleanRUT.slice(-1).toLowerCase()

  let sum = 0
  let multiplier = 2

  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number.parseInt(body[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = sum % 11
  const calculatedDV = remainder < 2 ? remainder.toString() : remainder === 10 ? "k" : (11 - remainder).toString()

  return dv === calculatedDV
}

// Función para validar coordenadas
const validateCoordinates = (lat: string, lng: string): boolean => {
  const latitude = Number.parseFloat(lat)
  const longitude = Number.parseFloat(lng)

  return (
    !isNaN(latitude) && !isNaN(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
  )
}

// Función para generar número de serie con información geográfica
const generateSerialNumber = (projectName: string, latitude: string, longitude: string): string => {
  const year = new Date().getFullYear()
  const lat = Number.parseFloat(latitude)
  const lng = Number.parseFloat(longitude)

  // Codificar coordenadas para mayor seguridad
  const latCode = Math.abs(lat).toFixed(4).replace(".", "")
  const lngCode = Math.abs(lng).toFixed(4).replace(".", "")
  const latDir = lat >= 0 ? "N" : "S"
  const lngDir = lng >= 0 ? "E" : "W"

  // Generar código único basado en timestamp y coordenadas
  const timestamp = Date.now().toString().slice(-6)
  const projectCode = projectName
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, "X")

  // Formato: PV[AÑO]-[PROYECTO]-[LAT][DIR][LNG][DIR]-[TIMESTAMP]
  return `PV${year}-${projectCode}-${latCode}${latDir}${lngCode}${lngDir}-${timestamp}`
}

export default function InstallationRegistration() {
  const [formData, setFormData] = useState({
    projectName: "",
    panelCount: "",
    panelBrand: "",
    inverterCount: "",
    inverterBrand: "",
    hasBattery: false,
    batteryCount: "",
    batteryBrand: "",
    latitude: "",
    longitude: "",
    installerName: "",
    installerRUT: "",
    clientName: "",
    clientRUT: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedSerial, setGeneratedSerial] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Validar campos requeridos
    if (!formData.projectName.trim()) newErrors.projectName = "El nombre del proyecto es requerido"
    if (!formData.panelCount || Number.parseInt(formData.panelCount) <= 0)
      newErrors.panelCount = "Debe especificar al menos 1 panel"
    if (!formData.panelBrand.trim()) newErrors.panelBrand = "La marca de paneles es requerida"
    if (!formData.inverterCount || Number.parseInt(formData.inverterCount) <= 0)
      newErrors.inverterCount = "Debe especificar al menos 1 inversor"
    if (!formData.inverterBrand.trim()) newErrors.inverterBrand = "La marca del inversor es requerida"

    if (formData.hasBattery) {
      if (!formData.batteryCount || Number.parseInt(formData.batteryCount) <= 0)
        newErrors.batteryCount = "Debe especificar la cantidad de baterías"
      if (!formData.batteryBrand.trim()) newErrors.batteryBrand = "La marca de la batería es requerida"
    }

    if (!formData.latitude.trim() || !formData.longitude.trim()) {
      newErrors.coordinates = "Las coordenadas son requeridas"
    } else if (!validateCoordinates(formData.latitude, formData.longitude)) {
      newErrors.coordinates = "Las coordenadas no son válidas"
    }

    if (!formData.installerName.trim()) newErrors.installerName = "El nombre de la empresa instaladora es requerido"
    if (!formData.installerRUT.trim()) {
      newErrors.installerRUT = "El RUT de la empresa es requerido"
    } else if (!validateRUT(formData.installerRUT)) {
      newErrors.installerRUT = "El RUT de la empresa no es válido"
    }

    if (!formData.clientName.trim()) newErrors.clientName = "El nombre del cliente es requerido"
    if (!formData.clientRUT.trim()) {
      newErrors.clientRUT = "El RUT del cliente es requerido"
    } else if (!validateRUT(formData.clientRUT)) {
      newErrors.clientRUT = "El RUT del cliente no es válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simular procesamiento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generar número de serie
    const serialNumber = generateSerialNumber(formData.projectName, formData.latitude, formData.longitude)
    setGeneratedSerial(serialNumber)
    setIsRegistered(true)
    setIsSubmitting(false)
  }

  const copySerialNumber = () => {
    navigator.clipboard.writeText(generatedSerial)
    alert("Número de serie copiado al portapapeles")
  }

  const formatRUT = (rut) => {
    const clean = rut.replace(/[^0-9kK]/g, "")
    if (clean.length <= 1) return clean

    const body = clean.slice(0, -1)
    const dv = clean.slice(-1)

    return body.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv
  }

  if (isRegistered) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">¡Instalación Registrada Exitosamente!</CardTitle>
            <CardDescription className="text-green-700">
              El sistema ha sido registrado y se ha generado el número de serie único
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Número de Serie Generado */}
            <div className="bg-white p-6 rounded-lg border border-green-200">
              <Label className="text-sm font-medium text-gray-600 mb-2 block">Número de Serie Generado</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <code className="flex-1 text-lg font-mono font-bold text-blue-600">{generatedSerial}</code>
                <Button onClick={copySerialNumber} size="sm" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Este número incluye información geográfica codificada para mayor seguridad
              </p>
            </div>

            {/* Resumen de la Instalación */}
            <div className="bg-white p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-4">Resumen de la Instalación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium text-gray-600">Proyecto:</Label>
                  <p>{formData.projectName}</p>
                </div>
                <div>
                  <Label className="font-medium text-gray-600">Ubicación:</Label>
                  <p>
                    {formData.latitude}, {formData.longitude}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-gray-600">Cliente:</Label>
                  <p>{formData.clientName}</p>
                </div>
                <div>
                  <Label className="font-medium text-gray-600">Empresa Instaladora:</Label>
                  <p>{formData.installerName}</p>
                </div>
                <div>
                  <Label className="font-medium text-gray-600">Componentes:</Label>
                  <p>
                    {formData.panelCount} paneles, {formData.inverterCount} inversor(es)
                    {formData.hasBattery && `, ${formData.batteryCount} batería(s)`}
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Importante:</strong> Guarde este número de serie en un lugar seguro. Será necesario para futuras
                consultas y verificaciones del sistema.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Descargar Certificado
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRegistered(false)
                  setGeneratedSerial("")
                  setFormData({
                    projectName: "",
                    panelCount: "",
                    panelBrand: "",
                    inverterCount: "",
                    inverterBrand: "",
                    hasBattery: false,
                    batteryCount: "",
                    batteryBrand: "",
                    latitude: "",
                    longitude: "",
                    installerName: "",
                    installerRUT: "",
                    clientName: "",
                    clientRUT: "",
                  })
                }}
              >
                Registrar Nueva Instalación
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Instalación Fotovoltaica</h1>
        <p className="text-gray-600">Complete la información para generar el número de serie único del sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Proyecto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-600" />
              Información del Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="projectName">Nombre del Proyecto *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="Ej: Sistema Solar Residencial Maipú"
                className={errors.projectName ? "border-red-500" : ""}
              />
              {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Componentes del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Componentes del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Paneles Solares */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="panelCount">Número de Paneles *</Label>
                <Input
                  id="panelCount"
                  type="number"
                  min="1"
                  value={formData.panelCount}
                  onChange={(e) => setFormData({ ...formData, panelCount: e.target.value })}
                  placeholder="Ej: 24"
                  className={errors.panelCount ? "border-red-500" : ""}
                />
                {errors.panelCount && <p className="text-red-500 text-sm mt-1">{errors.panelCount}</p>}
              </div>
              <div>
                <Label htmlFor="panelBrand">Marca de Paneles *</Label>
                <Input
                  id="panelBrand"
                  value={formData.panelBrand}
                  onChange={(e) => setFormData({ ...formData, panelBrand: e.target.value })}
                  placeholder="Ej: Jinko Solar"
                  className={errors.panelBrand ? "border-red-500" : ""}
                />
                {errors.panelBrand && <p className="text-red-500 text-sm mt-1">{errors.panelBrand}</p>}
              </div>
            </div>

            <Separator />

            {/* Inversores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inverterCount">Número de Inversores *</Label>
                <Input
                  id="inverterCount"
                  type="number"
                  min="1"
                  value={formData.inverterCount}
                  onChange={(e) => setFormData({ ...formData, inverterCount: e.target.value })}
                  placeholder="Ej: 1"
                  className={errors.inverterCount ? "border-red-500" : ""}
                />
                {errors.inverterCount && <p className="text-red-500 text-sm mt-1">{errors.inverterCount}</p>}
              </div>
              <div>
                <Label htmlFor="inverterBrand">Marca del Inversor *</Label>
                <Input
                  id="inverterBrand"
                  value={formData.inverterBrand}
                  onChange={(e) => setFormData({ ...formData, inverterBrand: e.target.value })}
                  placeholder="Ej: Huawei"
                  className={errors.inverterBrand ? "border-red-500" : ""}
                />
                {errors.inverterBrand && <p className="text-red-500 text-sm mt-1">{errors.inverterBrand}</p>}
              </div>
            </div>

            <Separator />

            {/* Baterías */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasBattery"
                  checked={formData.hasBattery}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasBattery: checked })}
                />
                <Label htmlFor="hasBattery" className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-green-600" />
                  El proyecto incluye baterías
                </Label>
              </div>

              {formData.hasBattery && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <Label htmlFor="batteryCount">Número de Baterías *</Label>
                    <Input
                      id="batteryCount"
                      type="number"
                      min="1"
                      value={formData.batteryCount}
                      onChange={(e) => setFormData({ ...formData, batteryCount: e.target.value })}
                      placeholder="Ej: 2"
                      className={errors.batteryCount ? "border-red-500" : ""}
                    />
                    {errors.batteryCount && <p className="text-red-500 text-sm mt-1">{errors.batteryCount}</p>}
                  </div>
                  <div>
                    <Label htmlFor="batteryBrand">Marca de Baterías *</Label>
                    <Input
                      id="batteryBrand"
                      value={formData.batteryBrand}
                      onChange={(e) => setFormData({ ...formData, batteryBrand: e.target.value })}
                      placeholder="Ej: BYD"
                      className={errors.batteryBrand ? "border-red-500" : ""}
                    />
                    {errors.batteryBrand && <p className="text-red-500 text-sm mt-1">{errors.batteryBrand}</p>}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ubicación Geográfica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Ubicación Geográfica
            </CardTitle>
            <CardDescription>Las coordenadas se incluirán en el número de serie para mayor seguridad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitud *</Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="Ej: -33.4489"
                  className={errors.coordinates ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitud *</Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="Ej: -70.6693"
                  className={errors.coordinates ? "border-red-500" : ""}
                />
              </div>
            </div>
            {errors.coordinates && <p className="text-red-500 text-sm mt-1">{errors.coordinates}</p>}
            <p className="text-xs text-gray-500 mt-2">
              Formato decimal (ej: -33.4489, -70.6693). Use herramientas como Google Maps para obtener las coordenadas
              exactas.
            </p>
          </CardContent>
        </Card>

        {/* Empresa Instaladora */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              Empresa Instaladora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="installerName">Nombre de la Empresa *</Label>
                <Input
                  id="installerName"
                  value={formData.installerName}
                  onChange={(e) => setFormData({ ...formData, installerName: e.target.value })}
                  placeholder="Ej: SolarTech Chile SpA"
                  className={errors.installerName ? "border-red-500" : ""}
                />
                {errors.installerName && <p className="text-red-500 text-sm mt-1">{errors.installerName}</p>}
              </div>
              <div>
                <Label htmlFor="installerRUT">RUT de la Empresa *</Label>
                <Input
                  id="installerRUT"
                  value={formData.installerRUT}
                  onChange={(e) => setFormData({ ...formData, installerRUT: formatRUT(e.target.value) })}
                  placeholder="Ej: 76.123.456-7"
                  className={errors.installerRUT ? "border-red-500" : ""}
                />
                {errors.installerRUT && <p className="text-red-500 text-sm mt-1">{errors.installerRUT}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Nombre del Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Ej: Juan Pérez González"
                  className={errors.clientName ? "border-red-500" : ""}
                />
                {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
              </div>
              <div>
                <Label htmlFor="clientRUT">RUT del Cliente *</Label>
                <Input
                  id="clientRUT"
                  value={formData.clientRUT}
                  onChange={(e) => setFormData({ ...formData, clientRUT: formatRUT(e.target.value) })}
                  placeholder="Ej: 12.345.678-9"
                  className={errors.clientRUT ? "border-red-500" : ""}
                />
                {errors.clientRUT && <p className="text-red-500 text-sm mt-1">{errors.clientRUT}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de Envío */}
        <Card>
          <CardContent className="pt-6">
            <Alert className="mb-4">
              <AlertDescription>
                Al registrar la instalación se generará automáticamente un número de serie único que incluye información
                geográfica codificada para mayor seguridad y trazabilidad.
              </AlertDescription>
            </Alert>

            <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando y Generando Número de Serie...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Registrar Instalación y Generar Número de Serie
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
