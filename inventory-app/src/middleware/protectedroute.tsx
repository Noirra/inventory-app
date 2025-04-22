import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const token = localStorage.getItem("token");
    const roles: string[] = JSON.parse(localStorage.getItem("roles") || "[]");

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && !roles.includes(requiredRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
