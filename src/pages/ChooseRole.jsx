import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "pharmacy",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://medimin-backend.vercel.app/users/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Save token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        // Redirect based on role
        if (data.user.role === "pharmacy") navigate("/company-dashboard");
        else if (data.user.role === "supplier") navigate("/supplier-dashboard");
        else navigate("/");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-card/70 backdrop-blur-xl border border-border/80 rounded-2xl shadow-xl p-10 relative z-10"
      >
        <h2 className="text-4xl font-bold text-center mb-2">
          <span className="text-primary">Welcome Back</span>
        </h2>
        <p className="text-center text-foreground/70 mb-8">
          Login to access your MediMind dashboard
        </p>

        <form onSubmit={handleSubmit} className="grid gap-6">
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 pl-10 border border-border bg-input rounded-md focus:ring-2 focus:ring-primary/60 outline-none transition"
                placeholder="you@example.com"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 pl-10 border border-border bg-input rounded-md focus:ring-2 focus:ring-primary/60 outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Select Role
            </label>
            <div className="relative">
              <UserCircle
                className="absolute left-3 top-3 text-foreground/50"
                size={22}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-border bg-input rounded-md focus:ring-2 focus:ring-primary/60 outline-none transition"
              >
                <option value="pharmacy">Pharmacy</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-md text-lg font-medium hover:bg-primary/80 transition shadow-lg shadow-primary/20 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <span className="flex-1 border-t border-border"></span>
          <span className="px-3 text-foreground/60 text-sm">or</span>
          <span className="flex-1 border-t border-border"></span>
        </div>

        {/* Sign Up Redirect */}
        <p className="text-center text-sm text-foreground/80">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:underline"
          >
            Create one
          </Link>
        </p>

        {/* Back to Home */}
        <p className="text-center mt-4 text-sm">
          <Link to="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}