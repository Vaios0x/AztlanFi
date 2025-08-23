import { KYCVerification } from '@/components/KYCVerification'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function KYCPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <div className="py-8">
        <KYCVerification />
      </div>
      <Footer />
    </div>
  )
}
