// PharmacyDashboardComponent.jsx
// Drop-in replacement dashboard with improved analytics graphs
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Home,
  Boxes,
  LineChart as LineIcon,
  AlertTriangle,
  LogOut,
  ReceiptText,
  DollarSign,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../app/api/userApiSlice";
import { logout } from "../app/slices/userSlice";
import { useGetOrdersQuery } from "../app/api/ordersApiSlice";
import { useGetInventoryQuery } from "../app/api/inventoryApiSlice";
import { useGetSalesQuery } from "../app/api/salesApiSlice";
import OrdersPage from "./OrdersPage";
import InventoryPage from "./InventoryPage";
import SalesPage from "./SalesPage";
import { format } from "date-fns";

/* ----------------------------
   Sidebar component
   ---------------------------- */
function Sidebar({ active, setActive, onLogout }) {
  const tabs = [
    { name: "Overview", icon: Home },
    { name: "Inventory", icon: Boxes },
    { name: "Orders", icon: ReceiptText },
    { name: "Sales", icon: DollarSign },
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
        <button className="w-full flex items-center gap-3 p-3 rounded-md text-red-600 hover:bg-red-50" onClick={onLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

/* ----------------------------
   KPI Grid
   ---------------------------- */
function KPIGrid({
  totalRevenue,
  totalOrders,
  averageOrderValue,
  totalInventoryValue,
  lowStockItemsCount,
  totalSalesRevenueFromSales,
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      <div className="dashboard-card p-6">
        <div className="text-sm text-gray-500">Total Revenue (Orders)</div>
        <div className="text-2xl font-bold mt-2">₹{totalRevenue.toFixed(2)}</div>
        <div className="text-xs text-gray-500 mt-1">From all orders</div>
      </div>

      <div className="dashboard-card p-6">
        <div className="text-sm text-gray-500">Total Orders</div>
        <div className="text-2xl font-bold mt-2">{totalOrders}</div>
        <div className="text-xs text-gray-500 mt-1">All time</div>
      </div>

      <div className="dashboard-card p-6">
        <div className="text-sm text-gray-500">Average Order Value</div>
        <div className="text-2xl font-bold mt-2">₹{averageOrderValue.toFixed(2)}</div>
        <div className="text-xs text-gray-500 mt-1">Per order</div>
      </div>

      <div className="dashboard-card p-6">
        <div className="text-sm text-gray-500">Total Inventory Value</div>
        <div className="text-2xl font-bold mt-2">₹{totalInventoryValue.toFixed(2)}</div>
        <div className="text-xs text-gray-500 mt-1">Current stock value</div>
      </div>

      <div className="dashboard-card p-6">
        <div className="text-sm text-gray-500">Low Stock Items</div>
        <div className="text-2xl font-bold mt-2">{lowStockItemsCount}</div>
        <div className="text-xs text-gray-500 mt-1">Items below threshold</div>
      </div>

      <div className="dashboard-card p-6">
        <div className="text-sm text-gray-500">Total Sales Revenue</div>
        <div className="text-2xl font-bold mt-2">₹{totalSalesRevenueFromSales.toFixed(2)}</div>
        <div className="text-xs text-gray-500 mt-1">From all sales</div>
      </div>
    </div>
  );
}

/* ----------------------------
   Weekly Sales Trend (Mon-Sun)
   ---------------------------- */
function WeeklySalesTrendCard({ weeklyTrend }) {
  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Sales Pattern</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={weeklyTrend}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ----------------------------
   Inventory Days Remaining (Bar)
   ---------------------------- */
function InventoryDaysRemainingCard({ daysRemaining }) {
  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold mb-4">Days Until Stockout</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={daysRemaining}>
          <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="days" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ----------------------------
   Expiry Timeline (Next 90 days)
   ---------------------------- */
function ExpiryTimelineCard({ expiryData }) {
  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Expiry Timeline (90 Days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={expiryData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#DC2626" fill="#FCA5A5" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ----------------------------
   Product vs Weekday Heatmap
   ---------------------------- */
function ProductWeekdayHeatmap({ heatmap }) {
  const { products, days, matrix } = heatmap;

  if (!matrix || !matrix.length || !products || !products.length) {
    return (
      <div className="dashboard-card p-6 text-center text-gray-500">
        No sales data for heatmap.
      </div>
    );
  }

  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold mb-4">Product vs Weekday Heatmap</h3>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[200px_repeat(7,1fr)] gap-2 text-xs items-center">
            <div></div>
            {days.map((d) => (
              <div key={d} className="text-center font-semibold">
                {d}
              </div>
            ))}

            {products.map((p, i) => (
              <React.Fragment key={p}>
                <div className="font-medium truncate">{p}</div>
                {matrix[i].map((val, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="h-8 rounded"
                    style={{ background: `rgba(34,197,94,${Math.min(val / 100, 1)})` }}
                    title={`${p} on ${days[j]}: ${val}`}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------
   Activity Feed
   ---------------------------- */
function ActivityFeed({ feed }) {
  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
      <ul className="space-y-2 text-sm">
        {feed.length === 0 ? (
          <li className="text-gray-500">No recent activity</li>
        ) : (
          feed.map((item, i) => (
            <li key={i} className="border-b pb-2">
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/* ----------------------------
   Top Selling Components (kept useful ones)
   ---------------------------- */
function TopSellingCard({ topProducts }) {
  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold mb-4">Top Selling Medicines</h3>
      <div className="space-y-3">
        {topProducts.map((p) => (
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

function TopSellingSalesCard({ topSellingProductsBySalesRevenue }) {
  return (
    <div className="dashboard-card p-6">
      <h3 className="text-lg font-semibold mb-4">Top Selling Products (Revenue)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={topSellingProductsBySalesRevenue}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} />
          <YAxis />
          <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ----------------------------
   Overview Page (uses all replaced components)
   ---------------------------- */
function OverviewPage({
  totalRevenue,
  totalOrders,
  weeklyTrend,
  topProductsData,
  isLoadingOrders,
  isErrorOrders,
  ordersError,
  averageOrderValue,
  totalInventoryValue,
  daysRemaining,
  expiryData,
  lowStockItemsCount,
  totalSalesRevenueFromSales,
  dailySalesTrendData, // not used but kept
  topSellingProductsBySalesRevenue,
  productWeekdayHeatmap,
  activityFeed,
}) {
  if (isLoadingOrders) return <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">Loading Overview...</div>;
  if (isErrorOrders) return <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20 text-red-600">Error loading overview: {ordersError?.message || "Unknown"}</div>;

  return (
    <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      <KPIGrid
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        averageOrderValue={averageOrderValue}
        totalInventoryValue={totalInventoryValue}
        lowStockItemsCount={lowStockItemsCount}
        totalSalesRevenueFromSales={totalSalesRevenueFromSales}
      />

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-2 grid grid-cols-1 gap-6">
          <WeeklySalesTrendCard weeklyTrend={weeklyTrend} />

          <div className="grid lg:grid-cols-2 gap-6">
            <TopSellingCard topProducts={topProductsData} />
            <TopSellingSalesCard topSellingProductsBySalesRevenue={topSellingProductsBySalesRevenue} />
          </div>
        </div>

        <div className="col-span-1 grid grid-cols-1 gap-6">
          <InventoryDaysRemainingCard daysRemaining={daysRemaining} />
          <ExpiryTimelineCard expiryData={expiryData} />
          <ActivityFeed feed={activityFeed} />
        </div>
      </div>

      <div className="mt-6">
        <ProductWeekdayHeatmap heatmap={productWeekdayHeatmap} />
      </div>
    </div>
  );
}

/* ----------------------------
   Forecast Page (unchanged simple)
   ---------------------------- */
const forecastStatic = [
  { month: "Jun", expected: 6100 },
  { month: "Jul", expected: 6800 },
  { month: "Aug", expected: 7200 },
  { month: "Sep", expected: 7500 },
  { month: "Oct", expected: 7900 },
];

function ForecastPage({ forecastData }) {
  if (!forecastData || forecastData.length === 0) {
    return (
      <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">
        <h1 className="text-2xl font-bold mb-6">Sales Forecasting</h1>
        <div className="dashboard-card p-6 text-center text-gray-500">
          Not enough sales data to generate a forecast.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">
      <h1 className="text-2xl font-bold mb-6">Sales Forecasting</h1>
      <div className="dashboard-card p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales Forecast</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={forecastData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
            <Bar dataKey="expected" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 dashboard-card p-6">
        <h3 className="text-lg font-semibold mb-3">Forecasting Insights</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>Based on historical monthly sales trends.</li>
          <li>Forecasted values indicate expected revenue for upcoming months.</li>
          <li>Monitor actual sales against forecasts to refine predictions.</li>
        </ul>
      </div>
    </div>
  );
}

/* ----------------------------
    Alerts Page
    ---------------------------- */
function AlertsPage({ alertsData }) {
  if (!alertsData || alertsData.length === 0) {
    return (
      <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">
        <h1 className="text-2xl font-bold mb-6">Alerts</h1>
        <div className="dashboard-card p-6 text-center text-gray-500">
          No active alerts at the moment. Everything looks good!
        </div>
      </div>
    );
  }

  const alertSeverityClasses = {
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    danger: "bg-red-100 text-red-800 border-red-400",
  };

  return (
    <div className="max-w-6xl mx-auto ml-72 pt-10 pb-20">
      <h1 className="text-2xl font-bold mb-6">Alerts</h1>
      <div className="grid gap-6">
        {alertsData.map((alert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`dashboard-card p-4 border-l-4 ${alertSeverityClasses[alert.severity]} flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              {alert.severity === "warning" && <AlertTriangle size={20} className="text-yellow-600" />}
              {alert.severity === "danger" && <AlertTriangle size={20} className="text-red-600" />}
              <p className="font-medium">{alert.message}</p>
            </div>
            <span className="text-sm text-gray-600">{alert.type}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------
   Main Dashboard component
   ---------------------------- */
export default function PharmacyDashboardComponent() {
  const [active, setActive] = useState("Overview");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  // API hooks
  const { data: orders = [], isLoading: isLoadingOrders, isError: isErrorOrders, error: ordersError } = useGetOrdersQuery();
  const { data: inventory = [], isLoading: isLoadingInventory, isError: isErrorInventory, error: inventoryError } = useGetInventoryQuery();
  const { data: sales = [], isLoading: isLoadingSales, isError: isErrorSales, error: salesError } = useGetSalesQuery();

  // Derived KPIs
  const totalRevenue = useMemo(() => {
    return (orders || []).reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
  }, [orders]);

  const totalOrders = orders?.length || 0;

  const averageOrderValue = useMemo(() => {
    if (!orders || orders.length === 0) return 0;
    return totalRevenue / totalOrders;
  }, [orders, totalRevenue, totalOrders]);

  const totalInventoryValue = useMemo(() => {
    return (inventory || []).reduce((sum, item) => sum + (parseFloat(item.unit_price || 0) * (parseFloat(item.quantity || 0) || 0)), 0);
  }, [inventory]);

  const lowStockItemsCount = useMemo(() => {
    const LOW_STOCK_THRESHOLD = 50; // Align with alerts threshold
    return (inventory || []).filter((item) => parseFloat(item.quantity || 0) <= LOW_STOCK_THRESHOLD).length;
  }, [inventory]);

  const totalSalesRevenueFromSales = useMemo(() => {
    return (sales || []).reduce((sum, sale) => sum + parseFloat(sale.total_amount || 0), 0);
  }, [sales]);

  // Weekly Trend (Mon-Sun) transform from sales
  const weeklyTrend = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const map = days.reduce((acc, d) => ({ ...acc, [d]: 0 }), {});

    (sales || []).forEach((sale) => {
      const d = format(new Date(sale.sale_datetime), "EEE");
      map[d] = (map[d] || 0) + parseFloat(sale.total_amount || 0);
    });

    return days.map((day) => ({ day, value: Math.round(map[day] || 0) }));
  }, [sales]);

  // Top products by quantity (for simple top list)
  const topProductsData = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    const map = {};
    orders.forEach((order) => {
      (order.items || []).forEach((it) => {
        const name = it.product_name || it.normalized_name || "Unknown";
        map[name] = (map[name] || 0) + (parseFloat(it.quantity || 0) || 0);
      });
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [orders]);

  // Top selling products by revenue from sales
  const topSellingProductsBySalesRevenue = useMemo(() => {
    const productSales = {};
    (sales || []).forEach((sale) => {
      (sale.items || []).forEach((item) => {
        const name = item.product_name || item.normalized_name || "Unknown";
        productSales[name] = (productSales[name] || 0) + (parseFloat(item.amount || 0) || 0);
      });
    });
    return Object.entries(productSales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [sales]);

  /* ----------------------------
     Inventory Days Remaining transform
     - Uses inventory.avg_daily_sales if available, otherwise fallback
     ---------------------------- */
  const daysRemaining = useMemo(() => {
    if (!inventory || inventory.length === 0) return [];
    return (inventory || [])
      .map((item) => {
        const daily = Math.max(parseFloat(item.avg_daily_sales || 1), 0.1);
        const qty = parseFloat(item.quantity || 0);
        const days = Math.round(qty / daily);
        return {
          name: item.medicine_detail?.name || item.medicine?.name || "Unknown",
          days,
        };
      })
      .sort((a, b) => a.days - b.days)
      .slice(0, 10);
  }, [inventory]);

  /* ----------------------------
     Expiry timeline (Next 90 days) - Mock Data
     ---------------------------- */
  const expiryData = useMemo(() => {
    const today = new Date();
    const mockData = [];

    for (let i = 0; i < 3; i++) { // Next 3 months
      const futureMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
      mockData.push({
        month: format(futureMonth, "MMM yyyy"),
        count: Math.floor(Math.random() * 10) + 1, // Random count between 1 and 10
      });
    }
    return mockData;
  }, []);

  /* ----------------------------
     Product x Weekday heatmap (sales source)
     ---------------------------- */
  const productWeekdayHeatmap = useMemo(() => {
    if (!sales || sales.length === 0) return { products: [], days: [], matrix: [] };

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const map = {};
    const productSet = new Set();

    (sales || []).forEach((sale) => {
      const d = format(new Date(sale.sale_datetime), "EEE");
      (sale.items || []).forEach((item) => {
        const p = item.product_name || item.normalized_name || "Unknown";
        productSet.add(p);
        map[p] = map[p] || {};
        map[p][d] = (map[p][d] || 0) + (parseFloat(item.amount || 0) || 0);
      });
    });

    // Pick top N products by total revenue
    const products = Array.from(productSet);
    const withTotals = products.map((p) => {
      const total = days.reduce((s, d) => s + (map[p]?.[d] || 0), 0);
      return { p, total };
    });
    withTotals.sort((a, b) => b.total - a.total);
    const topProducts = withTotals.slice(0, 8).map((t) => t.p);

    const matrix = topProducts.map((p) =>
      days.map((d) => {
        const val = map[p]?.[d] || 0;
        // Normalization: convert to 0-100 scale based on top value
        return Math.round(val);
      })
    );

    // Scale the matrix values to 0-100 for visualization intensity if needed
    const maxVal = Math.max(...matrix.flat(), 1);
    const scaledMatrix = matrix.map((row) => row.map((v) => Math.round((v / maxVal) * 100)));

    return { products: topProducts, days, matrix: scaledMatrix };
  }, [sales]);

  /* ----------------------------
     Mock expiry for inventory
     ---------------------------- */
  const inventoryWithMockExpiry = useMemo(() => {
    if (!inventory || inventory.length === 0) return [];
    return inventory.map(item => {
      if (item.expiry_date) {
        return item;
      }
      const now = new Date();
      const randomDays = Math.floor(Math.random() * 365) + 30; // 30 to 395 days from now
      const mockExpiry = new Date(now);
      mockExpiry.setDate(now.getDate() + randomDays);
      return { ...item, mock_expiry_date: mockExpiry.toISOString().split('T')[0] }; // YYYY-MM-DD
    });
  }, [inventory]);

  /* ----------------------------
     Sales Data with Mock Fallback
     ---------------------------- */
  const salesWithMockData = useMemo(() => {
    if (sales && sales.length >= 2) {
      return sales;
    }

    const mockSales = [];
    const endDate = new Date();
    // Generate mock data for the last 6 months
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
      const totalAmount = (Math.random() * 5000 + 1000).toFixed(2); // Random sales between 1000 and 6000
      mockSales.push({
        id: `mock-${i}`,
        sale_id: `MOCK-S-${6 - i}`,
        sale_datetime: monthDate.toISOString(),
        total_amount: totalAmount,
        source: "manual",
        items: [{
          product_name: "Mock Medicine",
          quantity: Math.floor(Math.random() * 20) + 1,
          price: (Math.random() * 50 + 10).toFixed(2),
          amount: (parseFloat(totalAmount) / 2).toFixed(2),
        }],
      });
    }
    return mockSales.reverse(); // Ensure chronological order
  }, [sales]);

  /* ----------------------------
     Sales Forecast Data (simplified linear regression)
     ---------------------------- */
  const salesForecastData = useMemo(() => {
    if (!salesWithMockData || salesWithMockData.length < 2) return []; // Need at least 2 data points for a trend

    const monthlySalesMap = {};
    salesWithMockData.forEach(sale => {
      const monthYear = format(new Date(sale.sale_datetime), "MMM yyyy");
      monthlySalesMap[monthYear] = (monthlySalesMap[monthYear] || 0) + parseFloat(sale.total_amount || 0);
    });

    const sortedMonths = Object.keys(monthlySalesMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    if (sortedMonths.length < 2) return [];

    const historicalData = sortedMonths.map(month => ({
      month,
      value: monthlySalesMap[month],
      date: new Date(month)
    }));

    // Simple linear trend: y = mx + c
    // x = index of month (0, 1, 2, ...)
    const n = historicalData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    historicalData.forEach((data, index) => {
      sumX += index;
      sumY += data.value;
      sumXY += index * data.value;
      sumX2 += index * index;
    });

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const c = (sumY - m * sumX) / n;

    const forecastMonths = 3; // Forecast for next 3 months
    const forecast = [];

    for (let i = 0; i < forecastMonths; i++) {
      const nextMonthIndex = n + i;
      const forecastedValue = Math.max(0, m * nextMonthIndex + c); // Ensure non-negative sales

      const lastHistoricalDate = historicalData[n - 1].date;
      const nextMonthDate = new Date(lastHistoricalDate.getFullYear(), lastHistoricalDate.getMonth() + 1 + i, 1);
      const nextMonthLabel = format(nextMonthDate, "MMM yyyy");

      forecast.push({
        month: nextMonthLabel,
        expected: Math.round(forecastedValue)
      });
    }

    return historicalData.map(d => ({ month: d.month, expected: Math.round(d.value) })).concat(forecast);
  }, [salesWithMockData]);

  /* ----------------------------
     Active Alerts (low quantity, nearing expiry)
     ---------------------------- */
  const activeAlerts = useMemo(() => {
    const alerts = [];

    const LOW_STOCK_THRESHOLD = 50; // Example threshold
    const EXPIRY_THRESHOLD_DAYS = 90; // Example threshold: alert if expires within 90 days

    (inventoryWithMockExpiry || []).forEach(item => {
      const itemName = item.medicine_detail?.name || item.medicine?.name || "Unknown Medicine";
      const quantity = parseFloat(item.quantity || 0);

      // Low Stock Alert
      if (quantity <= LOW_STOCK_THRESHOLD) {
        alerts.push({
          type: "Low Stock",
          message: `${itemName} is low in stock (${quantity} left).`,
          severity: "warning",
          item: itemName,
        });
      }

      // Expiry Alert (using mock_expiry_date or actual expiry_date)
      const expiryDateStr = item.mock_expiry_date || item.expiry_date;
      if (expiryDateStr) {
        const expiryDate = new Date(expiryDateStr);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0 && diffDays <= EXPIRY_THRESHOLD_DAYS) {
          alerts.push({
            type: "Expiry Warning",
            message: `${itemName} expires in ${diffDays} days (${format(expiryDate, "PPP")}).`,
            severity: "danger",
            item: itemName,
          });
        }
      }
    });

    return alerts;
  }, [inventoryWithMockExpiry]);

  /* ----------------------------
     Activity Feed
     ---------------------------- */
  const activityFeed = useMemo(() => {
    const arr = [];
    // Recent sales
    (sales || [])
      .slice(-6)
      .reverse()
      .forEach((s) => arr.push(`New sale processed: ₹${s.total_amount} — ${format(new Date(s.sale_datetime), "dd MMM yyyy")}`));

    // Inventory low and expiry
    (inventoryWithMockExpiry || []).forEach((item) => {
      const name = item.medicine_detail?.name || item.medicine?.name || "Unknown";
      const qty = parseFloat(item.quantity || 0);
      if (qty <= 10) arr.push(`Low stock: ${name} (${qty} left)`);
      const expiry = item.mock_expiry_date || item.expiry_date;
      if (expiry) {
        const diffDays = Math.round((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));
        if (diffDays > 0 && diffDays <= 15) {
          arr.push(`Expiry alert: ${name} expires in ${diffDays} days`);
        }
      }
    });

    // Deduplicate & limit
    const unique = Array.from(new Set(arr)).slice(0, 8);
    return unique;
  }, [sales, inventoryWithMockExpiry]);

  /* ----------------------------
     Mock expiry for orders
     ---------------------------- */
  const ordersWithMockExpiry = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    return orders.map(order => ({
      ...order,
      items: order.items.map(item => {
        if (item.expiry_date) {
          return item;
        }
        const orderDate = order.order_datetime ? new Date(order.order_datetime) : new Date();
        const randomDays = Math.floor(Math.random() * 166) + 15; // 15 to 180 days from now/order date
        const mockExpiry = new Date(orderDate);
        mockExpiry.setDate(orderDate.getDate() + randomDays);
        return { ...item, mock_expiry_date: mockExpiry.toISOString().split('T')[0] }; // YYYY-MM-DD
      })
    }));
  }, [orders]);

  /* ----------------------------
     Logout handler
     ---------------------------- */
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  /* ----------------------------
     Render main layout with pages
     ---------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar active={active} setActive={setActive} onLogout={logoutHandler} />
      <main className="">
        {active === "Overview" && (
          <OverviewPage
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            weeklyTrend={weeklyTrend}
            topProductsData={topProductsData}
            isLoadingOrders={isLoadingOrders}
            isErrorOrders={isErrorOrders}
            ordersError={ordersError}
            averageOrderValue={averageOrderValue}
            totalInventoryValue={totalInventoryValue}
            daysRemaining={daysRemaining}
            expiryData={expiryData}
            lowStockItemsCount={lowStockItemsCount}
            totalSalesRevenueFromSales={totalSalesRevenueFromSales}
            dailySalesTrendData={weeklyTrend}
            topSellingProductsBySalesRevenue={topSellingProductsBySalesRevenue}
            productWeekdayHeatmap={productWeekdayHeatmap}
            activityFeed={activityFeed}
          />
        )}

        {active === "Inventory" && (
          <InventoryPage
            inventoryData={inventoryWithMockExpiry}
            isLoadingInventory={isLoadingInventory}
            isErrorInventory={isErrorInventory}
            inventoryError={inventoryError}
          />
        )}

        {active === "Orders" && <OrdersPage
          ordersData={ordersWithMockExpiry}
          isLoadingOrders={isLoadingOrders}
          isErrorOrders={isErrorOrders}
          ordersError={ordersError}
        />}
        {active === "Sales" && (
          <SalesPage salesData={sales} isLoadingSales={isLoadingSales} isErrorSales={isErrorSales} salesError={salesError} />
        )}
        {active === "Forecasting" && <ForecastPage forecastData={salesForecastData} />}
        {active === "Alerts" && <AlertsPage alertsData={activeAlerts} />}
      </main>
    </div>
  );
}