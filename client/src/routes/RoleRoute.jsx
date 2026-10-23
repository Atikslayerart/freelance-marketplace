import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleDashboards = {
    client: "/client/dashboard",
    freelancer: "/freelancer/dashboard",
    admin: "/admin/dashboard",
};

function RoleRoute({ allowedRoles }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    const userRole = user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
        const fallbackPath = roleDashboards[userRole] || "/";

        return <Navigate to={fallbackPath} replace />;
    }

    return <Outlet />;
}

export default RoleRoute;