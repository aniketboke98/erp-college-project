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
import { Home, Users, BookOpen, LogOut, CheckCircle, XCircle, Clock, FileText, Settings } from "lucide-react"
import axios from "axios";
import Navbaram from "@/components/ui/Navbaram";
import ResultEditModal from "@/components/ui/ResultEditModal"

const Dashboard = () => {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user")) || {}
  const email = location.state?.email || user?.email
  const id = location.state?.id || user?.id
  const nav = useNavigate()
  
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0
  })
  
  const [examForms, setExamForms] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [isResultModalOpen, setIsResultModalOpen] = useState(false)
  const [selectedStudentForResult, setSelectedStudentForResult] = useState(null)

  const fetchData = async () => {
    try {
      const [usersRes, coursesRes] = await Promise.all([
        axios.get(`http://localhost:3000/users`),
        axios.get(`http://localhost:3000/courses`)
      ])
      
      const allUsers = usersRes.data
      const students = allUsers.filter(u => u.role === 'student')
      const teachers = allUsers.filter(u => u.role === 'teacher')

      setStats({
        students: students.length,
        teachers: teachers.length,
        courses: coursesRes.data.length
      })
      
      // Filter students who have submitted exam forms
      setExamForms(students.filter(s => s.examForm))

    } catch (err) {
      console.log(err)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role !== "admin") {
      nav('/login')
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    nav('/login')
  }

  const updateFormStatus = async (studentId, status) => {
      try {
          const student = examForms.find(s => s.id === studentId)
          if (!student) return

          const updatedExamForm = {
              ...student.examForm,
              status: status
          }

          await axios.patch(`http://localhost:3000/users/${studentId}`, {
              examForm: updatedExamForm
          })
          
          fetchData() // Refresh list
      } catch (err) {
          console.error("Failed to update status", err)
      }
  }

  const openResultModal = (student) => {
      setSelectedStudentForResult(student)
      setIsResultModalOpen(true)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar collapsible="icon" className={'shrink-0 border-r'}>
          <SidebarHeader className="px-4 py-4 border-b">
            <h1 className="font-bold text-lg text-primary">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Welcome, {user?.name || 'Admin'}</p>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink 
                  to='/admin/dashboard' 
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
                >
                  <Home className="w-5 h-5" /> 
                  <span>Dashboard</span>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink 
                  to="/admin/students" 
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
                >
                  <Users className="w-5 h-5" /> 
                  <span>Manage Students</span>
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink 
                  to="/admin/teachers" 
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
                >
                  <Users className="w-5 h-5" /> 
                  <span>Manage Teachers</span>
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t">
            <Button variant="destructive" className="w-full flex items-center gap-2 justify-center" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="p-6">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard Overview</h1>
            
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Total Students</h3>
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
                </div>
                <div><div className="text-3xl font-bold mb-1">{stats.students}</div><p className="text-sm text-muted-foreground">Active learners</p></div>
              </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Total Teachers</h3>
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Users className="w-5 h-5" /></div>
                </div>
                <div><div className="text-3xl font-bold mb-1">{stats.teachers}</div><p className="text-sm text-muted-foreground">Faculty members</p></div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Total Courses</h3>
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                </div>
                <div><div className="text-3xl font-bold mb-1">{stats.courses}</div><p className="text-sm text-muted-foreground">Active programs</p></div>
              </div>
            </div>

            {/* Exam Form Applications Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Exam Form Applications</h2>
                <div className="bg-white rounded-md border shadow-sm">
                    {loading ? (
                         <div className="p-8 text-center text-muted-foreground">Loading...</div>
                    ) : examForms.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No exam applications pending.</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Student</th>
                                    <th className="px-6 py-3">Semester</th>
                                    <th className="px-6 py-3">Subjects</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {examForms.map(student => (
                                    <tr key={student.id} className="hover:bg-muted/50">
                                        <td className="px-6 py-4 font-medium">
                                            <div>{student.name}</div>
                                            <div className="text-muted-foreground text-xs">{student.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">{student.examForm.semester}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {student.examForm.subjects.map((sub, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{sub.name}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {student.examForm.status === 'Accepted' && <span className="inline-flex items-center gap-1 text-green-600 font-medium px-2 py-1 bg-green-50 rounded-full text-xs"><CheckCircle size={12}/> Accepted</span>}
                                            {student.examForm.status === 'Rejected' && <span className="inline-flex items-center gap-1 text-red-600 font-medium px-2 py-1 bg-red-50 rounded-full text-xs"><XCircle size={12}/> Rejected</span>}
                                            {student.examForm.status === 'Pending' && <span className="inline-flex items-center gap-1 text-yellow-600 font-medium px-2 py-1 bg-yellow-50 rounded-full text-xs"><Clock size={12}/> Pending</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {student.examForm.status === 'Pending' && (
                                                    <>
                                                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => updateFormStatus(student.id, 'Accepted')}>Accept</Button>
                                                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => updateFormStatus(student.id, 'Rejected')}>Reject</Button>
                                                    </>
                                                )}
                                                {student.examForm.status === 'Accepted' && (
                                                    <Button size="sm" variant="secondary" onClick={() => openResultModal(student)}>
                                                        <FileText size={14} className="mr-1"/> Edit Result
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
          </div>
        </main>
      </div>
      
      <ResultEditModal 
        isOpen={isResultModalOpen} 
        onClose={() => setIsResultModalOpen(false)}
        studentData={selectedStudentForResult}
        onSave={fetchData}
      />
    </SidebarProvider>
  )
}

export default Dashboard
