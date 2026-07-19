import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TrainingPlanView } from '@/features/training/components/TrainingPlanView'
import { QuickWorkoutCreator } from '@/features/training/components/QuickWorkoutCreator'
import { WorkoutList } from '@/features/training/components/WorkoutList'

export default function TrainingPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Plan de Entrenamiento</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Genera y gestiona tus entrenamientos basados en objetivos
          </p>
        </div>
        <QuickWorkoutCreator />
        <div className="mt-8">
          <TrainingPlanView />
        </div>
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Entrenos Generados</h2>
          <WorkoutList />
        </div>
      </main>
      <Footer />
    </>
  )
}
