import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen w-full bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <header className="w-full">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-apolla.png" alt="ApollA" width={120} height={48} className="h-8 w-auto" priority />
            <span className="hidden sm:inline text-sm text-slate-500">Sistema de Trazabilidad Fotovoltaica</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-sm font-medium text-slate-700 hover:underline">Registrarse</Link>
          </div>
        </div>
      </header>
      
      <section className="w-full">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 text-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                Plataforma segura y certificada
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                Trazabilidad solar simple, clara y confiable
              </h1>
              <p className="text-slate-600 text-base leading-relaxed">
                Registra y verifica componentes fotovoltaicos con un sistema ligero y directo. Sin distracciones, solo
                lo esencial.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/public-search"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Consulta pública
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Registrarse
                </Link>
              </div>
              <p className="text-xs text-slate-500">Acceso para instaladores, fiscalizadores y público general.</p>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Ilustración abstracta de paneles solares"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 560px, 100vw"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-100/40 via-transparent to-emerald-200/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} ApollA. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6 opacity-80">
            <Image src="/images/logo-acesol.png" alt="ACESOL" width={88} height={28} className="h-7 w-auto" />
            <Image
              src="/images/logo-ministerio-energia.png"
              alt="Ministerio de Energía"
              width={112}
              height={28}
              className="h-7 w-auto"
            />
          </div>
        </div>
      </footer>
    </main>
  )
}
