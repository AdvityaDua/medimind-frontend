import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../app/api/userApiSlice";
import { logout, selectUser } from "../app/slices/userSlice";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ CORRECT SELECTOR
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="navbar-light w-full backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              src="/logo.png"
              alt="MediMind Logo"
              className="h-10 w-10 object-contain"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            />
            <h1 className="text-2xl font-bold text-accent-light">
              MediMind
            </h1>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-primary-light font-medium items-center">
          <Link to="/" className="hover:text-accent-light transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-accent-light transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-accent-light transition">
            Contact
          </Link>

          {user ? (
            <>
            <button onClick={logoutHandler} className="btn-primary">
              Logout
            </button>
            <Link to="/dashboard" className="btn-primary w-full">
            Dashboard
          </Link>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary-light"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden navbar-light backdrop-blur-md border-t transition-all duration-300 ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 space-y-4 text-primary-light font-medium">
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>

          {user ? (
            <>
              <button
              onClick={() => {
                logoutHandler();
                setIsOpen(false);
              }}
              className="btn-primary w-full"
            >
              Logout
            </button>
            <Link to="/dashboard" className="btn-primary w-full">
              Dashboard
            </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary w-full">
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}