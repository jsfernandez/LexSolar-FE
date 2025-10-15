// Tipos de datos
export interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'public' | 'installer' | 'inspector' | 'engraving'
  company?: string
  phone?: string
  address?: string
  certifications?: string[]
  registrationDate: string
  lastLogin?: string
  isActive: boolean
}

export interface Component {
  id: string
  serialNumber: string
  type: 'panel' | 'inverter' | 'battery' | 'structure' | 'cable'
  brand: string
  model: string
  specifications: {
    power?: string
    voltage?: string
    current?: string
    efficiency?: string
    capacity?: string
    dimensions?: string
    weight?: string
    warranty?: string
  }
  manufacturer: {
    name: string
    country: string
    certifications: string[]
  }
  status: 'available' | 'installed' | 'stolen' | 'damaged' | 'maintenance'
  location?: string
  installationId?: string
  registrationDate: string
  lastVerification?: string
  engravingStatus: 'pending' | 'completed' | 'not_required'
  engravingCode?: string
  qrCode: string
  images?: string[]
  documents?: string[]
}

export interface Installation {
  id: string
  systemName: string
  systemType: 'residential' | 'commercial' | 'industrial' | 'utility'
  client: {
    name: string
    email: string
    phone: string
    address: string
    rut?: string
  }
  installer: {
    id: string
    name: string
    company: string
    license: string
  }
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
    region: string
    commune: string
  }
  components: {
    panels?: {
      quantity: number
      items: Component[]
    }
    inverters?: {
      quantity: number
      items: Component[]
    }
    batteries?: {
      quantity: number
      items: Component[]
    }
    structures?: {
      quantity: number
      items: Component[]
    }
    cables?: {
      quantity: number
      items: Component[]
    }
  }
  totalPower: string
  estimatedGeneration: string
  status: 'active' | 'inactive' | 'pending_engraving' | 'stolen_components'
  registrationDate: string
  inspectionDate?: string
  inspector?: {
    id: string
    name: string
    license: string
  }
  certificates: string[]
  documents: string[]
  photos: string[]
}

export interface SecurityAlert {
  id: string
  type: 'stolen_component' | 'suspicious_activity' | 'unauthorized_access' | 'fake_component'
  severity: 'low' | 'medium' | 'high'
  status: 'active' | 'investigating' | 'resolved' | 'false_alarm'
  message: string
  description: string
  location: string
  coordinates?: {
    lat: number
    lng: number
  }
  componentId?: string
  installationId?: string
  reportedBy: {
    id: string
    name: string
    role: string
  }
  date: string
  investigator?: {
    id: string
    name: string
  }
  resolution?: string
  evidence: string[]
}

export interface Report {
  id: string
  reportNumber: string
  type: 'theft' | 'fraud' | 'quality_issue' | 'safety_concern' | 'other'
  status: 'pending' | 'investigating' | 'resolved' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  description: string
  location: string
  componentIds?: string[]
  installationId?: string
  reportedBy: {
    id: string
    name: string
    email: string
    phone: string
  }
  reportDate: string
  assignedTo?: {
    id: string
    name: string
    department: string
  }
  resolution?: string
  resolutionDate?: string
  attachments: string[]
  comments: Array<{
    id: string
    author: string
    content: string
    date: string
  }>
}

export interface EngravingRequest {
  id: string
  systemName: string
  client: string
  installer: string
  address: string
  coordinates: string
  installationId: string
  requestDate: string
  scheduledDate: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  priority: 'low' | 'normal' | 'high'
  components: {
    id: string
    type: string
    brand: string
    model: string
    quantity: number
    status: 'pending' | 'in_progress' | 'completed' | 'rejected'
    serialNumbers: string[]
    photos: string[]
  }[]
  notes: string
}

