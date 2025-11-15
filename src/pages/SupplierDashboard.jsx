import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Store,
  TrendingUp,
  Users,
  Bell,
  MapPin,
  Clock,
  ClipboardCheck,
  Package,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts";


// ------------------ RANDOM DATA ------------------
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const monthlySales = Array.from({ length: 6 }).map((_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
  sales: rand(3000, 9000),
}));

const topProducts = [
  { name: "Amoxicillin", value: rand(800, 1500) },
  { name: "Paracetamol", value: rand(700, 1400) },
  { name: "Aspirin", value: rand(600, 1200) },
];

const pieCategories = [
  { name: "Tablets", value: rand(20, 60) },
  { name: "Capsules", value: rand(10, 40) },
  { name: "Syrups", value: rand(5, 25) },
  { name: "Injectables", value: rand(3, 20) },
];

const heatmap = Array.from({ length: 7 }).map((_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  values: Array.from({ length: 5 }).map(() => rand(10, 100)),
}));

const colors = ["#4F46E5", "#22C55E", "#FACC15", "#EC4899"];



// ------------------ TOP NAV ------------------
function SupplierTopNav({ active, setActive }) {
  const tabs = ["Overview", "Growth", "Analytics", "Opportunities"];

  return (
    <nav className="bg-white border-b border-green-200">
      <ul className="flex gap-8 items-center max-w-7xl mx-auto px-6 py-4">
        {tabs.map((t) => (
          <li
            key={t}
            onClick={() => setActive(t)}
            className={`cursor-pointer pb-2 transition font-medium ${active === t
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-800"
              }`}
          >
            {t}
          </li>
        ))}
      </ul>
    </nav>
  );
}



// ------------------ SECTIONS ------------------

// ⭐ 1) OVERVIEW SECTION
// ⭐ 1) OVERVIEW SECTION
function OverviewSection() {
  const stats = [
    { title: "Monthly Growth", value: rand(5, 25) + "%", icon: TrendingUp },
    { title: "Total Medicines", value: rand(120, 260), icon: Bell },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white shadow rounded-xl border text-center"
            whileHover={{ scale: 1.05 }}
          >
            <item.icon className="mx-auto text-green-600 mb-2" size={36} />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts + Heatmap */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Sales Line Chart */}
        <motion.div className="p-6 bg-white rounded-xl border shadow md:col-span-2">
          <h3 className="text-lg font-semibold mb-3">📈 Monthly Sales Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlySales}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                stroke="#4F46E5"
                strokeWidth={3}
                dataKey="sales"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ⭐ NEW Heatmap UI (Like your screenshot) */}
        <div className="p-6 bg-white rounded-xl border shadow">
          <h3 className="text-lg font-semibold mb-3">📍 Regional Demand Map</h3>

          <div className="relative bg-gray-900 rounded-xl h-56 overflow-hidden border border-gray-700">

            {/* Region Outline */}
            <svg
              viewBox="0 0 300 200"
              className="absolute inset-0 w-full h-full opacity-40 stroke-gray-300"
              fill="none"
              strokeWidth="2"
            >
              <path d="M40 80 L100 40 L200 50 L260 100 L220 160 L120 170 L40 120 Z" />
            </svg>

            {/* Heat Spots (glow blobs) */}
            <div
              className="absolute rounded-full bg-red-500 opacity-40 blur-3xl"
              style={{ width: 110, height: 110, top: "55%", left: "30%" }}
            ></div>

            <div
              className="absolute rounded-full bg-red-500 opacity-40 blur-3xl"
              style={{ width: 80, height: 80, top: "45%", left: "50%" }}
            ></div>

            <div
              className="absolute rounded-full bg-red-500 opacity-40 blur-3xl"
              style={{ width: 60, height: 60, top: "65%", left: "70%" }}
            ></div>

            <div
              className="absolute rounded-full bg-red-500 opacity-40 blur-3xl"
              style={{ width: 50, height: 50, top: "30%", left: "25%" }}
            ></div>

            {/* Labels */}
            <div className="absolute text-gray-200 text-xs" style={{ top: "35%", left: "22%" }}>
              West
            </div>
            <div className="absolute text-gray-200 text-xs" style={{ top: "50%", left: "45%" }}>
              Central
            </div>
            <div className="absolute text-gray-200 text-xs" style={{ top: "40%", left: "48%" }}>
              North
            </div>
            <div className="absolute text-gray-200 text-xs" style={{ top: "65%", left: "65%" }}>
              South
            </div>
            <div className="absolute text-gray-200 text-xs" style={{ top: "50%", left: "80%" }}>
              East
            </div>
          </div>

          <p className="text-center mt-3 text-gray-600 text-sm">
            Demand intensity by region
          </p>
        </div>

      </div>
    </motion.div>
  );
}



