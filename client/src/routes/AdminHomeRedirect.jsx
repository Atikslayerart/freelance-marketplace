import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminHomeRedirect({ children }) {
    const { user, isAuthenticated } = useAuth();

    if (
        isAuthenticated &&
        user?.role === "admin"
    ) {
        return (
            <Navigate
                to="/admin/dashboard"
                replace
            />
        );
    }

    return children;
}

export default AdminHomeRedirect;