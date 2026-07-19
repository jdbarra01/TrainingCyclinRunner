import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ObjectiveForm } from '@/features/objectives/components/ObjectiveForm'
import { ObjectiveList } from '@/features/objectives/components/ObjectiveList'

export default function ObjectivesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Objetivos de Entrenamiento</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Define tus metas para generar un plan de entrenamiento personalizado
          </p>
        </div>
        <ObjectiveForm />
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Tus Objetivos</h2>
          <ObjectiveList />
        </div>
      </main>
      <Footer />
    </>
  )
}
