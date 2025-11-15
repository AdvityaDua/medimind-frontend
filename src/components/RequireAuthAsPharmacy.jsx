import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RequireAuthAsPharmacy() {
    const user = useSelector((state) => state.user.user);
    if (!user) {
        return <Navigate to="/login" />;
    }
    if (user.is_pharmacy !== true) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}