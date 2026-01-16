import React, { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Calendar, Home, Inbox, Search, LogOut, User, BookOpen, GraduationCap, CheckCircle, Clock, FileText } from "lucide-react"
import axios from "axios";
import Navbar from "@/components/ui/Navbar";

const Dashboard = () => {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user")) || {}
  const email = location.state?.email || user?.email
  const id = location.state?.id || user?.id
  const nav = useNavigate()
  const [userData, setUserData] = useState(null)
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`http://localhost:3000/users/${id}`)
        setUserData(result.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchUser()
  }, [id])

  const handleLogout = () => {
    localStorage.removeItem("user")
    nav('/login')
  }

  // Mock Attendance Data
  const attendancePercentage = 78;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">

        {/* SIDEBAR */}
        <Sidebar collapsible="icon" className={'shrink-0 border-r bg-white'}>
          <SidebarHeader className="px-4 py-4 border-b">
             <div className="flex items-center gap-2 text-indigo-600">
                <GraduationCap className="h-6 w-6" />
                <span className="font-bold text-lg">College ERP</span>
             </div>
          </SidebarHeader>

          <SidebarContent className="p-3 mt-2">
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <NavLink 
                  to='/dashboard' 
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <Home className="w-5 h-5" /> 
                  <span>Dashboard</span>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink 
                  to="/examform" 
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <FileText className="w-5 h-5" /> 
                  <span>Exam Form</span>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <NavLink 
                  to="/result" 
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <Inbox className="w-5 h-5" /> 
                  <span>Results</span>
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{userData?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
            </div>
            <Button variant="destructive" className="w-full flex items-center gap-2 justify-center shadow-sm hover:shadow-md transition-all" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
            {/* Header / Navbar */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
                    <p className="text-sm text-gray-500">Welcome back, {userData?.name}</p>
                </div>
                <div className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                    Academic Year: 2025-26
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto space-y-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Profile Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-6 border-b pb-4">
                            <User className="text-indigo-600 w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                                <p className="text-lg font-medium text-gray-900">{userData?.name || "Loading..."}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Student ID (PRN)</label>
                                <p className="text-lg font-medium text-gray-900">{userData?.id || "Loading..."}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
                                <p className="text-lg font-medium text-gray-900">{userData?.email || "Loading..."}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Current Semester</label>
                                <p className="text-lg font-medium text-gray-900">
                                    {userData?.examForm?.semester ? `Semester ${userData.examForm.semester}` : "Not Registered"}
                                </p>
                            </div>
                        </div>
                    </div>

                     {/* Attendance Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 z-0"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="text-green-600 w-6 h-6" />
                                <h2 className="text-xl font-bold text-gray-800">Attendance</h2>
                            </div>
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                                        <circle cx="64" cy="64" r="56" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="351.86" strokeDashoffset={351.86 - (351.86 * attendancePercentage) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                                    </svg>
                                    <span className="absolute text-3xl font-bold text-gray-800">{attendancePercentage}%</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">Average attendance this semester</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div>
                     <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">Quick Actions</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         
                         {/* Exam Form Link */}
                        <div 
                            className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer"
                            onClick={() => nav('/examform')}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                    <FileText className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                                </div>
                                {userData?.examForm?.status && (
                                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        userData.examForm.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                        userData.examForm.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                     }`}>
                                        {userData.examForm.status}
                                     </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Exam Application</h3>
                            <p className="text-sm text-gray-500 mb-4">Submit or view your exam form for the upcoming semester.</p>
                            <span className="text-indigo-600 text-sm font-medium group-hover:underline">Go to Exam Form &rarr;</span>
                        </div>

                         {/* Results Link */}
                        <div 
                            className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer"
                            onClick={() => nav('/result')}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-600 transition-colors">
                                    <Inbox className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">View Results</h3>
                            <p className="text-sm text-gray-500 mb-4">Check your marks, internal scores, and grade reports.</p>
                            <span className="text-purple-600 text-sm font-medium group-hover:underline">View Results &rarr;</span>
                        </div>

                        {/* Calendar / Timetable Mockup - Placeholder for future */}
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 shadow-md text-white">
                             <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-1">Academic Calendar</h3>
                            <p className="text-blue-100 text-sm mb-4">Next Event: Mid-Semester Exams start from 15th Oct.</p>
                            <Button size="sm" variant="secondary" className="w-full bg-white/10 text-white hover:bg-white/20 border-0">View Calendar</Button>
                        </div>
                     </div>
                </div>

            </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
