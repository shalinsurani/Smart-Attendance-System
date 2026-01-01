import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import TopNavbar from '../../components/TopNavbar'
import Footer from '../../components/commons/Footer'
import StudentHome from './StudentHome'
import StudentSettings from './StudentSettings'

const StudentDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onCollapseChange={setIsCollapsed} />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <TopNavbar isCollapsed={isCollapsed} />
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Routes>
            <Route path="/" element={<StudentHome />} />
            <Route path="/settings" element={<StudentSettings />} />
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default StudentDashboard
