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
import { Home, Inbox, Search, LogOut, FileText, ChevronDown } from "lucide-react"
import axios from "axios";

const Result = () => {
  const location = useLocation()
  const nav = useNavigate()
  const user = JSON.parse(localStorage.getItem("user")) || {}
  const email = location.state?.email || user?.email
  const id = location.state?.id || user?.id
  
  const [userData, setUserData] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [currentResult, setCurrentResult] = useState(null)
  
  const fetchUserData = async()=>{
    try {
      const res = await axios.get(`https://erp-college-project.onrender.com/users/${id}`)
      setUserData(res.data)
      
      // Select the latest Accepted exam by default
      if (res.data.examHistory && res.data.examHistory.length > 0) {
        const acceptedExams = res.data.examHistory.filter(e => e.status === 'Accepted');
        if (acceptedExams.length > 0) {
            // Sort to find latest if needed, or just take last
            setSelectedSemester(acceptedExams[acceptedExams.length - 1].semester);
        } else {
            // Or just take the last one regardless of status
            setSelectedSemester(res.data.examHistory[res.data.examHistory.length - 1].semester);
        }
      }
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

  // Find the selected exam form
  useEffect(() => {
    if (userData && userData.examHistory && selectedSemester) {
        const found = userData.examHistory.find(h => h.semester === selectedSemester);
        setCurrentResult(found);
    }
  }, [userData, selectedSemester]);


  // Calculation Logic
  const getResultSummary = () => {
      if (!currentResult?.subjects) return { total: 0, percent: 0, result: 'N/A' }
      
      const subjects = currentResult.subjects
      const grandTotal = subjects.reduce((acc, sub) => acc + (parseInt(sub.total) || 0), 0)
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
                
                {/* Semester Selector Header */}
                <div className="bg-white p-6 border-b flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Examination Result</h1>
                    <div className="w-48">
                         <div className="relative">
                            <select 
                                className="w-full appearance-none bg-indigo-50 border border-indigo-200 text-indigo-800 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 font-medium cursor-pointer"
                                value={selectedSemester || ''}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                disabled={!userData?.examHistory || userData.examHistory.length === 0}
                            >
                                {userData?.examHistory?.map((h, i) => (
                                    <option key={i} value={h.semester}>Semester {h.semester}</option>
                                ))}
                                {!userData?.examHistory?.length && <option>No Results</option>}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {!currentResult || currentResult.status !== 'Accepted' ? (
                     <div className="p-16 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Clock className="text-gray-400 w-8 h-8"/>
                        </div>
                         <h2 className="text-xl font-semibold text-gray-700">Result Not Available</h2>
                         <p className="mt-2 text-sm text-gray-500">
                            {currentResult 
                                ? `The result for Semester ${currentResult.semester} is currently ${currentResult.status}.` 
                                : "Please select a semester to view results."}
                         </p>
                     </div>
                ) : (
                    <>
                        <div className="bg-indigo-50/50 p-6 border-b border-indigo-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">{userData.name}</h2>
                                    <p className="text-sm text-gray-600">Student ID: {id}</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-bold text-indigo-600">{summary.percent}%</h2>
                                    <p className="text-sm font-semibold text-gray-500 uppercase">{summary.result}</p>
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
                                    {currentResult.subjects.map((sub, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-800">{sub.name}</td>
                                            <td className="px-4 py-3 text-center text-gray-600">{sub.internal}</td>
                                            <td className="px-4 py-3 text-center text-gray-600">{sub.external}</td>
                                            <td className="px-4 py-3 text-center font-bold text-gray-800">{sub.total}</td>
                                            <td className="px-4 py-3 text-center">
                                                {sub.total >= 40 ? 
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Pass</span> : 
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Fail</span>
                                                }
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