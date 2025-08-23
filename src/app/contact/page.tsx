'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Twitter,
  Github,
  Globe,
  Users,
  Shield,
  Zap
} from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitStatus('success')
    setIsSubmitting(false)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitStatus('idle')
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      subtitle: "24/7 Support",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Mail,
      title: "Email",
              content: "hello@aztlanfi.com",
        subtitle: "support@aztlanfi.com",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      content: "+1 (555) 987-6543",
      subtitle: "Live chat",
      color: "from-green-600 to-green-700"
    },
    {
      icon: Clock,
      title: "Hours",
      content: "24/7",
      subtitle: "Always available",
      color: "from-purple-500 to-pink-600"
    }
  ]

  const locations = [
    {
      city: "San Francisco",
      country: "United States",
      address: "123 Blockchain Ave, Suite 100",
      zip: "94105",
      phone: "+1 (555) 123-4567",
              email: "sf@aztlanfi.com"
    },
    {
      city: "Mexico City",
      country: "Mexico",
      address: "Av. Reforma 123, Col. Centro",
      zip: "06000",
      phone: "+52 (55) 1234-5678",
              email: "mx@aztlanfi.com"
    }
  ]

  const socialLinks = [
    {
      name: "LinkedIn",
              url: "https://linkedin.com/company/aztlanfi",
      icon: Linkedin,
      color: "hover:text-blue-600"
    },
    {
      name: "Twitter",
              url: "https://twitter.com/aztlanfi",
      icon: Twitter,
      color: "hover:text-blue-400"
    },
    {
      name: "GitHub",
              url: "https://github.com/aztlanfi",
      icon: Github,
      color: "hover:text-gray-800"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <main className="pt-16">
        <section className="py-20 bg-gradient-to-br from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions? Need help? We're here for you. 
                Our team is available 24/7 to assist you.
              </p>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-600 font-medium">{info.content}</p>
                  <p className="text-sm text-gray-500 mt-1">{info.subtitle}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-monad-500 focus:border-transparent transition-all duration-200"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-monad-500 focus:border-transparent transition-all duration-200"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-monad-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a subject</option>
                      <option value="soporte">Technical Support</option>
                      <option value="cuenta">Account & Wallet</option>
                      <option value="transaccion">Transaction Issue</option>
                      <option value="tarifas">Fee Inquiry</option>
                      <option value="empresa">Business Support</option>
                      <option value="otro">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-monad-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Describe your inquiry or problem..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-monad-600 to-purple-700 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                  
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800"
                    >
                      <CheckCircle size={20} />
                      <span>Message sent successfully! We'll respond soon.</span>
                    </motion.div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800"
                    >
                      <AlertCircle size={20} />
                      <span>There was an error sending the message. Please try again.</span>
                    </motion.div>
                  )}
                </form>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-8"
              >
                {/* Locations */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Our Offices
                  </h2>
                  
                  <div className="space-y-6">
                    {locations.map((location, index) => (
                      <motion.div
                        key={location.city}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-monad-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                            <MapPin className="text-white" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {location.city}, {location.country}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {location.address}<br />
                              {location.zip}
                            </p>
                            <div className="space-y-1 text-sm text-gray-500">
                              <p>📞 {location.phone}</p>
                              <p>✉️ {location.email}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Follow Us
                  </h2>
                  
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                        className="w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                        aria-label={`Follow us on ${social.name}`}
                      >
                        <social.icon size={24} className={social.color} />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Support Features */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Why choose our support?
                  </h2>
                  
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.4 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Clock className="text-green-600" size={16} />
                      </div>
                      <span className="text-gray-700">Response in less than 5 minutes</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="text-blue-600" size={16} />
                      </div>
                      <span className="text-gray-700">Blockchain specialized team</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.6 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Shield className="text-purple-600" size={16} />
                      </div>
                      <span className="text-gray-700">24/7 support in English</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.7 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Zap className="text-orange-600" size={16} />
                      </div>
                      <span className="text-gray-700">Quick problem resolution</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
