import React from "react";
import { motion } from "framer-motion";
import { Truck, Store, TrendingUp, ClipboardCheck } from "lucide-react";

export default function SupplierDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-white text-gray-800 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-indigo-700">
          🧑‍🔧 Supplier Dashboard
        </h1>
        <a href="/" className="text-indigo-600 font-medium hover:underline">
          ← Logout
        </a>
      </header>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: Truck, title: "Active Deliveries", value: "24" },
          { icon: Store, title: "Partner Pharmacies", value: "35" },
          { icon: TrendingUp, title: "Monthly Growth", value: "12%" },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col items-center"
          >
            <item.icon size={36} className="text-indigo-600 mb-2" />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-2xl font-bold text-indigo-700 mt-1">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Orders Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
      >
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
          📦 Recent Orders
        </h2>
        <div className="h-48 mt-6 flex items-center justify-center border border-dashed border-indigo-300 rounded-lg text-indigo-500">
          <ClipboardCheck className="mr-2" /> Orders Table Placeholder
        </div>
      </motion.section>
    </div>
  );
}
