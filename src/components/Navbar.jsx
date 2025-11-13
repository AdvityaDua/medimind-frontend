import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* ✅ Logo */}
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
          MediMind
        </h1>

        {/* ✅ Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium items-center">
          <a href="/" className="hover:text-blue-600 transition">
            Home
          </a>
          <a href="/about" className="hover:text-blue-600 transition">
            About
          </a>
          <a href="/contact" className="hover:text-blue-600 transition">
            Contact
          </a>

          {/* ✅ Enhanced Login Button */}
          <a
            href="/login"
            className="px-6 py-2.5 rounded-full bg-linear-to-r from-blue-600 to-blue-700 text-white 
                       shadow-md hover:shadow-xl hover:from-blue-700 hover:to-blue-800 
                       transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Login
          </a>
        </nav>

        {/* ✅ Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ✅ Mobile Dropdown Menu with animation */}
      <div
        className={`md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 space-y-4 text-gray-700 font-medium">
          <a
            href="/"
            className="hover:text-blue-600 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="/about"
            className="hover:text-blue-600 transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a
            href="/contact"
            className="hover:text-blue-600 transition"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </a>

          {/* ✅ Elegant Mobile Login Button */}
          <a
            href="/login"
            className="block w-full text-center px-6 py-2.5 rounded-full bg-linear-to-r from-blue-600 to-blue-700 text-white 
                       shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 
                       transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
