import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AthleteForm } from '@/features/athlete/components/AthleteForm'
import { AthleteSummary } from '@/features/athlete/components/AthleteSummary'

export default function AthletePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Perfil del Deportista</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Configura tus datos fisiológicos para obtener entrenamientos personalizados
          </p>
        </div>
        <AthleteSummary />
        <div className="mt-8">
          <AthleteForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
