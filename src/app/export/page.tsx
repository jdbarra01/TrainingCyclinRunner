import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ExportView } from './ExportView'

export default function ExportPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Exportar Entrenos</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Descarga tus workouts para cargarlos en tu computador de ciclismo
          </p>
        </div>
        <ExportView />
      </main>
      <Footer />
    </>
  )
}
