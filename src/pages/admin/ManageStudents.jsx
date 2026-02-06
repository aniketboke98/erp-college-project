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
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Home, Users, LogOut, Search, Plus, Trash, Edit, BookOpen } from "lucide-react"
import axios from 'axios'

const ManageStudents = () => {
    const nav = useNavigate()
    const [students, setStudents] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingStudent, setEditingStudent] = useState(null)
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student" 
    })

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`https://erp-college-project.onrender.com/users`)
            setStudents(res.data.filter(user => user.role === 'student'))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleAddStudent = async () => {
        try {
            
            const newId = `S${Math.floor(1000 + Math.random() * 9000)}` 
            const newStudent = { ...formData, id: newId, role: 'student', examHistory: [] }
            
            await axios.post(`https://erp-college-project.onrender.com/users`, newStudent)
            fetchStudents()
            setIsAddModalOpen(false)
            setFormData({ name: "", email: "", password: "", role: "student" })
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (id) => {
        if(confirm("Are you sure you want to delete this student?")) {
            try {
                await axios.delete(`https://erp-college-project.onrender.com/users/${id}`)
                fetchStudents()
            } catch (error) {
                console.log(error)
            }
        }
    }

    const openEditModal = (student) => {
        setEditingStudent(student)
        setFormData({
            name: student.name,
            email: student.email,
            password: student.password,
            role: 'student'
        })
        setIsEditModalOpen(true)
    }

    const handleEditStudent = async () => {
        try {
            await axios.put(`https://erp-college-project.onrender.com/users/${editingStudent.id}`, {
                ...editingStudent,
                ...formData
            })
            fetchStudents()
            setIsEditModalOpen(false)
            setEditingStudent(null)
        } catch (error) {
            console.log(error)
        }
    }
    
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                <Sidebar collapsible="icon" className={'shrink-0 border-r'}>
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
                        <h1 className="text-2xl font-bold">Manage Students</h1>
                        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                            <Plus size={16}/> Add Student
                        </Button>
                    </div>

                    <div className="mb-6 relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search students..." 
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-700">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.id}</td>
                                        <td className="px-6 py-4">{student.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => openEditModal(student)}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleDelete(student.id)}>
                                                <Trash size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">No students found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* ADD STUDENT MODAL */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="John Doe"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="john@example.com"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <input name="password" value={formData.password} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="*****" type="password"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddStudent}>Add Student</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             
             <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Student</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded px-3 py-2"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded px-3 py-2"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <input name="password" value={formData.password} onChange={handleInputChange} className="w-full border rounded px-3 py-2" type="password"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditStudent}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </SidebarProvider>
    )
}

export default ManageStudents
