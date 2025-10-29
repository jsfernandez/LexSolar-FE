"use client"

import * as React from "react"
import DashboardContent from "@/components/dashboard-content"
import type { Installation, Report, SecurityAlert } from "@/lib/mock-data"
import { mockApi } from "@/lib/mock-data"
import { getLocalStorageJSON } from "@/lib/utils"

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const [stats, setStats] = React.useState<any>(null)
  const [installations, setInstallations] = React.useState<Installation[]>([])
  const [alerts, setAlerts] = React.useState<SecurityAlert[]>([])
  const [reports, setReports] = React.useState<Report[]>([])

  // Estado para verificación (usado por DashboardContent)
  const [verificationDialog, setVerificationDialog] = React.useState(false)
  const [verificationLoading, setVerificationLoading] = React.useState(false)
  const [verificationData, setVerificationData] = React.useState<any>(null)

  React.useEffect(() => {
    const load = async () => {
      const user = getLocalStorageJSON<any>("currentUser")
      if (user) setCurrentUser(user)

      const [s, inst, al, rep] = await Promise.all([
        mockApi.getDashboardStats(),
        mockApi.getInstallations(),
        mockApi.getSecurityAlerts(),
        mockApi.getReports(),
      ])
      setStats(s)
      setInstallations(inst)
      setAlerts(al)
      setReports(rep)
    }
    load()
  }, [])

  // Simulación de envío de verificación
  const submitVerification = React.useCallback(() => {
    setVerificationLoading(true)
    setTimeout(() => {
      setVerificationLoading(false)
      setVerificationDialog(false)
    }, 1200)
  }, [])

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6">
      <DashboardContent
        stats={stats}
        installations={installations}
        alerts={alerts}
        reports={reports}
        currentUser={currentUser}
        handleVerifyInstallation={() => { /* handled inside the component */ }}
        verificationDialog={verificationDialog}
        setVerificationDialog={setVerificationDialog}
        verificationLoading={verificationLoading}
        setVerificationLoading={setVerificationLoading}
        verificationData={verificationData}
        setVerificationData={setVerificationData}
        submitVerification={submitVerification}
      />
    </div>
  )
}
