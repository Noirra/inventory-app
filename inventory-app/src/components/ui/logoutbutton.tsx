import { logout } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirmLogout = await Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, logout",
        });

        if (confirmLogout.isConfirmed) {
            logout();
            navigate("/login");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow"
        >
            <FaSignOutAlt />
            <span>Logout</span>
        </button>
    );
};

export default LogoutButton;
