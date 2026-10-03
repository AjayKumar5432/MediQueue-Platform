import { Navigate } from "react-router-dom";
import { getRole, getToken } from "../utils/session";

function ProtectedRoute({ children, allowedRoles }) {

    const token = getToken();
    const role = getRole();

    // User not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // User logged in but doesn't have permission
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    // User has permission
    return children;
}

export default ProtectedRoute;