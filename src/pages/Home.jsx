import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, BookOpen, Users } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-violet-600 p-2 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
            Project ERP
          </span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-gray-800">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
              Manage Your College <br />
              <span className="text-violet-600 dark:text-violet-400 inline-block mt-2">
                With Excellence
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Streamline administration, enhance student learning, and empower teachers with our all-in-one educational resource planning platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/signup">
              <Button size="lg" className="h-12 px-8 text-lg bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-500/20 transition-all hover:scale-105">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700">
                Member Login
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 text-left">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Student Management</h3>
              <p className="text-gray-600 dark:text-gray-400">Efficiently track attendance, grades, and student progress in one place.</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Academic Planning</h3>
              <p className="text-gray-600 dark:text-gray-400">Organize curriculum, schedules, and examinations with ease.</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <div className="bg-pink-100 dark:bg-pink-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Result Processing</h3>
              <p className="text-gray-600 dark:text-gray-400">Automated result generation and performance analytics for students.</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        © 2024 Project ERP. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