// Datos mock
const mockUsers: User[] = [
  {
    id: "1",
    email: "carlos.mendoza@solartech.cl",
    password: "installer123",
    name: "Carlos Mendoza",
    role: "installer",
    company: "SolarTech Instalaciones",
    phone: "+56 9 8765 4321",
    address: "Av. Providencia 1234, Santiago",
    certifications: ["SEC Clase A", "ACESOL Certificado"],
    registrationDate: "2023-01-15",
    lastLogin: "2024-01-15T10:30:00Z",
    isActive: true
  },
  {
    id: "2",
    email: "maria.gonzalez@email.com",
    password: "public123",
    name: "María González",
    role: "public",
    phone: "+56 9 1234 5678",
    address: "Los Aromos 567, Maipú",
    registrationDate: "2023-03-20",
    lastLogin: "2024-01-14T15:45:00Z",
    isActive: true
  },
  {
    id: "3",
    email: "ana.torres@sec.gob.cl",
    password: "inspector123",
    name: "Ana Torres",
    role: "inspector",
    company: "Superintendencia de Electricidad y Combustibles",
    phone: "+56 2 2345 6789",
    address: "Teatinos 280, Santiago",
    certifications: ["Inspector SEC Nivel 1", "Auditor Energético"],
    registrationDate: "2022-11-10",
    lastLogin: "2024-01-15T09:15:00Z",
    isActive: true
  },
  {
    id: "4",
    email: "certificadora@grabado.cl",
    password: "grabado2024",
    name: "Roberto Silva",
    role: "engraving",
    company: "CertificaGrab SpA",
    phone: "+56 2 3456 7890",
    address: "Av. Libertador Bernardo O'Higgins 1449, Santiago",
    certifications: ["Certificadora Autorizada SEC", "ISO 9001:2015"],
    registrationDate: "2022-08-05",
    lastLogin: "2024-01-15T11:20:00Z",
    isActive: true
  }
]

const mockComponents: Component[] = [
  {
    id: "comp_001",
    serialNumber: "PV2024-SOL-334890S706693W-123456-47",
    type: "panel",
    brand: "SolarMax",
    model: "SM-400W-MONO",
    specifications: {
      power: "400W",
      voltage: "24V",
      current: "16.67A",
      efficiency: "21.2%",
      dimensions: "2000x1000x35mm",
      weight: "22kg",
      warranty: "25 años"
    },
    manufacturer: {
      name: "SolarMax Industries",
      country: "Alemania",
      certifications: ["IEC 61215", "IEC 61730", "CE"]
    },
    status: "installed",
    location: "Maipú, Santiago",
    installationId: "inst_001",
    registrationDate: "2024-01-10",
    lastVerification: "2024-01-15",
    engravingStatus: "completed",
    engravingCode: "GRB-2024-001-47",
    qrCode: "QR_PV2024SOL334890S706693W12345647",
    images: ["/images/panel-solarmax-400w.jpg"],
    documents: ["/docs/certificado-solarmax-sm400w.pdf"]
  },
  {
    id: "comp_002",
    serialNumber: "INV2024-PWR-445566T889900X-789012-23",
    type: "inverter",
    brand: "PowerTech",
    model: "PT-5000-TRI",
    specifications: {
      power: "5000W",
      voltage: "400V",
      efficiency: "97.5%",
      dimensions: "400x300x150mm",
      weight: "15kg",
      warranty: "10 años"
    },
    manufacturer: {
      name: "PowerTech Solutions",
      country: "Estados Unidos",
      certifications: ["UL 1741", "IEEE 1547", "FCC Part 15"]
    },
    status: "installed",
    location: "Maipú, Santiago",
    installationId: "inst_001",
    registrationDate: "2024-01-10",
    lastVerification: "2024-01-15",
    engravingStatus: "completed",
    engravingCode: "GRB-2024-002-23",
    qrCode: "QR_INV2024PWR445566T889900X78901223",
    images: ["/images/inverter-powertech-5000w.jpg"],
    documents: ["/docs/certificado-powertech-pt5000.pdf"]
  },
  {
    id: "comp_003",
    serialNumber: "BAT2024-LIT-778899U112233V-345678-89",
    type: "battery",
    brand: "EnergyStore",
    model: "ES-10KWH-LFP",
    specifications: {
      capacity: "10kWh",
      voltage: "48V",
      current: "208Ah",
      dimensions: "600x400x200mm",
      weight: "85kg",
      warranty: "15 años"
    },
    manufacturer: {
      name: "EnergyStore Technologies",
      country: "Corea del Sur",
      certifications: ["UN38.3", "IEC 62619", "CE"]
    },
    status: "stolen",
    location: "Desconocida",
    registrationDate: "2024-01-05",
    lastVerification: "2024-01-12",
    engravingStatus: "completed",
    engravingCode: "GRB-2024-003-89",
    qrCode: "QR_BAT2024LIT778899U112233V34567889",
    images: ["/images/battery-energystore-10kwh.jpg"],
    documents: ["/docs/certificado-energystore-es10kwh.pdf"]
  }
]

