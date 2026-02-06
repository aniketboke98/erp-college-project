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
} from "@/components/ui/sidebar"
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Home, Inbox, LogOut, CheckCircle, Clock, XCircle, FileText, PlusCircle, History } from "lucide-react"
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Fees = () => {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user")) || {}
  const email = location.state?.email || user?.email
  const id = location.state?.id || user?.id
  const nav = useNavigate()
  
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
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
      const res = await axios.get(`https://erp-college-project.onrender.com/users/${id}`)
      setUserData(res.data)
      // Check if user has no pending forms to optionally show form? 
      // For now we'll default to showing history if exists, else show form button
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch user data")
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
        toast.warn("Please fill all fields");
        return;
    }

    // Check for duplicate semester
    if (userData?.examHistory?.some(form => form.semester === semester)) {
        toast.error(`Exam form for Semester ${semester} already exists!`);
        return;
    }

    try {
      const newExamForm = {
        semester,
        submittedAt: new Date().toISOString(),
        status: "Pending",
        subjects: subjects.map(s => ({
            name: s.name,
            internal: 0,
            maxInternal: 30,
            external: 0,
            maxExternal: 70,
            total: 0
        }))
      }

      // Append to existing history or create new array
      const updatedHistory = userData?.examHistory ? [...userData.examHistory, newExamForm] : [newExamForm];

      await axios.patch(`https://erp-college-project.onrender.com/users/${id}`, {
        examHistory: updatedHistory
      });

      toast.success("Exam Form Submitted Successfully!");
      setShowForm(false);
      setSemester("");
      setSubjects([{ name: "" }, { name: "" }, { name: "" }, { name: "" }]);
      fetchUserData(); 

    } catch (err) {
      console.log(err)
      toast.error("Failed to submit form");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user")
    nav('/login')
  }

  const getStatusBadge = (status) => {
      switch(status) {
          case 'Accepted': return <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full"><CheckCircle size={12}/> Accepted</span>
          case 'Rejected': return <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full"><XCircle size={12}/> Rejected</span>
          default: return <span className="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full"><Clock size={12}/> Pending</span>
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
            <div className="w-full max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Exam Applications</h1>
                    {!showForm && (
                        <Button onClick={() => setShowForm(true)} className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
                            <PlusCircle size={20}/> New Application
                        </Button>
                    )}
                </div>
                
                {loading ? <p className="text-center text-gray-500">Loading...</p> : (
                    <>
                        {showForm ? (
                            // FORM VIEW
                            <div className="bg-white rounded-xl shadow-md border p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">New Exam Application</h2>
                                    <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                                </div>
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
                                        Submit Application
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            // HISTORY LIST VIEW
                            <div className="space-y-6">
                                {userData?.examHistory && userData.examHistory.length > 0 ? (
                                    <div className="grid gap-4">
                                        {userData.examHistory.slice().reverse().map((form, index) => (
                                            <div key={index} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">Semester {form.semester}</h3>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <History size={12}/> Submitted on: {form.submittedAt ? new Date(form.submittedAt).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(form.status)}
                                                </div>
                                                
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subjects</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {form.subjects.map((sub, i) => (
                                                            <span key={i} className="bg-white border text-gray-600 text-xs px-2 py-1 rounded">
                                                                {sub.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <Inbox className="text-gray-400"/>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No Applications Found</h3>
                                        <p className="text-gray-500 mb-4">You haven't submitted any exam forms yet.</p>
                                        <Button onClick={() => setShowForm(true)} variant="outline">Create First Application</Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
        <ToastContainer position="top-right"/>
    </div>
    </SidebarProvider>
  )
}

export default Fees