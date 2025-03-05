    import React, { useState } from 'react';
import { Link } from 'react-router-dom';

    export default function NestedNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50 mb-5">
        <div className="flex justify-between items-center py-2 px-4 md:px-8">
            {/* Logo */}
            <div className="text-xl md:text-2xl font-bold text-blue-700 cursor-pointer">
            <Link to={'/'}>Curai</Link>
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
                <a href="/">Home</a>
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
            <Link to={'/login'} className="border border-blue-600 text-blue-600 hover:text-white transition duration-200 rounded-full px-3 md:px-4 py-1 text-sm bg-blue-100">
                Login
            </Link>
            <Link to={'/Register'} className="bg-blue-600 text-white rounded-full px-3 md:px-4 py-1 text-sm hover:bg-blue-700 transition duration-200">
                Register
            </Link>
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
                <Link to={'/login'} className="w-full text-left border border-blue-600 text-blue-600 rounded-full px-4 py-1 text-sm hover:bg-blue-100">
                Login
                </Link >
            </li>
            <li>
                <Link to={'/Register'} className="w-full text-left bg-blue-600 text-white rounded-full px-4 py-1 text-sm hover:bg-blue-700">
                Register
                </Link >
            </li>
            </ul>
        </div>
        </nav>
    );
    }
