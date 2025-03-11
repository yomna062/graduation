import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultUserImage from "../../assets/images/user.jpg"; // صورة افتراضية

export default function NestedNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState("Guest");
  const [userImage, setUserImage] = useState(defaultUserImage);
  const [isOpen, setIsOpen] = useState(false); // للتحكم في القائمة المتنقلة
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthStatus = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);

      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUsername(user?.username || "Guest");
          setUserImage(user?.profileImage || defaultUserImage);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUsername("Guest");
          setUserImage(defaultUserImage);
        }
      } else {
        setUsername("Guest");
        setUserImage(defaultUserImage);
      }
    };

    updateAuthStatus();
    window.addEventListener("authChange", updateAuthStatus);
    return () => window.removeEventListener("authChange", updateAuthStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    window.dispatchEvent(new Event("authChange")); // 🔥 تحديث الـ Navbar تلقائيًا
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="flex justify-between items-center py-2 px-4 md:px-8">
        
        {/* شعار Curai */}
        <div className="text-xl md:text-2xl font-bold text-blue-700">
          <Link to="/">Curai</Link>
        </div>

        {/* روابط المنتصف */}
        <ul className="hidden md:flex space-x-6">
          <li className="text-gray-700 hover:text-blue-700 font-medium">
            <Link to="/">Home</Link>
          </li>
          <li className="text-gray-700 hover:text-blue-700 font-medium">
            <Link to="/find-doctor">Find a doctor</Link>
          </li>
          <li className="text-gray-700 hover:text-blue-700 font-medium">
            <Link to="/about">About</Link>
          </li>
          <li className="text-gray-700 hover:text-blue-700 font-medium">
            <Link to="/Contact">Contact</Link>
          </li>
        </ul>

        {/* المستخدم */}
        <div className="flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 font-medium">Welcome, {username}</span>
              <img 
                src={userImage} 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white rounded-full px-4 py-1 text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="border border-blue-600 text-blue-600 hover:text-white rounded-full px-4 py-1 text-sm bg-blue-100 hidden md:block transition duration-200">
                  Login
                </button>
              </Link>
              <Link to="/register" className="bg-blue-600 text-white rounded-full px-4 py-1 text-sm hover:bg-blue-700 hidden md:block transition duration-200">
              Register
              </Link>
            </>
          )}
        </div>

        {/* زر القائمة للهواتف */}
        <button className="md:hidden text-gray-700 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {/* قائمة الجوال */}
        <div className={`${isOpen ? "block" : "hidden"} md:hidden absolute top-12 right-0 bg-white shadow-md rounded-md py-2 w-40`}>
          <ul>
            <li><Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Home</Link></li>
            <li><Link to="/find-doctor" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Find a doctor</Link></li>
            <li><Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">About</Link></li>
            {!isAuthenticated ? (
              <>
                <li><Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link></li>
                <li><Link to="/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Register</Link></li>
              </>
            ) : (
              <li><button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
