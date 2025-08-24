import { Dashboard } from '@/components/Dashboard'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  )
}