const mockInstallations: Installation[] = [
  {
    id: "inst_001",
    systemName: "Sistema Residencial Maipú",
    systemType: "residential",
    client: {
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+56 9 1234 5678",
      address: "Los Aromos 567, Maipú",
      rut: "12.345.678-9"
    },
    installer: {
      id: "1",
      name: "Carlos Mendoza",
      company: "SolarTech Instalaciones",
      license: "SEC-INST-2023-001"
    },
    location: {
      address: "Los Aromos 567, Maipú",
      coordinates: {
        lat: -33.5110,
        lng: -70.7682
      },
      region: "Metropolitana",
      commune: "Maipú"
    },
    components: {
      panels: {
        quantity: 12,
        items: [mockComponents[0]]
      },
      inverters: {
        quantity: 1,
        items: [mockComponents[1]]
      },
      batteries: {
        quantity: 1,
        items: [mockComponents[2]]
      }
    },
    totalPower: "4.8 kW",
    estimatedGeneration: "7,200 kWh/año",
    status: "active",
    registrationDate: "2024-01-10",
    inspectionDate: "2024-01-15",
    inspector: {
      id: "3",
      name: "Ana Torres",
      license: "SEC-INSP-2022-005"
    },
    certificates: ["/docs/certificado-instalacion-inst001.pdf"],
    documents: ["/docs/planos-inst001.pdf", "/docs/memoria-calculo-inst001.pdf"],
    photos: ["/images/instalacion-inst001-1.jpg", "/images/instalacion-inst001-2.jpg"]
  },
  {
    id: "inst_002",
    systemName: "Sistema Industrial Quilicura",
    systemType: "industrial",
    client: {
      name: "Industrias del Norte S.A.",
      email: "contacto@industriasnorte.cl",
      phone: "+56 2 2987 6543",
      address: "Av. Industrial 1500, Quilicura",
      rut: "96.123.456-7"
    },
    installer: {
      id: "1",
      name: "Carlos Mendoza",
      company: "SolarTech Instalaciones",
      license: "SEC-INST-2023-001"
    },
    location: {
      address: "Av. Industrial 1500, Quilicura",
      coordinates: {
        lat: -33.3600,
        lng: -70.7394
      },
      region: "Metropolitana",
      commune: "Quilicura"
    },
    components: {
      panels: {
        quantity: 200,
        items: []
      },
      inverters: {
        quantity: 4,
        items: []
      }
    },
    totalPower: "80 kW",
    estimatedGeneration: "120,000 kWh/año",
    status: "pending_engraving",
    registrationDate: "2024-01-08",
    certificates: [],
    documents: ["/docs/planos-inst002.pdf"],
    photos: []
  },
  {
    id: "inst_003",
    systemName: "Sistema Comercial Las Condes",
    systemType: "commercial",
    client: {
      name: "Centro Comercial Plaza Norte",
      email: "administracion@plazanorte.cl",
      phone: "+56 2 2456 7890",
      address: "Av. Apoquindo 4500, Las Condes",
      rut: "78.987.654-3"
    },
    installer: {
      id: "1",
      name: "Carlos Mendoza",
      company: "SolarTech Instalaciones",
      license: "SEC-INST-2023-001"
    },
    location: {
      address: "Av. Apoquindo 4500, Las Condes",
      coordinates: {
        lat: -33.4172,
        lng: -70.5476
      },
      region: "Metropolitana",
      commune: "Las Condes"
    },
    components: {
      panels: {
        quantity: 50,
        items: []
      },
      inverters: {
        quantity: 2,
        items: []
      }
    },
    totalPower: "20 kW",
    estimatedGeneration: "30,000 kWh/año",
    status: "stolen_components",
    registrationDate: "2024-01-05",
    certificates: [],
    documents: [],
    photos: []
  },
  {
    id: "inst_004",
    systemName: "Sistema Residencial Providencia",
    systemType: "residential",
    client: {
      name: "Roberto Silva",
      email: "roberto.silva@email.com",
      phone: "+56 9 9876 5432",
      address: "Av. Providencia 2500, Providencia",
      rut: "15.678.901-2"
    },
    installer: {
      id: "1",
      name: "Carlos Mendoza",
      company: "SolarTech Instalaciones",
      license: "SEC-INST-2023-001"
    },
    location: {
      address: "Av. Providencia 2500, Providencia",
      coordinates: {
        lat: -33.4372,
        lng: -70.6178
      },
      region: "Metropolitana",
      commune: "Providencia"
    },
    components: {
      panels: {
        quantity: 8,
        items: []
      },
      inverters: {
        quantity: 1,
        items: []
      }
    },
    totalPower: "3.2 kW",
    estimatedGeneration: "4,800 kWh/año",
    status: "active",
    registrationDate: "2024-01-12",
    inspectionDate: "2024-01-18",
    inspector: {
      id: "3",
      name: "Ana Torres",
      license: "SEC-INSP-2022-005"
    },
    certificates: ["/docs/certificado-instalacion-inst004.pdf"],
    documents: ["/docs/planos-inst004.pdf"],
    photos: ["/images/instalacion-inst004-1.jpg"]
  }
]

