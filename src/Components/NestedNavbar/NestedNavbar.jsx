import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiGift } from "react-icons/fi";
import defaultUserImage from "../../assets/images/user.jpg";
import axios from "axios";

export default function NestedNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userImage, setUserImage] = useState(defaultUserImage);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [bonusPoints, setBonusPoints] = useState(0);
  const navigate = useNavigate();

  const updateAuthStatus = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get("https://mostafa3mad.pythonanywhere.com/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        const profileImage = user?.profile_picture || defaultUserImage;
        const name = user?.first_name || user?.username || "User";
        const points = user?.bonus_points || 0;

        setIsAuthenticated(true);
        setUserImage(profileImage);
        setUserName(name);
        setBonusPoints(points);

        localStorage.setItem("user", JSON.stringify({
          ...user,
          profileImage: profileImage,
          bonusPoints: points,
        }));
      } catch (err) {
        console.error("Error fetching profile:", err);
        setIsAuthenticated(false);
        setUserImage(defaultUserImage);
        setUserName("");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
      }
    } else {
      setIsAuthenticated(false);
      setUserImage(defaultUserImage);
      setUserName("");
    }
    setLoading(false);
  };

  // Set up automatic bonus points update
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated) {
        updateBonusPoints(); // تحديث النقاط فقط وليس جميع البيانات
      }
    }, 10000); // التحديث كل 10 ثواني

    return () => clearInterval(interval); // تنظيف الـ interval عند فك التفاعل
  }, [isAuthenticated]);

  // تحديث النقاط فقط
  const updateBonusPoints = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("https://mostafa3mad.pythonanywhere.com/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const points = response.data?.bonus_points || 0;
      setBonusPoints(points);  // تحديث النقاط فقط
    } catch (err) {
      console.error("Error fetching bonus points:", err);
    }
  };

  useEffect(() => {
    updateAuthStatus();
    window.addEventListener("authChange", updateAuthStatus);
    return () => window.removeEventListener("authChange", updateAuthStatus);
  }, []);

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return;

    try {
      const accessToken = localStorage.getItem("token");
      await axios.post("https://mostafa3mad.pythonanywhere.com/api/logout/", { refresh }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }

    localStorage.clear();
    setIsAuthenticated(false);
    setUserImage(defaultUserImage);
    setUserName("");
    navigate("/login");
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
        <div className="text-xl md:text-2xl font-bold text-blue-700">
          <Link to="/">Curai</Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {isAuthenticated && (
          <ul className={`md:flex space-x-6 ${isMenuOpen ? "block" : "hidden"} absolute md:relative bg-white md:bg-transparent top-14 left-0 md:top-0 w-full md:w-auto shadow-md md:shadow-none z-40`}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold px-4 py-2 md:p-0" : "text-gray-700 hover:text-blue-700 font-medium px-4 py-2 md:p-0"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/SpecializationsPage"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold px-4 py-2 md:p-0" : "text-gray-700 hover:text-blue-700 font-medium px-4 py-2 md:p-0"
                }
              >
                Find a doctor
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold px-4 py-2 md:p-0" : "text-gray-700 hover:text-blue-700 font-medium px-4 py-2 md:p-0"
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Contact"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold px-4 py-2 md:p-0" : "text-gray-700 hover:text-blue-700 font-medium px-4 py-2 md:p-0"
                }
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/panel"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold px-4 py-2 md:p-0" : "text-gray-700 hover:text-blue-700 font-medium px-4 py-2 md:p-0"
                }
              >
                Dashboard
              </NavLink>
            </li>
          </ul>
        )}

        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="relative dropdown">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <Link to="/Bounce">
                    <FiGift className="text-green-500 text-3xl" />
                  </Link>
                  {bonusPoints > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm font-semibold px-1.5 py-0.5 rounded-full leading-none">
                      {bonusPoints}
                    </span>
                  )}
                </div>

                <img
                  src={userImage}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
                
                <span className="text-gray-700 hidden md:block">
                  Welcome, {userName} 👋
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2">
                  <Link to="/profile" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200 rounded-b-xl">
                    Profile
                  </Link>
                  <Link to={'/Payment'} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200 rounded-b-xl">
                    Payment
                  </Link>
                  <button onClick={handleLogout} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200 rounded-b-xl w-full text-left">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 transition duration-300 rounded-full">
                Login
              </Link>
              <span>|</span>
              <Link to="/register" className="bg-gray-100 hover:bg-gray-200 text-blue-700 border border-blue-600 px-4 py-1 rounded-full transition duration-300">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
