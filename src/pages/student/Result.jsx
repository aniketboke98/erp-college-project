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
import { Home, Inbox, Search, LogOut, FileText } from "lucide-react"
import axios from "axios";
import Navbar from "@/components/ui/Navbar";

const Result = () => {
  const location = useLocation()
  const nav = useNavigate()
  const user = JSON.parse(localStorage.getItem("user")) || {}
  const email = location.state?.email || user?.email
  const id = location.state?.id || user?.id
  
  const [userData, setUserData] = useState(null)
  
  const fetchUserData = async()=>{
    try {
      const res = await axios.get(`http://localhost:3000/users/${id}`)
      setUserData(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(!id) nav('/login');
    fetchUserData()
  },[])

  const handleLogout = () => {
    localStorage.removeItem("user")
    nav('/login')
  }

  // Calculation Logic
  const getResultSummary = () => {
      if (!userData?.examForm?.subjects) return { total: 0, percent: 0, result: 'N/A' }
      
      const subjects = userData.examForm.subjects
      const grandTotal = subjects.reduce((acc, sub) => acc + (sub.total || 0), 0)
      const maxTotal = subjects.length * 100
      const percent = (grandTotal / maxTotal) * 100
      const result = percent >= 40 ? 'PASS' : 'FAIL'
      
      return { total: grandTotal, percent: percent.toFixed(2), result }
  }

  const summary = getResultSummary()

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
             <div className="w-full max-w-4xl bg-white shadow-lg border rounded-xl overflow-hidden h-fit">
                {!userData?.examForm || userData.examForm.status !== 'Accepted' ? (
                     <div className="p-10 text-center">
                         <h2 className="text-xl font-semibold text-muted-foreground">Result Not Declared Yet</h2>
                         <p className="mt-2 text-sm text-gray-500">Your exam form is either pending approval or you haven't appeared for exams yet.</p>
                     </div>
                ) : (
                    <>
                        <div className="bg-indigo-50 p-6 border-b border-indigo-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-indigo-800">Examination Result</h1>
                                    <p className="text-indigo-600">Semester {userData.examForm.semester}</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-lg font-bold text-gray-800">{userData.name}</h2>
                                    <p className="text-sm text-gray-600">PRN: {id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 uppercase text-xs font-semibold text-gray-700 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Subject</th>
                                        <th className="px-4 py-3 text-center">Internal (30)</th>
                                        <th className="px-4 py-3 text-center">External (70)</th>
                                        <th className="px-4 py-3 text-center">Total (100)</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {userData.examForm.subjects.map((sub, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50">
                                            <td className="px-4 py-3 font-medium text-gray-800">{sub.name}</td>
                                            <td className="px-4 py-3 text-center text-gray-600">{sub.internal}</td>
                                            <td className="px-4 py-3 text-center text-gray-600">{sub.external}</td>
                                            <td className="px-4 py-3 text-center font-bold text-gray-800">{sub.total}</td>
                                            <td className="px-4 py-3 text-center">
                                                {sub.total >= 40 ? <span className="text-green-600 font-bold">P</span> : <span className="text-red-600 font-bold">F</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 border-t-2 border-gray-100">
                                    <tr>
                                        <td className="px-4 py-3 font-bold text-right text-gray-800" colSpan="3">Grand Total</td>
                                        <td className="px-4 py-3 text-center font-bold text-lg text-indigo-600">{summary.total}</td>
                                        <td className="px-4 py-3"></td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-bold text-right text-gray-800" colSpan="3">Percentage</td>
                                        <td className="px-4 py-3 text-center font-bold text-lg text-indigo-600">{summary.percent}%</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${summary.result === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {summary.result}
                                            </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </>
                )}
             </div>
           </main>
    </div>
    </SidebarProvider>
  )
}

export default Result