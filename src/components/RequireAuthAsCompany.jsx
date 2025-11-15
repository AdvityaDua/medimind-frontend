import { Outlet } from "react-router-dom";

export default function RequireAuthAsCompany() {
    const { user } = useAuth();
    if (user?.is_company !== true) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}