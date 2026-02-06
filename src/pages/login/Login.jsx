import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, LogIn } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "../../../node_modules/react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await axios.get("https://erp-college-project.onrender.com/users", {
        params: {
          email,
          password,
        },
      });

      if (result.data.length > 0) {
        const user = result.data[0];
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login Successful!");

        setTimeout(() => {
          if (user.role === "admin" || user.role === "teacher") {
            navigate("/admin/dashboard", {
              state: { email: user.email, id: user.id },
            });
          } else {
            navigate("/dashboard", {
              state: { email: user.email, id: user.id },
            });
          }
        }, 1000);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-violet-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-violet-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Don't have an account?{" "}
              <NavLink
                to="/signup"
                className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 transition-colors"
              >
                Create account
              </NavLink>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
