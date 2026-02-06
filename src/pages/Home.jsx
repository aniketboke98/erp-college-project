import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, BookOpen, Users, Award, Shield, CheckCircle, BarChart } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-violet-100 selection:text-violet-900">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-violet-600 p-1.5 rounded-lg text-white">
              <GraduationCap size={20} />
            </div>
            <span className="text-lg font-bold text-gray-900">Project ERP</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-violet-600 hover:bg-violet-50">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 shadow-lg shadow-violet-500/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        
        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-gradient-to-r from-violet-100/50 to-fuchsia-100/50 blur-3xl -z-10 rounded-full opacity-70" />
          
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-sm font-medium border border-violet-100 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              New: Advanced Result Processing
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Manage Your Campus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                With Confidence
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The all-in-one platform to streamline administration, empower students, and simplify academic management.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="h-14 px-8 text-lg bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-xl shadow-violet-500/20 transition-transform hover:scale-105">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-full text-gray-700">
                  View Demo
                </Button>
              </Link>
            </div>

            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 mt-12">
               <div>
                  <h4 className="text-3xl font-bold text-gray-900">500+</h4>
                  <p className="text-sm text-gray-500 mt-1">Colleges Trusted</p>
               </div>
               <div>
                  <h4 className="text-3xl font-bold text-gray-900">1M+</h4>
                  <p className="text-sm text-gray-500 mt-1">Students Active</p>
               </div>
               <div>
                  <h4 className="text-3xl font-bold text-gray-900">99%</h4>
                  <p className="text-sm text-gray-500 mt-1">Uptime SLA</p>
               </div>
               <div>
                  <h4 className="text-3xl font-bold text-gray-900">24/7</h4>
                  <p className="text-sm text-gray-500 mt-1">Support Team</p>
               </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to run your institute</h2>
              <p className="text-gray-600">Powerful features designed for modern educational institutions, available right out of the box.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-6 h-6 text-blue-600" />,
                  bg: "bg-blue-100",
                  title: "Student Management",
                  desc: "Comprehensive profiles, attendance tracking, and performance analytics for every student."
                },
                {
                  icon: <BookOpen className="w-6 h-6 text-purple-600" />,
                  bg: "bg-purple-100",
                  title: "Course Planning",
                  desc: "Effortlessly manage curriculum, assign teachers, and schedule classes without conflicts."
                },
                {
                  icon: <Award className="w-6 h-6 text-pink-600" />,
                  bg: "bg-pink-100",
                  title: "Exam & Results",
                  desc: "Automated exam form processing, hall ticket generation, and result publication."
                },
                {
                   icon: <Shield className="w-6 h-6 text-emerald-600" />,
                   bg: "bg-emerald-100",
                   title: "Secure Data",
                   desc: "Enterprise-grade security with role-based access control to keep sensitive data safe."
                },
                {
                   icon: <BarChart className="w-6 h-6 text-orange-600" />,
                   bg: "bg-orange-100",
                   title: "Insightful Reports",
                   desc: "Get real-time insights into institutional performance with visual dashboards."
                },
                {
                   icon: <CheckCircle className="w-6 h-6 text-cyan-600" />,
                   bg: "bg-cyan-100",
                   title: "Fee Management",
                   desc: "Streamlined fee collection, invoice generation, and financial reporting."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`${feature.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 text-center">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-12 md:p-20 text-white shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                
                <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to transform your campus?</h2>
                <p className="text-violet-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">Join thousands of institutions using Project ERP to deliver world-class education.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                    <Link to="/signup">
                        <Button size="lg" className="bg-white text-violet-700 hover:bg-gray-100 h-14 px-8 rounded-full text-lg font-semibold border-0">
                            Get Started Now
                        </Button>
                    </Link>
                </div>
            </div>
        </section>

      </main>
      
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
                <div className="bg-white/10 p-2 rounded-lg text-white">
                    <GraduationCap size={20} />
                </div>
                <span className="text-xl font-bold">Project ERP</span>
            </div>
            
            <div className="flex gap-8 text-gray-400 text-sm">
                <Link to="#" className="hover:text-white transition-colors">Features</Link>
                <Link to="#" className="hover:text-white transition-colors">Pricing</Link>
                <Link to="#" className="hover:text-white transition-colors">Support</Link>
                <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            </div>

            <div className="text-gray-500 text-sm">
                © 2024 Project ERP. All rights reserved.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
