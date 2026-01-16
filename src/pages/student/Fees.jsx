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
import { Home, Inbox, Search, LogOut, CheckCircle, Clock, XCircle, FileText } from "lucide-react"
import axios from "axios";

const Fees = () => {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user")) || {}
  const email = location.state?.email || user?.email
  const id = location.state?.id || user?.id
  const nav = useNavigate()
  
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [semester, setSemester] = useState("")
  const [subjects, setSubjects] = useState([
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" }
  ])

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/users/${id}`)
      setUserData(res.data)
    } catch (error) {
      console.log(error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) nav('/login');
    fetchUserData()
  }, [])

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...subjects]
    newSubjects[index].name = value
    setSubjects(newSubjects)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!semester || subjects.some(s => !s.name)) {
        alert("Please fill all fields");
        return;
    }

    try {
      // Structure the data for Exam Form
      const examFormData = {
        semester,
        status: "Pending", // Initial status
        subjects: subjects.map(s => ({
            name: s.name,
            internal: 0,
            maxInternal: 30, // Default max
            external: 0,
            maxExternal: 70, // Default max
            total: 0
        }))
      }

      await axios.patch(`http://localhost:3000/users/${id}`, {
        examForm: examFormData
      });

      alert("Exam Form Submitted Successfully!");
      fetchUserData(); // Refresh to show status

    } catch (err) {
      console.log(err)
      alert("Failed to submit form");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user")
    nav('/login')
  }

  const getStatusBadge = (status) => {
      switch(status) {
          case 'Accepted': return <span className="flex items-center gap-2 text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full"><CheckCircle size={16}/> Accepted</span>
          case 'Rejected': return <span className="flex items-center gap-2 text-red-600 font-bold bg-red-100 px-3 py-1 rounded-full"><XCircle size={16}/> Rejected</span>
          default: return <span className="flex items-center gap-2 text-yellow-600 font-bold bg-yellow-100 px-3 py-1 rounded-full"><Clock size={16}/> Pending</span>
      }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">

        {/* SIDEBAR */}
        <Sidebar collapsible="icon" className={'shrink-0 border-r bg-white'}>
          <SidebarHeader className="px-4 py-4 border-b">
            <span className="font-semibold text-sm">Student Portal</span>
            <h1 className="font-bold text-lg">{userData?.name}</h1>
            <p className="text-xs text-muted-foreground">{id}</p>
          </SidebarHeader>

          <SidebarContent className="p-2 mt-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <NavLink to={'/dashboard'} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>
                        <Home className="w-5 h-5"/> <span>Dashboard</span>
                    </NavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                     <NavLink to="/examform" state={{email,id}} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>
                        <FileText className="w-5 h-5"/> <span>Exam Form</span>
                    </NavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <NavLink to="/result" state={{email,id}} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>
                        <Inbox className="w-5 h-5"/> <span>Result</span>
                    </NavLink>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t">
            <Button variant="destructive" className="w-full flex items-center gap-2 justify-center shadow-sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 flex justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Exam Application Form</h1>
                
                {loading ? <p className="text-center text-gray-500">Loading...</p> : userData?.examForm ? (
                    // STATUS VIEW
                    <div className="bg-white rounded-xl shadow-md border p-8 text-center">
                        <div className="flex justify-center mb-4">
                            {getStatusBadge(userData.examForm.status)}
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">Application Submitted</h2>
                        <p className="text-muted-foreground mb-6">
                            You have submitted the exam form for <strong>Semester {userData.examForm.semester}</strong>.
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto border">
                            <h3 className="font-semibold mb-3 border-b pb-2 text-gray-700">Selected Subjects:</h3>
                            <ul className="space-y-2">
                                {userData.examForm.subjects.map((sub, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        {sub.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {userData.examForm.status === 'Rejected' && (
                             <div className="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
                                Your application was rejected. Please contact the administration office.
                             </div>
                        )}
                    </div>
                ) : (
                    // FORM VIEW
                    <div className="bg-white rounded-xl shadow-md border p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Select Semester</label>
                                <select 
                                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    value={semester}
                                    onChange={(e) => setSemester(e.target.value)}
                                >
                                    <option value="">Choose Semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>Semester {n}</option>)}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Subjects</label>
                                {subjects.map((sub, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className="text-sm font-medium w-8 text-gray-500">#{idx + 1}</span>
                                        <input
                                            type="text"
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                            placeholder={`Subject ${idx + 1} Name`}
                                            value={sub.name}
                                            onChange={(e) => handleSubjectChange(idx, e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                Submit Exam Application
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    </div>
    </SidebarProvider>
  )
}

export default Fees