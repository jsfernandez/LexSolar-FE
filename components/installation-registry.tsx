"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, Upload, MapPin, Building2, User, CheckCircle, AlertCircle, Trash2, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type ComponentType = "panels" | "inverters" | "batteries"

type FileLike = File

type ScannedState = {
  codes: string[]
  images: string[] // data URLs of captured code images
  brand?: string
  model?: string
}

type ComponentImagesState = {
  panels: FileLike[]
  inverters: FileLike[]
  batteries: FileLike[]
  installation: FileLike[]
}

const currentCompany = {
  name: "SolarTech Chile SpA",
  rut: "76.123.456-7",
  technician: "Técnico Responsable",
}

// Heurística simple para deducir marca/modelo desde el código
function parseCodeToDetails(code: string): { brand: string; model: string } {
  const up = code.toUpperCase()
  if (up.startsWith("JK")) return { brand: "Jinko Solar", model: "Serie JK" }
  if (up.startsWith("HW")) return { brand: "Huawei", model: "SUN" }
  if (up.startsWith("BYD")) return { brand: "BYD", model: "Battery-Box" }
  if (up.startsWith("FRN") || up.startsWith("FR")) return { brand: "Fronius", model: "Primo" }
  if (up.startsWith("GWD")) return { brand: "GoodWe", model: "GW" }
  return { brand: "Autodetectado", model: "Por código" }
}

