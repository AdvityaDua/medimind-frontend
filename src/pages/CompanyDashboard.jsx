// Updated React Dashboard with Sidebar, Logout at Bottom, and Red Heatmap

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Home, Boxes, LineChart as LineIcon, AlertTriangle, LogOut } from "lucide-react";

import Papa from "papaparse";

// ---------------- SAMPLE DATA ----------------
const colors = ["#16A34A", "#10B981", "#86EFAC", "#4ADE80"];

// ---------------- Sidebar ----------------
function Sidebar({ active, setActive }) {
  const tabs = [
    { name: "Overview", icon: Home },
    { name: "Inventory", icon: Boxes },
    { name: "Forecasting", icon: LineIcon },
    { name: "Alerts", icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
          <div>
            <div className="text-lg font-bold">MediMind</div>
            <div className="text-xs text-gray-500">Pharmacy</div>
          </div>
        </div>

        <nav className="space-y-2">
          {tabs.map((t) => (
            <button
              key={t.name}
              onClick={() => setActive(t.name)}
              className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition ${
                active === t.name
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <t.icon size={18} />
              <span>{t.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div>
        <button className="w-full flex items-center gap-3 p-3 rounded-md text-red-600 hover:bg-red-50">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

// ---------------- Heatmap (red, meaningful) ----------------
function HeatmapCard({ medicines, hours, matrix }) {
  return (
    <motion.div className="dashboard-card p-6">
      <div className="dashboard-card">
  <h3 className="text-lg font-semibold mb-4">Sales Heatmap</h3>

  <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 text-xs font-medium">

    <div></div>
    {hours && hours.map((h) => (
      <div key={h} className="text-center">{h}</div>
    ))}

    {matrix && matrix.map((row, rIdx) => (
      <React.Fragment key={rIdx}>
        <div className="truncate text-left font-semibold">
          {medicines && medicines[rIdx]}
        </div>

        {row && row.map((val, cIdx) => (
          <div
            key={cIdx}
            className="h-8 rounded min-w-[30px] shrink-0"
            style={{ background: `rgba(255,0,0,${val/100})` }}
            title={`${medicines && medicines[rIdx]} @ ${hours && hours[cIdx]} = ${val}`}
          />
        ))}
      </React.Fragment>
        ))}

        </div>
      </div>
    </motion.div>
  );
}

// ---------------- KPI Grid ----------------
function KPIGrid({ kpis }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="dashboard-card p-6">
        <div className="text-sm text-gray-500">Total Stock Value</div>
        <div className="text-2xl font-bold mt-2">₹{kpis.totalStockValue.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">Updated weekly</div>
      </div>

      <div className="dashboard-card p-6">
        <div className="text-sm text-gray-500">Expiry Alerts</div>
        <div className="text-2xl font-bold mt-2">{kpis.expiryAlerts}</div>
        <div className="text-xs text-gray-500 mt-1">Action required</div>
      </div>

      <div className="dashboard-card p-6">
        <div className="text-sm text-gray-500">Reorder Items</div>
        <div className="text-2xl font-bold mt-2">{kpis.reorderItems}</div>
        <div className="text-xs text-gray-500 mt-1">Reorder suggestions ready</div>
      </div>

      <div className="dashboard-card p-6">
        <div className="text-sm text-gray-500">Forecast Accuracy</div>
        <div className="text-2xl font-bold mt-2">{kpis.forecastAccuracy}%</div>
        <div className="text-xs text-gray-500 mt-1">Model v1.3</div>
      </div>
    </div>
  );
}

// ---------------- Weekly Sales ----------------
function WeeklySalesCard({ weeklySales }) {
  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold mb-4">7-Day Sales Trend</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={weeklySales}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------- Top Selling ----------------
function TopSellingCard({ topProducts }) {
  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold mb-4">Top Selling Medicines</h3>
      <div className="space-y-3">
        {topProducts && topProducts.map((p, i) => (
          <div key={p.name} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">💊</div>
              <div className="text-sm font-medium">{p.name}</div>
            </div>
            <div className="text-green-600 font-semibold">{p.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Inventory Table ----------------
function InventoryTable({ products }) {
  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold mb-4">Inventory</h3>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="pb-3">SKU</th>
              <th className="pb-3">Name</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Stock</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Expiry</th>
              <th className="pb-3">Vendor</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.medicineSKU} className="border-t" style={{ borderColor: 'var(--border-light)' }}>
                <td className="py-3">#{item.medicineSKU}</td>
                <td className="py-3">{item.productName}</td>
                <td className="py-3">{item.category}</td>
                <td className="py-3 font-semibold">{item.stockOnHand}</td>
                <td className="py-3">₹{item.price.toFixed(2)}</td>
                <td className="py-3">{item.expiry}</td>
                <td className="py-3">{item.vendor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- Pages ----------------
function OverviewPage({ kpis, weeklySales, topProducts, categoryPie, heatmapMedicines, heatmapHours, heatmapMatrix, recentActivity }) {
  return (
    <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <KPIGrid kpis={kpis} />

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <WeeklySalesCard weeklySales={weeklySales} />
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <TopSellingCard topProducts={topProducts} />
            <div className="dashboard-card p-6">
              <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryPie} dataKey="value" nameKey="name" outerRadius={70} label>
                    {categoryPie && categoryPie.map((entry, idx) => (
                      <Cell key={idx} fill={colors[idx % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <HeatmapCard medicines={heatmapMedicines} hours={heatmapHours} matrix={heatmapMatrix} />
          <div className="mt-6">
            <div className="dashboard-card p-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                {recentActivity && recentActivity.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryPage({ products, handleCSVUpload }) {
  return (
    <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>

      {/* CSV Upload Section */}
      <div className="dashboard-card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">Upload Inventory CSV</h3>

        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="border p-2 rounded w-full cursor-pointer"
        />

        <p className="text-sm text-gray-500 mt-2">
          Upload a CSV with columns: <b>Medicine SKU, Product Name, Category, Stock on Hand, Price, Expiry, Vendor</b>
        </p>
      </div>

      {/* Inventory Table */}
      <div className="dashboard-card p-6">
        <h3 className="text-lg font-semibold mb-4">Inventory</h3>

        {products.length === 0 ? (
          <p className="text-gray-500 text-sm">No inventory uploaded yet.</p>
        ) : (
          <InventoryTable products={products} />
        )}
      </div>
    </div>
  );
}

function ForecastPage({ forecast }) {
  return (
    <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">
      <h1 className="text-2xl font-bold mb-6">Forecasting</h1>
      <div className="dashboard-card p-6">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={forecast}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expected" fill="#059669" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------------- App ----------------
export default function CompanyDashboard() {
  const [active, setActive] = useState("Overview");
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  // Effect to save products to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data.map((row) => ({
          medicineSKU: row["Medicine SKU"],
          productName: row["Product Name"],
          category: row.Category,
          stockOnHand: Number(row["Stock on Hand"]),
          price: Number(row.Price),
          expiry: row.Expiry, // Assuming YYYY-MM-DD format
          vendor: row.Vendor,
        })).filter(product => product.medicineSKU && product.productName); // Filter out rows with missing key data

        setProducts(parsedData);
      },
    });
  };

  const deriveKPIs = (products) => {
    if (products.length === 0) {
      return {
        totalStockValue: 0,
        expiryAlerts: 0,
        reorderItems: 0,
        forecastAccuracy: 0, // Placeholder
      };
    }

    const totalStockValue = products.reduce((sum, item) => sum + (item.stockOnHand * item.price), 0);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiryAlerts = products.filter(item => {
      const expiryDate = new Date(item.expiry);
      return expiryDate < thirtyDaysFromNow && expiryDate > new Date();
    }).length;

    const REORDER_THRESHOLD = 100; // Example threshold
    const reorderItems = products.filter(item => item.stockOnHand < REORDER_THRESHOLD).length;

    // Forecast accuracy is difficult to derive without historical sales data.
    // Keeping it as a placeholder or a very simple metric for now.
    const forecastAccuracy = 90; // Placeholder percentage

    return {
      totalStockValue,
      expiryAlerts,
      reorderItems,
      forecastAccuracy,
    };
  };

  const deriveWeeklySales = (products) => {
    if (products.length === 0) return [];

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    // Simple derivation: distribute total stock value (or a portion) across days
    const totalValue = products.reduce((sum, item) => sum + (item.stockOnHand * item.price), 0);
    const dailyBaseSales = totalValue / 50; // Arbitrary divisor to get reasonable daily figures

    return days.map(day => ({
      day,
      value: Math.round(dailyBaseSales * (1 + Math.random() * 0.5)), // Add some randomness
    }));
  };

  const deriveTopProducts = (products) => {
    if (products.length === 0) return [];
    // Sort by stock on hand for simplicity, assuming higher stock implies higher importance/sales
    return [...products]
      .sort((a, b) => b.stockOnHand - a.stockOnHand)
      .slice(0, 3)
      .map(p => ({ name: p.productName, value: p.stockOnHand }));
  };

  const deriveCategoryDistribution = (products) => {
    if (products.length === 0) return [];
    const categoryCounts = products.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  };

  const deriveForecast = (products) => {
    if (products.length === 0) return [];

    const weeks = Array.from({ length: 8 }, (_, i) => `Week ${i + 1}`); // Forecast for next 8 weeks
    const totalCurrentStockValue = products.reduce((sum, item) => sum + (item.stockOnHand * item.price), 0);

    // Simple weekly forecast: assume a base consumption/sale and a slight growth/decline trend
    const baseWeeklyConsumption = totalCurrentStockValue / 100; // Arbitrary divisor

    return weeks.map((week, i) => {
      const trendFactor = 1 + (i - 4) * 0.02; // Slight increase towards middle, then slight decrease
      return {
        week,
        expected: Math.round(baseWeeklyConsumption * trendFactor * (1 + Math.random() * 0.1)), // Add some randomness
      };
    });
  };

  const deriveHeatmapData = (products) => {
    if (products.length === 0) {
      return { medicines: [], hours: [], matrix: [] };
    }

    const medicines = products.slice(0, 6).map(p => p.productName.split(' ')[0]); // Use short names
    const hours = ["7-11", "8-11", "9-11", "10-11", "11-11"];

    const matrix = medicines.map(() =>
      Array.from({ length: hours.length }).map(() => Math.floor(Math.random() * 90) + 10) // Random sales intensity
    );
    return { medicines, hours, matrix };
  };

  const deriveRecentActivity = (products) => {
    if (products.length === 0) return [];

    const activities = [];
    products.slice(0,3).forEach(product => {
      activities.push(`Stock updated: ${product.productName}`);
      if (product.expiry && new Date(product.expiry) < new Date(new Date().setDate(new Date().getDate() + 15))) { // Expiring soon
        activities.push(`Expiry warning: ${product.productName} expires soon`);
      }
    });
    return activities.slice(0,3);
  };


  const kpis = deriveKPIs(products);
  const weeklySales = deriveWeeklySales(products);
  const topProducts = deriveTopProducts(products);
  const categoryPie = deriveCategoryDistribution(products);
  const forecast = deriveForecast(products);
  const { medicines: heatmapMedicines, hours: heatmapHours, matrix: heatmapMatrix } = deriveHeatmapData(products);
  const recentActivity = deriveRecentActivity(products);


  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar active={active} setActive={setActive} />
      <main className="">
        {active === "Overview" && <OverviewPage kpis={kpis} weeklySales={weeklySales} topProducts={topProducts} categoryPie={categoryPie} heatmapMedicines={heatmapMedicines} heatmapHours={heatmapHours} heatmapMatrix={heatmapMatrix} recentActivity={recentActivity} />}
        {active === "Inventory" && <InventoryPage products={products} handleCSVUpload={handleCSVUpload} />}
        {active === "Forecasting" && <ForecastPage forecast={forecast} />}
        {active === "Alerts" && <AlertsPage products={products} />}
      </main>
    </div>
  );
}

function AlertsPage({ products }) {
  const [userCreatedAlerts, setUserCreatedAlerts] = useState(() => {
    const savedUserAlerts = localStorage.getItem("userCreatedAlerts");
    return savedUserAlerts ? JSON.parse(savedUserAlerts) : [];
  });
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [newAlertMessage, setNewAlertMessage] = useState("");
  const [newAlertType, setNewAlertType] = useState("Low Stock");
  const [editingAlert, setEditingAlert] = useState(null);

  const LOW_STOCK_THRESHOLD = 100; // Define low stock threshold
  const EXPIRY_WARNING_DAYS = 30; // Define expiry warning days

  useEffect(() => {
    localStorage.setItem("userCreatedAlerts", JSON.stringify(userCreatedAlerts));
  }, [userCreatedAlerts]);

  useEffect(() => {
    const generatedAlerts = [];
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + EXPIRY_WARNING_DAYS);

    products.forEach(product => {
      // Check for low stock
      if (product.stockOnHand <= LOW_STOCK_THRESHOLD) {
        generatedAlerts.push({
          id: `lowstock-${product.medicineSKU}`,
          message: `${product.productName}: Low stock (${product.stockOnHand} units remaining). Order more soon!`,
          type: "Low Stock",
          date: today.toISOString().split('T')[0],
          isSystem: true,
        });
      }

      // Check for expiry warning
      if (product.expiry) {
        const expiryDate = new Date(product.expiry);
        if (expiryDate < thirtyDaysFromNow && expiryDate > today) {
          generatedAlerts.push({
            id: `expiry-${product.medicineSKU}`,
            message: `${product.productName}: Expires on ${product.expiry} (${Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))} days left).`,
            type: "Expiry Warning",
            date: today.toISOString().split('T')[0],
            isSystem: true,
          });
        }
      }
    });
    setSystemAlerts(generatedAlerts);
  }, [products]); // Re-run when products change

  const allAlerts = [...systemAlerts, ...userCreatedAlerts].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddAlert = () => {
    if (newAlertMessage.trim() === "") return;
    const newAlert = {
      id: userCreatedAlerts.length > 0 ? Math.max(...userCreatedAlerts.map(a => a.id)) + 1 : 1,
      message: newAlertMessage,
      type: newAlertType,
      date: new Date().toISOString().split('T')[0],
      isSystem: false,
    };
    setUserCreatedAlerts([...userCreatedAlerts, newAlert]);
    setNewAlertMessage("");
    setNewAlertType("Low Stock");
  };

  const handleEditAlert = (alert) => {
    if (alert.isSystem) return; // Cannot edit system alerts
    setEditingAlert(alert);
    setNewAlertMessage(alert.message);
    setNewAlertType(alert.type);
  };

  const handleUpdateAlert = () => {
    setUserCreatedAlerts(userCreatedAlerts.map(a => a.id === editingAlert.id ? { ...a, message: newAlertMessage, type: newAlertType } : a));
    setEditingAlert(null);
    setNewAlertMessage("");
    setNewAlertType("Low Stock");
  };

  const handleDeleteAlert = (id, isSystem) => {
    if (isSystem) return; // Cannot delete system alerts
    setUserCreatedAlerts(userCreatedAlerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">
      <h1 className="text-2xl font-bold mb-6">Alerts</h1>

      {/* Add/Edit Alert Form */}
      <div className="dashboard-card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">{editingAlert ? "Edit User Alert" : "Add New Alert"}</h3>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Alert message"
            value={newAlertMessage}
            onChange={(e) => setNewAlertMessage(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <select
            value={newAlertType}
            onChange={(e) => setNewAlertType(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="Low Stock">Low Stock</option>
            <option value="Expiry Warning">Expiry Warning</option>
            <option value="System Notification">System Notification</option>
            <option value="Other">Other</option>
          </select>
          {editingAlert ? (
            <button onClick={handleUpdateAlert} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Update Alert
            </button>
          ) : (
            <button onClick={handleAddAlert} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
              Add Alert
            </button>
          )}
           {editingAlert && (
            <button onClick={() => { setEditingAlert(null); setNewAlertMessage(""); setNewAlertType("Low Stock"); }} className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400">
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="dashboard-card p-6">
        <h3 className="text-lg font-semibold mb-4">Current Alerts</h3>
        {allAlerts.length === 0 ? (
          <p className="text-gray-500 text-sm">No alerts to display.</p>
        ) : (
          <ul className="space-y-4">
            {allAlerts.map((alert) => (
              <li key={alert.id} className={`border p-4 rounded-md flex justify-between items-center ${
                alert.type === "Low Stock" || alert.type === "Expiry Warning" ? "bg-red-50" : "bg-gray-50"
              }`}>
                <div>
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-gray-500">Type: {alert.type} | Date: {alert.date}</p>
                </div>
                {!alert.isSystem && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditAlert(alert)} className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDeleteAlert(alert.id, alert.isSystem)} className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
