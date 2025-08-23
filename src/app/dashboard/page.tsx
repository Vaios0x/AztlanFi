import { Dashboard } from '@/components/Dashboard'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  )
}
