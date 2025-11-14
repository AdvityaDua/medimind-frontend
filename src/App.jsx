import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompanyDashboard from "./pages/CompanyDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import LoginPage from "./pages/ChooseRole";
import SignupPage from "./pages/SignupPage"; // NEW

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard"element={<CompanyDashboard />} />
        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/signup" element={<SignupPage />} />

      </Routes>
    </BrowserRouter>
  );
}
