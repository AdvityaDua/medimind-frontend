import React, {useEffect, useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PharmacyDashboardComponent from "./pages/PharmacyDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import LoginPage from "./pages/ChooseRole";
import SignupPage from "./pages/SignupPage";
import OrdersPage from "./pages/OrdersPage";
import SalesPage from "./pages/SalesPage";
import RequireAuthAsPharmacy from "./components/RequireAuthAsPharmacy";
import { useRefreshMutation } from "./app/api/userApiSlice";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { login, logout } from "./app/slices/userSlice";


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshToken, {isLoading: isRefreshing}] = useRefreshMutation();
  const dispatch = useDispatch();

  useEffect(()=> {
    const refresh = async () => {
      try {
        const response = await refreshToken().unwrap();
        if (response) {
          console.log("Token refreshed");
          console.log(response);
          dispatch(login({user: response.user, token: response.token}));
        }
      } catch (err) {
        console.error("Error refreshing token: ", err);
        dispatch(logout());
      } finally {
        setIsLoading(false);
      }
    }
    refresh()
  }, [])
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard"element={<RequireAuthAsPharmacy />}>
          <Route index element={<PharmacyDashboardComponent />} />
        </Route>
        <Route path="/orders" element={<RequireAuthAsPharmacy />}>
          <Route index element={<OrdersPage />} />
        </Route>
        <Route path="/sales" element={<RequireAuthAsPharmacy />}>
          <Route index element={<SalesPage />} />
        </Route>
        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/signup" element={<SignupPage />} />

      </Routes>
    </BrowserRouter>
  );
}
