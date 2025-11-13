import React from "react";
import Navbar from "../components/Navbar";
import HeaderSection from "../components/Header";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* ✅ Global Navbar */}
      <Navbar />

      {/* ✅ Hero / Header Section */}
      <HeaderSection />

      {/* ✅ Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center mt-10">
        <h3 className="text-3xl font-bold mb-12 text-blue-700">
          Why Choose MediMind?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "📦 Real-time Inventory",
              desc: "Track stock levels, expiry alerts, and reorder needs instantly.",
            },
            {
              title: "🤖 AI Forecasting",
              desc: "Predict accurate demand using machine learning.",
            },
            {
              title: "♻️ Waste Reduction",
              desc: "Reduce expired medicines with automated alerts.",
            },
            {
              title: "📊 Smart Analytics",
              desc: "Monitor supply trends with detailed dashboards.",
            },
            {
              title: "🤝 Supplier Collaboration",
              desc: "Seamless communication between pharmacies & suppliers.",
            },
            {
              title: "⚡ Instant Alerts",
              desc: "Low stock, expiry, and demand fluctuation notifications.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
            >
              <h4 className="text-xl font-semibold mb-2 text-blue-600">
                {item.title}
              </h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Testimonials Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h3 className="text-3xl font-bold mb-12 text-blue-700">
          Loved by Pharmacies & Suppliers
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              user: "Dr. Andrew",
              text: "MediMind reduced our waste by 40% in 3 months!",
            },
            {
              user: "City Pharmacy",
              text: "The AI forecasting is incredibly accurate. We never overstock now.",
            },
            {
              user: "HealthSupply Co.",
              text: "Seamless communication with pharmacies. Our best tool so far.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition"
            >
              <p className="text-gray-600 italic">“{t.text}”</p>
              <h4 className="mt-4 font-semibold text-blue-600">{t.user}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Global Footer */}
      <Footer />
    </div>
  );
}
