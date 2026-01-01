import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaQuestionCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const FAQsModal = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How do I mark my attendance?',
      answer: 'Your teacher will start an attendance session during class. When the session is active, you can use the face recognition feature to mark your attendance. Make sure you have registered your face in the system first.'
    },
    {
      question: 'How do I register my face?',
      answer: 'Go to Settings from the navigation menu. Click on "Register Face" and follow the on-screen instructions. Make sure you are in a well-lit area and look directly at the camera.'
    },
    {
      question: 'What if my attendance is marked incorrectly?',
      answer: 'You can report the issue by clicking on "Report Issue" in the Support section of your dashboard. Select "Wrong Attendance Marked" and provide details. The admin will review and correct it.'
    },
    {
      question: 'How can I view my attendance history?',
      answer: 'Your attendance history is displayed on your dashboard. You can filter by date, class, or search for specific records. You can also export your attendance report in Excel or PDF format.'
    },
    {
      question: 'What is the attendance streak?',
      answer: 'Attendance streak shows how many consecutive days you have attended classes. It helps you track your consistency. Your current streak and longest streak are displayed on your dashboard.'
    },
    {
      question: 'How do I contact my teacher?',
      answer: 'Click on "Contact Teacher" in the Support section. Select the teacher from the dropdown, enter your topic and message, and submit. The teacher will receive your message and can respond.'
    },
    {
      question: 'Can I change my password?',
      answer: 'Yes! Go to Settings and click on the "Password" tab. Enter your current password (or enrollment number if first time), then enter and confirm your new password.'
    },
    {
      question: 'What if I forget my password?',
      answer: 'Contact your teacher or admin to reset your password. For first-time login, use your enrollment number as the password.'
    },
    {
      question: 'How do I export my attendance report?',
      answer: 'On your dashboard, scroll to the Attendance History section. Click on "Export Excel" or "Export PDF" buttons to download your complete attendance report.'
    },
    {
      question: 'What does the attendance percentage mean?',
      answer: 'Your attendance percentage shows the ratio of classes you attended versus total classes conducted. A percentage below 75% will trigger a warning alert.'
    },
    {
      question: 'Can I update my personal information?',
      answer: 'Yes, go to Settings and update your phone number, parent/guardian information. Some fields like email and student ID are read-only and can only be changed by admin.'
    },
    {
      question: 'What should I do if the face recognition is not working?',
      answer: 'Make sure you are in a well-lit area, remove any obstructions (glasses, mask if possible), and look directly at the camera. If the issue persists, report it using the "Report Issue" feature.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <FaQuestionCircle className="mr-2" />
                  FAQs & User Guide
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <p className="text-green-100 mt-2">
                Find answers to common questions about using VisionAttend
              </p>
            </div>

            <div className="p-6 space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition-colors"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <FaChevronUp className="text-green-600 flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white text-gray-700 border-t border-gray-200">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-xl">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Still have questions? Contact your teacher or admin for assistance.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default FAQsModal
