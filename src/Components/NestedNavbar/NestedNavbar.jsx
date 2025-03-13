import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import defaultUserImage from "../../assets/images/user.jpg";
import axiosInstance from './../Axiosinstance';
import axios from "axios";

export default function NestedNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userImage, setUserImage] = useState(defaultUserImage);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthStatus = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (token) {
        setIsAuthenticated(true);
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const user = JSON.parse(userData);
            setUserImage(user?.profileImage || defaultUserImage);
          } catch (error) {
            localStorage.removeItem("user");
            setUserImage(defaultUserImage);
          }
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    updateAuthStatus();

    window.addEventListener("authChange", updateAuthStatus);
    return () => window.removeEventListener("authChange", updateAuthStatus);
  }, []);

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");
    
    if (!refresh) {
      console.error("No refresh token available");
      return;
    }
  
    try {      
      const accessToken = localStorage.getItem("token"); 
      if (!accessToken) {
        console.error("No access token available");
        return;
      }
  
      const response = await axios.post(
        "https://mostafa3mad.pythonanywhere.com/api/logout/", 
        { refresh: refresh },  
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`, 
            "Accept": "application/json", 
          }
        }
      );
  
      // Handle the response (if successful)
      console.log("Logout successful:", response.data);
      localStorage.removeItem("refresh");
      localStorage.removeItem("token");
      navigate('/login')
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
  };
  
  
  

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".dropdown")) setIsDropdownOpen(false);
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white shadow-md fixed top-0 left-0 z-50 py-4 text-center">
        Loading...
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="flex justify-between items-center py-2 px-4 md:px-8">
        <div className="text-xl md:text-2xl font-bold text-blue-700">Curai</div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        <ul className={`md:flex space-x-6 ${isMenuOpen ? "block" : "hidden"} absolute md:relative bg-white md:bg-transparent top-14 left-0 md:top-0 w-full md:w-auto shadow-md md:shadow-none z-40`}>
          <li className="text-gray-700 hover:text-blue-700 font-medium px-4 py-2 md:p-0">
            <Link to="/">Home</Link>
          </li>
          <li className="text-gray-700 hover:text-blue-700 font-medium px-4 py-2 md:p-0">
            <Link to="/SpecializationsPage">Find a doctor</Link>
          </li>
          <li className="text-gray-700 hover:text-blue-700 font-medium px-4 py-2 md:p-0">
            <Link to="/about">About</Link>
          </li>
        </ul>

        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="relative dropdown">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={userImage}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
                <span className="text-gray-700 hidden md:block">
                  Welcome back 👋
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200 rounded-t-xl"
                  >
                    Profile
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition duration-200 rounded-b-xl"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="ml-4 hidden md:block">
                <button className="border border-blue-600 text-blue-600 hover:text-white rounded-full px-4 py-1 text-sm bg-blue-100">
                  Login
                </button>
              </Link>
              <Link to="/register" className="ml-2 hidden md:block">
                <button className="bg-blue-600 text-white rounded-full px-4 py-1 text-sm hover:bg-blue-700">
                  Register
                </button>
              </Link>

              <div className="relative dropdown md:hidden">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={userImage}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200 rounded-t-xl"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200 rounded-b-xl"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