// ⭐ 2) GROWTH SECTION
function GrowthSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Summary */}
      <div className="p-6 bg-white rounded-xl border shadow mb-6">
        <h2 className="text-xl font-semibold">📊 Growth Summary</h2>
        <p className="text-gray-600 mt-1">
          AI shows strong improvement in supply chain efficiency and partner onboarding.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Area Chart */}
        <div className="p-6 bg-white rounded-xl border shadow">
          <h3 className="text-lg font-semibold mb-3">📈 Growth Curve</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlySales}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area stroke="#16a34a" fill="#bbf7d0" strokeWidth={3} dataKey="sales" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Dual Bar Chart */}
        <div className="p-6 bg-white rounded-xl border shadow">
          <h3 className="text-lg font-semibold mb-3">🔥 Supply vs Demand</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySales}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </motion.div>
  );
}



// ⭐ 3) ANALYTICS SECTION
function AnalyticsSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Revenue", value: "$" + rand(70000, 150000) },
          { title: "Units Shipped", value: rand(5000, 12000) },
          { title: "Satisfaction Score", value: rand(80, 99) + "%" },
        ].map((item, i) => (
          <div key={i} className="p-6 bg-white rounded-xl border shadow">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="p-6 bg-white rounded-xl border shadow mb-8">
        <h3 className="text-lg font-semibold mb-3">📦 Category Split</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieCategories} dataKey="value" outerRadius={100}>
              {pieCategories.map((entry, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div className="p-6 bg-white rounded-xl border shadow mb-8">
        <h3 className="text-lg font-semibold mb-3">🔥 Monthly Demand Heatmap</h3>
        <div className="grid grid-cols-6 gap-2 text-center text-sm font-medium">
          <div></div>
          {[1, 2, 3, 4, 5].map((slot) => <div key={slot}>Slot {slot}</div>)}

          {heatmap.map((row, r) => (
            <>
              <div key={r} className="font-semibold">{row.day}</div>
              {row.values.map((v, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.15 }}
                  className="h-8 rounded"
                  style={{ background: `rgba(34,197,94, ${v / 100})` }}
                ></motion.div>
              ))}
            </>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 bg-white rounded-xl border shadow">
        <h3 className="text-lg font-semibold mb-4">📦 Recent Orders</h3>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Order ID</th>
              <th className="p-2">Pharmacy</th>
              <th className="p-2">Items</th>

            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">ORD-{rand(1000, 9999)}</td>
                <td className="p-2">Pharmacy {rand(1, 40)}</td>
                <td className="p-2">{rand(5, 40)} units</td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </motion.div>
  );
}



// ⭐ 4) OPPORTUNITIES SECTION
function OpportunitiesSection() {
  const opps = [
    "Expand distribution in Himachal & Haryana",
    "Add high-demand antibiotic combos",
    "Start express same-day delivery",
    "AI-based reorder prediction",
    "Launch subscription supply model",
    "Add 24/7 emergency inventory restock"
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      <div className="p-6 bg-white rounded-xl border shadow mb-6">
        <h2 className="text-xl font-semibold">🚀 Business Opportunities</h2>
        <p className="text-gray-600 mt-1">
          New AI insights suggest these growth opportunities for the next quarter.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {opps.map((op, i) => (
          <div key={i} className="p-6 bg-white rounded-xl border shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">📌 {op}</h3>
            <p className="text-gray-700">Growth Potential: {rand(10, 40)}%</p>
          </div>
        ))}
      </div>

    </motion.div>
  );
}



// ------------------ MAIN COMPONENT ------------------
export default function SupplierDashboard() {
  const [active, setActive] = useState("Overview");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b shadow">

        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-10 h-10 object-contain" alt="logo" />
          <h1 className="text-xl font-bold text-green-600">MediMind Supplier Dashboard</h1>
        </div>

        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Logout
        </button>
      </header>

      {/* Navigation */}
      <SupplierTopNav active={active} setActive={setActive} />

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {active === "Overview" && <OverviewSection />}
        {active === "Growth" && <GrowthSection />}
        {active === "Analytics" && <AnalyticsSection />}
        {active === "Opportunities" && <OpportunitiesSection />}
      </div>

    </div>
  );
}
