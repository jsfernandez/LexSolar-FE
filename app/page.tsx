"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, MapPin, LogIn, Search, Sun, Shield, ChevronUp, UserPlus } from "lucide-react"

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    // Inicializar con la hora actual
    setCurrentTime(new Date())
    
    // Actualizar cada segundo
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Mostrar botón de scroll to top
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Formatear la hora de Chile (UTC-3)
  const getChileTime = () => {
    if (!currentTime) return { time: "--:--:--", date: "--" }
    
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "America/Santiago",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
    
    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: "America/Santiago",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    
    return {
      time: currentTime.toLocaleTimeString("es-CL", options),
      date: currentTime.toLocaleDateString("es-CL", dateOptions),
    }
  }

  const { time, date } = getChileTime()
  
  return (
    <main className="flex flex-col min-h-screen w-full bg-gradient-to-b from-amber-50 via-slate-50 to-white">
      {/* Navbar sticky con backdrop blur */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sun className="h-8 w-8 text-amber-500 animate-pulse" />
            <Image src="/images/logo-apolla.png" alt="LexSolar" width={120} height={48} className="h-20 w-full" priority />
          </div>
          
          {/* Reloj de Chile - minimalista */}
          <div className="hidden md:flex items-center gap-3 text-sm text-slate-600 px-3 py-1.5 bg-slate-100/50 rounded-lg">
            <MapPin className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs text-slate-500">Chile</span>
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-mono tabular-nums font-medium">{time}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </Link>
            <Link 
              href="/register" 
              className="inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 text-sm font-semibold text-white hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>
      
      <section className="w-full flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contenido principal */}
            <div className="space-y-10">
              <div className="space-y-8">
                {/* Badge con shield */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">Plataforma segura y certificada</span>
                </div>

                {/* Título con mayor contraste */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  Trazabilidad<br />Solar
                </h1>
                
                {/* Subtítulo con tono azulado */}
                <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed max-w-xl">
                  Sistema simple y seguro para registrar y verificar componentes fotovoltaicos.
                </p>
              </div>

              {/* Botones con iconos y animaciones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link
                  href="/register"
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 text-base font-semibold text-white hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Registrarse
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/public-search"
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-8 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Consulta pública
                </Link>
              </div>
              
              <div className="pt-3 flex items-center flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-amber-900 font-semibold shadow-sm">
                  Plan gratuito: 2 instalaciones gratis al registrarte
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  Acceso para instaladores, fiscalizadores y público general
                  <Sun className="h-4 w-4 text-amber-500" />
                </span>
              </div>
            </div>

            {/* Imagen con gradiente solar */}
            <div className="relative lg:ml-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              
              <div className="relative aspect-square w-full max-w-md mx-auto bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl border border-amber-200/50 shadow-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Ilustración de paneles solares y trazabilidad"
                  fill
                  className="object-cover rounded-3xl opacity-50"
                  sizes="(min-width: 1024px) 450px, 100vw"
                  priority
                />
                {/* Pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>
              </div>
            </div>
          </div>

          {/* Reloj móvil - minimalista */}
          <div className="md:hidden mt-12 flex justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-600 px-4 py-3 bg-slate-100/80 rounded-xl border border-slate-200">
              <MapPin className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs">Chile</span>
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-mono tabular-nums font-medium">{time}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer mejorado */}
      <footer className="w-full bg-white border-t border-slate-200">
        {/* Barra de acento superior */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500"></div>
        
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Links secundarios */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-slate-600">
              <Link href="/contact" className="hover:text-amber-600 transition-colors">Contacto</Link>
              <Link href="/privacy" className="hover:text-amber-600 transition-colors">Política de privacidad</Link>
              <Link href="/terms" className="hover:text-amber-600 transition-colors">Términos de uso</Link>
            </div>
            
            {/* Logos institucionales */}
            <div className="flex items-center gap-8 opacity-70 hover:opacity-100 transition-opacity">
              <Image src="/images/logo-acesol.png" alt="ACESOL" width={80} height={24} className="h-6 w-auto" />
              <Image
                src="/images/logo-ministerio-energia.png"
                alt="Ministerio de Energía"
                width={100}
                height={24}
                className="h-6 w-auto"
              />
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">© {new Date().getFullYear()} LexSolar. Sistema de Trazabilidad Solar</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 hover:shadow-xl transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Volver arriba"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </main>
  )
}
