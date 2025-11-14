import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Building2 } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="page-container flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 70, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-88 h-88 bg-purple-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, -45, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"
          animate={{
            rotate: 360,
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-56 h-56 bg-cyan-400/8 rounded-full blur-2xl"
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-card/70 backdrop-blur-xl border border-border/80 rounded-2xl shadow-xl p-10 relative z-10"
      >
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center mb-2">
          <span className="text-primary">Create Account</span>
        </h2>
        <p className="text-center text-foreground/70 mb-8">
          Sign up to start using MediMind
        </p>

        {/* Form */}
        <form className="grid gap-6">
          {/* Full Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Full Name</label>
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-foreground/50"
                size={20}
              />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-foreground/50"
                size={20}
              />
              <input
                type="email"
                className="input-field pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-foreground/50"
                size={20}
              />
              <input
                type="password"
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-foreground/50"
                size={20}
              />
              <input
                type="password"
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block mb-1 text-sm font-medium">Sign Up As</label>
            <div className="relative">
              <Building2
                className="absolute left-3 top-3 text-foreground/50"
                size={22}
              />
              <select className="w-full p-3 pl-10 border border-border bg-input rounded-md focus:ring-2 focus:ring-primary/60 outline-none transition">
                <option value="company">Company</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>
          </div>

          {/* Signup Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary w-full"
          >
            Sign Up
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <span className="flex-1 border-t border-border"></span>
          <span className="px-3 text-foreground/60 text-sm">or</span>
          <span className="flex-1 border-t border-border"></span>
        </div>

        {/* Login Redirect */}
        <p className="text-center text-sm text-foreground/80">
          Already have an account?{" "}
          <a href="/login" className="text-primary font-medium hover:underline">
            Login here
          </a>
        </p>

        {/* Back to Home */}
        <p className="text-center mt-4 text-sm">
          <a href="/" className="text-primary hover:underline">
            ← Back to Home
          </a>
        </p>
      </motion.div>
    </div>
  );
}
