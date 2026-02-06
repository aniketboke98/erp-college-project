import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './App.css'
import Signup from './pages/login/Signup'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'
import Login from './pages/login/Login'
import Dashboard from './pages/student/Dashboard'
import Result from './pages/student/Result'
import Fees from './pages/student/Fees'
import Dashboardam from './pages/admin/Dashboard'
import ManageStudents from './pages/admin/ManageStudents'
import ManageTeachers from './pages/admin/ManageTeachers'

function App() {

  return (
    <>
    
    <Router>
       
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={ <Signup/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/admin/dashboard' element={<Dashboardam/>}></Route>
          <Route path='/admin/students' element={<ManageStudents/>}></Route>
          <Route path='/admin/teachers' element={<ManageTeachers/>}></Route>
          <Route path='/result' element={<Result/>}></Route>
          <Route path='/examform' element={<Fees/>}></Route>
          <Route path='/admin/courses' element={<ManageCourses/>}></Route>
        </Routes>
    </Router>
    </>
  )
}

export default App