export default function InstallationRegistry() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientRut: "",
    clientEmail: "",
    clientPhone: "",
    address: "",
    coordinates: "",
    installationDate: "",
    installerCompany: "",
    installerRut: "",
    installerTechnician: "",
    ownerType: "proveedor" as "proveedor" | "cliente",
    systemPower: "",
    panelBrand: "",
    panelModel: "",
    panelQuantity: "",
    inverterBrand: "",
    inverterModel: "",
    inverterQuantity: "",
    batteryBrand: "",
    batteryModel: "",
    batteryQuantity: "",
    observations: "",
  })

  const [componentImages, setComponentImages] = useState<ComponentImagesState>({
    panels: [],
    inverters: [],
    batteries: [],
    installation: [],
  })

  const [scanned, setScanned] = useState<Record<ComponentType, ScannedState>>({
    panels: { codes: [], images: [] },
    inverters: { codes: [], images: [] },
    batteries: { codes: [], images: [] },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [generatedRegNumber, setGeneratedRegNumber] = useState<string | null>(null)

  // Scanner modal state
  const [scannerOpen, setScannerOpen] = useState<null | ComponentType>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [manualCode, setManualCode] = useState("")

  // Legal modal
  const [legalOpen, setLegalOpen] = useState(false)
  const [legalAccepted, setLegalAccepted] = useState(false)

  // Prefill installer company data and keep read-only
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      installerCompany: currentCompany.name,
      installerRut: currentCompany.rut,
      installerTechnician: currentCompany.technician,
    }))
  }, [])

  // Camera control
  useEffect(() => {
    async function startCamera() {
      try {
        if (!scannerOpen) return
        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          })
          streamRef.current = stream
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (e) {
        // Fall back silently; user can still cargar imagen/código manual
        console.error("No se pudo acceder a la cámara:", e)
      }
    }
    startCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [scannerOpen])

  const handleImageUpload = (componentType: ComponentType, files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    setComponentImages((prev) => ({
      ...prev,
      [componentType]: [...prev[componentType], ...fileArray],
    }))
  }

  const removeImage = (componentType: ComponentType, index: number) => {
    setComponentImages((prev) => ({
      ...prev,
      [componentType]: prev[componentType].filter((_, i) => i !== index),
    }))
  }

  const handleCaptureFrame = () => {
    if (!canvasRef.current || !videoRef.current || !scannerOpen) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const w = video.videoWidth || 640
    const h = video.videoHeight || 480
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL("image/png")
    setScanned((prev) => {
      const current = prev[scannerOpen]
      return {
        ...prev,
        [scannerOpen]: {
          ...current,
          images: [...current.images, dataUrl],
        },
      }
    })
  }

  const addScannedCode = () => {
    if (!scannerOpen || !manualCode.trim()) return
    const code = manualCode.trim()
    const { brand, model } = parseCodeToDetails(code)
    setScanned((prev) => {
      const current = prev[scannerOpen]
      const nextCodes = current.codes.includes(code) ? current.codes : [...current.codes, code]
      // Set brand/model inferred from first code if not present
      return {
        ...prev,
        [scannerOpen]: {
          ...current,
          codes: nextCodes,
          brand: current.brand ?? brand,
          model: current.model ?? model,
        },
      }
    })
    // Auto ajustar cantidad para ese tipo según cantidad de códigos escaneados
    if (scannerOpen === "panels") {
      setFormData((fd) => ({
        ...fd,
        panelBrand: brand,
        panelModel: model,
        panelQuantity: String(scanned.panels.codes.length + (scanned.panels.codes.includes(code) ? 0 : 1)),
      }))
    }
    if (scannerOpen === "inverters") {
      setFormData((fd) => ({
        ...fd,
        inverterBrand: brand,
        inverterModel: model,
        inverterQuantity: String(scanned.inverters.codes.length + (scanned.inverters.codes.includes(code) ? 0 : 1)),
      }))
    }
    if (scannerOpen === "batteries") {
      setFormData((fd) => ({
        ...fd,
        batteryBrand: brand,
        batteryModel: model,
        batteryQuantity: String(scanned.batteries.codes.length + (scanned.batteries.codes.includes(code) ? 0 : 1)),
      }))
    }
    setManualCode("")
  }

  const removeScannedCode = (type: ComponentType, code: string) => {
    setScanned((prev) => {
      const nextCodes = prev[type].codes.filter((c) => c !== code)
      return {
        ...prev,
        [type]: {
          ...prev[type],
          codes: nextCodes,
        },
      }
    })
    // Sincronizar cantidad si se estaba autoajustando
    if (type === "panels") {
      setFormData((fd) => ({
        ...fd,
        panelQuantity: String(Math.max(0, (Number.parseInt(fd.panelQuantity || "0") || 0) - 1)),
      }))
    }
    if (type === "inverters") {
      setFormData((fd) => ({
        ...fd,
        inverterQuantity: String(Math.max(0, (Number.parseInt(fd.inverterQuantity || "0") || 0) - 1)),
      }))
    }
    if (type === "batteries") {
      setFormData((fd) => ({
        ...fd,
        batteryQuantity: String(Math.max(0, (Number.parseInt(fd.batteryQuantity || "0") || 0) - 1)),
      }))
    }
  }

  // Computa si se requiere grabado (si faltan códigos para cubrir cantidad)
  const engravingNeeded = useMemo(() => {
    const pQty = Number.parseInt(formData.panelQuantity || "0") || 0
    const iQty = Number.parseInt(formData.inverterQuantity || "0") || 0
    const bQty = Number.parseInt(formData.batteryQuantity || "0") || 0

    const panelsOk = pQty === 0 || scanned.panels.codes.length >= pQty
    const invertersOk = iQty === 0 || scanned.inverters.codes.length >= iQty
    const batteriesOk = bQty === 0 || scanned.batteries.codes.length >= bQty

    return !(panelsOk && invertersOk && batteriesOk)
  }, [formData.panelQuantity, formData.inverterQuantity, formData.batteryQuantity, scanned])

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const reg = `INS-${Date.now()}`
    setGeneratedRegNumber(reg)
    setSubmitSuccess(true)
    setIsSubmitting(false)

    // Limpiar formulario después de 3 segundos (mantener demo UX)
    setTimeout(() => {
      setSubmitSuccess(false)
      setGeneratedRegNumber(null)
      setLegalAccepted(false)
      setLegalOpen(false)
      setFormData({
        clientName: "",
        clientRut: "",
        clientEmail: "",
        clientPhone: "",
        address: "",
        coordinates: "",
        installationDate: "",
        installerCompany: currentCompany.name,
        installerRut: currentCompany.rut,
        installerTechnician: currentCompany.technician,
        ownerType: "proveedor",
        systemPower: "",
        panelBrand: "",
        panelModel: "",
        panelQuantity: "",
        inverterBrand: "",
        inverterModel: "",
        inverterQuantity: "",
        batteryBrand: "",
        batteryModel: "",
        batteryQuantity: "",
        observations: "",
      })
      setComponentImages({
        panels: [],
        inverters: [],
        batteries: [],
        installation: [],
      })
      setScanned({
        panels: { codes: [], images: [] },
        inverters: { codes: [], images: [] },
        batteries: { codes: [], images: [] },
      })
    }, 3000)
  }

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">¡Instalación Registrada Exitosamente!</h2>
              <p className="text-green-700 mb-4">
                {engravingNeeded
                  ? "La instalación ha sido registrada y se ha generado una solicitud para el proceso de grabado (componentes sin código)."
                  : "La instalación ha sido registrada. Los componentes con código no requieren proceso de grabado."}
              </p>
              <div className="bg-white p-4 rounded-lg border border-green-200 mb-4 text-left">
                <p className="text-sm text-gray-600">
                  <strong>Número de Registro:</strong> {generatedRegNumber}
                </p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <strong>Paneles:</strong>{" "}
                    {scanned.panels.codes.length > 0
                      ? `${scanned.panels.codes.length} con código`
                      : formData.panelQuantity || 0}
                  </div>
                  <div>
                    <strong>Inversores:</strong>{" "}
                    {scanned.inverters.codes.length > 0
                      ? `${scanned.inverters.codes.length} con código`
                      : formData.inverterQuantity || 0}
                  </div>
                  <div>
                    <strong>Baterías:</strong>{" "}
                    {scanned.batteries.codes.length > 0
                      ? `${scanned.batteries.codes.length} con código`
                      : formData.batteryQuantity || 0}
                  </div>
                  <div>
                    <strong>Estado Grabado:</strong>{" "}
                    <Badge
                      variant="outline"
                      className={
                        engravingNeeded ? "text-orange-600 border-orange-600" : "text-green-600 border-green-600"
                      }
                    >
                      {engravingNeeded ? "Requiere Grabado" : "No Requiere Grabado"}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={() => (window.location.href = "/dashboard")} className="w-full">
                Volver al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const installImagesRequired = componentImages.installation.length === 0

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Nueva Instalación</h1>
        <p className="text-gray-600">Complete la información de la instalación fotovoltaica</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Información del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ubicación e Instalación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación e Instalación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Dirección Completa *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coordinates">Coordenadas GPS</Label>
                <Input
                  id="coordinates"
                  placeholder="-33.4489, -70.6693"
                  value={formData.coordinates}
                  onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="installationDate">Fecha de Instalación *</Label>
                <Input
                  id="installationDate"
                  type="date"
                  value={formData.installationDate}
                  onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empresa Instaladora */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Empresa Instaladora
            </CardTitle>
            <CardDescription>Estos datos se autocompletan desde tu empresa</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="installerCompany">Nombre de la Empresa *</Label>
              <Input id="installerCompany" value={formData.installerCompany} readOnly />
            </div>
            <div>
              <Label htmlFor="installerRut">RUT de la Empresa *</Label>
              <Input id="installerRut" value={formData.installerRut} readOnly />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="installerTechnician">Técnico Responsable *</Label>
              <Input id="installerTechnician" value={formData.installerTechnician} readOnly />
            </div>
          </CardContent>
        </Card>

        {/* Propietario de Componentes */}
        <Card>
          <CardHeader>
            <CardTitle>Propietario de los Componentes</CardTitle>
            <CardDescription>Define la propiedad para futuros procesos de reutilización/venta</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.ownerType}
              onValueChange={(v: "proveedor" | "cliente") => setFormData((fd) => ({ ...fd, ownerType: v }))}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem id="owner-prov" value="proveedor" />
                <Label htmlFor="owner-prov">Proveedor es dueño de los componentes</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem id="owner-cli" value="cliente" />
                <Label htmlFor="owner-cli">Cliente es dueño de los componentes</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Componentes del Sistema */}
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle>Componentes del Sistema</CardTitle>
            <CardDescription>
              - Si escaneas los códigos, marca/modelo se autocompletan y no se requiere grabado. Solo debes indicar la
              cantidad.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="systemPower">Potencia del Sistema (kW) *</Label>
              <Input
                id="systemPower"
                type="number"
                step="0.1"
                value={formData.systemPower}
                onChange={(e) => setFormData({ ...formData, systemPower: e.target.value })}
                required
              />
            </div>

            {/* Paneles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Paneles Solares</Label>
                <Button variant="outline" size="sm" onClick={() => setScannerOpen("panels")} type="button">
                  <QrCode className="h-4 w-4 mr-2" />
                  Escanear código
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="panelBrand">Marca {scanned.panels.codes.length > 0 && "(auto)"}</Label>
                  <Input
                    id="panelBrand"
                    value={scanned.panels.brand ?? formData.panelBrand}
                    onChange={(e) => setFormData({ ...formData, panelBrand: e.target.value })}
                    disabled={scanned.panels.codes.length > 0}
                    placeholder={scanned.panels.codes.length > 0 ? "Autodetectado por código" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="panelModel">Modelo {scanned.panels.codes.length > 0 && "(auto)"}</Label>
                  <Input
                    id="panelModel"
                    value={scanned.panels.model ?? formData.panelModel}
                    onChange={(e) => setFormData({ ...formData, panelModel: e.target.value })}
                    disabled={scanned.panels.codes.length > 0}
                    placeholder={scanned.panels.codes.length > 0 ? "Autodetectado por código" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="panelQuantity">Cantidad *</Label>
                  <Input
                    id="panelQuantity"
                    type="number"
                    value={formData.panelQuantity}
                    onChange={(e) => setFormData({ ...formData, panelQuantity: e.target.value })}
                    placeholder={scanned.panels.codes.length > 0 ? `Escaneados: ${scanned.panels.codes.length}` : ""}
                  />
                </div>
              </div>

              {scanned.panels.codes.length > 0 && (
                <CodesPreview
                  title="Códigos de paneles escaneados"
                  codes={scanned.panels.codes}
                  images={scanned.panels.images}
                  onRemove={(code) => removeScannedCode("panels", code)}
                />
              )}
            </div>

            <Separator />

            {/* Inversores */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Inversores</Label>
                <Button variant="outline" size="sm" onClick={() => setScannerOpen("inverters")} type="button">
                  <QrCode className="h-4 w-4 mr-2" />
                  Escanear código
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="inverterBrand">Marca {scanned.inverters.codes.length > 0 && "(auto)"}</Label>
                  <Input
                    id="inverterBrand"
                    value={scanned.inverters.brand ?? formData.inverterBrand}
                    onChange={(e) => setFormData({ ...formData, inverterBrand: e.target.value })}
                    disabled={scanned.inverters.codes.length > 0}
                    placeholder={scanned.inverters.codes.length > 0 ? "Autodetectado por código" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="inverterModel">Modelo {scanned.inverters.codes.length > 0 && "(auto)"}</Label>
                  <Input
                    id="inverterModel"
                    value={scanned.inverters.model ?? formData.inverterModel}
                    onChange={(e) => setFormData({ ...formData, inverterModel: e.target.value })}
                    disabled={scanned.inverters.codes.length > 0}
                    placeholder={scanned.inverters.codes.length > 0 ? "Autodetectado por código" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="inverterQuantity">Cantidad *</Label>
                  <Input
                    id="inverterQuantity"
                    type="number"
                    value={formData.inverterQuantity}
                    onChange={(e) => setFormData({ ...formData, inverterQuantity: e.target.value })}
                    placeholder={
                      scanned.inverters.codes.length > 0 ? `Escaneados: ${scanned.inverters.codes.length}` : ""
                    }
                  />
                </div>
              </div>

              {scanned.inverters.codes.length > 0 && (
                <CodesPreview
                  title="Códigos de inversores escaneados"
                  codes={scanned.inverters.codes}
                  images={scanned.inverters.images}
                  onRemove={(code) => removeScannedCode("inverters", code)}
                />
              )}
            </div>

            <Separator />

            {/* Baterías */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Baterías</Label>
                <Button variant="outline" size="sm" onClick={() => setScannerOpen("batteries")} type="button">
                  <QrCode className="h-4 w-4 mr-2" />
                  Escanear código
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="batteryBrand">Marca {scanned.batteries.codes.length > 0 && "(auto)"}</Label>
                  <Input
                    id="batteryBrand"
                    value={scanned.batteries.brand ?? formData.batteryBrand}
                    onChange={(e) => setFormData({ ...formData, batteryBrand: e.target.value })}
                    disabled={scanned.batteries.codes.length > 0}
                    placeholder={scanned.batteries.codes.length > 0 ? "Autodetectado por código" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="batteryModel">Modelo {scanned.batteries.codes.length > 0 && "(auto)"}</Label>
                  <Input
                    id="batteryModel"
                    value={scanned.batteries.model ?? formData.batteryModel}
                    onChange={(e) => setFormData({ ...formData, batteryModel: e.target.value })}
                    disabled={scanned.batteries.codes.length > 0}
                    placeholder={scanned.batteries.codes.length > 0 ? "Autodetectado por código" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="batteryQuantity">Cantidad</Label>
                  <Input
                    id="batteryQuantity"
                    type="number"
                    value={formData.batteryQuantity}
                    onChange={(e) => setFormData({ ...formData, batteryQuantity: e.target.value })}
                    placeholder={
                      scanned.batteries.codes.length > 0 ? `Escaneados: ${scanned.batteries.codes.length}` : ""
                    }
                  />
                </div>
              </div>

              {scanned.batteries.codes.length > 0 && (
                <CodesPreview
                  title="Códigos de baterías escaneados"
                  codes={scanned.batteries.codes}
                  images={scanned.batteries.images}
                  onRemove={(code) => removeScannedCode("batteries", code)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documentación Fotográfica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Fotografías de Instalación Terminada (Obligatorias)
            </CardTitle>
            <CardDescription>
              Sube imágenes de la instalación terminada para validar el uso de los códigos en la dirección designada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Instalación Completa *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload("installation", e.target.files)}
                  className="hidden"
                  id="installation-images"
                />
                <label htmlFor="installation-images" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Haga clic para subir fotos de la instalación</span>
                </label>
                {componentImages.installation.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {componentImages.installation.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={
                            URL.createObjectURL(file) ||
                            "/placeholder.svg?height=80&width=120&query=installation-finish-photo"
                          }
                          alt={`Instalación ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage("installation", index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          aria-label="Eliminar imagen"
                          title="Eliminar imagen"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Observaciones Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ingrese cualquier observación adicional sobre la instalación..."
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
            Las imágenes de la instalación terminada son obligatorias.
          </div>
          <Button
            type="button"
            size="lg"
            disabled={isSubmitting || installImagesRequired}
            className="min-w-[220px]"
            onClick={() => setLegalOpen(true)}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registrando...
              </>
            ) : (
              "Registrar Instalación"
            )}
          </Button>
        </div>
      </form>

      {/* Scanner Dialog */}
      <Dialog open={!!scannerOpen} onOpenChange={(open) => !open && setScannerOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Escanear código{" "}
              {scannerOpen === "panels" ? "de Panel" : scannerOpen === "inverters" ? "de Inversor" : "de Batería"}
            </DialogTitle>
            <DialogDescription>
              Permite acceso a la cámara para capturar la imagen del código. Agrega el código leído para asociarlo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="relative w-full aspect-video bg-black/80 rounded">
                <video ref={videoRef} className="w-full h-full object-contain rounded" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={handleCaptureFrame}>
                  <Camera className="h-4 w-4 mr-2" />
                  Capturar imagen del código
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Sugerencia: acerca el código QR/Barra y mantén el pulso. La imagen se guardará junto al código.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="manualCode">Código detectado o manual</Label>
              <div className="flex gap-2">
                <Input
                  id="manualCode"
                  placeholder="Ej: JK-2025-ABC12345"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                />
                <Button type="button" onClick={addScannedCode} disabled={!manualCode.trim()}>
                  Agregar
                </Button>
              </div>

              {!!scannerOpen && scanned[scannerOpen].codes.length > 0 && (
                <div className="border rounded p-2 max-h-48 overflow-auto">
                  <div className="text-sm font-medium mb-2">Códigos añadidos</div>
                  <div className="flex flex-wrap gap-2">
                    {scanned[scannerOpen].codes.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 border rounded px-2 py-1 text-xs bg-gray-50"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() => removeScannedCode(scannerOpen, c)}
                          className="hover:text-red-600"
                          aria-label={`Eliminar ${c}`}
                          title={`Eliminar ${c}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!!scannerOpen && scanned[scannerOpen].images.length > 0 && (
                <div className="border rounded p-2 max-h-48 overflow-auto">
                  <div className="text-sm font-medium mb-2">Imágenes capturadas</div>
                  <div className="grid grid-cols-3 gap-2">
                    {scanned[scannerOpen].images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img || "/placeholder.svg"}
                        alt={`Captura ${idx + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setScannerOpen(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Legal Declaration Dialog */}
      <Dialog open={legalOpen} onOpenChange={setLegalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Declaración y Autorización</DialogTitle>
            <DialogDescription>Antes de registrar, confirma la siguiente declaración.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border rounded p-3 bg-gray-50 text-sm leading-relaxed">
              {
                "Al aceptar declaro que todos los datos entregados son veridicos y que autorizo a que puedan ser verificados por un fiscalizador y de encontrarse cualquier infraccion puedan ejercerce todos los procesos legales que estima la ley"
              }
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="legal-accept"
                checked={legalAccepted}
                onCheckedChange={(v) => setLegalAccepted(Boolean(v))}
              />
              <Label htmlFor="legal-accept">Acepto la declaración anterior</Label>
            </div>

            <div className="text-xs text-gray-500">
              Nota: Los componentes con código escaneado no requieren grabado; se almacenará la imagen del código. Debes
              adjuntar imágenes de la instalación terminada.
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setLegalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!legalAccepted || isSubmitting}>
              {isSubmitting ? "Registrando..." : "Confirmar y Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CodesPreview({
  title,
  codes,
  images,
  onRemove,
}: {
  title: string
  codes: string[]
  images: string[]
  onRemove: (code: string) => void
}) {
  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-gray-500">{images.length} imagen(es) capturadas</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {codes.map((code) => (
          <span key={code} className="inline-flex items-center gap-1 border rounded px-2 py-1 text-xs bg-gray-50">
            {code}
            <button
              type="button"
              onClick={() => onRemove(code)}
              className="hover:text-red-600"
              aria-label={`Eliminar ${code}`}
              title={`Eliminar ${code}`}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img || "/placeholder.svg"}
              alt={`Código ${idx + 1}`}
              className="w-full h-20 object-cover rounded border"
            />
          ))}
        </div>
      )}
    </div>
  )
}
