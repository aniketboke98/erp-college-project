import React, { useState } from "react";
import { data, NavLink } from "react-router-dom";
import Login from "./Login";
import axios from "axios";
import { ToastContainer } from "react-toastify";
const Signup = () => {
    const [user,setUser] = useState({name:'',email:'',password:'', role:''})

    const dataHandler= (e)=>{
        setUser({...user, [e.target.name] : e.target.value})
    }
    const Submithandler= async(e)=>{
        e.preventDefault()
        try{
            const result = await axios.post('http://localhost:3000/users',user)
            setUser(result.data);
            toast.success("Register successful!", result.data.username);
        }catch(err){
           toast.success("Register!", err);
        }
    }
  return (
    <>
    <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
      <div
        className="card p-4 shadow"
        style={{ width: "420px", borderRadius: "12px" }}
      >
        <h3 className="text-xl font-medium text-black dark:text-white text-center">Create Account</h3>

        <form onSubmit={(e)=>Submithandler(e)}>
          {/* Name */}
          <div className="mb-3">
            <label className="block text-sm/6 font-medium text-gray-900">Full Name</label>
            <input
              type="text"
              name='username'
              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              placeholder="Enter your name"
              onChange={(e)=>dataHandler(e)}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-sm/6 font-medium text-gray-900">Email Address</label>
            <input
              type="email"
              name="email"
              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              placeholder="example@gmail.com"
              onChange={(e)=>dataHandler(e)}
            />
          </div>

          {/* Password */}
          <div className="mb-3 w-xl">
            <label className="w-xl block text-sm/6 font-medium text-gray-900">Password</label>
            <input
              type="password"
              name="password"
              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              placeholder="Enter password"
              onChange={(e)=>dataHandler(e)}
            />
          </div>

          {/* Role */}
          <div className="mb-4 w-full">
            <label className="block text-sm/6 font-medium text-gray-900">Select Role</label>
            <select className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={(e)=>dataHandler(e)} name="role">
              <option value="">Choose role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Button */}
          <div className="d-grid">
            <button type="submit" className="w-full bg-violet-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700 text-white font-semibold py-2 px-4 rounded-3xl align-center">
              Register
            </button>
          </div>

          {/* Footer */}
          <p className="text-center mt-3 text-black">
            Already have an account? <span className="text-blue-400"><NavLink to='/login'>Login</NavLink></span>
          </p>
        </form>
      </div>
    </div>
    <ToastContainer/>
    </>
  );
};

export default Signup;
