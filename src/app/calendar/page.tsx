import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CalendarView } from '@/features/calendar/components/CalendarView'

export default function CalendarPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Calendario de Entrenos</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Visualiza todos tus entrenamientos organizados por día
          </p>
        </div>
        <CalendarView />
      </main>
      <Footer />
    </>
  )
}
