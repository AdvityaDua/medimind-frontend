import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem, cardHover, graphAnimation, numberCounter, fadeInUp } from "../utils/animations";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Box,
  PackagePlus,
  Clock,
  Bell,
  Archive,
  TrendingUp,
} from "lucide-react";

/*
  Single-file React app with 3 pages (Overview, Inventory, Forecasting)
  Theme: Green (MediMind style)
  Charts: Recharts

  Paste this file into your React project (e.g. src/App.jsx)
  Ensure TailwindCSS, framer-motion, lucide-react and recharts are installed:

  npm install recharts framer-motion lucide-react
*/

// ---------------- SAMPLE DATA ----------------
const kpis = {
  totalStockValue: 45230,
  expiryAlerts: 3,
  reorderItems: 12,
  forecastAccuracy: 94,
};

const weeklySales = [
  { day: "Mon", value: 1200 },
  { day: "Tue", value: 1350 },
  { day: "Wed", value: 1500 },
  { day: "Thu", value: 1650 },
  { day: "Fri", value: 1800 },
  { day: "Sat", value: 1950 },
  { day: "Sun", value: 2100 },
];

const topProducts = [
  { name: "Amoxicillin 500mg", value: 1245 },
  { name: "Paracetamol 500mg", value: 1089 },
  { name: "Aspirin 100mg", value: 876 },
];

const inventory = Array.from({ length: 8 }).map((_, i) => ({
  id: 1000 + i,
  name: [
    "Amoxicillin 500mg",
    "Paracetamol 500mg",
    "Aspirin 100mg",
    "Cetrizine 10mg",
    "Metformin 500mg",
    "Omeprazole 20mg",
    "Ibuprofen 200mg",
    "Vitamin C 500mg",
  ][i],
  category: ["Antibiotics", "Analgesic", "Analgesic", "Antihistamine", "Anti-diabetic", "Gastro", "Analgesic", "Supplements"][i],
  stock: [1245, 1089, 876, 420, 320, 500, 760, 980][i],
  status: ["In Stock", "Low", "Low", "In Stock", "Low", "In Stock", "In Stock", "In Stock"][i],
}));

const forecast = [
  { month: "Jun", expected: 6100 },
  { month: "Jul", expected: 6800 },
  { month: "Aug", expected: 7200 },
  { month: "Sep", expected: 7500 },
  { month: "Oct", expected: 7900 },
];

const categoryPie = [
  { name: "Tablets", value: 45 },
  { name: "Capsules", value: 25 },
  { name: "Syrups", value: 20 },
  { name: "Injectables", value: 10 },
];

const colors = ["#16A34A", "#10B981", "#86EFAC", "#4ADE80"];

// ---------------- Components ----------------
function TopNav({ active, setActive }) {
  const tabs = ["Overview", "Inventory", "Forecasting", "Alerts"];
  return (
    <nav className="border-b p-4 rounded-t-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'var(--border-light)', backdropFilter: 'blur(10px)'}}>
      <ul className="flex gap-6 items-end max-w-7xl mx-auto">
        {tabs.map((t) => (
          <li
            key={t}
            onClick={() => setActive(t)}
            className={`cursor-pointer pb-2 ${
              active === t
                ? "text-accent-light border-b-2 font-semibold"
                : "text-gray-600"
            }`}
            style={active === t ? {borderColor: 'var(--text-accent)'} : {}}
          >
            {t}
          </li>
        ))}
        <div className="ml-auto text-sm text-gray-500">MediMind Pharmacy</div>
      </ul>
    </nav>
  );
}

