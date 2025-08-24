'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Globe, Clock, MessageCircle, Award, CheckCircle, Users, Star } from 'lucide-react'

export function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: 'Safe as a Bank',
      description: 'Your money is protected with the same technology used by the largest banks.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Zap,
      title: 'Instant Money',
      description: 'Your family receives the money in less than 1 minute, like a WhatsApp message.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Globe,
      title: 'Send to Many Countries',
      description: 'Mexico, Guatemala, El Salvador and more. We\'ll add more countries soon.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Clock,
      title: 'Works 24/7',
      description: 'Send money whenever you want, day or night. No limited hours.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: MessageCircle,
      title: 'Support via WhatsApp',
      description: 'We help you when you need it, in Spanish and via WhatsApp.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      icon: Award,
      title: 'We Comply with Laws',
      description: 'We follow all United States and Mexico rules to protect you.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ]

  const testimonials = [
    {
      name: 'Maria Gonzalez',
      location: 'California',
      text: 'I save $40 every month on fees. My mom receives the money instantly.',
      rating: 5
    },
    {
      name: 'Carlos Rodriguez',
      location: 'Texas',
      text: 'It\'s easier than using WhatsApp. I don\'t need to go to the bank or wait in lines.',
      rating: 5
    },
    {
      name: 'Ana Martinez',
      location: 'Florida',
      text: 'The WhatsApp support is incredible. They help me in minutes.',
      rating: 5
    }
  ]

  const certifications = [
    'Identity Verification',
    'Data Protection',
    'Financial Compliance',
    'Bank-Level Security',
    'Spanish Support',
    'Refund Guarantee'
  ]

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Trust AztlanFi?
          </h2>
          <p className="text-lg text-gray-300">
            Thousands of families already trust us to send money safely
          </p>
        </motion.div>

        {/* Trust Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {indicators.map((indicator, index) => (
            <motion.div
              key={indicator.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 border border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 p-6"
              tabIndex={0}
              role="button"
              aria-label={`Trust indicator: ${indicator.title}`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${indicator.bgColor} mb-4`}>
                <indicator.icon className={`w-6 h-6 ${indicator.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {indicator.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {indicator.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            What Our Users Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-sm"
                tabIndex={0}
                role="article"
                aria-label={`Testimonial from ${testimonial.name}`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            Our Security Guarantees
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((cert, index) => (
              <span
                key={cert}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300 flex items-center"
                tabIndex={0}
                role="button"
                aria-label={`Certification: ${cert}`}
              >
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                {cert}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-4">
            Have questions? Chat with us on WhatsApp
          </p>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center mx-auto"
            onClick={() => window.open('https://wa.me/+14155238886', '_blank')}
            aria-label="Contact via WhatsApp"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat on WhatsApp
          </button>
        </motion.div>
      </div>
    </section>
  )
}
