"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Zap, Shield, AlertTriangle, TrendingUp, FileText, Eye, Calendar, MapPin, Phone, Mail, User, Download } from 'lucide-react'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import DashboardContent from "@/components/dashboard-content"
// importación eliminada
import InstallationsPage from "@/app/installations/page"

// Mock data para reportes
const mockReports = [
  {
    id: 1,
    type: "Robo",
    title: "Componentes sustraídos en instalación residencial",
    status: "Activo",
    priority: "Alta",
    date: "2024-01-15",
    location: "Las Condes, Santiago",
    reporter: {
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      phone: "+56 9 1234 5678"
    },
    description: "Se reporta el robo de 4 paneles solares marca SunPower de 400W cada uno, durante la madrugada del 15 de enero. Los paneles estaban instalados en el techo de una vivienda unifamiliar.",
    resolution: null,
    comments: [
      {
        author: "Inspector García",
        date: "2024-01-16",
        text: "Se realizó inspección en terreno. Se confirma sustracción de componentes."
      }
    ],
    attachments: ["reporte_policial.pdf", "fotos_instalacion.zip"]
  },
  {
    id: 2,
    type: "Daño",
    title: "Panel solar dañado por granizo",
    status: "Resuelto",
    priority: "Media",
    date: "2024-01-10",
    location: "Providencia, Santiago",
    reporter: {
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+56 9 8765 4321"
    },
    description: "Panel solar presenta fisuras en el vidrio debido a granizada del 10 de enero. El panel sigue funcionando pero con rendimiento reducido.",
    resolution: "Panel reemplazado por garantía del fabricante. Instalación verificada el 20/01/2024.",
    comments: [
      {
        author: "Técnico Silva",
        date: "2024-01-12",
        text: "Programada visita técnica para evaluación."
      },
      {
        author: "Técnico Silva", 
        date: "2024-01-20",
        text: "Panel reemplazado exitosamente. Sistema funcionando normalmente."
      }
    ],
    attachments: ["evaluacion_tecnica.pdf", "certificado_reemplazo.pdf"]
  }
]

export default function DashboardPage() {
  const [newReportOpen, setNewReportOpen] = React.useState(false)
  const [reportDialogOpen, setReportDialogOpen] = React.useState(false)
  const [selectedReport, setSelectedReport] = React.useState<any>(null)
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const [stats, setStats] = React.useState<any>(null)
  const [installations, setInstallations] = React.useState<any[]>([])
  const [alerts, setAlerts] = React.useState<any[]>([])
  const [reports, setReports] = React.useState<any[]>([])
  const [verificationDialog, setVerificationDialog] = React.useState(false)
  const [verificationLoading, setVerificationLoading] = React.useState(false)
  const [verificationData, setVerificationData] = React.useState({
    inspector: '',
    date: new Date().toISOString().split('T')[0],
    status: 'approved',
    comments: ''
  })

  React.useEffect(() => {
    // Cargar usuario actual
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }

    // Cargar datos del dashboard
    const loadDashboardData = async () => {
      try {
        const [statsData, installationsData, alertsData, reportsData] = await Promise.all([
// TODO: Reemplazar por llamadas reales a la API
        ])

        setStats(statsData)
        setInstallations(installationsData)
        setAlerts(alertsData)
        setReports(reportsData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }

    loadDashboardData()
  }, [])

  const handleViewReportDetails = (report: any) => {
    setSelectedReport(report)
    setReportDialogOpen(true)
  }

  const handleNewReportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el reporte
    setNewReportOpen(false)
    // Mostrar mensaje de éxito
    alert("Reporte enviado exitosamente")
  }

  const handleVerifyInstallation = (installation: any) => {
    setVerificationDialog(true)
    setVerificationData({
      inspector: currentUser?.name || '',
      date: new Date().toISOString().split('T')[0],
      status: 'approved',
      comments: ''
    })
  }

  const submitVerification = async () => {
    setVerificationLoading(true)
    
    // Simular proceso de verificación
    setTimeout(() => {
      setVerificationLoading(false)
      setVerificationDialog(false)
      // Aquí podrías actualizar el estado de la instalación
      alert('Instalación verificada exitosamente')
    }, 2000)
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-transparent">
      <AppSidebar currentUser={currentUser} />
      <SidebarInset className="flex-1 w-full">        

        {/* Contenedor principal con padding y ancho máximo centrado.
            Evita que el contenido parezca un iframe al ocupar todo el ancho
            y eliminar bordes fuertes alrededor del contenido. */}
        <main className="flex-1 w-full overflow-auto p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <InstallationsPage />
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}