const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: "alert_001",
    type: "stolen_component",
    severity: "high",
    status: "active",
    message: "Batería reportada como robada detectada en venta online",
    description: "Se detectó la batería con número de serie BAT2024-LIT-778899U112233V-345678-89 siendo ofrecida en marketplace online. El componente fue reportado como robado hace 3 días.",
    location: "Marketplace Online - MercadoLibre",
    componentId: "comp_003",
    installationId: "inst_001",
    reportedBy: {
      id: "2",
      name: "María González",
      role: "public"
    },
    date: "2024-01-15",
    evidence: ["/images/captura-mercadolibre-bateria.jpg"]
  },
  {
    id: "alert_002",
    type: "suspicious_activity",
    severity: "medium",
    status: "investigating",
    message: "Múltiples consultas de verificación desde la misma IP",
    description: "Se detectaron más de 50 consultas de verificación de componentes desde la misma dirección IP en las últimas 24 horas, lo que podría indicar actividad automatizada sospechosa.",
    location: "Sistema de Verificación Online",
    reportedBy: {
      id: "system",
      name: "Sistema Automático",
      role: "system"
    },
    date: "2024-01-14",
    investigator: {
      id: "3",
      name: "Ana Torres"
    },
    evidence: ["/logs/suspicious-ip-activity.log"]
  }
]

const mockReports: Report[] = [
  {
    id: "report_001",
    reportNumber: "RPT-2024-001",
    type: "theft",
    status: "investigating",
    priority: "high",
    title: "Robo de batería en instalación residencial",
    description: "Se reporta el robo de una batería EnergyStore ES-10KWH-LFP durante la madrugada. Los ladrones cortaron las conexiones y se llevaron únicamente la batería, dejando el resto del sistema intacto.",
    location: "Los Aromos 567, Maipú",
    componentIds: ["comp_003"],
    installationId: "inst_001",
    reportedBy: {
      id: "2",
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+56 9 1234 5678"
    },
    reportDate: "2024-01-12",
    assignedTo: {
      id: "3",
      name: "Ana Torres",
      department: "Investigaciones SEC"
    },
    attachments: ["/images/robo-bateria-maipu.jpg", "/docs/denuncia-carabineros-123456.pdf"],
    comments: [
      {
        id: "comment_001",
        author: "Ana Torres",
        content: "Se inició investigación. Solicitando cámaras de seguridad del sector.",
        date: "2024-01-12T14:30:00Z"
      }
    ]
  }
]

const mockEngravingRequests: EngravingRequest[] = [
  {
    id: "ENG-001",
    systemName: "Sistema Residencial Maipú",
    client: "Juan Pérez",
    installer: "Carlos Mendoza",
    address: "Av. Pajaritos 1234, Maipú, Santiago",
    coordinates: "-33.5110, -70.7682",
    installationId: "inst_001",
    requestDate: "2024-01-10",
    scheduledDate: "2024-01-20",
    status: "completed",
    priority: "normal",
    components: [
      {
        id: "comp_001",
        type: "Panel Solar",
        brand: "SunPower",
        model: "SPR-X22-370",
        quantity: 12,
        status: "completed",
        serialNumbers: ["SP2024001", "SP2024002", "SP2024003"],
        photos: ["/placeholder.svg?height=200&width=300&text=Panel+Grabado"]
      }
    ],
    notes: "Grabado completado según especificaciones técnicas"
  }
]

