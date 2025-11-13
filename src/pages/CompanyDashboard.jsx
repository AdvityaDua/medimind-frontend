import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Package, Users, Bell } from "lucide-react";

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white text-gray-800 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-blue-700">
          🏢 Company Dashboard
        </h1>
        <a href="/" className="text-blue-600 font-medium hover:underline">
          ← Logout
        </a>
      </header>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: Package, title: "Active Products", value: "120" },
          { icon: Users, title: "Connected Suppliers", value: "18" },
          { icon: Bell, title: "Pending Alerts", value: "4" },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center"
          >
            <item.icon size={36} className="text-blue-600 mb-2" />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
      >
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          📊 Inventory Overview
        </h2>
        <p className="text-gray-600">
          Get AI-driven insights on your stock flow, supplier engagement, and
          wastage control.
        </p>
        <div className="h-48 mt-6 flex items-center justify-center border border-dashed border-blue-300 rounded-lg text-blue-500">
          <BarChart3 className="mr-2" /> Chart Placeholder
        </div>
      </motion.section>
    </div>
  );
}
