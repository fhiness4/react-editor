import React, { useState ,useEffect, useRef } from 'react';
import { Code, Mail, Calendar, Database, ArrowRight, Edit3, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import {formatDate} from "./utils/date"
import Navbar from './codeEditor/components/navbar'
  import toast from "react-hot-toast";
  
  
const DevioDashboard = () => {
  const {addcodes, user, data, logout, getuser, uploadimg, codefiles} = useAuthStore();
  // const [user, setuser]= useState(
  //       {
  //   name: "finesse",
  //   email: "ajjsjjsjsjs",
  //   createdAt: "January 15, 2024",
    
  //   }
  //   )
  const [userData, setuserdata]= useState([])
  // get html
    async function gethtml() {
      const response = await
      fetch(`https://auth-dusky-rho.vercel.app/api/code/getuser-html?codeid=${user._id}`,{
      method: "GET",
        mode: "cors",
        headers:{
                "content-Type": "application/json"
            }
      });
      const res = await response.json();
      if(res.success){
        addcodes(res)
        toast.success("successfully fetched codes!")
        setuserdata(res.data)
      }else{
        toast.error("fetching data failed")
      }
      
  }
  useEffect(() => {
    gethtml();
  }, []);
  
  
  
  // const userData = {
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   createdAt: "January 15, 2024",
  //   storedCodes: 24,
  //   recentCodes: [
  //     { id: 1, name: "E-commerce Cart.js", language: "JavaScript", date: "2 hours ago" },
  //     { id: 2, name: "API Routes.js", language: "Node.js", date: "Yesterday" },
  //     { id: 3, name: "Login Component.tsx", language: "TypeScript", date: "3 days ago" }
  //   ]
  // };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 overflow-hidden">
          <Navbar 
      userImage={user.profilepic}
      logout={logout}
      data={data}
      uploadimg={uploadimg}/>


      {/* Main Content - Scrollable with x hidden */}
      <main className="h-[calc(100vh-73px)] overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 py-8 pb-12">
          {/* Welcome Message with Editor Button - Pop animation */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pop">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {user.name}! 👋
              </h3>
              <p className="text-gray-400">Here's your coding activity overview</p>
            </div>
            
            {/* Editor Button - Pulse animation on hover */}
            <Link
              to='/editor'
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 group shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-105 active:scale-95"
            >
              <Edit3 size={20} className="animate-bounce-slow" />
              <span className="font-medium">Open Code Editor</span>
              <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* User Info Cards - Staggered pop animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Name Card */}
            <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-700 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6 hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 group">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Code size={20} className="text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-300">Full Name</h3>
              </div>
              <p className="text-xl font-bold text-white">{user.name}</p>
            </div>

            {/* Email Card - Delayed animation */}
            <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-700 delay-100 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6 hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 group">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail size={20} className="text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-300">Email</h3>
              </div>
              <p className="text-lg font-medium text-gray-200 break-all">{user.email}</p>
            </div>

            {/* Member Since Card - More delayed animation */}
            <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-700 delay-200 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6 hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 group">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar size={20} className="text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-300">Member Since</h3>
              </div>
              <p className="text-xl font-bold
              text-white">{formatDate(user.createdAt)}</p>
            </div>
          </div>

          {/* Stored Codes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Code Statistics - Scroll animation */}
            <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-700 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center animate-pulse-slow">
                    <Database size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Stored Codes</h3>
                    <p className="text-sm text-gray-400">Total snippets saved</p>
                  </div>
                </div>
                <span className="text-4xl font-bold text-blue-400
                animate-countUp">{userData.length}</span>
              </div>
              
              {/* Progress Bar with animation */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Storage used</span>
                  <span>{Math.min(userData.length, 100)}/100 codes</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full animate-growWidth" 
                    style={{ width: `${Math.min((userData.length / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats with staggered animations */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="scroll-animate delay-200 bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition-colors duration-300">
                  <p className="text-xs text-gray-400">HTML/CSS</p>
                  <p className="text-lg font-semibold
                  text-white">{userData.length}</p>
                </div>
                                <div className="scroll-animate delay-200 bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition-colors duration-300">
                  <p className="text-xs text-gray-400">JAVASCRIPT</p>
                  <p className="text-lg font-semibold
                  text-white">{userData.length}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions - Scroll animation */}
            <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-700 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              {/* Secondary Editor Link with hover animation */}
              <Link
                to="/editor" 
                className="block w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-xl p-4 mb-4 transition-all duration-300 border border-blue-600/20 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Edit3 size={20} className="animate-pulse-slow" />
                    <span className="font-medium">Open Editor</span>
                  </div>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Recent Codes with staggered animations */}
              <div>
                <h4 className="font-medium text-gray-300 mb-3">Recent Codes</h4>
                
                <div className="space-y-2">
                  {codefiles.map((code, index) => (
                    <div 
                      key={index} 
                      className="scroll-animate opacity-0 translate-y-10 transition-all duration-700"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center group-hover:scale-110 group-hover:bg-gray-600 transition-all duration-300">
                            <Code size={14} className="text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{code.name}</p>
                            <p className="text-xs text-gray-500">
                            • {formatDate(code.createdAt)}</p>
                          </div>
                        </div>
                        <Link
                        to="./editor"
                        className="text-blue-400 text-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Open
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* Footer with fade in animation */}
          <div className="mt-8 text-center border-t border-gray-800 pt-6 scroll-animate opacity-0 transition-all duration-700">
            <p className="text-xs text-gray-600 hover:text-gray-500
            transition-colors">DEVIO Code Editor © 2026</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DevioDashboard;