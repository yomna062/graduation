    import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

    export default function NestedNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [navBg, setNavBg] = useState('bg-white');

    useEffect(() => {
        const handleScroll = () => {
        setNavBg(window.scrollY > 50 ? 'bg-blue-100 shadow-lg' : 'bg-white');
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = () => setIsOpen(false);

    return (
        <nav className={`${navBg} fixed w-full top-0 left-0 z-50 mb-5 transition-colors duration-300`}>
        <div className="flex justify-between items-center py-2 px-4 md:px-8 relative">
            
            {/* Logo */}
            <div className="text-xl md:text-2xl font-bold text-blue-700">
            Curai
            </div>

            {/* Hamburger Menu for Small Screens */}
            <button 
            onClick={() => setIsOpen(!isOpen)} 
            aria-expanded={isOpen} 
            aria-label="Toggle navigation menu" 
            className="md:hidden text-gray-700 focus:outline-none"
            >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            </button>

            {/* Links for Desktop (Centered) */}
            <ul className="hidden md:flex space-x-4 md:space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <li className="text-gray-700 hover:text-blue-700 text-sm md:text-base">
                <a href="#" onClick={handleLinkClick}>Home</a>
            </li>
            <li className="text-gray-700 hover:text-blue-700 text-sm md:text-base">
                <a href="#" onClick={handleLinkClick}>Find a doctor</a>
            </li>
            <li className="text-gray-700 hover:text-blue-700 text-sm md:text-base">
                <a href="#" onClick={handleLinkClick}>About</a>
            </li>
            </ul>

            {/* Buttons for Desktop */}
            <div className="hidden md:flex space-x-2 md:space-x-4">
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full px-3 md:px-4 py-1 text-sm transition duration-300">
                Login
            </button>
            <button className="bg-blue-600 text-white rounded-full px-3 md:px-4 py-1 text-sm hover:bg-blue-700 transition duration-300">
                Register
            </button>
            </div>
        </div>

        {/* Dropdown Menu for Mobile */}
        <div className={`${isOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden transition-all duration-300 md:hidden`}>
            <ul className="space-y-2 px-4 py-2 bg-gray-50 border-t border-gray-200">
            <li>
                <a href="#" onClick={handleLinkClick} className="block text-gray-700 hover:text-blue-700">
                Home
                </a>
            </li>
            <li>
                <a href="#" onClick={handleLinkClick} className="block text-gray-700 hover:text-blue-700">
                Find a doctor
                </a>
            </li>
            <li>
                <a href="#" onClick={handleLinkClick} className="block text-gray-700 hover:text-blue-700">
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
