import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import TopNavbar from '../../components/TopNavbar'
import Footer from '../../components/commons/Footer'
import TeacherHome from './TeacherHomeEnhanced'
import ManageStudents from './ManageStudents'
import ManageClasses from './ManageClasses'
import AttendanceSession from './AttendanceSession'
import ViewAttendance from './ViewAttendance'
import ManageQueries from './ManageQueries'


const TeacherDashboard = () => {
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
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<TeacherHome />} />
            <Route path="/students" element={<ManageStudents />} />
            <Route path="/classes" element={<ManageClasses />} />
            <Route path="/attendance" element={<AttendanceSession />} />
            <Route path="/view-attendance" element={<ViewAttendance />} />
            <Route path="/queries" element={<ManageQueries />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default TeacherDashboard
