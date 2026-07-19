import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DashboardOverview } from '@/features/dashboard/components/DashboardOverview'
import { AthleteCardList } from '@/features/athlete/components/AthleteCardList'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <AthleteCardList />
        <div className="mt-6">
          <DashboardOverview />
        </div>
      </main>
      <Footer />
    </>
  )
}