// Estadísticas del dashboard
const dashboardStats = {
  totalInstallations: 1247,
  activeReports: 23,
  monthlyGrowth: 12.5,
  securityAlerts: 8,
  totalComponents: 15678,
  registeredCompanies: 89,
  successfulVerifications: 94.2,
  pendingEngravings: 156,
  completedEngravings: 1891,
  stolenComponents: 12
}

// API Mock
export const mockApi = {
  // Autenticación mejorada
  authenticate: async (email: string, password: string, userType: string): Promise<User | null> => {
    console.log('Attempting authentication:', { email, password, userType })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockUsers.find(u => {
      const emailMatch = u.email.toLowerCase() === email.toLowerCase()
      const passwordMatch = u.password === password
      const roleMatch = u.role === userType
      const isActive = u.isActive
      
      console.log('Checking user:', {
        email: u.email,
        emailMatch,
        passwordMatch,
        roleMatch,
        isActive,
        userRole: u.role,
        expectedRole: userType
      })
      
      return emailMatch && passwordMatch && roleMatch && isActive
    })
    
    if (user) {
      user.lastLogin = new Date().toISOString()
      console.log('Authentication successful for:', user.name)
      return { ...user, password: '' } // No devolver la contraseña
    }
    
    console.log('Authentication failed')
    return null
  },

  login: async (email: string, password: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const user = mockUsers.find(u => u.email === email && u.password === password && u.isActive)
    if (user) {
      user.lastLogin = new Date().toISOString()
      return { ...user, password: '' }
    }
    return null
  },

  // Componentes
  getComponents: async (): Promise<Component[]> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockComponents
  },

  getComponentBySerial: async (serialNumber: string): Promise<Component | null> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockComponents.find(c => c.serialNumber === serialNumber) || null
  },

  searchComponents: async (query: string): Promise<Component[]> => {
    await new Promise(resolve => setTimeout(resolve, 700))
    return mockComponents.filter(c => 
      c.serialNumber.toLowerCase().includes(query.toLowerCase()) ||
      c.brand.toLowerCase().includes(query.toLowerCase()) ||
      c.model.toLowerCase().includes(query.toLowerCase())
    )
  },

  // Instalaciones
  getInstallations: async (): Promise<Installation[]> => {
    await new Promise(resolve => setTimeout(resolve, 900))
    return mockInstallations
  },

  getInstallationById: async (id: string): Promise<Installation | null> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockInstallations.find(i => i.id === id) || null
  },

  getInstallationsByUser: async (userId: string): Promise<Installation[]> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockInstallations.filter(i => i.installer.id === userId)
  },

  // Alertas de seguridad
  getSecurityAlerts: async (): Promise<SecurityAlert[]> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockSecurityAlerts
  },

  getActiveAlerts: async (): Promise<SecurityAlert[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockSecurityAlerts.filter(a => a.status === 'active')
  },

  // Reportes
  getReports: async (): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 700))
    return mockReports
  },

  getReportById: async (id: string): Promise<Report | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockReports.find(r => r.id === id) || null
  },

  getReportsByUser: async (userId: string): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockReports.filter(r => r.reportedBy.id === userId)
  },

  // Usuarios
  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockUsers.map(u => ({ ...u, password: '' }))
  },

  getUserById: async (id: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const user = mockUsers.find(u => u.id === id)
    return user ? { ...user, password: '' } : null
  },

  // Estadísticas del dashboard
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return dashboardStats
  },

  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return dashboardStats
  },

  // Solicitudes de grabado
  getEngravingRequests: async (): Promise<EngravingRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockEngravingRequests
  },

  getEngravingRequestById: async (id: string): Promise<EngravingRequest | null> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockEngravingRequests.find(req => req.id === id) || null
  }
}

// Exportar datos mock para uso directo
const mockData = {
  users: mockUsers,
  components: mockComponents,
  installations: mockInstallations,
  securityAlerts: mockSecurityAlerts,
  reports: mockReports,
  dashboardStats,
  engravingRequests: mockEngravingRequests
}

export default mockData
