import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUserGraduate, FaChalkboardTeacher, FaChartLine, FaClock, FaShieldAlt, FaMobile } from 'react-icons/fa'
import LandingHeader from '../components/commons/LandingHeader'
import Footer from '../components/commons/Footer'

const Landing = () => {
  const features = [
    {
      icon: <FaUserGraduate className="text-4xl" />,
      title: 'AI Face Recognition',
      description: 'Advanced facial recognition technology for accurate and fast attendance marking'
    },
    {
      icon: <FaClock className="text-4xl" />,
      title: 'Real-time Tracking',
      description: 'Instant attendance updates with automatic synchronization across all devices'
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights with visual charts and detailed attendance reports'
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted data storage and privacy protection'
    },
    {
      icon: <FaChalkboardTeacher className="text-4xl" />,
      title: 'Easy Management',
      description: 'Intuitive interface for teachers to manage classes and students effortlessly'
    },
    {
      icon: <FaMobile className="text-4xl" />,
      title: 'Mobile Friendly',
      description: 'Access from any device with responsive design and optimized performance'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Students' },
    { number: '500+', label: 'Teachers' },
    { number: '99.9%', label: 'Accuracy' },
    { number: '24/7', label: 'Support' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Smart Attendance with
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Face Recognition
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Transform your attendance management with cutting-edge facial recognition technology. 
              Fast, accurate, and effortless tracking for modern educational institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                to="/register"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 rounded-lg text-base sm:text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-12 sm:mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Powerful Features
            </h2>
            <p className="text-base sm:text-xl text-gray-600 px-4">
              Everything you need for modern attendance management
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 hover:shadow-xl transition-all"
              >
                <div className="text-indigo-600 mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Attendance System?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 sm:mb-8">
              Join thousands of institutions already using VisionAttend
            </p>
            <Link
              to="/register"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Landing
