import React, { useEffect, useState } from "react";
import { data, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
const Login = () => {
    const [email, setEmail] =useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [role, setRole] = useState({rolename:''})

    const emailHandler = (e)=>{
        setEmail(e.target.value)
    }
    const passHandler = (e)=>{
        setPassword(e.target.value)
    }
    console.log(role)
    const handleLogin = async(e)=>{
        e.preventDefault();
        try{
            const result = await axios.get("http://localhost:3000/users", {
        params: {
            email,
            password
        }
        });
        console.log(result)
        if (result.data.length > 0) {
            const user = result.data[0];
        localStorage.setItem("user", JSON.stringify(result.data[0]));
        JSON.parse(localStorage.getItem("user"));
        const email = user?.email;
        const id = user?.id;

        if(user.role !== 'student'){    
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/admin/dashboard", { state: { email: user.email, id: user.id } });
        }else{
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/dashboard", { state: { email: user.email, id: user.id } });
        }
      } else {
        alert("Invalid email or password");
      }
        }catch(err){
            console.log(err)
        }
    }
  return (
    <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10" onSubmit={(e)=>handleLogin(e)}>
      <div
        className="card shadow p-4"
        style={{ width: "420px", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-4">Login Account</h3>

        <form>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e)=>emailHandler(e)}
            />
          </div>

        
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              //placeholder="Enter password"
              value={password}
              onChange={(e)=>passHandler(e)}
              
            />
          </div>
   
          <div className="d-grid">
            <button type="submit" className="w-full bg-violet-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700 text-white font-semibold py-2 px-4 rounded-3xl align-center">
              Login
            </button>
          </div>

         
          <p className="text-center mt-3 text-muted">
            Don't have an account? <span className="text-blue-400"><NavLink to='/signup'>Sign up</NavLink></span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
