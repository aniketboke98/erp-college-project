import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Home, Users, LogOut, Search, Plus, Trash, BookOpen } from "lucide-react"
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const ManageCourses = () => {
    const nav = useNavigate()
    const [courses, setCourses] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: ""
    })

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`https://erp-college-project.onrender.com/courses`)
            setCourses(res.data)
        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch courses")
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleAddCourse = async () => {
        if (!formData.name || !formData.code) {
            toast.warning("Please fill in required fields")
            return
        }
        try {
            const newCourse = { ...formData, id: `C${Math.floor(1000 + Math.random() * 9000)}` }
            await axios.post(`https://erp-college-project.onrender.com/courses`, newCourse)
            toast.success("Course added successfully")
            fetchCourses()
            setIsAddModalOpen(false)
            setFormData({ name: "", code: "", description: "" })
        } catch (error) {
            console.log(error)
            toast.error("Failed to add course")
        }
    }

    const handleDelete = async (id) => {
        if(confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`https://erp-college-project.onrender.com/courses/${id}`)
                toast.success("Course deleted")
                fetchCourses()
            } catch (error) {
                console.log(error)
                toast.error("Failed to delete course")
            }
        }
    }
    
    const filteredCourses = courses.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                <Sidebar collapsible="icon" className={'shrink-0 border-r bg-white'}>
                    <SidebarHeader className="px-4 py-4 border-b">
                        <h1 className="font-bold text-lg text-primary">Admin Panel</h1>
                    </SidebarHeader>
                    <SidebarContent className="p-2">
                        <SidebarMenu>
                             <SidebarMenuItem>
                                <NavLink to='/admin/dashboard' className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}>
                                    <Home className="w-5 h-5" /> <span>Dashboard</span>
                                </NavLink>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <NavLink to="/admin/students" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}>
                                    <Users className="w-5 h-5" /> <span>Manage Students</span>
                                </NavLink>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <NavLink to="/admin/teachers" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}>
                                    <Users className="w-5 h-5" /> <span>Manage Teachers</span>
                                </NavLink>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <NavLink to="/admin/courses" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}>
                                    <BookOpen className="w-5 h-5" /> <span>Manage Courses</span>
                                </NavLink>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter className="p-4 border-t">
                        <Button variant="destructive" className="w-full flex items-center gap-2 justify-center" onClick={() => nav('/login')}>
                            <LogOut className="w-4 h-4" /> Logout
                        </Button>
                    </SidebarFooter>
                </Sidebar>

                
                <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Manage Courses</h1>
                        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                            <Plus size={16}/> Add Course
                        </Button>
                    </div>

                    <div className="mb-6 relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search courses..." 
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-700">
                                <tr>
                                    <th className="px-6 py-3">Code</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredCourses.map(course => (
                                    <tr key={course.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{course.code}</td>
                                        <td className="px-6 py-4 font-medium">{course.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{course.description}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleDelete(course.id)}>
                                                <Trash size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCourses.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">No courses found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* ADD COURSE MODAL */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Course Code</label>
                            <input name="code" value={formData.code} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="e.g. CS101"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Course Name</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="e.g. Intro to CS"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="Course details..."/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddCourse}>Add Course</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ToastContainer position="top-right"/>
        </SidebarProvider>
    )
}

export default ManageCourses
