    import React, { useState } from 'react';

export default function NestedNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState("Guest");
  const [userImage, setUserImage] = useState(defaultUserImage);
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
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange")); // 🔥 تحديث الـ Navbar تلقائيًا
    navigate("/");
  };

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50 mb-5">
        <div className="flex justify-between items-center py-2 px-4 md:px-8">
            {/* Logo */}
            <div className="text-xl md:text-2xl font-bold text-blue-700">
            Curai
            </div>

            {/* Hamburger Menu for Small Screens */}
            <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-gray-700 focus:outline-none"
            >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            </button>

            {/* Links for Desktop */}
            <ul className="hidden md:flex space-x-4 md:space-x-8">
            <li className="text-gray-700 hover:text-blue-700 text-sm md:text-base">
                <a href="#">Home</a>
            </li>
            <li className="text-gray-700 hover:text-blue-700 text-sm md:text-base">
                <a href="#">Find a doctor</a>
            </li>
            <li className="text-gray-700 hover:text-blue-700 text-sm md:text-base">
                <a href="#">About</a>
            </li>
            </ul>

            {/* Buttons for Desktop */}
            <div className="hidden md:flex space-x-2 md:space-x-4">
            <button className="border border-blue-600 text-blue-600 hover:text-white rounded-full px-3 md:px-4 py-1 text-sm bg-blue-100">
                Login
            </button>
            <button className="bg-blue-600 text-white rounded-full px-3 md:px-4 py-1 text-sm hover:bg-blue-700">
                Register
            </button>
            </div>
        </div>

        {/* Dropdown Menu for Mobile */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
            <ul className="space-y-2 px-4 py-2 bg-gray-50 border-t border-gray-200">
            <li>
                <a href="#" className="block text-gray-700 hover:text-blue-700">
                Home
                </a>
            </li>
            <li>
                <a href="#" className="block text-gray-700 hover:text-blue-700">
                Find a doctor
                </a>
            </li>
            <li>
                <a href="#" className="block text-gray-700 hover:text-blue-700">
                About
                </a>
            </li>
            <li>
                <button className="w-full text-left border border-blue-600 text-blue-600 rounded-full px-4 py-1 text-sm hover:bg-blue-100">
                Login
                </button>
            </li>
            <li>
                <button className="w-full text-left bg-blue-600 text-white rounded-full px-4 py-1 text-sm hover:bg-blue-700">
                Register
                </button>
            </li>
            </ul>
        </div>
        </nav>
    );
    }