function KPIGrid() {
  const kpiCards = [
    { 
      label: "Total Stock Value", 
      value: `$${kpis.totalStockValue.toLocaleString()}`, 
      change: "+8.5%", 
      icon: PackagePlus, 
      bgColor: "bg-green-50", 
      iconColor: "text-green-600",
      valueColor: "text-green-800"
    },
    { 
      label: "Expiry Alerts", 
      value: kpis.expiryAlerts, 
      change: "-2", 
      icon: Clock, 
      bgColor: "bg-red-50", 
      iconColor: "text-red-400",
      valueColor: "text-gray-800"
    },
    { 
      label: "Reorder Items", 
      value: kpis.reorderItems, 
      change: "+3", 
      icon: Archive, 
      bgColor: "bg-indigo-50", 
      iconColor: "text-indigo-500",
      valueColor: "text-gray-800"
    },
    { 
      label: "Forecast Accuracy", 
      value: `${kpis.forecastAccuracy}%`, 
      change: "+2.1%", 
      icon: TrendingUp, 
      bgColor: "bg-purple-50", 
      iconColor: "text-purple-500",
      valueColor: "text-gray-800"
    },
  ];

  return (
    <motion.div 
      className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {kpiCards.map((kpi, i) => (
        <motion.div
          key={i}
          className="dashboard-card"
          variants={staggerItem}
          {...cardHover}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <motion.div 
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                {kpi.label}
              </motion.div>
              <motion.div 
                className={`text-2xl font-bold mt-2 ${kpi.valueColor}`}
                variants={numberCounter}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                {kpi.value}
              </motion.div>
              <motion.div 
                className="text-xs text-green-500 mt-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.4 }}
              >
                {kpi.change}
              </motion.div>
            </div>
            <motion.div 
              className={`${kpi.bgColor} p-3 rounded-lg`}
              initial={{ opacity: 0, rotate: -180, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.5, type: "spring", stiffness: 200 }}
            >
              <kpi.icon className={kpi.iconColor} />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function WeeklySalesCard() {
  return (
    <motion.div 
      className="dashboard-card"
      variants={graphAnimation}
      initial="initial"
      animate="animate"
    >
      <motion.h3 
        className="text-lg font-semibold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        7-Day Sales Trend
      </motion.h3>
      <div className="space-y-3">
        {weeklySales.map((row, i) => (
          <motion.div 
            key={row.day} 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className="w-14 text-sm text-gray-600">{row.day}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
              <motion.div 
                className="absolute left-0 top-0 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                initial={{ width: 0 }}
                animate={{ width: `${(row.value / 2100) * 100}%` }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <motion.div 
              className="w-20 text-right font-semibold text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              ${row.value}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TopSellingCard() {
  return (
    <motion.div 
      className="dashboard-card"
      variants={graphAnimation}
      initial="initial"
      animate="animate"
    >
      <motion.h3 
        className="text-lg font-semibold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Top Selling Medicines
      </motion.h3>
      <div className="space-y-3">
        {topProducts.map((p, i) => (
          <motion.div 
            key={p.name} 
            className="flex items-center justify-between bg-green-50/40 p-3 rounded-lg"
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, x: 5 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.15, type: "spring" }}
              >
                💊
              </motion.div>
              <div className="text-sm font-medium">{p.name}</div>
            </div>
            <motion.div 
              className="text-green-600 font-semibold"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
            >
              {p.value}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function HeatmapCard() {
  // Simple CSS-grid based heatmap using sample matrix
  const matrix = [
    [10, 30, 60, 90, 40],
    [20, 40, 80, 60, 30],
    [50, 70, 30, 20, 90],
    [40, 60, 90, 50, 30],
    [20, 80, 40, 60, 70],
    [60, 20, 30, 80, 50],
    [70, 40, 20, 60, 90],
  ];

  return (
    <motion.div 
      className="dashboard-card"
      variants={graphAnimation}
      initial="initial"
      animate="animate"
    >
      <motion.h3 
        className="text-lg font-semibold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Sales Heatmap
      </motion.h3>
      <div className="grid grid-cols-6 gap-2 text-sm text-center font-medium">
        <div></div>
        {[1, 2, 3, 4, 5].map((s) => (
          <motion.div 
            key={s}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + s * 0.05 }}
          >
            Slot {s}
          </motion.div>
        ))}

        {matrix.map((row, rIdx) => (
          <React.Fragment key={rIdx}>
            <motion.div 
              className="font-semibold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + rIdx * 0.1 }}
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][rIdx]}
            </motion.div>
            {row.map((val, cIdx) => (
              <motion.div 
                key={cIdx} 
                className="h-8 rounded"
                style={{ background: `rgba(16, 185, 129, ${val / 100})` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.5 + rIdx * 0.1 + cIdx * 0.05,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}

function RecentActivity() {
  const items = [
    { icon: "📊", text: "Stock updated: Amoxicillin 500mg", time: "2 hours ago" },
    { icon: "⏰", text: "Expiry warning: Paracetamol expires in 5 days", time: "1 hour ago" },
    { icon: "📦", text: "Reorder placed: Aspirin 100 tablets", time: "30 mins ago" },
    { icon: "🤖", text: "Forecast updated: Next week demand prediction", time: "10 mins ago" },
  ];

  return (
    <motion.div 
      className="dashboard-card mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <motion.h3 
        className="text-lg font-semibold text-gray-800 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Recent Activity
      </motion.h3>
      <div className="space-y-4">
        {items.map((it, idx) => (
          <motion.div 
            key={idx} 
            className="flex items-start gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + idx * 0.1 }}
            whileHover={{ x: 5 }}
          >
            <motion.div 
              className="text-2xl"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.9 + idx * 0.1, type: "spring" }}
            >
              {it.icon}
            </motion.div>
            <div className="flex-1">
              <div className="text-sm text-gray-800">{it.text}</div>
              <div className="text-xs text-gray-400">{it.time}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------- Pages ----------------
function OverviewPage() {
  return (
    <div className="max-w-7xl mx-auto mt-6">
      <KPIGrid />

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="col-span-1">
          <WeeklySalesCard />
        </div>
        <div className="col-span-1">
          <TopSellingCard />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <HeatmapCard />
        <motion.div 
          className="dashboard-card"
          variants={graphAnimation}
          initial="initial"
          animate="animate"
        >
          <motion.h3 
            className="text-lg font-semibold text-gray-800 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Category Distribution
          </motion.h3>
          <motion.div 
            style={{ width: "100%", height: 260 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryPie} dataKey="value" nameKey="name" outerRadius={80} label>
                  {categoryPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
          <RecentActivity />
        </motion.div>
      </div>
    </div>
  );
}

function InventoryPage() {
  return (
    <div className="max-w-7xl mx-auto mt-6 space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold">Inventory Summary</h3>
          <div className="mt-4 text-sm text-gray-600">Total SKUs: {inventory.length}</div>
          <div className="mt-2 text-sm text-gray-600">Low Stock: {inventory.filter(i => i.status === 'Low').length}</div>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={inventory.map(i => ({ name: i.name.split(' ')[0], stock: i.stock }))}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Products</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} className="border-t" style={{borderColor: 'var(--border-light)'}}>
                    <td className="py-3">#{item.id}</td>
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">{item.category}</td>
                    <td className="py-3 font-semibold">{item.stock}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${item.status === 'Low' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold">Suppliers</h3>
          <div className="mt-4 text-sm text-gray-600">Connected: 35</div>
          <div className="mt-2 text-sm text-gray-600">Active Contracts: 12</div>
        </div>

        <div className="col-span-2 dashboard-card">
          <h3 className="text-lg font-semibold">Stock Movements (Last 7 days)</h3>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklySales}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForecastPage() {
  return (
    <div className="max-w-7xl mx-auto mt-6 space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold">Forecast Summary</h3>
          <div className="mt-4 text-sm text-gray-600">Next month demand: 7,200 units</div>
          <div className="mt-2 text-sm text-gray-600">Model confidence: 92%</div>

          <div className="mt-6">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={forecast}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="expected" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 dashboard-card">
          <h3 className="text-lg font-semibold">Performance Radar</h3>
          <div style={{ width: "100%", height: 260 }} className="mt-4">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart outerRadius={90} data={[{ metric: "Timeliness", A: 90 }, { metric: "Quality", A: 80 }, { metric: "Cost", A: 70 }, { metric: "Communication", A: 85 }, { metric: "Reliability", A: 88 }]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Supplier" dataKey="A" stroke="#16A34A" fill="#16A34A" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold">AI Insight</h4>
            <p className="text-sm text-gray-600 mt-2">Next week forecast suggests increasing Amoxicillin order by 18% due to regional flu uptick.</p>
          </div>
        </div>
      </div>

      <RecentActivity />
    </div>
  );
}

// ---------------- App ----------------
export default function App() {
  const [active, setActive] = useState("Overview");

  return (
    <div className="dashboard-container relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-20 w-96 h-96 bg-blue-400/8 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-400/8 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-400/6 rounded-full blur-3xl"
          animate={{
            rotate: 360,
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex items-center justify-between mb-4">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src="/logo.png"
              alt="MediMind Logo"
              className="h-12 w-12 object-contain"
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <div>
              <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>MediMind</span>
                <span className="text-sm font-normal text-gray-500">Pharmacy</span>
              </div>
              <div className="text-xs text-gray-500">Pharmacy Manager</div>
            </div>
          </motion.div>
          <div className="text-sm text-accent-light font-medium cursor-pointer hover:underline">Logout</div>
        </header>

        <TopNav active={active} setActive={setActive} />

        <main>
          {active === "Overview" && <OverviewPage />}
          {active === "Inventory" && <InventoryPage />}
          {active === "Forecasting" && <ForecastPage />}
          {active === "Alerts" && (
            <div className="max-w-7xl mx-auto mt-6">
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold">Alerts</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <div className="text-sm font-medium">Expiry warning: Paracetamol expires in 5 days</div>
                      <div className="text-xs text-gray-400">1 hour ago</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="text-2xl">📦</div>
                    <div>
                      <div className="text-sm font-medium">Reorder placed: Aspirin 100 tablets</div>
                      <div className="text-xs text-gray-400">30 mins ago</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
