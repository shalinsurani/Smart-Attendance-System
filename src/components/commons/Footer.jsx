import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">VisionAttend</h3>
            <p className="text-sm sm:text-base text-gray-400">
              AI-powered attendance management for modern institutions
            </p>
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Product</h4>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Legal</h4>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm sm:text-base text-gray-400">
          <p>&copy; 2025 VisionAttend. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
