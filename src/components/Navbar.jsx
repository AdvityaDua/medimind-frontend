import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar-light w-full backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* ✅ Logo with Image */}
        <motion.a
          href="/"
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src="/logo.png"
            alt="MediMind Logo"
            className="h-10 w-10 object-contain"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          />
          <h1 className="text-2xl font-bold text-accent-light tracking-tight group-hover:text-accent-light/80 transition">
            MediMind
          </h1>
        </motion.a>

        {/* ✅ Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-primary-light font-medium items-center">
          <a href="/" className="hover:text-accent-light transition">
            Home
          </a>
          <a href="/about" className="hover:text-accent-light transition">
            About
          </a>
          <a href="/contact" className="hover:text-accent-light transition">
            Contact
          </a>

          {/* ✅ Enhanced Login Button */}
          <a
            href="/login"
            className="btn-primary"
          >
            Login
          </a>
        </nav>

        {/* ✅ Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary-light focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ✅ Mobile Dropdown Menu with animation */}
      <div
        className={`md:hidden navbar-light backdrop-blur-md border-t transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{borderColor: 'var(--border-light)'}}
      >
        <nav className="flex flex-col px-6 py-4 space-y-4 text-primary-light font-medium">
          <a
            href="/"
            className="hover:text-accent-light transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>
          <a
            href="/about"
            className="hover:text-accent-light transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a
            href="/contact"
            className="hover:text-accent-light transition"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </a>

          {/* ✅ Elegant Mobile Login Button */}
          <a
            href="/login"
            className="btn-primary block w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
