import { logout } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import Swal from "sweetalert2";

interface LogoutButtonProps {
    sidebarOpen: boolean;
  }

const LogoutButton: React.FC<LogoutButtonProps> = ({ sidebarOpen })=> {
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
          className="w-full flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow justify-center"
        >
          <FaSignOutAlt />
          {sidebarOpen && <span className="ml-2">Logout</span>}
        </button>
    );
};

export default LogoutButton;
