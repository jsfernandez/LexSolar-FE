"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Shield,
  FileText,
  User,
  Building2,
  Eye,
  Download,
  Bell,
  Sun,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import WhatsAppAgent from "@/components/whatsapp-agent"
import type { Installation, Report, SecurityAlert } from "@/lib/mock-data"

interface DashboardContentProps {
  stats: any
  installations: Installation[]
  alerts: SecurityAlert[]
  reports: Report[]
  currentUser: any
  handleVerifyInstallation: (installation: Installation) => void
  verificationDialog: boolean
  setVerificationDialog: (open: boolean) => void
  verificationLoading: boolean
  setVerificationLoading: (loading: boolean) => void
  verificationData: any
  setVerificationData: (data: any) => void
  submitVerification: () => void
}

const PLAN_LIMITS: Record<string, number> = {
  Free: 1,
  Basica: 5,
  Pro: 25,
  Experto: 100,
}

export default function DashboardContent({
  stats,
  installations,
  alerts,
  reports,
  currentUser,
  handleVerifyInstallation,
  verificationDialog,
  setVerificationDialog,
  verificationLoading,
  setVerificationLoading,
  verificationData,
  setVerificationData,
  submitVerification,
}: DashboardContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Certificado de instalación
  const [certificateOpen, setCertificateOpen] = useState(false)
  const [selectedCertInstallationId, setSelectedCertInstallationId] = useState<string>("")

  function openVerify(inst: Installation) {
    setSelectedInstallation(inst)
    setVerificationDialog(true)
    const fallback = {
      inspector: currentUser?.name || "",
      date: new Date().toISOString().split("T")[0],
      status: "approved",
      comments: "",
    }
    const merged = {
      inspector: verificationData?.inspector ?? fallback.inspector,
      date: verificationData?.date ?? fallback.date,
      status: verificationData?.status ?? fallback.status,
      comments: verificationData?.comments ?? fallback.comments,
    }
    setVerificationData(merged)
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
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Inactivo
          </Badge>
        )
      case "pending_engraving":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente Grabado
          </Badge>
        )
      case "stolen_components":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Componentes Robados
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case "investigating":
        return <Badge className="bg-blue-100 text-blue-800">Investigando</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resuelto</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgente</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Baja</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const filteredInstallations = installations.filter((installation) => {
    const matchesStatus = filterStatus === "all" || installation.status === filterStatus
    const matchesSearch =
      installation.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      installation.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      installation.installer.company.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Reloj en vivo en hora de Chile
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const getChileTime = () => {
    if (!now) return { time: "--:--:--", date: "--" }
    const time = now.toLocaleTimeString("es-CL", {
      timeZone: "America/Santiago",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    const date = now.toLocaleDateString("es-CL", {
      timeZone: "America/Santiago",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    return { time, date }
  }
  const { time: chileTime, date: chileDate } = getChileTime()
  
  // Variants para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  // Verificar si el usuario puede verificar instalaciones
  const canVerifyInstallations = currentUser?.role === "inspector" || currentUser?.role === "engraving"

  const handleViewReportDetails = (report: Report) => {
    setSelectedReport(report)
    setReportDialogOpen(true)
  }

  // Suscripción y bolsa de instalaciones
  const planName: string = currentUser?.subscription?.plan ?? "Free"
  const planLimit = PLAN_LIMITS[planName] ?? PLAN_LIMITS["Free"]

  const usedByInstaller = useMemo(() => {
    if (!currentUser?.company) return 0
    return installations.filter((i) => i.installer?.company === currentUser?.company).length
  }, [installations, currentUser?.company])

  const remaining = Math.max(0, planLimit - usedByInstaller)

  // Instalación seleccionada para certificado: usar TODAS las instalaciones disponibles
  const selectedCertInstallation = useMemo(
    () => installations.find((i) => i.id === selectedCertInstallationId) || null,
    [installations, selectedCertInstallationId],
  )

  const CertificatePreview = () => {
    if (!selectedCertInstallation) {
      return (
        <div className="p-6 bg-gray-50 border rounded-lg text-sm text-gray-600">
          Seleccione una instalación para previsualizar el certificado.
        </div>
      )
    }

    const inst = selectedCertInstallation as Installation
    const componentsSummary = Object.entries(inst.components || {}).map(([key, comp]: any) => {
      if (!comp) return null
      return (
        <div key={key} className="flex justify-between border-b py-1">
          <span className="capitalize">{key}</span>
          <span>{comp.quantity} un.</span>
        </div>
      )
    })

    return (
      <div id="certificate-print" className="p-6 bg-white border rounded-lg text-sm relative overflow-hidden">
        {/* Marca de agua */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="select-none text-6xl md:text-8xl font-extrabold uppercase tracking-widest text-gray-800/10 rotate-[-30deg] print:text-gray-800/20">
            {"INSTALACION VERIFICADA"}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-semibold">Certificado de Validez de Instalación</p>
              <p className="text-xs text-gray-500">Sistema de Trazabilidad Fotovoltaica</p>
            </div>
          </div>
          <Image src="/images/logo-apolla.png" alt="LexSolar" width={80} height={40} className="h-8 w-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Nombre del Sistema</p>
            <p className="font-medium">{inst.systemName}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">ID de Sistema</p>
            <p className="font-mono text-xs">{inst.id}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Cliente</p>
            <p className="font-medium">{inst.client?.name}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Instalador</p>
            <p className="font-medium">{inst.installer?.company}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Ubicación</p>
            <p className="font-medium">
              {inst?.location?.address}, {inst?.location?.commune}, {inst?.location?.region}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Fecha de Registro</p>
            <p className="font-medium">{new Date(inst.registrationDate).toLocaleDateString("es-CL")}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Resumen de Componentes</p>
          <div className="rounded border">{componentsSummary}</div>
        </div>

        <div className="text-xs text-gray-600 leading-relaxed">
          Este certificado acredita que la instalación indicada cumple con los registros y asociaciones de componentes
          declaradas en el Sistema de Trazabilidad Fotovoltaica a la fecha {new Date().toLocaleDateString("es-CL")}. La
          validez del presente documento está sujeta a la verificación de los códigos de los componentes asociados al
          sistema.
        </div>
      </div>
    )
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      {/* Header con información del sistema */}
  <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Sun className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">Trazabilidad Solar</h1>
            <p className="text-slate-600">Registro y verificación de componentes</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Reloj Chile */}
          <div className="hidden md:flex items-center gap-3 text-sm text-slate-700 px-3 py-2 bg-slate-100/80 rounded-xl border border-slate-200">
            <MapPin className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs">Chile</span>
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            <span className="font-mono tabular-nums font-semibold text-slate-900">{chileTime}</span>
          </div>

          {/* Campanilla de alertas */}
          <div className="relative">
            <Button variant="ghost" size="icon" aria-label="Alertas de seguridad">
              <Bell className="h-5 w-5 text-slate-700" />
              <span className="sr-only">Alertas de seguridad</span>
            </Button>
            {alerts?.length ? (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] h-5 min-w-5 px-1">
                {alerts.length}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-4 opacity-90">
            <Image src="/images/logo-apolla.png" alt="LexSolar" width={80} height={40} className="h-8 w-auto" />
            <Image src="/images/logo-acesol.png" alt="ACESOL" width={60} height={30} className="h-6 w-auto opacity-70" />
            <Image src="/images/logo-ministerio-energia.png" alt="Ministerio de Energía" width={60} height={30} className="h-6 w-auto opacity-70" />
          </div>
        </div>
  </motion.div>

      {/* Suscripción actual */}
      <motion.div variants={itemVariants}>
      <Card className="transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="p-4 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Suscripción</p>
              <p className="text-base font-semibold">
                {planName} • {remaining}/{planLimit} instalaciones restantes
              </p>
            </div>
          </div>
          <a href="/subscription">
            <Button variant="outline" size="sm">
              Administrar
            </Button>
          </a>
        </CardContent>
  </Card>
  </motion.div>

      {/* Navegación rápida */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants}>
        <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Instalaciones</h3>
            <p className="text-gray-600 text-sm mb-4">Gestionar instalaciones fotovoltaicas</p>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setActiveTab("installations")}>
              Ver Instalaciones
            </Button>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Seguridad</h3>
            <p className="text-gray-600 text-sm mb-4">Monitorear alertas y reportes</p>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setActiveTab("activity")}>
              Ver Reportes
            </Button>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Reportes</h3>
            <p className="text-gray-600 text-sm mb-4">Generar informes detallados</p>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setCertificateOpen(true)}>
              Generar Reporte
            </Button>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>

      {/* Contenido principal con tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="installations">Instalaciones</TabsTrigger>
          <TabsTrigger value="activity">Actividad Reciente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnimatePresence mode="wait">
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Actividad reciente */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en el sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Instalación aprobada</p>
                    <p className="text-xs text-gray-500">Sistema Residencial Maipú - Hace 2h</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Alerta de seguridad</p>
                    <p className="text-xs text-gray-500">Componente sospechoso detectado - Hace 4h</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo registro</p>
                    <p className="text-xs text-gray-500">Instalación comercial registrada - Hace 6h</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mantenimiento programado</p>
                    <p className="text-xs text-gray-500">Sistema Las Condes - Hace 8h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          </AnimatePresence>
        </TabsContent>

  <TabsContent value="installations" className="space-y-6">
          {/* Filtros y búsqueda */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Card className="transition-transform duration-200 hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Buscar Instalaciones</Label>
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
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                      <SelectItem value="pending_engraving">Pendiente Grabado</SelectItem>
                      <SelectItem value="stolen_components">Componentes Robados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Lista de instalaciones */}
          <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="show">
            {filteredInstallations.map((installation) => (
              <motion.div key={installation.id} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{installation.systemName}</CardTitle>
                        {getStatusBadge(installation.status)}
                      </div>
                      <CardDescription>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
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
                      {canVerifyInstallations && (
                        <Button
                          size="sm"
                          onClick={() => openVerify(installation)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verificar Instalación
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
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
                      <span className="font-medium text-gray-600">Fecha Instalación:</span>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(installation.registrationDate).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Componentes:</span>
                      <p>
                        {Object.values(installation.components).reduce(
                          (total, comp) => total + (comp?.quantity || 0),
                          0,
                        )}{" "}
                        registrados
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">ID Sistema:</span>
                      <p className="font-mono text-xs">{installation.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {/* Reportes recientes */}
            <Card className="transition-transform duration-200 hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle>Reportes y Denuncias</CardTitle>
                <CardDescription>Últimos reportes registrados en el sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reports && reports.length > 0 ? (
                  reports.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{report.title}</p>
                          {getReportStatusBadge(report.status)}
                          {getPriorityBadge(report.priority)}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {report.reportedBy.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.reportDate).toLocaleDateString("es-CL")}
                          </span>
                        </div>
                        <div className="mt-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewReportDetails(report)}>
                            <Eye className="h-3 w-3 mr-1" />
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay reportes disponibles</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estadísticas de actividad */}
            <Card className="transition-transform duration-200 hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle>Estadísticas de Actividad</CardTitle>
                <CardDescription>Resumen de actividad del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-amber-700" />
                    </div>
                    <div>
                      <p className="font-medium">Instalaciones Registradas</p>
                      <p className="text-sm text-gray-600">Este mes</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-amber-700">{installations.length}</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Verificaciones Completadas</p>
                      <p className="text-sm text-gray-600">Este mes</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {installations.filter((i) => i.status === "active").length}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Pendientes de Revisión</p>
                      <p className="text-sm text-gray-600">Actualmente</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {installations.filter((i) => i.status === "pending_engraving").length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Modal de Verificación de Instalación */}
      {selectedInstallation && (
        <Dialog
          open={verificationDialog}
          onOpenChange={(open) => {
            setVerificationDialog(open)
            if (!open) setSelectedInstallation(null)
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Verificar Instalación</DialogTitle>
              <DialogDescription>
                {selectedInstallation.systemName} - {selectedInstallation.client.name}
              </DialogDescription>
            </DialogHeader>

            {(() => {
              const vData = {
                inspector: verificationData?.inspector ?? currentUser?.name ?? "",
                date: verificationData?.date ?? new Date().toISOString().split("T")[0],
                status: verificationData?.status ?? "approved",
                comments: verificationData?.comments ?? "",
              }
              return (
                <div className="space-y-4">
                  {/* Información de la instalación */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Información de la Instalación</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Cliente:</span> {selectedInstallation.client.name}
                      </div>
                      <div>
                        <span className="font-medium">Potencia:</span> {selectedInstallation.totalPower}
                      </div>
                      <div>
                        <span className="font-medium">Ubicación:</span> {selectedInstallation.location.address}
                      </div>
                      <div>
                        <span className="font-medium">Instalador:</span> {selectedInstallation.installer.company}
                      </div>
                    </div>
                  </div>

                  {/* Formulario de verificación */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="inspector">Inspector</Label>
                        <Input
                          id="inspector"
                          value={vData.inspector}
                          onChange={(e) =>
                            setVerificationData({
                              ...vData,
                              inspector: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="inspection-date">Fecha de Inspección</Label>
                        <Input
                          id="inspection-date"
                          type="date"
                          value={vData.date}
                          onChange={(e) =>
                            setVerificationData({
                              ...vData,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="verification-status">Estado de Verificación</Label>
                      <Select
                        value={vData.status}
                        onValueChange={(value) =>
                          setVerificationData({
                            ...vData,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger id="verification-status">
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">Aprobado</SelectItem>
                          <SelectItem value="rejected">Rechazado</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="verification-comments">Comentarios de la Inspección</Label>
                      <Textarea
                        id="verification-comments"
                        placeholder="Ingrese observaciones sobre la instalación..."
                        value={vData.comments}
                        onChange={(e) =>
                          setVerificationData({
                            ...vData,
                            comments: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setVerificationDialog(false)
                        setSelectedInstallation(null)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={submitVerification} disabled={verificationLoading}>
                      {verificationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verificando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verificar Instalación
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })()}
          </DialogContent>
        </Dialog>
      )}

      {/* Modal para Generar Certificado de Instalación */}
      <Dialog open={certificateOpen} onOpenChange={setCertificateOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Generar Certificado de Instalación</DialogTitle>
            <DialogDescription>
              Seleccione una instalación para generar el certificado de validez con su detalle.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="inst-select">Instalación</Label>
              <Select value={selectedCertInstallationId} onValueChange={setSelectedCertInstallationId}>
                <SelectTrigger id="inst-select">
                  <SelectValue
                    placeholder={
                      installations.length ? "Seleccione una instalación" : "No hay instalaciones disponibles"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {installations.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.systemName} — {inst.client?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CertificatePreview />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCertificateOpen(false)}>
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  window.print()
                }}
                disabled={!selectedCertInstallation}
              >
                <Download className="w-4 h-4 mr-2" />
                Imprimir / Descargar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Agent */}
      <WhatsAppAgent userType={currentUser?.role || "public"} currentPage="dashboard" />
    </motion.div>
  )
}
