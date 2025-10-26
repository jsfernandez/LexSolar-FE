"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WhatsAppAgent from "@/components/whatsapp-agent"
import { Search, Filter, MapPin, Calendar, Zap, Users, Building2, Eye, MoreHorizontal, CheckCircle, Clock, AlertTriangle, XCircle, TrendingUp, Activity, Shield, Trash2, Plus } from 'lucide-react'
// importación eliminada
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

interface User {
  id: string
  name: string
  email: string
  role: string
  company?: string
}

type StatusChoice = "active" | "stolen" | "dismantled" | "relocating"
type DismantleDestination = "for_sale" | "sold" | "reuse"

type LineItem = {
  typeKey: string
  quantity: number
  codes: string // lista separada por coma o saltos de línea
}

export default function InstallationsPage() {
  const [installations, setInstallations] = useState<Installation[]>([])
  const [filteredInstallations, setFilteredInstallations] = useState<Installation[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Dialog de detalles
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null)

  // Cambio de estado
  const [statusChoice, setStatusChoice] = useState<StatusChoice>("active")

  // Robado
  const [stolenNote, setStolenNote] = useState("")
  const [stolenReportMode, setStolenReportMode] = useState<"all" | "partial">("all")
  const [stolenLines, setStolenLines] = useState<LineItem[]>([{ typeKey: "", quantity: 0, codes: "" }])

  // Recuperación desde robado
  const [confirmFullRecovery, setConfirmFullRecovery] = useState(false)
  const [recoveredSelection, setRecoveredSelection] = useState<Record<string, Record<string, boolean>>>({})

  // Desmantelada
  const [destination, setDestination] = useState<DismantleDestination>("for_sale")
  const [selectedComponentTypes, setSelectedComponentTypes] = useState<Record<string, boolean>>({})
  const [soldLines, setSoldLines] = useState<LineItem[]>([{ typeKey: "", quantity: 0, codes: "" }])
  const [reuseLines, setReuseLines] = useState<LineItem[]>([{ typeKey: "", quantity: 0, codes: "" }])
  const [confirmProviderOwner, setConfirmProviderOwner] = useState(false)

  // Reubicación
  const [relocateAddress, setRelocateAddress] = useState("")
  const [relocateCommune, setRelocateCommune] = useState("")
  const [relocateRegion, setRelocateRegion] = useState("")
  const [relocateLat, setRelocateLat] = useState<string>("")
  const [relocateLng, setRelocateLng] = useState<string>("")

  const availableComponentTypes = useMemo(() => {
    if (!selectedInstallation) return []
    return Object.entries((selectedInstallation as any).components || {})
      .filter(([_, v]: any) => v && (v.quantity || 0) > 0)
      .map(([k, v]: any) => ({
        key: k as string,
        label: k.charAt(0).toUpperCase() + k.slice(1),
        quantity: Number(v.quantity) || 0,
      }))
  }, [selectedInstallation])

  const validateCoordinates = (lat: string, lng: string) => {
    const la = parseFloat(lat)
    const ln = parseFloat(lng)
    return !Number.isNaN(la) && !Number.isNaN(ln) && la >= -90 && la <= 90 && ln >= -180 && ln <= 180
  }

  const parseCodes = (codes: string): string[] =>
    codes
      .split(/[\n,]/g)
      .map((c) => c.trim())
      .filter(Boolean)

  const typeMaxAvailable = (typeKey: string): number => {
    const t = availableComponentTypes.find((t) => t.key === typeKey)
    return t?.quantity ?? 0
  }

  const validateLines = (lines: LineItem[]) => {
    if (lines.length === 0) return "Agregue al menos una línea."
    // Validar duplicados globales
    const globalCodes = new Set<string>()
    for (const line of lines) {
      if (!line.typeKey) return "Seleccione el tipo de componente."
      if (!line.quantity || line.quantity <= 0) return "Ingrese una cantidad válida."
      const max = typeMaxAvailable(line.typeKey)
      if (line.quantity > max) return `La cantidad para ${line.typeKey} excede el disponible (${max}).`
      const codes = parseCodes(line.codes)
      if (codes.length !== line.quantity) return `La cantidad de códigos debe coincidir con la cantidad (${line.quantity}).`
      for (const code of codes) {
        const key = `${line.typeKey}::${code}`
        if (globalCodes.has(key)) return `Código duplicado detectado: ${code} en ${line.typeKey}.`
        globalCodes.add(key)
      }
    }
    return null
  }

  const applyQuantityDeduction = (updated: any, lines: LineItem[]) => {
    if (!updated.components) return
    for (const line of lines) {
      const current = updated.components[line.typeKey]
      if (current && typeof current.quantity === "number") {
        current.quantity = Math.max(0, current.quantity - line.quantity)
      }
      // Registrar último movimiento
      if (!updated.lastMovement) updated.lastMovement = {}
      updated.lastMovement[line.typeKey] = {
        when: new Date().toISOString(),
        movedCodes: parseCodes(line.codes),
      }
    }
  }

  const applyQuantityAddition = (updated: any, recoveryMap: Record<string, string[]>) => {
    if (!updated.components) return
    for (const [typeKey, codes] of Object.entries(recoveryMap)) {
      const current = updated.components[typeKey]
      const qty = codes.length
      if (current && typeof current.quantity === "number") {
        current.quantity = current.quantity + qty
      }
      if (!updated.lastRecovery) updated.lastRecovery = {}
      updated.lastRecovery[typeKey] = {
        when: new Date().toISOString(),
        recoveredCodes: codes,
      }
    }
  }

  const openDetails = (installation: Installation) => {
    setSelectedInstallation(installation)
    // Map status → elección
    if (installation.status === "stolen_components") {
      setStatusChoice("stolen")
    } else if (installation.status === "inactive") {
      setStatusChoice("dismantled")
    } else {
      setStatusChoice("active")
    }

    // Defaults de desmantelada
    const types: Record<string, boolean> = {}
    Object.entries((installation as any).components || {}).forEach(([key, value]: any) => {
      if (value && (value.quantity || 0) > 0) types[key] = false
    })
    setSelectedComponentTypes(types)
    setDestination("for_sale")
    setSoldLines([{ typeKey: "", quantity: 0, codes: "" }])
    setReuseLines([{ typeKey: "", quantity: 0, codes: "" }])
    setConfirmProviderOwner(false)

    // Robado
    setStolenNote("")
    setStolenReportMode("all")
    setStolenLines([{ typeKey: "", quantity: 0, codes: "" }])
    setConfirmFullRecovery(false)
    setRecoveredSelection({})

    // Reubicación
    setRelocateAddress((installation as any).location?.address || "")
    setRelocateCommune((installation as any).location?.commune || "")
    setRelocateRegion((installation as any).location?.region || "")
    setRelocateLat((installation as any).location?.coordinates?.lat?.toString() ?? "")
    setRelocateLng((installation as any).location?.coordinates?.lng?.toString() ?? "")

    setDetailsOpen(true)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const userData = localStorage.getItem("currentUser")
        if (userData) {
          const user = JSON.parse(userData)
          setCurrentUser(user)
        }
  // TODO: Reemplazar por llamada real a la API
        setInstallations(installationsData)
        setFilteredInstallations(installationsData)
      } catch (error) {
        console.error("Error loading installations:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Filtrar instalaciones
  useEffect(() => {
    let filtered = installations

    if (searchTerm) {
      filtered = filtered.filter((installation) =>
        installation.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.installer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.location.commune.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((installation) => installation.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((installation) => installation.systemType === typeFilter)
    }

    setFilteredInstallations(filtered)
  }, [installations, searchTerm, statusFilter, typeFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activo
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Inactivo
          </Badge>
        )
      case "pending_engraving":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente Grabado
          </Badge>
        )
      case "stolen_components":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Componentes Robados
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "residential":
        return "Residencial"
      case "commercial":
        return "Comercial"
      case "industrial":
        return "Industrial"
      case "utility":
        return "Utilidad"
      default:
        return type
    }
  }

  const stats = {
    total: installations.length,
    active: installations.filter((i) => i.status === "active").length,
    pending: installations.filter((i) => i.status === "pending_engraving").length,
    inactive: installations.filter((i) => i.status === "inactive").length,
    stolen: installations.filter((i) => i.status === "stolen_components").length,
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando instalaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Instalaciones Fotovoltaicas</h2>
          <p className="text-muted-foreground">Gestión y seguimiento de instalaciones registradas</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Activity className="h-3 w-3 mr-1" />
          {filteredInstallations.length} Instalaciones
        </Badge>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Instalaciones registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Esperando grabado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Robos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.stolen}</div>
            <p className="text-xs text-muted-foreground">Componentes robados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
          <CardDescription>Utilice los filtros para encontrar instalaciones específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Sistema, cliente, instalador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="pending_engraving">Pendiente Grabado</SelectItem>
                  <SelectItem value="stolen_components">Componentes Robados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type-filter">Tipo de Sistema</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="residential">Residencial</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="utility">Utilidad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Acciones</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setTypeFilter("all")
                  }}
                >
                  Limpiar
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Más filtros
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de instalaciones */}
      <div className="space-y-4">
        {filteredInstallations.length > 0 ? (
          filteredInstallations.map((installation) => (
            <Card key={installation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{installation.systemName}</CardTitle>
                      {getStatusBadge(installation.status)}
                      <Badge variant="outline">{getTypeLabel(installation.systemType)}</Badge>
                    </div>
                    <CardDescription>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Cliente: {installation.client.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>Instalador: {installation.installer.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          <span>Potencia: {installation.totalPower}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openDetails(installation)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Ubicación:</span>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {installation.location.commune}, {installation.location.region}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Fecha Registro:</span>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(installation.registrationDate).toLocaleDateString("es-CL")}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Componentes:</span>
                    <p>
                      {Object.values(installation.components).reduce(
                        (total: number, comp: any) => total + (comp?.quantity || 0),
                        0
                      )}{" "}
                      registrados
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Generación Estimada:</span>
                    <p>{installation.estimatedGeneration}</p>
                  </div>
                </div>

                {installation.inspector && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Inspeccionado por:</span>
                      <span>{installation.inspector.name}</span>
                      {installation.inspectionDate && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>{new Date(installation.inspectionDate).toLocaleDateString("es-CL")}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron instalaciones</h3>
              <p className="text-gray-600 text-center mb-4">No hay instalaciones que coincidan con los filtros seleccionados.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setTypeFilter("all")
                }}
              >
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Diálogo: Detalles + cambio estado */}
      {selectedInstallation && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedInstallation.systemName}</span>
                {getStatusBadge(selectedInstallation.status)}
              </DialogTitle>
              <DialogDescription>Detalles y cambio de estado de la instalación</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Resumen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Cliente:</span> {selectedInstallation.client.name}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Instalador:</span> {selectedInstallation.installer.company}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ubicación:</span>{" "}
                  {(selectedInstallation as any).location?.address}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Potencia:</span> {selectedInstallation.totalPower}
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600">Componentes registrados:</span>{" "}
                  {availableComponentTypes.map((t) => `${t.label} (${t.quantity})`).join(", ") || "N/A"}
                </div>
              </div>

              {/* Elección de estado */}
              <div className="border-t pt-4">
                <Label className="mb-2 block">Cambiar estado</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant={statusChoice === "active" ? "default" : "outline"}
                    onClick={() => setStatusChoice("active")}
                  >
                    Activo
                  </Button>
                  <Button
                    variant={statusChoice === "stolen" ? "default" : "outline"}
                    onClick={() => setStatusChoice("stolen")}
                  >
                    Robado
                  </Button>
                  <Button
                    variant={statusChoice === "dismantled" ? "default" : "outline"}
                    onClick={() => setStatusChoice("dismantled")}
                  >
                    Desmantelada
                  </Button>
                  <Button
                    variant={statusChoice === "relocating" ? "default" : "outline"}
                    onClick={() => setStatusChoice("relocating")}
                  >
                    En reubicación
                  </Button>
                </div>
              </div>

              {/* Robado: reporte total o parcial */}
              {statusChoice === "stolen" && (
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Puede reportar toda la instalación como robada o seleccionar componentes específicos por código.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de reporte</Label>
                      <Select value={stolenReportMode} onValueChange={(v: "all" | "partial") => setStolenReportMode(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toda la instalación</SelectItem>
                          <SelectItem value="partial">Componentes específicos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {stolenReportMode === "partial" && (
                    <div className="space-y-3">
                      <Label className="block">Detalle de componentes robados</Label>
                      {stolenLines.map((line, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2 border rounded-md">
                          <div className="md:col-span-2">
                            <Label>Tipo</Label>
                            <Select
                              value={line.typeKey}
                              onValueChange={(v) =>
                                setStolenLines((prev) => prev.map((l, i) => (i === idx ? { ...l, typeKey: v } : l)))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableComponentTypes.map((t) => (
                                  <SelectItem key={t.key} value={t.key}>
                                    {t.label} (disp: {t.quantity})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Cantidad</Label>
                            <Input
                              type="number"
                              min={0}
                              max={typeMaxAvailable(line.typeKey) || undefined}
                              value={line.quantity || ""}
                              onChange={(e) =>
                                setStolenLines((prev) =>
                                  prev.map((l, i) =>
                                    i === idx ? { ...l, quantity: Number(e.target.value || 0) } : l
                                  )
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Códigos (separados por coma o nueva línea)</Label>
                            <Textarea
                              rows={2}
                              placeholder="Ej: ABC123, XYZ999"
                              value={line.codes}
                              onChange={(e) =>
                                setStolenLines((prev) => prev.map((l, i) => (i === idx ? { ...l, codes: e.target.value } : l)))
                              }
                            />
                          </div>
                          <div className="col-span-full flex justify-end">
                            {stolenLines.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setStolenLines((prev) => prev.filter((_, i) => i !== idx))}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Quitar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setStolenLines((prev) => [...prev, { typeKey: "", quantity: 0, codes: "" }])}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar línea
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="stolen-note">Observaciones (opcional)</Label>
                    <Textarea
                      id="stolen-note"
                      placeholder="Detalles del robo, denuncia, etc."
                      value={stolenNote}
                      onChange={(e) => setStolenNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Activo: recuperación desde robado */}
              {statusChoice === "active" && selectedInstallation.status === "stolen_components" && (
                <div className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Seleccione qué fue recuperado para volver a estado ACTIVO.
                    </AlertDescription>
                  </Alert>

                  {(() => {
                    const outstandingAll = (selectedInstallation as any).theftOutstandingAll === true
                    const outstandingMap =
                      ((selectedInstallation as any).theftOutstanding as Record<string, string[]>) || {}

                    if (outstandingAll) {
                      return (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={confirmFullRecovery}
                            onCheckedChange={(checked) => setConfirmFullRecovery(!!checked)}
                          />
                          <span className="text-sm">
                            Confirmo que toda la instalación ha sido recuperada.
                          </span>
                        </div>
                      )
                    }

                    const typeKeys = Object.keys(outstandingMap)
                    if (typeKeys.length === 0) {
                      return <p className="text-sm text-muted-foreground">No hay elementos robados pendientes de recuperar.</p>
                    }

                    return (
                      <div className="space-y-3">
                        {typeKeys.map((typeKey) => {
                          const codes = outstandingMap[typeKey]
                          const sel = recoveredSelection[typeKey] || {}
                          return (
                            <div key={typeKey} className="p-2 border rounded-md">
                              <div className="mb-2 font-medium text-sm">{typeKey} — {codes.length} código(s) robado(s)</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {codes.map((code) => (
                                  <label key={code} className="flex items-center gap-2 p-2 border rounded">
                                    <Checkbox
                                      checked={!!sel[code]}
                                      onCheckedChange={(checked) =>
                                        setRecoveredSelection((prev) => ({
                                          ...prev,
                                          [typeKey]: { ...(prev[typeKey] || {}), [code]: !!checked },
                                        }))
                                      }
                                    />
                                    <span className="text-xs">{code}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                        <p className="text-xs text-muted-foreground">
                          Nota: Debe recuperar todos los códigos robados para volver a estado ACTIVO.
                        </p>
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Desmantelada */}
              {statusChoice === "dismantled" && (
                <div className="space-y-4">
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <Trash2 className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      La instalación quedará INACTIVA. Seleccione el destino de los componentes.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Destino</Label>
                      <Select value={destination} onValueChange={(v: DismantleDestination) => setDestination(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="for_sale">A la venta</SelectItem>
                          <SelectItem value="sold">Vendidos</SelectItem>
                          <SelectItem value="reuse">En reutilización</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {destination === "for_sale" && (
                    <div>
                      <Label className="mb-2 block">Componentes a publicar</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {availableComponentTypes.length > 0 ? (
                          availableComponentTypes.map((t) => (
                            <label key={t.key} className="flex items-center gap-2 p-2 border rounded-md">
                              <Checkbox
                                checked={!!selectedComponentTypes[t.key]}
                                onCheckedChange={(checked) =>
                                  setSelectedComponentTypes((prev) => ({ ...prev, [t.key]: !!checked }))
                                }
                              />
                              <span className="text-sm">
                                {t.label} — {t.quantity} unidad(es)
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No hay componentes disponibles.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {destination === "sold" && (
                    <div className="space-y-3">
                      <Label className="block">Detalle de componentes vendidos</Label>
                      {soldLines.map((line, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2 border rounded-md">
                          <div className="md:col-span-2">
                            <Label>Tipo</Label>
                            <Select
                              value={line.typeKey}
                              onValueChange={(v) =>
                                setSoldLines((prev) => prev.map((l, i) => (i === idx ? { ...l, typeKey: v } : l)))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableComponentTypes.map((t) => (
                                  <SelectItem key={t.key} value={t.key}>
                                    {t.label} (disp: {t.quantity})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Cantidad</Label>
                            <Input
                              type="number"
                              min={0}
                              max={typeMaxAvailable(line.typeKey) || undefined}
                              value={line.quantity || ""}
                              onChange={(e) =>
                                setSoldLines((prev) =>
                                  prev.map((l, i) =>
                                    i === idx ? { ...l, quantity: Number(e.target.value || 0) } : l
                                  )
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Códigos (separados por coma o nueva línea)</Label>
                            <Textarea
                              rows={2}
                              placeholder="Ej: ABC123, XYZ999"
                              value={line.codes}
                              onChange={(e) =>
                                setSoldLines((prev) => prev.map((l, i) => (i === idx ? { ...l, codes: e.target.value } : l)))
                              }
                            />
                          </div>
                          <div className="col-span-full flex justify-end">
                            {soldLines.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setSoldLines((prev) => prev.filter((_, i) => i !== idx))}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Quitar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSoldLines((prev) => [...prev, { typeKey: "", quantity: 0, codes: "" }])}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar línea
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Nota: El comprador asociará estos códigos a su instalación posteriormente.
                      </p>
                    </div>
                  )}

                  {destination === "reuse" && (
                    <div className="space-y-3">
                      <Alert className="border-blue-200 bg-blue-50">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          Solo procede si el proveedor es dueño de los componentes.
                        </AlertDescription>
                      </Alert>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={(selectedInstallation as any).componentOwner === "provider" || confirmProviderOwner}
                          onCheckedChange={(checked) => setConfirmProviderOwner(!!checked)}
                          disabled={(selectedInstallation as any).componentOwner === "provider"}
                        />
                        <span className="text-sm">
                          Confirmo que el proveedor es dueño de los componentes
                          {(selectedInstallation as any).componentOwner === "provider" ? " (verificado)" : ""}
                        </span>
                      </div>

                      {reuseLines.map((line, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2 border rounded-md">
                          <div className="md:col-span-2">
                            <Label>Tipo</Label>
                            <Select
                              value={line.typeKey}
                              onValueChange={(v) =>
                                setReuseLines((prev) => prev.map((l, i) => (i === idx ? { ...l, typeKey: v } : l)))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableComponentTypes.map((t) => (
                                  <SelectItem key={t.key} value={t.key}>
                                    {t.label} (disp: {t.quantity})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Cantidad</Label>
                            <Input
                              type="number"
                              min={0}
                              max={typeMaxAvailable(line.typeKey) || undefined}
                              value={line.quantity || ""}
                              onChange={(e) =>
                                setReuseLines((prev) =>
                                  prev.map((l, i) =>
                                    i === idx ? { ...l, quantity: Number(e.target.value || 0) } : l
                                  )
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Códigos (separados por coma o nueva línea)</Label>
                            <Textarea
                              rows={2}
                              placeholder="Ej: ABC123, XYZ999"
                              value={line.codes}
                              onChange={(e) =>
                                setReuseLines((prev) => prev.map((l, i) => (i === idx ? { ...l, codes: e.target.value } : l)))
                              }
                            />
                          </div>
                          <div className="col-span-full flex justify-end">
                            {reuseLines.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setReuseLines((prev) => prev.filter((_, i) => i !== idx))}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Quitar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setReuseLines((prev) => [...prev, { typeKey: "", quantity: 0, codes: "" }])}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar línea
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Estos componentes podrán registrarse en otra instalación del mismo proveedor.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* En reubicación */}
              {statusChoice === "relocating" && (
                <div className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Ingrese la nueva ubicación. Al guardar, la instalación quedará ACTIVA con la nueva dirección.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="relocate-address">Dirección completa</Label>
                      <Textarea
                        id="relocate-address"
                        value={relocateAddress}
                        onChange={(e) => setRelocateAddress(e.target.value)}
                        rows={2}
                        placeholder="Calle, número, comuna, región"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="relocate-commune">Comuna</Label>
                        <Input
                          id="relocate-commune"
                          value={relocateCommune}
                          onChange={(e) => setRelocateCommune(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="relocate-region">Región</Label>
                        <Input
                          id="relocate-region"
                          value={relocateRegion}
                          onChange={(e) => setRelocateRegion(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Coordenadas</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Lat"
                            value={relocateLat}
                            onChange={(e) => setRelocateLat(e.target.value)}
                          />
                          <Input
                            placeholder="Lng"
                            value={relocateLng}
                            onChange={(e) => setRelocateLng(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (!selectedInstallation) return
                    const updated: any = { ...selectedInstallation }

                    // Cambios por estado
                    if (statusChoice === "active") {
                      // Recuperación desde robado
                      if (selectedInstallation.status === "stolen_components") {
                        const outstandingAll = updated.theftOutstandingAll === true
                        const outstandingMap: Record<string, string[]> = updated.theftOutstanding || {}

                        if (outstandingAll) {
                          if (!confirmFullRecovery) {
                            alert("Confirme la recuperación total para volver a ACTIVO.")
                            return
                          }
                          // No hubo deducciones por 'all', solo cambiamos estado y limpiamos marcadores
                          updated.status = "active"
                          updated.theftOutstandingAll = false
                          delete updated.theftOutstanding
                          updated.recoveredAt = new Date().toISOString()
                        } else {
                          const keys = Object.keys(outstandingMap)
                          if (keys.length > 0) {
                            // Construir mapa de recuperación desde recoveredSelection
                            const recoveryMap: Record<string, string[]> = {}
                            for (const k of keys) {
                              const sels = recoveredSelection[k] || {}
                              const picked = Object.keys(sels).filter((code) => sels[code])
                              if (picked.length > 0) recoveryMap[k] = picked
                            }

                            // Validar que se recupera todo para volver a activo
                            const allSelected =
                              keys.every((k) => {
                                const pending = outstandingMap[k] || []
                                const picked = recoveryMap[k] || []
                                return pending.length === picked.length
                              }) && keys.length > 0

                            if (!allSelected) {
                              alert("Debe recuperar todos los códigos robados para volver a ACTIVO.")
                              return
                            }

                            // Reponer cantidades
                            applyQuantityAddition(updated, recoveryMap)
                            // Limpiar pendientes
                            delete updated.theftOutstanding
                            updated.recoveredAt = new Date().toISOString()
                            updated.status = "active"
                          } else {
                            // No hay pendientes, simplemente activar
                            updated.status = "active"
                          }
                        }
                      } else {
                        updated.status = "active"
                      }
                    } else if (statusChoice === "stolen") {
                      // Robado: total o parcial
                      if (stolenReportMode === "all") {
                        updated.status = "stolen_components"
                        updated.theft = {
                          mode: "all",
                          note: stolenNote || undefined,
                          date: new Date().toISOString(),
                        }
                        updated.theftOutstandingAll = true
                        delete updated.theftOutstanding
                      } else {
                        const err = validateLines(stolenLines)
                        if (err) {
                          alert(err)
                          return
                        }
                        updated.status = "stolen_components"
                        const items = stolenLines.map((l) => ({
                          typeKey: l.typeKey,
                          quantity: l.quantity,
                          codes: parseCodes(l.codes),
                        }))
                        updated.theft = {
                          mode: "partial",
                          note: stolenNote || undefined,
                          items,
                          date: new Date().toISOString(),
                        }
                        // Registrar pendientes por tipo
                        const theftOutstanding: Record<string, string[]> = {}
                        for (const it of items) {
                          theftOutstanding[it.typeKey] = (theftOutstanding[it.typeKey] || []).concat(it.codes)
                        }
                        updated.theftOutstanding = theftOutstanding
                        updated.theftOutstandingAll = false
                        // Descontar cantidades
                        applyQuantityDeduction(updated, stolenLines)
                      }
                    } else if (statusChoice === "dismantled") {
                      updated.status = "inactive"

                      if (destination === "for_sale") {
                        const chosenTypes = Object.keys(selectedComponentTypes).filter((k) => selectedComponentTypes[k])
                        if (chosenTypes.length === 0) {
                          alert("Seleccione al menos un tipo de componente para publicar a la venta.")
                          return
                        }
                        updated.decommission = {
                          destination,
                          listedTypes: chosenTypes,
                          date: new Date().toISOString(),
                        }
                      }

                      if (destination === "sold") {
                        const err = validateLines(soldLines)
                        if (err) {
                          alert(err)
                          return
                        }
                        updated.decommission = {
                          destination,
                          sold: soldLines.map((l) => ({
                            typeKey: l.typeKey,
                            quantity: l.quantity,
                            codes: parseCodes(l.codes),
                          })),
                          date: new Date().toISOString(),
                        }
                        applyQuantityDeduction(updated, soldLines)
                      }

                      if (destination === "reuse") {
                        const providerIsOwner =
                          (selectedInstallation as any).componentOwner === "provider" || confirmProviderOwner
                        if (!providerIsOwner) {
                          alert("Para reutilización, el proveedor debe ser el dueño de los componentes.")
                          return
                        }
                        const err = validateLines(reuseLines)
                        if (err) {
                          alert(err)
                          return
                        }
                        updated.decommission = {
                          destination,
                          reuse: reuseLines.map((l) => ({
                            typeKey: l.typeKey,
                            quantity: l.quantity,
                            codes: parseCodes(l.codes),
                          })),
                          date: new Date().toISOString(),
                          componentOwner:
                            (selectedInstallation as any).componentOwner ?? (confirmProviderOwner ? "provider" : undefined),
                        }
                        applyQuantityDeduction(updated, reuseLines)
                      }
                    } else if (statusChoice === "relocating") {
                      if (!relocateAddress.trim() || !relocateCommune.trim() || !relocateRegion.trim()) {
                        alert("Ingrese dirección, comuna y región de la nueva ubicación.")
                        return
                      }
                      if (!validateCoordinates(relocateLat, relocateLng)) {
                        alert("Ingrese coordenadas válidas (Lat entre -90 y 90, Lng entre -180 y 180).")
                        return
                      }
                      updated.location = {
                        ...updated.location,
                        address: relocateAddress,
                        commune: relocateCommune,
                        region: relocateRegion,
                        coordinates: {
                          lat: parseFloat(relocateLat),
                          lng: parseFloat(relocateLng),
                        },
                      }
                      updated.status = "active"
                      updated.relocatedAt = new Date().toISOString()
                    }

                    // Persistencia local
                    setInstallations((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
                    setDetailsOpen(false)
                    alert("Cambios guardados correctamente.")
                  }}
                >
                  Guardar cambios
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <WhatsAppAgent userType={currentUser?.role || "public"} currentPage="installations" />
    </div>
  )
}
