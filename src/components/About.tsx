'use client'

import { motion } from 'framer-motion'
import { 
  Heart, 
  Target, 
  Eye, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  Star,
  Award,
  TrendingUp,
  ArrowRight,
  Quote,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react'

export function About() {
  const values = [
    {
      icon: Heart,
      title: "Social Impact",
              description: "Reduce remittance costs for migrant families and improve their quality of life",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Total Security",
      description: "Protecting every transaction with cutting-edge blockchain technology",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Zap,
      title: "Constant Innovation",
      description: "Always at the forefront of blockchain and fintech technologies",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Bringing financial services to underserved communities worldwide",
      color: "from-green-500 to-emerald-600"
    }
  ]

  const team = [
    {
      name: "Carlos Mendoza",
      role: "CEO & Founder",
      bio: "Former Google engineer with 10+ years in fintech. Passionate about democratizing financial services.",
      avatar: "/avatars/carlos.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Ana Rodríguez",
      role: "CTO & Co-Founder",
      bio: "Blockchain specialist with experience in Ethereum and Monad. Leads technical development.",
      avatar: "/avatars/ana.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Miguel Torres",
      role: "Head of Product",
      bio: "Product manager focused on UX. Experience in mobile apps and financial services.",
      avatar: "/avatars/miguel.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    },
    {
      name: "Sofia Chen",
      role: "Head of Compliance",
      bio: "Lawyer specialized in financial regulation. Ensures compliance in all markets.",
      avatar: "/avatars/sofia.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      }
    }
  ]

  const milestones = [
    {
      year: "2024",
      title: "Beta Launch",
              description: "First version of AztlanFi with Monad blockchain technology"
    },
    {
      year: "2024",
      title: "10,000 Users",
      description: "We reached our first active users milestone"
    },
    {
      year: "2025",
      title: "Regional Expansion",
      description: "We reach 5 Latin American countries"
    },
    {
      year: "2025",
      title: "Serie A",
      description: "$10M investment round to scale operations"
    }
  ]

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About AztlanFi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing remittances with blockchain technology to connect families 
            and reduce costs worldwide
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 mb-20 items-center"
        >
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Our Story
            </h3>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                AztlanFi was born from a simple observation: migrant families were paying 
                too much to send money home. In 2024, our team of engineers 
                and entrepreneurs decided to change this.
              </p>
              <p>
                Using revolutionary Monad blockchain technology, we created the first 
                remittance platform that combines extreme speed (1 second), minimal costs 
                (0.5% vs 7-8% traditional) and absolute security.
              </p>
              <p>
                Today, we are proud to serve thousands of families, reducing their 
                remittance costs by 95% and connecting them instantly with their loved ones.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-monad-600 to-purple-700 rounded-3xl p-8 text-white">
              <Quote size={48} className="mb-6 opacity-80" />
              <blockquote className="text-xl font-medium mb-6">
                "Our mission is simple: democratize remittances. Every peso we save 
                a family is a step toward a more just and connected world."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Users size={24} />
                </div>
                <div>
                  <div className="font-semibold">AztlanFi Team</div>
                  <div className="text-sm opacity-80">Founders</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              Democratize access to quality financial services, reducing remittance costs 
              and connecting migrant families instantly and securely.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <Eye className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be the world's leading blockchain remittance platform, serving millions of 
              families and transforming the traditional financial industry.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
                tabIndex={0}
                role="button"
                aria-label={`Valor: ${value.title}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="text-white" size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Team
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-shadow duration-300"
                tabIndex={0}
                role="button"
                aria-label={`Miembro del equipo: ${member.name}`}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-monad-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
                <p className="text-monad-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                
                <div className="flex justify-center space-x-3">
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors" aria-label={`LinkedIn de ${member.name}`}>
                    <Linkedin size={20} />
                  </a>
                  <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors" aria-label={`Twitter de ${member.name}`}>
                    <Twitter size={20} />
                  </a>
                  <a href={member.social.github} className="text-gray-400 hover:text-gray-800 transition-colors" aria-label={`GitHub de ${member.name}`}>
                    <Github size={20} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Journey
          </h3>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-monad-600 to-purple-600"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="text-2xl font-bold text-monad-600 mb-2">{milestone.year}</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 bg-gradient-to-r from-monad-600 to-purple-600 rounded-full border-4 border-white shadow-lg relative z-10"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-monad-600 to-purple-700 rounded-3xl p-12 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-12">
            Impact in Numbers
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="opacity-90">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2M+</div>
              <div className="opacity-90">In Remittances Sent</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="opacity-90">Cost Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1s</div>
              <div className="opacity-90">Average Time</div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-white" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Location</h4>
            <p className="text-gray-600">San Francisco, CA<br />México City, MX</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="text-white" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Contact</h4>
            <p className="text-gray-600">+1 (555) 123-4567<br />24/7 Support</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-white" size={32} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Email</h4>
            <p className="text-gray-600">hola@aztlanfi.com<br />soporte@aztlanfi.com</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
